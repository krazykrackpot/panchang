/**
 * Life-stage-conditioned Mahadasha lord advice.
 *
 * 9 planets × 3 dignity levels × 6 life stages = 162 unique entries.
 * Each entry is 3-4 sentences of actionable, astrologically grounded counsel
 * adapted to where the native is in life.
 *
 * Dignity levels:
 *   strong  — exalted, own sign, or friendly sign with good shadbala
 *   neutral — neutral dignity
 *   weak    — debilitated, enemy sign, combust, or low shadbala
 *
 * Life stages (from life-stage.ts):
 *   student (<22), early_career (22-30), householder (30-45),
 *   established (45-58), elder (58-70), sage (70+)
 */

import type { LifeStage } from '@/lib/kundali/life-stage';

export type DignityLevel = 'strong' | 'neutral' | 'weak';

export const DASHA_STAGE_ADVICE: Record<
  string,
  Record<DignityLevel, Record<LifeStage, { en: string; hi: string }>>
> = {
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // SUN — authority, father, government, self-confidence, soul purpose
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  Sun: {
    strong: {
      student: {
        en: 'A dignified Sun Mahadasha in your formative years ignites natural leadership. Step into student government, debate, or competitive academics — positions of visibility suit you now. Your father or a father-figure mentor will open doors. Do not shy from the spotlight; it is where your soul learns to stand.',
        hi: 'आपके निर्माण-काल में बलवान सूर्य महादशा प्राकृतिक नेतृत्व जगाती है। छात्र संघ, वाद-विवाद या प्रतियोगी शिक्षा में आगे आएँ — प्रमुखता आपको शोभती है। पिता या गुरुतुल्य व्यक्ति मार्ग खोलेंगे। मंच से न भागें; यहीं आत्मा खड़ा होना सीखती है।',
      },
      early_career: {
        en: 'Sun Mahadasha with strength accelerates your rise in government, administration, or any leadership-oriented field. Seek roles where you represent an institution rather than merely serve it. Authority figures recognize your capacity — accept responsibility boldly. This period establishes the professional identity you will carry for decades.',
        hi: 'बलवान सूर्य महादशा सरकारी, प्रशासनिक या नेतृत्व-केन्द्रित क्षेत्र में उन्नति तेज करती है। ऐसी भूमिकाएँ चुनें जहाँ आप संस्था का प्रतिनिधित्व करें, केवल सेवा नहीं। अधिकारी आपकी क्षमता पहचानते हैं — उत्तरदायित्व निर्भय स्वीकारें। यह काल दशकों तक चलने वाली पहचान स्थापित करता है।',
      },
      householder: {
        en: 'This is your Sun at full blaze — promotions, public recognition, and government favor flow naturally. Use this period to secure positions of lasting authority, not just salary hikes. Your children will mirror your confidence; be the example you want them to follow. Health of the heart and eyes remains strong, but do not mistake vitality for invincibility.',
        hi: 'यह आपका सूर्य पूर्ण तेज पर है — पदोन्नति, सार्वजनिक मान्यता और शासकीय कृपा स्वाभाविक बहती है। स्थायी अधिकार के पद सुरक्षित करें, केवल वेतन वृद्धि नहीं। सन्तान आपका आत्मविश्वास प्रतिबिम्बित करेगी; वह उदाहरण बनें जो आप चाहते हैं। हृदय और नेत्र स्वास्थ्य बलवान है, पर जीवनशक्ति को अमरत्व न समझें।',
      },
      established: {
        en: 'A strong Sun now crowns decades of effort with recognition and institutional respect. This is the time to chair boards, lead philanthropic bodies, or advise government. Your reputation precedes you — let it work for legacy, not vanity. Father-related matters resolve positively; honor him through your conduct.',
        hi: 'बलवान सूर्य अब दशकों के प्रयास को मान्यता और संस्थागत सम्मान से पुरस्कृत करता है। अब बोर्ड की अध्यक्षता, परोपकारी संस्थाओं का नेतृत्व या शासन को सलाह का समय है। प्रतिष्ठा आपसे पहले पहुँचती है — इसे विरासत के लिए प्रयोग करें, अहंकार के लिए नहीं। पिता-सम्बन्धी विषय सकारात्मक सुलझते हैं।',
      },
      elder: {
        en: 'The Sun dignified in your elder years sustains vitality beyond what age alone would allow. You become a beacon for your community — wisdom backed by lived authority. Accept ceremonial roles, inaugurations, and mentorship positions that honor your journey. Your bones and heart carry Sun energy; walk daily and keep that fire lit.',
        hi: 'वृद्धावस्था में गरिमामय सूर्य आयु से परे जीवनशक्ति बनाए रखता है। आप समुदाय के लिए प्रकाशस्तम्भ बनते हैं — जीवन-अनुभव से पुष्ट ज्ञान। सम्मान-पद, उद्घाटन और मार्गदर्शक भूमिकाएँ स्वीकारें जो आपकी यात्रा का सम्मान करें। हड्डियाँ और हृदय सूर्य ऊर्जा वहन करते हैं — प्रतिदिन चलें और यह अग्नि प्रज्वलित रखें।',
      },
      sage: {
        en: 'Sun Mahadasha in the sage phase is rare and luminous — your soul purpose reaches its clearest expression. Spiritual authority, not worldly power, is now your domain. Sunrise meditation and Surya Namaskar align your remaining years with dharma. You radiate simply by being present; let others come to your warmth.',
        hi: 'संन्यास अवस्था में सूर्य महादशा दुर्लभ और दीप्तिमान है — आत्मा का उद्देश्य सबसे स्पष्ट अभिव्यक्ति पाता है। आध्यात्मिक अधिकार, लौकिक सत्ता नहीं, अब आपका क्षेत्र है। सूर्योदय ध्यान और सूर्य नमस्कार शेष वर्षों को धर्म से जोड़ते हैं। आप केवल उपस्थिति से प्रकाशित करते हैं; दूसरों को आपकी ऊष्मा में आने दें।',
      },
    },
    neutral: {
      student: {
        en: 'Sun Mahadasha at neutral dignity gives you ambition without guaranteed backing. You must earn your authority through visible performance — academic medals, leadership in projects, tangible proof of capability. Your father supports you but cannot hand you success. Build your own stage; the Sun responds to those who dare to stand on it.',
        hi: 'तटस्थ गरिमा पर सूर्य महादशा महत्वाकांक्षा देती है पर गारंटीशुदा समर्थन नहीं। दृश्य प्रदर्शन से अधिकार अर्जित करें — शैक्षिक पदक, परियोजनाओं में नेतृत्व, क्षमता का ठोस प्रमाण। पिता समर्थन करते हैं पर सफलता नहीं दे सकते। अपना मंच स्वयं बनाएँ; सूर्य उन्हें उत्तर देता है जो खड़ा होने का साहस करते हैं।',
      },
      early_career: {
        en: 'A neutral Sun gives moderate career traction — you will neither rocket to the top nor stagnate. Focus on building credibility through consistency rather than dramatic wins. Government or institutional roles are possible but require persistence. Watch for ego conflicts with supervisors; diplomacy is your ally when the Sun lacks full strength.',
        hi: 'तटस्थ सूर्य मध्यम कैरियर गति देता है — न शिखर पर उड़ान, न ठहराव। नाटकीय जीत की बजाय निरन्तरता से विश्वसनीयता बनाएँ। सरकारी या संस्थागत भूमिकाएँ सम्भव हैं पर धैर्य चाहिए। वरिष्ठों से अहं-संघर्ष से बचें; जब सूर्य पूर्ण बलवान न हो तो कूटनीति आपकी मित्र है।',
      },
      householder: {
        en: 'The neutral Sun sustains your position without dramatic elevation. Protect what you have built — do not gamble on risky power plays. Your relationship with your father may carry unresolved tension; address it consciously. Professional recognition comes, but you must campaign for it rather than expect it to arrive unbidden.',
        hi: 'तटस्थ सूर्य आपकी स्थिति बनाए रखता है पर नाटकीय उन्नति नहीं। जो बनाया है उसकी रक्षा करें — जोखिमपूर्ण सत्ता-खेल से बचें। पिता से सम्बन्ध में अनसुलझा तनाव हो सकता है; सचेत रूप से सम्बोधित करें। पेशेवर मान्यता आती है, पर आपको उसके लिए प्रयास करना होगा।',
      },
      established: {
        en: 'Neutral Sun at this stage means your reputation is solid but not legendary. You receive respect in proportion to effort, not by default. This is fine — focus on transferring knowledge and grooming successors. Health-wise, monitor blood pressure and cardiac function; the Sun governs the heart, and neutral dignity means neither excess protection nor neglect.',
        hi: 'इस अवस्था में तटस्थ सूर्य का अर्थ है प्रतिष्ठा ठोस है पर दिग्गज नहीं। प्रयास के अनुपात में सम्मान मिलता है, स्वतः नहीं। यह ठीक है — ज्ञान हस्तान्तरण और उत्तराधिकारी तैयार करने पर ध्यान दें। स्वास्थ्य में रक्तचाप और हृदय कार्य की निगरानी रखें; सूर्य हृदय का स्वामी है।',
      },
      elder: {
        en: 'The Sun at neutral strength in elder years asks you to release the need for public validation. Your worth is not diminished by stepping back from center stage. Channel Sun energy into morning routines — early rising, sun exposure, and structured days keep both body and spirit buoyant. Let your children carry the public torch now.',
        hi: 'वृद्धावस्था में तटस्थ सूर्य सार्वजनिक मान्यता की आवश्यकता छोड़ने को कहता है। मंच से पीछे हटने से आपका मूल्य कम नहीं होता। सूर्य ऊर्जा को प्रातःकालीन दिनचर्या में लगाएँ — जल्दी उठना, धूप सेवन और व्यवस्थित दिन शरीर और आत्मा दोनों को प्रफुल्लित रखते हैं।',
      },
      sage: {
        en: 'A neutral Sun in the sage phase means your spiritual authority is quiet rather than commanding. You will not attract large followings, but those who sit with you will feel genuine warmth. Practice Gayatri mantra at sunrise — it is the simplest remedy that the Sun always honors. Let go of any lingering desire to be remembered; presence matters more than legacy.',
        hi: 'संन्यास काल में तटस्थ सूर्य का अर्थ है आध्यात्मिक अधिकार प्रभावशाली से अधिक शान्त है। बड़ी अनुयायी-संख्या नहीं आकर्षित होगी, पर जो आपके पास बैठेंगे वे वास्तविक ऊष्मा अनुभव करेंगे। सूर्योदय पर गायत्री मन्त्र का अभ्यास करें — यह सरलतम उपाय है जिसका सूर्य सदा सम्मान करता है।',
      },
    },
    weak: {
      student: {
        en: 'A weak Sun Mahadasha in student years challenges your confidence at the root. You may feel invisible among peers or struggle with an absent or critical father. Do not let this define you — the Sun teaches through difficulty too. Build competence quietly through hard study; when the dasha passes, your inner fire will surprise everyone, including yourself.',
        hi: 'छात्र काल में दुर्बल सूर्य महादशा आत्मविश्वास को जड़ से चुनौती देती है। साथियों में अदृश्य अनुभव या अनुपस्थित/आलोचक पिता से संघर्ष हो सकता है। इसे अपनी परिभाषा न बनने दें — सूर्य कठिनाई से भी सिखाता है। कठोर अध्ययन से चुपचाप क्षमता बनाएँ; दशा बीतने पर आपकी आन्तरिक अग्नि सबको चकित करेगी।',
      },
      early_career: {
        en: 'Weak Sun in your career-building years means authority does not come easily. Bosses may overlook you or take credit for your work. Avoid government roles for now — the bureaucratic Sun will frustrate rather than elevate. Build expertise in fields where skill speaks louder than title. Surya mantra on Sundays and ruby-substitute garnet can strengthen your resolve.',
        hi: 'कैरियर-निर्माण वर्षों में दुर्बल सूर्य का अर्थ है अधिकार सहज नहीं मिलता। वरिष्ठ आपकी अनदेखी या श्रेय ले सकते हैं। अभी सरकारी भूमिकाओं से बचें — नौकरशाही सूर्य ऊपर उठाने की बजाय निराश करेगा। ऐसे क्षेत्रों में विशेषज्ञता बनाएँ जहाँ कौशल पदवी से अधिक बोलता है। रविवार को सूर्य मन्त्र और गार्नेट संकल्प मजबूत कर सकते हैं।',
      },
      householder: {
        en: 'A debilitated Sun during householder years tests your sense of self within family and career. You may feel your contributions go unrecognized. Resist bitterness — it poisons the home you are building. Focus on competence, not credit. Father-related health issues may surface; attend to them promptly. Offer water to the Sun at sunrise as a daily discipline.',
        hi: 'गृहस्थ काल में दुर्बल सूर्य परिवार और कैरियर में आत्मबोध की परीक्षा लेता है। योगदान की अनदेखी महसूस हो सकती है। कड़वाहट से बचें — यह आपके बनाए घर को विषाक्त करती है। श्रेय नहीं, क्षमता पर ध्यान दें। पिता के स्वास्थ्य सम्बन्धी विषय उभर सकते हैं; तुरन्त ध्यान दें। प्रतिदिन सूर्योदय पर जल अर्पण करें।',
      },
      established: {
        en: 'Weak Sun at the established stage often manifests as feeling passed over for honors you deserved. Past power dynamics may leave residual resentment. This is the Sun asking you to find light within, not from external validation. Mentor younger people — giving authority to others paradoxically restores your own. Watch for vitamin D deficiency and bone health.',
        hi: 'स्थापित अवस्था में दुर्बल सूर्य अक्सर उन सम्मानों से वंचित होने की अनुभूति देता है जिनके आप योग्य थे। पुराने सत्ता-समीकरणों का अवशिष्ट आक्रोश हो सकता है। सूर्य कह रहा है प्रकाश भीतर खोजें, बाहरी मान्यता में नहीं। युवाओं का मार्गदर्शन करें — दूसरों को अधिकार देना विरोधाभासी रूप से आपका पुनर्स्थापित करता है।',
      },
      elder: {
        en: 'A weak Sun in elder years can bring melancholy about unfinished ambitions or a distant relationship with your father or children. Do not dwell on what the Sun withheld; focus on what it taught you through restriction. Keep mornings sacred — sunrise walks, even brief ones, are medicine for a depleted Sun. Acceptance is not defeat; it is the Sun setting with grace.',
        hi: 'वृद्धावस्था में दुर्बल सूर्य अपूर्ण महत्वाकांक्षाओं या पिता/सन्तान से दूरी की उदासी ला सकता है। सूर्य ने जो रोका उस पर न रुकें; प्रतिबन्ध से जो सिखाया उस पर ध्यान दें। प्रातःकाल को पवित्र रखें — सूर्योदय सैर, संक्षिप्त भी, क्षीण सूर्य की औषधि है। स्वीकृति पराजय नहीं; यह सूर्य का गरिमापूर्ण अस्त है।',
      },
      sage: {
        en: 'Weak Sun in the sage phase strips worldly identity to its bones — and this is a gift if you let it be. You are not your titles, your achievements, or your name. The Sun debilitated frees you from ego more effectively than any meditation technique. Sit in morning light without agenda. Your final years become the most spiritually productive precisely because the world stopped watching.',
        hi: 'संन्यास काल में दुर्बल सूर्य लौकिक पहचान को हड्डियों तक छील देता है — और यदि आप स्वीकारें तो यह उपहार है। आप अपनी पदवियाँ, उपलब्धियाँ या नाम नहीं हैं। नीच सूर्य किसी भी ध्यान तकनीक से अधिक प्रभावी रूप से अहंकार से मुक्त करता है। प्रातः प्रकाश में बिना उद्देश्य बैठें। अन्तिम वर्ष सर्वाधिक आध्यात्मिक रूप से उत्पादक बनते हैं।',
      },
    },
  },

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // MOON — mind, mother, emotions, public, nurturing, mental peace
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  Moon: {
    strong: {
      student: {
        en: 'A strong Moon Mahadasha in your student years blesses emotional intelligence and a retentive memory. You absorb subjects intuitively and may excel in humanities, psychology, or creative arts. Your mother is a pillar of support now — lean into that bond without guilt. Nurture friendships; the connections you form in this period last a lifetime.',
        hi: 'छात्र काल में बलवान चन्द्र महादशा भावनात्मक बुद्धिमत्ता और धारणा-शक्ति का आशीर्वाद देती है। आप विषयों को सहज ग्रहण करते हैं और मानविकी, मनोविज्ञान या सृजनात्मक कलाओं में उत्कृष्ट हो सकते हैं। माँ अभी आधारस्तम्भ हैं — बिना अपराधबोध उस बन्धन का सहारा लें। मित्रता पोषित करें; इस काल के सम्बन्ध जीवनभर टिकते हैं।',
      },
      early_career: {
        en: 'Moon with strength in early career brings popularity and public appeal. Careers in hospitality, healthcare, counseling, or any people-facing role flourish. Your emotional radar is sharp — use it to read workplace dynamics and build alliances. Be careful not to absorb others\' stress as your own. Establish boundaries that protect your inner calm.',
        hi: 'प्रारम्भिक कैरियर में बलवान चन्द्र लोकप्रियता और जन-आकर्षण लाता है। आतिथ्य, स्वास्थ्य सेवा, परामर्श या जन-सम्पर्क कैरियर फलते-फूलते हैं। आपकी भावनात्मक संवेदनशीलता तीक्ष्ण है — कार्यस्थल गतिशीलता पढ़ने और गठबन्धन बनाने में उपयोग करें। दूसरों का तनाव अपना न बनाएँ। आन्तरिक शान्ति की रक्षा करने वाली सीमाएँ स्थापित करें।',
      },
      householder: {
        en: 'This is the Moon\'s most natural expression — nurturing family, building a beautiful home, and creating emotional security for your children. Real estate investments and property matters favor you strongly. Your intuition guides domestic decisions well. Watch only for over-attachment to comfort; the Moon can make you resist necessary change.',
        hi: 'यह चन्द्रमा की सबसे स्वाभाविक अभिव्यक्ति है — परिवार का पालन-पोषण, सुन्दर घर बनाना और सन्तान के लिए भावनात्मक सुरक्षा। अचल सम्पत्ति निवेश और भूमि-विषय आपके पक्ष में हैं। अन्तर्ज्ञान घरेलू निर्णयों का उत्तम मार्गदर्शन करता है। केवल आराम से अति-लगाव से सावधान रहें; चन्द्रमा आवश्यक परिवर्तन का प्रतिरोध करा सकता है।',
      },
      established: {
        en: 'Strong Moon now deepens your emotional intelligence into wisdom. You understand people at a level that makes you an exceptional counselor, mediator, or grandparent. Property and liquid assets remain well-protected. Your mother\'s health may need attention — honor the bond that sustained you. Mental peace is your greatest asset; guard it deliberately.',
        hi: 'बलवान चन्द्रमा अब भावनात्मक बुद्धिमत्ता को ज्ञान में गहरा करता है। आप लोगों को ऐसे समझते हैं जो आपको असाधारण परामर्शदाता, मध्यस्थ या दादा-दादी बनाता है। सम्पत्ति और तरल परिसम्पत्तियाँ सुरक्षित रहती हैं। माँ के स्वास्थ्य पर ध्यान आवश्यक हो सकता है। मानसिक शान्ति आपकी सबसे बड़ी सम्पदा है; सचेत रूप से रक्षा करें।',
      },
      elder: {
        en: 'The Moon dignified in elder years sustains emotional resilience and keeps depression at bay. You become the emotional anchor of your extended family — the one everyone calls in crisis. Water-related activities (swimming, living near water, even aquariums) nourish your Moon. Your sleep remains sound, which is a blessing many elders do not receive.',
        hi: 'वृद्धावस्था में गरिमामय चन्द्रमा भावनात्मक लचीलापन बनाए रखता है और अवसाद को दूर रखता है। आप विस्तृत परिवार के भावनात्मक आधार बनते हैं — जिसे संकट में सब पुकारते हैं। जल-सम्बन्धी गतिविधियाँ (तैराकी, जल के निकट रहना) आपके चन्द्रमा को पोषित करती हैं। नींद अच्छी रहती है, जो कई वृद्धों को नहीं मिलती।',
      },
      sage: {
        en: 'Moon Mahadasha in the sage phase with full dignity brings the deepest contentment a human mind can know. Your emotions are no longer waves — they are the ocean itself, calm at the depths. Bhakti practices come naturally; devotional singing, temple visits, and quiet prayer fill your days with meaning. You need very little, and that littleness is freedom.',
        hi: 'पूर्ण गरिमा सहित संन्यास काल में चन्द्र महादशा मानव मन को सबसे गहरी सन्तुष्टि देती है। आपकी भावनाएँ अब लहरें नहीं — वे स्वयं सागर हैं, गहराई में शान्त। भक्ति अभ्यास स्वाभाविक आते हैं; भजन, मन्दिर दर्शन और शान्त प्रार्थना दिनों को अर्थ से भरते हैं। आपको बहुत कम चाहिए, और वही अल्पता मुक्ति है।',
      },
    },
    neutral: {
      student: {
        en: 'Neutral Moon Mahadasha gives adequate emotional stability but not exceptional intuition. You learn well through routine rather than sudden inspiration. Your mother supports you within her means but cannot shield you from every difficulty. Develop study habits that do not depend on mood — the Moon at neutral dignity is changeable, so anchor yourself in structure.',
        hi: 'तटस्थ चन्द्र महादशा पर्याप्त भावनात्मक स्थिरता देती है पर असाधारण अन्तर्ज्ञान नहीं। आप दिनचर्या से अच्छा सीखते हैं, अचानक प्रेरणा से नहीं। माँ अपनी सामर्थ्य में सहयोग करती हैं पर हर कठिनाई से बचा नहीं सकतीं। मन:स्थिति पर निर्भर न रहने वाली अध्ययन आदतें विकसित करें — तटस्थ चन्द्रमा परिवर्तनशील है।',
      },
      early_career: {
        en: 'The Moon at neutral strength in early career means public-facing roles are possible but emotionally taxing. You can do hospitality or sales, but you will need recovery time that extroverts do not. Choose work environments with reasonable emotional demands. Monthly mood fluctuations affect productivity — track your cycles and plan demanding work accordingly.',
        hi: 'प्रारम्भिक कैरियर में तटस्थ चन्द्रमा का अर्थ है जन-सम्पर्क भूमिकाएँ सम्भव हैं पर भावनात्मक रूप से थकाऊ। आतिथ्य या बिक्री कर सकते हैं, पर पुनर्प्राप्ति समय चाहिए। उचित भावनात्मक माँग वाला कार्य-वातावरण चुनें। मासिक मनोदशा उतार-चढ़ाव उत्पादकता प्रभावित करते हैं — अपने चक्र ट्रैक करें और कठिन कार्य तदनुसार नियोजित करें।',
      },
      householder: {
        en: 'Neutral Moon during householder years gives a functional but not deeply fulfilling home life. You provide for your family competently, but emotional expression may feel forced. Make conscious effort to be present with your children — they need your attention more than your provision. Property matters proceed without major gains or losses.',
        hi: 'गृहस्थ काल में तटस्थ चन्द्रमा कार्यात्मक पर गहरी सन्तुष्टि से रहित गृह-जीवन देता है। परिवार का भरण-पोषण सक्षमता से करते हैं, पर भावनात्मक अभिव्यक्ति कृत्रिम लग सकती है। सन्तान के साथ उपस्थित रहने का सचेत प्रयास करें — उन्हें आपके प्रावधान से अधिक आपका ध्यान चाहिए।',
      },
      established: {
        en: 'At this stage, neutral Moon asks you to actively cultivate mental peace rather than expect it to come naturally. Meditation, evening walks near water, and consistent sleep schedules are not luxuries — they are necessities. Your emotional bandwidth is sufficient but not abundant; spend it on people who reciprocate. Mother-related matters require balanced attention.',
        hi: 'इस अवस्था में तटस्थ चन्द्रमा कहता है मानसिक शान्ति स्वतः आने की प्रतीक्षा न करें, सक्रिय रूप से विकसित करें। ध्यान, जल के निकट सन्ध्या सैर और नियमित नींद विलासिता नहीं, आवश्यकताएँ हैं। भावनात्मक क्षमता पर्याप्त है पर प्रचुर नहीं; जो प्रतिदान करें उन पर व्यय करें।',
      },
      elder: {
        en: 'Neutral Moon in elder years means emotional equilibrium requires daily maintenance. You are neither deeply depressed nor exuberantly joyful — a quiet steadiness defines your inner life. Maintain social connections to prevent isolation, which the aging Moon tends toward. Warm milk before sleep, gentle music, and moonlight evenings are practical Moon remedies at this age.',
        hi: 'वृद्धावस्था में तटस्थ चन्द्रमा का अर्थ है भावनात्मक सन्तुलन को दैनिक रखरखाव चाहिए। न गहरी उदासी न अत्यधिक आनन्द — शान्त स्थिरता आन्तरिक जीवन परिभाषित करती है। एकान्त से बचने के लिए सामाजिक सम्पर्क बनाए रखें। सोने से पहले गर्म दूध, मधुर संगीत और चाँदनी सन्ध्या इस आयु में व्यावहारिक चन्द्र उपाय हैं।',
      },
      sage: {
        en: 'Neutral Moon in the sage phase gives a mind that is calm but not transported. You will not experience ecstatic devotion, but you will know a quiet satisfaction that deepens with each passing season. Maintain a simple routine — the Moon at this dignity responds to regularity. Your memories become your meditation; sift through them with gratitude, not longing.',
        hi: 'संन्यास काल में तटस्थ चन्द्रमा शान्त पर अतिभावुक नहीं मन देता है। भक्ति का परमानन्द नहीं, पर एक शान्त सन्तुष्टि प्रत्येक ऋतु के साथ गहरी होती है। सरल दिनचर्या बनाए रखें — इस गरिमा पर चन्द्रमा नियमितता से प्रतिक्रिया करता है। स्मृतियाँ आपका ध्यान बनती हैं; उन्हें कृतज्ञता से छानें, लालसा से नहीं।',
      },
    },
    weak: {
      student: {
        en: 'A weak Moon Mahadasha in student years brings emotional turbulence that can disrupt concentration. Anxiety before exams, homesickness, or an unsettled relationship with your mother may surface. These are not permanent — they are the Moon teaching you to self-soothe. Develop a bedtime routine, limit screen exposure after sunset, and drink water when anxious. Structure is your anchor.',
        hi: 'छात्र काल में दुर्बल चन्द्र महादशा भावनात्मक उथल-पुथल लाती है जो एकाग्रता बाधित कर सकती है। परीक्षा-चिन्ता, घर की याद, या माँ से अस्थिर सम्बन्ध उभर सकते हैं। ये स्थायी नहीं — चन्द्रमा स्व-शान्ति सिखा रहा है। सोने की दिनचर्या बनाएँ, सूर्यास्त बाद स्क्रीन सीमित करें और चिन्ता में जल पिएँ।',
      },
      early_career: {
        en: 'Weak Moon in early career manifests as emotional reactivity in the workplace — taking feedback personally, mood swings that colleagues notice, or difficulty reading social cues. Avoid roles requiring constant emotional labor (counseling, sales). Technical or analytical work with defined boundaries suits this period better. Monday fasting and white clothing on Mondays are small but effective Moon remedies.',
        hi: 'प्रारम्भिक कैरियर में दुर्बल चन्द्रमा कार्यस्थल पर भावनात्मक प्रतिक्रियाशीलता लाता है — प्रतिक्रिया को व्यक्तिगत लेना, सहकर्मियों द्वारा देखे जाने वाले मनोदशा परिवर्तन। निरन्तर भावनात्मक श्रम वाली भूमिकाओं से बचें। परिभाषित सीमाओं वाला तकनीकी या विश्लेषणात्मक कार्य अनुकूल है। सोमवार व्रत और श्वेत वस्त्र प्रभावी चन्द्र उपाय हैं।',
      },
      householder: {
        en: 'A debilitated Moon during the householder phase is one of the harder placements — domestic peace is hard-won. Arguments with your spouse may stem from unprocessed emotional baggage, not the present issue. Seek professional counseling without shame; it is the modern equivalent of seeking a wise elder. Mother\'s health requires close monitoring. Pearl or moonstone can stabilize the mind.',
        hi: 'गृहस्थ काल में नीच चन्द्रमा कठिन स्थितियों में से एक है — घरेलू शान्ति कठिनाई से मिलती है। जीवनसाथी से विवाद वर्तमान मुद्दे से नहीं, असंसाधित भावनात्मक बोझ से उत्पन्न हो सकते हैं। बिना संकोच पेशेवर परामर्श लें; यह बुद्धिमान बुजुर्ग से सलाह का आधुनिक रूप है। माँ के स्वास्थ्य पर कड़ी निगरानी रखें।',
      },
      established: {
        en: 'Weak Moon at this stage can bring mid-life emotional crisis — a sense that despite material success, something essential is missing. Do not medicate this feeling with purchases or distractions. It is the Moon asking you to look inward. Prioritize sleep hygiene, reduce stimulant intake, and consider a therapist if rumination becomes chronic. Your family needs your stability more than your achievements.',
        hi: 'इस अवस्था में दुर्बल चन्द्रमा मध्य-जीवन भावनात्मक संकट ला सकता है — भौतिक सफलता के बावजूद कुछ आवश्यक खोया-सा अनुभव। इस भावना को खरीदारी या विकर्षणों से शान्त न करें। चन्द्रमा भीतर देखने को कह रहा है। नींद स्वच्छता को प्राथमिकता दें, उत्तेजक पदार्थ कम करें। परिवार को आपकी उपलब्धियों से अधिक आपकी स्थिरता चाहिए।',
      },
      elder: {
        en: 'Weak Moon in elder years is the classical placement for loneliness and insomnia. You may feel that the world has moved on without you. Combat this with structure, not sentiment — fixed meal times, social commitments you cannot cancel, and evening chanting that winds down the mind. The Moon wanes, but it always waxes again. Let your family know you need their presence; they cannot read silence.',
        hi: 'वृद्धावस्था में दुर्बल चन्द्रमा एकान्त और अनिद्रा की शास्त्रीय स्थिति है। संसार आगे बढ़ गया अनुभव हो सकता है। इसका मुकाबला संवेदना से नहीं, संरचना से करें — निश्चित भोजन समय, रद्द न किए जा सकने वाले सामाजिक वचनबद्धताएँ, सन्ध्या पाठ। चन्द्रमा क्षीण होता है पर सदा पुनः बढ़ता है। परिवार को बताएँ कि उनकी उपस्थिति चाहिए।',
      },
      sage: {
        en: 'A weak Moon in the final stage of life can bring profound sadness or dementia-like mental fog. Do not resist this as failure — the Moon dissolving the mind is, in Vedantic terms, the self preparing to merge back into the whole. Maintain whatever daily structure you can. Let family handle complexity. Chant one simple mantra — Om Namah Shivaya or Rama — and let it carry you. The mind does not need to be sharp to be at peace.',
        hi: 'जीवन के अन्तिम चरण में दुर्बल चन्द्रमा गहरी उदासी या मानसिक धुँधलापन ला सकता है। इसे विफलता न समझें — वेदान्त में मन का विलय आत्मा की समग्र में विलीन होने की तैयारी है। जो भी दैनिक संरचना बनाए रख सकें, रखें। जटिलता परिवार को सौंपें। एक सरल मन्त्र — ॐ नमः शिवाय या राम — जपें और बहने दें। शान्ति के लिए मन का तीक्ष्ण होना आवश्यक नहीं।',
      },
    },
  },

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // MARS — courage, siblings, property, energy, conflict, surgery
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  Mars: {
    strong: {
      student: {
        en: 'A powerful Mars Mahadasha in student years channels raw energy into competitive excellence. Sports, NCC, martial arts, or engineering entrance exams — any arena demanding stamina and courage is your playground. Siblings may become allies or rivals; either way, the dynamic sharpens you. Control your temper in classrooms; Mars gives you fire, but discretion decides where it burns.',
        hi: 'छात्र काल में शक्तिशाली मंगल महादशा कच्ची ऊर्जा को प्रतिस्पर्धात्मक उत्कृष्टता में बदलती है। खेल, एनसीसी, मार्शल आर्ट या इंजीनियरिंग प्रवेश परीक्षा — सहनशक्ति और साहस माँगने वाला हर क्षेत्र आपका मैदान है। भाई-बहन सहयोगी या प्रतिद्वन्द्वी बनेंगे; दोनों स्थिति आपको तेज करती है। कक्षा में क्रोध नियन्त्रित करें।',
      },
      early_career: {
        en: 'Strong Mars launches your career like a rocket — military, police, surgery, engineering, or entrepreneurship suit you perfectly. You have the courage to take risks others avoid and the stamina to outwork them. Land and property acquisitions are favored. But Mars demands you pick your battles wisely; every fight won costs energy, and not all wars are worth fighting.',
        hi: 'बलवान मंगल कैरियर को रॉकेट की भाँति प्रक्षेपित करता है — सेना, पुलिस, शल्य चिकित्सा, इंजीनियरिंग या उद्यमिता सर्वथा अनुकूल। जो जोखिम दूसरे टालते हैं वह लेने का साहस और उनसे अधिक परिश्रम की सहनशक्ति आपमें है। भूमि और सम्पत्ति अधिग्रहण अनुकूल हैं। पर मंगल चाहता है कि लड़ाइयाँ बुद्धिमानी से चुनें।',
      },
      householder: {
        en: 'Mars at full strength during householder years makes you the protector and builder of the family. Property construction, real estate expansion, and home improvement thrive. Your courage inspires your children, but temper your martial instinct at home — the battlefield is outside, not at the dinner table. Channel excess energy into physical fitness; it prevents Mars from becoming aggression.',
        hi: 'गृहस्थ काल में पूर्ण बलवान मंगल आपको परिवार का रक्षक और निर्माता बनाता है। सम्पत्ति निर्माण, भूमि विस्तार और गृह-सुधार फलते-फूलते हैं। आपका साहस सन्तान को प्रेरित करता है, पर घर में युद्ध-प्रवृत्ति नियन्त्रित करें — रणभूमि बाहर है, भोजन-मेज पर नहीं। अतिरिक्त ऊर्जा शारीरिक व्यायाम में लगाएँ।',
      },
      established: {
        en: 'Strong Mars at the established stage sustains physical vitality and competitive edge when peers begin to slow down. Use this energy for decisive financial moves — property deals, business restructuring, or defending family interests. Your siblings\' affairs may need your intervention. Do not pick unnecessary fights with younger rivals; your Mars energy serves you better in construction than demolition.',
        hi: 'स्थापित अवस्था में बलवान मंगल शारीरिक जीवनशक्ति बनाए रखता है जब समकक्ष धीमे पड़ने लगते हैं। इस ऊर्जा का उपयोग निर्णायक वित्तीय कदमों में करें — सम्पत्ति सौदे, व्यापार पुनर्गठन, पारिवारिक हित रक्षा। भाई-बहनों के विषयों में हस्तक्षेप आवश्यक हो सकता है। युवा प्रतिद्वन्द्वियों से अनावश्यक लड़ाई से बचें।',
      },
      elder: {
        en: 'A dignified Mars in elder years is a rare gift — it keeps your blood hot, your spine straight, and your will unbroken. Maintain a rigorous exercise routine adapted to your body\'s limits. You may find yourself defending family property or resolving sibling disputes with authority that only age and strength together command. Mars wants action, not retirement; find yours.',
        hi: 'वृद्धावस्था में गरिमामय मंगल दुर्लभ वरदान है — रक्त गर्म, रीढ़ सीधी और संकल्प अटूट रखता है। शरीर की सीमाओं के अनुकूल कठोर व्यायाम दिनचर्या बनाए रखें। पारिवारिक सम्पत्ति की रक्षा या भाई-बहनों के विवाद सुलझाने में आपका अधिकार हो सकता है जो केवल आयु और शक्ति साथ मिलकर देती है। मंगल कर्म चाहता है, सेवानिवृत्ति नहीं।',
      },
      sage: {
        en: 'Mars with dignity in the sage phase transforms warrior energy into spiritual tapas. You have the rare capacity for intense, sustained sadhana — hours of meditation, physical pilgrimages that younger people admire, or the fierce discipline of silence. Your body cooperates because Mars holds it together. Use this strength to go deep, not wide. One practice, one path, total commitment.',
        hi: 'संन्यास काल में गरिमामय मंगल योद्धा ऊर्जा को आध्यात्मिक तपस में रूपान्तरित करता है। आपमें तीव्र, निरन्तर साधना की दुर्लभ क्षमता है — घण्टों ध्यान, युवाओं को प्रेरित करने वाली शारीरिक तीर्थयात्राएँ, मौन का कठोर अनुशासन। शरीर सहयोग करता है क्योंकि मंगल उसे संभाले है। गहराई में जाएँ, विस्तार में नहीं।',
      },
    },
    neutral: {
      student: {
        en: 'Neutral Mars in student years gives enough energy for academic competition but not dominance. You can participate in sports and physical activities without becoming the star. Channel Mars into disciplined study habits — regular schedules, timed practice tests, and physical exercise between study sessions. Sibling relationships are functional but may lack warmth; make the effort.',
        hi: 'छात्र काल में तटस्थ मंगल शैक्षिक प्रतिस्पर्धा के लिए पर्याप्त ऊर्जा देता है पर प्रभुत्व नहीं। खेल और शारीरिक गतिविधियों में भाग ले सकते हैं बिना सितारा बने। मंगल को अनुशासित अध्ययन आदतों में लगाएँ — नियमित कार्यक्रम, समयबद्ध अभ्यास और अध्ययन सत्रों के बीच व्यायाम। भाई-बहनों से सम्बन्ध ठीक हैं पर ऊष्मा कम हो सकती है।',
      },
      early_career: {
        en: 'Neutral Mars provides adequate drive for career without the explosive energy of a strong placement. You can succeed in technical roles, manufacturing, or project management where steady effort matters more than heroics. Property investments are possible but require careful due diligence. Avoid high-risk ventures — your Mars will not bail you out of reckless bets.',
        hi: 'तटस्थ मंगल कैरियर के लिए पर्याप्त प्रेरणा देता है पर बलवान स्थिति की विस्फोटक ऊर्जा नहीं। तकनीकी भूमिकाओं, विनिर्माण या परियोजना प्रबन्धन में सफल हो सकते हैं जहाँ निरन्तर प्रयास वीरता से अधिक महत्वपूर्ण है। सम्पत्ति निवेश सम्भव पर सावधानीपूर्ण जाँच आवश्यक। उच्च-जोखिम उपक्रमों से बचें।',
      },
      householder: {
        en: 'Mars at neutral strength during the householder phase keeps the household running but without the martial vigor to expand aggressively. Home repairs and maintenance are fine; major construction projects may stall or overrun budgets. Physical intimacy in marriage is adequate but benefits from conscious attention. Encourage your children\'s sports involvement — they may carry the Mars energy you modulate.',
        hi: 'गृहस्थ काल में तटस्थ मंगल घर चलाता है पर आक्रामक विस्तार की योद्धा शक्ति नहीं। गृह-मरम्मत ठीक है; बड़ी निर्माण परियोजनाएँ रुक सकती हैं या बजट से अधिक हो सकती हैं। वैवाहिक शारीरिक सम्बन्ध पर्याप्त हैं पर सचेत ध्यान से लाभान्वित होते हैं। सन्तान की खेल भागीदारी प्रोत्साहित करें।',
      },
      established: {
        en: 'Neutral Mars at this age keeps you physically functional without excess. You are unlikely to face major surgeries but should maintain regular health screenings — blood panels, prostate (if male), or bone density. Property holdings remain stable. Do not engage in legal battles unless absolutely necessary; your Mars lacks the stamina for prolonged litigation.',
        hi: 'इस आयु में तटस्थ मंगल शारीरिक रूप से सक्रिय रखता है पर अतिरिक्त ऊर्जा नहीं। बड़ी शल्य चिकित्सा की सम्भावना कम पर नियमित स्वास्थ्य जाँच रखें — रक्त परीक्षण, अस्थि घनत्व। सम्पत्ति स्थिर रहती है। जब तक अत्यन्त आवश्यक न हो कानूनी लड़ाई में न पड़ें; लम्बी मुकदमेबाजी के लिए मंगल में सहनशक्ति कम है।',
      },
      elder: {
        en: 'Neutral Mars in elder years means moderate physical resilience — you can stay active with walking, yoga, and light gardening, but avoid overexertion. Joint health and blood circulation need attention. Your role in family disputes is as mediator, not warrior. Accept that younger family members must fight their own battles; your counsel is more valuable than your combat.',
        hi: 'वृद्धावस्था में तटस्थ मंगल मध्यम शारीरिक लचीलापन देता है — चलना, योग और हल्की बागवानी से सक्रिय रह सकते हैं, पर अत्यधिक परिश्रम से बचें। जोड़ों का स्वास्थ्य और रक्त-संचार पर ध्यान आवश्यक। पारिवारिक विवादों में योद्धा नहीं, मध्यस्थ बनें। युवा परिवार-जनों को अपनी लड़ाइयाँ स्वयं लड़ने दें; आपका परामर्श आपके युद्ध से अधिक मूल्यवान है।',
      },
      sage: {
        en: 'Neutral Mars in the sage phase gives just enough physical energy to maintain daily routines without the intensity for arduous tapas. Gentle pranayama suits you better than hours of sitting meditation. Walk rather than trek. Your spiritual warrior is subtle now — fighting inner battles of patience, acceptance, and letting go rather than external ones.',
        hi: 'संन्यास काल में तटस्थ मंगल दैनिक दिनचर्या बनाए रखने की पर्याप्त शारीरिक ऊर्जा देता है, कठोर तपस की तीव्रता नहीं। घण्टों बैठ कर ध्यान से बेहतर सौम्य प्राणायाम अनुकूल है। ट्रैकिंग नहीं, चलें। आपका आध्यात्मिक योद्धा अब सूक्ष्म है — धैर्य, स्वीकृति और त्याग की आन्तरिक लड़ाइयाँ लड़ रहा है, बाह्य नहीं।',
      },
    },
    weak: {
      student: {
        en: 'Weak Mars in student years manifests as low physical stamina, avoidance of competition, or conflicts with siblings that drain your focus. You may be bullied or feel physically inadequate. Do not internalize this — Mars debilitated is temporary, not your identity. Build strength gradually through daily exercise, not sudden heroics. Avoid reckless physical risks; accidents are a weak-Mars signature.',
        hi: 'छात्र काल में दुर्बल मंगल कम शारीरिक सहनशक्ति, प्रतिस्पर्धा से बचाव, या भाई-बहनों से ऊर्जा-क्षय करने वाले संघर्ष दर्शाता है। धमकी या शारीरिक अपर्याप्तता अनुभव हो सकती है। इसे आत्मसात न करें — नीच मंगल अस्थायी है, आपकी पहचान नहीं। दैनिक व्यायाम से धीरे-धीरे शक्ति बनाएँ। लापरवाह शारीरिक जोखिमों से बचें।',
      },
      early_career: {
        en: 'A debilitated Mars in career-building years creates frustration — you have ambition but the energy to execute falters. Projects start strong but lose momentum. Avoid careers requiring sustained physical exertion or confrontation. Technology, research, or creative fields where patience outweighs aggression suit you better. Coral gemstone and Hanuman Chalisa on Tuesdays provide Mars support.',
        hi: 'कैरियर-निर्माण वर्षों में नीच मंगल निराशा लाता है — महत्वाकांक्षा है पर कार्यान्वयन की ऊर्जा डगमगाती है। परियोजनाएँ जोश से शुरू होती हैं पर गति खोती हैं। निरन्तर शारीरिक श्रम या टकराव वाले कैरियर से बचें। प्रौद्योगिकी, शोध या सृजनात्मक क्षेत्र जहाँ धैर्य आक्रामकता से बढ़कर है, अनुकूल हैं। मूँगा रत्न और मंगलवार हनुमान चालीसा सहायक हैं।',
      },
      householder: {
        en: 'Weak Mars during the householder phase brings property disputes, construction delays, and simmering anger that erupts at the worst moments. The anger comes from powerlessness, not strength — recognize this pattern. Delegate physical tasks you cannot sustain. Protect against accidents in the kitchen, with vehicles, and with sharp instruments. Your marriage benefits from channeling conflict into honest conversation.',
        hi: 'गृहस्थ काल में दुर्बल मंगल सम्पत्ति विवाद, निर्माण में विलम्ब और दबा हुआ क्रोध लाता है जो सबसे बुरे क्षणों में फूटता है। क्रोध शक्तिहीनता से है, शक्ति से नहीं — यह पैटर्न पहचानें। जो शारीरिक कार्य नहीं कर सकते, सौंपें। रसोई, वाहन और तीक्ष्ण उपकरणों से दुर्घटनाओं से बचें। वैवाहिक संघर्ष को ईमानदार संवाद में बदलें।',
      },
      established: {
        en: 'A weak Mars at this age often shows up as chronic inflammation, joint pain, or blood-related issues. Address these medically without delay — Mars debilitated does not improve with willpower alone. Property matters may face legal challenges; hire competent legal counsel rather than fighting personally. Your siblings may need financial help; give what you can without resentment.',
        hi: 'इस आयु में दुर्बल मंगल अक्सर दीर्घकालिक सूजन, जोड़ दर्द या रक्त-सम्बन्धी समस्याओं के रूप में प्रकट होता है। बिना विलम्ब चिकित्सकीय उपचार लें — नीच मंगल केवल इच्छाशक्ति से नहीं सुधरता। सम्पत्ति विषयों में कानूनी चुनौतियाँ हो सकती हैं; व्यक्तिगत लड़ाई की बजाय सक्षम कानूनी सलाह लें। भाई-बहनों को वित्तीय सहायता की आवश्यकता हो सकती है।',
      },
      elder: {
        en: 'Weak Mars in elder years means your body\'s defenses are genuinely compromised. Fall prevention, bone density monitoring, and blood tests for anemia or infection markers are non-negotiable. Avoid heavy lifting, long drives, and physically demanding travel. Your courage is now expressed through endurance — getting through each day with dignity is a warrior\'s act when Mars is depleted.',
        hi: 'वृद्धावस्था में दुर्बल मंगल का अर्थ शरीर की सुरक्षा वास्तव में कमजोर है। गिरने की रोकथाम, अस्थि घनत्व निगरानी और रक्ताल्पता या संक्रमण मार्करों के लिए रक्त परीक्षण अनिवार्य हैं। भारी सामान उठाने, लम्बी ड्राइव और शारीरिक रूप से कठिन यात्रा से बचें। आपका साहस अब सहनशक्ति में व्यक्त होता है — गरिमा से हर दिन बिताना योद्धा-कर्म है।',
      },
      sage: {
        en: 'Weak Mars in the sage phase means your body is fragile but your spirit need not be. Physical tapas is not your path — choose mental and devotional practices instead. Gentle stretching, warm baths, and anti-inflammatory diet matter more than mantra count. Accept help from caregivers without seeing it as defeat. The bravest act a weak Mars can perform at this stage is accepting vulnerability with grace.',
        hi: 'संन्यास काल में दुर्बल मंगल का अर्थ शरीर नाजुक है पर आत्मा को नहीं होना चाहिए। शारीरिक तपस आपका मार्ग नहीं — मानसिक और भक्ति अभ्यास चुनें। सौम्य स्ट्रेचिंग, गर्म स्नान और सूजन-रोधी आहार मन्त्र गिनती से अधिक महत्वपूर्ण हैं। सेवकों की सहायता को पराजय न समझें। इस अवस्था में दुर्बल मंगल का सबसे साहसी कर्म अनुग्रह से दुर्बलता स्वीकारना है।',
      },
    },
  },

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // MERCURY — intellect, communication, business, adaptability, wit
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  Mercury: {
    strong: {
      student: {
        en: 'A strong Mercury Mahadasha is the best gift a student can receive. Your learning speed, verbal fluency, and analytical ability peak now. Pursue mathematics, languages, coding, or accounting — anything requiring mental agility. You absorb information like a sponge and can handle multiple subjects simultaneously. Debates, quizzes, and writing competitions are arenas where you will shine effortlessly.',
        hi: 'बलवान बुध महादशा छात्र को मिलने वाला सर्वश्रेष्ठ उपहार है। सीखने की गति, वाक्-प्रवाह और विश्लेषण क्षमता शिखर पर है। गणित, भाषा, कोडिंग या लेखा — मानसिक चपलता माँगने वाला कुछ भी अपनाएँ। स्पंज की भाँति जानकारी ग्रहण करते हैं और कई विषय साथ संभाल सकते हैं। वाद-विवाद, प्रश्नोत्तरी और लेखन प्रतियोगिताएँ आपके मंच हैं।',
      },
      early_career: {
        en: 'Mercury dignified in early career is the signature of the entrepreneur, the trader, and the communicator. Business ideas flow easily; your challenge is choosing which to pursue, not generating them. Writing, marketing, finance, and technology are natural domains. Partnerships in business are well-starred — your ability to negotiate and articulate terms gives you the edge. Start that venture you have been planning.',
        hi: 'प्रारम्भिक कैरियर में गरिमामय बुध उद्यमी, व्यापारी और संचारक की पहचान है। व्यापार विचार सहज बहते हैं; चुनौती उत्पन्न करना नहीं, चुनना है। लेखन, विपणन, वित्त और प्रौद्योगिकी स्वाभाविक क्षेत्र हैं। व्यापार में साझेदारी शुभ है — वार्ता और शर्तें स्पष्ट करने की क्षमता आपको बढ़त देती है। वह उपक्रम शुरू करें जिसकी योजना बना रहे थे।',
      },
      householder: {
        en: 'Strong Mercury at the householder stage makes you the intellectual anchor of your family. Your children benefit enormously from your teaching and guidance. Financial planning, investment analysis, and business expansion decisions come naturally. Communication with your spouse is clear and productive — use this gift, do not take it for granted. Write, teach, or consult on the side; your mind deserves more outlets than one career can provide.',
        hi: 'गृहस्थ अवस्था में बलवान बुध आपको परिवार का बौद्धिक आधारस्तम्भ बनाता है। आपके शिक्षण और मार्गदर्शन से सन्तान को अपार लाभ। वित्तीय नियोजन, निवेश विश्लेषण और व्यापार विस्तार निर्णय सहज आते हैं। जीवनसाथी से संवाद स्पष्ट और उत्पादक है — इस वरदान का उपयोग करें। लिखें, पढ़ाएँ या परामर्श दें; मन को एक कैरियर से अधिक आउटलेट चाहिए।',
      },
      established: {
        en: 'Mercury with strength at this stage is the mark of the elder statesman who still thinks circles around younger colleagues. Your advice is sought in financial, legal, and strategic matters. This is an excellent time to write a book, build a course, or systematize the knowledge you have accumulated. Your communication sharpens rather than dulls with age — a Mercury blessing that few planets replicate.',
        hi: 'इस अवस्था में बलवान बुध उस वरिष्ठ राजनीतिज्ञ की पहचान है जो अभी भी युवा सहकर्मियों से आगे सोचता है। वित्तीय, कानूनी और रणनीतिक विषयों में आपकी सलाह माँगी जाती है। पुस्तक लिखने, पाठ्यक्रम बनाने या संचित ज्ञान को व्यवस्थित करने का उत्कृष्ट समय। आपका संवाद आयु के साथ कुन्द नहीं, तीक्ष्ण होता है — बुध का दुर्लभ आशीर्वाद।',
      },
      elder: {
        en: 'A dignified Mercury in elder years keeps cognitive decline at bay. Your memory, articulation, and problem-solving ability remain sharp — treasure this and use it. Teach grandchildren, write memoirs, engage in intellectual communities. Word games, reading, and learning a new language are not hobbies; they are Mercury maintenance. Your speech carries an authority that only decades of clear thinking can produce.',
        hi: 'वृद्धावस्था में गरिमामय बुध संज्ञानात्मक गिरावट को दूर रखता है। स्मृति, अभिव्यक्ति और समस्या-समाधान क्षमता तीक्ष्ण रहती है — इसे सँजोएँ और उपयोग करें। पोतों को पढ़ाएँ, संस्मरण लिखें, बौद्धिक समुदायों में जुड़ें। शब्द-खेल, पठन और नई भाषा सीखना शौक नहीं, बुध रखरखाव है। आपकी वाणी में दशकों की स्पष्ट सोच का अधिकार है।',
      },
      sage: {
        en: 'Mercury dignified in the sage phase means your intellect remains a vehicle for spiritual understanding rather than mere worldly cleverness. You can study Vedanta, debate philosophy, and articulate subtle truths that others feel but cannot express. Your mind is your greatest instrument of liberation now — use it to untangle attachments, not to accumulate more knowledge. Speak less, but when you speak, let every word carry weight.',
        hi: 'संन्यास काल में गरिमामय बुध का अर्थ है बुद्धि केवल लौकिक चतुराई नहीं, आध्यात्मिक समझ का वाहन बनी रहती है। वेदान्त अध्ययन, दर्शन-चर्चा और सूक्ष्म सत्य व्यक्त कर सकते हैं जो दूसरे अनुभव करते हैं पर बोल नहीं पाते। मन अब मुक्ति का सर्वश्रेष्ठ उपकरण है — आसक्तियाँ सुलझाने में उपयोग करें, अधिक ज्ञान संचय में नहीं।',
      },
    },
    neutral: {
      student: {
        en: 'Neutral Mercury gives you competent but not exceptional academic ability. You learn well through repetition and structured teaching rather than flashes of insight. Subjects requiring memorization over reasoning may feel easier. Develop note-taking and revision systems — your Mercury needs scaffolding to perform. Join study groups; collaborative learning compensates for what solo brilliance does not provide.',
        hi: 'तटस्थ बुध सक्षम पर असाधारण नहीं शैक्षिक क्षमता देता है। अन्तर्दृष्टि की चमक से अधिक दोहराव और व्यवस्थित शिक्षण से अच्छा सीखते हैं। तर्क से अधिक स्मरण वाले विषय सरल लग सकते हैं। नोट-लेखन और पुनरावलोकन प्रणाली विकसित करें — आपके बुध को सहारे की आवश्यकता है। अध्ययन समूहों में शामिल हों।',
      },
      early_career: {
        en: 'Mercury at neutral strength in early career supports steady professional growth in established fields rather than entrepreneurial leaps. Accounting, administration, teaching, and technical support roles are comfortable. Business ideas require more validation before execution — trust but verify your hunches. Written communication is adequate but benefits from editing; always proofread important emails and proposals.',
        hi: 'प्रारम्भिक कैरियर में तटस्थ बुध उद्यमी छलांग से अधिक स्थापित क्षेत्रों में स्थिर पेशेवर विकास का समर्थन करता है। लेखा, प्रशासन, शिक्षण और तकनीकी सहायता भूमिकाएँ सुविधाजनक हैं। व्यापार विचारों को कार्यान्वयन से पहले अधिक सत्यापन चाहिए। लिखित संवाद पर्याप्त है पर सम्पादन से लाभान्वित होता है।',
      },
      householder: {
        en: 'Neutral Mercury during the householder phase handles domestic logistics competently — bills, school coordination, and household planning work smoothly. Deep financial analysis or complex investment strategies may need professional guidance. Communicate with your spouse regularly but recognize that your words may lack the emotional nuance they need; back them with actions.',
        hi: 'गृहस्थ काल में तटस्थ बुध घरेलू व्यवस्था सक्षमता से संभालता है — बिल, विद्यालय समन्वय, गृह-नियोजन सुचारु चलते हैं। गहन वित्तीय विश्लेषण या जटिल निवेश रणनीतियों के लिए पेशेवर मार्गदर्शन आवश्यक हो सकता है। जीवनसाथी से नियमित संवाद रखें पर पहचानें कि शब्दों में भावनात्मक सूक्ष्मता कम हो सकती है; कर्मों से पुष्ट करें।',
      },
      established: {
        en: 'At this stage, neutral Mercury means you process information more slowly than before but still reliably. Give yourself extra time for complex decisions — the snap judgments of youth served a stronger Mercury. Focus on organizing your financial records, estate plans, and important documents. Your communication style may seem outdated to younger colleagues; stay current with technology without chasing every trend.',
        hi: 'इस अवस्था में तटस्थ बुध का अर्थ है सूचना प्रसंस्करण पहले से धीमा पर विश्वसनीय है। जटिल निर्णयों के लिए अतिरिक्त समय दें। वित्तीय अभिलेखों, सम्पत्ति योजनाओं और महत्वपूर्ण दस्तावेजों को व्यवस्थित करने पर ध्यान दें। संवाद शैली युवा सहकर्मियों को पुरानी लग सकती है; प्रौद्योगिकी से अद्यतन रहें पर हर प्रवृत्ति का पीछा न करें।',
      },
      elder: {
        en: 'Neutral Mercury in elder years means cognitive function is preserved but not effortless. Mental exercises — crosswords, Sudoku, reading newspapers, and conversation — are essential maintenance, not optional entertainment. Your grandchildren can teach you technology while you teach them wisdom; make it a mutual exchange. Keep a daily diary to track your thoughts and medical observations.',
        hi: 'वृद्धावस्था में तटस्थ बुध संज्ञानात्मक कार्य संरक्षित रखता है पर सहज नहीं। मानसिक व्यायाम — वर्ग-पहेली, सुडोकू, समाचारपत्र पठन और वार्तालाप — आवश्यक रखरखाव है, वैकल्पिक मनोरंजन नहीं। पोते आपको प्रौद्योगिकी सिखाएँ और आप उन्हें ज्ञान; इसे पारस्परिक आदान-प्रदान बनाएँ। दैनिक डायरी रखें।',
      },
      sage: {
        en: 'Neutral Mercury in the sage phase gives a mind that understands without needing to articulate. You may find that verbal fluency decreases but comprehension remains. This is acceptable — wisdom does not always need words. Listen to spiritual discourses rather than giving them. Read slowly and absorb deeply. Your inner dialogue with the divine matters more than outer communication with the world.',
        hi: 'संन्यास काल में तटस्थ बुध ऐसा मन देता है जो व्यक्त किए बिना समझता है। वाक्-प्रवाह कम हो सकता है पर बोध बना रहता है। यह स्वीकार्य है — ज्ञान को सदा शब्दों की आवश्यकता नहीं। आध्यात्मिक प्रवचन देने से अधिक सुनें। धीरे पढ़ें और गहरा आत्मसात करें। परमात्मा से आन्तरिक संवाद संसार से बाह्य संवाद से अधिक महत्वपूर्ण है।',
      },
    },
    weak: {
      student: {
        en: 'Weak Mercury in student years creates learning obstacles — difficulty concentrating, speech hesitation, or poor exam performance despite understanding the material. You are not unintelligent; your Mercury simply needs more support. Hire tutors, use visual learning aids, and practice speaking aloud. Avoid comparing yourself to peers with strong Mercury placements. Green color therapy and Vishnu Sahasranama can help.',
        hi: 'छात्र काल में दुर्बल बुध सीखने में बाधाएँ उत्पन्न करता है — एकाग्रता कठिनाई, वाक्-हिचक, या विषय समझने के बावजूद खराब परीक्षा प्रदर्शन। आप बुद्धिहीन नहीं; बुध को अधिक सहायता चाहिए। ट्यूटर रखें, दृश्य शिक्षण साधन उपयोग करें, जोर से बोलने का अभ्यास करें। बलवान बुध वाले साथियों से तुलना से बचें। हरा रंग चिकित्सा और विष्णु सहस्रनाम सहायक हैं।',
      },
      early_career: {
        en: 'A debilitated Mercury in early career means communication mishaps — emails misunderstood, contracts with loopholes you missed, or negotiations where you give away too much. Have every important document reviewed by someone you trust. Avoid pure trading or sales roles; hands-on technical work where results speak louder than words is safer. Business partnerships formed now need especially careful due diligence.',
        hi: 'प्रारम्भिक कैरियर में नीच बुध संवाद दुर्घटनाएँ लाता है — गलत समझे ईमेल, छूटी खामियों वाले अनुबन्ध, या वार्ता में अत्यधिक रियायतें। हर महत्वपूर्ण दस्तावेज किसी विश्वसनीय से समीक्षा कराएँ। शुद्ध व्यापार या बिक्री भूमिकाओं से बचें; व्यावहारिक तकनीकी कार्य जहाँ परिणाम शब्दों से ऊँचा बोलें, सुरक्षित है।',
      },
      householder: {
        en: 'Weak Mercury during the householder phase creates miscommunication in the family that slowly erodes trust. You say one thing and your spouse hears another. Write down important agreements. Financial paperwork may have errors — double-check tax filings, insurance policies, and children\'s school admissions. Your nervous system is stressed; magnesium, B-vitamins, and reduced screen time help Mercury directly.',
        hi: 'गृहस्थ काल में दुर्बल बुध परिवार में ऐसा संवाद-भ्रम उत्पन्न करता है जो धीरे-धीरे विश्वास क्षीण करता है। आप एक कहते हैं, जीवनसाथी दूसरा सुनते हैं। महत्वपूर्ण समझौते लिखित रखें। वित्तीय कागजात में त्रुटियाँ हो सकती हैं — कर, बीमा और विद्यालय प्रवेश दोबारा जाँचें। तन्त्रिका तन्त्र तनावग्रस्त है; मैग्नीशियम, बी-विटामिन और कम स्क्रीन सहायक हैं।',
      },
      established: {
        en: 'Weak Mercury at this stage can manifest as early cognitive concerns — forgetting names, misplacing documents, or losing the thread of complex arguments. Address this proactively with brain-healthy habits: omega-3 fats, intellectual engagement, quality sleep, and reduced alcohol. It is likely functional, not pathological, but get baseline cognitive testing for peace of mind. Delegate accounting and legal work to professionals.',
        hi: 'इस अवस्था में दुर्बल बुध प्रारम्भिक संज्ञानात्मक चिन्ताओं के रूप में प्रकट हो सकता है — नाम भूलना, दस्तावेज खोना, जटिल तर्कों का तार खोना। मस्तिष्क-स्वस्थ आदतों से सक्रिय रूप से सम्बोधित करें: ओमेगा-3, बौद्धिक सक्रियता, गुणवत्ता नींद। यह सम्भवतः क्रियात्मक है, रोगात्मक नहीं, पर शान्ति के लिए बेसलाइन जाँच कराएँ।',
      },
      elder: {
        en: 'Weak Mercury in elder years requires honest assessment of cognitive capacity. If you struggle with financial decisions, let a trusted family member manage them. This is not weakness — it is wisdom recognizing its own limits. Keep communication simple and direct. Label medications clearly, write appointment dates in large text, and maintain one physical notebook for important information.',
        hi: 'वृद्धावस्था में दुर्बल बुध संज्ञानात्मक क्षमता का ईमानदार आकलन माँगता है। यदि वित्तीय निर्णयों में कठिनाई है, विश्वसनीय परिवार-सदस्य को प्रबन्धन सौंपें। यह दुर्बलता नहीं — अपनी सीमाएँ पहचानने वाला ज्ञान है। संवाद सरल और प्रत्यक्ष रखें। दवाइयों पर स्पष्ट लेबल, बड़े अक्षरों में तिथियाँ, और महत्वपूर्ण जानकारी की एक भौतिक नोटबुक रखें।',
      },
      sage: {
        en: 'A weak Mercury in the sage phase liberates you from the tyranny of the analytical mind. You no longer need to understand everything intellectually — feeling, intuiting, and simply being are equally valid paths to truth. Do not fight cognitive changes; flow with them. Mantra repetition replaces complex thought. The simplest prayer, spoken from the heart, reaches further than the most eloquent sermon spoken from the head.',
        hi: 'संन्यास काल में दुर्बल बुध विश्लेषणात्मक मन की तानाशाही से मुक्त करता है। अब सब कुछ बौद्धिक रूप से समझने की आवश्यकता नहीं — अनुभव करना, सहज ज्ञान और बस होना सत्य के समान वैध मार्ग हैं। संज्ञानात्मक परिवर्तनों से न लड़ें; बहें। मन्त्र-जाप जटिल विचार का स्थान लेता है। हृदय से बोली सरलतम प्रार्थना मस्तिष्क से बोले प्रवचन से आगे पहुँचती है।',
      },
    },
  },

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // JUPITER — wisdom, children, teaching, dharma, expansion, guru
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  Jupiter: {
    strong: {
      student: {
        en: 'A strong Jupiter Mahadasha in student years is the hallmark of the blessed learner. Teachers favor you, scholarships appear, and higher education doors open without extraordinary effort. You have a natural sense of right and wrong that earns respect from elders. Study philosophy, law, or the sciences — Jupiter expands whatever it touches. Stay humble; Jupiter\'s gifts inflate the ego as easily as they inflate opportunity.',
        hi: 'छात्र काल में बलवान बृहस्पति महादशा आशीर्वादित शिक्षार्थी की पहचान है। शिक्षक आपको पसन्द करते हैं, छात्रवृत्तियाँ आती हैं, उच्च शिक्षा के द्वार असाधारण प्रयास बिना खुलते हैं। सही-गलत की स्वाभाविक समझ बड़ों से सम्मान दिलाती है। दर्शन, विधि या विज्ञान पढ़ें — बृहस्पति जो छूता है विस्तारित करता है। विनम्र रहें; बृहस्पति के वरदान अवसर जितना अहंकार भी बढ़ाते हैं।',
      },
      early_career: {
        en: 'Jupiter with strength launches your career toward advisory, consulting, education, or legal fields where wisdom is currency. Financial growth comes through ethical means — do not shortcut. Marriage or a significant partnership is highly favored; your spouse may bring good fortune and values alignment. International opportunities may present themselves. Say yes to teaching roles, even informally — Jupiter grows through giving.',
        hi: 'बलवान बृहस्पति कैरियर को परामर्श, शिक्षा या विधि क्षेत्रों की ओर प्रक्षेपित करता है जहाँ ज्ञान मुद्रा है। वित्तीय वृद्धि नैतिक मार्ग से आती है — शॉर्टकट न लें। विवाह या महत्वपूर्ण साझेदारी अत्यन्त शुभ है; जीवनसाथी सौभाग्य और मूल्य-सामंजस्य ला सकते हैं। अन्तर्राष्ट्रीय अवसर प्रस्तुत हो सकते हैं। शिक्षण भूमिकाओं को हाँ कहें।',
      },
      householder: {
        en: 'This is Jupiter\'s golden period in your life — children thrive, wealth expands through legitimate channels, and your reputation as a person of integrity solidifies. Religious or philosophical engagement deepens. If you have been meaning to build a puja room, fund a school, or support a temple, do it now. Your dharmic actions during this Jupiter period set the karmic trajectory for the next two decades.',
        hi: 'यह आपके जीवन में बृहस्पति का स्वर्णिम काल है — सन्तान फलती-फूलती है, वैध मार्गों से धन विस्तृत होता है, ईमानदार व्यक्ति की प्रतिष्ठा सुदृढ़ होती है। धार्मिक या दार्शनिक सक्रियता गहरी होती है। पूजा-कक्ष बनाना, विद्यालय-सहायता या मन्दिर-सेवा की योजना हो तो अभी करें। इस बृहस्पति काल के धार्मिक कर्म अगले दो दशकों की कार्मिक दिशा निर्धारित करते हैं।',
      },
      established: {
        en: 'Strong Jupiter at this stage confers the role of elder guide — people seek your counsel not for expertise alone but for judgment born of lived ethics. Your children\'s marriages and careers benefit from your active involvement. Wealth preservation through conservative, dharma-aligned investments is favored. Consider establishing a charitable trust or endowment; Jupiter at this age yearns to give back.',
        hi: 'इस अवस्था में बलवान बृहस्पति आपको वरिष्ठ मार्गदर्शक की भूमिका देता है — लोग केवल विशेषज्ञता नहीं, जीवन-अनुभवजन्य विवेक के लिए आपकी सलाह माँगते हैं। सन्तान के विवाह और कैरियर आपकी सक्रिय भागीदारी से लाभान्वित। धर्म-अनुकूल रूढ़िवादी निवेश द्वारा धन संरक्षण शुभ है। धर्मार्थ न्यास या दान-कोष स्थापित करने पर विचार करें।',
      },
      elder: {
        en: 'Jupiter dignified in elder years is the priest of the family — your blessings carry real weight. Perform rituals, bless newlyweds, name grandchildren, and officiate family ceremonies. Your spiritual practice produces visible results at this age; meditation reveals insights that youth could not access. Health of the liver and thighs remains good; maintain it with moderate diet and walking.',
        hi: 'वृद्धावस्था में गरिमामय बृहस्पति परिवार का पुरोहित है — आपके आशीर्वाद में वास्तविक भार है। अनुष्ठान करें, नवविवाहितों को आशीर्वाद दें, पोतों का नामकरण करें, पारिवारिक संस्कार सम्पन्न कराएँ। इस आयु में आध्यात्मिक साधना दृश्य परिणाम देती है; ध्यान ऐसी अन्तर्दृष्टि प्रकट करता है जो युवावस्था में सम्भव नहीं थी।',
      },
      sage: {
        en: 'A strong Jupiter in the sage phase is the crowning placement of a life well-lived. You embody dharma without trying. Your mere presence elevates the consciousness of those around you. Scriptural study is no longer intellectual exercise — you live the verses. Teach who asks, bless who approaches, and spend your remaining days in the service of truth. Jupiter has prepared you for this your entire life.',
        hi: 'संन्यास काल में बलवान बृहस्पति सुजीवित जीवन का मुकुट-स्थान है। आप बिना प्रयास धर्म के प्रतीक बनते हैं। आपकी मात्र उपस्थिति आसपास की चेतना ऊँची करती है। शास्त्र-अध्ययन अब बौद्धिक व्यायाम नहीं — आप श्लोकों को जीते हैं। जो पूछे उसे सिखाएँ, जो आए उसे आशीर्वाद दें, शेष दिन सत्य की सेवा में बिताएँ।',
      },
    },
    neutral: {
      student: {
        en: 'Neutral Jupiter in student years gives adequate guidance and academic support without extraordinary luck. You will need to work for your grades rather than coast on natural ability. Teacher-student relationships are functional but not transformative. Seek mentors outside the classroom — a family pandit, an uncle in your field of interest, or online educators who expand your horizon beyond the syllabus.',
        hi: 'छात्र काल में तटस्थ बृहस्पति पर्याप्त मार्गदर्शन और शैक्षिक सहयोग देता है पर असाधारण भाग्य नहीं। अंकों के लिए परिश्रम करना होगा, प्राकृतिक क्षमता पर नहीं चल सकते। शिक्षक-छात्र सम्बन्ध कार्यात्मक हैं पर रूपान्तरकारी नहीं। कक्षा के बाहर गुरु खोजें — पारिवारिक पण्डित, रुचि-क्षेत्र में चाचा, या पाठ्यक्रम से परे क्षितिज विस्तारित करने वाले ऑनलाइन शिक्षक।',
      },
      early_career: {
        en: 'Neutral Jupiter supports professional growth through steady dharmic effort, not windfalls. Career in education, law, or finance is possible but requires persistence. Marriage timing is neither accelerated nor delayed — it follows your own readiness. Financial growth is moderate; avoid speculative investments that promise Jupiter-sized returns without Jupiter-level strength behind them.',
        hi: 'तटस्थ बृहस्पति अप्रत्याशित लाभ नहीं, निरन्तर धार्मिक प्रयास से पेशेवर विकास का समर्थन करता है। शिक्षा, विधि या वित्त में कैरियर सम्भव पर धैर्य चाहिए। विवाह समय न त्वरित न विलम्बित — आपकी तैयारी का अनुसरण करता है। वित्तीय वृद्धि मध्यम; बृहस्पति-स्तर बल बिना बृहस्पति-आकार प्रतिफल का वादा करने वाले सट्टा निवेशों से बचें।',
      },
      householder: {
        en: 'Neutral Jupiter during the householder phase gives you a functional moral compass and adequate family happiness. Children are healthy and reasonably well-behaved but may not be academic stars. Your spiritual life is present but not deeply engaging — you attend rituals out of duty more than devotion. This is acceptable; not everyone receives Jupiter\'s fire. Do the basics consistently and the depth will come in time.',
        hi: 'गृहस्थ काल में तटस्थ बृहस्पति कार्यात्मक नैतिक दिशासूचक और पर्याप्त पारिवारिक सुख देता है। सन्तान स्वस्थ और उचित व्यवहार वाली है पर शैक्षिक सितारा नहीं हो सकती। आध्यात्मिक जीवन उपस्थित पर गहराई से संलग्न नहीं — भक्ति से अधिक कर्तव्यवश अनुष्ठान। यह स्वीकार्य है; सबको बृहस्पति की अग्नि नहीं मिलती। मूल बातें निरन्तर करें।',
      },
      established: {
        en: 'Jupiter at neutral dignity during this phase gives you enough wisdom to avoid major mistakes but not enough to be sought as a sage. Your children\'s life decisions may cause moderate concern — guide without controlling. Financial surplus is modest; charitable giving should match your capacity, not your aspiration. Focus on consolidating your spiritual practice into a daily habit rather than occasional bursts.',
        hi: 'इस अवस्था में तटस्थ बृहस्पति बड़ी भूलों से बचने का पर्याप्त ज्ञान देता है पर ऋषि के रूप में माँगे जाने जितना नहीं। सन्तान के जीवन-निर्णय मध्यम चिन्ता उत्पन्न कर सकते हैं — नियन्त्रण नहीं, मार्गदर्शन करें। वित्तीय अधिशेष मामूली; दान क्षमता के अनुरूप हो, महत्वाकांक्षा के नहीं। आध्यात्मिक अभ्यास को दैनिक आदत में रूपान्तरित करें।',
      },
      elder: {
        en: 'Neutral Jupiter in elder years gives quiet contentment rather than radiant wisdom. You are at peace with your life choices without being ecstatic about them. Grandchildren bring joy but also obligations; balance your involvement with rest. Religious activities are comforting rather than transformative — and that comfort is valuable in itself. Maintain liver and joint health through moderation in diet and alcohol.',
        hi: 'वृद्धावस्था में तटस्थ बृहस्पति दीप्तिमान ज्ञान के बजाय शान्त सन्तुष्टि देता है। जीवन-निर्णयों से शान्ति है बिना उनसे उत्साहित हुए। पोते-पोतियाँ आनन्द और दायित्व दोनों लाते हैं; भागीदारी और विश्राम सन्तुलित करें। धार्मिक गतिविधियाँ रूपान्तरकारी से अधिक सान्त्वनादायक — और वह सान्त्वना स्वयं मूल्यवान है।',
      },
      sage: {
        en: 'Neutral Jupiter in the sage phase means your spiritual evolution is gradual, not dramatic. You will not have sudden enlightenment experiences, but a slow deepening of peace that is equally valid. Read sacred texts daily — even a few verses. Attend satsang when possible. Your understanding grows like a tree, not like a lightning bolt. The path of steady practice leads to the same summit as the path of sudden grace.',
        hi: 'संन्यास काल में तटस्थ बृहस्पति का अर्थ है आध्यात्मिक विकास नाटकीय नहीं, क्रमिक है। अचानक आत्मज्ञान अनुभव नहीं होंगे, पर शान्ति की धीमी गहराई जो समान रूप से मान्य है। प्रतिदिन पवित्र ग्रन्थ पढ़ें — कुछ श्लोक भी। सम्भव हो तो सत्संग में जाएँ। समझ वृक्ष की भाँति बढ़ती है, बिजली की भाँति नहीं।',
      },
    },
    weak: {
      student: {
        en: 'A weak Jupiter in student years is challenging — guidance from teachers is sparse, moral confusion may arise, and higher education faces obstacles. You may question whether formal education is worth the effort. It is — push through. Find your own guru; Jupiter debilitated in the sky does not mean dharma is absent from your life. Read broadly, question everything, and trust that understanding arrives on its own schedule.',
        hi: 'छात्र काल में दुर्बल बृहस्पति चुनौतीपूर्ण है — शिक्षकों से मार्गदर्शन अल्प, नैतिक भ्रम उत्पन्न हो सकता है, उच्च शिक्षा में बाधाएँ। औपचारिक शिक्षा प्रयास के योग्य है या नहीं, प्रश्न उठ सकता है। है — आगे बढ़ते रहें। अपना गुरु स्वयं खोजें; आकाश में नीच बृहस्पति का अर्थ जीवन से धर्म अनुपस्थित नहीं। विस्तृत पढ़ें, सब प्रश्न करें।',
      },
      early_career: {
        en: 'Debilitated Jupiter in early career creates a gap between your values and your professional environment. You may work in places that compromise ethics, or find that honest effort does not reward as quickly as shortcuts. Do not lower your standards — Jupiter weak now teaches you to build dharma from scratch rather than inherit it. Marriage may face delays; when it comes, choose character over horoscope compatibility.',
        hi: 'प्रारम्भिक कैरियर में नीच बृहस्पति मूल्यों और पेशेवर वातावरण के बीच अन्तर उत्पन्न करता है। ऐसे स्थानों में काम कर सकते हैं जो नैतिकता से समझौता करें, या ईमानदार प्रयास शॉर्टकट जितना शीघ्र पुरस्कृत न हो। मानदण्ड न गिराएँ — दुर्बल बृहस्पति अभी विरासत में नहीं, शून्य से धर्म बनाना सिखाता है। विवाह में विलम्ब हो सकता है; चरित्र चुनें।',
      },
      householder: {
        en: 'Weak Jupiter during the householder phase can bring disappointment in children\'s progress, religious doubt, or financial stagnation despite hard work. Do not blame your karma — improve it. Small daily acts of dharma (feeding animals, honest speech, keeping promises) accumulate more karmic merit than grand gestures during a strong Jupiter period. Your spouse\'s faith may compensate where yours wavers; let them lead the household\'s spiritual practice.',
        hi: 'गृहस्थ काल में दुर्बल बृहस्पति सन्तान की प्रगति में निराशा, धार्मिक सन्देह, या कठोर परिश्रम के बावजूद वित्तीय ठहराव ला सकता है। कर्म को दोष न दें — सुधारें। दैनिक छोटे धार्मिक कर्म (पशु-भोजन, सत्य-वचन, वचन-पालन) बलवान बृहस्पति काल की भव्य चेष्टाओं से अधिक कार्मिक पुण्य संचित करते हैं। जीवनसाथी की श्रद्धा आपकी डगमगाती श्रद्धा की क्षतिपूर्ति कर सकती है।',
      },
      established: {
        en: 'Weak Jupiter at this stage forces a reckoning with unfulfilled spiritual and material aspirations. Children may choose paths that disappoint your expectations. Release control over their dharma — they have their own Jupiter cycle. Financial wisdom lies in extreme conservatism now; do not lend large sums or guarantee others\' loans. Wear a yellow sapphire only after consulting a qualified Jyotishi — weak Jupiter gemstones can backfire if the planet is truly afflicted.',
        hi: 'इस अवस्था में दुर्बल बृहस्पति अपूर्ण आध्यात्मिक और भौतिक आकांक्षाओं से जूझने को विवश करता है। सन्तान ऐसे मार्ग चुन सकती है जो आपकी अपेक्षाओं को निराश करें। उनके धर्म पर नियन्त्रण छोड़ें — उनका अपना बृहस्पति चक्र है। वित्तीय विवेक अत्यन्त रूढ़िवाद में है; बड़ी राशि उधार या गारंटी न दें। पुखराज योग्य ज्योतिषी से परामर्श बाद ही पहनें।',
      },
      elder: {
        en: 'Weak Jupiter in elder years may bring cynicism about religion, disillusionment with gurus, or estrangement from grandchildren. These are Jupiter\'s hardest lessons: faith forged through doubt is stronger than faith inherited through comfort. Read the Gita\'s chapter on Shraddha (Chapter 17) — it was written for exactly this placement. Your liver and fat metabolism need attention; avoid heavy foods and alcohol completely.',
        hi: 'वृद्धावस्था में दुर्बल बृहस्पति धर्म के प्रति उपहास, गुरुओं से मोहभंग, या पोतों से अलगाव ला सकता है। ये बृहस्पति के कठिनतम पाठ हैं: सन्देह में तपी श्रद्धा सुविधा में विरासत श्रद्धा से अधिक बलवान है। गीता का श्रद्धा अध्याय (17) पढ़ें — ठीक इसी स्थिति के लिए लिखा गया। यकृत और वसा चयापचय पर ध्यान दें; भारी भोजन और मद्य पूर्णतः त्यागें।',
      },
      sage: {
        en: 'Weak Jupiter in the sage phase strips away all philosophical pretension and leaves you with raw, unadorned experience. This is actually closer to moksha than elaborate spiritual systems. You do not need to understand God — you need to surrender to what you do not understand. The simplest devotion — a single name, a single prayer, a single act of kindness each day — is Jupiter\'s remedy when the planet itself cannot provide.',
        hi: 'संन्यास काल में दुर्बल बृहस्पति सारे दार्शनिक आडम्बर उतार देता है और कच्चा, अनलंकृत अनुभव शेष रखता है। यह वस्तुतः विस्तृत आध्यात्मिक व्यवस्थाओं से मोक्ष के अधिक निकट है। ईश्वर को समझने की आवश्यकता नहीं — जो नहीं समझते उसके प्रति समर्पण। सरलतम भक्ति — एक नाम, एक प्रार्थना, प्रतिदिन एक दयालुता — बृहस्पति का उपाय है जब ग्रह स्वयं नहीं दे सकता।',
      },
    },
  },

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // VENUS — marriage, luxury, art, comfort, relationships, beauty
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  Venus: {
    strong: {
      student: {
        en: 'A strong Venus Mahadasha in student years awakens aesthetic sensibility, romantic attraction, and creative talent simultaneously. Music, art, fashion, design, or the performing arts call powerfully. Balance is crucial — Venus at this age can distract from academics with relationships and pleasure. Channel the beauty instinct into creative projects that also build your portfolio. Your charm opens social doors; use it wisely.',
        hi: 'छात्र काल में बलवान शुक्र महादशा सौन्दर्यबोध, रोमांटिक आकर्षण और सृजनात्मक प्रतिभा एक साथ जगाती है। संगीत, कला, फैशन, डिज़ाइन या प्रदर्शन कलाएँ शक्तिशाली रूप से बुलाती हैं। सन्तुलन महत्वपूर्ण — इस आयु में शुक्र सम्बन्धों और आनन्द से शिक्षा से विचलित कर सकता है। सौन्दर्य-प्रवृत्ति को ऐसी सृजनात्मक परियोजनाओं में लगाएँ जो पोर्टफोलियो भी बनाएँ।',
      },
      early_career: {
        en: 'Venus dignified in early career is the signature of success in luxury, beauty, entertainment, or hospitality industries. Relationships and networking come effortlessly — leverage this for professional growth. Marriage prospects are excellent; your partner is likely attractive, cultured, and supportive. Financial comforts arrive early. The only risk is complacency — Venus can make you too comfortable to push for greatness.',
        hi: 'प्रारम्भिक कैरियर में गरिमामय शुक्र विलासिता, सौन्दर्य, मनोरंजन या आतिथ्य उद्योगों में सफलता की पहचान है। सम्बन्ध और नेटवर्किंग सहज आते हैं — पेशेवर विकास के लिए उपयोग करें। विवाह की सम्भावनाएँ उत्कृष्ट; साथी आकर्षक, सुसंस्कृत और सहयोगी होने की सम्भावना। वित्तीय सुविधाएँ जल्दी आती हैं। एकमात्र जोखिम आत्मसन्तोष — शुक्र इतना आरामदायक बना सकता है कि महानता की ओर धक्का न लगे।',
      },
      householder: {
        en: 'This is Venus at home — literally and figuratively. Your house becomes a beautiful, welcoming space. Marriage is harmonious, physical intimacy is fulfilling, and social life sparkles. Luxury purchases (vehicles, jewelry, home décor) are well-timed. Your artistic side, even if dormant, deserves expression now — paint, sing, garden, or cook for pleasure. Venus rewards those who honor beauty as a spiritual practice.',
        hi: 'यह शुक्र अपने घर में है — शाब्दिक और रूपक दोनों अर्थों में। आपका घर सुन्दर, स्वागतयोग्य स्थान बनता है। विवाह सामंजस्यपूर्ण, शारीरिक सम्बन्ध सन्तोषजनक और सामाजिक जीवन चमकता है। विलासिता खरीदारी (वाहन, आभूषण, गृह-सज्जा) का सही समय। कलात्मक पक्ष, सुप्त भी हो, अब अभिव्यक्ति का हकदार — चित्र बनाएँ, गाएँ, बागवानी करें।',
      },
      established: {
        en: 'Strong Venus at this stage preserves your attractiveness — not just physically, but in terms of social grace, cultural refinement, and the ability to make others feel welcome. Your marriage matures into deep companionship. Invest in experiences (travel, concerts, fine dining) rather than more possessions. Your daughters or daughter-in-law may bring particular joy now. Art collection, if you can afford it, becomes an enduring legacy.',
        hi: 'इस अवस्था में बलवान शुक्र आपका आकर्षण संरक्षित रखता है — केवल शारीरिक नहीं, सामाजिक शिष्टता, सांस्कृतिक परिष्कार और दूसरों को सहज कराने की क्षमता में। विवाह गहरी साहचर्यता में परिपक्व होता है। अधिक सम्पत्ति की बजाय अनुभवों (यात्रा, संगीत, भोजन) में निवेश करें। पुत्रियाँ या बहू विशेष आनन्द ला सकती हैं। कला-संग्रह स्थायी विरासत बनता है।',
      },
      elder: {
        en: 'Venus dignified in elder years is a graceful aging — you retain beauty in your manner, your home, and your relationships. Your spouse is your greatest comfort now; invest in that bond daily. Attend cultural events, listen to classical music, and surround yourself with flowers and pleasant scents. Venus governs the kidneys and reproductive system; stay hydrated and address urinary concerns early.',
        hi: 'वृद्धावस्था में गरिमामय शुक्र गरिमापूर्ण वृद्धत्व है — आप अपने व्यवहार, घर और सम्बन्धों में सौन्दर्य बनाए रखते हैं। जीवनसाथी अब आपकी सबसे बड़ी सान्त्वना; प्रतिदिन उस बन्धन में निवेश करें। सांस्कृतिक कार्यक्रमों में जाएँ, शास्त्रीय संगीत सुनें, स्वयं को फूलों और सुगन्ध से घेरें। शुक्र गुर्दे का स्वामी है; पर्याप्त जल पिएँ।',
      },
      sage: {
        en: 'Venus in the sage phase with dignity transforms physical beauty into spiritual beauty. You appreciate the divine aesthetic in a sunset, a face, a melody, or a verse of scripture with an intensity that transcends desire. Bhakti through music and art is your most natural path. Your presence brings comfort simply because you embody grace. Let your final years be a living poem — beautiful, unhurried, and complete.',
        hi: 'गरिमा सहित संन्यास काल में शुक्र भौतिक सौन्दर्य को आध्यात्मिक सौन्दर्य में रूपान्तरित करता है। सूर्यास्त, चेहरे, धुन या शास्त्र-श्लोक में दिव्य सौन्दर्यशास्त्र की ऐसी तीव्रता से सराहना जो इच्छा से परे है। संगीत और कला द्वारा भक्ति आपका सबसे स्वाभाविक मार्ग। आपकी उपस्थिति सान्त्वना देती है क्योंकि आप अनुग्रह के प्रतीक हैं।',
      },
    },
    neutral: {
      student: {
        en: 'Neutral Venus gives you an appreciation for beauty and relationships without being consumed by them. You can enjoy arts and social life while maintaining academic focus. Romantic interests exist but do not overwhelm. This balance is actually healthier than a strong Venus at this age. Use the creative instinct for practical purposes — design thinking, presentation skills, and interpersonal communication in group projects.',
        hi: 'तटस्थ शुक्र सौन्दर्य और सम्बन्धों की सराहना देता है बिना उनमें खो जाने के। शैक्षिक ध्यान बनाए रखते हुए कला और सामाजिक जीवन का आनन्द ले सकते हैं। रोमांटिक रुचियाँ हैं पर अभिभूत नहीं करतीं। यह सन्तुलन इस आयु में बलवान शुक्र से वस्तुतः स्वस्थ है। सृजनात्मक प्रवृत्ति व्यावहारिक उद्देश्यों में उपयोग करें — डिज़ाइन चिन्तन, प्रस्तुति कौशल।',
      },
      early_career: {
        en: 'Neutral Venus in early career supports comfortable professional relationships and adequate social skills. You will not dazzle but you will not repel. Marriage comes at a standard pace; the partner is suitable if not extraordinary. Salary supports a comfortable lifestyle without luxury. Focus on building skills that compound — Venus will not shortcut you to wealth, so earn it through competence in Venus-adjacent fields.',
        hi: 'प्रारम्भिक कैरियर में तटस्थ शुक्र सुविधाजनक पेशेवर सम्बन्ध और पर्याप्त सामाजिक कौशल का समर्थन करता है। चकाचौंध नहीं पर प्रतिकूल भी नहीं। विवाह सामान्य गति से; साथी उपयुक्त पर असाधारण नहीं। वेतन विलासिता बिना सुविधाजनक जीवनशैली का समर्थन करता है। संयोजी कौशल बनाने पर ध्यान दें — शुक्र धन का शॉर्टकट नहीं देगा।',
      },
      householder: {
        en: 'Neutral Venus in the householder phase maintains domestic harmony without fireworks. Your home is comfortable but not showcase-worthy. Marriage is stable but may lack the spark of romance — make conscious date nights a priority, not an afterthought. Financial comfort is sufficient for a good life; do not chase luxury you cannot sustain. Your children\'s creative interests deserve your encouragement even if you do not share them.',
        hi: 'गृहस्थ काल में तटस्थ शुक्र बिना आतिशबाजी घरेलू सामंजस्य बनाए रखता है। घर सुविधाजनक पर प्रदर्शन-योग्य नहीं। विवाह स्थिर पर रोमांस की चिंगारी कम हो सकती है — सचेत डेट नाइट को प्राथमिकता बनाएँ। वित्तीय सुविधा अच्छे जीवन के लिए पर्याप्त; जो विलासिता बनाए नहीं रख सकते उसका पीछा न करें। सन्तान की सृजनात्मक रुचियाँ प्रोत्साहित करें।',
      },
      established: {
        en: 'At this stage, neutral Venus asks you to find beauty in simplicity rather than acquisition. You have accumulated enough material comfort. Turn Venus energy toward appreciating what exists — a garden, a long marriage, a favorite piece of music. Your social circle narrows naturally; quality over quantity in friendships is Venus\'s gift at this dignity. Kidney function and blood sugar deserve monitoring.',
        hi: 'इस अवस्था में तटस्थ शुक्र अधिग्रहण में नहीं, सरलता में सौन्दर्य खोजने को कहता है। पर्याप्त भौतिक सुविधा संचित हो चुकी। शुक्र ऊर्जा जो है उसकी सराहना की ओर मोड़ें — बगीचा, दीर्घ विवाह, पसन्दीदा संगीत। सामाजिक वृत्त स्वाभाविक रूप से सिकुड़ता है; मित्रता में गुणवत्ता बनाम मात्रा इस गरिमा पर शुक्र का उपहार है।',
      },
      elder: {
        en: 'Neutral Venus in elder years provides sufficient relationship warmth and aesthetic appreciation to prevent isolation. Keep your living space tidy and pleasant — even small beauty (fresh flowers, clean linens) elevates your mood. Your spouse or partner relationship may feel routine; introduce small gestures of affection. Venus does not require grand romance at this age — just reliable, daily tenderness.',
        hi: 'वृद्धावस्था में तटस्थ शुक्र एकान्त रोकने के लिए पर्याप्त सम्बन्ध ऊष्मा और सौन्दर्य सराहना देता है। रहने का स्थान सुव्यवस्थित और सुखद रखें — छोटा सौन्दर्य भी (ताज़े फूल, स्वच्छ चादरें) मन ऊँचा करता है। जीवनसाथी सम्बन्ध दिनचर्या-सा लग सकता है; स्नेह के छोटे संकेत लाएँ। इस आयु में शुक्र भव्य रोमांस नहीं, विश्वसनीय दैनिक कोमलता चाहता है।',
      },
      sage: {
        en: 'Neutral Venus in the sage phase offers a quiet appreciation for life\'s beauty without attachment. You enjoy a flower without needing to own the garden. This detached aesthetic sense is actually closer to true Venusian wisdom than the fierce possessiveness of youth. Listen to devotional music, maintain personal cleanliness and grooming as a form of self-respect, and let beauty be your window into the divine.',
        hi: 'संन्यास काल में तटस्थ शुक्र बिना आसक्ति जीवन के सौन्दर्य की शान्त सराहना देता है। बगीचे के स्वामी हुए बिना फूल का आनन्द लेते हैं। यह अनासक्त सौन्दर्यबोध वस्तुतः युवावस्था की तीव्र स्वामित्व-भावना से अधिक सच्चा शुक्र-ज्ञान है। भक्ति संगीत सुनें, व्यक्तिगत स्वच्छता आत्म-सम्मान के रूप में बनाए रखें।',
      },
    },
    weak: {
      student: {
        en: 'Weak Venus in student years may bring social awkwardness, difficulty forming romantic relationships, or feeling unattractive compared to peers. Art and beauty seem out of reach. Do not despair — Venus debilitated teaches you that worth comes from within, not from appearance or possessions. Develop skills that are valuable regardless of charm. Your time for love and beauty will come when Venus strengthens through age and experience.',
        hi: 'छात्र काल में दुर्बल शुक्र सामाजिक अजीबता, रोमांटिक सम्बन्ध बनाने में कठिनाई, या साथियों की तुलना में अनाकर्षक अनुभव ला सकता है। कला और सौन्दर्य पहुँच से दूर लगते हैं। निराश न हों — नीच शुक्र सिखाता है कि मूल्य भीतर से आता है, रूप या सम्पत्ति से नहीं। आकर्षण से निरपेक्ष मूल्यवान कौशल विकसित करें। प्रेम और सौन्दर्य का समय आएगा।',
      },
      early_career: {
        en: 'A debilitated Venus in early career makes relationships the area of greatest struggle. Marriage may be delayed, or the partner may not match your expectations. Financial comforts are harder to achieve — luxury feels permanently out of reach. Do not let this make you bitter. Build wealth through Saturn-like discipline (savings, frugality) rather than Venus-like attraction (networking, charm). White clothes on Fridays and Lakshmi mantra provide subtle support.',
        hi: 'प्रारम्भिक कैरियर में नीच शुक्र सम्बन्धों को सबसे बड़ा संघर्ष-क्षेत्र बनाता है। विवाह में विलम्ब या साथी अपेक्षाओं के अनुरूप न हो सकता है। वित्तीय सुविधाएँ कठिन — विलासिता स्थायी रूप से पहुँच से दूर लगती है। कड़वाहट न आने दें। शुक्र-शैली (नेटवर्किंग) से नहीं, शनि-शैली अनुशासन (बचत, मितव्ययिता) से धन बनाएँ। शुक्रवार श्वेत वस्त्र और लक्ष्मी मन्त्र सहायक।',
      },
      householder: {
        en: 'Weak Venus during the householder phase tests your marriage severely. Lack of romance, physical distance, or financial disagreements may surface. Affairs are a temptation that will make things worse, not better — Venus debilitated does not find fulfillment through indulgence. Instead, invest in communication and couples therapy. Your home may feel stark; small beauty additions (plants, music, warm lighting) are Venus remedies more effective than gemstones.',
        hi: 'गृहस्थ काल में दुर्बल शुक्र विवाह की कठोर परीक्षा लेता है। रोमांस की कमी, शारीरिक दूरी, या वित्तीय मतभेद उभर सकते हैं। बाह्य सम्बन्ध का प्रलोभन स्थिति बदतर करेगा, बेहतर नहीं — नीच शुक्र भोग से पूर्णता नहीं पाता। संवाद और दाम्पत्य चिकित्सा में निवेश करें। घर नीरस लगे तो छोटे सौन्दर्य-परिवर्धन (पौधे, संगीत, गर्म प्रकाश) रत्नों से अधिक प्रभावी शुक्र उपाय हैं।',
      },
      established: {
        en: 'Weak Venus at this stage often resurfaces old wounds about love and self-worth. You may feel that life denied you the beauty, companionship, or luxury you deserved. Grieve this honestly, then release it. Your remaining decades are too precious for resentment. Find one source of beauty that reliably brings you peace — a garden, a craft, a daily walk through beautiful surroundings — and make it non-negotiable.',
        hi: 'इस अवस्था में दुर्बल शुक्र प्रायः प्रेम और आत्म-मूल्य के पुराने घाव पुनः उभारता है। अनुभव हो सकता है कि जीवन ने सौन्दर्य, साहचर्य या विलासिता से वंचित रखा। ईमानदारी से शोक करें, फिर मुक्त करें। शेष दशक आक्रोश के लिए बहुत मूल्यवान हैं। सौन्दर्य का एक स्रोत खोजें जो विश्वसनीय रूप से शान्ति दे — बगीचा, शिल्प, सुन्दर परिवेश में सैर — और अनिवार्य बनाएँ।',
      },
      elder: {
        en: 'Weak Venus in elder years can bring loneliness, especially if you have lost your spouse or if the marriage became distant. Reconnect with beauty through accessible means — radio music, temple visits, feeding birds in a garden. Do not withdraw from social occasions even when they feel uncomfortable; isolation deepens Venus weakness. Kidney and diabetes care is essential; get regular checks and follow medical advice faithfully.',
        hi: 'वृद्धावस्था में दुर्बल शुक्र एकान्त ला सकता है, विशेषतः यदि जीवनसाथी खो दिया या विवाह दूर हो गया। सुलभ माध्यमों से सौन्दर्य से पुनः जुड़ें — रेडियो संगीत, मन्दिर दर्शन, बगीचे में पक्षियों को दाना। सामाजिक अवसरों से पीछे न हटें चाहे असहज लगें; एकान्त शुक्र दुर्बलता गहरी करता है। गुर्दा और मधुमेह देखभाल अनिवार्य।',
      },
      sage: {
        en: 'A weak Venus in the sage phase paradoxically accelerates detachment from material beauty — which is the very goal of this life stage. You are freed from the tyranny of wanting things to be beautiful before accepting them. The world is enough as it is. If loneliness persists, serve others — cooking for an ashram, tending a temple garden, or simply holding someone\'s hand. Venus weak teaches love through giving, not receiving.',
        hi: 'संन्यास काल में दुर्बल शुक्र विरोधाभासी रूप से भौतिक सौन्दर्य से वैराग्य तेज करता है — जो इस जीवन-चरण का लक्ष्य ही है। स्वीकारने से पहले चीजों के सुन्दर होने की माँग से मुक्त होते हैं। संसार जैसा है, पर्याप्त है। एकान्त बना रहे तो सेवा करें — आश्रम में भोजन बनाना, मन्दिर बगीचे की देखभाल, या किसी का हाथ थामना। दुर्बल शुक्र प्रेम देकर सिखाता है, पाकर नहीं।',
      },
    },
  },

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // SATURN — discipline, longevity, labor, karma, delays-then-rewards
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  Saturn: {
    strong: {
      student: {
        en: 'Saturn rewards your discipline now — academic rigor, competitive preparation, and structured routines bear fruit. Accept institutional authority as a teacher, not an enemy. The delays you feel are Saturn\'s way of building depth that peers who skip ahead will lack. Hard sciences, engineering, law, and government exams favor you if you commit to the long grind without shortcuts.',
        hi: 'शनि अभी आपके अनुशासन को पुरस्कृत करता है — शैक्षिक कठोरता, प्रतियोगी तैयारी और व्यवस्थित दिनचर्या फल देती है। संस्थागत अधिकार को शत्रु नहीं, शिक्षक स्वीकारें। जो विलम्ब अनुभव करते हैं वह शनि का वह गहराई बनाने का तरीका है जो आगे कूदने वाले साथियों में नहीं होगी। कठिन विज्ञान, इंजीनियरिंग, विधि शॉर्टकट बिना अनुकूल हैं।',
      },
      early_career: {
        en: 'A strong Saturn in early career is the slow-burn success story. You will not be the youngest VP, but you will be the most enduring one. Government service, judiciary, mining, agriculture, or any field requiring patience and systems-thinking suits you. Your work ethic impresses seniors who remember their own Saturn period. Avoid job-hopping — Saturn rewards loyalty with compounding returns over decades.',
        hi: 'प्रारम्भिक कैरियर में बलवान शनि धीमी-दहन सफलता कहानी है। सबसे युवा VP नहीं होंगे, पर सबसे स्थायी होंगे। सरकारी सेवा, न्यायपालिका, खनन, कृषि या धैर्य और व्यवस्था-चिन्तन वाला कोई भी क्षेत्र अनुकूल। कार्य-नीति वरिष्ठों को प्रभावित करती है। नौकरी बदलने से बचें — शनि निष्ठा को दशकों में संयोजी प्रतिफल से पुरस्कृत करता है।',
      },
      householder: {
        en: 'Strong Saturn during the householder phase builds structures that last — your home, your savings, your career position are all fortified. You may feel the weight of responsibility more than joy, but this is Saturn\'s nature; the joy comes later, when the structure you built protects your family through hardship. Teach your children discipline by example. Iron and calcium supplements support Saturn\'s bones and joints.',
        hi: 'गृहस्थ काल में बलवान शनि स्थायी संरचनाएँ बनाता है — घर, बचत, कैरियर पद सब सुदृढ़। आनन्द से अधिक उत्तरदायित्व का भार अनुभव हो सकता है, पर यह शनि का स्वभाव है; आनन्द बाद आता है, जब बनाई संरचना कठिनाई में परिवार की रक्षा करती है। अनुशासन उदाहरण से सिखाएँ। लोहा और कैल्शियम शनि की हड्डियों और जोड़ों का समर्थन करते हैं।',
      },
      established: {
        en: 'This is where Saturn\'s lifelong patience begins to pay dividends. Decades of disciplined work crystallize into institutional authority, financial security, and earned respect. You are now the senior that younger people admire or fear — be fair. Estate planning, trust creation, and succession frameworks are Saturn tasks perfectly suited to this phase. Your joints and spine need attention; yoga and swimming maintain what Saturn built.',
        hi: 'यहाँ शनि के आजीवन धैर्य का लाभांश शुरू होता है। दशकों का अनुशासित कार्य संस्थागत अधिकार, वित्तीय सुरक्षा और अर्जित सम्मान में रूपान्तरित होता है। अब आप वह वरिष्ठ हैं जिनकी युवा प्रशंसा या भय करते हैं — न्यायसंगत रहें। सम्पत्ति नियोजन, न्यास निर्माण और उत्तराधिकार ढाँचे इस चरण के शनि कार्य हैं। जोड़ और रीढ़ पर ध्यान दें।',
      },
      elder: {
        en: 'A dignified Saturn in elder years is the mark of a person who aged well because they lived well. Your discipline, which felt burdensome in youth, is now your greatest asset — you are healthy, financially secure, and emotionally stable because you did the work. Mentoring younger people in your field is Saturn\'s highest expression at this age. Your body is maintained, not vibrant; keep the maintenance consistent.',
        hi: 'वृद्धावस्था में गरिमामय शनि उस व्यक्ति की पहचान है जो अच्छा बूढ़ा हुआ क्योंकि अच्छा जीया। अनुशासन जो युवावस्था में बोझ लगता था, अब सबसे बड़ी सम्पदा — स्वस्थ, आर्थिक रूप से सुरक्षित और भावनात्मक रूप से स्थिर क्योंकि परिश्रम किया। अपने क्षेत्र में युवाओं का मार्गदर्शन इस आयु में शनि की सर्वोच्च अभिव्यक्ति है।',
      },
      sage: {
        en: 'Saturn dignified in the sage phase is the rarest of gifts — a long life well-lived, ending with clarity and purpose. You have earned your peace through decades of karma yoga. Your body is old but functional; your mind is steady. Sit with the certainty that comes from having done your duty. The fear of death that others carry does not trouble you — you and Saturn have been preparing for this passage your entire life.',
        hi: 'संन्यास काल में गरिमामय शनि दुर्लभतम वरदान है — सुजीवित दीर्घ जीवन, स्पष्टता और उद्देश्य के साथ समापन। दशकों के कर्मयोग से शान्ति अर्जित की है। शरीर वृद्ध पर कार्यात्मक; मन स्थिर। कर्तव्यपालन से आई निश्चितता में बैठें। मृत्यु का भय जो दूसरे वहन करते हैं, आपको व्यथित नहीं करता — आप और शनि इस यात्रा के लिए जीवनभर तैयार होते रहे।',
      },
    },
    neutral: {
      student: {
        en: 'Neutral Saturn in student years brings moderate academic pressure and standard-pace progress. You are not the top of the class but you are consistent. Exams require genuine preparation — no last-minute miracles. Part-time work or early financial responsibility may build character. Accept that your path is longer than some peers\'; Saturn\'s rewards come to those who do not quit when the pace frustrates them.',
        hi: 'छात्र काल में तटस्थ शनि मध्यम शैक्षिक दबाव और सामान्य गति से प्रगति लाता है। कक्षा में शीर्ष नहीं पर निरन्तर हैं। परीक्षाओं में वास्तविक तैयारी चाहिए — अन्तिम-क्षण चमत्कार नहीं। अंशकालिक कार्य या प्रारम्भिक वित्तीय उत्तरदायित्व चरित्र बना सकता है। स्वीकारें कि मार्ग कुछ साथियों से लम्बा है; शनि उन्हें पुरस्कृत करता है जो गति से निराश होकर छोड़ते नहीं।',
      },
      early_career: {
        en: 'Neutral Saturn in early career means steady but unspectacular professional growth. You hold positions of moderate responsibility without rapid advancement. This is not failure — it is foundation-building. Use this period to develop expertise that will compound over the next two decades. Avoid comparing your timeline with peers in Jupiter or Venus dashas who seem to leap ahead. Your turn comes later, and it lasts longer.',
        hi: 'प्रारम्भिक कैरियर में तटस्थ शनि स्थिर पर अनाकर्षक पेशेवर विकास देता है। तीव्र उन्नति बिना मध्यम उत्तरदायित्व के पद संभालते हैं। यह विफलता नहीं — आधार-निर्माण है। अगले दो दशकों में संयोजित होने वाली विशेषज्ञता विकसित करें। बृहस्पति या शुक्र दशा वाले साथियों से अपनी समय-रेखा तुलना से बचें। आपकी बारी बाद आती है, और अधिक टिकती है।',
      },
      householder: {
        en: 'Neutral Saturn during the householder phase gives you enough structure to maintain family obligations without excess. Finances are manageable but require budgeting. Your home is functional, not luxurious. Accept this middle path — not every life needs to be materially spectacular. Focus on what Saturn values: reliability, consistency, and showing up every single day for the people who depend on you.',
        hi: 'गृहस्थ काल में तटस्थ शनि पारिवारिक दायित्व निभाने की पर्याप्त संरचना देता है, अतिरिक्त नहीं। वित्त प्रबन्धनीय पर बजट चाहिए। घर कार्यात्मक, विलासितापूर्ण नहीं। यह मध्य मार्ग स्वीकारें — हर जीवन भौतिक रूप से भव्य नहीं होना चाहिए। शनि जो मूल्य रखता है उस पर ध्यान दें: विश्वसनीयता, निरन्तरता, और आप पर निर्भर लोगों के लिए हर दिन उपस्थित होना।',
      },
      established: {
        en: 'At this stage, neutral Saturn gives you a realistic assessment of your life\'s achievements — neither inflated nor diminished. You have done reasonably well. The question is whether you have done enough to sustain your family through your remaining decades and beyond. If not, this is the last window for focused saving and planning. Joint replacement, dental work, and bone density scans are timely Saturn-body maintenance.',
        hi: 'इस अवस्था में तटस्थ शनि जीवन उपलब्धियों का यथार्थ आकलन देता है — न बढ़ा-चढ़ा न घटाया। उचित रूप से अच्छा किया है। प्रश्न है शेष दशकों और उसके बाद परिवार को बनाए रखने के लिए पर्याप्त किया है या नहीं। यदि नहीं, यह केन्द्रित बचत और नियोजन का अन्तिम अवसर है। जोड़ प्रतिस्थापन, दन्त कार्य और अस्थि जाँच समयोचित शनि-शरीर रखरखाव हैं।',
      },
      elder: {
        en: 'Neutral Saturn in elder years means aging at a standard pace — neither prematurely nor with exceptional vitality. Follow medical advice, maintain daily routines, and accept help when offered. Your pension or savings sustain you adequately. The greatest Saturn virtue at this age is acceptance — not resignation, but the dignified acknowledgment that time shapes all things and that you have shaped your share well.',
        hi: 'वृद्धावस्था में तटस्थ शनि सामान्य गति से वृद्धत्व देता है — न समय से पहले न असाधारण जीवनशक्ति से। चिकित्सकीय सलाह पालें, दैनिक दिनचर्या बनाए रखें, प्रस्तावित सहायता स्वीकारें। पेंशन या बचत पर्याप्त बनाए रखती है। इस आयु में शनि का सबसे बड़ा गुण स्वीकृति है — त्याग नहीं, यह गरिमामय स्वीकृति कि समय सब कुछ आकार देता है।',
      },
      sage: {
        en: 'Neutral Saturn in the sage phase gives a quiet, unremarkable transition into life\'s final chapter. There is no dramatic spiritual awakening, but there is a steady, reliable peace that comes from having lived without major regret. Maintain your routines — they are your anchor. Pray simply, eat simply, sleep at fixed hours. Saturn asks nothing spectacular of you now; just consistency, as it always has.',
        hi: 'संन्यास काल में तटस्थ शनि जीवन के अन्तिम अध्याय में शान्त, अनाकर्षक संक्रमण देता है। नाटकीय आध्यात्मिक जागृति नहीं, पर बिना बड़े पछतावे जीने से आई स्थिर, विश्वसनीय शान्ति। दिनचर्या बनाए रखें — वही आपका लंगर है। सरल प्रार्थना, सरल भोजन, निश्चित समय पर नींद। शनि अब भव्य कुछ नहीं माँगता; बस निरन्तरता, जैसा सदा माँगता रहा।',
      },
    },
    weak: {
      student: {
        en: 'A weak Saturn Mahadasha in student years feels like swimming against a relentless current. Academic setbacks, financial hardship in the family, or chronic health issues may slow you down. This is not permanent — Saturn debilitated tests you early so that later success is unshakeable. Study with absolute sincerity, even when results seem unjust. Avoid all shortcuts and dishonesty; weak Saturn punishes them more harshly than any other placement.',
        hi: 'छात्र काल में दुर्बल शनि महादशा अथक धारा के विरुद्ध तैरने जैसा अनुभव कराती है। शैक्षिक पराजय, पारिवारिक आर्थिक कठिनाई, या दीर्घकालिक स्वास्थ्य समस्याएँ धीमा कर सकती हैं। यह स्थायी नहीं — नीच शनि जल्दी परीक्षा लेता है ताकि बाद की सफलता अडिग हो। परिणाम अन्यायपूर्ण लगें तब भी पूर्ण ईमानदारी से पढ़ें। शॉर्टकट से बचें।',
      },
      early_career: {
        en: 'Weak Saturn in early career is one of the most frustrating placements — you work harder than everyone and advance slower. Bosses are unfair, promotions go to less deserving candidates, and the system feels rigged against you. It is tempting to become cynical. Do not. Keep your integrity absolute and your effort consistent. Saturn debilitated is not denying you success — it is delaying it until you are strong enough to hold it without corruption.',
        hi: 'प्रारम्भिक कैरियर में दुर्बल शनि सर्वाधिक निराशाजनक स्थितियों में से एक — सबसे अधिक परिश्रम और सबसे धीमी उन्नति। वरिष्ठ अन्यायी, पदोन्नतियाँ कम योग्य को, व्यवस्था आपके विरुद्ध। निन्दक बनने का प्रलोभन है। न बनें। ईमानदारी पूर्ण और प्रयास निरन्तर रखें। नीच शनि सफलता नकार नहीं रहा — विलम्बित कर रहा है जब तक भ्रष्टाचार बिना संभालने योग्य न बनें।',
      },
      householder: {
        en: 'A debilitated Saturn during the householder phase brings the heaviest karmic load — financial stress, chronic illness in the family, aging parents requiring intensive care, or career stagnation despite decades of service. You may feel like Atlas holding up a world that does not appreciate you. Seek help. Delegate. Do not try to carry everything alone; weak Saturn breaks those who refuse to share the load. Hanuman Chalisa on Saturdays and mustard oil donation are traditional remedies.',
        hi: 'गृहस्थ काल में नीच शनि सबसे भारी कार्मिक बोझ लाता है — वित्तीय तनाव, परिवार में दीर्घ रोग, गहन देखभाल चाहने वाले वृद्ध माता-पिता, या दशकों की सेवा के बावजूद कैरियर ठहराव। एटलस की भाँति अनुभव जो अप्रशंसित संसार उठाए है। सहायता लें। सौंपें। सब अकेले न उठाएँ; दुर्बल शनि उन्हें तोड़ता है जो बोझ बाँटने से इनकार करते हैं। शनिवार हनुमान चालीसा और सरसों तेल दान पारम्परिक उपाय।',
      },
      established: {
        en: 'Weak Saturn at this stage may bring premature aging, chronic joint or bone disease, or the collapse of structures you spent decades building. A business may fail, a marriage may end, or a health crisis may force early retirement. Saturn is not cruel — it is clearing karmic debt. Accept losses with dignity, protect your health above all else, and remember: you survived this far, which means you are stronger than your Saturn placement suggests.',
        hi: 'इस अवस्था में दुर्बल शनि समय-पूर्व वृद्धत्व, दीर्घकालिक जोड़/अस्थि रोग, या दशकों में बनाई संरचनाओं का ढहना ला सकता है। व्यापार विफल, विवाह समाप्त, या स्वास्थ्य संकट से समय-पूर्व सेवानिवृत्ति। शनि क्रूर नहीं — कार्मिक ऋण चुकता कर रहा है। गरिमा से हानि स्वीकारें, सबसे ऊपर स्वास्थ्य रक्षा करें, याद रखें: यहाँ तक जीवित बचे, अर्थात शनि स्थिति से अधिक बलवान हैं।',
      },
      elder: {
        en: 'Weak Saturn in elder years is physically demanding — joints ache, energy is low, and the body feels older than its years. Chronic conditions require management, not cure. The emotional temptation is to feel that life was unjust. Perhaps it was. But the fact that you endured is itself a Saturn victory. Keep moving, however slowly. Accept medical interventions without false pride. Warmth — warm food, warm rooms, warm blankets — is the best Saturn medicine for an aging body.',
        hi: 'वृद्धावस्था में दुर्बल शनि शारीरिक रूप से माँग वाला है — जोड़ दर्द, ऊर्जा कम, शरीर अपने वर्षों से अधिक वृद्ध। दीर्घकालिक स्थितियों का प्रबन्धन चाहिए, इलाज नहीं। भावनात्मक प्रलोभन है जीवन अन्यायी था ऐसा महसूस करना। शायद था। पर आपने सहन किया, यही शनि विजय है। कितनी भी धीरे, चलते रहें। चिकित्सकीय हस्तक्षेप बिना झूठे अभिमान स्वीकारें।',
      },
      sage: {
        en: 'Weak Saturn in the final life stage is the ultimate test of spiritual surrender. Your body may barely cooperate, your finances may be limited, and the world may seem to have forgotten you. Let it. You are not here for the world anymore — you are here for the soul\'s final journey. Every moment of physical discomfort is Saturn dissolving the last attachments to the body. Bear it with patience. The liberation you have always read about is closer than you think.',
        hi: 'जीवन के अन्तिम चरण में दुर्बल शनि आध्यात्मिक समर्पण की अन्तिम परीक्षा है। शरीर मुश्किल से सहयोग करे, वित्त सीमित, संसार भूल गया लगे। भूलने दें। आप अब संसार के लिए नहीं — आत्मा की अन्तिम यात्रा के लिए हैं। शारीरिक कष्ट का हर क्षण शनि शरीर से अन्तिम आसक्तियाँ विलीन कर रहा है। धैर्य से सहें। जिस मुक्ति के बारे में सदा पढ़ा, वह आपकी सोच से निकट है।',
      },
    },
  },

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // RAHU — worldly ambition, unconventional paths, obsession, foreign
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  Rahu: {
    strong: {
      student: {
        en: 'A strong Rahu Mahadasha in student years amplifies ambition beyond what your environment can contain. You dream bigger than your peers and may feel restless in conventional education. Technology, foreign languages, and unconventional subjects attract you powerfully. Study abroad opportunities or international competitions may materialize. Channel this massive desire-energy into one focused goal — Rahu scattered produces anxiety, Rahu concentrated produces breakthroughs.',
        hi: 'छात्र काल में बलवान राहु महादशा महत्वाकांक्षा को वातावरण की सीमा से परे बढ़ाती है। साथियों से बड़े सपने देखते हैं और पारम्परिक शिक्षा में बेचैनी अनुभव हो सकती है। प्रौद्योगिकी, विदेशी भाषाएँ और अपारम्परिक विषय शक्तिशाली रूप से आकर्षित करते हैं। विदेश अध्ययन अवसर आ सकते हैं। इस विशाल इच्छा-ऊर्जा को एक केन्द्रित लक्ष्य में लगाएँ — बिखरा राहु चिन्ता देता है, केन्द्रित राहु सफलता।',
      },
      early_career: {
        en: 'Rahu with strength in early career propels you toward cutting-edge industries, foreign assignments, or careers your family has no precedent for. You may break into technology, media, diplomacy, or international finance. The hunger for success is almost painful — use it as fuel, not as identity. Guard against ethical shortcuts that Rahu whispers when conventional paths feel too slow. Your rise will be dramatic; make sure the foundation can hold it.',
        hi: 'प्रारम्भिक कैरियर में बलवान राहु अत्याधुनिक उद्योगों, विदेशी नियुक्तियों, या परिवार में अभूतपूर्व कैरियर की ओर प्रक्षेपित करता है। प्रौद्योगिकी, मीडिया, कूटनीति या अन्तर्राष्ट्रीय वित्त में प्रवेश कर सकते हैं। सफलता की भूख लगभग दर्दनाक — ईंधन बनाएँ, पहचान नहीं। नैतिक शॉर्टकट से बचें जो राहु फुसफुसाता है। उत्थान नाटकीय होगा; नींव सम्भाल सके सुनिश्चित करें।',
      },
      householder: {
        en: 'Strong Rahu during the householder phase creates a life that looks extraordinary from the outside — foreign residence, unconventional marriage, or a career in uncharted territory. Material comforts are impressive but come with a restlessness that never fully settles. Your children may be raised between cultures. Grounding practices (daily routine, Indian cooking, temple visits) prevent Rahu from unmooring you entirely. Enjoy the ride, but remember who you were before Rahu amplified everything.',
        hi: 'गृहस्थ काल में बलवान राहु बाहर से असाधारण दिखने वाला जीवन बनाता है — विदेश निवास, अपारम्परिक विवाह, या अज्ञात क्षेत्र में कैरियर। भौतिक सुविधाएँ प्रभावशाली पर बेचैनी पूर्णतः नहीं बैठती। सन्तान संस्कृतियों के बीच पल सकती है। ग्राउंडिंग अभ्यास (दैनिक दिनचर्या, भारतीय भोजन, मन्दिर दर्शन) राहु को पूर्णतः उखाड़ने से रोकते हैं।',
      },
      established: {
        en: 'A strong Rahu at this stage brings recognition from unexpected quarters — awards, media attention, or invitations to exclusive circles. The worldly success you chased is now arriving. Savor it without clinging. Begin transitioning your Rahu energy from acquisition to distribution — mentor unconventional thinkers, fund innovative projects, or build bridges between cultures you have inhabited. Your unique path becomes your legacy.',
        hi: 'इस अवस्था में बलवान राहु अप्रत्याशित स्रोतों से मान्यता लाता है — पुरस्कार, मीडिया ध्यान, या विशिष्ट मण्डलियों में निमन्त्रण। जिस लौकिक सफलता का पीछा किया वह अब आ रही है। बिना चिपके आनन्द लें। राहु ऊर्जा को अधिग्रहण से वितरण में परिवर्तित करें — अपारम्परिक विचारकों का मार्गदर्शन, नवाचारी परियोजनाओं का वित्तपोषण।',
      },
      elder: {
        en: 'Strong Rahu in elder years keeps you relevant in ways that conventional aging does not — you are the elder who uses technology, travels internationally, and stays current with global trends. This vitality is a gift, but it can also prevent the necessary inward turn that this life stage demands. Schedule deliberate periods of disconnection from the world. Rahu has given you everything worldly; now ask what lies beyond it.',
        hi: 'वृद्धावस्था में बलवान राहु आपको ऐसे प्रासंगिक रखता है जो पारम्परिक वृद्धत्व नहीं करता — प्रौद्योगिकी उपयोग करने, अन्तर्राष्ट्रीय यात्रा और वैश्विक प्रवृत्तियों से अद्यतन रहने वाले वृद्ध। यह जीवनशक्ति वरदान है, पर इस जीवन-चरण की आवश्यक अन्तर्मुखी मुड़ भी रोक सकती है। संसार से सोचे-समझे विलगाव की अवधियाँ निर्धारित करें।',
      },
      sage: {
        en: 'Rahu strong in the sage phase is paradoxical — the planet of worldly desire active during the stage of renunciation. You may find yourself drawn to foreign spiritual traditions, modern meditation techniques, or technology-assisted sadhana. This is not wrong; Rahu at its highest uses worldly tools for otherworldly goals. But be vigilant against spiritual materialism — collecting experiences instead of dissolving the collector. One genuine moment of surrender outweighs a thousand retreats.',
        hi: 'संन्यास काल में बलवान राहु विरोधाभासी है — त्याग की अवस्था में लौकिक इच्छा का ग्रह सक्रिय। विदेशी आध्यात्मिक परम्पराओं, आधुनिक ध्यान तकनीकों, या प्रौद्योगिकी-सहायित साधना की ओर आकर्षण हो सकता है। यह गलत नहीं; सर्वोच्च राहु लौकिक उपकरणों का अलौकिक लक्ष्यों हेतु उपयोग करता है। पर आध्यात्मिक भौतिकवाद से सतर्क रहें।',
      },
    },
    neutral: {
      student: {
        en: 'Neutral Rahu in student years gives moderate ambition with manageable restlessness. You are curious about the unconventional but not consumed by it. Technology and modern subjects interest you alongside traditional ones. Your peer group may include people from diverse backgrounds who broaden your worldview. Study what genuinely interests you rather than what Rahu\'s anxiety pushes you toward — at neutral strength, Rahu responds better to authentic desire than manufactured urgency.',
        hi: 'छात्र काल में तटस्थ राहु प्रबन्धनीय बेचैनी के साथ मध्यम महत्वाकांक्षा देता है। अपारम्परिक में जिज्ञासा है पर उसमें खोए नहीं। प्रौद्योगिकी और आधुनिक विषय पारम्परिक के साथ रुचिकर हैं। मित्र-वृत्त में विविध पृष्ठभूमि के लोग हो सकते हैं। राहु की चिन्ता जो धकेले उसके बजाय वास्तव में जो रुचिकर है वह पढ़ें — तटस्थ राहु प्रामाणिक इच्छा पर बेहतर प्रतिक्रिया करता है।',
      },
      early_career: {
        en: 'Neutral Rahu in early career supports moderate innovation within existing structures. You can work in technology, media, or cross-cultural roles without the extreme risk-taking of a strong Rahu. Foreign collaborations are possible but require effort to maintain. Your career path is unconventional enough to be interesting but not so radical that it alienates your family. This is a sustainable balance — honor it.',
        hi: 'प्रारम्भिक कैरियर में तटस्थ राहु मौजूदा संरचनाओं में मध्यम नवाचार का समर्थन करता है। बलवान राहु के अत्यधिक जोखिम बिना प्रौद्योगिकी, मीडिया या अन्तर-सांस्कृतिक भूमिकाओं में काम कर सकते हैं। विदेशी सहयोग सम्भव पर बनाए रखने में प्रयास चाहिए। कैरियर पथ इतना अपारम्परिक कि रोचक पर इतना कट्टर नहीं कि परिवार से दूर करे।',
      },
      householder: {
        en: 'Neutral Rahu during the householder phase adds a touch of the unconventional to family life — perhaps an interfaith marriage, children studying abroad, or a career pivot that surprises relatives. These are manageable disruptions that enrich rather than destabilize. Material desires exist but do not dominate. Keep one grounding tradition (family meals, weekly temple, annual pilgrimage) as an anchor against Rahu\'s inherent rootlessness.',
        hi: 'गृहस्थ काल में तटस्थ राहु पारिवारिक जीवन में अपारम्परिक छुअन जोड़ता है — अन्तर्धार्मिक विवाह, विदेश में पढ़ती सन्तान, या रिश्तेदारों को चकित करने वाला कैरियर परिवर्तन। ये प्रबन्धनीय व्यवधान हैं जो अस्थिर करने से अधिक समृद्ध करते हैं। भौतिक इच्छाएँ हैं पर हावी नहीं। राहु की जड़हीनता के विरुद्ध एक ग्राउंडिंग परम्परा रखें।',
      },
      established: {
        en: 'At this stage, neutral Rahu gives you enough worldly ambition to stay engaged without the obsessive quality that burns people out. You can mentor younger unconventional thinkers from a position of stability. International connections remain active but do not define your identity. Begin converting Rahu experiences into stories and lessons — your unique path has wisdom that conventional achievers cannot offer.',
        hi: 'इस अवस्था में तटस्थ राहु सक्रिय रहने की पर्याप्त लौकिक महत्वाकांक्षा देता है बिना जलाने वाले आवेशी गुण के। स्थिरता की स्थिति से युवा अपारम्परिक विचारकों का मार्गदर्शन कर सकते हैं। अन्तर्राष्ट्रीय सम्पर्क सक्रिय रहते हैं पर पहचान परिभाषित नहीं करते। राहु अनुभवों को कथाओं और पाठों में बदलें।',
      },
      elder: {
        en: 'Neutral Rahu in elder years means you remain mentally curious without the physical drive to act on every impulse. You watch the world change with interest rather than anxiety. Video calls with foreign friends, documentaries about distant cultures, and occasional travel satisfy Rahu\'s wanderlust without exhausting your body. Accept that some desires will remain unfulfilled — and that this is not tragedy but simply life\'s natural contour.',
        hi: 'वृद्धावस्था में तटस्थ राहु हर आवेग पर कार्य करने की शारीरिक प्रेरणा बिना मानसिक जिज्ञासा बनाए रखता है। चिन्ता से नहीं, रुचि से संसार बदलते देखते हैं। विदेशी मित्रों से वीडियो कॉल, दूर संस्कृतियों की डॉक्यूमेंट्री, और कभी-कभी यात्रा राहु की भ्रमण-लालसा शरीर थकाए बिना सन्तुष्ट करती है।',
      },
      sage: {
        en: 'Neutral Rahu in the sage phase means worldly desires are present as whispers, not shouts. You can observe them arise and pass without acting. This is excellent training for meditation. Let Rahu show you the mind\'s restless nature without succumbing to it. When the craving for novelty arises, sit with it. It will pass. What remains after the craving passes is closer to your true self than anything the craving promised.',
        hi: 'संन्यास काल में तटस्थ राहु का अर्थ है लौकिक इच्छाएँ चीख नहीं, फुसफुसाहट हैं। उन्हें उत्पन्न और गुजरते बिना कार्य किए देख सकते हैं। यह ध्यान का उत्कृष्ट प्रशिक्षण है। राहु को मन की अशान्त प्रकृति दिखाने दें बिना उसके वश में हुए। नवीनता की लालसा उठे तो उसके साथ बैठें। गुजर जाएगी। लालसा गुजरने के बाद जो शेष रहता है वह आपके सच्चे स्वरूप के अधिक निकट है।',
      },
    },
    weak: {
      student: {
        en: 'Weak Rahu in student years creates confusion about direction — you do not know what you want, and what you think you want keeps changing. Foreign opportunities may seem possible but fizzle. Technology frustrates rather than excites. This is Rahu teaching you that worldly ambition alone cannot sustain you. Focus on what does not change: your core values, your family\'s needs, and building genuine competence. The clarity will come after this dasha passes.',
        hi: 'छात्र काल में दुर्बल राहु दिशा-भ्रम उत्पन्न करता है — क्या चाहते हैं नहीं जानते, और जो सोचते हैं बदलता रहता है। विदेशी अवसर सम्भव लगें पर निष्फल हों। प्रौद्योगिकी उत्साहित करने से अधिक निराश करती है। राहु सिखा रहा है कि केवल लौकिक महत्वाकांक्षा आपको बनाए नहीं रख सकती। जो नहीं बदलता उस पर ध्यान दें: मूल मूल्य, परिवार की आवश्यकताएँ। स्पष्टता दशा गुजरने पर आएगी।',
      },
      early_career: {
        en: 'A debilitated Rahu in early career may lead to wrong career choices driven by illusion — joining a startup that fails, moving abroad for a job that does not materialize, or investing in schemes that promise impossible returns. Rahu weak creates mirages. Verify everything three times before committing. Stick to proven, boring career paths for now — excitement can wait until your planetary period supports it. Avoid occult practices and substance use during this period.',
        hi: 'प्रारम्भिक कैरियर में नीच राहु भ्रम-प्रेरित गलत कैरियर निर्णयों की ओर ले जा सकता है — विफल होने वाले स्टार्टअप में शामिल होना, न मिलने वाली नौकरी के लिए विदेश जाना। दुर्बल राहु मृगतृष्णा उत्पन्न करता है। वचनबद्ध होने से पहले सब तीन बार सत्यापित करें। अभी सिद्ध, उबाऊ कैरियर पथ पर रहें — उत्तेजना तब तक प्रतीक्षा कर सकती है जब ग्रह-काल सहयोग करे।',
      },
      householder: {
        en: 'Weak Rahu during the householder phase can destabilize family life through deception — not necessarily yours, but someone in your circle may deceive you. Financial frauds, fake advisors, or unreliable friends can cause significant damage. Verify every major financial transaction independently. Marital trust may be tested; address suspicions openly rather than letting Rahu\'s paranoia fester. Ground yourself in routine, prayer, and the tangible reality of your family\'s daily needs.',
        hi: 'गृहस्थ काल में दुर्बल राहु छल द्वारा पारिवारिक जीवन अस्थिर कर सकता है — आवश्यक नहीं आपका, पर वृत्त में कोई धोखा दे सकता है। वित्तीय धोखाधड़ी, नकली सलाहकार, या अविश्वसनीय मित्र महत्वपूर्ण क्षति कर सकते हैं। हर बड़ा वित्तीय लेन-देन स्वतन्त्र रूप से सत्यापित करें। वैवाहिक विश्वास की परीक्षा हो सकती है; सन्देहों को राहु की व्यामोह सड़ने देने से बेहतर खुलकर सम्बोधित करें।',
      },
      established: {
        en: 'Weak Rahu at this stage may trigger a midlife identity crisis — the feeling that the conventional path you chose was wrong, that you should have been bolder. This is Rahu\'s illusion speaking. You chose wisely by choosing stability. Do not abandon solid ground for mirages at this age. If you feel unfulfilled, add a creative or cross-cultural hobby — paint, learn a language, volunteer with immigrants — but do not uproot your life.',
        hi: 'इस अवस्था में दुर्बल राहु मध्य-जीवन पहचान संकट उत्पन्न कर सकता है — अनुभूति कि चुना पारम्परिक मार्ग गलत था, अधिक साहसी होना चाहिए था। यह राहु का भ्रम बोल रहा है। स्थिरता चुनकर बुद्धिमानी से चुना। इस आयु में ठोस ज़मीन छोड़ मृगतृष्णा के पीछे न भागें। अतृप्ति हो तो सृजनात्मक या अन्तर-सांस्कृतिक शौक जोड़ें, पर जीवन उखाड़ें नहीं।',
      },
      elder: {
        en: 'Weak Rahu in elder years can bring phobias, irrational anxieties, or obsessive fears about death, disease, or financial ruin. These are Rahu shadows — they feel real but are disproportionate to actual risk. Share your fears with a trusted person; spoken aloud, they lose much of their power. Avoid news consumption before bed; Rahu feeds on anxiety-producing information. Durga Saptashati or Rahu-specific mantras on Saturday evenings can help calm the shadow planet.',
        hi: 'वृद्धावस्था में दुर्बल राहु भय, अतार्किक चिन्ताएँ, या मृत्यु, रोग, वित्तीय बर्बादी के आवेशी डर ला सकता है। ये राहु छायाएँ हैं — वास्तविक लगती हैं पर वास्तविक जोखिम से अनुपातहीन। भयों को विश्वसनीय व्यक्ति से साझा करें; बोलने पर बहुत शक्ति खो देते हैं। सोने से पहले समाचार से बचें; राहु चिन्ता-उत्पादक सूचना से पोषित होता है।',
      },
      sage: {
        en: 'A weak Rahu in the sage phase can paradoxically serve spiritual growth — the planet of illusion, when weakened, loses its grip on your mind. Worldly desires feel hollow, cravings for novelty seem pointless, and the restless search for meaning finally exhausts itself. What remains is presence. This is not depression — it is the quiet that comes when the storm of wanting passes. Rest in it. You have arrived not by reaching a destination, but by ceasing to run.',
        hi: 'संन्यास काल में दुर्बल राहु विरोधाभासी रूप से आध्यात्मिक विकास की सेवा कर सकता है — भ्रम का ग्रह दुर्बल होने पर मन पर पकड़ खोता है। लौकिक इच्छाएँ खोखली, नवीनता की लालसा निरर्थक, और अर्थ की बेचैन खोज अन्ततः स्वयं थकती है। जो शेष रहता है — उपस्थिति। यह अवसाद नहीं — यह चाहत का तूफान गुजरने पर आई शान्ति है। इसमें विश्राम करें।',
      },
    },
  },

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // KETU — spirituality, detachment, past-life karma, sudden events
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  Ketu: {
    strong: {
      student: {
        en: 'A strong Ketu Mahadasha in student years brings unusual intellectual maturity — you may be drawn to philosophy, mysticism, or ancient languages while your peers chase trends. Academic performance is erratic: brilliant in subjects you care about, indifferent in those you do not. Do not fight this unevenness; lean into your strengths. Ketu blesses intuition and pattern recognition. Mathematics, research, and spiritual study suit you better than rote memorization.',
        hi: 'छात्र काल में बलवान केतु महादशा असामान्य बौद्धिक परिपक्वता लाती है — जब साथी प्रवृत्तियों का पीछा करें, आप दर्शन, रहस्यवाद या प्राचीन भाषाओं की ओर आकर्षित हो सकते हैं। शैक्षिक प्रदर्शन अनियमित: रुचि के विषयों में प्रतिभाशाली, शेष में उदासीन। इस असमानता से न लड़ें; शक्तियों की ओर झुकें। गणित, शोध और आध्यात्मिक अध्ययन रटने से बेहतर अनुकूल।',
      },
      early_career: {
        en: 'Strong Ketu in early career creates a professional path that defies conventional logic. You may leave a lucrative job for spiritual pursuit, choose research over management, or find success in healing arts, astrology, or niche technical fields. Material ambition feels hollow — and that is Ketu\'s gift, not a flaw. Follow the path that feels meaningful even if it pays less. Ketu ensures that what you need arrives, even when you stop chasing it.',
        hi: 'प्रारम्भिक कैरियर में बलवान केतु पारम्परिक तर्क को चुनौती देने वाला पेशेवर मार्ग बनाता है। आध्यात्मिक अनुसरण के लिए लाभदायक नौकरी छोड़ सकते हैं, प्रबन्धन से अधिक शोध चुन सकते हैं। भौतिक महत्वाकांक्षा खोखली लगती है — और यह केतु का वरदान है, दोष नहीं। जो अर्थपूर्ण लगे वह मार्ग अपनाएँ चाहे कम भुगतान हो। केतु सुनिश्चित करता है कि चाहिए वह पहुँचे।',
      },
      householder: {
        en: 'Ketu strong during the householder phase creates a paradox: you build family and material life while simultaneously feeling detached from it. You may be physically present but mentally in another realm. Your spouse may find you emotionally unavailable. Make conscious effort to be present — Ketu\'s detachment is a spiritual gift but can become domestic negligence. Channel the energy into teaching your children values that outlast material inheritance.',
        hi: 'गृहस्थ काल में बलवान केतु विरोधाभास उत्पन्न करता है: परिवार और भौतिक जीवन बनाते हुए साथ ही उससे विरक्ति अनुभव। शारीरिक रूप से उपस्थित पर मानसिक रूप से दूसरे लोक में हो सकते हैं। जीवनसाथी को भावनात्मक रूप से अनुपलब्ध लग सकते हैं। उपस्थित रहने का सचेत प्रयास करें। सन्तान को भौतिक विरासत से अधिक स्थायी मूल्य सिखाने में ऊर्जा लगाएँ।',
      },
      established: {
        en: 'Strong Ketu at this stage accelerates the natural detachment that midlife brings. You see through professional politics, material competition, and social pretense with clarity that others lack. Use this insight to simplify your life — downsize possessions, reduce obligations, and invest time in spiritual practice. Your ability to let go of what no longer serves you is Ketu\'s greatest gift to the established person.',
        hi: 'इस अवस्था में बलवान केतु मध्य-जीवन की स्वाभाविक विरक्ति को तेज करता है। पेशेवर राजनीति, भौतिक प्रतिस्पर्धा और सामाजिक दिखावे को ऐसी स्पष्टता से देखते हैं जो दूसरों में नहीं। इस अन्तर्दृष्टि से जीवन सरल करें — सम्पत्ति कम करें, दायित्व घटाएँ, आध्यात्मिक अभ्यास में समय लगाएँ। जो अब सेवा नहीं करता उसे छोड़ने की क्षमता केतु का सबसे बड़ा उपहार है।',
      },
      elder: {
        en: 'Ketu dignified in elder years is the spiritual aspirant\'s ideal — your detachment from worldly outcomes allows deep meditation, genuine surrender, and freedom from fear. You may become a source of quiet wisdom that family members do not fully appreciate until after you are gone. Do not seek their understanding; seek only truth. Maintain physical health through Ayurvedic principles — Ketu tends toward vata imbalances. Keep warm, stay regular, and let the inner light guide you.',
        hi: 'वृद्धावस्था में गरिमामय केतु आध्यात्मिक साधक का आदर्श है — लौकिक परिणामों से विरक्ति गहन ध्यान, वास्तविक समर्पण और भय से मुक्ति की अनुमति देती है। आप शान्त ज्ञान का स्रोत बन सकते हैं जिसे परिवार-जन आपके जाने के बाद ही पूर्णतः सराहें। उनकी समझ नहीं, केवल सत्य खोजें। आयुर्वेदिक सिद्धान्तों से शारीरिक स्वास्थ्य बनाए रखें — केतु वात असन्तुलन की ओर झुकता है।',
      },
      sage: {
        en: 'Ketu strong in the sage phase is the placement of the realized soul. The veil between the material and spiritual worlds thins to near transparency. You may experience genuine mystical states — visions, deep absorption, or periods of consciousness that transcend the body-mind. Do not cling to these experiences; they are signposts, not destinations. Your final task is the simplest and the hardest: let go of even the desire for liberation, and let what comes come.',
        hi: 'संन्यास काल में बलवान केतु सिद्ध आत्मा की स्थिति है। भौतिक और आध्यात्मिक संसारों के बीच का पर्दा लगभग पारदर्शी हो जाता है। वास्तविक रहस्यमय अवस्थाएँ अनुभव हो सकती हैं — दर्शन, गहन समाधि, या शरीर-मन से परे चेतना। इन अनुभवों से न चिपकें; ये मार्ग-चिह्न हैं, गन्तव्य नहीं। अन्तिम कार्य सरलतम और कठिनतम: मुक्ति की इच्छा भी छोड़ दें, जो आए आने दें।',
      },
    },
    neutral: {
      student: {
        en: 'Neutral Ketu in student years gives moments of insight interspersed with periods of confusion about purpose. You are drawn to spiritual or metaphysical subjects occasionally but not consistently. This is fine — Ketu at moderate strength plants seeds that bloom much later. Focus on completing your education with diligence. The existential questions that arise are worth noting but not worth derailing your studies over. Journal them for later.',
        hi: 'छात्र काल में तटस्थ केतु उद्देश्य-भ्रम की अवधियों के बीच अन्तर्दृष्टि के क्षण देता है। आध्यात्मिक या आधिभौतिक विषयों की ओर कभी-कभी आकर्षण पर निरन्तर नहीं। यह ठीक है — मध्यम बलवान केतु बीज बोता है जो बहुत बाद खिलते हैं। परिश्रम से शिक्षा पूर्ण करने पर ध्यान दें। उठने वाले अस्तित्वगत प्रश्न नोट करने योग्य हैं पर अध्ययन पटरी से उतारने योग्य नहीं। बाद के लिए लिखें।',
      },
      early_career: {
        en: 'Neutral Ketu in early career creates occasional detachment from professional ambition that puzzles you and your colleagues. You cycle between engagement and withdrawal. Learn to work with this rhythm rather than fighting it. Careers in research, analysis, or behind-the-scenes technical roles accommodate Ketu\'s fluctuating engagement better than front-facing leadership positions. Save aggressively during engaged phases to cushion the withdrawn ones.',
        hi: 'प्रारम्भिक कैरियर में तटस्थ केतु पेशेवर महत्वाकांक्षा से कभी-कभी विरक्ति उत्पन्न करता है जो आपको और सहकर्मियों को चकित करती है। संलग्नता और वापसी के बीच चक्र चलता है। इस लय से लड़ने के बजाय उसके साथ काम करना सीखें। शोध, विश्लेषण या पर्दे-पीछे तकनीकी भूमिकाएँ केतु की उतार-चढ़ाव वाली संलग्नता को अग्रणी नेतृत्व से बेहतर समायोजित करती हैं।',
      },
      householder: {
        en: 'Neutral Ketu during the householder phase adds a philosophical dimension to family life without dominating it. You ask deeper questions than most parents about education, values, and purpose — and your children benefit from this reflectiveness. Material life proceeds normally but occasionally feels insufficient; when this feeling arises, do not act on it impulsively. Sit with it, and it will pass. Maintain a small spiritual practice — even ten minutes of meditation daily suffices.',
        hi: 'गृहस्थ काल में तटस्थ केतु पारिवारिक जीवन में दार्शनिक आयाम जोड़ता है बिना हावी हुए। शिक्षा, मूल्यों और उद्देश्य के बारे में अधिकांश माता-पिता से गहरे प्रश्न पूछते हैं — सन्तान इस चिन्तनशीलता से लाभान्वित। भौतिक जीवन सामान्य चलता है पर कभी-कभी अपर्याप्त लगता है; यह भावना उठे तो आवेगपूर्ण कार्य न करें। बैठें, गुजर जाएगी।',
      },
      established: {
        en: 'Neutral Ketu at this stage brings moderate spiritual interest that enriches without disrupting your established life. You may attend retreats, read philosophical literature, or develop an interest in astrology or healing without abandoning worldly responsibilities. This balanced approach is actually healthy — not everyone needs to renounce. Let Ketu guide your inner life while Saturn (or whoever rules your outer life) handles the rest.',
        hi: 'इस अवस्था में तटस्थ केतु मध्यम आध्यात्मिक रुचि लाता है जो स्थापित जीवन को बाधित किए बिना समृद्ध करती है। ध्यान शिविर, दार्शनिक साहित्य, या ज्योतिष/चिकित्सा में रुचि विकसित हो सकती है लौकिक उत्तरदायित्व छोड़े बिना। यह सन्तुलित दृष्टिकोण वस्तुतः स्वस्थ है — सबको त्यागने की आवश्यकता नहीं। केतु को आन्तरिक जीवन का मार्गदर्शन करने दें।',
      },
      elder: {
        en: 'Neutral Ketu in elder years provides a natural, gradual loosening of worldly attachments. You care less about status, possessions, and opinions than you did a decade ago — and this feels like relief, not loss. Family events still bring joy, but you no longer need them for fulfillment. This is Ketu working gently. Maintain health routines and social connections; Ketu\'s detachment should complement your life, not isolate you from it.',
        hi: 'वृद्धावस्था में तटस्थ केतु लौकिक आसक्तियों का स्वाभाविक, क्रमिक शिथिलीकरण प्रदान करता है। प्रतिष्ठा, सम्पत्ति और मतों की एक दशक पहले से कम परवाह — और यह हानि नहीं, राहत अनुभव होती है। पारिवारिक कार्यक्रम अभी भी आनन्द लाते हैं, पर पूर्णता के लिए उनकी आवश्यकता नहीं। यह केतु सौम्यता से काम कर रहा है। स्वास्थ्य दिनचर्या और सामाजिक सम्पर्क बनाए रखें।',
      },
      sage: {
        en: 'Neutral Ketu in the sage phase supports gentle spiritual deepening without dramatic mystical experiences. Your path is the quiet one — daily prayer, simple living, and steady practice rather than visions and ecstasies. This is the more common and equally valid path to peace. Do not compare your spiritual life to accounts of enlightened masters. Walk your own path at your own pace. Ketu at neutral strength says: you are closer than you think.',
        hi: 'संन्यास काल में तटस्थ केतु नाटकीय रहस्यमय अनुभवों बिना सौम्य आध्यात्मिक गहनता का समर्थन करता है। आपका मार्ग शान्त है — दैनिक प्रार्थना, सरल जीवन, स्थिर अभ्यास, दर्शनों और परमानन्द की बजाय। यह अधिक सामान्य और समान रूप से मान्य शान्ति का मार्ग है। अपने आध्यात्मिक जीवन की तुलना ज्ञानी गुरुओं के वृत्तान्तों से न करें। अपना मार्ग अपनी गति से चलें।',
      },
    },
    weak: {
      student: {
        en: 'Weak Ketu in student years creates a confusing inner landscape — flashes of insight followed by long periods of doubt, sudden disinterest in subjects you once loved, or an inability to concentrate during examinations. You may feel like you do not belong anywhere. This alienation is Ketu\'s shadow; it passes. Ground yourself in physical activities (sports, walks, hands-on crafts) and do not withdraw from peers. Structure your study time rigidly — weak Ketu dissolves discipline.',
        hi: 'छात्र काल में दुर्बल केतु भ्रामक आन्तरिक परिदृश्य उत्पन्न करता है — अन्तर्दृष्टि की चमक के बाद लम्बे सन्देह काल, कभी प्रिय विषयों में अचानक अरुचि, या परीक्षा में एकाग्रता की अक्षमता। कहीं नहीं होने की अनुभूति हो सकती है। यह अलगाव केतु की छाया है; गुजरेगी। शारीरिक गतिविधियों में स्वयं को ग्राउंड करें और साथियों से न हटें। अध्ययन समय कड़ाई से व्यवस्थित करें।',
      },
      early_career: {
        en: 'A debilitated Ketu in early career can cause abrupt, unexplained career disruptions — sudden resignations, conflicts with mentors, or the collapse of projects you invested in spiritually. You may oscillate between complete worldliness and sudden withdrawal. Neither extreme serves you. Find a job with moderate spiritual alignment (non-profit, education, healthcare) that feeds your soul without requiring you to be a monk. Practical grounding is the remedy for weak Ketu, not more spirituality.',
        hi: 'प्रारम्भिक कैरियर में नीच केतु अचानक, अव्याख्येय कैरियर व्यवधान उत्पन्न कर सकता है — अचानक त्यागपत्र, गुरुओं से संघर्ष, या आध्यात्मिक रूप से निवेशित परियोजनाओं का ध्वंस। पूर्ण सांसारिकता और अचानक वापसी के बीच डोल सकते हैं। न कोई अतिरेक सेवा करता है। मध्यम आध्यात्मिक सामंजस्य वाली नौकरी खोजें। व्यावहारिक ग्राउंडिंग दुर्बल केतु का उपाय है, अधिक आध्यात्मिकता नहीं।',
      },
      householder: {
        en: 'Weak Ketu during the householder phase creates sudden disruptions in domestic life — unexpected moves, family separations, or loss of property through circumstances beyond your control. Children may rebel in ways that feel karmic rather than logical. Do not chase spiritual explanations for every setback; sometimes life is simply difficult. Focus on stability: regular meals, fixed addresses, predictable routines. Weak Ketu needs structure more than mantras.',
        hi: 'गृहस्थ काल में दुर्बल केतु घरेलू जीवन में अचानक व्यवधान उत्पन्न करता है — अप्रत्याशित स्थानान्तरण, पारिवारिक विलगाव, या नियन्त्रण से परे परिस्थितियों में सम्पत्ति हानि। सन्तान तार्किक से अधिक कार्मिक लगने वाले तरीकों से विद्रोह कर सकती है। हर पराजय के आध्यात्मिक स्पष्टीकरण का पीछा न करें। स्थिरता पर ध्यान दें: नियमित भोजन, निश्चित पते, पूर्वानुमेय दिनचर्या। दुर्बल केतु को मन्त्रों से अधिक संरचना चाहिए।',
      },
      established: {
        en: 'Weak Ketu at this stage can trigger existential dread — the sudden, gut-level feeling that nothing you built matters. This is not wisdom; it is Ketu\'s shadow. Counter it by reconnecting with the tangible: touch your grandchild, walk on earth, cook a meal from scratch. Your accomplishments do matter. The spiritual impulse underneath the dread is genuine, but act on it through grounded practices (gardening, volunteering, crafting), not through dramatic renunciation.',
        hi: 'इस अवस्था में दुर्बल केतु अस्तित्वगत भय उत्पन्न कर सकता है — अचानक, गहरा अनुभव कि जो बनाया वह महत्वहीन है। यह ज्ञान नहीं; केतु की छाया है। ठोस से पुनः जुड़कर प्रतिकार करें: पोते को स्पर्श करें, पृथ्वी पर चलें, स्वयं भोजन बनाएँ। आपकी उपलब्धियाँ महत्वपूर्ण हैं। भय के नीचे आध्यात्मिक प्रेरणा वास्तविक है, पर ग्राउंडेड अभ्यासों से कार्य करें, नाटकीय त्याग से नहीं।',
      },
      elder: {
        en: 'Weak Ketu in elder years may manifest as confusion, disorientation, or a feeling of being unmoored from reality. Memory lapses may have a Ketu quality — forgetting not names but meaning, feeling present but disconnected. Medical evaluation is important to rule out neurological causes. Spiritually, this is Ketu dissolving the boundaries of self, but at weak dignity it does so clumsily rather than gracefully. Routine, warmth, and the physical presence of family are your best remedies.',
        hi: 'वृद्धावस्था में दुर्बल केतु भ्रम, दिशाभ्रम, या वास्तविकता से कटे होने की अनुभूति के रूप में प्रकट हो सकता है। स्मृति-लोप में केतु गुणवत्ता हो सकती है — नाम नहीं, अर्थ भूलना, उपस्थित पर विलग अनुभव। तान्त्रिक कारणों को नकारने के लिए चिकित्सकीय मूल्यांकन महत्वपूर्ण। आध्यात्मिक रूप से केतु आत्म-सीमाओं को विलीन कर रहा है, पर दुर्बल गरिमा पर अनाड़ीपन से। दिनचर्या, ऊष्मा और परिवार की भौतिक उपस्थिति सर्वश्रेष्ठ उपाय।',
      },
      sage: {
        en: 'Weak Ketu in the sage phase is the most disorienting of all placements — the planet of moksha, debilitated during the life stage designed for moksha. You may feel that spiritual liberation is impossibly far away, that you wasted your life on the wrong priorities. This feeling is itself the last illusion. Liberation is not a place you reach — it is the recognition that you were never separate from the whole. Sit still. Breathe. Let Ketu\'s confusion exhaust itself. What remains is already free.',
        hi: 'संन्यास काल में दुर्बल केतु सभी स्थितियों में सबसे भ्रमकारी है — मोक्ष का ग्रह, मोक्ष के लिए बनी जीवन-अवस्था में नीच। आध्यात्मिक मुक्ति असम्भव रूप से दूर, जीवन गलत प्राथमिकताओं पर बर्बाद किया, अनुभव हो सकता है। यह भावना स्वयं अन्तिम भ्रम है। मुक्ति कोई स्थान नहीं — यह पहचान है कि आप कभी समग्र से अलग नहीं थे। स्थिर बैठें। श्वास लें। केतु के भ्रम को स्वयं थकने दें। जो शेष रहता है, पहले से मुक्त है।',
      },
    },
  },
};

