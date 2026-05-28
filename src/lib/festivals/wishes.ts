/**
 * Festival wishes & greetings — text-only in v1 (spec §4B).
 *
 * 3 wishes per festival × 20 festivals × 2 locales (en + hi) = 120
 * strings. Other locales fall back to en via the tl() helper per the
 * "Locale fallback is non-negotiable" rule.
 *
 * Originality: all greetings here must be original compositions. Hindi
 * greetings draw on folk-traditional phrasing which is not
 * copyrightable, but the specific composition must be ours. Do NOT
 * paste from Hallmark, competitor festival pages, or AI-generated bulk
 * lists. If a wish reads like it came from anywhere else, rewrite.
 *
 * Tone field marks the voice — used by the carousel to chip-tag wishes
 * so users can filter (e.g. "Show me family wishes").
 *
 * Spec: docs/superpowers/specs/2026-05-28-festival-deep-dive-pages-design.md §4B
 */

import type { FestivalWish } from './types';

export const FESTIVAL_WISHES: Record<string, FestivalWish[]> = {
  'diwali': [
    { tone: 'traditional', text: {
      en: 'May the diyas you light tonight outlast the night — and may every door they reach be a door of welcome. Shubh Deepavali.',
      hi: 'आज रात आप जो दीप जलाएँ, वे रात्रि से अधिक दीर्घ हों — और जिस द्वार तक पहुँचें, वह स्वागत का द्वार हो। शुभ दीपावली।',
    }},
    { tone: 'family', text: {
      en: 'Wishing you the Diwali your grandmother would recognise — clean floors, full lamps, soft sweets, loud children. From our family to yours.',
      hi: 'आपको वही दीपावली शुभकामनाएँ जैसी आपकी दादी पहचानती थीं — स्वच्छ आँगन, भरे दीप, ताज़ी मिठाई, बच्चों की हँसी। हमारा परिवार आपके परिवार को।',
    }},
    { tone: 'modern', text: {
      en: 'Less smoke this Diwali, more light. Less noise, more meaning. Wishing you a quieter and brighter one.',
      hi: 'इस दीपावली थोड़ा कम धुआँ, थोड़ी अधिक रोशनी। थोड़ा कम शोर, थोड़ा अधिक अर्थ। शुभ दीपावली।',
    }},
  ],

  'dhanteras': [
    { tone: 'traditional', text: {
      en: 'May Dhanvantari grant your home health, and Lakshmi grant your hands the wisdom to share what they hold. Shubh Dhanteras.',
      hi: 'धन्वन्तरि आपके घर को आरोग्य दें, और लक्ष्मी आपके हाथों को वह विवेक दें कि जो धन उनमें है उसे सही पात्र तक पहुँचाएँ। शुभ धनतेरस।',
    }},
    { tone: 'business', text: {
      en: 'A small steel utensil for the kitchen, a small entry in the new ledger. Wishing your work and your home a prosperous Dhanteras.',
      hi: 'रसोई के लिए छोटा सा बर्तन, नए बही खाते की पहली प्रविष्टि। आपके व्यवसाय एवं घर को समृद्ध धनतेरस की शुभकामनाएँ।',
    }},
    { tone: 'family', text: {
      en: 'The wealth we wish you this Dhanteras is the kind that doesn\'t need a safe — health, time, and the people who sit at your table.',
      hi: 'इस धनतेरस हम जिस धन की कामना करते हैं उसे तिजोरी नहीं चाहिए — स्वास्थ्य, समय, एवं वे लोग जो आपकी थाली में साथ बैठें।',
    }},
  ],

  'holi': [
    { tone: 'modern', text: {
      en: 'May the colour that finds you today be the one you were quietly missing. Happy Holi.',
      hi: 'आज आपको जो रंग ढूँढ ले, वह वही हो जिसकी कमी आप चुपचाप महसूस कर रहे थे। होली की शुभकामनाएँ।',
    }},
    { tone: 'family', text: {
      en: 'Bhang or thandai, lawn or balcony, family or friends — whatever shape your Holi takes today, may it leave you washed clean. Happy Holi.',
      hi: 'भाँग हो या ठंडाई, बगीचा हो या बालकनी, परिवार हो या मित्र — आज की होली जिस रूप में मिले, आपको स्वच्छ करके जाए। होली मुबारक।',
    }},
    { tone: 'traditional', text: {
      en: 'May the fire of Holika Dahan burn what no longer serves you, and may tomorrow\'s colours paint what does. Shubh Holi.',
      hi: 'होलिका दहन की अग्नि उसे जला दे जो अब आपके काम का नहीं, और कल के रंग उसे रचें जो काम का है। शुभ होली।',
    }},
  ],

  'maha-shivaratri': [
    { tone: 'traditional', text: {
      en: 'Tonight Shiva is closest to those who sit still. Wishing you the quietness to notice. Om Namah Shivaya.',
      hi: 'आज रात्रि शिव उनके सबसे निकट हैं जो स्थिर बैठ सकते हैं। आपको वह शान्ति प्राप्त हो जो उनकी उपस्थिति को अनुभव करे। ॐ नमः शिवाय।',
    }},
    { tone: 'modern', text: {
      en: 'Mahadev is the karaka of letting go. Whatever you have been clutching, this is the night to set it down. Har Har Mahadev.',
      hi: 'महादेव त्याग के कारक हैं। जो भी आपने पकड़ रखा है, आज रात उसे रख देने की रात है। हर हर महादेव।',
    }},
    { tone: 'family', text: {
      en: 'A bel patra, a lamp, and one honest line about what you want to change. That\'s enough for Mahashivaratri. Wishing you a still night.',
      hi: 'एक बेल पत्र, एक दीप, और एक सच्ची पंक्ति कि आप क्या बदलना चाहते हैं — महाशिवरात्रि के लिए इतना पर्याप्त है। आपको स्थिर रात्रि मिले।',
    }},
  ],

  'ram-navami': [
    { tone: 'traditional', text: {
      en: 'May the dharma of Rama — quiet, exacting, and kind — be the dharma your day follows. Jai Shri Ram.',
      hi: 'राम का धर्म — मौन, सटीक, एवं करुणामय — आज आपके दिन का धर्म हो। जय श्री राम।',
    }},
    { tone: 'family', text: {
      en: 'Born at noon to be a son first and a king second. Wishing you the Ram Navami that reminds you of the people you belong to. Jai Shri Ram.',
      hi: 'दोपहर को जन्मे — प्रथम पुत्र, तत्पश्चात राजा। यह राम नवमी आपको उन लोगों की स्मृति दे जिनसे आप जुड़े हैं। जय श्री राम।',
    }},
    { tone: 'modern', text: {
      en: 'The 14 years in the forest matter more than the crown. Ram Navami wishes for the patience to walk your own.',
      hi: 'चौदह वर्ष का वनवास मुकुट से अधिक महत्वपूर्ण है। राम नवमी पर अपने मार्ग पर चलने का धैर्य आपको मिले।',
    }},
  ],

  'janmashtami': [
    { tone: 'traditional', text: {
      en: 'Midnight on Ashtami, the rain stops for one moment so a child can be born. Wishing you the wonder of that pause. Shubh Janmashtami.',
      hi: 'अष्टमी की मध्यरात्रि — वर्षा एक क्षण के लिए रुकती है ताकि एक बालक जन्म ले सके। आपको उस विराम का विस्मय मिले। शुभ जन्माष्टमी।',
    }},
    { tone: 'family', text: {
      en: 'May your dahi-handi swing high and break clean, and may the makhan inside taste like childhood. Happy Janmashtami.',
      hi: 'आपकी दही-हण्डी ऊँची झूले और सहज टूटे, और भीतर का माखन बचपन-सा स्वाद दे। जन्माष्टमी की शुभकामनाएँ।',
    }},
    { tone: 'modern', text: {
      en: 'Krishna was teacher, friend, and trickster — a reminder that wisdom doesn\'t always come dressed like wisdom. Hare Krishna.',
      hi: 'कृष्ण गुरु थे, सखा थे, चतुर भी थे — स्मरण कि विवेक सदैव विवेकपूर्ण वस्त्र पहन कर नहीं आता। हरे कृष्ण।',
    }},
  ],

  'ganesh-chaturthi': [
    { tone: 'traditional', text: {
      en: 'Whatever you are about to start this year, may Ganesha clear its path before you arrive. Ganpati Bappa Morya.',
      hi: 'इस वर्ष आप जो भी प्रारम्भ करने वाले हैं, गणेश आपके पहुँचने से पहले उसका मार्ग प्रशस्त करें। गणपति बप्पा मोरया।',
    }},
    { tone: 'family', text: {
      en: 'Modak in the right hand, a small noise in the left. Wishing your home the kind of Ganesh Chaturthi that brings more visitors than you planned for.',
      hi: 'दाहिने हाथ में मोदक, बाएँ हाथ में थोड़ा सा शोर। आपके घर को वैसी गणेश चतुर्थी मिले जिसमें अतिथि आपकी अपेक्षा से अधिक आ जाएँ।',
    }},
    { tone: 'modern', text: {
      en: 'A clay idol that came from the earth and goes back to it — Ganesh Chaturthi is the cleanest start a season can offer. Ganpati Bappa Morya.',
      hi: 'मिट्टी की मूर्ति जो धरती से आई और धरती में लौटेगी — गणेश चतुर्थी एक नवीन ऋतु का सबसे स्वच्छ आरम्भ है। गणपति बप्पा मोरया।',
    }},
  ],

  'dussehra': [
    { tone: 'traditional', text: {
      en: 'On the tenth day, the ten heads burn. Whatever Ravana you have been polite to inside yourself, may today be the day. Shubh Dussehra.',
      hi: 'दशमी को दस सिर जलते हैं। भीतर के जिस रावण के साथ आप अब तक शिष्ट रहे हैं, आज वह दिन हो। शुभ दशहरा।',
    }},
    { tone: 'family', text: {
      en: 'Shami leaves in the pocket, sword in the imagination only, and a long evening with whoever you love. Vijayadashami wishes.',
      hi: 'जेब में शमी का पत्ता, तलवार केवल कल्पना में, और जिनसे आप प्रेम करते हैं उनके साथ एक लम्बी सायंकाल। विजयादशमी की शुभकामनाएँ।',
    }},
    { tone: 'modern', text: {
      en: 'Victory is what you decide to do the day after. Wishing you the eleventh-day Dussehra — the one where you actually change.',
      hi: 'विजय वह है जो आप अगले दिन करते हैं। आपको ग्यारहवें दिन वाली दशहरा शुभकामना मिले — वह जिसमें आप वास्तव में बदलते हैं।',
    }},
  ],

  'raksha-bandhan': [
    { tone: 'family', text: {
      en: 'A thread is not very strong on its own. The promise behind it is what holds. Wishing you a Raksha Bandhan that proves it.',
      hi: 'धागा अकेला बहुत मज़बूत नहीं होता। उसके पीछे का वचन ही उसे बाँधे रखता है। आपको ऐसा रक्षा बन्धन मिले जो इसे सिद्ध करे।',
    }},
    { tone: 'modern', text: {
      en: 'Brother, sister, cousin, friend — whoever ties your wrist this year, they\'re saying \'I\'ll show up.\' Wishing you that promise kept.',
      hi: 'भाई, बहन, चचेरे, मित्र — जो भी आज आपकी कलाई पर बाँधे, वह कह रहा है "मैं हाज़िर रहूँगा।" वह वचन निभे, यही शुभकामना।',
    }},
    { tone: 'traditional', text: {
      en: 'May the rakhi you tie outlive every quarrel. Shubh Raksha Bandhan.',
      hi: 'जो राखी आप बाँधें वह हर कलह से अधिक टिकाऊ हो। शुभ रक्षा बन्धन।',
    }},
  ],

  'narak-chaturdashi': [
    { tone: 'traditional', text: {
      en: 'Before the lamps come out tomorrow, the pre-dawn bath today clears whatever the year accumulated. Shubh Narak Chaturdashi.',
      hi: 'कल के दीपों से पहले, आज का अरुणोदय स्नान वर्ष भर जो जमा हुआ उसे साफ़ करता है। शुभ नरक चतुर्दशी।',
    }},
    { tone: 'family', text: {
      en: 'Choti Diwali — the warm-up. Light a single lamp, eat one sweet, sleep early. Tomorrow is the bigger night.',
      hi: 'छोटी दीपावली — पूर्वाभ्यास। एक दीप जलाएँ, एक मिठाई लें, जल्दी सो जाएँ। कल बड़ी रात है।',
    }},
    { tone: 'modern', text: {
      en: 'The work of celebration starts before celebration does. Wishing you a quiet, clean Narak Chaturdashi.',
      hi: 'उत्सव का कार्य उत्सव से पहले प्रारम्भ होता है। आपको शान्त, स्वच्छ नरक चतुर्दशी मिले।',
    }},
  ],

  'govardhan-puja': [
    { tone: 'traditional', text: {
      en: 'A mountain lifted on a little finger is a reminder: the right intent makes the impossible carry-able. Shubh Govardhan Puja.',
      hi: 'छोटी अँगुली पर पर्वत उठाना यह स्मरण है: सही संकल्प असम्भव को भी उठा देता है। शुभ गोवर्धन पूजा।',
    }},
    { tone: 'family', text: {
      en: 'Annakut — many dishes, one altar. Wishing your kitchen the gift of plenty to share. Govardhan Puja wishes.',
      hi: 'अन्नकूट — अनेक व्यञ्जन, एक वेदी। आपकी रसोई को बाँटने योग्य प्रचुरता मिले। गोवर्धन पूजा की शुभकामनाएँ।',
    }},
    { tone: 'modern', text: {
      en: 'The festival of the home — of the roof that keeps you dry. Wishing your home shelter in every storm this year.',
      hi: 'घर का पर्व — उस छत का पर्व जो आपको भीगने नहीं देती। आपके घर को इस वर्ष की हर बौछार में आश्रय मिले।',
    }},
  ],

  'bhai-dooj': [
    { tone: 'family', text: {
      en: 'Yama-Yamuna day. May your sister\'s tilak on your forehead today shield you from the worst of next year. Bhai Dooj wishes.',
      hi: 'यम-यमुना का दिन। आज जो तिलक आपकी बहन ने आपके माथे पर लगाया, वह आगामी वर्ष की सबसे कठिन घड़ी से आपकी रक्षा करे। भाई दूज की शुभकामनाएँ।',
    }},
    { tone: 'modern', text: {
      en: 'Two days after Diwali, the lights still on, your sister hands you a plate. That\'s Bhai Dooj. Hold it close.',
      hi: 'दीपावली के दो दिन बाद, दीप अभी जल रहे हैं, बहन आपको थाली देती है। यही भाई दूज है। उसे सहेजें।',
    }},
    { tone: 'traditional', text: {
      en: 'May the bond of this day outlast every distance you both will cover. Shubh Bhai Dooj.',
      hi: 'आज का यह बन्धन उस हर दूरी से अधिक टिकाऊ हो जो आप दोनों तय करेंगे। शुभ भाई दूज।',
    }},
  ],

  'hanuman-jayanti': [
    { tone: 'traditional', text: {
      en: 'Hanuman never asked Rama for anything for himself. Wishing you the strength to serve without keeping score. Jai Bajrang Bali.',
      hi: 'हनुमान ने राम से अपने लिए कभी कुछ नहीं माँगा। आपको बिना हिसाब रखे सेवा करने का बल मिले। जय बजरंग बली।',
    }},
    { tone: 'modern', text: {
      en: 'The chest that opens to show what\'s already inside. Hanuman Jayanti reminds us — the answer was never elsewhere.',
      hi: 'वह वक्ष जो खुलकर दिखाता है कि भीतर पहले से क्या है। हनुमान जयन्ती स्मरण कराती है — उत्तर कहीं और कभी नहीं था।',
    }},
    { tone: 'family', text: {
      en: 'A Mangalvar lamp, a chalisa whispered, and a long walk afterwards. Hanuman Jayanti wishes for an unshakable day.',
      hi: 'मंगलवार का दीप, मन्द स्वर में चालीसा, और तत्पश्चात लम्बी पदयात्रा। हनुमान जयन्ती पर अडिग दिन की शुभकामना।',
    }},
  ],

  'akshaya-tritiya': [
    { tone: 'traditional', text: {
      en: 'Whatever you begin today is said to never run out. Wishing you the wisdom to begin something worth keeping. Shubh Akshaya Tritiya.',
      hi: 'आज जो आरम्भ करते हैं वह अक्षय कहा गया है। आपको वह विवेक मिले कि कुछ ऐसा आरम्भ करें जो रखने योग्य हो। शुभ अक्षय तृतीया।',
    }},
    { tone: 'business', text: {
      en: 'A small purchase of gold, a small commitment to a habit you want to keep — both work today. Akshaya Tritiya wishes.',
      hi: 'थोड़ा सा सोना, एक छोटा सा संकल्प जिस आदत को आप रखना चाहते हैं — दोनों आज लाभ देंगे। अक्षय तृतीया की शुभकामनाएँ।',
    }},
    { tone: 'modern', text: {
      en: '"Akshaya" — the inexhaustible. Wishing you the discipline to deserve what doesn\'t run out.',
      hi: '"अक्षय" — कभी समाप्त न होने वाला। आपको वह अनुशासन मिले जो उस वस्तु के योग्य हो जो कभी क्षीण नहीं होती।',
    }},
  ],

  'guru-purnima': [
    { tone: 'traditional', text: {
      en: 'A guru is anyone who removed darkness for you, even once. Wishing you the gratitude to name them today. Guru Purnima wishes.',
      hi: 'गुरु वह है जिसने आपके लिए एक बार भी अन्धकार दूर किया। आज उन्हें नाम लेकर स्मरण करने की कृतज्ञता आपको प्राप्त हो। गुरु पूर्णिमा की शुभकामनाएँ।',
    }},
    { tone: 'modern', text: {
      en: 'Books, teachers, podcasts, parents — Guru Purnima is the day we thank every voice that taught us something we now know.',
      hi: 'पुस्तकें, शिक्षक, पॉडकास्ट, माता-पिता — गुरु पूर्णिमा वह दिन है जब हम उस हर स्वर का धन्यवाद करते हैं जिसने हमें सिखाया।',
    }},
    { tone: 'family', text: {
      en: 'The first guru was a parent. Wishing you the call you have been postponing.',
      hi: 'प्रथम गुरु माता-पिता थे। आपको वह फोन कॉल मिले जिसे आप टाल रहे हैं।',
    }},
  ],

  'vasant-panchami': [
    { tone: 'traditional', text: {
      en: 'Yellow, books, and Saraswati on the desk. Wishing the student in you the courage to ask one harder question this year. Shubh Vasant Panchami.',
      hi: 'पीला रंग, पुस्तकें, और मेज़ पर सरस्वती। आपके भीतर के विद्यार्थी को इस वर्ष एक कठिन प्रश्न पूछने का साहस मिले। शुभ वसन्त पञ्चमी।',
    }},
    { tone: 'modern', text: {
      en: 'Spring announces itself. Time to start the thing you said "next year" about last year. Vasant Panchami wishes.',
      hi: 'वसन्त की घोषणा हो चुकी है। पिछले वर्ष जिस कार्य के लिए "अगले वर्ष" कहा था, समय आ गया है। वसन्त पञ्चमी की शुभकामनाएँ।',
    }},
    { tone: 'family', text: {
      en: 'A child\'s first letter is traditionally written today. Wishing your home the joy of beginnings.',
      hi: 'आज परम्परा से बालक का प्रथम अक्षर लिखा जाता है। आपके घर को शुभारम्भ का आनन्द मिले।',
    }},
  ],

  'holika-dahan': [
    { tone: 'traditional', text: {
      en: 'Tonight the fire takes what should not survive the year. Wishing you the honesty to feed it the right things. Shubh Holika Dahan.',
      hi: 'आज रात्रि अग्नि उसे ग्रहण करती है जो वर्ष भर जीवित नहीं रहना चाहिए। उसे सही वस्तु अर्पित करने की ईमानदारी आपको प्राप्त हो। शुभ होलिका दहन।',
    }},
    { tone: 'modern', text: {
      en: 'Bonfire night before the colour day. Take a piece of paper, write what you want gone, drop it in. Holika Dahan wishes.',
      hi: 'रंगों के दिन से पूर्व अग्नि की रात्रि। एक काग़ज़ लें, जो जाना चाहिए वह लिखें, अग्नि में डालें। होलिका दहन की शुभकामनाएँ।',
    }},
    { tone: 'family', text: {
      en: 'A few logs, a few neighbours, a circle of light in March. The simplest version of community we still have. Wishing you that warmth.',
      hi: 'कुछ लकड़ियाँ, कुछ पड़ोसी, मार्च में प्रकाश का एक वृत्त। समुदाय का जो सरलतम रूप अब भी हमारे पास है। वह तपन आपको मिले।',
    }},
  ],

  'hartalika-teej': [
    { tone: 'traditional', text: {
      en: 'Parvati waited for the right partner, not the available one. Wishing every woman observing today the patience that earned her Shiva. Shubh Hartalika Teej.',
      hi: 'पार्वती ने सुपात्र की प्रतीक्षा की, उपलब्ध की नहीं। आज व्रत रखने वाली प्रत्येक स्त्री को वह धैर्य मिले जिसने उन्हें शिव दिलाए। शुभ हरतालिका तीज।',
    }},
    { tone: 'family', text: {
      en: 'A fast kept without water, a husband held in mind all day. Hartalika Teej wishes for the strength of that devotion.',
      hi: 'निर्जल व्रत, पति का सम्पूर्ण दिन स्मरण। उस भक्ति का बल आपको मिले। हरतालिका तीज की शुभकामनाएँ।',
    }},
    { tone: 'modern', text: {
      en: 'A festival that asks: what would you wait for that long? Hartalika Teej wishes to find your answer.',
      hi: 'एक पर्व जो पूछता है: इतनी प्रतीक्षा आप किसके लिए कर सकती हैं? आपको उत्तर मिले। हरतालिका तीज की शुभकामनाएँ।',
    }},
  ],

  'chhath-puja': [
    { tone: 'traditional', text: {
      en: 'Standing in the water, offering arghya to a setting sun — gratitude before request. Wishing you that order. Shubh Chhath.',
      hi: 'जल में खड़े होकर, अस्ताचलगामी सूर्य को अर्घ्य — माँग से पूर्व कृतज्ञता। आपको वह क्रम मिले। शुभ छठ।',
    }},
    { tone: 'family', text: {
      en: 'Four days, no shortcuts. Wishing the women who keep this fast the strength of the rivers they stand in.',
      hi: 'चार दिन, कोई शिथिलता नहीं। यह व्रत रखने वाली स्त्रियों को उन नदियों का बल मिले जिनमें वे खड़ी हैं।',
    }},
    { tone: 'modern', text: {
      en: 'The sun is the only god you can see. Chhath is when you say so out loud. Wishing you that clarity.',
      hi: 'सूर्य ही एकमात्र दृश्य देवता हैं। छठ वह क्षण है जब हम इसे कहते हैं। आपको वह स्पष्टता मिले।',
    }},
  ],

  'makar-sankranti': [
    { tone: 'traditional', text: {
      en: 'The sun begins its northward turn. Wishing you the courage to make the small adjustment that changes everything. Shubh Makar Sankranti.',
      hi: 'सूर्य उत्तरायण की ओर मुड़ता है। आपको वह छोटा सा परिवर्तन करने का साहस मिले जो सब कुछ बदल देता है। शुभ मकर सङ्क्रान्ति।',
    }},
    { tone: 'family', text: {
      en: 'Sesame sweets, kite strings on rooftops, and bath in the river if you can. Makar Sankranti wishes for the simple version.',
      hi: 'तिल मिठाइयाँ, छतों पर पतंग के तार, यदि सम्भव हो तो नदी स्नान। मकर सङ्क्रान्ति की सरलतम रूप की शुभकामनाएँ।',
    }},
    { tone: 'modern', text: {
      en: 'After today the days get longer. The festival of permission to be hopeful again. Wishing you that.',
      hi: 'आज के बाद दिन लम्बे होते जाएँगे। आशावान होने की अनुमति का पर्व। आपको वह मिले।',
    }},
  ],
};
