'use client';

import { useLocale } from 'next-intl';
import { motion } from 'framer-motion';
import { Link } from '@/lib/i18n/navigation';
import { Compass, ArrowRight, AlertTriangle, Star, Flame, Moon } from 'lucide-react';
import type { Locale } from '@/types/panchang';

type Tri = { en: string; hi: string; sa: string };
const t = (obj: Tri, locale: string) => obj[locale as Locale] ?? obj.en;

// ─── Inline trilingual labels ──────────────────────────────────────────────
const L = {
  title: { en: 'Nivas & Shool', hi: 'निवास और शूल', sa: 'निवासः शूलश्च' },
  subtitle: { en: 'The Cosmic Abodes & Directional Thorns — Traditional indicators of auspice, movement, and elemental alignment', hi: 'ब्रह्मांडीय निवास और दिशा शूल — शुभता, गति और तात्विक संरेखण के पारंपरिक संकेतक', sa: 'ब्रह्माण्डीय निवासाः दिशाशूलश्च — शुभतायाः गत्याः तात्विकसंरेखणस्य च पारंपरिकसंकेताः' },

  dishashool: { en: 'Disha Shool', hi: 'दिशा शूल', sa: 'दिशाशूलम्' },
  dishashoolDesc: {
    en: 'Disha Shool (दिशा + शूल = Direction + Thorn) is a traditional guideline that designates one cardinal direction as inauspicious for travel or initiating new journeys on each weekday. Originating in ancient Muhurta texts, it is believed that the planetary lord of the weekday casts a sharp "thorn" in a specific direction — travel toward that direction without remedy risks delays, accidents, or failure. Disha Shool does NOT apply to unavoidable daily commutes or essential travel, only to new ventures, pilgrimages, or auspicious journeys.',
    hi: 'दिशा शूल (दिशा + शूल = दिशा + काँटा) एक पारंपरिक दिशा-निर्देश है जो प्रत्येक वार को यात्रा या नई यात्राएं शुरू करने के लिए एक दिशा को अशुभ बताता है। प्राचीन मुहूर्त ग्रंथों में उद्भव, ऐसा माना जाता है कि वार के ग्रह स्वामी एक विशिष्ट दिशा में तीव्र "शूल" फेंकते हैं — बिना उपाय के उस दिशा में यात्रा में देरी, दुर्घटनाएं या विफलता का जोखिम होता है।',
    sa: 'दिशाशूलम् (दिशा + शूल = दिशा + कण्टकः) एकः पारंपरिको निर्देशः यः प्रत्येकं वारे यात्रायाः नवयात्राणाम् आरम्भाय एकां दिशां अशुभां निर्दिशति।',
  },
  remedyTitle: { en: 'Universal Remedy', hi: 'सार्वभौमिक उपाय', sa: 'सार्वभौमिक उपायः' },
  remedyDesc: {
    en: 'Consume the designated food item before departing in the shool direction. This pacifies the planetary thorn and renders the journey safe.',
    hi: 'शूल दिशा में प्रस्थान से पहले निर्धारित खाद्य पदार्थ का सेवन करें। यह ग्रह शूल को शांत करता है और यात्रा को सुरक्षित बनाता है।',
    sa: 'शूलदिशायां प्रस्थानात् पूर्वं निर्दिष्टं खाद्यं भक्षयेत्।',
  },

  shivaVaas: { en: 'Shiva Vaas', hi: 'शिव वास', sa: 'शिवावासः' },
  shivaVaasDesc: {
    en: 'Shiva Vaas (Abode of Shiva) describes which of the five cosmic abodes Lord Shiva resides in on a given day, determined by the Tithi (lunar day). Shiva constantly moves between these five states — his location indicates the cosmic energy available for worship, rituals, and daily activities. On auspicious abodes, Shiva is easily pleased; on Shamshan, he is in his Rudra (fierce) form and may be hard to propitiate.',
    hi: 'शिव वास (शिव का निवास) बताता है कि भगवान शिव किसी दिन तिथि के अनुसार पाँच ब्रह्मांडीय निवासों में से किसमें रहते हैं। शिव इन पाँच अवस्थाओं के बीच निरंतर गतिमान रहते हैं — उनका स्थान पूजा, अनुष्ठान और दैनिक गतिविधियों के लिए उपलब्ध ब्रह्मांडीय ऊर्जा को दर्शाता है।',
    sa: 'शिवावासः (शिवस्य निवासः) वर्णयति यत् भगवान् शिवः कस्यां तिथौ पञ्चसु ब्रह्माण्डीय निवासेषु कुत्र वसति।',
  },

  agniVaas: { en: 'Agni Vaas', hi: 'अग्नि वास', sa: 'अग्निवासः' },
  agniVaasDesc: {
    en: 'Agni Vaas (Abode of the Cosmic Fire) describes the elemental plane where the cosmic fire deity (Agni) resides on each weekday. This directly impacts the efficacy of fire-based rituals: Homa, Yajna, Agnihotra, and Deepa worship. When Agni is in Akash (Sky) or Prithvi (Earth), fire rituals are highly productive. In Patala (netherworld), they should be avoided or performed with special precautions.',
    hi: 'अग्नि वास (ब्रह्मांडीय अग्नि का निवास) प्रत्येक वार को अग्नि देवता के तात्विक आयाम का वर्णन करता है। यह अग्नि-आधारित अनुष्ठानों — होम, यज्ञ, अग्निहोत्र और दीप पूजा — की प्रभावशीलता पर सीधा प्रभाव डालता है।',
    sa: 'अग्निवासः (ब्रह्माण्डीय अग्नेः निवासः) प्रत्येकं वारे अग्नेः तात्विकस्तरं वर्णयति। होम-यज्ञ-अग्निहोत्रादि अनुष्ठानानां प्रभावे इदं प्रत्यक्षं प्रभवति।',
  },

  chandraVaas: { en: 'Chandra Vaas', hi: 'चंद्र वास', sa: 'चन्द्रावासः' },
  chandraVaasDesc: {
    en: 'Chandra Vaas (Abode of the Moon) is determined by which pada (quarter) of the current Nakshatra the Moon occupies. Each Nakshatra is divided into 4 padas; the Moon traverses each pada in approximately 3–4 hours. The pada determines the Moon\'s "abode" and its quality for auspicious activities. Deva (celestial) pada is most auspicious; Rakshasa (demonic) pada should be avoided for sacred rites.',
    hi: 'चंद्र वास (चंद्रमा का निवास) वर्तमान नक्षत्र के किस पाद (चतुर्थांश) में चंद्रमा स्थित है, इससे निर्धारित होता है। प्रत्येक नक्षत्र को 4 पादों में विभाजित किया गया है; चंद्रमा प्रत्येक पाद को लगभग 3-4 घंटे में पार करता है।',
    sa: 'चन्द्रावासः वर्तमाननक्षत्रस्य कस्मिन् पादे (चतुर्थांशे) चन्द्रः वर्तते इत्यनेन निर्धार्यते।',
  },

  rahuVaas: { en: 'Rahu Vaas', hi: 'राहु वास', sa: 'राहोः वासः' },
  rahuVaasDesc: {
    en: 'Rahu Vaas indicates the direction in which Rahu (the north lunar node) faces on each weekday. Rahu\'s gaze is inauspicious for travel and construction. This is closely related to Disha Shool — on some days they coincide, amplifying the inauspice of that direction. Rahu Vaas is particularly important in Tamil and Kerala astrological traditions.',
    hi: 'राहु वास प्रत्येक वार को राहु (उत्तरी चंद्र नोड) किस दिशा में मुख किए हुए है, यह बताता है। राहु की दृष्टि यात्रा और निर्माण के लिए अशुभ है। यह दिशा शूल से निकटता से संबंधित है।',
    sa: 'राहोः वासः प्रत्येकं वारे राहुः (उत्तरचन्द्रनोडः) कां दिशं मुखं करोति इति वर्णयति।',
  },

  textualBasis: { en: 'Textual Basis', hi: 'शास्त्रीय आधार', sa: 'शास्त्रीयाधारः' },
  practicalNote: { en: 'Practical Application', hi: 'व्यावहारिक अनुप्रयोग', sa: 'व्यावहारिकः प्रयोगः' },
  backToPanchang: { en: '← Back to Panchang', hi: '← पञ्चाङ्ग पर वापस', sa: '← पञ्चाङ्गं प्रति' },
  auspicious: { en: 'Auspicious', hi: 'शुभ', sa: 'शुभम्' },
  inauspicious: { en: 'Inauspicious', hi: 'अशुभ', sa: 'अशुभम्' },
  neutral: { en: 'Neutral', hi: 'तटस्थ', sa: 'तटस्थम्' },
  mixed: { en: 'Mixed', hi: 'मिश्रित', sa: 'मिश्रितम्' },
  remedy: { en: 'Remedy', hi: 'उपाय', sa: 'उपायः' },
  weekday: { en: 'Weekday', hi: 'वार', sa: 'वारः' },
  direction: { en: 'Direction', hi: 'दिशा', sa: 'दिशा' },
  planet: { en: 'Ruling Planet', hi: 'अधिपति ग्रह', sa: 'अधिपतिग्रहः' },
  tithi: { en: 'Tithi', hi: 'तिथि', sa: 'तिथिः' },
  abode: { en: 'Abode', hi: 'निवास', sa: 'निवासः' },
  nature: { en: 'Nature', hi: 'प्रकृति', sa: 'प्रकृतिः' },
  activities: { en: 'Activities', hi: 'गतिविधियाँ', sa: 'कार्याणि' },
  pada: { en: 'Nakshatra Pada', hi: 'नक्षत्र पाद', sa: 'नक्षत्रपादः' },
  plane: { en: 'Elemental Plane', hi: 'तात्विक स्तर', sa: 'तात्विकस्तरः' },
  significance: { en: 'Significance', hi: 'महत्व', sa: 'महत्त्वम्' },
};