/**
 * Look up life-stage-conditioned dasha advice for a given planet, dignity, and stage.
 *
 * @param planet  — English planet name: Sun, Moon, Mars, Mercury, Jupiter, Venus, Saturn, Rahu, Ketu
 * @param dignity — 'strong' | 'neutral' | 'weak'
 * @param stage   — LifeStage from life-stage.ts
 * @param locale  — 'en' | 'hi' (falls back to 'en' for unsupported locales)
 * @returns Advice string in the requested locale, or empty string if lookup fails
 */
export function getDashaStageAdvice(
  planet: string,
  dignity: DignityLevel,
  stage: LifeStage,
  locale: string,
): string {
  const planetData = DASHA_STAGE_ADVICE[planet];
  if (!planetData) {
    console.error(`[dasha-stage-advice] Unknown planet: ${planet}`);
    return '';
  }

  const dignityData = planetData[dignity];
  if (!dignityData) {
    console.error(`[dasha-stage-advice] Unknown dignity level: ${dignity}`);
    return '';
  }

  const stageData = dignityData[stage];
  if (!stageData) {
    console.error(`[dasha-stage-advice] Unknown life stage: ${stage}`);
    return '';
  }

  // Fall back to English for unsupported locales
  const lang = locale === 'hi' ? 'hi' : 'en';
  return stageData[lang];
}
