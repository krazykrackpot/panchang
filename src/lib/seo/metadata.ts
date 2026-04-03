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

  // ─── More Tools ───────────────────────────────────────────
  '/shraddha': {
    title: { en: 'Shraddha Tithi Calculator', hi: 'श्राद्ध तिथि गणक', sa: 'श्राद्धतिथिगणकम्' },
    description: { en: 'Find the correct Shraddha tithi for your ancestors. Calculate Pitru Paksha dates and annual death anniversary tithis.', hi: 'अपने पूर्वजों की सही श्राद्ध तिथि जानें। पितृ पक्ष तिथियां और वार्षिक पुण्यतिथि।', sa: 'स्वपूर्वजानां सम्यक् श्राद्धतिथिं जानीयात्।' },
    keywords: ['shraddha', 'pitru paksha', 'death anniversary tithi', 'shradh dates'],
  },
  '/vedic-time': {
    title: { en: 'Vedic Time — Ghati, Pala, Muhurta', hi: 'वैदिक समय — घटी, पल, मुहूर्त', sa: 'वैदिकसमयः — घटी पलः मुहूर्तः' },
    description: { en: 'Convert between modern and Vedic time units. Ghati, Pala, Vipala, Prahara, and Muhurta explained with live conversions.', hi: 'आधुनिक और वैदिक समय इकाइयों के बीच रूपांतरण। घटी, पल, विपल, प्रहर और मुहूर्त।', sa: 'आधुनिकवैदिककालमानयोः रूपान्तरणम्।' },
    keywords: ['vedic time', 'ghati', 'pala', 'muhurta', 'hindu time units'],
  },
  '/upagraha': {
    title: { en: 'Upagraha — Shadow Sub-Planets', hi: 'उपग्रह — छाया उप-ग्रह', sa: 'उपग्रहाः — छायोपग्रहाः' },
    description: { en: 'Calculate Upagrahas (shadow sub-planets) including Dhuma, Vyatipata, Parivesha, Indra Chapa, and Upaketu in your chart.', hi: 'अपनी कुण्डली में धूम, व्यतीपात, परिवेश, इन्द्रचाप और उपकेतु की गणना करें।', sa: 'स्वकुण्डल्यां धूमव्यतीपातपरिवेशेन्द्रचापोपकेतूनां गणनां कुर्यात्।' },
    keywords: ['upagraha', 'shadow planets', 'dhuma', 'vyatipata', 'upaketu'],
  },
  '/devotional': {
    title: { en: 'Daily Devotional — Puja Recommendations', hi: 'दैनिक भक्ति — पूजा अनुशंसाएं', sa: 'दैनिकभक्तिः — पूजानुशंसाः' },
    description: { en: 'Personalized daily devotional recommendations based on current Panchang — deity worship, mantras, and rituals for today.', hi: 'वर्तमान पंचांग के आधार पर व्यक्तिगत दैनिक भक्ति अनुशंसाएं।', sa: 'वर्तमानपञ्चाङ्गाधारेण व्यक्तिगतदैनिकभक्त्यनुशंसाः।' },
    keywords: ['daily puja', 'today puja', 'devotional', 'hindu worship'],
  },
  '/puja': {
    title: { en: 'Puja Vidhi — Step-by-Step Hindu Worship Guides', hi: 'पूजा विधि — हिन्दू पूजा मार्गदर्शिका', sa: 'पूजाविधिः — हिन्दूपूजामार्गदर्शिका' },
    description: { en: 'Complete puja vidhi guides with mantras, samagri lists, and procedures for 30+ Hindu festivals, vrats, and graha shanti pujas.', hi: '30+ हिन्दू त्योहारों, व्रतों और ग्रह शान्ति पूजाओं की मन्त्र, सामग्री और विधि सहित पूर्ण मार्गदर्शिका।', sa: '३०+ हिन्दूपर्वाणां व्रतानां ग्रहशान्तिपूजानां च मन्त्रसामग्रीविधिसहितं मार्गदर्शिका।' },
    keywords: ['puja vidhi', 'hindu puja', 'puja mantras', 'puja samagri', 'festival puja'],
  },
  '/sankalpa': {
    title: { en: 'Sankalpa Generator — Sacred Resolution for Puja', hi: 'सङ्कल्प जनक — पूजा के लिए पवित्र सङ्कल्प', sa: 'सङ्कल्पजनकम् — पूजार्थं पवित्रसङ्कल्पः' },
    description: { en: 'Generate personalized Sankalpa text in Devanagari with real Panchang data — Samvatsara, Tithi, Nakshatra, Gotra, and location.', hi: 'वास्तविक पंचांग तिथि, संवत्सर, नक्षत्र, गोत्र सहित व्यक्तिगत सङ्कल्प बनाएं।', sa: 'वास्तविकपञ्चाङ्गदत्तैः सह व्यक्तिगतसङ्कल्पं रचयतु।' },
    keywords: ['sankalpa', 'sankalp generator', 'puja sankalpa', 'sacred resolution'],
  },
  '/prashna-ashtamangala': {
    title: { en: 'Ashtamangala Prashna — Kerala Horary Divination', hi: 'अष्टमंगल प्रश्न — केरल होरारी दैवज्ञ', sa: 'अष्टमङ्गलप्रश्नम् — केरलहोरारीदैवज्ञम्' },
    description: { en: 'Cast an Ashtamangala Prashna chart using the Kerala horary tradition. Pick 3 numbers (1-108) for divination with 8 sacred objects.', hi: 'केरल प्रश्न परम्परा से अष्टमंगल प्रश्न कुण्डली बनाएं।', sa: 'केरलप्रश्नपरम्परया अष्टमङ्गलप्रश्नकुण्डलीं रचयतु।' },
    keywords: ['ashtamangala prashna', 'kerala astrology', 'horary divination'],
  },
  '/kaal-nirnaya': {
    title: { en: 'Kaal Nirnaya — Hindu Time Reckoning', hi: 'काल निर्णय — हिन्दू कालगणना', sa: 'कालनिर्णयः — हिन्दूकालगणना' },
    description: { en: 'Hindu time reckoning system — Kali Ahargana, Vikram Samvat, Shaka Samvat, Julian Day, and astronomical time calculations.', hi: 'कलि अहर्गण, विक्रम संवत्, शक संवत्, जूलियन दिन सहित हिन्दू कालगणना।', sa: 'कल्यहर्गणं विक्रमसंवत् शकसंवत् जूलियनदिनं सहितं हिन्दूकालगणना।' },
    keywords: ['kaal nirnaya', 'vikram samvat', 'hindu calendar', 'kali ahargana'],
  },
  '/nivas-shool': {
    title: { en: 'Nivas Shool — Directional Defect Calculator', hi: 'निवास शूल — दिशा दोष गणक', sa: 'निवासशूलम् — दिशादोषगणकम्' },
    description: { en: 'Check Nivas Shool (directional defect) for construction, travel, and relocation based on the current weekday and Panchang.', hi: 'वर्तमान वार और पंचांग के आधार पर निर्माण, यात्रा और स्थानांतरण के लिए निवास शूल जांचें।', sa: 'वर्तमानवारपञ्चाङ्गाधारेण निर्माणयात्रास्थानान्तराय निवासशूलं परीक्षतु।' },
    keywords: ['nivas shool', 'disha shool', 'directional defect', 'vastu direction'],
  },
  '/muhurat': {
    title: { en: 'Muhurat Calendar — Monthly Auspicious Dates', hi: 'मुहूर्त कैलेंडर — मासिक शुभ तिथियां', sa: 'मुहूर्तपञ्चाङ्गम् — मासिकशुभतिथयः' },
    description: { en: 'Monthly muhurat calendar for marriage, griha pravesh, vehicle purchase, and more. Find the best dates for any activity.', hi: 'विवाह, गृह प्रवेश, वाहन खरीद आदि के लिए मासिक मुहूर्त कैलेंडर।', sa: 'विवाहगृहप्रवेशवाहनक्रयादीनां कृते मासिकमुहूर्तपञ्चाङ्गम्।' },
    keywords: ['muhurat calendar', 'shubh muhurat', 'auspicious dates', 'marriage dates'],
  },
  '/regional': {
    title: { en: 'Regional Hindu Calendars — Tamil, Telugu, Bengali, Gujarati', hi: 'क्षेत्रीय हिन्दू कैलेंडर', sa: 'प्रादेशिकहिन्दूपञ्चाङ्गानि' },
    description: { en: 'Regional Hindu calendar variants — Tamil, Telugu, Bengali, Marathi, Gujarati, Malayalam, and Kannada Panchang.', hi: 'तमिल, तेलुगु, बंगाली, मराठी, गुजराती, मलयालम और कन्नड़ पंचांग।', sa: 'तमिलतेलुगुबङ्गालमराठीगुजरातीमलयालकन्नडपञ्चाङ्गानि।' },
    keywords: ['tamil calendar', 'telugu calendar', 'bengali calendar', 'regional panchang'],
  },
  '/about': {
    title: { en: 'About Dekho Panchang — Vedic Astronomy Made Accessible', hi: 'देखो पंचांग के बारे में', sa: 'देखोपञ्चाङ्गस्य विषये' },
    description: { en: 'Dekho Panchang brings the precision of Vedic astronomical calculations to the modern web. Built with pure mathematics, no external APIs.', hi: 'देखो पंचांग वैदिक खगोलीय गणनाओं की सटीकता को आधुनिक वेब पर लाता है।', sa: 'देखोपञ्चाङ्गं वैदिकखगोलगणनानां सम्यक्तां आधुनिकजालपृष्ठे आनयति।' },
    keywords: ['about dekho panchang', 'vedic astronomy', 'panchang calculator'],
  },
  '/pricing': {
    title: { en: 'Pricing — Dekho Panchang Plans', hi: 'मूल्य — देखो पंचांग योजनाएं', sa: 'मूल्यम् — देखोपञ्चाङ्गयोजनाः' },
    description: { en: 'Choose your plan. Free tier with full Panchang and basic Kundali. Pro and Jyotishi tiers for advanced features.', hi: 'अपनी योजना चुनें। पूर्ण पंचांग और मूल कुण्डली के साथ निःशुल्क स्तर।', sa: 'स्वयोजनां चिनुत। पूर्णपञ्चाङ्गमूलकुण्डल्या सह निःशुल्कस्तरः।' },
    keywords: ['dekho panchang pricing', 'vedic astrology plans'],
  },

  // ─── Panchang Deep Dives ─────────────────────────────────
  '/panchang/yoga': {
    title: { en: '27 Yogas — Sun-Moon Combinations in Panchang', hi: '27 योग — पंचांग में सूर्य-चन्द्र संयोजन', sa: '२७ योगाः — पञ्चाङ्गे सूर्यचन्द्रसंयोजनानि' },
    description: { en: 'Complete guide to the 27 Panchang Yogas formed by the sum of Sun and Moon longitudes. Auspicious and inauspicious yogas.', hi: 'सूर्य और चन्द्र देशान्तरों के योग से बने 27 पंचांग योगों का पूर्ण मार्गदर्शन।', sa: 'सूर्यचन्द्रदेशान्तरयोगेन निर्मिता २७ पञ्चाङ्गयोगानां सम्पूर्णमार्गदर्शनम्।' },
    keywords: ['panchang yoga', '27 yogas', 'vishkambha', 'siddhi yoga'],
  },
  '/panchang/karana': {
    title: { en: '11 Karanas — Half-Tithis in Vedic Calendar', hi: '11 करण — वैदिक कैलेंडर में अर्ध-तिथि', sa: '११ करणानि — वैदिकपञ्चाङ्गे अर्धतिथयः' },
    description: { en: 'All 11 Karanas explained — 7 Chara and 4 Sthira. Vishti (Bhadra) Karana effects and timing.', hi: 'सभी 11 करणों की व्याख्या — 7 चर और 4 स्थिर। विष्टि (भद्रा) करण।', sa: 'सर्वेषां ११ करणानां व्याख्या — ७ चराणि ४ स्थिराणि च।' },
    keywords: ['karana', 'half tithi', 'vishti bhadra', 'chara karana'],
  },
  '/panchang/grahan': {
    title: { en: 'Grahan — Eclipses in Hindu Astronomy', hi: 'ग्रहण — हिन्दू खगोलशास्त्र में', sa: 'ग्रहणम् — हिन्दूखगोलशास्त्रे' },
    description: { en: 'Solar and lunar eclipses from a Vedic perspective. Sutak timing, do\'s and don\'ts, and spiritual significance.', hi: 'वैदिक दृष्टिकोण से सूर्य और चन्द्र ग्रहण। सूतक समय, करने और न करने योग्य कार्य।', sa: 'वैदिकदृष्टिकोणेन सूर्यचन्द्रग्रहणम्।' },
    keywords: ['grahan', 'eclipse hindu', 'sutak', 'eclipse puja'],
  },
  '/panchang/rashi': {
    title: { en: '12 Rashis — Vedic Zodiac Signs', hi: '12 राशियाँ — वैदिक राशिचक्र', sa: '१२ राशयः — वैदिकराशिचक्रम्' },
    description: { en: 'All 12 Vedic Rashis (zodiac signs) with rulers, elements, qualities, and significations.', hi: 'स्वामी, तत्व, गुण और संकेतों के साथ सभी 12 वैदिक राशियाँ।', sa: 'स्वामिभिः तत्त्वैः गुणैः सङ्केतैश्च सह सर्वाः १२ वैदिकराशयः।' },
    keywords: ['rashi', 'vedic zodiac', '12 signs', 'zodiac signs vedic'],
  },
  '/panchang/masa': {
    title: { en: 'Hindu Months (Masa) — Lunar Calendar System', hi: 'हिन्दू मास — चान्द्र कैलेंडर', sa: 'हिन्दूमासाः — चान्द्रपञ्चाङ्गम्' },
    description: { en: 'Hindu lunar months from Chaitra to Phalguna. Amanta vs Purnimant systems, Adhika Masa, and seasonal mapping.', hi: 'चैत्र से फाल्गुन तक हिन्दू चान्द्र मास। अमान्त बनाम पूर्णिमान्त, अधिक मास।', sa: 'चैत्रात् फाल्गुनपर्यन्तं हिन्दूचान्द्रमासाः।' },
    keywords: ['hindu months', 'masa', 'lunar month', 'amanta purnimant'],
  },
  '/panchang/samvatsara': {
    title: { en: '60 Samvatsaras — Jupiter Cycle in Vedic Calendar', hi: '60 संवत्सर — बृहस्पति चक्र', sa: '६० संवत्सराः — बृहस्पतिचक्रम्' },
    description: { en: 'The 60 Samvatsara names from Prabhava to Akshaya. Jupiter\'s 60-year cycle and its significance in Vedic timekeeping.', hi: 'प्रभव से अक्षय तक 60 संवत्सर। बृहस्पति का 60 वर्षीय चक्र।', sa: 'प्रभवात् अक्षयपर्यन्तं ६० संवत्सराः। बृहस्पतेः ६० वर्षीयचक्रम्।' },
    keywords: ['samvatsara', '60 year cycle', 'jupiter cycle', 'vikram samvat'],
  },
  '/panchang/muhurta': {
    title: { en: '30 Muhurtas — Time Divisions in Hindu Day', hi: '30 मुहूर्त — हिन्दू दिन के समय विभाग', sa: '३० मुहूर्ताः — हिन्दूदिनस्य कालविभागाः' },
    description: { en: 'The 30 Muhurtas (48-minute time divisions) of the Hindu day. Abhijit and Brahma Muhurta, auspicious and inauspicious periods.', hi: 'हिन्दू दिन के 30 मुहूर्त (48 मिनट)। अभिजित और ब्रह्म मुहूर्त।', sa: 'हिन्दूदिनस्य ३० मुहूर्ताः। अभिजित् ब्रह्ममुहूर्तश्च।' },
    keywords: ['muhurta', 'abhijit muhurta', 'brahma muhurta', '30 muhurtas'],
  },
  '/panchang/yearly': {
    title: { en: 'Yearly Panchang Calendar — Month by Month View', hi: 'वार्षिक पंचांग — मासिक दृश्य', sa: 'वार्षिकपञ्चाङ्गम् — मासिकदृश्यम्' },
    description: { en: 'Complete yearly Panchang calendar with daily Tithi, Nakshatra, and festivals for every month.', hi: 'प्रत्येक मास की दैनिक तिथि, नक्षत्र और त्योहारों के साथ पूर्ण वार्षिक पंचांग।', sa: 'प्रत्येकमासस्य दैनिकतिथिनक्षत्रपर्वभिः सह सम्पूर्णं वार्षिकपञ्चाङ्गम्।' },
    keywords: ['yearly panchang', 'annual calendar', 'monthly panchang', 'panchang 2026'],
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
