/**
 * Centralized SEO metadata for all pages.
 * Used by per-route generateMetadata functions.
 */

import type { Metadata } from 'next';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.dekhopanchang.com';

interface PageMeta {
  title: { en: string; hi: string; sa: string };
  description: { en: string; hi: string; sa: string };
  keywords?: string[];
}

export const PAGE_META: Record<string, PageMeta> = {
  // ─── Core ─────────────────────────────────────────────────
  '/panchang': {
    title: {
      en: 'Daily Panchang — Tithi, Nakshatra, Yoga, Karana Today',
      hi: 'आज का पंचांग — तिथि, नक्षत्र, योग, करण',
      sa: 'दैनिकपञ्चाङ्गम् — तिथिः नक्षत्रं योगः करणम्',
    },
    description: {
      en: 'Accurate daily Panchang with Tithi, Nakshatra, Yoga, Karana, Rahu Kalam, sunrise/sunset for any location worldwide. Verified against Drik Panchang.',
      hi: 'विश्व भर में किसी भी स्थान के लिए सटीक दैनिक पंचांग — तिथि, नक्षत्र, योग, करण, राहु काल, सूर्योदय/सूर्यास्त।',
      sa: 'विश्वस्य कस्यापि स्थानस्य कृते सम्यक् दैनिकपञ्चाङ्गम् — तिथिः नक्षत्रं योगः करणम्।',
    },
    keywords: ['panchang today', 'daily panchang', 'tithi today', 'nakshatra today', 'rahu kalam', 'hindu calendar'],
  },
  '/kundali': {
    title: {
      en: 'Free Kundali — Vedic Birth Chart Generator',
      hi: 'निःशुल्क कुण्डली — वैदिक जन्म कुण्डली',
      sa: 'निःशुल्कजन्मकुण्डली — वैदिकजन्मपत्रिका',
    },
    description: {
      en: 'Generate your free Vedic birth chart (Kundali) with planet positions, Vimshottari Dasha, Yogas, Shadbala, and detailed Tippanni commentary.',
      hi: 'ग्रह स्थिति, विंशोत्तरी दशा, योग, षड्बल और विस्तृत टिप्पणी के साथ अपनी निःशुल्क वैदिक जन्म कुण्डली बनाएं।',
      sa: 'ग्रहस्थितिः विंशोत्तरीदशा योगाः षड्बलं विस्तृतटिप्पणी च सहितं निःशुल्कं वैदिकजन्मकुण्डलीं रचयतु।',
    },
    keywords: ['kundali', 'birth chart', 'janam kundli', 'vedic astrology chart', 'free kundali'],
  },
  '/matching': {
    title: {
      en: 'Kundali Matching — Ashta Kuta Guna Milan',
      hi: 'कुण्डली मिलान — अष्ट कूट गुण मिलान',
      sa: 'कुण्डलीमेलनम् — अष्टकूटगुणमेलनम्',
    },
    description: {
      en: 'Free Kundali matching with 36-point Ashta Kuta Guna Milan system. Check horoscope compatibility for marriage with Nadi Dosha analysis.',
      hi: '36 अंकों वाली अष्ट कूट गुण मिलान प्रणाली से निःशुल्क कुण्डली मिलान। नाड़ी दोष विश्लेषण सहित।',
      sa: 'षट्त्रिंशदङ्काभिः अष्टकूटगुणमेलनप्रणाल्या निःशुल्कं कुण्डलीमेलनम्।',
    },
    keywords: ['kundali matching', 'guna milan', 'horoscope matching', 'marriage compatibility'],
  },
  '/calendar': {
    title: {
      en: 'Hindu Festival Calendar 2026 — Vrat, Ekadashi, Purnima',
      hi: 'हिन्दू त्योहार कैलेंडर 2026 — व्रत, एकादशी, पूर्णिमा',
      sa: 'हिन्दूपर्वपञ्चाङ्गम् २०२६ — व्रतम् एकादशी पूर्णिमा',
    },
    description: {
      en: 'Complete Hindu festival calendar with 180+ festivals, vrats, Ekadashi, Purnima, Amavasya dates. Amanta and Purnimant systems. Location-aware.',
      hi: '180+ त्योहार, व्रत, एकादशी, पूर्णिमा, अमावस्या तिथियों के साथ पूर्ण हिन्दू त्योहार कैलेंडर।',
      sa: '१८०+ पर्वाणि व्रतानि एकादशी पूर्णिमा अमावस्या तिथिभिः सह सम्पूर्णं हिन्दूपर्वपञ्चाङ्गम्।',
    },
    keywords: ['hindu calendar', 'festival calendar 2026', 'ekadashi dates', 'purnima dates', 'vrat calendar'],
  },

  // ─── Tools ────────────────────────────────────────────────
  '/varshaphal': {
    title: {
      en: 'Varshaphal — Annual Horoscope (Tajika System)',
      hi: 'वर्षफल — वार्षिक कुण्डली (ताजिक प्रणाली)',
      sa: 'वर्षफलम् — वार्षिककुण्डली (ताजिकपद्धतिः)',
    },
    description: {
      en: 'Generate your Varshaphal (annual horoscope) using the Tajika system. Solar return chart, Muntha, Sahams, Varsheshvara, and Mudda Dasha analysis.',
      hi: 'ताजिक प्रणाली से अपना वर्षफल बनाएं। सौर प्रत्यावर्तन चार्ट, मुन्था, साहम, वर्षेश्वर और मुद्दा दशा।',
      sa: 'ताजिकपद्धत्या वर्षफलं रचयतु। सौरप्रत्यावर्तनचक्रं मुन्था साहमाः वर्षेश्वरः मुद्दादशा च।',
    },
    keywords: ['varshaphal', 'annual horoscope', 'tajika', 'solar return', 'yearly prediction'],
  },
  '/kp-system': {
    title: {
      en: 'KP System — Krishnamurti Paddhati Chart',
      hi: 'केपी प्रणाली — कृष्णमूर्ति पद्धति',
      sa: 'केपीपद्धतिः — कृष्णमूर्तिपद्धतिः',
    },
    description: {
      en: 'Generate KP (Krishnamurti Paddhati) chart with Placidus houses, 249 sub-lord table, significators, and ruling planets for precise predictions.',
      hi: 'प्लेसिडस भाव, 249 उप-स्वामी तालिका, कारक और शासक ग्रहों के साथ केपी चार्ट बनाएं।',
      sa: 'प्लेसिडसभावैः २४९ उपस्वामिसारण्या कारकैः शासकग्रहैश्च सह केपीचक्रं रचयतु।',
    },
    keywords: ['kp system', 'krishnamurti paddhati', 'sub lord', 'placidus houses', 'kp astrology'],
  },
  '/sign-calculator': {
    title: {
      en: 'Sun & Moon Sign Calculator — Find Your Rashi',
      hi: 'सूर्य और चन्द्र राशि गणक — अपनी राशि जानें',
      sa: 'सूर्यचन्द्रराशिगणकम् — स्वराशिं जानीयात्',
    },
    description: {
      en: 'Calculate your Vedic Sun sign (Surya Rashi), Moon sign (Chandra Rashi), and birth Nakshatra instantly. Free and accurate.',
      hi: 'अपनी वैदिक सूर्य राशि, चन्द्र राशि और जन्म नक्षत्र तुरंत जानें। निःशुल्क और सटीक।',
      sa: 'स्वस्य वैदिकसूर्यराशिं चन्द्रराशिं जन्मनक्षत्रं च शीघ्रं जानीयात्।',
    },
    keywords: ['moon sign calculator', 'rashi calculator', 'sun sign vedic', 'nakshatra finder'],
  },
  '/sade-sati': {
    title: {
      en: 'Sade Sati Calculator — Saturn Transit Analysis',
      hi: 'साढ़े साती गणक — शनि गोचर विश्लेषण',
      sa: 'साडेसातिगणकम् — शनिगोचरविश्लेषणम्',
    },
    description: {
      en: 'Check if Sade Sati (Saturn\'s 7.5-year transit) is active for your Moon sign. Phase analysis, start/end dates, and remedies.',
      hi: 'जानें कि क्या आपकी चन्द्र राशि पर साढ़े साती सक्रिय है। चरण विश्लेषण, तिथियां और उपाय।',
      sa: 'स्वचन्द्रराश्यां साडेसातिः सक्रिया किं वेति जानीयात्। चरणविश्लेषणं तिथयः उपायाश्च।',
    },
    keywords: ['sade sati', 'saturn transit', 'shani sade sati', 'sade sati calculator'],
  },
  '/muhurta-ai': {
    title: {
      en: 'Muhurta AI — Find Auspicious Times for Any Activity',
      hi: 'मुहूर्त AI — किसी भी कार्य के लिए शुभ समय खोजें',
      sa: 'मुहूर्तकृत्रिमबुद्धिः — कस्यापि कार्यस्य शुभसमयं अन्विष्यतु',
    },
    description: {
      en: 'AI-powered muhurta finder that scores time windows 0-100 for marriage, travel, business, and 20+ activities using multi-factor Panchang analysis.',
      hi: 'विवाह, यात्रा, व्यापार और 20+ गतिविधियों के लिए AI-संचालित मुहूर्त खोजक।',
      sa: 'विवाहयात्राव्यापाराणां विंशत्यधिककार्याणां च कृते AI-संचालितमुहूर्तान्वेषकम्।',
    },
    keywords: ['muhurta', 'auspicious time', 'shubh muhurat', 'marriage muhurat', 'muhurta finder'],
  },
  '/baby-names': {
    title: {
      en: 'Baby Names by Nakshatra — Vedic Name Finder',
      hi: 'नक्षत्र के अनुसार बच्चे का नाम — वैदिक नाम खोजक',
      sa: 'नक्षत्रानुसारं शिशुनाम — वैदिकनामान्वेषकम्',
    },
    description: {
      en: 'Find the perfect baby name based on birth Nakshatra syllables. Traditional Vedic naming with Sanskrit meanings and auspicious letters.',
      hi: 'जन्म नक्षत्र अक्षरों के आधार पर अपने बच्चे के लिए सही नाम खोजें।',
      sa: 'जन्मनक्षत्राक्षराणामाधारेण शिशोः सम्यक् नाम अन्विष्यतु।',
    },
    keywords: ['baby names by nakshatra', 'vedic baby names', 'hindu baby names', 'nakshatra names'],
  },
  '/prashna': {
    title: {
      en: 'Prashna Kundali — Vedic Horary Astrology',
      hi: 'प्रश्न कुण्डली — वैदिक प्रश्न ज्योतिष',
      sa: 'प्रश्नकुण्डली — वैदिकप्रश्नज्योतिषम्',
    },
    description: {
      en: 'Cast a Prashna (horary) chart for immediate answers. Vedic horary astrology based on the exact moment of your question.',
      hi: 'तत्काल उत्तर के लिए प्रश्न कुण्डली बनाएं। आपके प्रश्न के सटीक क्षण पर आधारित।',
      sa: 'तात्कालिकोत्तराय प्रश्नकुण्डलीं रचयतु। प्रश्नस्य सम्यक्क्षणमाधृत्य।',
    },
    keywords: ['prashna kundali', 'horary astrology', 'prashna chart', 'question astrology'],
  },
  '/horoscope': {
    title: {
      en: 'Daily Horoscope — Based on Real Planetary Transits',
      hi: 'आज का राशिफल — वास्तविक ग्रह गोचर पर आधारित',
      sa: 'दैनिकराशिफलम् — वास्तविकग्रहगोचराधारितम्',
    },
    description: {
      en: 'Today\'s horoscope based on actual planetary transits, not generic predictions. Personalized for your Moon sign with transit analysis.',
      hi: 'वास्तविक ग्रह गोचर पर आधारित आज का राशिफल। आपकी चन्द्र राशि के लिए व्यक्तिगत।',
      sa: 'वास्तविकग्रहगोचराधारितं दैनिकराशिफलम्। भवतः चन्द्रराशये व्यक्तिगतम्।',
    },
    keywords: ['daily horoscope', 'rashifal today', 'horoscope today', 'transit horoscope'],
  },
  '/eclipses': {
    title: {
      en: 'Solar & Lunar Eclipse Calendar 2026',
      hi: 'सूर्य और चन्द्र ग्रहण कैलेंडर 2026',
      sa: 'सूर्यचन्द्रग्रहणपञ्चाङ्गम् २०२६',
    },
    description: {
      en: 'Complete solar and lunar eclipse calendar with dates, timings, visibility, and Sutak periods. Grahan times for your location.',
      hi: 'तिथियों, समय, दृश्यता और सूतक अवधि के साथ पूर्ण सूर्य और चन्द्र ग्रहण कैलेंडर।',
      sa: 'तिथिभिः समयेन दृश्यतया सूतककालेन च सह सम्पूर्णं सूर्यचन्द्रग्रहणपञ्चाङ्गम्।',
    },
    keywords: ['eclipse 2026', 'solar eclipse', 'lunar eclipse', 'grahan', 'sutak time'],
  },
  '/transits': {
    title: {
      en: 'Planet Transits (Gochar) — Live Planetary Positions',
      hi: 'ग्रह गोचर — वर्तमान ग्रह स्थिति',
      sa: 'ग्रहगोचरम् — वर्तमानग्रहस्थितिः',
    },
    description: {
      en: 'Live planetary transit positions with sign ingress dates, retrograde periods, and transit effects for all 9 Vedic planets.',
      hi: 'सभी 9 वैदिक ग्रहों की वर्तमान गोचर स्थिति, राशि प्रवेश तिथियां और वक्री अवधि।',
      sa: 'सर्वेषां ९ वैदिकग्रहाणां वर्तमानगोचरस्थितिः राशिप्रवेशतिथयः वक्रीकालाश्च।',
    },
    keywords: ['planet transit', 'gochar', 'planetary positions today', 'rashi transit'],
  },
  '/retrograde': {
    title: {
      en: 'Retrograde Calendar 2026 — Mercury, Venus, Mars, Jupiter, Saturn',
      hi: 'वक्री ग्रह कैलेंडर 2026',
      sa: 'वक्रीग्रहपञ्चाङ्गम् २०२६',
    },
    description: {
      en: 'Complete retrograde calendar for 2026. Mercury retrograde dates, Venus retrograde, Mars retrograde periods with effects and remedies.',
      hi: '2026 का पूर्ण वक्री ग्रह कैलेंडर। बुध, शुक्र, मंगल वक्री तिथियां, प्रभाव और उपाय।',
      sa: '२०२६ वर्षस्य सम्पूर्णं वक्रीग्रहपञ्चाङ्गम्।',
    },
    keywords: ['retrograde 2026', 'mercury retrograde', 'vakri graha', 'retrograde calendar'],
  },

  // ─── Deep dives ───────────────────────────────────────────
  '/panchang/tithi': {
    title: {
      en: 'Tithi — The Lunar Day in Vedic Astrology',
      hi: 'तिथि — वैदिक ज्योतिष में चान्द्र दिवस',
      sa: 'तिथिः — वैदिकज्योतिषे चान्द्रदिवसः',
    },
    description: {
      en: 'Complete guide to all 30 Tithis in the Hindu Panchang. Shukla and Krishna Paksha, Purnima, Amavasya, and their spiritual significance.',
      hi: 'हिन्दू पंचांग की सभी 30 तिथियों का पूर्ण मार्गदर्शिका। शुक्ल और कृष्ण पक्ष, पूर्णिमा, अमावस्या।',
      sa: 'हिन्दूपञ्चाङ्गस्य सर्वासां ३० तिथीनां सम्पूर्णमार्गदर्शिका।',
    },
    keywords: ['tithi', 'lunar day', 'shukla paksha', 'krishna paksha', 'purnima', 'amavasya'],
  },
  '/panchang/nakshatra': {
    title: {
      en: '27 Nakshatras — Lunar Mansions in Vedic Astrology',
      hi: '27 नक्षत्र — वैदिक ज्योतिष में चन्द्र भवन',
      sa: '२७ नक्षत्राणि — वैदिकज्योतिषे चन्द्रभवनानि',
    },
    description: {
      en: 'Explore all 27 Nakshatras with deities, ruling planets, symbols, padas, and personality traits. The foundation of Vedic astrology.',
      hi: 'देवता, स्वामी ग्रह, प्रतीक, पद और व्यक्तित्व लक्षणों के साथ सभी 27 नक्षत्रों को जानें।',
      sa: 'देवताभिः स्वामिग्रहैः प्रतीकैः पदैः व्यक्तित्वलक्षणैश्च सह सर्वाणि २७ नक्षत्राणि अवगच्छतु।',
    },
    keywords: ['nakshatra', 'lunar mansion', '27 nakshatras', 'birth star', 'janma nakshatra'],
  },

  // ─── Learn ────────────────────────────────────────────────
  '/learn': {
    title: {
      en: 'Learn Vedic Astrology (Jyotish) — Free Course',
      hi: 'वैदिक ज्योतिष सीखें — निःशुल्क पाठ्यक्रम',
      sa: 'वैदिकज्योतिषं शिक्षतु — निःशुल्कपाठ्यक्रमः',
    },
    description: {
      en: 'Free comprehensive course on Vedic astrology (Jyotish). Learn Grahas, Rashis, Nakshatras, Tithis, Yogas, Kundali reading, and more.',
      hi: 'वैदिक ज्योतिष का निःशुल्क पूर्ण पाठ्यक्रम। ग्रह, राशि, नक्षत्र, तिथि, योग, कुण्डली पढ़ना सीखें।',
      sa: 'वैदिकज्योतिषस्य निःशुल्कः सम्पूर्णपाठ्यक्रमः। ग्रहान् राशीन् नक्षत्राणि तिथीन् योगान् कुण्डलीपठनं च शिक्षतु।',
    },
    keywords: ['learn vedic astrology', 'jyotish course', 'astrology tutorial', 'free astrology course'],
  },
};

/**
 * Generate metadata for a page route.
 * Falls back to layout metadata if route not found.
 */
export function getPageMetadata(route: string, locale: string): Metadata {
  const meta = PAGE_META[route];
  if (!meta) return {};

  const loc = locale as 'en' | 'hi' | 'sa';
  const title = meta.title[loc] || meta.title.en;
  const description = meta.description[loc] || meta.description.en;
  const url = `${BASE_URL}/${locale}${route}`;

  return {
    title,
    description,
    keywords: meta.keywords,
    alternates: {
      canonical: url,
      languages: {
        en: `${BASE_URL}/en${route}`,
        hi: `${BASE_URL}/hi${route}`,
        sa: `${BASE_URL}/sa${route}`,
      },
    },
    openGraph: {
      title,
      description,
      url,
      siteName: 'Dekho Panchang',
      locale: loc === 'hi' ? 'hi_IN' : loc === 'sa' ? 'sa_IN' : 'en_US',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
  };
}
