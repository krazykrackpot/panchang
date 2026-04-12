/**
 * 7-day email onboarding drip sequence templates.
 * Each email is short (3-4 paragraphs) with a single CTA.
 * Dark theme matching the app: #0a0e27 background, #e6e2d8 text, #d4a853 gold accent.
 */

const BASE_URL = 'https://dekhopanchang.com';

type Day = 1 | 2 | 3 | 4 | 5 | 6 | 7;
type Locale = 'en' | 'hi';

interface UserData {
  name?: string;
  ascendant?: string;
  moonSign?: string;
  nakshatra?: string;
  dashaLord?: string;
  nthHouse?: number;
}

interface EmailOutput {
  subject: string;
  html: string;
  text: string;
}

/* ═══════════════════════════════════════════════════════════════
   SHARED HTML HELPERS
   ═══════════════════════════════════════════════════════════════ */

function wrapEmail(body: string): string {
  return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#0a0e27;font-family:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif;">
  <div style="max-width:600px;margin:0 auto;padding:40px 20px;">
    <div style="text-align:center;margin-bottom:30px;">
      <h1 style="color:#d4a853;font-size:28px;margin:0;">Dekho Panchang</h1>
      <p style="color:#8a8478;font-size:13px;margin:8px 0 0;">Vedic Astrology Companion</p>
    </div>
    ${body}
    <div style="text-align:center;padding-top:24px;border-top:1px solid rgba(212,168,83,0.1);margin-top:32px;">
      <p style="color:#8a8478;font-size:12px;margin:0;">Dekho Panchang — Vedic Astrology Companion</p>
      <p style="color:#8a8478;font-size:11px;margin:8px 0 0;">
        <a href="${BASE_URL}/en/settings" style="color:#d4a853;text-decoration:none;">Manage email preferences</a>
        &nbsp;|&nbsp;
        <a href="${BASE_URL}" style="color:#d4a853;text-decoration:none;">Visit website</a>
      </p>
    </div>
  </div>
</body>
</html>`;
}

function card(content: string): string {
  return `<div style="background:#111638;border:1px solid rgba(212,168,83,0.2);border-radius:16px;padding:32px;margin-bottom:24px;">${content}</div>`;
}

function ctaButton(text: string, href: string): string {
  return `<div style="text-align:center;margin:28px 0;">
  <a href="${href}" style="display:inline-block;padding:14px 36px;background:linear-gradient(135deg,#8a6d2b,#d4a853);color:#0a0e27;font-size:16px;font-weight:bold;text-decoration:none;border-radius:12px;">${text}</a>
</div>`;
}

function p(text: string): string {
  return `<p style="color:#e6e2d8;font-size:15px;line-height:1.7;margin:0 0 16px;">${text}</p>`;
}

function heading(text: string): string {
  return `<h2 style="color:#f0d48a;font-size:22px;margin:0 0 16px;">${text}</h2>`;
}

function goldText(text: string): string {
  return `<span style="color:#d4a853;font-weight:bold;">${text}</span>`;
}

/* ═══════════════════════════════════════════════════════════════
   DAY 1: WELCOME
   ═══════════════════════════════════════════════════════════════ */

function day1(locale: Locale, data?: UserData): EmailOutput {
  const name = data?.name || (locale === 'hi' ? 'मित्र' : 'Friend');
  if (locale === 'hi') {
    return {
      subject: 'आपकी ब्रह्मांडीय यात्रा आज शुरू होती है',
      html: wrapEmail(card(
        heading(`नमस्ते, ${name}!`) +
        p('देखो पंचांग में आपका स्वागत है — आपका वैदिक ज्योतिष साथी।') +
        p(`यहाँ आप क्या कर सकते हैं: ${goldText('दैनिक पंचांग')} देखें, ${goldText('कुंडली')} बनाएं, ${goldText('104 मॉड्यूल')} से ज्योतिष सीखें, ${goldText('शादी मिलान')} जाँचें, और भी बहुत कुछ।`) +
        p('सबसे पहला कदम? अपनी जन्म कुंडली बनाएं — यह आपकी सभी भविष्यवाणियों का आधार है।') +
        ctaButton('अपनी कुंडली बनाएं', `${BASE_URL}/hi/kundali`)
      )),
      text: `नमस्ते ${name}!\n\nदेखो पंचांग में आपका स्वागत है। दैनिक पंचांग देखें, कुंडली बनाएं, 104 मॉड्यूल से सीखें।\n\nपहला कदम: अपनी जन्म कुंडली बनाएं।\n\n${BASE_URL}/hi/kundali`,
    };
  }
  return {
    subject: 'Your cosmic journey begins today',
    html: wrapEmail(card(
      heading(`Namaste, ${name}!`) +
      p('Welcome to Dekho Panchang — your personal Vedic astrology companion.') +
      p(`Here is what you can do: check your ${goldText('daily Panchang')}, generate a detailed ${goldText('Kundali (birth chart)')}, learn Vedic astrology through ${goldText('104 free modules')}, check ${goldText('marriage compatibility')}, and much more.`) +
      p('Your first step? Generate your birth chart — it powers all your personalized predictions.') +
      ctaButton('Generate Your Birth Chart', `${BASE_URL}/en/kundali`)
    )),
    text: `Namaste ${name}!\n\nWelcome to Dekho Panchang — your Vedic astrology companion. Check daily Panchang, generate Kundali, learn through 104 modules.\n\nFirst step: generate your birth chart.\n\n${BASE_URL}/en/kundali`,
  };
}

/* ═══════════════════════════════════════════════════════════════
   DAY 2: TODAY'S PANCHANG EXPLAINED
   ═══════════════════════════════════════════════════════════════ */

function day2(locale: Locale, _data?: UserData): EmailOutput {
  if (locale === 'hi') {
    return {
      subject: 'तिथि क्या है? आज यह क्यों मायने रखती है',
      html: wrapEmail(card(
        heading('आज का पंचांग — 2 मिनट में समझें') +
        p(`पंचांग का मतलब है "पाँच अंग": ${goldText('तिथि')} (चंद्र दिवस), ${goldText('नक्षत्र')} (चंद्र तारामंडल), ${goldText('योग')} (सूर्य-चंद्र संयोग), ${goldText('करण')} (अर्ध-तिथि), और ${goldText('वार')} (सप्ताह का दिन)।`) +
        p('प्राचीन काल से, भारतीय परिवारों ने शुभ कार्यों, त्योहारों और दैनिक निर्णयों के लिए पंचांग का उपयोग किया है। हमारा ऐप इन गणनाओं को शुद्ध गणित से करता है — कोई बाहरी API नहीं।') +
        p('आज का पंचांग देखें और जानें कि यह दिन आपके लिए क्या लेकर आया है।') +
        ctaButton('आज का पंचांग देखें', `${BASE_URL}/hi/panchang`)
      )),
      text: `तिथि क्या है?\n\nपंचांग = पाँच अंग: तिथि, नक्षत्र, योग, करण, वार।\n\nआज का पंचांग देखें: ${BASE_URL}/hi/panchang`,
    };
  }
  return {
    subject: "What's a Tithi? Why it matters today",
    html: wrapEmail(card(
      heading("Today's Panchang — Explained in 2 Minutes") +
      p(`Panchang means "five limbs": ${goldText('Tithi')} (lunar day), ${goldText('Nakshatra')} (lunar mansion), ${goldText('Yoga')} (Sun-Moon combination), ${goldText('Karana')} (half-tithi), and ${goldText('Vara')} (weekday).`) +
      p('For thousands of years, Indian families have used the Panchang to time auspicious events, festivals, and daily decisions. Our app computes all of these using pure mathematics — no external APIs, no guesswork.') +
      p("Check today's Panchang and see what the cosmic calendar holds for you.") +
      ctaButton("Check Today's Panchang", `${BASE_URL}/en/panchang`)
    )),
    text: `What's a Tithi?\n\nPanchang = 5 limbs: Tithi, Nakshatra, Yoga, Karana, Vara.\n\nCheck today's panchang: ${BASE_URL}/en/panchang`,
  };
}

/* ═══════════════════════════════════════════════════════════════
   DAY 3: INDIAN CONTRIBUTIONS
   ═══════════════════════════════════════════════════════════════ */

function day3(locale: Locale, _data?: UserData): EmailOutput {
  if (locale === 'hi') {
    return {
      subject: 'Sine संस्कृत है। Calculus केरल से है। और भी बहुत कुछ...',
      html: wrapEmail(card(
        heading('क्या आप जानते हैं? भारत की 10 खोजें जिन्होंने दुनिया बदली') +
        p(`${goldText('"Sine"')} शब्द संस्कृत "ज्या" (धनुष की प्रत्यंचा) से आया है — आर्यभट, 499 ई.`) +
        p(`${goldText('कलनशास्त्र (Calculus)')} की खोज केरल के माधव ने की — न्यूटन से 250 वर्ष पहले।`) +
        p(`${goldText('शून्य')}, ${goldText('ऋणात्मक संख्याएँ')}, ${goldText('बाइनरी कोड')}, ${goldText('पाइथागोरस प्रमेय')} — सभी का मूल भारत में है। 14 कहानियाँ पढ़ें।`) +
        ctaButton('सभी 14 खोजें पढ़ें', `${BASE_URL}/hi/learn`)
      )),
      text: `Sine संस्कृत है। Calculus केरल से है।\n\nशून्य, बाइनरी, पाइथागोरस — सभी भारतीय।\n\n14 कहानियाँ: ${BASE_URL}/hi/learn`,
    };
  }
  return {
    subject: 'Sine is Sanskrit. Calculus is Kerala. And more...',
    html: wrapEmail(card(
      heading('Did You Know? 10 Indian Discoveries That Changed the World') +
      p(`The word ${goldText('"Sine"')} comes from Sanskrit "Jya" (bowstring) — Aryabhata, 499 CE.`) +
      p(`${goldText('Calculus')} was discovered by Madhava in Kerala — 250 years before Newton and Leibniz.`) +
      p(`${goldText('Zero')}, ${goldText('negative numbers')}, ${goldText('binary code')}, ${goldText('the Pythagorean theorem')} — all originated in India. Read the full stories behind 14 discoveries.`) +
      ctaButton('Explore All 14 Discoveries', `${BASE_URL}/en/learn`)
    )),
    text: `Sine is Sanskrit. Calculus is Kerala.\n\nZero, binary, Pythagorean theorem — all Indian.\n\n14 stories: ${BASE_URL}/en/learn`,
  };
}

/* ═══════════════════════════════════════════════════════════════
   DAY 4: ECLIPSES
   ═══════════════════════════════════════════════════════════════ */

function day4(locale: Locale, data?: UserData): EmailOutput {
  const houseRef = data?.nthHouse
    ? (locale === 'hi' ? `आपके ${data.nthHouse}वें भाव` : `your ${data.nthHouse}${ordinalSuffix(data.nthHouse)} house`)
    : (locale === 'hi' ? 'आपकी कुंडली' : 'your chart');

  if (locale === 'hi') {
    return {
      subject: `अगला ग्रहण ${houseRef} में पड़ता है`,
      html: wrapEmail(card(
        heading('आगामी ग्रहण — व्यक्तिगत विश्लेषण') +
        p('वैदिक ज्योतिष में, ग्रहण शक्तिशाली कार्मिक संकेत हैं। ये राहु और केतु (चंद्र गांठें) से जुड़े हैं — वही ग्रह जो आपकी कुंडली में पिछले जन्म और भविष्य के मार्ग को दर्शाते हैं।') +
        p('हम आगामी सभी सूर्य और चंद्र ग्रहणों की गणना करते हैं, साथ ही बताते हैं कि वे आपकी कुंडली के किस भाव को प्रभावित करेंगे।') +
        ctaButton('ग्रहण कैलेंडर देखें', `${BASE_URL}/hi/eclipses`)
      )),
      text: `अगला ग्रहण ${houseRef} में।\n\nग्रहण कैलेंडर: ${BASE_URL}/hi/eclipses`,
    };
  }
  return {
    subject: `The next eclipse falls in ${houseRef}`,
    html: wrapEmail(card(
      heading('Your Upcoming Eclipses — Personalized Analysis') +
      p('In Vedic astrology, eclipses are powerful karmic markers. They are connected to Rahu and Ketu (the lunar nodes) — the same shadow planets that indicate past life karma and future direction in your birth chart.') +
      p('We compute all upcoming solar and lunar eclipses and show which house of your chart they will activate, along with traditional remedies and guidance.') +
      ctaButton('View Eclipse Calendar', `${BASE_URL}/en/eclipses`)
    )),
    text: `The next eclipse falls in ${houseRef}.\n\nEclipse calendar: ${BASE_URL}/en/eclipses`,
  };
}

/* ═══════════════════════════════════════════════════════════════
   DAY 5: LEARNING SYSTEM
   ═══════════════════════════════════════════════════════════════ */

function day5(locale: Locale, _data?: UserData): EmailOutput {
  if (locale === 'hi') {
    return {
      subject: '104 मुफ़्त मॉड्यूल। "ज्योतिष क्या है?" से शुरू करें',
      html: wrapEmail(card(
        heading('वैदिक ज्योतिष सीखना शुरू करें — मॉड्यूल 1') +
        p(`हमारा लर्निंग सिस्टम ${goldText('104 मॉड्यूल')} में बँटा है — नींव से लेकर उन्नत विषयों तक। प्रत्येक मॉड्यूल छोटा, सरल, और संस्कृत शब्दों के साथ है।`) +
        p(`विषय: ${goldText('ग्रह')}, ${goldText('राशियाँ')}, ${goldText('नक्षत्र')}, ${goldText('तिथियाँ')}, ${goldText('योग')}, ${goldText('करण')}, ${goldText('मुहूर्त')}, ${goldText('कुंडली')} — सभी त्रिभाषी (EN/HI/SA) में।`) +
        p('पहले मॉड्यूल से शुरू करें: "ज्योतिष क्या है?"') +
        ctaButton('सीखना शुरू करें', `${BASE_URL}/hi/learn/modules/0-1`)
      )),
      text: `104 मुफ़्त मॉड्यूल। ज्योतिष सीखें।\n\nशुरू करें: ${BASE_URL}/hi/learn/modules/0-1`,
    };
  }
  return {
    subject: "104 free modules. Start with 'What is Jyotish?'",
    html: wrapEmail(card(
      heading('Start Learning Vedic Astrology — Module 1') +
      p(`Our learning system covers ${goldText('104 modules')} — from foundations to advanced topics. Each module is concise, accessible, and includes key Sanskrit terms.`) +
      p(`Topics: ${goldText('Grahas')}, ${goldText('Rashis')}, ${goldText('Nakshatras')}, ${goldText('Tithis')}, ${goldText('Yogas')}, ${goldText('Karanas')}, ${goldText('Muhurtas')}, ${goldText('Kundali')} — all available in English, Hindi, and Sanskrit.`) +
      p('Start with Module 1: "What is Jyotish?"') +
      ctaButton('Start Learning', `${BASE_URL}/en/learn/modules/0-1`)
    )),
    text: `104 free modules. Learn Vedic astrology.\n\nStart: ${BASE_URL}/en/learn/modules/0-1`,
  };
}

/* ═══════════════════════════════════════════════════════════════
   DAY 6: DASHA PERIODS
   ═══════════════════════════════════════════════════════════════ */

function day6(locale: Locale, data?: UserData): EmailOutput {
  const dashaRef = data?.dashaLord
    ? (locale === 'hi' ? `${data.dashaLord} महादशा` : `${data.dashaLord} Mahadasha`)
    : (locale === 'hi' ? 'आपकी महादशा' : 'your Mahadasha');

  if (locale === 'hi') {
    return {
      subject: `आप ${dashaRef} में हैं — इसका क्या मतलब है`,
      html: wrapEmail(card(
        heading('आपकी दशा अवधि — अगले 5 वर्षों का दृष्टिकोण') +
        p(`विमशोत्तरी दशा प्रणाली वैदिक ज्योतिष की सबसे शक्तिशाली भविष्यवाणी पद्धति है। यह 120 वर्षों को 9 ग्रहों की अवधियों में बाँटती है — प्रत्येक अवधि जीवन के अलग-अलग क्षेत्रों को सक्रिय करती है।`) +
        p('आपकी कुंडली में महादशा, अंतर्दशा और प्रत्यंतर्दशा — तीनों स्तरों का विस्तृत विश्लेषण उपलब्ध है।') +
        ctaButton('अपनी दशा देखें', `${BASE_URL}/hi/kundali`)
      )),
      text: `आप ${dashaRef} में हैं।\n\nदशा देखें: ${BASE_URL}/hi/kundali`,
    };
  }
  return {
    subject: `You're in ${dashaRef} — here's what it means`,
    html: wrapEmail(card(
      heading('Your Dasha Period — What the Next 5 Years Look Like') +
      p('The Vimshottari Dasha system is the most powerful predictive tool in Vedic astrology. It divides 120 years into planetary periods — each activating different areas of your life based on the ruling planet\'s position in your birth chart.') +
      p('Your Kundali includes detailed analysis of Mahadasha, Antardasha, and Pratyantardasha — three levels of planetary timing that reveal what is active in your life right now.') +
      ctaButton('Check Your Dashas', `${BASE_URL}/en/kundali`)
    )),
    text: `You're in ${dashaRef}.\n\nCheck dashas: ${BASE_URL}/en/kundali`,
  };
}

