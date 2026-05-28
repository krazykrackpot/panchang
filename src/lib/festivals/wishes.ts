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
    { tone: 'business', text: {
      en: 'Open the new ledger with one entry: a name of a customer who didn\'t deserve your patience but got it anyway. Shubh Diwali.',
      hi: 'नया बही खाता एक प्रविष्टि से खोलें: किसी ग्राहक का नाम जो आपके धैर्य के योग्य न था फिर भी आपने धैर्य दिखाया। शुभ दीपावली।',
    }},
    { tone: 'traditional', text: {
      en: 'May Lakshmi see your home tonight and choose to stay. May the year ahead be kinder than the one behind. Shubh Deepavali.',
      hi: 'आज रात्रि लक्ष्मी आपके घर को देखें एवं ठहरना चुनें। आगामी वर्ष पिछले वर्ष से अधिक करुणामय हो। शुभ दीपावली।',
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
    { tone: 'modern', text: {
      en: 'Buy one small thing that lasts. The Dhanteras tradition is older than capitalism — let your purchase honour that.',
      hi: 'एक छोटी सी चीज़ ख़रीदें जो टिके। धनतेरस की परम्परा पूंजीवाद से पुरानी है — आपका क्रय उसी का सम्मान करे।',
    }},
    { tone: 'traditional', text: {
      en: 'Yama Deepam at the front door tonight — a single ghee lamp facing south to deflect a year of small misfortunes. Shubh Dhanteras.',
      hi: 'आज रात्रि मुख्य द्वार पर यम दीपम — दक्षिण मुख एक घी का दीप जो वर्ष भर के छोटे अनिष्टों को परे करे। शुभ धनतेरस।',
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
    { tone: 'business', text: {
      en: 'Holi is the festival that says: the boundaries you draw at the office aren\'t the only ones. Wishing you the day off without guilt.',
      hi: 'होली वह पर्व है जो कहता है: कार्यस्थल पर खींची सीमाएँ ही एकमात्र सीमाएँ नहीं। आपको बिना अपराधबोध के अवकाश की शुभकामना।',
    }},
    { tone: 'modern', text: {
      en: 'Throw the colour at someone who has been kind to you this year. Holi is gratitude that stains.',
      hi: 'इस वर्ष जिसने आपके साथ सद्भाव रखा हो, उस पर रंग डालें। होली एक ऐसी कृतज्ञता है जो रङ्ग छोड़ती है।',
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
    { tone: 'business', text: {
      en: 'Tonight there is a god who chooses not to be photographed. Wishing you the discipline to do work nobody applauds. Om Namah Shivaya.',
      hi: 'आज रात्रि एक देवता हैं जो चित्र नहीं लेने देते। आपको वह अनुशासन मिले जो बिना तालियों के भी कार्य करे। ॐ नमः शिवाय।',
    }},
    { tone: 'family', text: {
      en: 'Whoever you have been trying to forgive — whisper their name into the lamp before midnight. Mahashivaratri is the night to set it down.',
      hi: 'जिसको आप क्षमा करने का प्रयास कर रहे हैं — उसका नाम मध्यरात्रि से पहले दीप में फुसफुसाएँ। महाशिवरात्रि उसी को रख देने की रात्रि है।',
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
    { tone: 'family', text: {
      en: 'Read one shloka from the Sundara Kanda aloud to whoever is in the room. That\'s Ram Navami.',
      hi: 'घर में जो भी हो उसे सुन्दर काण्ड का एक श्लोक ऊँचे स्वर में पढ़कर सुनाएँ। यही राम नवमी है।',
    }},
    { tone: 'traditional', text: {
      en: 'May the maryada of Rama be the standard your day measures against. Jai Shri Ram.',
      hi: 'राम की मर्यादा आज का मानक हो जिससे आप अपने दिन को नापें। जय श्री राम।',
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
    { tone: 'family', text: {
      en: 'A small swing for Bal Gopal, fresh makhan, an aunt who insists on holding the baby longer than you wanted. Wishing you that house tonight.',
      hi: 'बाल गोपाल के लिए छोटा झूला, ताज़ा माखन, एक चाची जो बच्चे को आपसे अधिक देर तक पकड़े रहना चाहती हैं। आज रात्रि आपको वही घर मिले।',
    }},
    { tone: 'traditional', text: {
      en: 'May the Krishna in your chest take over for one full hour tonight. Shubh Janmashtami.',
      hi: 'आपके भीतर का कृष्ण आज रात्रि कम से कम एक पूर्ण घंटे के लिए अधिकार ले ले। शुभ जन्माष्टमी।',
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
    { tone: 'business', text: {
      en: 'Begin the work that you have been postponing. Ganesha removes obstacles only after you have decided what you are walking towards. Ganpati Bappa Morya.',
      hi: 'जिस कार्य को आप टाल रहे हैं उसे आज प्रारम्भ करें। गणेश विघ्न तभी हटाते हैं जब आप दिशा निश्चित कर लें। गणपति बप्पा मोरया।',
    }},
    { tone: 'family', text: {
      en: '21 modaks, not 1. Bappa knows the difference between offering and gesture. Wishing your kitchen the patience for the longer count.',
      hi: '२१ मोदक, न कि १। बप्पा अर्पण एवं संकेत के बीच का अन्तर जानते हैं। आपकी रसोई को लम्बी गणना का धैर्य मिले।',
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
    { tone: 'business', text: {
      en: 'A small Shastra Puja at your desk — a pen, a screen, the tool you actually use to fight the world. Vijayadashami wishes for the right weapon.',
      hi: 'अपनी मेज़ पर एक छोटी शस्त्र पूजा करें — एक कलम, एक स्क्रीन, वह उपकरण जिससे आप संसार से लड़ते हैं। विजयादशमी पर उचित शस्त्र की कामना।',
    }},
    { tone: 'family', text: {
      en: 'Shami leaf to your father, an apta to your sister, kind words to your mother. The festival is older than the legend says.',
      hi: 'पिता को शमी पत्र, बहन को अपटा, माता को सद्वचन। यह पर्व कथा से भी पुराना है।',
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
    { tone: 'family', text: {
      en: 'If your brother is far this year, a video call still counts. Tie the rakhi on a chair if you have to. The thread doesn\'t care about geography.',
      hi: 'यदि भाई इस वर्ष दूर हैं, तो वीडियो कॉल भी पर्याप्त है। यदि आवश्यक हो तो कुर्सी पर ही राखी बाँधें। धागे को भूगोल की चिन्ता नहीं।',
    }},
    { tone: 'modern', text: {
      en: 'A brother-sister bond is the cleanest contract you ever signed without paperwork. Wishing you that contract honoured today.',
      hi: 'भाई-बहन का बन्धन सबसे स्वच्छ अनुबन्ध है जिसे आपने बिना काग़ज़ हस्ताक्षरित किया। आज वह अनुबन्ध निभे, यही कामना।',
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
    { tone: 'traditional', text: {
      en: 'Abhyanga before dawn — warm oil, warm water, no rush. The simplest year-end ritual we have. Shubh Choti Diwali.',
      hi: 'भोर से पूर्व अभ्यङ्ग — गर्म तेल, गर्म जल, कोई शीघ्रता नहीं। वर्षान्त की हमारी सरलतम विधि। शुभ छोटी दीपावली।',
    }},
    { tone: 'family', text: {
      en: 'The day Krishna defeated Narakasura — and the day your grandmother insists you bathe before sunrise. Both are right. Wishing you the bath.',
      hi: 'जिस दिन कृष्ण ने नरकासुर का वध किया था — एवं जिस दिन आपकी दादी आग्रह करती हैं कि सूर्योदय से पूर्व स्नान करें। दोनों सही हैं। आपको स्नान की कामना।',
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
    { tone: 'traditional', text: {
      en: 'A small Govardhan made from clay or cow dung in the courtyard, 56 dishes if you can, fewer if you can\'t. The gesture matters more than the count.',
      hi: 'आँगन में मिट्टी या गोबर का छोटा गोवर्धन, ५६ व्यञ्जन यदि सम्भव हो, कम यदि न हो। संकेत संख्या से अधिक महत्वपूर्ण है।',
    }},
    { tone: 'family', text: {
      en: 'The Annakut is for sharing — call a neighbour you have not spoken to all year. Govardhan Puja wishes for the door you reopen today.',
      hi: 'अन्नकूट साझा करने के लिए है — किसी पड़ोसी को बुलाएँ जिनसे आपने वर्ष भर बात नहीं की। आज जो द्वार आप पुनः खोलें, गोवर्धन पूजा की उसी की कामना।',
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
    { tone: 'modern', text: {
      en: 'Yama, Yamuna, and you. Three days after Diwali, the smaller bond reasserts itself. Wishing you whichever side of it you are on today.',
      hi: 'यम, यमुना, एवं आप। दीपावली के तीन दिन बाद, छोटा बन्धन पुनः स्थापित होता है। आज आप जिस ओर भी हों, उसकी कामना।',
    }},
    { tone: 'family', text: {
      en: 'Whichever sister fed you today, owe her one. Wishing you the kind of brother-sister account that never closes. Shubh Bhai Dooj.',
      hi: 'आज जो बहन आपको भोजन कराए, उन पर एक ऋण है। आपको ऐसा भाई-बहन का खाता मिले जो कभी न बन्द हो। शुभ भाई दूज।',
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
    { tone: 'business', text: {
      en: 'Hanuman crossed the ocean for someone else\'s reunion. Wishing you the strength to do the unrewarded work that turns out to matter most. Jai Bajrang Bali.',
      hi: 'हनुमान ने किसी और के पुनर्मिलन के लिए समुद्र पार किया था। आपको वह बल मिले जो उस अप्रसंशित कार्य को करे जो अन्ततः सबसे महत्वपूर्ण सिद्ध होता है। जय बजरंग बली।',
    }},
    { tone: 'traditional', text: {
      en: 'Sindoor on the idol, a small offering of jaggery, and the chalisa from memory. Hanuman Jayanti is the festival of the simple repeat.',
      hi: 'मूर्ति पर सिन्दूर, थोड़ा गुड़ का अर्पण, स्मरण से चालीसा। हनुमान जयन्ती सरल पुनरावृत्ति का पर्व है।',
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
    { tone: 'family', text: {
      en: 'A small donation made today returns endlessly. Wishing you the wisdom to give to someone whose name you will not remember tomorrow.',
      hi: 'आज दिया छोटा सा दान अनन्त बार लौटता है। आपको वह विवेक मिले कि किसी ऐसे व्यक्ति को दें जिनका नाम आप कल भूल जाएँगे।',
    }},
    { tone: 'traditional', text: {
      en: 'May whatever you start today never run out. Akshaya Tritiya is the festival of the first step that keeps walking.',
      hi: 'आज आप जो भी प्रारम्भ करें वह कभी क्षीण न हो। अक्षय तृतीया उस प्रथम पग का पर्व है जो चलता रहता है।',
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
    { tone: 'business', text: {
      en: 'Send one message to a former mentor with the words "this worked" attached. Guru Purnima is gratitude with evidence.',
      hi: 'किसी पूर्व मार्गदर्शक को एक सन्देश भेजें जिसमें "यह काम कर गया" लिखा हो। गुरु पूर्णिमा प्रमाण-सहित कृतज्ञता है।',
    }},
    { tone: 'traditional', text: {
      en: 'May the teaching that shaped you find its way back to its source today. Shubh Guru Purnima.',
      hi: 'जिस शिक्षा ने आपको गढ़ा, वह आज अपने स्रोत तक लौट जाए। शुभ गुरु पूर्णिमा।',
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
    { tone: 'business', text: {
      en: 'Saraswati doesn\'t care what you do for a living — she cares whether you are still learning. Wishing you a Vasant Panchami of fresh notebooks.',
      hi: 'सरस्वती को परवाह नहीं कि आप क्या काम करते हैं — चिन्ता इस बात की है कि आप अभी भी सीख रहे हैं या नहीं। आपको नई पुस्तिकाओं की वसन्त पञ्चमी मिले।',
    }},
    { tone: 'traditional', text: {
      en: 'Yellow turmeric on the desk, a thread tied around the wrist, a stotra recited. Vasant Panchami is the festival of the threshold.',
      hi: 'मेज़ पर पीली हल्दी, कलाई पर बँधा धागा, उच्चारित स्तोत्र। वसन्त पञ्चमी देहली का पर्व है।',
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
    { tone: 'traditional', text: {
      en: 'Holika consented to be burnt — that\'s the part the children\'s version skips. Wishing you the maturity to read the story whole this year.',
      hi: 'होलिका ने जलने की सहमति दी थी — यह वह अंश है जो बच्चों की कथा छोड़ देती है। आपको इस वर्ष कथा को पूर्ण रूप से पढ़ने की परिपक्वता मिले।',
    }},
    { tone: 'modern', text: {
      en: 'Sit by the fire long enough that you forget what you came to release. Then go home and remember.',
      hi: 'अग्नि के पास इतनी देर बैठें कि आप भूल जाएँ कि किस वस्तु को त्यागने आए थे। फिर घर जाकर स्मरण करें।',
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
    { tone: 'traditional', text: {
      en: 'Sand idol, no water, the husband held in mind through the night. Shubh Hartalika Teej.',
      hi: 'रेत की मूर्ति, निर्जल, रात्रि भर मन में रखा पति। शुभ हरतालिका तीज।',
    }},
    { tone: 'family', text: {
      en: 'To every woman observing today — the discipline of waiting is its own offering. Wishing you the morning after.',
      hi: 'आज व्रत रखने वाली प्रत्येक स्त्री को — प्रतीक्षा का अनुशासन स्वयं में एक अर्पण है। आपको पारणा प्रातः की कामना।',
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
    { tone: 'traditional', text: {
      en: 'Thekua in the basket, knees in the cold water, the sun on its way down. Wishing the women keeping this fast the strength they have already earned.',
      hi: 'टोकरी में ठेकुआ, शीत जल में घुटने, अस्ताचलगामी सूर्य। यह व्रत रखने वाली स्त्रियों को वह बल मिले जो उन्होंने पहले ही अर्जित किया है।',
    }},
    { tone: 'family', text: {
      en: 'Three generations standing in the water at sunset. The festival is a family album that prints itself every year. Shubh Chhath.',
      hi: 'सूर्यास्त के समय जल में तीन पीढ़ियाँ। यह पर्व एक पारिवारिक एल्बम है जो हर वर्ष स्वयं छपता है। शुभ छठ।',
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
    { tone: 'business', text: {
      en: 'Uttarayana. The compass turns. Whatever direction you have been postponing, this is the right week to head toward. Shubh Makar Sankranti.',
      hi: 'उत्तरायण। दिशासूचक मुड़ गया। जिस दिशा को आप टाल रहे थे, उसी की ओर बढ़ने का यह सही सप्ताह है। शुभ मकर सङ्क्रान्ति।',
    }},
    { tone: 'traditional', text: {
      en: 'Til-gud, a kite if you can find one, and a bath in cold water before the sun is high. The old way still works. Shubh Sankranti.',
      hi: 'तिल-गुड़, यदि मिले तो पतंग, और सूर्य के ऊँचा होने से पूर्व शीतल जल में स्नान। पुरानी विधि अभी भी कार्य करती है। शुभ सङ्क्रान्ति।',
    }},
  ],
};
