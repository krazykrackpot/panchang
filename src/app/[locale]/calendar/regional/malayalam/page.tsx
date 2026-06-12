'use client';

import { useLocale } from 'next-intl';
import type { Locale, LocaleText } from '@/types/panchang';
import { isDevanagariLocale } from '@/lib/utils/locale-fonts';
import { pickRegionalChrome as RC } from '@/lib/content/regional-chrome-labels';
import { tl } from '@/lib/utils/trilingual';

const LABELS = {
  title: {
    en: 'Malayalam Calendar (Kollavarsham)',
    hi: 'मलयालम कैलेंडर (कोल्लावर्षम्)',
    ta: 'மலையாள நாட்காட்டி (கொல்லவர்ஷம்)',
    te: 'మలయాళం కేలండర్ (కొల్లవర్షం)',
    bn: 'মালয়ালম ক্যালেন্ডার (কোল্লাভার্ষম)',
    kn: 'ಮಲಯಾಳಂ ಕ್ಯಾಲೆಂಡರ್ (ಕೊಲ್ಲವರ್ಷಂ)',
    gu: 'મલયાળમ કેલેન્ડર (કોલ્લાવર્ષમ)',
  },
  intro: {
    en: 'The Malayalam calendar, known as Kollavarsham (Kolla Era), is a solar sidereal calendar used exclusively in Kerala by approximately 40 million Malayalam speakers. Like the Tamil calendar, months are defined by the Sun\'s transit through the twelve Rashis — making Malayalam month dates nearly fixed relative to the Gregorian calendar. The Kolla Era is believed to have begun in 825 CE, making 2026 CE correspond to year 1201–1202 ME (Malayalam Era). The calendar governs the agricultural and festival cycle of Kerala, from the grand Onam harvest festival to the monsoon-season Karkidakam Ramayana reading tradition.',
    hi: 'मलयालम कैलेंडर, जिसे कोल्लावर्षम् (कोल्ल युग) के नाम से जाना जाता है, केवल केरल में लगभग 4 करोड़ मलयालम भाषियों द्वारा उपयोग किया जाने वाला सौर नाक्षत्रिक कैलेंडर है। तमिल कैलेंडर की तरह, मास सूर्य के बारह राशियों में गोचर से परिभाषित होते हैं। कोल्ल युग 825 ई. में शुरू हुआ माना जाता है। कैलेंडर केरल के कृषि और उत्सव चक्र को नियंत्रित करता है — महान ओणम फसल उत्सव से लेकर मानसून-कालीन कर्कटकम रामायण पठन परम्परा तक।',
  },
  monthsTitle: {
    en: 'The 12 Malayalam Months',
    hi: '12 मलयालम मास',
    ta: '12 மலையாள மாதங்கள்',
    te: '12 మలయాళం నెలలు',
    bn: '১২টি মালয়ালম মাস',
    kn: '12 ಮಲಯಾಳಂ ತಿಂಗಳುಗಳು',
    gu: '12 મળ્યયાળ મહિના',
  },
  monthsIntro: {
    en: 'Malayalam months begin when the Sun enters each new Rashi (zodiac sign). The order starts from Chingam (Simha/Leo) rather than Mesha, as the Kerala agricultural year traditionally begins with the post-monsoon harvest season. Month lengths vary from 29 to 32 days depending on the Sun\'s speed through each sign.',
    hi: 'मलयालम मास तब शुरू होते हैं जब सूर्य प्रत्येक नई राशि में प्रवेश करता है। क्रम चिंगम (सिंह) से शुरू होता है, न कि मेष से, क्योंकि केरल का कृषि वर्ष परम्परागत रूप से मानसून के बाद की फसल के मौसम से शुरू होता है।',
  },
  festivalsTitle: {
    en: 'Major Malayalam Festivals',
    hi: 'प्रमुख मलयालम त्योहार',
    ta: 'முக்கிய மலையாள திருவிழாக்கள்',
    te: 'ముఖ్యమైన మలయాళం పండుగలు',
    bn: 'প্রধান মালয়ালম উৎসব',
    kn: 'ಪ್ರಮುಖ ಮಲಯಾಳಂ ಹಬ್ಬಗಳು',
    gu: 'મુખ્ય મળ્યયાળ તહેવારો',
  },
  vishuTitle: {
    en: 'Vishu — Malayalam New Year',
    hi: 'विशु — मलयालम नव वर्ष',
  },
  vishuText: {
    en: 'Vishu falls on Medam 1 (the Sun\'s entry into Mesha/Aries), typically April 14–15 — the same astronomical event as Tamil Puthandu and Sinhala/Tamil New Year in Sri Lanka. The defining tradition is the "Vishukkani" — an auspicious arrangement viewed first thing upon waking. The Kani (auspicious sight) is prepared the night before: a large brass bell-metal uruli (vessel) is filled with Kani Konna flowers (golden shower blossoms of Cassia fistula), raw rice, betel leaves, lemon, cucumber, a jackfruit section, a coconut, golden-coloured cloth, coins, a lit lamp, a mirror, and a Vishnu idol. On waking, elders cover their eyes and are led to view the Kani first — the belief being that what you see first on Vishu determines your fortune for the year. "Vishukkaineettam" (gift-giving of money, especially coins and new notes from elders to children) follows, and the day includes fireworks, new clothes (Puthukodi), and a grand feast (Sadya).',
    hi: 'विशु मेदम 1 (सूर्य का मेष/aries में प्रवेश) पर पड़ता है, आमतौर पर 14-15 अप्रैल — तमिल पुथाण्डु के समान खगोलीय घटना। परिभाषित परम्परा "विशुक्कनि" है — जागने पर पहले देखा जाने वाला शुभ दृश्य। कनि (शुभ दृश्य) रात पहले तैयार की जाती है: एक बड़े पीतल के उरुली (बर्तन) को कनिकोन्ना फूलों, कच्चे चावल, बेलपत्र, नींबू, खीरा, कटहल, नारियल, सोने के रंग के कपड़े, सिक्कों, जलते दीपक, दर्पण और विष्णु प्रतिमा से भरा जाता है।',
  },
  onamTitle: {
    en: 'Onam — The Grand Harvest Festival',
    hi: 'ओणम् — महान फसल उत्सव',
  },
  onamText: {
    en: 'Onam is the most celebrated festival in Kerala, occurring in Chingam (August–September) during the Thiruvonam nakshatra. Lasting 10 days (Atham to Thiruvonam), it commemorates the mythical return of the benevolent Asura king Mahabali from the netherworld to visit his beloved subjects. The festival is celebrated with the Pookalam (flower carpet arranged in intricate concentric patterns using fresh flowers), the Onam Sadya (a vegetarian feast of 26 dishes served on banana leaves — including Avial, Sambar, Rasam, Parippu Curry, Olan, Erissery, Kaalan, Pachadi, Pickles, Payasam, and more), Vallam Kali (snake boat races on rivers and backwaters — the Nehru Trophy Boat Race is the most famous), Pulikali (tiger dance procession), and Thiruvathira Kali dance. Onam is a secular festival celebrated by Keralites of all religions.',
    hi: 'ओणम् केरल का सबसे बड़ा उत्सव है, जो चिंगम में थिरुवोणम नक्षत्र के दौरान होता है। 10 दिनों तक चलने वाला यह पर्व पौराणिक राजा महाबली की वापसी का स्मरण कराता है। पूक्कलम (फूलों की आलंकारिक कालीन), ओणम सद्या (केले के पत्ते पर परोसे जाने वाले 26 व्यंजनों का शाकाहारी भोज), और वल्लम काळि (साँप नौका दौड़) इस उत्सव की विशेषताएँ हैं।',
  },
  calendarTitle: {
    en: 'Kollavarsham — Calendar Characteristics',
    hi: 'कोल्लावर्षम् — कैलेंडर विशेषताएँ',
    ta: 'கொல்லவர்ஷம் — நாட்காட்டி சிறப்பியல்புகள்',
    te: 'కొల్లవర్షం — పంచాంగ లక్షణాలు',
    bn: 'কোল্লাভার্ষম — পঞ্জিকার বৈশিষ্ট্য',
    kn: 'ಕೊಲ್ಲವರ್ಷಂ — ಪಂಚಾಂಗ ಲಕ್ಷಣಗಳು',
    gu: 'કોલ્લાવર્ષમ — પંચાંગ લક્ષણો',
  },
  calendarText: {
    en: 'The Kollavarsham is purely solar — months track the Sun\'s zodiacal transit, not the Moon. This means no intercalary months are needed (unlike the lunisolar North Indian system), and dates remain consistent year to year. However, the Malayalam calendar does incorporate lunar elements (Tithi, Nakshatra) for determining religious festival timings, making it a hybrid in practice. The calendar year begins in Chingam (Leo) rather than Mesha (Aries), which distinguishes it from the Tamil, Telugu, and Kannada new years. Karkidakam (Cancer, mid-July to mid-August) is considered an inauspicious month — the peak monsoon period when illness is common, weddings are avoided, and the tradition of reading the Ramayana (Karkidaka Ramayana) at home and in temples is observed throughout the month.',
    hi: 'कोल्लावर्षम् पूर्णतः सौर है — मास सूर्य के राशि गोचर को ट्रैक करते हैं, चन्द्रमा को नहीं। इसका अर्थ है कि उत्तर भारतीय चान्द्र-सौर प्रणाली के विपरीत कोई अधिक मास की आवश्यकता नहीं है। कैलेंडर वर्ष चिंगम (सिंह) में शुरू होता है। कर्कटकम (कर्क, मध्य जुलाई से मध्य अगस्त) एक अशुभ माह माना जाता है — चरम मानसून काल जब रामायण पठन (कर्कटक रामायणम्) की परम्परा पूरे महीने घरों और मन्दिरों में मनाई जाती है।',
  },
};

