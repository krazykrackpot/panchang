/**
 * Bilingual text template pools for daily horoscope generation.
 * Each area has 3 quality tiers (good / mixed / challenging),
 * with 6 templates per tier. Total: 5 areas x 3 tiers x 6 = 90 templates.
 *
 * Templates are deterministically selected using (date + moonSign) as a seed.
 */

export interface BilingualText {
  en: string;
  hi: string;
}

export type QualityTier = 'good' | 'mixed' | 'challenging';
export type LifeArea = 'career' | 'love' | 'health' | 'finance' | 'spirituality';

// ─────────────────────────────────────────────────────────────
// CAREER
// ─────────────────────────────────────────────────────────────
const CAREER_GOOD: BilingualText[] = [
  { en: 'Professional momentum builds today — take initiative on pending projects.', hi: 'आज कार्यक्षेत्र में गति बनती है — लंबित परियोजनाओं में पहल करें।' },
  { en: 'Authority figures notice your efforts. Present your ideas with confidence.', hi: 'अधिकारी आपके प्रयासों को देख रहे हैं। अपने विचार आत्मविश्वास से रखें।' },
  { en: 'New opportunities align with your skills. Stay open to unexpected proposals.', hi: 'नए अवसर आपकी क्षमताओं से मेल खाते हैं। अप्रत्याशित प्रस्तावों के लिए तैयार रहें।' },
  { en: 'Teamwork flourishes. Collaborative efforts bring recognition and reward.', hi: 'सहकार्य फलता-फूलता है। सामूहिक प्रयासों से मान्यता एवं पुरस्कार मिलता है।' },
  { en: 'A strategic decision you make today could accelerate your career trajectory.', hi: 'आज लिया गया एक रणनीतिक निर्णय आपकी करियर गति को तेज़ कर सकता है।' },
  { en: 'Your expertise is valued. Share knowledge generously and watch doors open.', hi: 'आपकी विशेषज्ञता मूल्यवान है। ज्ञान साझा करें और नए द्वार खुलते देखें।' },
];

const CAREER_MIXED: BilingualText[] = [
  { en: 'Steady day — focus on routine tasks and clearing your backlog.', hi: 'स्थिर दिन — नियमित कार्यों और बकाया काम को निपटाने पर ध्यान दें।' },
  { en: 'Avoid major decisions until clarity arrives. Gather more information first.', hi: 'स्पष्टता आने तक बड़े निर्णयों से बचें। पहले अधिक जानकारी एकत्र करें।' },
  { en: 'Colleagues may need extra patience today. Lead with empathy.', hi: 'आज सहकर्मियों को अतिरिक्त धैर्य की आवश्यकता हो सकती है। सहानुभूति से नेतृत्व करें।' },
  { en: 'Progress is slow but steady. Trust the process and stay consistent.', hi: 'प्रगति धीमी लेकिन स्थिर है। प्रक्रिया पर विश्वास रखें और निरंतर रहें।' },
  { en: 'Good day for planning rather than execution. Strategize for the week ahead.', hi: 'कार्यान्वयन की बजाय योजना बनाने का अच्छा दिन। आगामी सप्ताह की रणनीति बनाएँ।' },
  { en: 'Minor workplace friction is temporary. Stay professional and it will pass.', hi: 'कार्यस्थल पर मामूली घर्षण अस्थायी है। पेशेवर बने रहें, यह बीत जाएगा।' },
];