// ─── Data tables ────────────────────────────────────────────────────────────

const DISHA_SHOOL = [
  {
    day: { en: 'Sunday', hi: 'रविवार', sa: 'रविवासरः' },
    planet: { en: 'Sun (Surya)', hi: 'सूर्य', sa: 'सूर्यः' },
    direction: { en: 'West', hi: 'पश्चिम', sa: 'पश्चिमम्' },
    directionHi: 'प', // compass letter
    color: 'text-amber-300',
    border: 'border-amber-500/30',
    bg: 'bg-amber-500/5',
    remedy: { en: 'Eat jaggery (gur) before traveling West', hi: 'पश्चिम दिशा में यात्रा से पहले गुड़ खाएं', sa: 'पश्चिमं यात्रात् पूर्वं गुडं भक्षयेत्' },
    nature: 'inauspicious',
    note: { en: 'The Sun, facing West at sunset, is in a weakened position', hi: 'सूर्यास्त के समय पश्चिम की ओर मुख करके सूर्य कमजोर स्थिति में होते हैं', sa: '' },
  },
  {
    day: { en: 'Monday', hi: 'सोमवार', sa: 'सोमवासरः' },
    planet: { en: 'Moon (Chandra)', hi: 'चंद्र', sa: 'चन्द्रः' },
    direction: { en: 'East', hi: 'पूर्व', sa: 'पूर्वम्' },
    directionHi: 'पू',
    color: 'text-blue-300',
    border: 'border-blue-500/30',
    bg: 'bg-blue-500/5',
    remedy: { en: 'Eat curd/yogurt before traveling East', hi: 'पूर्व दिशा में यात्रा से पहले दही खाएं', sa: 'पूर्वं यात्रात् पूर्वं दध्नः भक्षयेत्' },
    nature: 'inauspicious',
    note: { en: 'Moon faces East — its gaze blocks auspicious entry into the rising Sun\'s domain', hi: 'चंद्रमा पूर्व की ओर मुख करता है — उसकी दृष्टि उदीयमान सूर्य के क्षेत्र में शुभ प्रवेश को अवरुद्ध करती है', sa: '' },
  },
  {
    day: { en: 'Tuesday', hi: 'मंगलवार', sa: 'मङ्गलवासरः' },
    planet: { en: 'Mars (Mangal)', hi: 'मंगल', sa: 'मङ्गलः' },
    direction: { en: 'North', hi: 'उत्तर', sa: 'उत्तरम्' },
    directionHi: 'उ',
    color: 'text-red-400',
    border: 'border-red-500/30',
    bg: 'bg-red-500/5',
    remedy: { en: 'Eat sugar/mishri before traveling North', hi: 'उत्तर दिशा में यात्रा से पहले मिश्री खाएं', sa: 'उत्तरं यात्रात् पूर्वं मिश्रिकां भक्षयेत्' },
    nature: 'inauspicious',
    note: { en: 'Mars is aggressive — its northern shool brings conflict and obstacles', hi: 'मंगल आक्रामक है — इसका उत्तरी शूल संघर्ष और बाधाएं लाता है', sa: '' },
  },
  {
    day: { en: 'Wednesday', hi: 'बुधवार', sa: 'बुधवासरः' },
    planet: { en: 'Mercury (Budha)', hi: 'बुध', sa: 'बुधः' },
    direction: { en: 'North', hi: 'उत्तर', sa: 'उत्तरम्' },
    directionHi: 'उ',
    color: 'text-emerald-300',
    border: 'border-emerald-500/30',
    bg: 'bg-emerald-500/5',
    remedy: { en: 'Eat green vegetables/herbs before traveling North', hi: 'उत्तर दिशा में यात्रा से पहले हरी सब्जियाँ खाएं', sa: 'उत्तरं यात्रात् पूर्वं शाकं भक्षयेत्' },
    nature: 'inauspicious',
    note: { en: 'North (Kubera\'s domain) is blocked by Mercury on Wednesday — financial ventures are especially affected', hi: 'बुधवार को बुध द्वारा उत्तर (कुबेर का क्षेत्र) अवरुद्ध है', sa: '' },
  },
  {
    day: { en: 'Thursday', hi: 'गुरुवार', sa: 'गुरुवासरः' },
    planet: { en: 'Jupiter (Guru)', hi: 'गुरु', sa: 'गुरुः' },
    direction: { en: 'South', hi: 'दक्षिण', sa: 'दक्षिणम्' },
    directionHi: 'द',
    color: 'text-yellow-300',
    border: 'border-yellow-500/30',
    bg: 'bg-yellow-500/5',
    remedy: { en: 'Eat Bengal gram (chana dal) before traveling South', hi: 'दक्षिण दिशा में यात्रा से पहले चना दाल खाएं', sa: 'दक्षिणं यात्रात् पूर्वं चणकं भक्षयेत्' },
    nature: 'inauspicious',
    note: { en: 'South is Yama\'s realm — Jupiter\'s shool there compounds the inauspice of travel toward death\'s domain', hi: 'दक्षिण यम का क्षेत्र है — वहाँ गुरु का शूल मृत्यु के क्षेत्र की ओर यात्रा की अशुभता को बढ़ाता है', sa: '' },
  },
  {
    day: { en: 'Friday', hi: 'शुक्रवार', sa: 'शुक्रवासरः' },
    planet: { en: 'Venus (Shukra)', hi: 'शुक्र', sa: 'शुक्रः' },
    direction: { en: 'West', hi: 'पश्चिम', sa: 'पश्चिमम्' },
    directionHi: 'प',
    color: 'text-pink-300',
    border: 'border-pink-500/30',
    bg: 'bg-pink-500/5',
    remedy: { en: 'Eat white sesame seeds (til) before traveling West', hi: 'पश्चिम दिशा में यात्रा से पहले सफेद तिल खाएं', sa: 'पश्चिमं यात्रात् पूर्वं तिलान् भक्षयेत्' },
    nature: 'inauspicious',
    note: { en: 'Venus\'s western shool is milder than others — often waived for short journeys', hi: 'शुक्र का पश्चिमी शूल अन्य की तुलना में हल्का है', sa: '' },
  },
  {
    day: { en: 'Saturday', hi: 'शनिवार', sa: 'शनिवासरः' },
    planet: { en: 'Saturn (Shani)', hi: 'शनि', sa: 'शनिः' },
    direction: { en: 'East', hi: 'पूर्व', sa: 'पूर्वम्' },
    directionHi: 'पू',
    color: 'text-slate-300',
    border: 'border-slate-500/30',
    bg: 'bg-slate-500/5',
    remedy: { en: 'Eat sesame oil-cooked food or urad dal before traveling East', hi: 'पूर्व दिशा में यात्रा से पहले तिल के तेल में पका खाना या उड़द दाल खाएं', sa: 'पूर्वं यात्रात् पूर्वं तैलपक्वान्नं उड्डदलं वा भक्षयेत्' },
    nature: 'inauspicious',
    note: { en: 'Saturn\'s eastward shool is considered the most severe — new ventures eastward on Saturday face heavy delays', hi: 'शनि का पूर्वी शूल सबसे गंभीर माना जाता है', sa: '' },
  },
];