const MALAYALAM_MONTHS = [
  { name: 'Chingam', malayalam: 'ചിങ്ങം', nameHi: 'चिंगम', rashi: 'Simha (Leo)', gregorian: 'Aug 17 – Sep 16' },
  { name: 'Kanni', malayalam: 'കന്നി', nameHi: 'कन्नि', rashi: 'Kanya (Virgo)', gregorian: 'Sep 17 – Oct 17' },
  { name: 'Thulam', malayalam: 'തുലാം', nameHi: 'तुलाम', rashi: 'Tula (Libra)', gregorian: 'Oct 18 – Nov 15' },
  { name: 'Vrischikam', malayalam: 'വൃശ്ചികം', nameHi: 'वृश्चिकम', rashi: 'Vrischika (Scorpio)', gregorian: 'Nov 16 – Dec 15' },
  { name: 'Dhanu', malayalam: 'ധനു', nameHi: 'धनु', rashi: 'Dhanus (Sagittarius)', gregorian: 'Dec 16 – Jan 13' },
  { name: 'Makaram', malayalam: 'മകരം', nameHi: 'मकरम', rashi: 'Makara (Capricorn)', gregorian: 'Jan 14 – Feb 12' },
  { name: 'Kumbham', malayalam: 'കുംഭം', nameHi: 'कुंभम', rashi: 'Kumbha (Aquarius)', gregorian: 'Feb 13 – Mar 13' },
  { name: 'Meenam', malayalam: 'മീനം', nameHi: 'मीनम', rashi: 'Meena (Pisces)', gregorian: 'Mar 14 – Apr 13' },
  { name: 'Medam', malayalam: 'മേടം', nameHi: 'मेदम', rashi: 'Mesha (Aries)', gregorian: 'Apr 14 – May 14' },
  { name: 'Edavam', malayalam: 'ഇടവം', nameHi: 'इदवम', rashi: 'Vrishabha (Taurus)', gregorian: 'May 15 – Jun 14' },
  { name: 'Midhunam', malayalam: 'മിഥുനം', nameHi: 'मिथुनम', rashi: 'Mithuna (Gemini)', gregorian: 'Jun 15 – Jul 15' },
  { name: 'Karkidakam', malayalam: 'കർക്കടകം', nameHi: 'कर्कटकम', rashi: 'Kataka (Cancer)', gregorian: 'Jul 16 – Aug 16' },
];