const CAREER_CHALLENGING: BilingualText[] = [
  { en: 'Workplace tension requires diplomatic handling. Choose words carefully.', hi: 'कार्यस्थल का तनाव कूटनीतिक संभालने की माँग करता है। शब्दों का चयन सावधानी से करें।' },
  { en: 'Delay important meetings if possible. The energy favors reflection over action.', hi: 'यदि संभव हो तो महत्वपूर्ण बैठकें टालें। ऊर्जा कार्रवाई से अधिक चिंतन का साथ देती है।' },
  { en: 'Review before committing to new projects. Hidden details may surface later.', hi: 'नई परियोजनाओं में शामिल होने से पहले समीक्षा करें। छिपे विवरण बाद में सामने आ सकते हैं।' },
  { en: 'Authority conflicts may arise. Maintain composure and document everything.', hi: 'अधिकार संघर्ष हो सकते हैं। संयम बनाए रखें और सब कुछ दस्तावेज़ करें।' },
  { en: 'Not the best day for negotiations. Postpone salary or contract discussions.', hi: 'बातचीत के लिए सर्वोत्तम दिन नहीं। वेतन या अनुबंध चर्चाएँ स्थगित करें।' },
  { en: 'Energy may feel scattered. Prioritize ruthlessly and tackle one task at a time.', hi: 'ऊर्जा बिखरी महसूस हो सकती है। कठोर प्राथमिकता दें और एक समय में एक कार्य करें।' },
];

// ─────────────────────────────────────────────────────────────
// LOVE
// ─────────────────────────────────────────────────────────────
const LOVE_GOOD: BilingualText[] = [
  { en: 'Emotional bonds deepen today. Express your feelings openly and honestly.', hi: 'आज भावनात्मक बंधन गहरे होते हैं। अपनी भावनाएँ खुलकर और ईमानदारी से व्यक्त करें।' },
  { en: 'Harmonious energy surrounds relationships. Plan something special with loved ones.', hi: 'रिश्तों के चारों ओर सामंजस्यपूर्ण ऊर्जा है। प्रियजनों के साथ कुछ विशेष योजना बनाएँ।' },
  { en: 'Singles may encounter a meaningful connection. Stay socially engaged.', hi: 'अकेले लोगों को एक सार्थक संबंध मिल सकता है। सामाजिक रूप से सक्रिय रहें।' },
  { en: 'Forgiveness and understanding flow easily. Resolve any lingering misunderstandings.', hi: 'क्षमा और समझ सहजता से बहती है। किसी भी लंबित गलतफहमी का समाधान करें।' },
  { en: 'Romance is in the air. Small gestures of love carry great significance today.', hi: 'प्रेम वातावरण में है। प्यार के छोटे इशारे आज बड़ा महत्व रखते हैं।' },
  { en: 'Family relationships bring comfort and joy. Spend quality time at home.', hi: 'पारिवारिक रिश्ते आराम और खुशी लाते हैं। घर पर गुणवत्तापूर्ण समय बिताएँ।' },
];

const LOVE_MIXED: BilingualText[] = [
  { en: 'Relationships need gentle attention. Listen more than you speak today.', hi: 'रिश्तों को कोमल ध्यान की आवश्यकता है। आज बोलने से अधिक सुनें।' },
  { en: 'Emotional clarity may be elusive. Give yourself and others space to process.', hi: 'भावनात्मक स्पष्टता अस्पष्ट हो सकती है। स्वयं को और दूसरों को समझने का स्थान दें।' },
  { en: 'Balance personal needs with partnership demands. Neither should be neglected.', hi: 'व्यक्तिगत आवश्यकताओं को साझेदारी की माँगों के साथ संतुलित करें।' },
  { en: 'A calm, honest conversation can prevent a small issue from growing.', hi: 'एक शांत, ईमानदार बातचीत छोटी समस्या को बढ़ने से रोक सकती है।' },
  { en: 'Social energy is moderate. Choose quality interactions over quantity.', hi: 'सामाजिक ऊर्जा मध्यम है। मात्रा से अधिक गुणवत्तापूर्ण संवाद चुनें।' },
  { en: 'Old memories may resurface. Process them with compassion, not attachment.', hi: 'पुरानी यादें सतह पर आ सकती हैं। उन्हें करुणा से संसाधित करें, आसक्ति से नहीं।' },
];

