import { tl } from '@/lib/utils/trilingual';
import { setRequestLocale } from 'next-intl/server';
import type { Locale, LocaleText } from '@/types/panchang';
import { isDevanagariLocale } from '@/lib/utils/locale-fonts';
import { Link } from '@/lib/i18n/navigation';

const LABELS = {
  title: {
    en: 'Odia Calendar (Panji) 2026-2027',
    hi: 'ओड़िआ कैलेंडर (पंजी) 2026-2027',
    sa: 'ओड़िआपञ्जी 2026-2027',
    ta: 'ஒடியா நாள்காட்டி (பஞ்சி) 2026-2027',
    bn: 'ওড়িয়া ক্যালেন্ডার (পঞ্জি) 2026-2027',
  },
  titleOdia: {
    en: 'ଓଡ଼ିଆ ପଞ୍ଜି ୨୦୨୬-୨୦୨୭',
    hi: 'ଓଡ଼ିଆ ପଞ୍ଜି ୨୦୨୬-୨୦୨୭',
    sa: 'ଓଡ଼ିଆ ପଞ୍ଜି ୨୦୨୬-୨୦୨୭',
    ta: 'ଓଡ଼ିଆ ପଞ୍ଜି ୨୦୨୬-୨୦୨୭',
    bn: 'ଓଡ଼ିଆ ପଞ୍ଜି ୨୦୨୬-୨୦୨୭',
  },
  intro: {
    en: 'The Odia calendar, known as the "Panji" (ପଞ୍ଜି), is the traditional solar calendar of the Odia-speaking people of Odisha and neighbouring regions. Rooted in the Surya Siddhanta astronomical system, the Panji governs all religious observances, agricultural cycles, and festival timings for over 50 million Odia speakers worldwide. Unlike the lunisolar calendars of North India, the Odia calendar is fundamentally solar: each month begins when the Sun transits into a new zodiac sign (Sankranti), making Sankranti dates the cornerstone of the entire system. The Odia era, known as Amli or Onkia, counts from the year the Ganga dynasty established rule over Odisha. The Panji is published annually by traditional almanac publishers and remains the authoritative reference for temple rituals at the Jagannath Temple in Puri, the most important Hindu shrine in eastern India. The current Odia year is 1435 Amli (beginning Pana Sankranti, 14 April 2026).',
    hi: 'ओड़िआ कैलेंडर, जिसे "पंजी" (ପଞ୍ଜି) कहा जाता है, ओडिशा और पड़ोसी क्षेत्रों के ओड़िआ भाषी लोगों का पारम्परिक सौर कैलेंडर है।',
    sa: 'ओड्रपञ्जी ओड्रभाषिणां पारम्परिकं सौरपञ्चाङ्गम्।',
    ta: 'ஒடியா நாள்காட்டி, "பஞ்சி" (ପଞ୍ଜି) என அறியப்படுவது, ஒடிசா மற்றும் அண்டை பகுதிகளின் ஒடியா மொழி பேசும் மக்களின் பாரம்பரிய சூரிய நாள்காட்டி ஆகும்.',
    bn: 'ওড়িয়া ক্যালেন্ডার, যা "পঞ্জি" (ପଞ୍ଜି) নামে পরিচিত, ওড়িশা এবং প্রতিবেশী অঞ্চলের ওড়িয়াভাষী মানুষদের ঐতিহ্যবাহী সৌর ক্যালেন্ডার।',
  },
  monthsTitle: {
    en: 'The 12 Odia Months (ବାର ମାସ)',
    hi: '12 ओड़िआ मास (ବାର ମାସ)',
    sa: '१२ ओड्रमासाः',
    ta: '12 ஒடியா மாதங்கள்',
    bn: '১২টি ওড়িয়া মাস',
  },
  monthsIntro: {
    en: 'The Odia calendar follows the Surya Siddhanta solar system, where each month begins on the Sankranti (the day the Sun enters a new zodiac sign). Month lengths vary between 29 and 32 days depending on the Sun\'s apparent speed through each sign.',
    hi: 'ओड़िआ कैलेंडर सूर्य सिद्धान्त सौर प्रणाली का अनुसरण करता है।',
    sa: 'ओड्रपञ्चाङ्गं सूर्यसिद्धान्तसौरपद्धतिम् अनुसरति।',
    ta: 'ஒடியா நாள்காட்டி சூரிய சித்தாந்த சூரிய முறையைப் பின்பற்றுகிறது.',
    bn: 'ওড়িয়া ক্যালেন্ডার সূর্য সিদ্ধান্ত সৌর পদ্ধতি অনুসরণ করে।',
  },
  rathYatraTitle: {
    en: 'Rath Yatra  –  The Chariot Festival of Lord Jagannath',
    hi: 'रथ यात्रा  –  भगवान जगन्नाथ का रथ महोत्सव',
    sa: 'रथयात्रा  –  जगन्नाथस्य रथमहोत्सवः',
    ta: 'ரத யாத்திரை  –  ஜகன்னாத் ரத திருவிழா',
    bn: 'রথযাত্রা  –  জগন্নাথের রথ মহোৎসব',
  },
  rathYatraText: {
    en: 'The Rath Yatra of Puri is the most iconic festival of Odisha and one of the oldest chariot processions in the world, drawing millions of devotees annually. Rath Yatra 2026 falls on Monday, 29 June, with Bahuda Yatra on Tuesday, 7 July, and Suna Besha on Wednesday, 8 July.',
    hi: 'पुरी की रथ यात्रा ओडिशा का सबसे प्रतिष्ठित त्योहार है। रथ यात्रा 2026 सोमवार, 29 जून को पड़ती है।',
    sa: 'पुरीनगरस्य रथयात्रा ओड्रदेशस्य सर्वश्रेष्ठं पर्वम्।',
    ta: 'புரி ரத யாத்திரை ஒடிசாவின் மிகச் சிறந்த திருவிழாவும் உலகின் மிகப் பழமையான ரத ஊர்வலங்களில் ஒன்றுமாகும்.',
    bn: 'পুরীর রথযাত্রা ওড়িশার সবচেয়ে প্রতিষ্ঠিত উৎসব।',
  },
  rajaParbaTitle: {
    en: 'Raja Parba  –  Celebrating the Earth\'s Fertility',
    hi: 'रज पर्व  –  पृथ्वी की उर्वरता का उत्सव',
    sa: 'रजपर्व  –  पृथिव्याः उर्वरतोत्सवः',
    ta: 'ராஜா பர்பா  –  பூமியின் கருவுறுதல் கொண்டாட்டம்',
    bn: 'রাজা পর্ব  –  পৃথিবীর উর্বরতার উৎসব',
  },
  rajaParbaText: {
    en: 'Raja Parba (ରଜ ପର୍ବ) is a unique three-day festival celebrated exclusively in Odisha, honouring the earth\'s annual cycle of fertility. Raja Parba 2026 falls on Sunday, 14 June to Tuesday, 16 June.',
    hi: 'रज पर्व (ରଜ ପର୍ବ) ओडिशा में विशेष रूप से मनाया जाने वाला एक अनूठा तीन-दिवसीय त्योहार है। रज पर्व 2026 रविवार 14 जून से मंगलवार 16 जून तक पड़ता है।',
    sa: 'रजपर्व (ରଜ ପର୍ବ) ओड्रदेशे विशिष्टम् त्रिदिवसीयं पर्वम्।',
    ta: 'ராஜா பர்பா (ରଜ ପର୍ବ) ஒடிசாவில் மட்டுமே கொண்டாடப்படும் தனித்துவமான மூன்று நாள் திருவிழா.',
    bn: 'রাজা পর্ব (ରଜ ପର୍ବ) ওড়িশায় বিশেষভাবে পালিত একটি অনন্য তিন দিনের উৎসব।',
  },
  calendarCharTitle: {
    en: 'How the Odia Calendar Works',
    hi: 'ओड़िआ कैलेंडर कैसे काम करता है',
    sa: 'ओड्रपञ्जी कथं कार्यं करोति',
    ta: 'ஒடியா நாள்காட்டி எவ்வாறு செயல்படுகிறது',
    bn: 'ওড়িয়া ক্যালেন্ডার কীভাবে কাজ করে',
  },
  calendarCharText: {
    en: 'The Odia calendar is a sidereal solar calendar based on the Surya Siddhanta. Each month begins on the Sankranti — the day the Sun enters a new rashi (zodiac sign). The Jagannath Temple in Puri follows the Panji exclusively for determining the dates of all 13 major annual festivals.',
    hi: 'ओड़िआ कैलेंडर सूर्य सिद्धान्त पर आधारित एक नाक्षत्र सौर कैलेंडर है। प्रत्येक मास संक्रान्ति पर आरम्भ होता है।',
    sa: 'ओड्रपञ्चाङ्गं सूर्यसिद्धान्ते आधारितं नाक्षत्रसौरपञ्चाङ्गम्।',
    ta: 'ஒடியா நாள்காட்டி சூரிய சித்தாந்தத்தின் அடிப்படையிலான நாட்சத்திர சூரிய நாள்காட்டி ஆகும்.',
    bn: 'ওড়িয়া ক্যালেন্ডার সূর্য সিদ্ধান্তের উপর ভিত্তি করে একটি নাক্ষত্রিক সৌর ক্যালেন্ডার।',
  },
  festivalsTitle: {
    en: 'Major Odia Festivals 2026 — Dates, Tithi & Nakshatra',
    hi: 'प्रमुख ओड़िआ त्योहार 2026 — तिथियां, तिथि और नक्षत्र',
    sa: 'प्रमुखोड्रपर्वाणि 2026',
    ta: 'முக்கிய ஒடியா திருவிழாக்கள் 2026',
    bn: 'প্রধান ওড়িয়া উৎসব 2026',
  },
  festivals2027Title: {
    en: 'Major Odia Festivals 2027 — Dates, Tithi & Nakshatra',
    hi: 'प्रमुख ओड़िआ त्योहार 2027 — तिथियां, तिथि और नक्षत्र',
    sa: 'प्रमुखोड्रपर्वाणि 2027',
    ta: 'முக்கிய ஒடியா திருவிழாக்கள் 2027',
    bn: 'প্রধান ওড়িয়া উৎসব 2027',
  },
  relatedTitle: {
    en: 'Related Regional Calendars & Festivals',
    hi: 'सम्बन्धित क्षेत्रीय कैलेंडर और त्योहार',
    sa: 'सम्बद्धक्षेत्रीयपञ्चाङ्गानि पर्वाणि च',
    ta: 'தொடர்புடைய பிராந்திய நாள்காட்டிகள் & திருவிழாக்கள்',
    bn: 'সম্পর্কিত আঞ্চলিক ক্যালেন্ডার ও উৎসব',
  },
};