const FESTIVALS = [
  { month: 'Chingam', en: 'Onam (10-day harvest festival — Atham to Thiruvonam; Pookalam, Sadya, Vallam Kali snake boat races)', hi: 'ओणम् (10 दिवसीय फसल उत्सव — पूक्कलम, सद्या, वल्लम काळि)' },
  { month: 'Medam', en: 'Vishu (Malayalam New Year, Medam 1 — Vishukkani, Vishukkaineettam, feast)', hi: 'विशु (मलयालम नव वर्ष, मेदम 1 — विशुक्कनि, विशुक्कैनीट्टम्)' },
  { month: 'Vrischikam', en: 'Thrissur Pooram (Vrischikam — the largest temple festival in Kerala, featuring caparisoned elephants and fireworks at Vadakkunnathan temple)', hi: 'त्रिशूर पूरम् (वृश्चिकम् — केरल का सबसे बड़ा मन्दिर उत्सव)' },
  { month: 'Dhanu', en: 'Thiruvathira (Dhanu — women\'s festival honouring Shiva and Parvati; Thiruvathira Kali dance performed overnight)', hi: 'तिरुवातिरा (धनु — महिलाओं का उत्सव; तिरुवातिरा काळि नृत्य)' },
  { month: 'Kumbham', en: 'Shivaratri (Kumbham — all-night vigil at Shiva temples across Kerala)', hi: 'शिवरात्रि (कुंभम् — केरल के शिव मन्दिरों में रात्रि जागरण)' },
  { month: 'Karkidakam', en: 'Karkidaka Ramayana (entire month — daily recitation of Adhyatma Ramayana at homes and temples; considered spiritually protective during the difficult monsoon month)', hi: 'कर्कटक रामायणम् (पूरा माह — आध्यात्म रामायण का दैनिक पठन)' },
];