const LOVE_CHALLENGING: BilingualText[] = [
  { en: 'Avoid sensitive conversations today. Emotions run high and words may wound.', hi: 'आज संवेदनशील बातचीत से बचें। भावनाएँ तीव्र हैं और शब्द घाव दे सकते हैं।' },
  { en: 'Misunderstandings are likely. Clarify intentions before reacting emotionally.', hi: 'गलतफहमी की संभावना है। भावनात्मक रूप से प्रतिक्रिया देने से पहले इरादे स्पष्ट करें।' },
  { en: 'Personal space is important today. Respect boundaries — yours and others.', hi: 'आज व्यक्तिगत स्थान महत्वपूर्ण है। सीमाओं का सम्मान करें — अपनी और दूसरों की।' },
  { en: 'Loneliness may surface. Reach out to a trusted friend rather than isolating.', hi: 'अकेलापन महसूस हो सकता है। अलग-थलग रहने के बजाय किसी विश्वसनीय मित्र से संपर्क करें।' },
  { en: 'Jealousy or possessiveness could create friction. Practice detachment and trust.', hi: 'ईर्ष्या या अधिकार भावना घर्षण पैदा कर सकती है। वैराग्य और विश्वास का अभ्यास करें।' },
  { en: 'Family disagreements need patience, not forceful resolution. Let things cool down.', hi: 'पारिवारिक असहमतियों में धैर्य चाहिए, बलपूर्वक समाधान नहीं। चीज़ों को शांत होने दें।' },
];

// ─────────────────────────────────────────────────────────────
// HEALTH
// ─────────────────────────────────────────────────────────────
const HEALTH_GOOD: BilingualText[] = [
  { en: 'Vitality is high. Channel this energy into exercise or outdoor activities.', hi: 'जीवन शक्ति उच्च है। इस ऊर्जा को व्यायाम या बाहरी गतिविधियों में लगाएँ।' },
  { en: 'Excellent day for starting a new health routine or wellness practice.', hi: 'नई स्वास्थ्य दिनचर्या या कल्याण अभ्यास शुरू करने के लिए उत्कृष्ट दिन।' },
  { en: 'Mind-body connection is strong. Yoga or meditation will be especially rewarding.', hi: 'मन-शरीर का संबंध मजबूत है। योग या ध्यान विशेष रूप से फलदायी होगा।' },
  { en: 'Digestive fire is balanced. Enjoy nourishing meals and stay well-hydrated.', hi: 'पाचन अग्नि संतुलित है। पौष्टिक भोजन का आनंद लें और अच्छी तरह जलयोजित रहें।' },
  { en: 'Sleep quality improves tonight. Establish a calming evening routine.', hi: 'आज रात नींद की गुणवत्ता सुधरती है। एक शांत शाम की दिनचर्या स्थापित करें।' },
  { en: 'Physical resilience peaks. A good day for challenging workouts or sports.', hi: 'शारीरिक सहनशक्ति चरम पर है। चुनौतीपूर्ण कसरत या खेल के लिए अच्छा दिन।' },
];

const HEALTH_MIXED: BilingualText[] = [
  { en: 'Energy fluctuates through the day. Pace yourself and take regular breaks.', hi: 'दिन भर ऊर्जा में उतार-चढ़ाव रहता है। अपनी गति बनाए रखें और नियमित विश्राम लें।' },
  { en: 'Minor aches or tension may arise. Gentle stretching and warm drinks help.', hi: 'हल्के दर्द या तनाव हो सकता है। हल्की स्ट्रेचिंग और गर्म पेय सहायक हैं।' },
  { en: 'Moderate your diet today. Avoid heavy or unfamiliar foods that tax digestion.', hi: 'आज अपने आहार को संयमित रखें। भारी या अपरिचित भोजन से बचें।' },
  { en: 'Mental fog is possible in the afternoon. A short walk refreshes clarity.', hi: 'दोपहर में मानसिक धुंधलापन संभव है। एक छोटी सैर स्पष्टता ताज़ा करती है।' },
  { en: 'Adequate rest is essential today. Do not overcommit your physical energy.', hi: 'आज पर्याप्त आराम आवश्यक है। अपनी शारीरिक ऊर्जा पर अत्यधिक भार न डालें।' },
  { en: 'Hydration and fresh air are your best allies. Step outside if desk-bound.', hi: 'जलयोजन और ताज़ी हवा आपके सर्वोत्तम साथी हैं। डेस्क पर हों तो बाहर निकलें।' },
];