// ═══════════════════════════════════════════════════════════════════════════
// 12 Odia Solar Months — Surya Siddhanta based
// Each month begins on Sankranti (Sun's entry into the next rashi)
// Approximate Gregorian dates; exact dates shift ±1 day per year
// ═══════════════════════════════════════════════════════════════════════════

const ODIA_MONTHS = [
  { name: 'Baisakha', odia: 'ବୈଶାଖ', gregorian: 'Apr 14 – May 14', days: '30–31', rashi: 'Mesha (Aries)', nameHi: 'बैशाख' },
  { name: 'Jyestha', odia: 'ଜ୍ୟେଷ୍ଠ', gregorian: 'May 15 – Jun 14', days: '31–32', rashi: 'Vrishabha (Taurus)', nameHi: 'ज्येष्ठ' },
  { name: 'Asadha', odia: 'ଆଷାଢ଼', gregorian: 'Jun 15 – Jul 16', days: '31–32', rashi: 'Mithuna (Gemini)', nameHi: 'आषाढ़' },
  { name: 'Srabana', odia: 'ଶ୍ରାବଣ', gregorian: 'Jul 17 – Aug 16', days: '31–32', rashi: 'Karka (Cancer)', nameHi: 'श्रावण' },
  { name: 'Bhadra', odia: 'ଭାଦ୍ର', gregorian: 'Aug 17 – Sep 16', days: '31', rashi: 'Simha (Leo)', nameHi: 'भाद्र' },
  { name: 'Aswina', odia: 'ଆଶ୍ୱିନ', gregorian: 'Sep 17 – Oct 17', days: '30–31', rashi: 'Kanya (Virgo)', nameHi: 'आश्विन' },
  { name: 'Kartika', odia: 'କାର୍ତ୍ତିକ', gregorian: 'Oct 18 – Nov 16', days: '29–30', rashi: 'Tula (Libra)', nameHi: 'कार्तिक' },
  { name: 'Margasira', odia: 'ମାର୍ଗଶିର', gregorian: 'Nov 17 – Dec 15', days: '29–30', rashi: 'Vrischika (Scorpio)', nameHi: 'मार्गशीर्ष' },
  { name: 'Pausa', odia: 'ପୌଷ', gregorian: 'Dec 16 – Jan 13', days: '29–30', rashi: 'Dhanu (Sagittarius)', nameHi: 'पौष' },
  { name: 'Magha', odia: 'ମାଘ', gregorian: 'Jan 14 – Feb 12', days: '29–30', rashi: 'Makara (Capricorn)', nameHi: 'माघ' },
  { name: 'Phalguna', odia: 'ଫାଲ୍ଗୁନ', gregorian: 'Feb 13 – Mar 14', days: '29–30', rashi: 'Kumbha (Aquarius)', nameHi: 'फाल्गुन' },
  { name: 'Chaitra', odia: 'ଚୈତ୍ର', gregorian: 'Mar 15 – Apr 13', days: '30–31', rashi: 'Meena (Pisces)', nameHi: 'चैत्र' },
];