// ── Onam 10-day chronology ──
// LocaleText shape enables Gemini overlay translator to fill hi/ml/regional values
// in a follow-up PR. tl() falls back to .en.
const ONAM_DAYS: Array<{ day: LocaleText; tithi: LocaleText; desc: LocaleText }> = [
  { day: { en: 'Day 1 — Atham', hi: 'दिन 1 - अथम' }, tithi: { en: 'Atham nakshatra', hi: 'अथम नक्षत्र' }, desc: { en: 'The festival opens with the first Pookalam (Atha-poo) — a small circular flower arrangement at the entrance of the household, traditionally using only yellow flowers in a single concentric ring. Households visit the Thrikkakara temple (the principal Onam shrine, where Vamana is enshrined). Local fairs (Athachamayam) at Thripunithura include caparisoned elephants and pulikali (tiger dance) performers.', hi: 'त्योहार की शुरुआत पहले पुकलम (अथा-पू) के साथ होती है - घर के प्रवेश द्वार पर एक छोटी गोलाकार फूलों की व्यवस्था, पारंपरिक रूप से एक ही संकेंद्रित रिंग में केवल पीले फूलों का उपयोग किया जाता है। परिवार त्रिक्ककारा मंदिर (प्रमुख ओणम मंदिर, जहां वामन प्रतिष्ठित हैं) जाते हैं। त्रिपुनिथुरा के स्थानीय मेलों (अथचामयम) में सजे हुए हाथी और पुलिकाली (बाघ नृत्य) कलाकार शामिल होते हैं।' } },
  { day: { en: 'Days 2–9 — Chithira through Uthradam', hi: 'दिन 2-9 - उथरादम के माध्यम से चिथिरा' }, tithi: { en: 'Chithira → Uthradam nakshatras', hi: 'चिथिरा → उथरादम नक्षत्र' }, desc: { en: 'Each day adds rings and colour palette to the pookalam. The famous Aranmula Vallamkali (snake-boat race) on the Pamba River is traditionally held on Uthrattathi, with elimination heats on Anizham. The snake boats (chundan vallam) and ritual songs (vanchipattu) trace back to Aranmula Parthasarathy temple tradition. Athapoo competitions are held — the largest community pookalams now reach 20+ feet in diameter.', hi: 'प्रत्येक दिन पुक्कलम में अंगूठियां और रंग पैलेट जोड़ा जाता है। पंबा नदी पर प्रसिद्ध अरनमुला वल्लमकली (साँप-नाव दौड़) पारंपरिक रूप से उथराट्टथि पर आयोजित की जाती है, जिसमें अनिज़म पर गर्मी समाप्त हो जाती है। साँप की नावें (चुंदन वल्लम) और अनुष्ठान गीत (वंचिपट्टू) अरनमुला पार्थसारथी मंदिर परंपरा की याद दिलाते हैं। अथापू प्रतियोगिताएं आयोजित की जाती हैं - सबसे बड़ा सामुदायिक पुकलम अब 20+ फीट व्यास तक पहुंच गया है।' } },
  { day: { en: 'Day 10 — Thiruvonam', hi: 'दिन 10 - तिरुवोनम' }, tithi: { en: 'Thiruvonam nakshatra', hi: 'तिरुवोणम नक्षत्र' }, desc: { en: 'Mahabali arrives. The pookalam reaches its full magnificence with figurines of Vamana and Mahabali at the centre. The Onam Sadya is served on a plantain leaf at noon. Traditional accounts cite 24–26 dishes, served in a strict order: pickles (mango, lime, inji-puli) and pappadam on the upper-left; rice in the centre; parippu (lentil curry) followed by sambar, then aviyal, olan, kaalan, thoran, erissery, pachadi, kichadi; and finally three or four payasams (palada, ada-pradhaman, paal-pradhaman).', hi: 'महाबली आता है. केंद्र में वामन और महाबली की मूर्तियों के साथ पूकलम अपनी पूरी भव्यता तक पहुंचता है। ओणम सद्य को दोपहर के समय केले के पत्ते पर परोसा जाता है। पारंपरिक विवरण 24-26 व्यंजनों का हवाला देते हैं, जो एक सख्त क्रम में परोसे जाते हैं: अचार (आम, नीबू, इंजी-पुली) और ऊपरी बाईं ओर पापड़म; बीच में चावल; परिप्पू (दाल की सब्जी) के बाद सांबर, फिर अवियाल, ओलान, कलान, थोरन, एरिसेरी, पचड़ी, खिचड़ी; और अंत में तीन या चार पायसम (पलादा, अदा-प्रधान, पाल-प्रधान)।' } },
];