const HEALTH_CHALLENGING: BilingualText[] = [
  { en: 'Fatigue may set in early. Conserve energy and prioritize essential tasks only.', hi: 'थकान जल्दी आ सकती है। ऊर्जा बचाएँ और केवल आवश्यक कार्यों को प्राथमिकता दें।' },
  { en: 'Stress levels are elevated. Practice pranayama or deep breathing throughout the day.', hi: 'तनाव का स्तर बढ़ा हुआ है। दिन भर प्राणायाम या गहरी साँस का अभ्यास करें।' },
  { en: 'Avoid strenuous exercise. Opt for gentle restorative movement instead.', hi: 'कठिन व्यायाम से बचें। इसके बजाय हल्की पुनर्स्थापनात्मक गतिविधि चुनें।' },
  { en: 'Watch for headaches or eye strain. Take screen breaks every 30 minutes.', hi: 'सिरदर्द या आँखों के तनाव पर ध्यान दें। हर 30 मिनट में स्क्रीन से विश्राम लें।' },
  { en: 'Immunity needs support. Warm, light foods and early sleep are recommended.', hi: 'प्रतिरक्षा को सहारे की आवश्यकता है। गर्म, हल्का भोजन और जल्दी सोना उचित है।' },
  { en: 'Emotional health requires attention. Journaling or talking to someone helps process feelings.', hi: 'भावनात्मक स्वास्थ्य पर ध्यान देना आवश्यक है। लेखन या किसी से बात करना भावनाओं को संसाधित करने में सहायक है।' },
];

// ─────────────────────────────────────────────────────────────
// FINANCE
// ─────────────────────────────────────────────────────────────
const FINANCE_GOOD: BilingualText[] = [
  { en: 'Financial gains are indicated. Investments made today carry favorable energy.', hi: 'आर्थिक लाभ संकेतित है। आज किए गए निवेश अनुकूल ऊर्जा रखते हैं।' },
  { en: 'Good day to negotiate deals or finalize contracts with monetary implications.', hi: 'सौदों पर बातचीत या आर्थिक प्रभाव वाले अनुबंधों को अंतिम रूप देने का अच्छा दिन।' },
  { en: 'Unexpected income or a financial opportunity may present itself. Stay alert.', hi: 'अप्रत्याशित आय या वित्तीय अवसर स्वयं प्रस्तुत हो सकता है। सतर्क रहें।' },
  { en: 'Savings efforts pay off. Review your portfolio and reinforce winning positions.', hi: 'बचत के प्रयास फल देते हैं। अपने पोर्टफोलियो की समीक्षा करें।' },
  { en: 'Property or asset-related decisions are well-supported today.', hi: 'संपत्ति या परिसंपत्ति संबंधी निर्णयों को आज अच्छा समर्थन मिलता है।' },
  { en: 'Generosity attracts abundance. Share resources and the cycle of prosperity continues.', hi: 'उदारता प्रचुरता को आकर्षित करती है। संसाधन साझा करें और समृद्धि का चक्र जारी रहे।' },
];

const FINANCE_MIXED: BilingualText[] = [
  { en: 'Financial decisions require extra deliberation today. Do not rush.', hi: 'आज वित्तीय निर्णयों में अतिरिक्त विचार-विमर्श आवश्यक है। जल्दबाज़ी न करें।' },
  { en: 'Small, steady steps serve better than bold financial moves right now.', hi: 'अभी बड़े वित्तीय कदमों से बेहतर छोटे, स्थिर कदम काम करते हैं।' },
  { en: 'Review expenses and eliminate unnecessary subscriptions or commitments.', hi: 'खर्चों की समीक्षा करें और अनावश्यक सदस्यता या प्रतिबद्धताएँ समाप्त करें।' },
  { en: 'Lending or borrowing money today may complicate relationships. Be cautious.', hi: 'आज धन उधार देना या लेना रिश्तों को जटिल कर सकता है। सतर्क रहें।' },
  { en: 'Income remains stable but growth requires patience. Focus on long-term plans.', hi: 'आय स्थिर रहती है लेकिन वृद्धि में धैर्य चाहिए। दीर्घकालिक योजनाओं पर ध्यान दें।' },
  { en: 'A moderate approach to spending serves you well. Avoid impulse purchases.', hi: 'खर्च के प्रति संयमित दृष्टिकोण आपकी सेवा करता है। आवेगी खरीदारी से बचें।' },
];