/* ═══════════════════════════════════════════════════════════════
   DAY 7: SHARE / REFERRAL
   ═══════════════════════════════════════════════════════════════ */

function day7(locale: Locale, _data?: UserData): EmailOutput {
  const shareText = encodeURIComponent(
    locale === 'hi'
      ? 'देखो पंचांग — मुफ़्त वैदिक ज्योतिष ऐप। दैनिक पंचांग, कुंडली, और 104 सीखने के मॉड्यूल।'
      : 'Dekho Panchang — free Vedic astrology app. Daily Panchang, Kundali, and 104 learning modules.'
  );
  const whatsappUrl = `https://wa.me/?text=${shareText}%20${encodeURIComponent(BASE_URL)}`;

  if (locale === 'hi') {
    return {
      subject: 'आपके परिवार को भी ब्रह्मांडीय मार्गदर्शन मिलना चाहिए',
      html: wrapEmail(card(
        heading('देखो पंचांग को परिवार के साथ साझा करें') +
        p('वैदिक ज्योतिष एक पारिवारिक परंपरा है। जब आपके माता-पिता, भाई-बहन, या दोस्त भी अपनी कुंडली जानते हैं, तो आप एक-दूसरे की दशाओं, ग्रहण प्रभावों, और शुभ मुहूर्तों को बेहतर समझ सकते हैं।') +
        p('WhatsApp पर एक क्लिक से साझा करें — कोई डाउनलोड नहीं, कोई साइनअप आवश्यक नहीं (पहली बार के लिए)।') +
        ctaButton('WhatsApp पर साझा करें', whatsappUrl)
      )),
      text: `देखो पंचांग को परिवार के साथ साझा करें।\n\nWhatsApp: ${whatsappUrl}`,
    };
  }
  return {
    subject: 'Your family deserves cosmic guidance too',
    html: wrapEmail(card(
      heading('Share Dekho Panchang With Family') +
      p('Vedic astrology is a family tradition. When your parents, siblings, or friends also know their charts, you can understand each other\'s dasha periods, eclipse impacts, and auspicious timings together.') +
      p('Share with one tap on WhatsApp — no download required, no signup needed (for first-time visitors).') +
      ctaButton('Share on WhatsApp', whatsappUrl)
    )),
    text: `Share Dekho Panchang with your family.\n\nWhatsApp: ${whatsappUrl}`,
  };
}

/* ═══════════════════════════════════════════════════════════════
   MAIN EXPORT
   ═══════════════════════════════════════════════════════════════ */

const TEMPLATES: Record<Day, (locale: Locale, data?: UserData) => EmailOutput> = {
  1: day1,
  2: day2,
  3: day3,
  4: day4,
  5: day5,
  6: day6,
  7: day7,
};

/**
 * Get the onboarding email for a given day and locale.
 */
export function getOnboardingEmail(
  day: Day,
  locale: Locale,
  userData?: UserData
): EmailOutput {
  const templateFn = TEMPLATES[day];
  return templateFn(locale, userData);
}

/* ═══════════════════════════════════════════════════════════════
   HELPERS
   ═══════════════════════════════════════════════════════════════ */

function ordinalSuffix(n: number): string {
  const s = ['th', 'st', 'nd', 'rd'];
  const v = n % 100;
  return s[(v - 20) % 10] || s[v] || s[0];
}