// ── Kerala school astronomers ──
const KERALA_SCHOLARS: Array<{ name: LocaleText; dates: string; bio: LocaleText }> = [
  { name: { en: 'Madhava of Sangamagrama', hi: 'संगमग्राम के माधव' }, dates: 'c. 1340–1425', bio: { en: 'Founded the school at Tirur in modern Malappuram district. He is credited with discovering infinite-series expansions for trigonometric functions — sine, cosine, and arctangent — and an infinite series for π. These results predate Newton, Leibniz and Gregory by 250–300 years.', hi: 'आधुनिक मलप्पुरम जिले के तिरुर में स्कूल की स्थापना की। उन्हें त्रिकोणमितीय कार्यों के लिए अनंत-श्रृंखला विस्तार - साइन, कोसाइन और आर्कटेंजेंट - और π के लिए एक अनंत श्रृंखला की खोज करने का श्रेय दिया जाता है। ये परिणाम न्यूटन, लीबनिज़ और ग्रेगरी से 250-300 वर्ष पहले के हैं।' } },
  { name: { en: 'Parameshvara', hi: 'परमेश्वर' }, dates: 'c. 1380–1460', bio: { en: 'A student of Madhava’s lineage, observed eclipses and refined Bhaskara II’s astronomical parameters. He authored Drigganita, a treatise that established a Kerala-school observational standard. Parameshvara is regarded by Kerala-tradition pandits as the source of the Drik tradition in panchanga computation.', hi: 'माधव के वंश के एक छात्र ने ग्रहणों का अवलोकन किया और भास्कर द्वितीय के खगोलीय मापदंडों को परिष्कृत किया। उन्होंने ड्रिगगैनिटा नामक एक ग्रंथ लिखा, जिसने केरल-स्कूल अवलोकन मानक की स्थापना की। केरल-परंपरा के पंडित परमेश्वर को पंचांग गणना में ड्रिक परंपरा का स्रोत मानते हैं।' } },
  { name: { en: 'Nilakantha Somayaji', hi: 'नीलकंठ सोमयाजी' }, dates: '1444–1545', bio: { en: 'Author of the Tantrasangraha (c. 1500) — the most influential single Kerala astronomer. Nilakantha proposed a partially heliocentric model: the inner planets Mercury and Venus orbit the Sun, while the Sun orbits the Earth. This is roughly the Tychonic model — proposed by Tycho Brahe 80 years later.', hi: 'तंत्रसंग्रह के लेखक (लगभग 1500) - केरल के सबसे प्रभावशाली एकल खगोलशास्त्री। नीलकंठ ने आंशिक रूप से सूर्यकेंद्रित मॉडल प्रस्तावित किया: आंतरिक ग्रह बुध और शुक्र सूर्य की परिक्रमा करते हैं, जबकि सूर्य पृथ्वी की परिक्रमा करता है। यह मोटे तौर पर टाइकोनिक मॉडल है - जिसे टाइको ब्राहे ने 80 साल बाद प्रस्तावित किया था।' } },
  { name: { en: 'Sankara Varman', hi: 'शंकर वर्मन' }, dates: '1774–1839', bio: { en: 'Completed Sadratnamala in 1819, the last great treatise of the Kerala school. Varman computed the value of π to 17 decimal places. The British civil servant C.M. Whish met Varman in Travancore and introduced his work to Western mathematics through his 1832 paper to the Royal Asiatic Society.', hi: '1819 में सद्ररत्नमाला को पूरा किया, जो केरल स्कूल का अंतिम महान ग्रंथ था। वर्मन ने π के मान की गणना 17 दशमलव स्थानों तक की। ब्रिटिश सिविल सेवक सी.एम. व्हिश ने त्रावणकोर में वर्मन से मुलाकात की और रॉयल एशियाटिक सोसाइटी में अपने 1832 के पेपर के माध्यम से पश्चिमी गणित में अपने काम का परिचय दिया।' } },
];

// ── Kollam Era ME table ──
const KOLLAM_ERA_TABLE: Array<{ me: string; span: string; chingam: string }> = [
  { me: '1201 ME', span: '17 Aug 2025 – 16 Aug 2026', chingam: '17 Aug 2025' },
  { me: '1202 ME', span: '17 Aug 2026 – 16 Aug 2027', chingam: '17 Aug 2026' },
  { me: '1203 ME', span: '17 Aug 2027 – 16 Aug 2028', chingam: '17 Aug 2027' },
  { me: '1204 ME', span: '17 Aug 2028 – 16 Aug 2029', chingam: '17 Aug 2028' },
  { me: '1205 ME', span: '17 Aug 2029 – 16 Aug 2030', chingam: '17 Aug 2029' },
  { me: '1206 ME', span: '17 Aug 2030 – 16 Aug 2031', chingam: '17 Aug 2030' },
];