// ═══════════════════════════════════════════════════════════════════════════
// 2026 Odia Festival Dates
// Reference: mainstream reference panchangs for Bhubaneswar/Puri
// ═══════════════════════════════════════════════════════════════════════════

const FESTIVAL_DATES_2026 = [
  { en: 'Makar Mela / Makar Sankranti', or: 'ମକର ମେଳା / ମକର ସଂକ୍ରାନ୍ତି', date: 'Wed, 14 Jan 2026', tithi: 'Paush Krishna Pratipada', nakshatra: 'Uttara Ashadha' },
  { en: 'Saraswati Puja (Vasant Panchami)', or: 'ସରସ୍ୱତୀ ପୂଜା (ବସନ୍ତ ପଞ୍ଚମୀ)', date: 'Mon, 23 Feb 2026', tithi: 'Magha Shukla Panchami', nakshatra: 'Shravana' },
  { en: 'Dola Purnima / Holi', or: 'ଦୋଳ ପୂର୍ଣ୍ଣିମା / ହୋଲି', date: 'Tue, 3 Mar 2026', tithi: 'Phalguna Purnima', nakshatra: 'Uttara Phalguni' },
  { en: 'Pana Sankranti (Odia New Year)', or: 'ପଣା ସଂକ୍ରାନ୍ତି (ମହା ବିଷୁବ ସଂକ୍ରାନ୍ତି)', date: 'Tue, 14 Apr 2026', tithi: 'Chaitra Krishna Amavasya', nakshatra: 'Revati' },
  { en: 'Akshaya Tritiya / Chandan Yatra begins', or: 'ଅକ୍ଷୟ ତୃତୀୟା / ଚନ୍ଦନ ଯାତ୍ରା', date: 'Fri, 1 May 2026', tithi: 'Baisakha Shukla Tritiya', nakshatra: 'Rohini' },
  { en: 'Raja Parba Day 1 — Pahili Raja', or: 'ରଜ ପର୍ବ (ପହିଲି ରଜ)', date: 'Sun, 14 Jun 2026', tithi: 'Jyestha Krishna Trayodashi', nakshatra: 'Bharani' },
  { en: 'Raja Parba Day 2 — Mithuna Sankranti', or: 'ରଜ ପର୍ବ (ମିଥୁନ ସଂକ୍ରାନ୍ତି)', date: 'Mon, 15 Jun 2026', tithi: 'Jyestha Krishna Chaturdashi', nakshatra: 'Krittika' },
  { en: 'Raja Parba Day 3 — Basi Raja', or: 'ରଜ ପର୍ବ (ବାସି ରଜ)', date: 'Tue, 16 Jun 2026', tithi: 'Jyestha Amavasya', nakshatra: 'Rohini' },
  { en: 'Rath Yatra (Puri)', or: 'ରଥଯାତ୍ରା (ପୁରୀ)', date: 'Mon, 29 Jun 2026', tithi: 'Ashadha Shukla Dwitiya', nakshatra: 'Pushya' },
  { en: 'Bahuda Yatra (Return Rath Yatra)', or: 'ବାହୁଡ଼ା ଯାତ୍ରା', date: 'Tue, 7 Jul 2026', tithi: 'Ashadha Shukla Dashami', nakshatra: 'Vishakha' },
  { en: 'Suna Besha (Golden Attire)', or: 'ସୁନା ବେଶ', date: 'Wed, 8 Jul 2026', tithi: 'Ashadha Shukla Ekadashi', nakshatra: 'Anuradha' },
  { en: 'Kumar Purnima', or: 'କୁମାର ପୂର୍ଣ୍ଣିମା', date: 'Sat, 24 Oct 2026', tithi: 'Ashwin Purnima', nakshatra: 'Ashwini' },
  { en: 'Diwali (Kali Puja)', or: 'ଦୀପାବଳୀ (କାଳୀ ପୂଜା)', date: 'Sun, 8 Nov 2026', tithi: 'Kartik Krishna Amavasya', nakshatra: 'Swati' },
  { en: 'Manabasa Gurubar (1st Thursday)', or: 'ମାଣବସା ଗୁରୁବାର', date: 'Thu, 19 Nov 2026', tithi: 'Margasira Krishna Pratipada', nakshatra: 'Uttara Phalguni' },
  { en: 'Prathamastami', or: 'ପ୍ରଥମାଷ୍ଟମୀ', date: 'Thu, 26 Nov 2026', tithi: 'Margasira Krishna Ashtami', nakshatra: 'Pushya' },
];