const SHIVA_VAAS = [
  {
    tithis: [1, 6, 11],
    name: { en: 'Kailash (Kailash Parvat)', hi: 'कैलाश (कैलाश पर्वत)', sa: 'कैलाशः' },
    nature: 'auspicious',
    color: 'text-emerald-300',
    border: 'border-emerald-500/30',
    bg: 'bg-emerald-500/8',
    icon: '🏔',
    desc: {
      en: 'Shiva resides in his divine abode atop Kailash with Parvati. He is serene, benevolent, and easily pleased. Best time for Shiva puja, abhishek, and auspicious activities.',
      hi: 'शिव अपने दिव्य निवास कैलाश शिखर पर पार्वती के साथ रहते हैं। वे शांत, दयालु और सहज प्रसन्न होने वाले हैं। शिव पूजा, अभिषेक और शुभ कार्यों का सर्वोत्तम समय।',
      sa: 'शिवः पार्वत्या सह कैलाशे दिव्यावासे निवसति। शिवपूजायाः अभिषेकस्य च सर्वोत्तमः कालः।',
    },
    activities: {
      en: 'Shiva puja, abhishek, marriage, business launch, pilgrimages',
      hi: 'शिव पूजा, अभिषेक, विवाह, व्यापार आरंभ, तीर्थयात्रा',
      sa: 'शिवपूजा, अभिषेकः, विवाहः, वाणिज्यारम्भः',
    },
  },
  {
    tithis: [2, 7, 12],
    name: { en: 'Shamshan (Cremation Ground)', hi: 'श्मशान (श्मशान भूमि)', sa: 'श्मशानम्' },
    nature: 'inauspicious',
    color: 'text-red-400',
    border: 'border-red-500/30',
    bg: 'bg-red-500/5',
    icon: '💀',
    desc: {
      en: 'Shiva dwells in the cremation ground in his Rudra/Bhairava form, smeared with ash, surrounded by spirits. He is fierce and difficult to appease. Auspicious activities should be avoided; Tantric rites may be performed by adepts.',
      hi: 'शिव श्मशान भूमि में राख लिपे, आत्माओं से घिरे अपने रुद्र/भैरव रूप में निवास करते हैं। वे उग्र और प्रसन्न करने में कठिन हैं। शुभ कार्यों से बचना चाहिए।',
      sa: 'शिवः श्मशाने भस्मलिप्तः प्रेतैः परिवृतः रुद्ररूपेण निवसति।',
    },
    activities: {
      en: 'Avoid auspicious events; suitable for Shiva\'s Rudra form worship, ancestral rites',
      hi: 'शुभ कार्य वर्जित; शिव के रुद्र रूप की पूजा, पित्र कार्य',
      sa: 'शुभकार्यं वर्जयेत्; रुद्रपूजा, पित्रकार्यम्',
    },
  },
  {
    tithis: [3, 8, 13],
    name: { en: "Gauri's Abode (Parvati's Home)", hi: 'गौरी निवास (पार्वती का घर)', sa: 'गौर्याः निवासः' },
    nature: 'auspicious',
    color: 'text-pink-300',
    border: 'border-pink-500/30',
    bg: 'bg-pink-500/5',
    icon: '🌸',
    desc: {
      en: "Shiva visits Parvati/Gauri's home — a state of domestic bliss and harmonious union. Good for activities related to marriage, family, home, and matters of Venus.",
      hi: 'शिव पार्वती/गौरी के घर में मिलने जाते हैं — गृहस्थ आनंद और सामंजस्यपूर्ण मिलन की अवस्था। विवाह, परिवार, घर और शुक्र संबंधी विषयों के लिए अच्छा।',
      sa: 'शिवः गौर्याः गृहे मिलति — गार्हस्थ्यानन्दस्य सामंजस्यस्य च स्थितिः।',
    },
    activities: {
      en: 'Marriage, family rituals, home purchase/construction, Gauri puja',
      hi: 'विवाह, पारिवारिक अनुष्ठान, घर खरीद/निर्माण, गौरी पूजा',
      sa: 'विवाहः, पारिवारिकानुष्ठानम्, गृहक्रय-निर्माणम्',
    },
  },
  {
    tithis: [4, 9, 14],
    name: { en: 'Playing (Krida)', hi: 'क्रीड़ा (खेल)', sa: 'क्रीडा' },
    nature: 'neutral',
    color: 'text-amber-300',
    border: 'border-amber-500/30',
    bg: 'bg-amber-500/5',
    icon: '🎭',
    desc: {
      en: "Shiva is at play (Leela) — dancing the Tandava, absorbed in cosmic sport. His attention is divided; he may or may not respond to prayers readily. Mixed results for activities.",
      hi: 'शिव खेल (लीला) में हैं — तांडव नृत्य करते, ब्रह्मांडीय खेल में लीन। उनका ध्यान बँटा हुआ है; वे प्रार्थनाओं का उत्तर दे भी सकते हैं और नहीं भी। गतिविधियों के लिए मिश्रित परिणाम।',
      sa: 'शिवः क्रीडायां तान्डवे च लीनः — ब्रह्माण्डीयक्रीडायाम् अभिरतः।',
    },
    activities: {
      en: 'Moderate activities; avoid critical ventures. Arts, music, dance are well-supported.',
      hi: 'मध्यम गतिविधियाँ; महत्वपूर्ण उपक्रमों से बचें। कला, संगीत, नृत्य अच्छे हैं।',
      sa: 'मध्यमकार्याणि; महत्त्वपूर्णान् उपक्रमान् वर्जयेत्।',
    },
  },
  {
    tithis: [5, 10, 15, 30],
    name: { en: 'Samadhi (Deep Meditation)', hi: 'समाधि (गहरा ध्यान)', sa: 'समाधिः' },
    nature: 'mixed',
    color: 'text-violet-300',
    border: 'border-violet-500/30',
    bg: 'bg-violet-500/5',
    icon: '🧘',
    desc: {
      en: 'Shiva is in deep Samadhi — Unmoved, beyond the phenomenal world. He is neither easily approached nor displeased. This state is considered sacred for meditation and spiritual practice, but mundane activities may not receive divine support.',
      hi: 'शिव गहरी समाधि में हैं — अचल, भौतिक संसार से परे। उनसे न सहज निकट जाया जा सकता है, न वे आसानी से नाराज होते हैं। यह अवस्था ध्यान और आध्यात्मिक साधना के लिए पवित्र मानी जाती है।',
      sa: 'शिवः गहनसमाधौ अस्ति — अचलः, सांसारिकजगतः परे। ध्यानाय आध्यात्मिकसाधनायै च पवित्रः।',
    },
    activities: {
      en: 'Meditation, japa, spiritual practice, fasting. Avoid worldly ventures.',
      hi: 'ध्यान, जप, आध्यात्मिक साधना, उपवास। सांसारिक उपक्रमों से बचें।',
      sa: 'ध्यानम्, जपः, आध्यात्मिकसाधना। सांसारिकोपक्रमान् वर्जयेत्।',
    },
  },
];

