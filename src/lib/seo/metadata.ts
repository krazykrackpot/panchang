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
  // ─── Interactive Labs ─────────────────────────────────────
  '/learn/labs/panchang': {
    title: { en: 'Interactive Lab: Compute Your Panchang Step by Step', hi: 'इंटरैक्टिव लैब: अपना पंचांग चरणबद्ध गणना करें', sa: 'अन्तरक्रियात्मकप्रयोगशाला: पञ्चाङ्गं क्रमशः गणयतु' },
    description: { en: 'Enter a date and location — watch the engine compute Julian Day, Sun/Moon positions, Tithi, Nakshatra, Yoga, Karana, and Vara with intermediate values.', hi: 'तिथि और स्थान दर्ज करें — इंजन को जूलियन दिन, सूर्य/चन्द्र स्थिति, तिथि, नक्षत्र, योग, करण और वार गणना करते देखें।', sa: 'दिनाङ्कं स्थानं च दत्तवान् — यन्त्रस्य गणनां पश्यतु।' },
    keywords: ['panchang calculator', 'tithi calculation', 'interactive astrology', 'vedic astronomy lab'],
  },
  '/learn/labs/moon': {
    title: { en: 'Interactive Lab: Trace the Moon — 60 Sine Terms', hi: 'इंटरैक्टिव लैब: चन्द्र खोज — 60 ज्या पद', sa: 'अन्तरक्रियात्मकप्रयोगशाला: चन्द्रान्वेषणम्' },
    description: { en: 'Trace how the Meeus algorithm finds the Moon using 60 sine terms. See fundamental arguments, individual term contributions, and final longitude.', hi: 'देखें कि Meeus एल्गोरिथ्म 60 ज्या पदों से चन्द्रमा को कैसे खोजता है।', sa: 'Meeus गणितेन ६० ज्यापदैः चन्द्रं कथम् अन्विष्यति इति पश्यतु।' },
    keywords: ['moon position calculator', 'meeus algorithm', 'lunar longitude', 'astronomical computation'],
  },
  '/learn/labs/dasha': {
    title: { en: 'Interactive Lab: Your Vimshottari Dasha Timeline', hi: 'इंटरैक्टिव लैब: आपकी विंशोत्तरी दशा समयरेखा', sa: 'अन्तरक्रियात्मकप्रयोगशाला: विंशोत्तरीदशासमयरेखा' },
    description: { en: 'Enter birth details to generate your 120-year Vimshottari Dasha timeline. See Moon nakshatra, starting planet, balance calculation, and colored timeline.', hi: 'जन्म विवरण दर्ज करें और अपनी 120 वर्षीय दशा समयरेखा बनाएं।', sa: 'जन्मविवरणं दत्तवान् स्वस्य १२० वर्षीयदशासमयरेखां रचयतु।' },
    keywords: ['dasha calculator', 'vimshottari dasha', 'planetary periods', 'dasha timeline'],
  },
  '/learn/labs/shadbala': {
    title: { en: 'Interactive Lab: Shadbala — 6-Fold Planetary Strength', hi: 'इंटरैक्टिव लैब: षड्बल विश्लेषण', sa: 'अन्तरक्रियात्मकप्रयोगशाला: षड्बलविश्लेषणम्' },
    description: { en: 'Generate your birth chart and see all 6 strengths per planet — Sthana, Dig, Kala, Cheshta, Naisargika, Drig. Find your chart captain.', hi: 'अपनी जन्म कुण्डली बनाएं और प्रत्येक ग्रह की 6 शक्तियाँ देखें।', sa: 'स्वजन्मकुण्डलीं रचयतु प्रतिग्रहस्य ६ शक्तीः पश्यतु।' },
    keywords: ['shadbala calculator', 'planetary strength', 'vedic astrology strength', 'chart analysis'],
  },
  '/learn/labs/kp': {
    title: { en: 'Interactive Lab: KP Sub-Lord Lookup', hi: 'इंटरैक्टिव लैब: केपी उप-स्वामी खोज', sa: 'अन्तरक्रियात्मकप्रयोगशाला: केपी उपस्वामिखोजः' },
    description: { en: 'Enter any degree (0-360) and see the Sign Lord, Star Lord, and Sub Lord hierarchy with 249 sub-division table and visual ring.', hi: 'कोई भी अंश (0-360) दर्ज करें और राशि स्वामी, नक्षत्र स्वामी और उप-स्वामी देखें।', sa: 'कमपि अंशं (०-३६०) दत्तवान् राशिस्वामिनं नक्षत्रस्वामिनम् उपस्वामिनं च पश्यतु।' },
    keywords: ['kp sub lord', 'krishnamurti paddhati', '249 sub lords', 'kp astrology calculator'],
  },

  // ─── Cosmology Heritage ──────────────────────────────────
  '/learn/vedanga': {
    title: { en: 'Vedanga Jyotisha & Indian Astronomy Heritage', hi: 'वेदांग ज्योतिष एवं भारतीय खगोलशास्त्र विरासत', sa: 'वेदाङ्गज्योतिषम् भारतीयखगोलशास्त्रपरम्परा च' },
    description: { en: 'The oldest astronomical text, great Indian astronomers (Aryabhata, Varahamihira, Brahmagupta, Madhava), and what India knew centuries before the West.', hi: 'सबसे प्राचीन खगोलशास्त्र ग्रन्थ, महान भारतीय खगोलशास्त्री, और भारत ने पश्चिम से सदियों पहले क्या जाना।', sa: 'प्राचीनतमं खगोलशास्त्रं महान्तः भारतीयखगोलशास्त्रिणः पश्चिमात् शताब्दीभिः पूर्वं भारतः किमजानात्।' },
    keywords: ['vedanga jyotisha', 'aryabhata', 'indian astronomy', 'brahmagupta zero', 'madhava calculus'],
  },
  '/learn/observatories': {
    title: { en: 'Jantar Mantar — India\'s Stone Astronomical Observatories', hi: 'जन्तर मन्तर — भारत की पत्थर वेधशालाएं', sa: 'जन्तरमन्तरम् — भारतस्य प्रस्तरवेधशालाः' },
    description: { en: 'Maharaja Jai Singh\'s 5 stone observatories: Samrat Yantra (27m sundial), Jai Prakash, Rashivalaya. 2-arcsecond accuracy without telescopes. UNESCO World Heritage.', hi: 'महाराजा जयसिंह की 5 पत्थर वेधशालाएं: सम्राट यंत्र, जयप्रकाश, राशिवलय। बिना दूरबीन 2 आर्कसेकण्ड सटीकता।', sa: 'महाराजजयसिंहस्य ५ प्रस्तरवेधशालाः। दूरदर्शिनं विना २ चापकलासम्यक्ता।' },
    keywords: ['jantar mantar', 'jai singh observatory', 'samrat yantra', 'indian observatory', 'stone instruments'],
  },

  '/learn/planetary-cycles': {
    title: { en: 'Planetary Orbital Periods — Surya Siddhanta vs NASA', hi: 'ग्रह कक्षीय काल — सूर्य सिद्धान्त बनाम NASA', sa: 'ग्रहकक्षीयकालाः — सूर्यसिद्धान्तः NASA च' },
    description: { en: 'How ancient Indians knew planetary orbits: Saturn 29.5yr (Sade Sati = quarter orbit), Jupiter 12yr (sign/year), Moon 27.3d (27 Nakshatras). Surya Siddhanta vs NASA comparison.', hi: 'प्राचीन भारतीयों ने ग्रह कक्षाएं कैसे जानीं: शनि 29.5 वर्ष, बृहस्पति 12 वर्ष, चन्द्र 27.3 दिन।', sa: 'प्राचीनभारतीयाः ग्रहकक्षाः कथम् अजानन्।' },
    keywords: ['planetary orbits vedic', 'surya siddhanta accuracy', 'sade sati orbital', 'ancient indian astronomy'],
  },

  // ─── Learning Tracks ─────────────────────────────────────
  '/learn/track/cosmology': {
    title: { en: 'Hindu Cosmology & Foundations — Complete Learning Track', hi: 'हिन्दू ब्रह्माण्ड विज्ञान — सम्पूर्ण पाठ्यक्रम', sa: 'हिन्दूब्रह्माण्डविज्ञानम् — सम्पूर्णपाठ्यक्रमः' },
    description: { en: 'Learn the Hindu worldview: cosmic time scales, Navagraha, 12 Rashis, 27 Nakshatras, Ayanamsha, and the mathematical framework of Jyotish. 30+ modules.', hi: 'हिन्दू विश्वदृष्टि सीखें: ब्रह्माण्डीय समय, नवग्रह, 12 राशि, 27 नक्षत्र, अयनांश।', sa: 'हिन्दूविश्वदृष्टिं शिक्षतु।' },
    keywords: ['hindu cosmology course', 'vedic astronomy', 'navagraha', 'rashis', 'nakshatras'],
  },
  '/learn/track/panchang': {
    title: { en: 'Panchang — Learn the Daily Cosmic Calendar', hi: 'पंचांग — दैनिक ब्रह्माण्डीय कैलेंडर सीखें', sa: 'पञ्चाङ्गम् — दैनिकब्रह्माण्डपञ्चाङ्गं शिक्षतु' },
    description: { en: 'Master the Hindu Panchang: Tithi, Nakshatra, Yoga, Karana, Vara, Muhurta, Hora, festivals, and calendar systems. 15+ modules.', hi: 'हिन्दू पंचांग में दक्षता: तिथि, नक्षत्र, योग, करण, वार, मुहूर्त, होरा।', sa: 'हिन्दूपञ्चाङ्गे दक्षता।' },
    keywords: ['panchang course', 'tithi', 'muhurta', 'hindu calendar', 'vedic timekeeping'],
  },
  '/learn/track/kundali': {
    title: { en: 'Kundali — Learn Birth Chart Reading from Basics to Advanced', hi: 'कुण्डली — जन्म कुण्डली पठन सीखें', sa: 'कुण्डली — जन्मकुण्डलीपठनं शिक्षतु' },
    description: { en: 'Complete Kundali course: houses, dashas, yogas, Shadbala, predictions, matching, remedies, Jaimini, KP system. 45+ modules, 5 interactive labs.', hi: 'सम्पूर्ण कुण्डली पाठ्यक्रम: भाव, दशा, योग, षड्बल, भविष्यवाणी, मिलान, उपाय।', sa: 'सम्पूर्णकुण्डलीपाठ्यक्रमः।' },
    keywords: ['kundali course', 'birth chart reading', 'vedic astrology course', 'jyotish learning'],
  },

  // ─── Cosmology ───────────────────────────────────────────
  '/learn/cosmology': {
    title: { en: 'Hindu Cosmology — Yugas, Kalpas, Brahma\'s 311 Trillion Year Lifespan', hi: 'हिन्दू ब्रह्माण्ड विज्ञान — युग, कल्प, ब्रह्मा का 311 ट्रिलियन वर्ष जीवनकाल', sa: 'हिन्दूब्रह्माण्डविज्ञानम् — युगाः कल्पाः ब्रह्मणः 311 लक्षकोटिवर्षायुः' },
    description: { en: 'From Truti (29.6μs) to Brahma\'s lifespan (311 trillion years). The only ancient civilization to think in billions of years — matching modern cosmology. Yugas, Manvantaras, Kalpas explained.', hi: 'त्रुटि (29.6μs) से ब्रह्मा के जीवनकाल (311 ट्रिलियन वर्ष) तक। अरबों वर्षों में सोचने वाली एकमात्र प्राचीन सभ्यता।', sa: 'त्रुटितः (29.6μs) ब्रह्मायुः (311 लक्षकोटिवर्षाणि) पर्यन्तम्।' },
    keywords: ['hindu cosmology', 'yugas', 'kalpa', 'manvantara', 'brahma lifespan', 'vedic time', 'kali yuga'],
  },

  // ─── Prediction Guides ────────────────────────────────────
  '/learn/career': {
    title: { en: 'Career Prediction — 10th House, D10 & Amatyakaraka Guide', hi: 'कैरियर भविष्यवाणी — 10वां भाव, D10 एवं अमात्यकारक', sa: 'व्यवसायभविष्यवाणी' },
    description: { en: 'Predict career from your Vedic chart: 10th house sign, lord placement, D10 Dasamsha, Amatyakaraka, and career timing through dashas and transits.', hi: 'वैदिक कुण्डली से कैरियर भविष्यवाणी: 10वां भाव, स्वामी, D10, अमात्यकारक, दशा-गोचर।', sa: 'वैदिककुण्डल्या व्यवसायभविष्यवाणी।' },
    keywords: ['career astrology', '10th house', 'dasamsha', 'vedic career prediction'],
  },
  '/learn/marriage': {
    title: { en: 'Marriage Prediction — 7th House, D9 Navamsha & Timing', hi: 'विवाह भविष्यवाणी — 7वां भाव, D9 नवांश', sa: 'विवाहभविष्यवाणी' },
    description: { en: 'Predict marriage from your chart: 7th house, Venus, Navamsha (D9), Darakaraka, timing through dashas, delay indicators, and Mangal Dosha analysis.', hi: 'कुण्डली से विवाह भविष्यवाणी: 7वां भाव, शुक्र, नवांश, दारकारक, समय निर्धारण।', sa: 'कुण्डल्या विवाहभविष्यवाणी।' },
    keywords: ['marriage prediction', '7th house', 'navamsha', 'marriage timing', 'mangal dosha'],
  },
  '/learn/wealth': {
    title: { en: 'Wealth Prediction — Dhana Yogas, 2nd/11th House Analysis', hi: 'धन भविष्यवाणी — धन योग, 2/11 भाव', sa: 'धनभविष्यवाणी' },
    description: { en: 'Predict wealth from your chart: 2nd/11th house analysis, Dhana Yogas, Lakshmi Yoga, wealth timing, Ashtakavarga scoring, and poverty remedies.', hi: 'कुण्डली से धन भविष्यवाणी: 2/11 भाव, धन योग, लक्ष्मी योग, अष्टकवर्ग।', sa: 'कुण्डल्या धनभविष्यवाणी।' },
    keywords: ['wealth astrology', 'dhana yoga', '2nd house', '11th house', 'lakshmi yoga'],
  },

  '/learn/health': {
    title: { en: 'Medical Astrology — Planet-Body Mapping & Health Prediction', hi: 'चिकित्सा ज्योतिष — ग्रह-शरीर मानचित्रण', sa: 'चिकित्साज्योतिषम्' },
    description: { en: 'Zodiac body map, planet-disease correlations, health per lagna sign, Ayurvedic constitution from chart, timing of health events.', hi: 'राशि शरीर मानचित्र, ग्रह-रोग सम्बन्ध, लग्न अनुसार स्वास्थ्य, आयुर्वेदिक प्रकृति।', sa: 'राशिशरीरमानचित्रं ग्रहरोगसम्बन्धाः।' },
    keywords: ['medical astrology', 'health prediction', 'zodiac body parts', 'ayurvedic astrology'],
  },
  '/learn/children': {
    title: { en: 'Children Prediction — 5th House, D7 & Fertility Analysis', hi: 'सन्तान भविष्यवाणी — 5वां भाव, D7', sa: 'सन्तानभविष्यवाणी' },
    description: { en: 'Predict children from your chart: 5th house, Jupiter, D7 Saptamsha, Putrakaraka, fertility sphutas, timing of childbirth.', hi: 'कुण्डली से सन्तान भविष्यवाणी: 5वां भाव, बृहस्पति, D7, पुत्रकारक, प्रजनन।', sa: 'कुण्डल्या सन्तानभविष्यवाणी।' },
    keywords: ['children prediction', '5th house', 'saptamsha', 'fertility astrology'],
  },
  '/learn/retrograde-effects': {
    title: { en: 'Retrograde Planets — Natal & Transit Effects for All 5', hi: 'वक्री ग्रह — जन्म एवं गोचर प्रभाव', sa: 'वक्रीग्रहाः — जन्मगोचरप्रभावाः' },
    description: { en: 'Mercury, Venus, Mars, Jupiter, Saturn retrograde effects in birth chart and transit. Orbital mechanics, Cheshta Bala, practical dos and don\'ts.', hi: 'बुध, शुक्र, मंगल, बृहस्पति, शनि वक्री प्रभाव — जन्म कुण्डली और गोचर में।', sa: 'बुधशुक्रमङ्गलबृहस्पतिशनिवक्रीप्रभावाः।' },
    keywords: ['retrograde planets', 'mercury retrograde', 'vakri graha', 'retrograde effects'],
  },

  '/learn/advanced-houses': {
    title: { en: 'MKS, Badhaka, Maraka — Advanced House Concepts', hi: 'मारक कारक स्थान, बाधक, मारक', sa: 'मारककारकस्थानम् बाधकः मारकश्च' },
    description: { en: 'Marana Karaka Sthana (death places), Badhakesh (obstruction lord), Maraka (death-inflicting lords), and functional benefic/malefic per lagna.', hi: 'मारक कारक स्थान, बाधकेश, मारक ग्रह, और प्रत्येक लग्न के लिए कार्यात्मक शुभ/अशुभ।', sa: 'मारककारकस्थानम् बाधकेशः मारकग्रहाः प्रतिलग्नं कार्यात्मकशुभाशुभाश्च।' },
    keywords: ['marana karaka sthana', 'badhaka', 'maraka', 'yogakaraka', 'functional malefic'],
  },
  '/learn/compatibility': {
    title: { en: 'Advanced Compatibility — Beyond Ashta Kuta', hi: 'उन्नत अनुकूलता — अष्ट कूट से परे', sa: 'उन्नतमेलनम् — अष्टकूटात् परम्' },
    description: { en: 'Chart-level marriage compatibility: 7th house comparison, Venus assessment, Navamsha matching, dasha compatibility, Mangal Dosha full analysis.', hi: 'चार्ट-स्तरीय विवाह अनुकूलता: 7वां भाव, शुक्र, नवांश, दशा अनुकूलता, मंगल दोष।', sa: 'चक्रस्तरीयविवाहमेलनम् — सप्तमभावः शुक्रः नवांशः दशामेलनम् मङ्गलदोषश्च।' },
    keywords: ['advanced compatibility', 'chart matching', 'navamsha compatibility', 'mangal dosha full'],
  },
  '/learn/combustion': {
    title: { en: 'Combustion (Asta) — When Planets Get Too Close to the Sun', hi: 'अस्त ग्रह — जब ग्रह सूर्य के बहुत निकट', sa: 'अस्तग्रहाः' },
    description: { en: 'Planet combustion distances, effects per planet when combust, remedies. SVG diagram showing combustion zones for Moon, Mercury, Venus, Mars, Jupiter, Saturn.', hi: 'ग्रह अस्त दूरी, प्रत्येक ग्रह पर प्रभाव, उपाय।', sa: 'ग्रहास्तदूरी प्रभावाः उपायाश्च।' },
    keywords: ['combustion astrology', 'asta graha', 'combust planet', 'planet near sun'],
  },
  '/learn/transit-guide': {
    title: { en: 'Transit Guide — Saturn, Jupiter, Rahu-Ketu Through 12 Houses', hi: 'गोचर मार्गदर्शिका — शनि, बृहस्पति, राहु-केतु', sa: 'गोचरमार्गदर्शिका' },
    description: { en: 'House-by-house transit effects for Saturn (2.5yr), Jupiter (1yr), Rahu-Ketu (1.5yr). Star ratings, double transit theory, practical timing.', hi: 'शनि, बृहस्पति, राहु-केतु का भाव-दर-भाव गोचर प्रभाव।', sa: 'शनिबृहस्पतिराहुकेतूनां भावशः गोचरप्रभावाः।' },
    keywords: ['saturn transit', 'jupiter transit', 'rahu ketu transit', 'gochar effects'],
  },
  '/learn/hora': {
    title: { en: 'Hora — Planetary Hours & Best Times for Activities', hi: 'होरा — ग्रह घण्टे एवं कार्य हेतु उत्तम समय', sa: 'होरा — ग्रहघण्टाः कार्यार्थम् उत्तमसमयः' },
    description: { en: 'The 24 planetary hours (Hora) system: Chaldean order, weekday derivation, which hora for which activity, computation formula.', hi: '24 ग्रह होरा: कैल्डियन क्रम, वार व्युत्पत्ति, कौन सी होरा किस कार्य के लिए।', sa: '24 ग्रहहोराः — कार्यानुसारं होराचयनम्।' },
    keywords: ['hora', 'planetary hours', 'best time for activity', 'chaldean order'],
  },

  // ─── Practitioner References ──────────────────────────────
  '/learn/planet-in-house': {
    title: { en: 'Planet in House — 108 Vedic Astrology Interpretations', hi: 'ग्रह भाव में — 108 वैदिक ज्योतिष व्याख्याएँ', sa: 'ग्रहः भावे — 108 वैदिकज्योतिषव्याख्याः' },
    description: { en: 'What does each planet mean in each house? Interactive guide to all 108 planet-house combinations with career, relationship, and health implications.', hi: 'प्रत्येक ग्रह प्रत्येक भाव में क्या अर्थ रखता है? 108 ग्रह-भाव संयोजनों की इंटरैक्टिव मार्गदर्शिका।', sa: 'प्रत्येकः ग्रहः प्रत्येकस्मिन् भावे किमर्थं करोति? 108 ग्रहभावसंयोजनानां मार्गदर्शिका।' },
    keywords: ['planet in house', 'vedic astrology interpretation', 'mars in 7th house', 'jupiter in 10th'],
  },
  '/learn/aspects': {
    title: { en: 'Planetary Aspects (Drishti) — Visual Guide', hi: 'ग्रह दृष्टि — दृश्य मार्गदर्शिका', sa: 'ग्रहदृष्टिः — दृश्यमार्गदर्शिका' },
    description: { en: 'Interactive aspect wheel showing Jupiter, Mars, Saturn special aspects. Strength percentages, key combinations, and practical effects.', hi: 'बृहस्पति, मंगल, शनि विशेष दृष्टि। शक्ति प्रतिशत, प्रमुख संयोजन और प्रभाव।', sa: 'बृहस्पतिमङ्गलशनिविशेषदृष्टयः। शक्तिप्रतिशतं प्रमुखसंयोजनानि प्रभावाश्च।' },
    keywords: ['planetary aspects', 'drishti', 'jupiter aspect', 'saturn aspect', 'mars aspect'],
  },
  '/learn/remedies': {
    title: { en: 'Vedic Remedies — Gemstones, Mantras, Charity for All 9 Planets', hi: 'वैदिक उपाय — सभी 9 ग्रहों के रत्न, मंत्र, दान', sa: 'वैदिकोपायाः — सर्वेषां 9 ग्रहाणां रत्नमन्त्रदानानि' },
    description: { en: 'Complete remedial reference for all 9 Vedic planets: gemstones, beej mantras, deity worship, fasting days, charity items, and colors. Includes remedy selection flowchart.', hi: 'सभी 9 ग्रहों का पूर्ण उपचार: रत्न, बीज मंत्र, देवता पूजा, उपवास, दान और रंग।', sa: 'सर्वेषां 9 ग्रहाणां सम्पूर्णोपचारः — रत्नानि बीजमन्त्राः देवतापूजा उपवासः दानं वर्णाश्च।' },
    keywords: ['vedic remedies', 'gemstone astrology', 'planet mantras', 'jyotish remedies', 'graha shanti'],
  },

  // ─── Kundali Deep Dives ───────────────────────────────────
  '/learn/planets': {
    title: { en: 'Planetary Positions — Reading Your Birth Chart', hi: 'ग्रह स्थिति — जन्म कुण्डली पढ़ना', sa: 'ग्रहस्थितयः — जन्मकुण्डलीपठनम्' },
    description: { en: 'Understand planet positions in Vedic astrology: signs, houses, nakshatras, padas, retrogrades, and dignities. Complete guide to reading the planets table.', hi: 'वैदिक ज्योतिष में ग्रह स्थिति: राशि, भाव, नक्षत्र, पाद, वक्री और गरिमा।', sa: 'वैदिकज्योतिषे ग्रहस्थितयः — राशिभावनक्षत्रपादवक्रीगरिमाः।' },
    keywords: ['planet positions', 'vedic astrology', 'birth chart reading', 'planetary dignities'],
  },
  '/learn/ashtakavarga': {
    title: { en: 'Ashtakavarga — 8-Fold Bindu Scoring System', hi: 'अष्टकवर्ग — 8 स्रोत बिन्दु अंक पद्धति', sa: 'अष्टकवर्गः — अष्टस्रोतबिन्दुपद्धतिः' },
    description: { en: 'Complete guide to Ashtakavarga: BAV, SAV, bindu scoring, transit prediction, Trikona Shodhana, and Kakshya divisions.', hi: 'अष्टकवर्ग: BAV, SAV, बिन्दु अंक, गोचर भविष्यवाणी, त्रिकोण शोधन।', sa: 'अष्टकवर्गः — BAV, SAV, बिन्दुअङ्कः, गोचरभविष्यवाणी।' },
    keywords: ['ashtakavarga', 'bindu', 'transit prediction', 'sarvashtakavarga'],
  },
  '/learn/shadbala': {
    title: { en: 'Shadbala — Six-Fold Planetary Strength', hi: 'षड्बल — छह प्रकार का ग्रह बल', sa: 'षड्बलम् — षड्विधग्रहबलम्' },
    description: { en: 'Complete Shadbala guide: Sthana, Dig, Kala, Cheshta, Naisargika, Drig Bala with minimum thresholds and chart captain identification.', hi: 'षड्बल: स्थान, दिग्, काल, चेष्टा, नैसर्गिक, दृग् बल। न्यूनतम सीमा और चार्ट कप्तान।', sa: 'षड्बलम् — स्थानदिग्कालचेष्टानैसर्गिकदृग्बलानि।' },
    keywords: ['shadbala', 'planetary strength', 'vedic astrology', 'chart analysis'],
  },
  '/learn/bhavabala': {
    title: { en: 'Bhavabala — House Strength Analysis', hi: 'भावबल — भाव शक्ति विश्लेषण', sa: 'भावबलम् — भावशक्तिविश्लेषणम्' },
    description: { en: 'House strength in Vedic astrology: Bhavadhipati, Bhava Dig, and Bhava Drishti Bala. 12 house significations and remedies.', hi: 'वैदिक ज्योतिष में भाव शक्ति: भावाधिपति, भाव दिग्, भाव दृष्टि बल।', sa: 'वैदिकज्योतिषे भावशक्तिः — भावाधिपतिदिग्दृष्टिबलानि।' },
    keywords: ['bhavabala', 'house strength', 'vedic houses', '12 bhavas'],
  },
  '/learn/avasthas': {
    title: { en: 'Avasthas — Planetary States & Moods', hi: 'अवस्थाएँ — ग्रह दशाएँ', sa: 'अवस्थाः — ग्रहदशाः' },
    description: { en: 'All 5 avastha systems from BPHS: Baladi, Jagradadi, Deeptadi, Lajjitadi, Shayanadi. How planets deliver results.', hi: 'BPHS से 5 अवस्था प्रणालियाँ: बालादि, जागृतादि, दीप्तादि, लज्जितादि, शयनादि।', sa: 'BPHS तः 5 अवस्थाप्रणाल्यः — बालादिजागृतादिदीप्तादिलज्जितादिशयनादयः।' },
    keywords: ['avasthas', 'planetary states', 'baladi', 'deeptadi', 'lajjitadi'],
  },
  '/learn/sphutas': {
    title: { en: 'Sphutas — Sensitive Points (Yogi, Prana, Mrityu)', hi: 'स्फुट — संवेदनशील बिन्दु', sa: 'स्फुटाः — संवेदनशीलबिन्दवः' },
    description: { en: 'Yogi & Avayogi Points, Prana Sphuta, Deha Sphuta, Mrityu Sphuta, fertility sphutas. Cosmic GPS coordinates in your chart.', hi: 'योगी, अवयोगी बिन्दु, प्राण, देह, मृत्यु स्फुट। कुण्डली के संवेदनशील बिन्दु।', sa: 'योग्यवयोगिबिन्दू प्राणदेहमृत्युस्फुटाः।' },
    keywords: ['sphutas', 'yogi point', 'avayogi', 'prana sphuta', 'sensitive points'],
  },
  '/learn/argala': {
    title: { en: 'Argala — Planetary Intervention System (Jaimini)', hi: 'अर्गला — ग्रह हस्तक्षेप पद्धति', sa: 'अर्गला — ग्रहहस्तक्षेपपद्धतिः' },
    description: { en: 'Argala (bolt) and Virodha Argala: how planets intervene in house affairs. Dhana, Sukha, Labha, Putra Argala explained.', hi: 'अर्गला और विरोध अर्गला: ग्रह भाव मामलों में कैसे हस्तक्षेप करते हैं।', sa: 'अर्गला विरोधार्गला च — ग्रहाः भावकार्येषु कथं हस्तक्षेपं कुर्वन्ति।' },
    keywords: ['argala', 'virodha argala', 'jaimini', 'planetary intervention'],
  },
  '/learn/jaimini': {
    title: { en: 'Jaimini Astrology — Sign-Based System', hi: 'जैमिनी ज्योतिष — राशि आधारित', sa: 'जैमिनीज्योतिषम् — राश्याधारितम्' },
    description: { en: 'Jaimini system: Chara Karakas, Atmakaraka, Rashi Drishti, Arudha Padas, Karakamsha, and Chara Dasha.', hi: 'जैमिनी: चर कारक, आत्मकारक, राशि दृष्टि, आरूढ़ पद, कारकांश और चर दशा।', sa: 'जैमिनीपद्धतिः — चरकारकाः आत्मकारकः राशिदृष्टिः आरूढपदानि कारकांशः चरदशा च।' },
    keywords: ['jaimini astrology', 'chara karaka', 'atmakaraka', 'rashi drishti', 'arudha pada'],
  },
  '/learn/sade-sati': {
    title: { en: 'Sade Sati — Saturn\'s 7.5-Year Transit', hi: 'साढ़े साती — शनि का 7.5 वर्ष गोचर', sa: 'साडेसाती — शनेः सार्धसप्तवर्षीयगोचरः' },
    description: { en: 'Complete Sade Sati guide: 3 phases, severity factors, life cycle patterns, remedies, and myths debunked.', hi: 'साढ़े साती: 3 चरण, तीव्रता कारक, जीवन चक्र, उपाय और मिथक।', sa: 'साडेसाती — त्रयः चरणाः तीव्रताकारकाः जीवनचक्रम् उपायाः मिथकाश्च।' },
    keywords: ['sade sati', 'saturn transit', 'shani sade sati', 'saturn 7.5 years'],
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