const FESTIVAL_DATES_2027 = [
  { en: 'Makar Mela / Makar Sankranti', or: 'ମକର ମେଳା / ମକର ସଂକ୍ରାନ୍ତି', date: 'Thu, 14 Jan 2027', tithi: 'Paush Shukla Dashami', nakshatra: 'Shravana' },
  { en: 'Saraswati Puja (Vasant Panchami)', or: 'ସରସ୍ୱତୀ ପୂଜା (ବସନ୍ତ ପଞ୍ଚମୀ)', date: 'Thu, 11 Feb 2027', tithi: 'Magha Shukla Panchami', nakshatra: 'Shravana' },
  { en: 'Dola Purnima / Holi', or: 'ଦୋଳ ପୂର୍ଣ୍ଣିମା / ହୋଲି', date: 'Sun, 22 Feb 2027', tithi: 'Phalguna Purnima', nakshatra: 'Purva Phalguni' },
  { en: 'Pana Sankranti (Odia New Year)', or: 'ପଣା ସଂକ୍ରାନ୍ତି (ମହା ବିଷୁବ ସଂକ୍ରାନ୍ତି)', date: 'Wed, 14 Apr 2027', tithi: 'Chaitra Shukla Dvadashi', nakshatra: 'Uttara Phalguni' },
  { en: 'Raja Parba Day 1 — Pahili Raja', or: 'ରଜ ପର୍ବ (ପହିଲି ରଜ)', date: 'Mon, 14 Jun 2027', tithi: 'Jyestha Shukla Chaturdashi', nakshatra: 'Jyestha' },
  { en: 'Raja Parba Day 2 — Mithuna Sankranti', or: 'ରଜ ପର୍ବ (ମିଥୁନ ସଂକ୍ରାନ୍ତି)', date: 'Tue, 15 Jun 2027', tithi: 'Jyestha Purnima', nakshatra: 'Mula' },
  { en: 'Raja Parba Day 3 — Basi Raja', or: 'ରଜ ପର୍ବ (ବାସି ରଜ)', date: 'Wed, 16 Jun 2027', tithi: 'Ashadha Krishna Pratipada', nakshatra: 'Purva Ashadha' },
  { en: 'Rath Yatra (Puri)', or: 'ରଥଯାତ୍ରା (ପୁରୀ)', date: 'Fri, 18 Jun 2027', tithi: 'Ashadha Shukla Dwitiya', nakshatra: 'Pushya' },
  { en: 'Bahuda Yatra (Return Rath Yatra)', or: 'ବାହୁଡ଼ା ଯାତ୍ରା', date: 'Sat, 26 Jun 2027', tithi: 'Ashadha Shukla Dashami', nakshatra: 'Vishakha' },
  { en: 'Kumar Purnima', or: 'କୁମାର ପୂର୍ଣ୍ଣିମା', date: 'Wed, 13 Oct 2027', tithi: 'Ashwin Purnima', nakshatra: 'Ashwini' },
  { en: 'Diwali', or: 'ଦୀପାବଳୀ', date: 'Thu, 28 Oct 2027', tithi: 'Kartik Krishna Amavasya', nakshatra: 'Chitra' },
  { en: 'Prathamastami', or: 'ପ୍ରଥମାଷ୍ଟମୀ', date: 'Mon, 15 Nov 2027', tithi: 'Margasira Krishna Ashtami', nakshatra: 'Pushya' },
];

