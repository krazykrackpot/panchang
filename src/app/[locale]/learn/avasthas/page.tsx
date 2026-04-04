'use client';

import { useState } from 'react';
import { useLocale } from 'next-intl';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, User, Eye, Flame, Heart, Activity } from 'lucide-react';
import { Link } from '@/lib/i18n/navigation';
import type { Locale } from '@/types/panchang';

// ─── Trilingual Labels ────────────────────────────────────────────────────────
const L = {
  title: { en: 'Avasthas — Planetary States', hi: 'अवस्थाएं — ग्रह दशाएं', sa: 'अवस्थाः — ग्रहदशाः' },
  subtitle: {
    en: 'Avasthas reveal HOW a planet delivers its results — not just whether it can. A strong planet in a miserable avastha may have power but deliver it with suffering. A weak planet in a delighted avastha may surprise with grace. Five classification systems from BPHS paint the complete psychological portrait of each planet.',
    hi: 'अवस्थाएं बताती हैं कि ग्रह अपने फल कैसे देता है — केवल यह नहीं कि दे सकता है या नहीं। दुखी अवस्था में बलवान ग्रह शक्तिशाली पर कष्टप्रद फल देता है। प्रसन्न अवस्था में दुर्बल ग्रह कृपा से आश्चर्य कर सकता है। BPHS की पाँच वर्गीकरण प्रणालियाँ प्रत्येक ग्रह का सम्पूर्ण मनोवैज्ञानिक चित्र बनाती हैं।',
    sa: 'अवस्थाः प्रकटयन्ति यथा ग्रहः फलानि ददाति — केवलं शक्तिं न। BPHS-तः पञ्च वर्गीकरणप्रणाल्यः प्रत्येकग्रहस्य सम्पूर्णं मनोवैज्ञानिकचित्रं रचयन्ति।',
  },

  whatTitle: { en: 'What are Avasthas?', hi: 'अवस्थाएं क्या हैं?', sa: 'अवस्थाः काः?' },
  whatP1: {
    en: 'Avastha literally means "state" or "condition" in Sanskrit. In Jyotish, it describes the mood, disposition, and functional quality of a planet. Think of Shadbala as measuring a planet\'s physical fitness, and Avasthas as measuring its emotional state. An Olympic athlete having a panic attack (strong but miserable) will perform differently than a calm amateur (weak but composed). Avasthas capture this human dimension of planetary behavior.',
    hi: 'अवस्था का शाब्दिक अर्थ संस्कृत में "स्थिति" या "दशा" है। ज्योतिष में यह ग्रह के मनोभाव, स्वभाव और कार्यात्मक गुणवत्ता का वर्णन करती है। षड्बल को ग्रह की शारीरिक क्षमता और अवस्था को उसकी भावनात्मक दशा समझें। आतंकग्रस्त ओलम्पिक खिलाड़ी (बलवान पर दुखी) शान्त शौकिया खिलाड़ी (कमजोर पर संयमित) से अलग प्रदर्शन करेगा।',
    sa: 'अवस्था "स्थितिः" इत्यर्थः। ज्योतिषे ग्रहस्य मनोभावं स्वभावं कार्यात्मकगुणवत्तां च वर्णयति।',
  },
  whatP2: {
    en: 'Brihat Parashara Hora Shastra (BPHS), the foundational text of Vedic astrology, describes five distinct classification systems for Avasthas. Each system approaches the planet\'s condition from a different angle. A complete reading synthesizes all five to understand the planet\'s full personality — its age, alertness, dignity, emotional state, and activity level.',
    hi: 'बृहत् पाराशर होरा शास्त्र (BPHS) अवस्थाओं की पाँच भिन्न वर्गीकरण प्रणालियों का वर्णन करता है। प्रत्येक प्रणाली ग्रह की स्थिति को भिन्न कोण से देखती है। सम्पूर्ण पठन पाँचों को संश्लेषित करता है — आयु, सजगता, गरिमा, भावनात्मक दशा और सक्रियता।',
    sa: 'बृहत्पाराशरहोराशास्त्रं (BPHS) अवस्थानां पञ्च वर्गीकरणप्रणालीः वर्णयति।',
  },

  fiveTitle: { en: 'The 5 Classification Systems', hi: '5 वर्गीकरण प्रणालियाँ', sa: '5 वर्गीकरणप्रणाल्यः' },

  // System 1: Baladi
  baladiTitle: { en: '1. Baladi Avasthas — Age States', hi: '1. बालादि अवस्था — आयु दशाएं', sa: '1. बालाद्यवस्थाः — आयुदशाः' },
  baladiDesc: {
    en: 'Based on the planet\'s degree within its sign (0°-30°), the planet is assigned an age. The degree range depends on whether the planet is in an odd or even sign. In odd signs: 0°-6° = Bala, 6°-12° = Kumara, 12°-18° = Yuva, 18°-24° = Vriddha, 24°-30° = Mrita. In even signs the order reverses.',
    hi: 'राशि में ग्रह के अंश (0°-30°) के आधार पर आयु निर्धारित होती है। विषम राशियों में: 0°-6° = बाल, 6°-12° = कुमार, 12°-18° = युवा, 18°-24° = वृद्ध, 24°-30° = मृत। सम राशियों में क्रम उलटा।',
    sa: 'राशौ ग्रहस्य अंशानुसारम् (0°-30°) आयुः निर्धार्यते। विषमराशिषु: बालः, कुमारः, युवा, वृद्धः, मृतः।',
  },
  baladiStates: [
    { name: { en: 'Bala (Infant)', hi: 'बाल (शिशु)', sa: 'बालः' }, quality: { en: '25% results', hi: '25% फल' }, desc: { en: 'Like a newborn — potential exists but cannot yet act. The planet\'s significations are immature, undeveloped. Career planet as Bala: late bloomer.', hi: 'नवजात की तरह — क्षमता है पर कार्य नहीं कर सकता। ग्रह के कारकत्व अपरिपक्व। करियर ग्रह बाल: देर से विकास।' }, color: 'text-blue-300' },
    { name: { en: 'Kumara (Youth)', hi: 'कुमार (युवक)', sa: 'कुमारः' }, quality: { en: '50% results', hi: '50% फल' }, desc: { en: 'Adolescent energy — enthusiastic but inexperienced. Half the promised results manifest. Learning phase for that planet\'s significations.', hi: 'किशोर ऊर्जा — उत्साही पर अनुभवहीन। वादा किए गए आधे फल। उस ग्रह के कारकत्वों का अधिगम चरण।' }, color: 'text-emerald-400' },
    { name: { en: 'Yuva (Prime)', hi: 'युवा (प्रौढ़)', sa: 'युवा' }, quality: { en: '100% results', hi: '100% फल' }, desc: { en: 'Peak performance — the planet delivers its full promise. This is the BEST avastha. All significations express at maximum capacity. The ideal state for any planet.', hi: 'शिखर प्रदर्शन — ग्रह पूर्ण वादा पूरा करता है। सर्वोत्तम अवस्था। सभी कारकत्व अधिकतम क्षमता पर।' }, color: 'text-gold-light' },
    { name: { en: 'Vriddha (Old)', hi: 'वृद्ध (बूढ़ा)', sa: 'वृद्धः' }, quality: { en: '50% results — declining', hi: '50% फल — ह्रासमान' }, desc: { en: 'Past prime — wisdom present but energy waning. Results come but with effort and delay. The planet "knows" but lacks the vigor to execute fully.', hi: 'प्रौढ़ावस्था बीत चुकी — ज्ञान है पर ऊर्जा कम। फल आते हैं पर प्रयास और विलम्ब से। ग्रह "जानता" है पर पूर्ण क्रियान्वयन का बल नहीं।' }, color: 'text-amber-400' },
    { name: { en: 'Mrita (Dead)', hi: 'मृत', sa: 'मृतः' }, quality: { en: '0% results — denied', hi: '0% फल — अस्वीकृत' }, desc: { en: 'Functionally inert. The planet\'s significations are severely blocked. During its dasha, expect the areas it governs to be sources of frustration. Requires strong remedies.', hi: 'कार्यात्मक रूप से निष्क्रिय। ग्रह के कारकत्व गम्भीर रूप से अवरुद्ध। दशा में निराशा के स्रोत। प्रबल उपचार आवश्यक।' }, color: 'text-red-400' },
  ],

  // System 2: Jagradadi
  jagraTitle: { en: '2. Jagradadi Avasthas — Wakefulness States', hi: '2. जाग्रदादि अवस्था — जागरण दशाएं', sa: '2. जाग्रदाद्यवस्थाः' },
  jagraDesc: {
    en: 'Determined by the planet\'s relationship with the sign it occupies. A planet in its own sign, exaltation, or moolatrikona is fully Awake (Jagrat). In a friendly sign, it Dreams (Swapna). In an enemy or debilitation sign, it is in Deep Sleep (Sushupti).',
    hi: 'ग्रह जिस राशि में है उससे उसके सम्बन्ध द्वारा निर्धारित। स्वराशि, उच्च या मूलत्रिकोण में पूर्ण जागृत (जाग्रत)। मित्र राशि में स्वप्न। शत्रु या नीच राशि में सुषुप्ति (गहरी निद्रा)।',
    sa: 'ग्रहस्य राशिसम्बन्धेन निर्धार्यते। स्वराशौ जाग्रत्, मित्रराशौ स्वप्नः, शत्रुराशौ सुषुप्तिः।',
  },
  jagraStates: [
    { name: { en: 'Jagrat (Awake)', hi: 'जाग्रत (जागा)', sa: 'जाग्रत्' }, output: { en: 'Full (100%)', hi: 'पूर्ण (100%)' }, condition: { en: 'Own sign, exaltation, moolatrikona', hi: 'स्वराशि, उच्च, मूलत्रिकोण' }, color: 'text-emerald-400' },
    { name: { en: 'Swapna (Dreaming)', hi: 'स्वप्न', sa: 'स्वप्नः' }, output: { en: 'Half (50%)', hi: 'आधा (50%)' }, condition: { en: 'Friendly sign', hi: 'मित्र राशि' }, color: 'text-amber-400' },
    { name: { en: 'Sushupti (Deep Sleep)', hi: 'सुषुप्ति (गहरी निद्रा)', sa: 'सुषुप्तिः' }, output: { en: 'Quarter (25%)', hi: 'चौथाई (25%)' }, condition: { en: 'Enemy sign, debilitation', hi: 'शत्रु राशि, नीच' }, color: 'text-red-400' },
  ],

  // System 3: Deeptadi
  deeptaTitle: { en: '3. Deeptadi Avasthas — Luminosity States', hi: '3. दीप्तादि अवस्था — प्रकाश दशाएं', sa: '3. दीप्ताद्यवस्थाः' },
  deeptaDesc: {
    en: 'Nine states based on the planet\'s zodiacal condition — from the brilliance of exaltation to the wretchedness of debilitation. This is the most granular system, capturing subtle differences between a planet in its own sign versus a friend\'s sign versus a neutral sign.',
    hi: 'ग्रह की राशिचक्रीय स्थिति पर आधारित नौ दशाएं — उच्च की दीप्ति से नीच की दुर्दशा तक। यह सबसे विस्तृत प्रणाली है, स्वराशि, मित्रराशि और तटस्थ राशि के सूक्ष्म अन्तरों को पकड़ती है।',
    sa: 'ग्रहस्य राशिचक्रस्थित्या आधारिताः नव दशाः — उच्चस्य दीप्तेः नीचस्य दुर्दशापर्यन्तम्।',
  },
  deeptaStates: [
    { name: { en: 'Deepta (Brilliant)', hi: 'दीप्त', sa: 'दीप्तः' }, condition: { en: 'Exalted', hi: 'उच्च' }, result: { en: 'Excellent — full brilliance, fame, success', hi: 'उत्कृष्ट — पूर्ण दीप्ति, यश, सफलता' }, tier: 'excellent' },
    { name: { en: 'Swastha (Content)', hi: 'स्वस्थ', sa: 'स्वस्थः' }, condition: { en: 'Own sign', hi: 'स्वराशि' }, result: { en: 'Very Good — comfortable, productive, natural ease', hi: 'बहुत अच्छा — सहज, उत्पादक, प्राकृतिक सुगमता' }, tier: 'excellent' },
    { name: { en: 'Mudita (Happy)', hi: 'मुदित', sa: 'मुदितः' }, condition: { en: 'Great friend\'s sign', hi: 'अधिमित्र राशि' }, result: { en: 'Good — joy in action, cooperative results', hi: 'अच्छा — कार्य में आनन्द, सहकारी फल' }, tier: 'good' },
    { name: { en: 'Shanta (Peaceful)', hi: 'शान्त', sa: 'शान्तः' }, condition: { en: 'Benefic varga placement', hi: 'शुभ वर्ग स्थिति' }, result: { en: 'Good — calm, steady, spiritually inclined results', hi: 'अच्छा — शान्त, स्थिर, आध्यात्मिक फल' }, tier: 'good' },
    { name: { en: 'Shakta (Powerful)', hi: 'शक्त', sa: 'शक्तः' }, condition: { en: 'Retrograde', hi: 'वक्री' }, result: { en: 'Mixed — intense power, unconventional delivery, delayed then sudden', hi: 'मिश्रित — तीव्र शक्ति, अपरम्परागत, विलम्बित फिर अचानक' }, tier: 'mixed' },
    { name: { en: 'Dina (Miserable)', hi: 'दीन', sa: 'दीनः' }, condition: { en: 'Enemy sign', hi: 'शत्रु राशि' }, result: { en: 'Weak — struggles, needs remedies, unhappy in its placement', hi: 'कमजोर — संघर्ष, उपचार आवश्यक, स्थिति में अप्रसन्न' }, tier: 'weak' },
    { name: { en: 'Vikala (Disabled)', hi: 'विकल', sa: 'विकलः' }, condition: { en: 'Combust (close to Sun)', hi: 'अस्त (सूर्य के निकट)' }, result: { en: 'Weak — identity eclipsed, cannot express independently', hi: 'कमजोर — पहचान ढकी, स्वतन्त्र अभिव्यक्ति नहीं' }, tier: 'weak' },
    { name: { en: 'Khala (Wicked)', hi: 'खल', sa: 'खलः' }, condition: { en: 'Debilitated', hi: 'नीच' }, result: { en: 'Very Weak — delivers opposite of promise, frustration', hi: 'बहुत कमजोर — वादे के विपरीत फल, निराशा' }, tier: 'denied' },
    { name: { en: 'Bhita (Fearful)', hi: 'भीत', sa: 'भीतः' }, condition: { en: 'Planetary war (within 1°)', hi: 'ग्रहयुद्ध (1° के भीतर)' }, result: { en: 'Very Weak — anxious energy, competitive stress, erratic results', hi: 'बहुत कमजोर — चिन्ताग्रस्त ऊर्जा, प्रतिस्पर्धी तनाव' }, tier: 'denied' },
  ],

  // System 4: Lajjitadi
  lajjitaTitle: { en: '4. Lajjitadi Avasthas — Emotional States', hi: '4. लज्जितादि अवस्था — भावनात्मक दशाएं', sa: '4. लज्जिताद्यवस्थाः' },
  lajjitaDesc: {
    en: 'Six emotional states determined by the planet\'s house placement and the other planets it associates with. This system reveals the emotional tone with which the planet operates — whether it feels ashamed, proud, hungry, thirsty, delighted, or agitated.',
    hi: 'ग्रह की भाव स्थिति और सम्बद्ध ग्रहों द्वारा निर्धारित छह भावनात्मक दशाएं। यह प्रणाली ग्रह का भावनात्मक स्वर प्रकट करती है — क्या वह लज्जित, गर्वित, क्षुधित, तृषित, मुदित या क्षुब्ध अनुभव करता है।',
    sa: 'ग्रहस्य भावस्थित्या सम्बद्धग्रहैश्च निर्धारिताः षट् भावनात्मकदशाः।',
  },
  lajjitaStates: [
    { name: { en: 'Lajjita (Ashamed)', hi: 'लज्जित', sa: 'लज्जितः' }, condition: { en: 'Planet in 5th house with Rahu/Ketu/Saturn/Mars', hi: '5वें भाव में राहु/केतु/शनि/मंगल के साथ' }, effect: { en: 'Children delayed, creative blocks, embarrassment in romantic matters', hi: 'सन्तान विलम्ब, सृजनात्मक अवरोध, प्रेम में लज्जा' }, color: 'text-pink-400' },
    { name: { en: 'Garvita (Proud)', hi: 'गर्वित', sa: 'गर्वितः' }, condition: { en: 'Planet exalted or in moolatrikona', hi: 'उच्च या मूलत्रिकोण में' }, effect: { en: 'Confident expression, dignified results, but possible arrogance', hi: 'आत्मविश्वासपूर्ण, गरिमापूर्ण फल, पर सम्भव अहंकार' }, color: 'text-gold-light' },
    { name: { en: 'Kshudhita (Hungry)', hi: 'क्षुधित', sa: 'क्षुधितः' }, condition: { en: 'Planet in enemy sign or aspected by enemy', hi: 'शत्रु राशि में या शत्रु की दृष्टि' }, effect: { en: 'Perpetual craving in that planet\'s domain, never quite satisfied', hi: 'उस ग्रह के क्षेत्र में सतत लालसा, कभी पूर्ण तृप्ति नहीं' }, color: 'text-orange-400' },
    { name: { en: 'Trushita (Thirsty)', hi: 'तृषित', sa: 'तृषितः' }, condition: { en: 'Planet in watery sign aspected by Saturn (no benefic relief)', hi: 'जल राशि में शनि दृष्टि (शुभ राहत नहीं)' }, effect: { en: 'Emotional depletion in that area, seeking fulfillment that stays elusive', hi: 'उस क्षेत्र में भावनात्मक रिक्तता, तृप्ति खोजना पर मिलना नहीं' }, color: 'text-blue-400' },
    { name: { en: 'Mudita (Delighted)', hi: 'मुदित', sa: 'मुदितः' }, condition: { en: 'Planet in friend\'s sign with Jupiter\'s aspect', hi: 'मित्र राशि में गुरु दृष्टि सहित' }, effect: { en: 'Joyful expression, easy success, spiritual grace in its domain', hi: 'आनन्दपूर्ण अभिव्यक्ति, सहज सफलता, आध्यात्मिक कृपा' }, color: 'text-emerald-400' },
    { name: { en: 'Kshobhita (Agitated)', hi: 'क्षोभित', sa: 'क्षोभितः' }, condition: { en: 'Planet conjunct Sun (combust) + malefic aspect', hi: 'सूर्य के साथ (अस्त) + पाप दृष्टि' }, effect: { en: 'Volatile, unpredictable results; anxiety and restlessness in that domain', hi: 'अस्थिर, अप्रत्याशित फल; उस क्षेत्र में चिंता और बेचैनी' }, color: 'text-red-400' },
  ],

  // System 5: Shayanadi
  shayanaTitle: { en: '5. Shayanadi Avasthas — Activity States', hi: '5. शयनादि अवस्था — सक्रियता दशाएं', sa: '5. शयनाद्यवस्थाः' },
  shayanaDesc: {
    en: 'Twelve activity-based states (BPHS lists 12, the most commonly used are 6) determined by complex divisional chart analysis. These describe what the planet is "doing" — lying down, sitting, watching, illuminating, moving, or returning. Each activity level implies a different speed and style of result delivery.',
    hi: 'विभाजित कुण्डली विश्लेषण द्वारा निर्धारित बारह सक्रियता-आधारित दशाएं (सामान्यतः 6 प्रयुक्त)। ये बताती हैं कि ग्रह "क्या कर रहा है" — लेटा, बैठा, देख रहा, प्रकाशित कर रहा, चल रहा या लौट रहा। प्रत्येक सक्रियता स्तर फल वितरण की भिन्न गति और शैली दर्शाती है।',
    sa: 'विभाजितकुण्डलीविश्लेषणेन निर्धारिताः द्वादश सक्रियताधारिताः दशाः।',
  },
  shayanaStates: [
    { name: { en: 'Shayana (Lying down)', hi: 'शयन (लेटा)', sa: 'शयनम्' }, speed: { en: 'Slowest', hi: 'सबसे धीमा' }, desc: { en: 'Planet resting — results come very late, passive energy. Good for 12th house matters (sleep, meditation) but frustrating for career/wealth.', hi: 'ग्रह विश्राम में — फल बहुत देर से, निष्क्रिय ऊर्जा। 12वें भाव (निद्रा, ध्यान) के लिए अच्छा पर करियर/धन के लिए निराशाजनक।' }, color: 'text-indigo-400' },
    { name: { en: 'Upavesha (Sitting)', hi: 'उपवेश (बैठा)', sa: 'उपवेशनम्' }, speed: { en: 'Slow', hi: 'धीमा' }, desc: { en: 'Planet seated and observing — contemplative, results come through patience and waiting. Planning phase rather than action phase.', hi: 'ग्रह बैठकर देख रहा — विचारशील, फल धैर्य और प्रतीक्षा से। कार्य चरण नहीं, योजना चरण।' }, color: 'text-blue-300' },
    { name: { en: 'Netrapani (Open-eyed)', hi: 'नेत्रपाणि (खुली आँख)', sa: 'नेत्रपाणिः' }, speed: { en: 'Moderate', hi: 'मध्यम' }, desc: { en: 'Planet alert and watchful — aware of opportunities, can respond when prompted but not initiating. Reactive rather than proactive.', hi: 'ग्रह सतर्क — अवसरों के प्रति सजग, प्रेरित होने पर प्रतिक्रिया कर सकता है पर पहल नहीं करता।' }, color: 'text-cyan-400' },
    { name: { en: 'Prakasha (Illuminating)', hi: 'प्रकाश', sa: 'प्रकाशः' }, speed: { en: 'Good', hi: 'अच्छा' }, desc: { en: 'Planet radiating — actively spreading its influence, teaching, guiding, illuminating its domain. Excellent for Jupiter and Sun.', hi: 'ग्रह विकिरण कर रहा — सक्रिय रूप से प्रभाव फैला रहा, शिक्षण, मार्गदर्शन। गुरु और सूर्य के लिए उत्कृष्ट।' }, color: 'text-gold-light' },
    { name: { en: 'Gaman (Moving)', hi: 'गमन', sa: 'गमनम्' }, speed: { en: 'Fast', hi: 'तीव्र' }, desc: { en: 'Planet in active motion — results come through travel, change, dynamic action. Great for Mars, Mercury. Signifies progress and forward momentum.', hi: 'ग्रह सक्रिय गति में — फल यात्रा, परिवर्तन, गतिशील कार्य से। मंगल, बुध के लिए उत्तम। प्रगति और गतिशक्ति।' }, color: 'text-emerald-400' },
    { name: { en: 'Agaman (Returning)', hi: 'आगमन', sa: 'आगमनम्' }, speed: { en: 'Variable', hi: 'चर' }, desc: { en: 'Planet returning — revisiting past themes, karmic completion. Often associated with retrograde-like effects even if not retrograde. Second chances, unfinished business.', hi: 'ग्रह लौट रहा — पुरानी विषयवस्तु पर पुनर्विचार, कार्मिक पूर्णता। अक्सर वक्री-जैसे प्रभाव। दूसरा अवसर, अधूरा कार्य।' }, color: 'text-violet-400' },
  ],

  interpretTitle: { en: 'Interpretation Quick Reference', hi: 'व्याख्या त्वरित संदर्भ', sa: 'व्याख्यात्वरितसन्दर्भः' },
  interpretDesc: {
    en: 'How each quality tier affects result delivery:',
    hi: 'प्रत्येक गुणवत्ता स्तर फल वितरण को कैसे प्रभावित करता है:',
    sa: 'प्रत्येकगुणवत्तास्तरः फलवितरणं कथम् प्रभावयति:',
  },
  tiers: [
    { tier: { en: 'Excellent', hi: 'उत्कृष्ट' }, pct: '100%', examples: { en: 'Deepta, Swastha, Garvita, Yuva, Jagrat', hi: 'दीप्त, स्वस्थ, गर्वित, युवा, जाग्रत' }, desc: { en: 'Full promise delivered. Dasha period brings peak results.', hi: 'पूर्ण वादा पूरा। दशा में शिखर फल।' }, color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' },
    { tier: { en: 'Good', hi: 'अच्छा' }, pct: '50-75%', examples: { en: 'Mudita, Shanta, Kumara, Swapna, Prakasha', hi: 'मुदित, शान्त, कुमार, स्वप्न, प्रकाश' }, desc: { en: 'Solid results with some effort. Positive overall direction.', hi: 'कुछ प्रयास से अच्छे फल। समग्र सकारात्मक दिशा।' }, color: 'bg-blue-500/10 text-blue-300 border-blue-500/20' },
    { tier: { en: 'Mixed', hi: 'मिश्रित' }, pct: '25-50%', examples: { en: 'Shakta, Kshudhita, Vriddha, Netrapani', hi: 'शक्त, क्षुधित, वृद्ध, नेत्रपाणि' }, desc: { en: 'Unpredictable — some wins, some losses. Requires mindful navigation.', hi: 'अप्रत्याशित — कुछ जीत, कुछ हार। सचेतन नेविगेशन आवश्यक।' }, color: 'bg-amber-500/10 text-amber-400 border-amber-500/20' },
    { tier: { en: 'Weak', hi: 'कमजोर' }, pct: '0-25%', examples: { en: 'Dina, Vikala, Lajjita, Trushita, Sushupti', hi: 'दीन, विकल, लज्जित, तृषित, सुषुप्ति' }, desc: { en: 'Significant struggle. Remedies essential for that planet\'s matters.', hi: 'महत्वपूर्ण संघर्ष। उस ग्रह के मामलों के लिए उपचार आवश्यक।' }, color: 'bg-red-500/10 text-red-400 border-red-500/20' },
    { tier: { en: 'Denied', hi: 'अस्वीकृत' }, pct: '~0%', examples: { en: 'Mrita, Khala, Bhita, Kshobhita', hi: 'मृत, खल, भीत, क्षोभित' }, desc: { en: 'Results blocked or inverted. Strong remedies + acceptance needed.', hi: 'फल अवरुद्ध या उलटे। प्रबल उपचार + स्वीकृति आवश्यक।' }, color: 'bg-red-500/15 text-red-500 border-red-500/30' },
  ],

  synthesisTitle: { en: 'Synthesizing All 5 Systems', hi: 'पाँचों प्रणालियों का संश्लेषण', sa: 'पञ्चानां प्रणालीनां संश्लेषणम्' },
  synthesisP1: {
    en: 'A complete avastha reading combines all five systems to create a personality sketch for each planet. For example: Jupiter at 15° Sagittarius — Baladi: Yuva (prime, 100%), Jagradadi: Jagrat (own sign, fully awake), Deeptadi: Swastha (content), Lajjitadi: Garvita (proud, in moolatrikona zone). Synthesis: Jupiter is at peak power, fully conscious, content in its own domain, and proud of its position. During Jupiter dasha, wisdom, wealth, children, and spirituality all flourish effortlessly.',
    hi: 'सम्पूर्ण अवस्था पठन पाँचों प्रणालियों को मिलाकर प्रत्येक ग्रह का व्यक्तित्व चित्र बनाता है। उदाहरण: गुरु 15° धनु — बालादि: युवा (100%), जाग्रदादि: जाग्रत (स्वराशि), दीप्तादि: स्वस्थ, लज्जितादि: गर्वित। संश्लेषण: गुरु शिखर शक्ति पर, पूर्ण चेतन, स्वक्षेत्र में सन्तुष्ट। गुरु दशा में ज्ञान, धन, सन्तान, आध्यात्मिकता — सब सहज।',
    sa: 'सम्पूर्णम् अवस्थापठनं पञ्चसु प्रणालीषु संश्लिष्य प्रत्येकग्रहस्य व्यक्तित्वचित्रं रचयति।',
  },
  synthesisP2: {
    en: 'Conversely: Venus at 27° Virgo — Baladi: Mrita (dead degree in even sign), Jagradadi: Sushupti (debilitated, deep sleep), Deeptadi: Khala (debilitated, wicked), Lajjitadi: Kshudhita (enemy sign, hungry). Synthesis: Venus is functionally dead, unconscious, distorted, and perpetually craving. During Venus dasha, relationships, beauty, luxury, and marital happiness face severe challenges. Strong Venus remedies (diamond, Shukra mantra, white clothes on Friday) become essential.',
    hi: 'विपरीत: शुक्र 27° कन्या — बालादि: मृत, जाग्रदादि: सुषुप्ति (नीच, गहरी निद्रा), दीप्तादि: खल (नीच), लज्जितादि: क्षुधित (शत्रु राशि)। संश्लेषण: शुक्र कार्यात्मक रूप से मृत, अचेतन, विकृत, सतत लालसाग्रस्त। शुक्र दशा में सम्बन्ध, सौन्दर्य, विवाह — गम्भीर चुनौतियाँ। प्रबल उपचार आवश्यक।',
    sa: 'विपरीतम्: शुक्रः 27° कन्यायाम् — मृतः, सुषुप्तः, खलः, क्षुधितः। शुक्रदशायां सम्बन्धाः सौन्दर्यं विवाहश्च कठिनतां प्राप्नुवन्ति।',
  },

  linksTitle: { en: 'Continue Learning', hi: 'आगे पढ़ें', sa: 'अग्रे पठत' },
};

const SYSTEM_ICONS = [User, Eye, Flame, Heart, Activity];
const SYSTEM_COLORS = ['text-amber-400', 'text-emerald-400', 'text-orange-400', 'text-pink-400', 'text-cyan-400'];

export default function LearnAvasthasPage() {
  const locale = useLocale() as Locale;
  const isHi = locale !== 'en';
  const t = (obj: Record<string, string>) => obj[locale] || obj.en;
  const headingFont = isHi ? { fontFamily: 'var(--font-devanagari-heading)' } : { fontFamily: 'var(--font-heading)' };
  const [expandedSystem, setExpandedSystem] = useState<number | null>(0);

  const systems = [
    { title: L.baladiTitle, desc: L.baladiDesc, states: L.baladiStates, type: 'baladi' },
    { title: L.jagraTitle, desc: L.jagraDesc, states: L.jagraStates, type: 'jagra' },
    { title: L.deeptaTitle, desc: L.deeptaDesc, states: L.deeptaStates, type: 'deepta' },
    { title: L.lajjitaTitle, desc: L.lajjitaDesc, states: L.lajjitaStates, type: 'lajjita' },
    { title: L.shayanaTitle, desc: L.shayanaDesc, states: L.shayanaStates, type: 'shayana' },
  ];

  const tierColor = (tier: string) => {
    switch (tier) {
      case 'excellent': return 'bg-emerald-500/10 text-emerald-400';
      case 'good': return 'bg-blue-500/10 text-blue-300';
      case 'mixed': return 'bg-amber-500/10 text-amber-400';
      case 'weak': return 'bg-red-500/10 text-red-400';
      case 'denied': return 'bg-red-500/15 text-red-500';
      default: return 'bg-gold-primary/10 text-gold-light';
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-10 space-y-10">
      {/* ═══ Header ═══ */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
        <h1 className="text-3xl sm:text-4xl font-bold text-gold-gradient mb-3" style={headingFont}>{t(L.title)}</h1>
        <p className="text-text-secondary leading-relaxed max-w-3xl">{t(L.subtitle)}</p>
      </motion.div>

      {/* ═══ What are Avasthas ═══ */}
      <motion.section initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
        className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-2xl p-6 space-y-4">
        <h2 className="text-xl font-bold text-gold-light" style={headingFont}>{t(L.whatTitle)}</h2>
        <p className="text-text-secondary leading-relaxed">{t(L.whatP1)}</p>
        <p className="text-text-secondary leading-relaxed">{t(L.whatP2)}</p>
      </motion.section>

      {/* ═══ The 5 Systems ═══ */}
      <motion.section initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="space-y-4">
        <h2 className="text-2xl font-bold text-gold-gradient" style={headingFont}>{t(L.fiveTitle)}</h2>
        {systems.map((sys, i) => {
          const Icon = SYSTEM_ICONS[i];
          const color = SYSTEM_COLORS[i];
          const isExpanded = expandedSystem === i;
          return (
            <div key={i} className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-2xl overflow-hidden">
              <button onClick={() => setExpandedSystem(isExpanded ? null : i)}
                className="w-full flex items-center justify-between px-6 py-4 hover:bg-gold-primary/5 transition-colors">
                <div className="flex items-center gap-3">
                  <Icon className={`w-6 h-6 ${color}`} />
                  <span className={`font-bold text-lg ${color}`} style={headingFont}>{t(sys.title)}</span>
                  <span className="text-text-tertiary text-xs">{sys.states.length} {isHi ? 'दशाएं' : 'states'}</span>
                </div>
                <ChevronDown className={`w-5 h-5 text-text-secondary transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
              </button>
              <AnimatePresence>
                {isExpanded && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: 'easeInOut' as const }} className="overflow-hidden">
                    <div className="px-6 pb-6 space-y-4 border-t border-gold-primary/10 pt-4">
                      <p className="text-text-secondary leading-relaxed text-sm">{t(sys.desc)}</p>
                      <div className="space-y-2">
                        {sys.states.map((state: any, j: number) => (
                          <div key={j} className="p-3 rounded-xl bg-bg-secondary/50 border border-gold-primary/8">
                            <div className="flex items-center gap-2 mb-1.5">
                              <span className={`font-bold text-sm ${state.color}`}>{t(state.name)}</span>
                              {state.quality && <span className="text-text-tertiary text-xs ml-auto">{t(state.quality)}</span>}
                              {state.output && <span className="text-text-tertiary text-xs ml-auto">{t(state.output)}</span>}
                              {state.speed && <span className="text-text-tertiary text-xs ml-auto">{t(state.speed)}</span>}
                              {state.tier && <span className={`text-xs px-1.5 py-0.5 rounded ml-auto ${tierColor(state.tier)}`}>{state.tier}</span>}
                            </div>
                            {state.condition && <div className="text-gold-dark text-xs uppercase tracking-widest font-bold mb-0.5">{isHi ? 'स्थिति' : 'Condition'}: <span className="normal-case tracking-normal text-text-secondary font-normal">{t(state.condition)}</span></div>}
                            {state.result && <div className="text-text-secondary text-xs leading-relaxed">{t(state.result)}</div>}
                            {state.effect && <div className="text-text-secondary text-xs leading-relaxed">{t(state.effect)}</div>}
                            {state.desc && <div className="text-text-secondary text-xs leading-relaxed">{t(state.desc)}</div>}
                          </div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </motion.section>

      {/* ═══ Interpretation Table ═══ */}
      <motion.section initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
        className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-2xl p-6 space-y-4">
        <h2 className="text-xl font-bold text-gold-light" style={headingFont}>{t(L.interpretTitle)}</h2>
        <p className="text-text-secondary text-sm">{t(L.interpretDesc)}</p>
        <div className="space-y-3">
          {L.tiers.map((tier, i) => (
            <div key={i} className={`p-4 rounded-xl border ${tier.color}`}>
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-sm">{t(tier.tier)}</span>
                <span className="font-mono text-xs opacity-70">{tier.pct}</span>
              </div>
              <div className="text-text-tertiary text-xs uppercase tracking-widest mb-1">{isHi ? 'उदाहरण' : 'Examples'}: {t(tier.examples)}</div>
              <div className="text-text-secondary text-xs leading-relaxed">{t(tier.desc)}</div>
            </div>
          ))}
        </div>
      </motion.section>

      {/* ═══ Synthesis ═══ */}
      <motion.section initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
        className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-2xl p-6 space-y-4">
        <h2 className="text-xl font-bold text-gold-light" style={headingFont}>{t(L.synthesisTitle)}</h2>
        <div className="p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/15">
          <div className="text-emerald-400 text-xs uppercase tracking-widest font-bold mb-2">{isHi ? 'उदाहरण: बलवान गुरु' : 'Example: Strong Jupiter'}</div>
          <p className="text-text-secondary text-sm leading-relaxed">{t(L.synthesisP1)}</p>
        </div>
        <div className="p-4 rounded-xl bg-red-500/5 border border-red-500/15">
          <div className="text-red-400 text-xs uppercase tracking-widest font-bold mb-2">{isHi ? 'उदाहरण: दुर्बल शुक्र' : 'Example: Weak Venus'}</div>
          <p className="text-text-secondary text-sm leading-relaxed">{t(L.synthesisP2)}</p>
        </div>
      </motion.section>

      {/* ═══ Links ═══ */}
      <motion.section initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
        className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-2xl p-6 text-center space-y-4">
        <h3 className="text-gold-light font-bold text-lg" style={headingFont}>{t(L.linksTitle)}</h3>
        <div className="flex flex-wrap justify-center gap-3">
          {[
            { href: '/kundali', label: { en: 'Generate Kundali', hi: 'कुण्डली बनाएं' } },
            { href: '/learn/modules/18-4', label: { en: 'Module 18-4: Avasthas Deep Dive', hi: 'मॉड्यूल 18-4: अवस्था विस्तार' } },
            { href: '/learn/shadbala', label: { en: 'Shadbala (Planet Strength)', hi: 'षड्बल (ग्रह शक्ति)' } },
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