const FINANCE_CHALLENGING: BilingualText[] = [
  { en: 'Avoid major financial commitments today. The energy does not support risk-taking.', hi: 'आज बड़ी वित्तीय प्रतिबद्धताओं से बचें। ऊर्जा जोखिम लेने का समर्थन नहीं करती।' },
  { en: 'Unexpected expenses may surface. Keep an emergency buffer accessible.', hi: 'अप्रत्याशित खर्च सामने आ सकते हैं। आपातकालीन बफर सुलभ रखें।' },
  { en: 'Speculative investments are particularly risky now. Preserve capital.', hi: 'सट्टा निवेश अभी विशेष रूप से जोखिम भरे हैं। पूँजी सुरक्षित रखें।' },
  { en: 'Financial documents need careful review. Double-check before signing anything.', hi: 'वित्तीय दस्तावेज़ों की सावधानीपूर्वक समीक्षा आवश्यक है। कुछ भी हस्ताक्षर करने से पहले दोबारा जाँचें।' },
  { en: 'Delays in expected payments or returns are possible. Plan for contingencies.', hi: 'अपेक्षित भुगतान या रिटर्न में देरी संभव है। आकस्मिकताओं की योजना बनाएँ।' },
  { en: 'Guard against financial fraud or too-good-to-be-true offers. Verify everything.', hi: 'वित्तीय धोखाधड़ी या अत्यधिक आकर्षक प्रस्तावों से सावधान रहें। सब कुछ सत्यापित करें।' },
];

// ─────────────────────────────────────────────────────────────
// SPIRITUALITY
// ─────────────────────────────────────────────────────────────
const SPIRITUALITY_GOOD: BilingualText[] = [
  { en: 'Spiritual awareness heightens. Meditation and mantra japa bring deep peace.', hi: 'आध्यात्मिक जागरूकता बढ़ती है। ध्यान और मंत्र जप गहरी शांति लाते हैं।' },
  { en: 'Intuition is sharp. Trust your inner guidance for important decisions.', hi: 'अंतर्ज्ञान तीव्र है। महत्वपूर्ण निर्णयों के लिए अपने आंतरिक मार्गदर्शन पर भरोसा करें।' },
  { en: 'Temple visits or sacred rituals carry amplified blessings today.', hi: 'मंदिर दर्शन या पवित्र अनुष्ठान आज विशेष आशीर्वाद लाते हैं।' },
  { en: 'A moment of gratitude transforms your entire day. Begin with thankfulness.', hi: 'कृतज्ञता का एक क्षण आपके पूरे दिन को बदल देता है। आभार से शुरू करें।' },
  { en: 'Connection with your guru or spiritual teacher is especially potent now.', hi: 'अपने गुरु या आध्यात्मिक शिक्षक के साथ संबंध अभी विशेष रूप से शक्तिशाली है।' },
  { en: 'Acts of seva (selfless service) bring karmic blessings and inner fulfillment.', hi: 'सेवा (निःस्वार्थ सेवा) के कार्य कर्म आशीर्वाद और आंतरिक संतुष्टि लाते हैं।' },
];