const AGNI_VAAS = [
  {
    days: [0, 4], // Sun, Thu
    dayNames: { en: 'Sunday, Thursday', hi: 'रविवार, गुरुवार', sa: 'रविवासरः, गुरुवासरः' },
    plane: { en: 'Akash (Sky)', hi: 'आकाश', sa: 'आकाशः' },
    symbol: '☁',
    color: 'text-sky-300',
    border: 'border-sky-500/30',
    bg: 'bg-sky-500/5',
    nature: 'auspicious',
    desc: {
      en: 'Agni resides in the celestial sky. Fire rituals performed now are carried directly to the devatas. Homa and Yajna are highly effective. The smoke and offerings rise unimpeded to the heavens.',
      hi: 'अग्नि दिव्य आकाश में निवास करती है। अभी किए गए अग्नि अनुष्ठान सीधे देवताओं तक पहुँचते हैं। होम और यज्ञ अत्यंत प्रभावी हैं।',
      sa: 'अग्निः दिव्याकाशे निवसति। अग्निकार्याणि सुफलानि।',
    },
  },
  {
    days: [1, 5], // Mon, Fri
    dayNames: { en: 'Monday, Friday', hi: 'सोमवार, शुक्रवार', sa: 'सोमवासरः, शुक्रवासरः' },
    plane: { en: 'Prithvi (Earth)', hi: 'पृथ्वी', sa: 'पृथ्वी' },
    symbol: '🌍',
    color: 'text-emerald-300',
    border: 'border-emerald-500/30',
    bg: 'bg-emerald-500/5',
    nature: 'auspicious',
    desc: {
      en: 'Agni is grounded in the earth plane. Fire rituals nourish the land and its people. Agriculture blessings, prosperity rituals, and Griha Pravesh fire ceremonies are especially powerful.',
      hi: 'अग्नि पृथ्वी तल में स्थित है। अग्नि अनुष्ठान भूमि और उसके लोगों को पोषित करते हैं। कृषि आशीर्वाद, समृद्धि अनुष्ठान और गृह प्रवेश अग्नि समारोह विशेष रूप से शक्तिशाली हैं।',
      sa: 'अग्निः पृथ्वीतले अस्ति। कृषिवरदाने समृद्धिकार्ये गृहप्रवेशे च विशेषफलप्रदा।',
    },
  },
  {
    days: [2, 6], // Tue, Sat
    dayNames: { en: 'Tuesday, Saturday', hi: 'मंगलवार, शनिवार', sa: 'मङ्गलवासरः, शनिवासरः' },
    plane: { en: 'Patala (Netherworld)', hi: 'पाताल (पातालवास)', sa: 'पातालम्' },
    symbol: '🔻',
    color: 'text-red-400',
    border: 'border-red-500/30',
    bg: 'bg-red-500/5',
    nature: 'inauspicious',
    desc: {
      en: 'Agni descends to the netherworld. Fire rituals performed now may have reversed or weakened effects — the offerings do not easily reach the devatas. Major Yajnas should be postponed. Simple Deepa (lamp) worship is permitted.',
      hi: 'अग्नि पाताल में उतर जाती है। अभी किए गए अग्नि अनुष्ठानों के उलटे या कमजोर प्रभाव हो सकते हैं। बड़े यज्ञ स्थगित करने चाहिए।',
      sa: 'अग्निः पातालं गच्छति। अग्निकार्यं विपरीतफलदम्। यज्ञं स्थगयेत्।',
    },
  },
  {
    days: [3], // Wed
    dayNames: { en: 'Wednesday', hi: 'बुधवार', sa: 'बुधवासरः' },
    plane: { en: 'Jal (Water)', hi: 'जल', sa: 'जलम्' },
    symbol: '💧',
    color: 'text-blue-300',
    border: 'border-blue-500/30',
    bg: 'bg-blue-500/5',
    nature: 'mixed',
    desc: {
      en: 'Agni is submerged in water — a paradoxical state where fire and water coexist (Vadavagni — the submarine fire in Hindu cosmology). Rituals involving both fire and water (abhishek following homa) are uniquely powerful on Wednesdays.',
      hi: 'अग्नि जल में समाई है — एक विरोधाभासी अवस्था जहाँ अग्नि और जल सह-अस्तित्व में हैं (वडवाग्नि — हिंदू ब्रह्माण्ड विज्ञान में समुद्री अग्नि)।',
      sa: 'अग्निः जले निमग्ना — वडवाग्निरूपेण। होमाभिषेकसंयुक्तानि कार्याणि विशेषशक्तिमन्ति।',
    },
  },
];