// FAQ data for structured data
const FAQ_DATA = [
  {
    q: { en: 'When is Rath Yatra 2026?', hi: 'रथ यात्रा 2026 कब है?' },
    a: { en: 'Rath Yatra 2026 falls on Monday, 29 June 2026, on Ashadha Shukla Dwitiya. The grand chariot procession takes place in Puri, Odisha. The Return Rath Yatra (Bahuda Yatra) is on 7 July, and Suna Besha (Golden Attire ceremony) is on 8 July 2026.', hi: 'रथ यात्रा 2026 सोमवार, 29 जून 2026 को आषाढ़ शुक्ल द्वितीया पर पड़ती है। बहुदा यात्रा 7 जुलाई और सुना बेश 8 जुलाई 2026 को है।' },
  },
  {
    q: { en: 'What is Pana Sankranti?', hi: 'पना संक्रान्ति क्या है?' },
    a: { en: 'Pana Sankranti, also known as Maha Vishuba Sankranti, falls on 14 April every year and marks the Odia New Year. It is the day the Sun enters Mesha rashi (Aries).', hi: 'पना संक्रान्ति प्रतिवर्ष 14 अप्रैल को पड़ती है और ओड़िआ नव वर्ष का प्रतीक है।' },
  },
  {
    q: { en: 'How does the Odia calendar work?', hi: 'ओड़िआ कैलेंडर कैसे काम करता है?' },
    a: { en: 'The Odia calendar (Panji) is a sidereal solar calendar based on the Surya Siddhanta. Each month begins on Sankranti, the day the Sun enters a new zodiac sign. Month lengths vary from 29 to 32 days.', hi: 'ओड़िआ कैलेंडर (पंजी) सूर्य सिद्धान्त पर आधारित एक नाक्षत्र सौर कैलेंडर है। प्रत्येक मास संक्रान्ति पर आरम्भ होता है।' },
  },
  {
    q: { en: 'When is Raja Parba 2026?', hi: 'रज पर्व 2026 कब है?' },
    a: { en: 'Raja Parba 2026 falls from Sunday, 14 June to Tuesday, 16 June 2026. The three days are Pahili Raja (14 Jun), Mithuna Sankranti/Raja proper (15 Jun), and Basi Raja (16 Jun).', hi: 'रज पर्व 2026 रविवार 14 जून से मंगलवार 16 जून 2026 तक पड़ता है।' },
  },
  {
    q: { en: 'What is the current Odia year?', hi: 'वर्तमान ओड़िआ वर्ष क्या है?' },
    a: { en: 'The current Odia year is 1435 Amli (from 14 April 2026 to 13 April 2027). The Amli era began around 592 CE under the Ganga dynasty of Odisha.', hi: 'वर्तमान ओड़िआ वर्ष 1435 अम्ली है (14 अप्रैल 2026 से 13 अप्रैल 2027)।' },
  },
];