export default function MalayalamCalendarPage() {
  const locale = useLocale() as Locale;
  const isHi = isDevanagariLocale(locale);
  const L = (key: keyof typeof LABELS) => {
    const entry = LABELS[key] as Record<string, string>;
    return entry[locale] || entry.en;
  };
  const hf = isHi ? { fontFamily: 'var(--font-devanagari-heading)' } : { fontFamily: 'var(--font-heading)' };

  return (
    <main className="min-h-screen bg-bg-primary">
      <div className="max-w-4xl mx-auto px-4 py-12 space-y-10">

        {/* Header */}
        <div>
          <h1 className="text-3xl sm:text-4xl font-bold text-gold-gradient mb-4" style={hf}>
            {L('title')}
          </h1>
          <p className="text-text-secondary text-sm leading-relaxed max-w-3xl">
            {L('intro')}
          </p>
        </div>

        {/* Month Table */}
        <section>
          <h2 className="text-2xl font-bold text-gold-light mb-3" style={hf}>
            {L('monthsTitle')}
          </h2>
          <p className="text-text-secondary text-sm leading-relaxed mb-5">
            {L('monthsIntro')}
          </p>
          <div className="overflow-x-auto rounded-2xl border border-gold-primary/12">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-bg-secondary/60 border-b border-gold-primary/12">
                  <th className="text-left px-4 py-3 text-gold-light font-semibold">#</th>
                  <th className="text-left px-4 py-3 text-gold-light font-semibold">{RC('colMonth', locale)}</th>
                  <th className="text-left px-4 py-3 text-gold-light font-semibold">Malayalam</th>
                  <th className="text-left px-4 py-3 text-gold-light font-semibold">{RC('colRashi', locale)}</th>
                  <th className="text-left px-4 py-3 text-gold-light font-semibold">{RC('colGregorian', locale)}</th>
                </tr>
              </thead>
              <tbody>
                {MALAYALAM_MONTHS.map((m, i) => (
                  <tr key={m.name} className={i % 2 === 0 ? 'bg-bg-secondary/20' : 'bg-bg-secondary/40'}>
                    <td className="px-4 py-2.5 text-text-secondary">{i + 1}</td>
                    <td className="px-4 py-2.5 text-text-primary font-medium">{isHi ? m.nameHi : m.name}</td>
                    <td className="px-4 py-2.5 text-amber-400/80 font-medium">{m.malayalam}</td>
                    <td className="px-4 py-2.5 text-text-secondary">{m.rashi}</td>
                    <td className="px-4 py-2.5 text-text-secondary">{m.gregorian}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Festivals */}
        <section>
          <h2 className="text-2xl font-bold text-gold-light mb-5" style={hf}>
            {L('festivalsTitle')}
          </h2>
          <div className="space-y-3">
            {FESTIVALS.map((f) => (
              <div key={f.month} className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-4">
                <div className="text-gold-light font-semibold text-sm mb-1.5">{f.month}</div>
                <p className="text-text-secondary text-sm leading-relaxed">
                  {isHi ? f.hi : f.en}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Vishu */}
        <section className="bg-gradient-to-br from-amber-900/15 via-bg-secondary/40 to-bg-primary border border-gold-primary/12 rounded-2xl p-6">
          <h2 className="text-2xl font-bold text-gold-light mb-3" style={hf}>
            {L('vishuTitle')}
          </h2>
          <p className="text-text-secondary text-sm leading-relaxed">
            {L('vishuText')}
          </p>
        </section>

        {/* Onam */}
        <section className="bg-gradient-to-br from-green-900/15 via-bg-secondary/40 to-bg-primary border border-green-500/12 rounded-2xl p-6">
          <h2 className="text-2xl font-bold text-gold-light mb-3" style={hf}>
            {L('onamTitle')}
          </h2>
          <p className="text-text-secondary text-sm leading-relaxed">
            {L('onamText')}
          </p>
        </section>

        {/* Calendar Characteristics */}
        <section>
          <h2 className="text-2xl font-bold text-gold-light mb-3" style={hf}>
            {L('calendarTitle')}
          </h2>
          <p className="text-text-secondary text-sm leading-relaxed">
            {L('calendarText')}
          </p>
        </section>

        {/* Kollam Era + Malayalam Calendar Origin */}
        <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-2xl p-6">
          <h2 className="text-2xl font-bold text-gold-light mb-3" style={hf}>
            {tl({ en: 'Kollam Era and the Malayalam Calendar Origin', hi: 'कोल्लम युग और मलयालम कैलेंडर की उत्पत्ति' }, locale)}
          </h2>
          <div className="space-y-3 text-text-secondary text-sm leading-relaxed">
            <p>
              The Malayalam calendar — known as the <strong>Kollavarsham</strong> or <strong>Kollam Era (Kollam Andu)</strong> — is one of the few South Asian calendars whose origin point can be dated to a single recorded historical year: <strong>825 CE</strong>. The era celebrated the foundation by Maruwan Sapir Iso, leader of Persian Christian settlers and trading guilds, following the liberation of Venad from Chola rule. A great convention was convened in the port city of Kollam by King Kulashekharan in 825 CE.
            </p>
            <p>
              <strong>Kollam Andu vs Saka Andu in Kerala.</strong> Kerala’s traditional almanacs operate in two parallel eras. The civic year is the Kollam Era (Malayalam Era, ME), a sidereal solar calendar: the year begins on Chingam 1 (mid-August), the day the Sun enters sidereal Leo. The festival/temple year is computed against the Saka Era. For 2026 CE, the Kollam Era equivalence is <strong>ME 1201 → ME 1202</strong>, with the changeover at Chingam 1 (17 August 2026).
            </p>
            <p>
              <strong>Why solar Kollam Andu while Tamil tradition is lunar — the divergence.</strong> Kerala’s astronomers — heirs to the Kerala School of Mathematics — refined sidereal solar computation to a level of precision sufficient to anchor major festivals to solar markers, while Tamil Nadu’s panchanga tradition preserved the lunar tithi as primary for ritual selection. The result is that Onam (Chingam Tiruvonam) falls on a fixed solar date roughly each year, while comparable Tamil festivals slide with the lunar cycle.
            </p>
            <p>
              Kerala’s month names are zodiacal: <strong>Chingam (Leo), Kanni (Virgo), Thulam (Libra), Vrischikam (Scorpio), Dhanu (Sagittarius), Makaram (Capricorn), Kumbham (Aquarius), Meenam (Pisces), Medam (Aries), Edavam (Taurus), Mithunam (Gemini), Karkidakam (Cancer)</strong>.
            </p>
          </div>
        </section>

        {/* Onam day-by-day chronology */}
        <section>
          <h2 className="text-2xl font-bold text-gold-light mb-3" style={hf}>
            {tl({ en: 'Onam Day-by-Day Chronology — Atham to Thiruvonam', hi: 'ओणम् दिन-क्रम — अथम् से थिरुवोणम् तक' }, locale)}
          </h2>
          <p className="text-text-secondary text-sm leading-relaxed mb-4">
            Onam is Kerala’s grand harvest festival, celebrated over ten days in the Malayalam month of Chingam (August–September). The ten days are each named after the nakshatra (asterism) that anchors them: <strong>Atham → Chithira → Chodhi → Vishakam → Anizham → Thriketa → Moolam → Pooradam → Uthradam → Thiruvonam</strong>.
          </p>
          <div className="space-y-3">
            {ONAM_DAYS.map((d) => (
              <div key={d.day.en} className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-4">
                <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1 mb-1.5">
                  <span className="text-gold-light font-semibold text-sm">{tl(d.day, locale)}</span>
                  <span className="text-amber-400/70 text-xs">{tl(d.tithi, locale)}</span>
                </div>
                <p className="text-text-secondary text-sm leading-relaxed">{tl(d.desc, locale)}</p>
              </div>
            ))}
          </div>
          <p className="text-text-secondary text-sm leading-relaxed mt-4">
            <strong>The Mahabali legend.</strong> Mahabali was a benevolent Asura king under whose rule Kerala flourished — no caste, no inequality, no hunger. The Devas, threatened by Mahabali’s prestige, requested Vishnu’s intervention. Vishnu took the form of <strong>Vamana</strong>, a young Brahmin dwarf, and approached Mahabali. Asked what he desired, Vamana requested “three paces of land.” Vamana expanded to cosmic stature: with one stride he covered all the earth, with the second the heavens. He asked where to place the third. Mahabali offered his own head; Vamana pressed him down to the netherworld (Patala). Recognising Mahabali’s devotion, Vishnu granted him an annual return to visit his people — that homecoming is Onam.
          </p>
        </section>

        {/* Vishu — Agricultural New Year */}
        <section className="bg-gradient-to-br from-amber-900/15 via-bg-secondary/40 to-bg-primary border border-amber-500/12 rounded-2xl p-6">
          <h2 className="text-2xl font-bold text-gold-light mb-3" style={hf}>
            {tl({ en: 'Vishu — Kerala’s Agricultural New Year', hi: 'विशु — केरल का कृषि नव वर्ष' }, locale)}
          </h2>
          <div className="space-y-3 text-text-secondary text-sm leading-relaxed">
            <p>
              Vishu is the <strong>astronomical and agricultural new year</strong> of Kerala, observed on Medam 1 (Mesha Sankranti), 14 or 15 April. The word “Vishu” derives from Sanskrit meaning “equal,” historically connected to spring equinox celebrations.
            </p>
            <p>
              <strong>Why is Vishu the agricultural new year while Kollam Andu marks the civic year?</strong> The Kollam Era begins in Chingam (August) — civically a moment of harvest gratitude, after the southwest monsoon. Vishu begins in Medam (April) — agriculturally the start of the planting cycle. Kerala’s farming calendar is built on Vishu, while its land registers and government year are built on Kollam Era.
            </p>
            <p>
              <strong>Vishu Kani arrangement.</strong> The defining ritual is the <em>Kani</em> (“that which is seen first”) — a tray of auspicious items arranged the night before in the puja room, to be viewed at dawn as the very first sight of the new year. Items: <em>Uri</em> filled with raw rice, Konna flowers (Cassia fistula, golden shower tree blossoms), golden cucumber and golden lemon, a coconut cut open, jackfruit, betel leaves, arecanut, and gold coins, an Aranmula kannadi (polished bronze mirror), and a Krishna or Vishnu idol at the centre.
            </p>
            <p>
              <strong>Konna flower significance.</strong> The Cassia fistula (Indian laburnum, Malayalam: <em>konna</em>) blooms in cascading yellow clusters precisely during Medam, and is the floral signifier of Vishu. Konna is considered the favourite flower of Krishna. A Vishu Kani without konna is considered incomplete.
            </p>
          </div>
        </section>

        {/* Kerala school astronomers */}
        <section>
          <h2 className="text-2xl font-bold text-gold-light mb-3" style={hf}>
            {tl({ en: 'Kerala’s Calendrical Scholars', hi: 'केरल के पंचांग-विद्वान' }, locale)}
          </h2>
          <p className="text-text-secondary text-sm leading-relaxed mb-4">
            Kerala’s calendar tradition is inseparable from the <strong>Kerala School of Astronomy and Mathematics</strong> — a school that, between the 14th and 19th centuries, produced some of the most sophisticated mathematical and astronomical work anywhere in the world.
          </p>
          <div className="space-y-3">
            {KERALA_SCHOLARS.map((s) => (
              <div key={s.name.en} className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-4">
                <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1 mb-1.5">
                  <span className="text-gold-light font-semibold text-sm">{tl(s.name, locale)}</span>
                  <span className="text-amber-400/70 text-xs">{s.dates}</span>
                </div>
                <p className="text-text-secondary text-sm leading-relaxed">{tl(s.bio, locale)}</p>
              </div>
            ))}
          </div>
          <p className="text-text-secondary text-sm leading-relaxed mt-4">
            <strong>Modern Devaswom Board Panchanga.</strong> The Kerala Devaswom Boards — five autonomous statutory bodies (Travancore, Cochin, Malabar, Guruvayur, Koodalmanikyam) — manage nearly 3,000 temples between them. Each board issues a temple festival calendar in consultation with <strong>hereditary tantris</strong>.
          </p>
        </section>

        {/* Kollam Era 1201–1206 ME */}
        <section>
          <h2 className="text-2xl font-bold text-gold-light mb-3" style={hf}>
            {tl({ en: 'Kollam Era 1201–1206 ME (≈ 2025–2031 CE)', hi: 'कोल्लम युग 1201–1206 ME (≈ 2025–2031 CE)' }, locale)}
          </h2>
          <div className="overflow-x-auto rounded-2xl border border-gold-primary/12">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-bg-secondary/60 border-b border-gold-primary/12">
                  <th className="text-left px-4 py-3 text-gold-light font-semibold">Kollam Era (ME)</th>
                  <th className="text-left px-4 py-3 text-gold-light font-semibold">Gregorian Span</th>
                  <th className="text-left px-4 py-3 text-gold-light font-semibold">Chingam 1</th>
                </tr>
              </thead>
              <tbody>
                {KOLLAM_ERA_TABLE.map((y, i) => (
                  <tr key={y.me} className={i % 2 === 0 ? 'bg-bg-secondary/20' : 'bg-bg-secondary/40'}>
                    <td className="px-4 py-2.5 text-gold-light font-semibold whitespace-nowrap">{y.me}</td>
                    <td className="px-4 py-2.5 text-amber-400/80 text-xs whitespace-nowrap">{y.span}</td>
                    <td className="px-4 py-2.5 text-text-secondary whitespace-nowrap">{y.chingam}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Related Links */}
        <section>
          <h2 className="text-2xl font-bold text-gold-light mb-4" style={hf}>
            {RC('relatedHeading', locale)}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {[
              { href: `/${locale}/calendar/regional/tamil`, labelKey: 'linkTamil' },
              { href: `/${locale}/calendar/regional/telugu`, labelKey: 'linkTelugu' },
              { href: `/${locale}/calendar/regional/kannada`, labelKey: 'linkKannada' },
              { href: `/${locale}/calendar`, labelKey: 'linkFestivalCalendar' },
            ].map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="block bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl px-4 py-3 text-gold-light hover:text-gold-primary hover:border-gold-primary/30 transition-colors text-sm font-medium"
              >
                {RC(link.labelKey, locale)}
              </a>
            ))}
          </div>
        </section>

      </div>
    </main>
  );
}