const CHANDRA_VAAS = [
  {
    pada: 1,
    name: { en: 'Deva (Celestial)', hi: 'देव (दैवीय)', sa: 'देवः' },
    color: 'text-gold-light',
    border: 'border-gold-primary/30',
    bg: 'bg-gold-primary/5',
    nature: 'auspicious',
    symbol: '✦',
    desc: {
      en: 'Moon is in the celestial abode. Divine energy flows freely. Prayers are answered with ease. This is the most auspicious pada for all sacred activities.',
      hi: 'चंद्रमा दिव्य निवास में है। दिव्य ऊर्जा स्वतंत्र रूप से प्रवाहित होती है। प्रार्थनाएं आसानी से सुनी जाती हैं।',
      sa: 'चन्द्रः दिव्यनिवासे। दिव्यशक्तिः स्वतन्त्रा प्रवहति। सर्वसाधनाय शुभः।',
    },
    activities: { en: 'All auspicious work, puja, sacred ceremonies, spiritual practice', hi: 'सभी शुभ कार्य, पूजा, पवित्र समारोह, आध्यात्मिक साधना', sa: 'सर्वशुभकार्यम्' },
  },
  {
    pada: 2,
    name: { en: 'Nara (Human)', hi: 'नर (मानव)', sa: 'नरः' },
    color: 'text-blue-300',
    border: 'border-blue-500/30',
    bg: 'bg-blue-500/5',
    nature: 'neutral',
    symbol: '◈',
    desc: {
      en: 'Moon is in the human abode — the plane of ordinary human activity. Results are as you would expect — neither divinely elevated nor particularly hindered. Good for worldly tasks.',
      hi: 'चंद्रमा मानव निवास में है — साधारण मानवीय गतिविधि का तल। परिणाम सामान्य हैं — न दिव्य रूप से उन्नत, न विशेष रूप से बाधित।',
      sa: 'चन्द्रः नरावासे — सामान्यमानवीयकार्यस्य तले। फलानि सामान्यानि।',
    },
    activities: { en: 'Daily work, business, social activities, learning', hi: 'दैनिक कार्य, व्यापार, सामाजिक गतिविधियाँ, शिक्षा', sa: 'दैनिककार्यम्, वाणिज्यः' },
  },
  {
    pada: 3,
    name: { en: 'Pashava (Animal)', hi: 'पशव (पशु)', sa: 'पशवः' },
    color: 'text-amber-400',
    border: 'border-amber-500/30',
    bg: 'bg-amber-500/5',
    nature: 'mixed',
    symbol: '◉',
    desc: {
      en: 'Moon is in the animal abode — instinctual, reactive, less refined energy. Actions taken now may be driven by impulse. Avoid important decisions; good for physical work and agriculture.',
      hi: 'चंद्रमा पशु निवास में है — सहज, प्रतिक्रियाशील, कम परिष्कृत ऊर्जा। महत्वपूर्ण निर्णयों से बचें; शारीरिक कार्य और कृषि के लिए अच्छा।',
      sa: 'चन्द्रः पशावासे — आवेगात्मकं कार्यं वर्जयेत्।',
    },
    activities: { en: 'Physical labor, farming, avoid important decisions or sacred rites', hi: 'शारीरिक श्रम, खेती, महत्वपूर्ण निर्णयों या पवित्र अनुष्ठानों से बचें', sa: 'शारीरिककार्यम्, कृषिः' },
  },
  {
    pada: 4,
    name: { en: 'Rakshasa (Demonic)', hi: 'राक्षस (असुर)', sa: 'राक्षसः' },
    color: 'text-red-400',
    border: 'border-red-500/30',
    bg: 'bg-red-500/5',
    nature: 'inauspicious',
    symbol: '▼',
    desc: {
      en: 'Moon is in the demonic abode — turbulent, obstructive energy. Activities initiated now face opposition, deception, or hidden enemies. Most auspicious works should be avoided. Protective mantras and Hanuman worship mitigate the effects.',
      hi: 'चंद्रमा राक्षस निवास में है — उथल-पुथल, अवरोधक ऊर्जा। अब शुरू की गई गतिविधियों को विरोध, धोखे या छिपे दुश्मनों का सामना करना पड़ता है।',
      sa: 'चन्द्रः राक्षसावासे — अशान्तः अवरोधकश्च। शुभकार्यं वर्जयेत्।',
    },
    activities: { en: 'Avoid all sacred and auspicious activities; protective rites may be performed', hi: 'सभी पवित्र और शुभ गतिविधियों से बचें; सुरक्षात्मक अनुष्ठान किए जा सकते हैं', sa: 'सर्वशुभकार्यं वर्जयेत्' },
  },
];

const RAHU_VAAS = [
  { day: { en: 'Sunday', hi: 'रविवार', sa: 'रविवासरः' }, direction: { en: 'Southwest', hi: 'नैऋत्य', sa: 'नैऋत्यम्' }, color: 'text-amber-300' },
  { day: { en: 'Monday', hi: 'सोमवार', sa: 'सोमवासरः' }, direction: { en: 'East', hi: 'पूर्व', sa: 'पूर्वम्' }, color: 'text-blue-300' },
  { day: { en: 'Tuesday', hi: 'मंगलवार', sa: 'मङ्गलवासरः' }, direction: { en: 'North', hi: 'उत्तर', sa: 'उत्तरम्' }, color: 'text-red-400' },
  { day: { en: 'Wednesday', hi: 'बुधवार', sa: 'बुधवासरः' }, direction: { en: 'Northwest', hi: 'वायव्य', sa: 'वायव्यम्' }, color: 'text-emerald-300' },
  { day: { en: 'Thursday', hi: 'गुरुवार', sa: 'गुरुवासरः' }, direction: { en: 'Southeast', hi: 'आग्नेय', sa: 'आग्नेयम्' }, color: 'text-yellow-300' },
  { day: { en: 'Friday', hi: 'शुक्रवार', sa: 'शुक्रवासरः' }, direction: { en: 'West', hi: 'पश्चिम', sa: 'पश्चिमम्' }, color: 'text-pink-300' },
  { day: { en: 'Saturday', hi: 'शनिवार', sa: 'शनिवासरः' }, direction: { en: 'East', hi: 'पूर्व', sa: 'पूर्वम्' }, color: 'text-slate-300' },
];