const SPIRITUALITY_MIXED: BilingualText[] = [
  { en: 'Spiritual practice feels routine today. Try a different approach to rekindle devotion.', hi: 'आध्यात्मिक अभ्यास आज नियमित लगता है। भक्ति को पुनर्जीवित करने के लिए अलग दृष्टिकोण आज़माएँ।' },
  { en: 'The mind wanders during meditation. Be patient — every attempt strengthens the practice.', hi: 'ध्यान के दौरान मन भटकता है। धैर्य रखें — हर प्रयास अभ्यास को मजबूत करता है।' },
  { en: 'Balance material and spiritual pursuits. Neither need be sacrificed for the other.', hi: 'भौतिक और आध्यात्मिक लक्ष्यों को संतुलित करें। किसी को दूसरे के लिए त्यागने की आवश्यकता नहीं।' },
  { en: 'Spend a few quiet minutes in nature. Natural beauty reconnects you to the divine.', hi: 'प्रकृति में कुछ शांत मिनट बिताएँ। प्राकृतिक सुंदरता आपको दिव्य से जोड़ती है।' },
  { en: 'Reading a sacred text or shloka can shift your perspective during a flat day.', hi: 'एक पवित्र ग्रंथ या श्लोक पढ़ना एक सपाट दिन में आपके दृष्टिकोण को बदल सकता है।' },
  { en: 'Karma awareness grows. Reflect on recent actions and their ripple effects.', hi: 'कर्म जागरूकता बढ़ती है। हाल के कार्यों और उनके प्रभावों पर चिंतन करें।' },
];

const SPIRITUALITY_CHALLENGING: BilingualText[] = [
  { en: 'Inner restlessness makes spiritual practice difficult. Accept it without judgment.', hi: 'आंतरिक बेचैनी आध्यात्मिक अभ्यास को कठिन बनाती है। बिना निर्णय के स्वीकार करें।' },
  { en: 'Doubts about your path may arise. This is part of growth — keep walking.', hi: 'आपके मार्ग के बारे में संदेह उत्पन्न हो सकते हैं। यह विकास का हिस्सा है — चलते रहें।' },
  { en: 'Ego may dominate today. Practice humility and remember your deeper purpose.', hi: 'आज अहंकार प्रबल हो सकता है। विनम्रता का अभ्यास करें और अपने गहरे उद्देश्य को याद रखें।' },
  { en: 'External distractions pull you from center. Set firm boundaries for sacred time.', hi: 'बाहरी विकर्षण आपको केंद्र से खींचते हैं। पवित्र समय के लिए दृढ़ सीमाएँ निर्धारित करें।' },
  { en: 'Past regrets may surface during quiet moments. Release them through breath and prayer.', hi: 'शांत क्षणों में पिछले पछतावे सतह पर आ सकते हैं। साँस और प्रार्थना से उन्हें मुक्त करें।' },
  { en: 'Spiritual bypassing is a risk today. Face difficult emotions rather than transcending them.', hi: 'आज आध्यात्मिक बायपासिंग का जोखिम है। कठिन भावनाओं को पार करने के बजाय उनका सामना करें।' },
];

// ─────────────────────────────────────────────────────────────
// Daily insight (one-liner) pools
// ─────────────────────────────────────────────────────────────
export const INSIGHT_GOOD: BilingualText[] = [
  { en: 'The stars align in your favor today — seize the moment with intention.', hi: 'आज तारे आपके पक्ष में हैं — इरादे के साथ इस क्षण को पकड़ें।' },
  { en: 'Cosmic currents carry you forward. Trust and flow.', hi: 'ब्रह्माण्डीय धाराएँ आपको आगे ले जाती हैं। विश्वास करें और प्रवाह में रहें।' },
  { en: 'Today rewards courage and clarity. Step boldly into your truth.', hi: 'आज साहस और स्पष्टता को पुरस्कृत करता है। अपने सत्य में साहसपूर्वक कदम रखें।' },
  { en: 'Abundance surrounds you — open your heart to receive.', hi: 'प्रचुरता आपको घेरे हुए है — प्राप्त करने के लिए अपना हृदय खोलें।' },
  { en: 'A day of positive momentum. Your efforts bear fruit.', hi: 'सकारात्मक गति का दिन। आपके प्रयास फल देते हैं।' },
  { en: 'Grace and good fortune walk beside you today.', hi: 'आज कृपा और सौभाग्य आपके साथ चलते हैं।' },
];