const RELATED_LINKS = [
  { href: 'calendar/regional/bengali', en: 'Bengali Calendar (Panjika)', hi: 'बंगाली कैलेंडर (पंजिका)' },
  { href: 'calendar/regional/tamil', en: 'Tamil Calendar (Panchangam)', hi: 'तमिल कैलेंडर (पंचांगम्)' },
  { href: 'calendar/regional/telugu', en: 'Telugu Calendar (Panchangam)', hi: 'तेलुगू कैलेंडर (पंचांगम्)' },
  { href: 'calendar', en: 'Festival Calendar 2026', hi: 'त्योहार कैलेंडर 2026' },
  { href: 'panchang', en: 'Daily Panchang', hi: 'दैनिक पंचांग' },
];

export default async function OdiaCalendarPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const loc = locale as Locale;
  const isHi = isDevanagariLocale(loc);
  const L = (key: keyof typeof LABELS) => tl(LABELS[key] as LocaleText, loc);
  const hf = isHi ? { fontFamily: 'var(--font-devanagari-heading)' } : { fontFamily: 'var(--font-heading)' };

  return (
    <main className="min-h-screen bg-bg-primary">
      <div className="max-w-4xl mx-auto px-4 py-12 space-y-10">

        {/* Header */}
        <div>
          <h1 className="text-3xl sm:text-4xl font-bold text-gold-gradient mb-2" style={hf}>
            {L('title')}
          </h1>
          <p className="text-amber-400/70 text-lg mb-4">{L('titleOdia')}</p>
          <p className="text-text-secondary text-sm leading-relaxed max-w-3xl">
            {L('intro')}
          </p>
        </div>

        {/* 12 Odia Months Table */}
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
                  <th className="text-left px-4 py-3 text-gold-light font-semibold">{isHi ? 'मास' : 'Month'}</th>
                  <th className="text-left px-4 py-3 text-gold-light font-semibold">ଓଡ଼ିଆ</th>
                  <th className="text-left px-4 py-3 text-gold-light font-semibold">{isHi ? 'राशि' : 'Rashi'}</th>
                  <th className="text-left px-4 py-3 text-gold-light font-semibold">{isHi ? 'ग्रेगोरियन' : 'Gregorian'}</th>
                  <th className="text-left px-4 py-3 text-gold-light font-semibold">{isHi ? 'दिन' : 'Days'}</th>
                </tr>
              </thead>
              <tbody>
                {ODIA_MONTHS.map((m, i) => (
                  <tr key={m.name} className={i % 2 === 0 ? 'bg-bg-secondary/20' : 'bg-bg-secondary/40'}>
                    <td className="px-4 py-2.5 text-text-secondary">{i + 1}</td>
                    <td className="px-4 py-2.5 text-text-primary font-medium">{isHi ? m.nameHi : m.name}</td>
                    <td className="px-4 py-2.5 text-amber-400/80 font-medium">{m.odia}</td>
                    <td className="px-4 py-2.5 text-text-secondary text-xs">{m.rashi}</td>
                    <td className="px-4 py-2.5 text-text-secondary">{m.gregorian}</td>
                    <td className="px-4 py-2.5 text-text-secondary text-center">{m.days}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* 2026 Odia Festival Dates */}
        <section>
          <h2 className="text-2xl font-bold text-gold-light mb-3" style={hf}>
            {L('festivalsTitle')}
          </h2>
          <p className="text-text-secondary text-sm leading-relaxed mb-5">
            {isHi
              ? 'भुवनेश्वर/पुरी सन्दर्भ के साथ 2026 के प्रमुख ओड़िआ त्योहारों की सटीक तिथियां।'
              : 'Exact dates for all major Odia festivals in 2026 with tithi and nakshatra computed for Bhubaneswar/Puri.'}
          </p>
          <div className="overflow-x-auto rounded-2xl border border-gold-primary/12">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-bg-secondary/60 border-b border-gold-primary/12">
                  <th className="text-left px-4 py-3 text-gold-light font-semibold">{isHi ? 'त्योहार' : 'Festival'}</th>
                  <th className="text-left px-4 py-3 text-gold-light font-semibold">{isHi ? 'दिनांक' : 'Date'}</th>
                  <th className="text-left px-4 py-3 text-gold-light font-semibold">{isHi ? 'तिथि' : 'Tithi'}</th>
                  <th className="text-left px-4 py-3 text-gold-light font-semibold">{isHi ? 'नक्षत्र' : 'Nakshatra'}</th>
                </tr>
              </thead>
              <tbody>
                {FESTIVAL_DATES_2026.map((f, i) => (
                  <tr key={`${f.en}-${f.date}`} className={i % 2 === 0 ? 'bg-bg-secondary/20' : 'bg-bg-secondary/40'}>
                    <td className="px-4 py-2.5 text-text-primary font-medium">{isHi ? f.or : f.en}</td>
                    <td className="px-4 py-2.5 text-amber-400/80">{f.date}</td>
                    <td className="px-4 py-2.5 text-text-secondary">{f.tithi}</td>
                    <td className="px-4 py-2.5 text-text-secondary">{f.nakshatra}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* 2027 Odia Festival Dates */}
        <section>
          <h2 className="text-2xl font-bold text-gold-light mb-3" style={hf}>
            {L('festivals2027Title')}
          </h2>
          <p className="text-text-secondary text-sm leading-relaxed mb-5">
            {isHi
              ? '2027 में प्रमुख ओड़िआ त्योहार। ओड़िआ वर्ष 1436 अम्ली 14 अप्रैल 2027 से आरम्भ होगा।'
              : 'Major Odia festival dates for 2027. Odia year 1436 Amli begins on 14 April 2027.'}
          </p>
          <div className="overflow-x-auto rounded-2xl border border-gold-primary/12">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-bg-secondary/60 border-b border-gold-primary/12">
                  <th className="text-left px-4 py-3 text-gold-light font-semibold">{isHi ? 'त्योहार' : 'Festival'}</th>
                  <th className="text-left px-4 py-3 text-gold-light font-semibold">{isHi ? 'दिनांक' : 'Date'}</th>
                  <th className="text-left px-4 py-3 text-gold-light font-semibold">{isHi ? 'तिथि' : 'Tithi'}</th>
                  <th className="text-left px-4 py-3 text-gold-light font-semibold">{isHi ? 'नक्षत्र' : 'Nakshatra'}</th>
                </tr>
              </thead>
              <tbody>
                {FESTIVAL_DATES_2027.map((f, i) => (
                  <tr key={`${f.en}-${f.date}`} className={i % 2 === 0 ? 'bg-bg-secondary/20' : 'bg-bg-secondary/40'}>
                    <td className="px-4 py-2.5 text-text-primary font-medium">{isHi ? f.or : f.en}</td>
                    <td className="px-4 py-2.5 text-amber-400/80">{f.date}</td>
                    <td className="px-4 py-2.5 text-text-secondary">{f.tithi}</td>
                    <td className="px-4 py-2.5 text-text-secondary">{f.nakshatra}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Rath Yatra Deep Dive */}
        <section className="bg-gradient-to-br from-amber-900/15 via-bg-secondary/40 to-bg-primary border border-gold-primary/12 rounded-2xl p-6">
          <h2 className="text-2xl font-bold text-gold-light mb-3" style={hf}>
            {L('rathYatraTitle')}
          </h2>
          <p className="text-text-secondary text-sm leading-relaxed">
            {L('rathYatraText')}
          </p>
        </section>

        {/* Raja Parba Deep Dive */}
        <section className="bg-gradient-to-br from-red-900/10 via-bg-secondary/40 to-bg-primary border border-red-500/12 rounded-2xl p-6">
          <h2 className="text-2xl font-bold text-gold-light mb-3" style={hf}>
            {L('rajaParbaTitle')}
          </h2>
          <p className="text-text-secondary text-sm leading-relaxed">
            {L('rajaParbaText')}
          </p>
        </section>

        {/* How the Odia Calendar Works */}
        <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-2xl p-6">
          <h2 className="text-2xl font-bold text-gold-light mb-3" style={hf}>
            {L('calendarCharTitle')}
          </h2>
          <p className="text-text-secondary text-sm leading-relaxed">
            {L('calendarCharText')}
          </p>
        </section>

        {/* Amli Era Explanation */}
        <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-2xl p-6">
          <h2 className="text-2xl font-bold text-gold-light mb-3" style={hf}>
            {isHi ? 'अम्ली संवत् — ओड़िआ वर्ष गणना' : 'The Amli Era — Odia Year Numbering'}
          </h2>
          <div className="space-y-3 text-text-secondary text-sm leading-relaxed">
            <p>
              {isHi
                ? 'अम्ली संवत् (ओंकिआ या विलायती भी कहा जाता है) लगभग 592 ई. से गणना की जाती है। वर्तमान ओड़िआ वर्ष 1435 अम्ली (14 अप्रैल 2026 से 13 अप्रैल 2027) है।'
                : 'The Amli era (also called Onkia or Vilayati) counts from approximately 592 CE, when the Ganga dynasty established rule over Odisha. The current Odia year is 1435 Amli (14 April 2026 to 13 April 2027).'}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
              <div className="bg-bg-primary/40 border border-gold-primary/8 rounded-xl p-4">
                <div className="text-gold-light font-semibold text-lg mb-1">1435</div>
                <div className="text-text-secondary text-xs">{isHi ? 'अम्ली (14 अप्रैल 2026 – 13 अप्रैल 2027)' : 'Amli (14 Apr 2026 – 13 Apr 2027)'}</div>
              </div>
              <div className="bg-bg-primary/40 border border-gold-primary/8 rounded-xl p-4">
                <div className="text-gold-light font-semibold text-lg mb-1">1436</div>
                <div className="text-text-secondary text-xs">{isHi ? 'अम्ली (14 अप्रैल 2027 – 13 अप्रैल 2028)' : 'Amli (14 Apr 2027 – 13 Apr 2028)'}</div>
              </div>
            </div>
          </div>
        </section>

        {/* History & Significance */}
        <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-2xl p-6">
          <h2 className="text-2xl font-bold text-gold-light mb-3" style={hf}>
            {isHi ? 'ओड़िआ कैलेंडर का इतिहास और महत्व' : 'History & Significance of the Odia Calendar'}
          </h2>
          <div className="space-y-4 text-text-secondary text-sm leading-relaxed">
            <p>
              {isHi
                ? 'ओड़िआ पंजी का इतिहास गंग राजवंश (11वीं-15वीं शताब्दी) से जुड़ा है, जिन्होंने पुरी के जगन्नाथ मन्दिर का निर्माण करवाया। आज भी जगन्नाथ मन्दिर के "पंजी पण्डित" प्रतिवर्ष सूर्य सिद्धान्त के अनुसार नई पंजी की गणना करते हैं।'
                : 'The history of the Odia Panji is intimately linked to the Ganga dynasty (11th-15th century CE), who built the Jagannath Temple at Puri. To this day, the "Panji Pandits" of the Jagannath Temple compute a fresh Panji each year following Surya Siddhanta methods, determining the exact dates for all 13 major annual festivals.'}
            </p>
            <p>
              {isHi
                ? 'ओड़िआ कैलेंडर ओडिशा के कृषि जीवन का अभिन्न अंग भी है। प्रत्येक संक्रान्ति कृषि कार्यों के लिए एक मील का पत्थर है।'
                : 'The Odia calendar is also integral to Odisha\'s agricultural life. Each Sankranti serves as a milestone for farming activities: Pana Sankranti for summer sowing, Mithuna Sankranti for monsoon preparation, and Makar Sankranti for the winter harvest festival.'}
            </p>
            <p>
              {isHi
                ? 'ओड़िआ कैलेंडर भारत के उन अन्तिम प्रमुख कैलेंडरों में से एक है जो पूर्णतः खगोलीय आधार पर चलता है।'
                : 'A distinctive feature of the Odia calendar is that it remains one of the last major Indian calendars to operate on a purely astronomical basis — the Panji does not fix month lengths but determines them afresh each year from the Sun\'s actual transit times.'}
            </p>
          </div>
        </section>

        {/* FAQ Section */}
        <section>
          <h2 className="text-2xl font-bold text-gold-light mb-5" style={hf}>
            {isHi ? 'अक्सर पूछे जाने वाले प्रश्न (FAQ)' : 'Frequently Asked Questions (FAQ)'}
          </h2>
          <div className="space-y-4">
            {FAQ_DATA.map((faq) => (
              <details key={faq.q.en} className="group bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl overflow-hidden">
                <summary className="cursor-pointer px-5 py-4 text-gold-light font-medium text-sm flex items-center justify-between hover:border-gold-primary/30">
                  <span>{isHi ? faq.q.hi : faq.q.en}</span>
                  <span className="ml-3 text-gold-primary/50 group-open:rotate-180 transition-transform">&#9660;</span>
                </summary>
                <div className="px-5 pb-4 text-text-secondary text-sm leading-relaxed border-t border-gold-primary/8 pt-3">
                  {isHi ? faq.a.hi : faq.a.en}
                </div>
              </details>
            ))}
          </div>
        </section>

        {/* JSON-LD FAQ Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'FAQPage',
              mainEntity: FAQ_DATA.map((faq) => ({
                '@type': 'Question',
                name: faq.q.en,
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: faq.a.en,
                },
              })),
            }),
          }}
        />

        {/* Related Links */}
        <section>
          <h2 className="text-2xl font-bold text-gold-light mb-4" style={hf}>
            {L('relatedTitle')}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {RELATED_LINKS.map((link) => (
              <Link
                key={link.href}
                href={`/${link.href}`}
                className="block bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl px-4 py-3 text-gold-light hover:text-gold-primary hover:border-gold-primary/30 transition-colors text-sm font-medium"
              >
                {isHi ? link.hi : link.en}
              </Link>
            ))}
          </div>
        </section>

      </div>
    </main>
  );
}