// ─── Small helpers ──────────────────────────────────────────────────────────
const NatureBadge = ({ nature, locale }: { nature: string; locale: string }) => {
  const map: Record<string, { label: Tri; cls: string }> = {
    auspicious: { label: L.auspicious, cls: 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/25' },
    inauspicious: { label: L.inauspicious, cls: 'bg-red-500/15 text-red-400 border border-red-500/25' },
    neutral: { label: L.neutral, cls: 'bg-blue-500/15 text-blue-300 border border-blue-500/25' },
    mixed: { label: L.mixed, cls: 'bg-amber-500/15 text-amber-300 border border-amber-500/25' },
  };
  const { label, cls } = map[nature] ?? map.neutral;
  return <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${cls}`}>{t(label, locale)}</span>;
};

const SectionHeader = ({ icon, title, subtitle, locale }: { icon: React.ReactNode; title: Tri; subtitle: Tri; locale: string }) => (
  <div className="text-center mb-10">
    <div className="flex justify-center mb-3">{icon}</div>
    <h2 className="text-3xl font-bold text-gold-gradient mb-2">{t(title, locale)}</h2>
    <p className="text-text-secondary text-sm max-w-2xl mx-auto leading-relaxed">{t(subtitle, locale)}</p>
  </div>
);

// ─── Main page ───────────────────────────────────────────────────────────────
export default function NivasShoolPage() {
  const locale = useLocale();

  const fadeUp = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } };

  return (
    <div className="min-h-screen bg-bg-primary text-text-primary">
      {/* Hero */}
      <section className="relative py-20 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0d1235] to-bg-primary" />
        <div className="absolute inset-0 opacity-20"
          style={{ backgroundImage: 'radial-gradient(circle at 30% 50%, #d4a85340 0%, transparent 60%), radial-gradient(circle at 70% 30%, #6366f130 0%, transparent 50%)' }} />
        <div className="relative max-w-4xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6 }}>
            <div className="flex justify-center mb-6">
              <div className="p-4 rounded-2xl bg-gold-primary/10 border border-gold-primary/20">
                <Compass className="w-12 h-12 text-gold-primary" />
              </div>
            </div>
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="text-4xl md:text-6xl font-bold text-gold-gradient mb-4" style={{ fontFamily: 'var(--font-heading)' }}>
            {t(L.title, locale)}
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
            className="text-text-secondary text-lg max-w-2xl mx-auto leading-relaxed">
            {t(L.subtitle, locale)}
          </motion.p>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="mt-8">
            <Link href="/panchang" className="text-sm text-gold-primary/70 hover:text-gold-primary transition-colors">
              {t(L.backToPanchang, locale)}
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Quick nav */}
      <section className="max-w-5xl mx-auto px-4 mb-12">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {[
            { href: '#disha-shool', label: { en: 'Disha Shool', hi: 'दिशा शूल', sa: 'दिशाशूलम्' }, icon: <AlertTriangle className="w-4 h-4" />, color: 'text-amber-300' },
            { href: '#shiva-vaas', label: { en: 'Shiva Vaas', hi: 'शिव वास', sa: 'शिवावासः' }, icon: <Star className="w-4 h-4" />, color: 'text-violet-300' },
            { href: '#agni-vaas', label: { en: 'Agni Vaas', hi: 'अग्नि वास', sa: 'अग्निवासः' }, icon: <Flame className="w-4 h-4" />, color: 'text-orange-400' },
            { href: '#chandra-vaas', label: { en: 'Chandra Vaas', hi: 'चंद्र वास', sa: 'चन्द्रावासः' }, icon: <Moon className="w-4 h-4" />, color: 'text-blue-300' },
            { href: '#rahu-vaas', label: { en: 'Rahu Vaas', hi: 'राहु वास', sa: 'राहोः वासः' }, icon: <Compass className="w-4 h-4" />, color: 'text-red-400' },
          ].map((item) => (
            <a key={item.href} href={item.href}
              className="flex items-center gap-2 px-4 py-3 rounded-xl bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/10 hover:border-gold-primary/30 hover:bg-gold-primary/5 transition-all text-sm font-medium">
              <span className={item.color}>{item.icon}</span>
              <span className={item.color}>{t(item.label as Tri, locale)}</span>
            </a>
          ))}
        </div>
      </section>

      {/* ── DISHA SHOOL ─────────────────────────────────────────────────────── */}
      <section id="disha-shool" className="max-w-5xl mx-auto px-4 mb-20">
        <SectionHeader
          icon={<div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20"><AlertTriangle className="w-8 h-8 text-amber-300" /></div>}
          title={L.dishashool}
          subtitle={L.dishashoolDesc}
          locale={locale}
        />

        {/* Remedy box */}
        <div className="mb-8 p-5 rounded-2xl bg-emerald-500/5 border border-emerald-500/20">
          <div className="flex items-start gap-3">
            <div className="p-1.5 rounded-lg bg-emerald-500/15 mt-0.5"><Star className="w-4 h-4 text-emerald-300" /></div>
            <div>
              <div className="text-emerald-300 font-semibold text-sm mb-1">{t(L.remedyTitle, locale)}</div>
              <div className="text-text-secondary text-sm leading-relaxed">{t(L.remedyDesc, locale)}</div>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          {DISHA_SHOOL.map((row, i) => (
            <motion.div key={i} variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className={`p-5 rounded-2xl border ${row.border} ${row.bg} relative overflow-hidden`}>
              <div className="absolute top-3 right-4 text-6xl font-black opacity-5 leading-none">{row.directionHi}</div>
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className={`text-lg font-bold ${row.color}`}>{t(row.day, locale)}</div>
                  <div className="text-text-tertiary text-xs">{t(row.planet, locale)}</div>
                </div>
                <div className="text-right">
                  <div className={`text-2xl font-black ${row.color}`}>{t(row.direction, locale)}</div>
                  <NatureBadge nature={row.nature} locale={locale} />
                </div>
              </div>
              <div className="text-text-secondary text-xs mb-3 leading-relaxed">{t(row.note, locale)}</div>
              <div className={`p-3 rounded-xl border ${row.border} bg-black/20`}>
                <div className="text-xs text-text-tertiary mb-0.5">{t(L.remedy, locale)}</div>
                <div className={`text-sm font-medium ${row.color}`}>{t(row.remedy, locale)}</div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Textual basis */}
        <div className="mt-8 p-6 rounded-2xl bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12">
          <div className="text-gold-primary font-semibold mb-2 text-sm">{t(L.textualBasis, locale)}</div>
          <p className="text-text-secondary text-sm leading-relaxed">
            {locale === 'hi'
              ? 'दिशा शूल का उल्लेख मुहूर्त चिंतामणि, मुहूर्त मार्तण्ड और ज्योतिर्निबंध जैसे प्राचीन ग्रंथों में मिलता है। इसका आधार यह सिद्धांत है कि प्रत्येक वार का ग्रह स्वामी एक विशिष्ट दिशा में अपनी दृष्टि (दृष्टि शक्ति) डालता है, जिससे वह दिशा उस दिन के लिए तीक्ष्ण (कंटकयुक्त) हो जाती है।'
              : 'Disha Shool is documented in classical Muhurta texts including Muhurta Chintamani, Muhurta Martanda, and Jyotir Nibandha. The underlying principle holds that each weekday\'s ruling planet casts its drishti (directional gaze) toward a specific cardinal point, rendering that direction sharp (thorn-like) for new journeys initiated on that day. The remedy (eating specific food) invokes the elemental and planetary energies to neutralize the obstruction.'}
          </p>
        </div>
      </section>

      {/* ── SHIVA VAAS ──────────────────────────────────────────────────────── */}
      <section id="shiva-vaas" className="max-w-5xl mx-auto px-4 mb-20">
        <SectionHeader
          icon={<div className="p-3 rounded-xl bg-violet-500/10 border border-violet-500/20"><Star className="w-8 h-8 text-violet-300" /></div>}
          title={L.shivaVaas}
          subtitle={L.shivaVaasDesc}
          locale={locale}
        />

        <div className="space-y-4">
          {SHIVA_VAAS.map((row, i) => (
            <motion.div key={i} variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }}
              transition={{ delay: i * 0.07 }}
              className={`p-6 rounded-2xl border ${row.border} ${row.bg}`}>
              <div className="flex flex-col md:flex-row md:items-start gap-4">
                <div className="flex items-center gap-3 md:w-56 shrink-0">
                  <div className="text-3xl">{row.icon}</div>
                  <div>
                    <div className={`font-bold ${row.color}`}>{t(row.name, locale)}</div>
                    <div className="text-text-tertiary text-xs mt-0.5">
                      {t(L.tithi, locale)}: {row.tithis.join(', ')}
                    </div>
                    <div className="mt-1"><NatureBadge nature={row.nature} locale={locale} /></div>
                  </div>
                </div>
                <div className="flex-1">
                  <p className="text-text-secondary text-sm leading-relaxed mb-3">{t(row.desc, locale)}</p>
                  <div className={`p-3 rounded-xl border ${row.border} bg-black/20`}>
                    <div className="text-xs text-text-tertiary mb-0.5">{t(L.activities, locale)}</div>
                    <div className={`text-sm ${row.color}`}>{t(row.activities, locale)}</div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-8 p-6 rounded-2xl bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12">
          <div className="text-gold-primary font-semibold mb-2 text-sm">{t(L.practicalNote, locale)}</div>
          <p className="text-text-secondary text-sm leading-relaxed">
            {locale === 'hi'
              ? 'शिव वास का उपयोग मुख्यतः शिव पूजा, अभिषेक, शिवलिंग प्रतिष्ठा और तंत्र अनुष्ठानों की योजना बनाने में होता है। श्मशान और क्रीड़ा वासों में भी भगवान शिव की पूजा की जा सकती है, लेकिन अन्य शुभ कार्यों से बचना चाहिए। समाधि वास आध्यात्मिक साधकों के लिए सर्वोत्तम है।'
              : 'Shiva Vaas is primarily used when planning Shiva puja, abhishek, Shivalinga pratishtha, and Tantric rites. Even in Shamshan and Krida Vaas, Shiva worship itself can be performed — the restriction is on other auspicious worldly activities. Samadhi Vaas is particularly favored by spiritual seekers for deep meditation and japa. The tithi-based system repeats across both Shukla Paksha (waxing) and Krishna Paksha (waning), with Purnima/Amavasya both counted as Tithi 15/30.'}
          </p>
        </div>
      </section>

      {/* ── AGNI VAAS ───────────────────────────────────────────────────────── */}
      <section id="agni-vaas" className="max-w-5xl mx-auto px-4 mb-20">
        <SectionHeader
          icon={<div className="p-3 rounded-xl bg-orange-500/10 border border-orange-500/20"><Flame className="w-8 h-8 text-orange-400" /></div>}
          title={L.agniVaas}
          subtitle={L.agniVaasDesc}
          locale={locale}
        />

        <div className="grid md:grid-cols-2 gap-5">
          {AGNI_VAAS.map((row, i) => (
            <motion.div key={i} variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className={`p-6 rounded-2xl border ${row.border} ${row.bg}`}>
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className={`text-2xl mb-2`}>{row.symbol}</div>
                  <div className={`text-lg font-bold ${row.color}`}>{t(row.plane, locale)}</div>
                  <div className="text-text-tertiary text-xs">{t(row.dayNames, locale)}</div>
                </div>
                <NatureBadge nature={row.nature} locale={locale} />
              </div>
              <p className="text-text-secondary text-sm leading-relaxed">{t(row.desc, locale)}</p>
            </motion.div>
          ))}
        </div>

        <div className="mt-8 p-6 rounded-2xl bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12">
          <div className="text-gold-primary font-semibold mb-2 text-sm">{t(L.textualBasis, locale)}</div>
          <p className="text-text-secondary text-sm leading-relaxed">
            {locale === 'hi'
              ? 'अग्नि वास का वर्णन ग्रह्य सूत्रों और अग्नि पुराण में मिलता है। यह विशेष रूप से पंच महायज्ञों — ब्रह्म यज्ञ, देव यज्ञ, पितृ यज्ञ, भूत यज्ञ और नर यज्ञ — की योजना में महत्वपूर्ण है। अग्नि के आकाश वास में सोम-यागों का विशेष महत्व है।'
              : 'Agni Vaas appears in Grhya Sutras and the Agni Purana in the context of planning fire ceremonies. It is especially critical for the Pancha Mahayajnas — the five great sacrifices. When Agni is in Akash, Soma-yagas (moon-related fire rituals) are especially potent. The Patala placement is associated with the underground fire Vadavagni, which in mythology periodically threatens to consume the oceans.'}
          </p>
        </div>
      </section>

      {/* ── CHANDRA VAAS ────────────────────────────────────────────────────── */}
      <section id="chandra-vaas" className="max-w-5xl mx-auto px-4 mb-20">
        <SectionHeader
          icon={<div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/20"><Moon className="w-8 h-8 text-blue-300" /></div>}
          title={L.chandraVaas}
          subtitle={L.chandraVaasDesc}
          locale={locale}
        />

        {/* Pada explanation */}
        <div className="mb-8 p-5 rounded-2xl bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12">
          <p className="text-text-secondary text-sm leading-relaxed">
            {locale === 'hi'
              ? 'प्रत्येक नक्षत्र 13°20′ चाप का होता है, जिसे 4 पादों में बाँटा गया है (प्रत्येक 3°20′)। नवांश कुंडली में प्रत्येक पाद एक अलग राशि को दर्शाता है। चंद्र वास के संदर्भ में, पाद 1 = देव, पाद 2 = नर, पाद 3 = पशव, पाद 4 = राक्षस। चंद्रमा प्रत्येक पाद में लगभग 3-4 घंटे रहता है।'
              : 'Each Nakshatra spans 13°20′ of arc, divided into 4 padas (each 3°20′). In the Navamsha chart, each pada maps to a different sign. For Chandra Vaas purposes: Pada 1 = Deva, Pada 2 = Nara, Pada 3 = Pashava, Pada 4 = Rakshasa. The Moon spends approximately 3–4 hours in each pada. To know the current Chandra Vaas, check the live Panchang which calculates the Moon\'s precise longitude and its pada.'}
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-5">
          {CHANDRA_VAAS.map((row, i) => (
            <motion.div key={i} variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className={`p-6 rounded-2xl border ${row.border} ${row.bg}`}>
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className={`text-2xl font-black ${row.color}`}>{row.symbol}</div>
                  <div>
                    <div className={`font-bold ${row.color}`}>{t(row.name, locale)}</div>
                    <div className="text-text-tertiary text-xs">{t(L.pada, locale)} {row.pada}</div>
                  </div>
                </div>
                <NatureBadge nature={row.nature} locale={locale} />
              </div>
              <p className="text-text-secondary text-sm leading-relaxed mb-3">{t(row.desc, locale)}</p>
              <div className={`p-3 rounded-xl border ${row.border} bg-black/20`}>
                <div className="text-xs text-text-tertiary mb-0.5">{t(L.activities, locale)}</div>
                <div className={`text-sm ${row.color}`}>{t(row.activities, locale)}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── RAHU VAAS ───────────────────────────────────────────────────────── */}
      <section id="rahu-vaas" className="max-w-5xl mx-auto px-4 mb-20">
        <SectionHeader
          icon={<div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20"><Compass className="w-8 h-8 text-red-400" /></div>}
          title={L.rahuVaas}
          subtitle={L.rahuVaasDesc}
          locale={locale}
        />

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {RAHU_VAAS.map((row, i) => (
            <motion.div key={i} variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }}
              transition={{ delay: i * 0.06 }}
              className="p-4 rounded-2xl border border-red-500/20 bg-red-500/5 text-center">
              <div className={`text-base font-bold ${row.color} mb-1`}>{t(row.day, locale)}</div>
              <div className="text-text-secondary text-lg font-black">{t(row.direction, locale)}</div>
            </motion.div>
          ))}
        </div>

        <div className="p-6 rounded-2xl bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12">
          <div className="text-gold-primary font-semibold mb-2 text-sm">{t(L.practicalNote, locale)}</div>
          <p className="text-text-secondary text-sm leading-relaxed">
            {locale === 'hi'
              ? 'राहु वास मुख्य रूप से दक्षिण भारतीय (तमिल और केरल) ज्योतिष परंपराओं में उपयोग किया जाता है। यह दिशा शूल का पूरक है — जहाँ दिशा शूल ग्रह के प्रत्यक्ष प्रभाव को मापता है, वहीं राहु वास छाया ग्रह राहु की प्रक्षेपण दिशा को दर्शाता है। राहु वास दिशा में भूमि खरीद, नींव खुदाई और दीर्घकालिक निर्माण कार्य से बचने की सलाह दी जाती है।'
              : 'Rahu Vaas is particularly emphasized in South Indian (Tamil and Kerala) astrological traditions. It complements Disha Shool — while Disha Shool measures the direct planetary gaze, Rahu Vaas indicates the projection direction of the shadow planet Rahu. Avoid land purchase, foundation laying, and long-term construction in Rahu\'s direction. When Rahu Vaas coincides with Disha Shool in the same direction, that direction is doubly inauspicious for the entire day.'}
          </p>
        </div>
      </section>

      {/* Summary comparison table */}
      <section className="max-w-5xl mx-auto px-4 mb-20">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gold-gradient mb-2">
            {locale === 'hi' ? 'तुलनात्मक सारांश' : locale === 'sa' ? 'तुलनात्मक सारांशः' : 'Comparative Summary'}
          </h2>
          <p className="text-text-secondary text-sm">
            {locale === 'hi' ? 'पाँचों निवास/शूल संकेतकों का एक नजर में अवलोकन' : 'All five Nivas & Shool indicators at a glance'}
          </p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b border-gold-primary/20">
                <th className="text-left py-3 px-4 text-gold-primary font-semibold">Indicator</th>
                <th className="text-left py-3 px-4 text-gold-primary font-semibold">Determined By</th>
                <th className="text-left py-3 px-4 text-gold-primary font-semibold">Cycle</th>
                <th className="text-left py-3 px-4 text-gold-primary font-semibold">Primary Use</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gold-primary/5">
              {[
                { name: 'Disha Shool', det: 'Weekday (Vara)', cycle: '7-day', use: 'Travel direction avoidance' },
                { name: 'Shiva Vaas', det: 'Tithi (Lunar day)', cycle: '15 tithis × 2', use: 'Shiva puja & auspicious timing' },
                { name: 'Agni Vaas', det: 'Weekday (Vara)', cycle: '7-day', use: 'Fire ritual (Homa/Yajna) scheduling' },
                { name: 'Chandra Vaas', det: 'Nakshatra pada', cycle: '~3-4 hrs', use: 'Moment-to-moment activity quality' },
                { name: 'Rahu Vaas', det: 'Weekday (Vara)', cycle: '7-day', use: 'Construction & land inauspice' },
              ].map((row, i) => (
                <tr key={i} className="hover:bg-gold-primary/3 transition-colors">
                  <td className="py-3 px-4 text-gold-light font-medium">{row.name}</td>
                  <td className="py-3 px-4 text-text-secondary">{row.det}</td>
                  <td className="py-3 px-4 text-text-secondary">{row.cycle}</td>
                  <td className="py-3 px-4 text-text-secondary">{row.use}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-3xl mx-auto px-4 pb-20 text-center">
        <div className="p-8 rounded-3xl bg-gradient-to-br from-gold-primary/10 to-violet-500/5 border border-gold-primary/20">
          <h3 className="text-xl font-bold text-gold-gradient mb-3">
            {locale === 'hi' ? 'आज का निवास देखें' : 'View Today\'s Live Nivas'}
          </h3>
          <p className="text-text-secondary text-sm mb-6">
            {locale === 'hi'
              ? 'हमारा दैनिक पञ्चाङ्ग आपकी लोकेशन के आधार पर शिव वास, अग्नि वास, चंद्र वास और दिशा शूल सब रियल-टाइम में दिखाता है।'
              : 'Our daily Panchang calculates Shiva Vaas, Agni Vaas, Chandra Vaas, and Disha Shool in real-time based on your location.'}
          </p>
          <Link href="/panchang"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gold-primary text-bg-primary font-semibold hover:bg-gold-light transition-colors">
            {locale === 'hi' ? 'पञ्चाङ्ग खोलें' : 'Open Panchang'}
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}