export const INSIGHT_MIXED: BilingualText[] = [
  { en: 'A day of contrasts — navigate with awareness and adaptability.', hi: 'विरोधाभासों का दिन — जागरूकता और अनुकूलनशीलता से नेविगेट करें।' },
  { en: 'Balance is your superpower today. Hold the center amid shifting energies.', hi: 'आज संतुलन आपकी महाशक्ति है। बदलती ऊर्जाओं के बीच केंद्र में रहें।' },
  { en: 'Patience transforms ordinary moments into opportunities for growth.', hi: 'धैर्य साधारण क्षणों को विकास के अवसरों में बदलता है।' },
  { en: 'Not every day needs to be extraordinary. Find peace in the ordinary.', hi: 'हर दिन असाधारण होना आवश्यक नहीं। साधारण में शांति खोजें।' },
  { en: 'Mixed planetary signals suggest observing before acting.', hi: 'मिश्रित ग्रहीय संकेत कार्रवाई से पहले अवलोकन का सुझाव देते हैं।' },
  { en: 'Stay grounded — clarity emerges by evening.', hi: 'स्थिर रहें — शाम तक स्पष्टता उभरती है।' },
];

export const INSIGHT_CHALLENGING: BilingualText[] = [
  { en: 'Challenging energies demand extra mindfulness. Move slowly and deliberately.', hi: 'चुनौतीपूर्ण ऊर्जाएँ अतिरिक्त सावधानी की माँग करती हैं। धीरे और सोच-समझकर चलें।' },
  { en: 'Resistance is a teacher. What frustrates you today reveals what matters most.', hi: 'प्रतिरोध एक शिक्षक है। आज जो निराश करता है, वह बताता है कि सबसे महत्वपूर्ण क्या है।' },
  { en: 'This too shall pass. Focus on what you can control and release the rest.', hi: 'यह भी बीत जाएगा। जो नियंत्रित कर सकते हैं उस पर ध्यान दें, शेष छोड़ दें।' },
  { en: 'A day for inner work rather than outer achievement. Go within.', hi: 'बाहरी उपलब्धि के बजाय आंतरिक कार्य का दिन। भीतर जाएँ।' },
  { en: 'Planetary tensions create growth opportunities in disguise. Stay resilient.', hi: 'ग्रहीय तनाव छिपे हुए विकास के अवसर बनाते हैं। दृढ़ बने रहें।' },
  { en: 'Slow down, breathe deeply, and let the cosmic storm pass around you.', hi: 'धीमे हों, गहरी साँस लें, और ब्रह्माण्डीय तूफान को अपने चारों ओर से गुज़रने दें।' },
];

// ─────────────────────────────────────────────────────────────
// Lucky colors
// ─────────────────────────────────────────────────────────────
export const LUCKY_COLORS: BilingualText[] = [
  { en: 'Red', hi: 'लाल' },
  { en: 'Orange', hi: 'नारंगी' },
  { en: 'Yellow', hi: 'पीला' },
  { en: 'Green', hi: 'हरा' },
  { en: 'Blue', hi: 'नीला' },
  { en: 'White', hi: 'सफ़ेद' },
  { en: 'Purple', hi: 'बैंगनी' },
  { en: 'Gold', hi: 'सुनहरा' },
  { en: 'Silver', hi: 'चाँदी' },
  { en: 'Cream', hi: 'क्रीम' },
  { en: 'Saffron', hi: 'केसरिया' },
  { en: 'Maroon', hi: 'मैरून' },
];

// ─────────────────────────────────────────────────────────────
// Indexed access
// ─────────────────────────────────────────────────────────────
export const TEMPLATES: Record<LifeArea, Record<QualityTier, BilingualText[]>> = {
  career:       { good: CAREER_GOOD,       mixed: CAREER_MIXED,       challenging: CAREER_CHALLENGING },
  love:         { good: LOVE_GOOD,         mixed: LOVE_MIXED,         challenging: LOVE_CHALLENGING },
  health:       { good: HEALTH_GOOD,       mixed: HEALTH_MIXED,       challenging: HEALTH_CHALLENGING },
  finance:      { good: FINANCE_GOOD,      mixed: FINANCE_MIXED,      challenging: FINANCE_CHALLENGING },
  spirituality: { good: SPIRITUALITY_GOOD, mixed: SPIRITUALITY_MIXED, challenging: SPIRITUALITY_CHALLENGING },
};
