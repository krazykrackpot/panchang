/**
 * Centralized SEO metadata for all pages.
 * Used by per-route generateMetadata functions.
 */

import type { Metadata } from 'next';
import { locales } from '@/lib/i18n/config';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://dekhopanchang.com';

const OG_LOCALE_MAP: Record<string, string> = {
  hi: 'hi_IN', sa: 'sa_IN', ta: 'ta_IN', te: 'te_IN',
  bn: 'bn_IN', kn: 'kn_IN', mr: 'mr_IN', gu: 'gu_IN', mai: 'mai_IN',
};

interface PageMeta {
  title: { en: string; hi: string; sa: string; [key: string]: string | undefined };
  description: { en: string; hi: string; sa: string; [key: string]: string | undefined };
  keywords?: string[];
}

export const PAGE_META: Record<string, PageMeta> = {
  // ─── Core ─────────────────────────────────────────────────
  '/panchang': {
    title: {
      en: 'Daily Panchang — Tithi, Nakshatra, Yoga, Karana Today',
      hi: 'आज का पंचांग — तिथि, नक्षत्र, योग, करण',
      sa: 'दैनिकपञ्चाङ्गम् — तिथिः नक्षत्रं योगः करणम्',
      gu: 'આજનું પંચાંગ — તિથિ, નક્ષત્ર, યોગ | Dekho Panchang',
      kn: 'ಇಂದಿನ ಪಂಚಾಂಗ — ತಿಥಿ, ನಕ್ಷತ್ರ, ಯೋಗ | Dekho Panchang',
      te: 'నేటి పంచాంగం — తిథి, నక్షత్రం, యోగం | Dekho Panchang',
      bn: 'আজকের পঞ্চাঙ্গ — তিথি, নক্ষত্র, যোগ | Dekho Panchang',
    },
    description: {
      en: 'Accurate daily Panchang with Tithi, Nakshatra, Yoga, Karana, Rahu Kalam, sunrise/sunset for any location worldwide. Computed from classical Vedic algorithms.',
      hi: 'विश्व भर में किसी भी स्थान के लिए सटीक दैनिक पंचांग — तिथि, नक्षत्र, योग, करण, राहु काल, सूर्योदय/सूर्यास्त।',
      sa: 'विश्वस्य कस्यापि स्थानस्य कृते सम्यक् दैनिकपञ्चाङ्गम् — तिथिः नक्षत्रं योगः करणम्।',
      gu: 'ગુજરાત અને વિશ્વ ભરમાં કોઈ પણ સ્થળ માટે સચોટ દૈનિક પંચાંગ — તિથિ, નક્ષત્ર, યોગ, કરણ, રાહુ કાળ.',
      kn: 'ವಿಶ್ವದ ಯಾವುದೇ ಸ್ಥಳಕ್ಕೆ ನಿಖರ ದೈನಂದಿನ ಪಂಚಾಂಗ — ತಿಥಿ, ನಕ್ಷತ್ರ, ಯೋಗ, ಕರಣ, ರಾಹು ಕಾಲ.',
      te: 'ప్రపంచంలో ఎక్కడైనా ఖచ్చితమైన రోజువారీ పంచాంగం — తిథి, నక్షత్రం, యోగం, కరణం, రాహు కాలం.',
      bn: 'বিশ্বের যেকোনো স্থানের জন্য সঠিক দৈনিক পঞ্চাঙ্গ — তিথি, নক্ষত্র, যোগ, করণ, রাহু কাল.',
    },
    keywords: ['panchang today', 'daily panchang', 'tithi today', 'nakshatra today', 'rahu kalam', 'hindu calendar'],
  },
  '/panchang/auspicious': {
    title: {
      en: 'Auspicious Timings Today — Muhurta, Abhijit, Amrit Kalam',
      hi: 'आज के शुभ मुहूर्त — अभिजित, अमृत काल, ब्रह्म मुहूर्त',
      sa: 'अद्य शुभमुहूर्ताः — अभिजित्, अमृतकालः, ब्रह्ममुहूर्तः',
    },
    description: {
      en: 'Today\'s auspicious timings: Brahma Muhurta, Abhijit Muhurta, Vijaya Muhurta, Amrit Kalam, Godhuli, Sandhya Kaal, and special yoga windows for any location.',
      hi: 'आज के शुभ समय: ब्रह्म मुहूर्त, अभिजित मुहूर्त, विजय मुहूर्त, अमृत काल, गोधूलि, संध्या काल और विशेष योग।',
      sa: 'अद्य शुभसमयाः: ब्रह्ममुहूर्तः, अभिजित्मुहूर्तः, विजयमुहूर्तः, अमृतकालः, गोधूलिः, सन्ध्याकालः।',
    },
    keywords: ['auspicious timings today', 'abhijit muhurta', 'brahma muhurta', 'amrit kalam', 'godhuli muhurta'],
  },
  '/panchang/inauspicious': {
    title: {
      en: 'Inauspicious Timings Today — Rahu Kaal, Yamaganda, Varjyam',
      hi: 'आज के अशुभ समय — राहु काल, यमगण्ड, वर्ज्यम',
      sa: 'अद्य अशुभसमयाः — राहुकालः, यमगण्डः, वर्ज्यम्',
    },
    description: {
      en: 'Today\'s inauspicious timings: Rahu Kaal, Yamaganda, Gulika Kaal, Dur Muhurtam, Varjyam, Bhadra, Ganda Moola, and Panchaka for any location worldwide.',
      hi: 'आज के अशुभ समय: राहु काल, यमगण्ड, गुलिक काल, दुर्मुहूर्त, वर्ज्यम, भद्रा, गण्ड मूल, पंचक।',
      sa: 'अद्य अशुभसमयाः: राहुकालः, यमगण्डः, गुलिककालः, दुर्मुहूर्तम्, वर्ज्यम्, भद्रा, गण्डमूलम्, पञ्चकम्।',
    },
    keywords: ['rahu kaal today', 'yamaganda', 'gulika kaal', 'varjyam', 'dur muhurtam', 'inauspicious timings'],
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
  '/financial-astrology': {
    title: {
      en: 'Financial Astrology — Dhana Yogas, Wealth Timing & Sector Guide',
      hi: 'वित्तीय ज्योतिष — धन योग, धन समय एवं क्षेत्र मार्गदर्शन',
      sa: 'वित्तज्योतिषम् — धनयोगाः धनसमयः क्षेत्रमार्गदर्शनम्',
    },
    description: {
      en: 'Discover your Dhana yoga activations, personal financial windows, hora-based timing guide, and top sectors from your Vedic birth chart. Traditional Vedic knowledge for self-awareness only.',
      hi: 'अपनी वैदिक कुण्डली से धन योग सक्रियण, व्यक्तिगत वित्तीय काल, होरा-आधारित समय मार्गदर्शन और शीर्ष क्षेत्र जानें।',
      sa: 'वैदिककुण्डल्याः धनयोगसक्रियणं व्यक्तिगतवित्तकालः होराधारितमार्गदर्शनं च ज्ञायताम्।',
    },
    keywords: ['financial astrology', 'dhana yoga', 'wealth timing', 'vedic finance', 'hora guide', 'investment astrology'],
  },
  '/glossary': {
    title: {
      en: 'Vedic Astrology Glossary — 50+ Terms Explained',
      hi: 'वैदिक ज्योतिष शब्दावली',
      sa: 'वैदिकज्योतिषशब्दकोशः',
    },
    description: {
      en: 'Comprehensive glossary of Vedic astrology terms with pronunciations, definitions, and Western equivalents.',
      hi: 'वैदिक ज्योतिष शब्दों की व्यापक शब्दावली',
      sa: 'वैदिकज्योतिषशब्दानां व्याख्या',
    },
    keywords: ['vedic astrology glossary', 'jyotish terms', 'what is nakshatra', 'what is dasha'],
  },
  '/mundane': {
    title: {
      en: 'Mundane Astrology — National Charts, World Forecast & Great Conjunctions',
      hi: 'मुण्डेन ज्योतिष — राष्ट्रीय कुण्डलियाँ, विश्व पूर्वानुमान एवं महायोग',
      sa: 'मुण्डेनज्योतिषम् — राष्ट्रकुण्डलयः विश्वपूर्वानुमानं महायोगश्च',
    },
    description: {
      en: 'Explore foundation charts for 22 nations, Jupiter-Saturn Great Conjunction cycles, and domain-by-domain world forecasts using Vedic mundane astrology. For educational purposes only.',
      hi: '22 राष्ट्रों की जन्मकुण्डलियाँ, बृहस्पति-शनि महायोग चक्र और डोमेन-वार विश्व पूर्वानुमान वैदिक मुण्डेन ज्योतिष द्वारा देखें।',
      sa: 'द्वाविंशतिराष्ट्राणां कुण्डलयः बृहस्पतिशनिमहायोगचक्रं च वैदिकमुण्डेनज्योतिषेण विश्वपूर्वानुमानं च ज्ञायताम्।',
    },
    keywords: ['mundane astrology', 'national chart', 'great conjunction', 'world forecast', 'vedic mundane', 'jupiter saturn cycle'],
  },
  '/nadi-jyotish': {
    title: {
      en: 'Nadi Jyotish — Bhrigu Nandi Nadi Planet Reading',
      hi: 'नाड़ी ज्योतिष — भृगु नंदी नाड़ी ग्रह पठन',
      sa: 'नाड़ीज्योतिषम् — भृगुनन्दिनाड़ीग्रहपठनम्',
    },
    description: {
      en: 'Bhrigu Nandi Nadi reading: planet-in-sign base predictions, aspect and conjunction modifiers, karmic profile, and life themes from your Vedic birth chart.',
      hi: 'भृगु नंदी नाड़ी पठन: ग्रह-राशि आधार भविष्यवाणी, दृष्टि और युति संशोधक, कार्मिक प्रोफ़ाइल और जीवन विषय।',
      sa: 'भृगुनन्दिनाड़ीपठनम्: ग्रहराश्याधारभविष्यवाणी दृष्ट्यादिसंशोधकाः कार्मिकप्रोफाइलः जीवनविषयाश्च।',
    },
    keywords: ['nadi jyotish', 'bhrigu nandi nadi', 'bnn reading', 'planet in sign', 'karmic astrology', 'vedic nadi'],
  },
  '/medical-astrology': {
    title: {
      en: 'Medical Astrology — Prakriti, Body Map & Health Timeline',
      hi: 'चिकित्सा ज्योतिष — प्रकृति, देह मानचित्र एवं स्वास्थ्य समयरेखा',
      sa: 'चिकित्साज्योतिषम् — प्रकृतिः देहमानचित्रं स्वास्थ्यसमयरेखा',
    },
    description: {
      en: 'Discover your Ayurvedic constitution (Prakriti), body vulnerability map, health timeline, and disease susceptibility patterns from your Vedic birth chart. For self-awareness only.',
      hi: 'अपनी वैदिक कुण्डली से आयुर्वेदिक प्रकृति, देह असुरक्षा मानचित्र, स्वास्थ्य समयरेखा और रोग संवेदनशीलता प्रारूप जानें।',
      sa: 'वैदिककुण्डल्याः आयुर्वेदिकप्रकृतिः देहमानचित्रं स्वास्थ्यसमयरेखा रोगसंवेदनशीलता च ज्ञायताम्।',
    },
    keywords: ['medical astrology', 'prakriti calculator', 'ayurvedic constitution', 'vedic health', 'body map astrology'],
  },
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
  '/tithi-pravesha': {
    title: {
      en: 'Tithi Pravesha — Vedic Birthday Calculator',
      hi: 'तिथि प्रवेश — वैदिक जन्मदिन',
      sa: 'तिथिप्रवेशः — वैदिकजन्मदिवसगणकम्',
    },
    description: {
      en: 'Find your Vedic birthday (Tithi Pravesha) — the exact date when your birth tithi recurs each year. Discover your year lord and annual theme based on classical Jyotish.',
      hi: 'अपना वैदिक जन्मदिन (तिथि प्रवेश) खोजें — वह सटीक तिथि जब आपकी जन्म तिथि हर वर्ष पुनः आती है।',
      sa: 'भवतः वैदिकजन्मदिवसं (तिथिप्रवेशम्) अन्विष्यतु — यत्र भवतः जन्मतिथिः प्रतिवर्षं पुनरागच्छति।',
    },
    keywords: ['tithi pravesha', 'vedic birthday', 'vedic birthday calculator', 'annual tithi', 'tithi lord', 'vedic astrology'],
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
  '/tropical-compare': {
    title: {
      en: 'Sidereal vs Tropical — Your Real Star Signs',
      hi: 'सायन बनाम निरयन — आपकी असली राशि',
      sa: 'सायनं निरयनं च',
    },
    description: {
      en: 'Discover why your Vedic signs differ from Western astrology. See all 9 planets compared side by side.',
      hi: 'जानें क्यों वैदिक राशि पश्चिमी ज्योतिष से भिन्न है',
      sa: 'वैदिकराशिपाश्चात्यज्योतिषयोर्भेदः',
    },
    keywords: ['sidereal vs tropical', 'vedic vs western astrology', 'precession of equinoxes', 'real zodiac sign'],
  },
  '/sign-shift': {
    title: {
      en: 'Why Your Western Horoscope Might Be Wrong — Sign Shift Calculator',
      hi: 'आपकी पश्चिमी राशि गलत क्यों हो सकती है — राशि परिवर्तन',
      sa: 'पाश्चात्यराशिः कुतः भ्रान्ता स्यात् — राशिपरिवर्तनम्',
    },
    description: {
      en: 'See how the 24° ayanamsha shift between tropical and sidereal zodiacs changes your entire birth chart. Compare all 9 planets side by side and discover your true Vedic signs.',
      hi: 'देखें कि सायन और निरयन राशिचक्र के बीच 24° अयनांश अंतर आपकी पूरी जन्म कुण्डली कैसे बदलता है। सभी 9 ग्रहों की तुलना करें और अपनी असली वैदिक राशि जानें।',
      sa: 'सायननिरयनराशिचक्रयोर्मध्ये २४° अयनांशभेदेन जन्मकुण्डली कथं परिवर्तते इति पश्यतु।',
    },
    keywords: ['vedic vs western astrology', 'sign shift', 'sidereal vs tropical zodiac', 'ayanamsha', 'real zodiac sign', 'why western horoscope wrong', 'precession of equinoxes'],
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
  '/cosmic-blueprint': {
    title: {
      en: 'Cosmic Blueprint — Your Vedic Personality Profile',
      hi: 'कॉस्मिक ब्लूप्रिंट — आपका वैदिक व्यक्तित्व',
      sa: 'दैवनिर्माणम्',
    },
    description: {
      en: 'Discover your cosmic archetype, life chapters, and psychological profile based on Vedic astrology.',
      hi: 'वैदिक ज्योतिष पर आधारित आपका व्यक्तित्व प्रोफ़ाइल',
      sa: 'वैदिकज्योतिषाधारितव्यक्तित्वम्',
    },
    keywords: ['cosmic blueprint', 'vedic personality', 'birth chart archetype', 'dasha life chapters'],
  },
  '/vrat-calendar': {
    title: {
      en: 'Vrat Calendar — Follow & Track Your Vrats',
      hi: 'व्रत कैलेंडर — अपने व्रतों का अनुसरण करें',
      sa: 'व्रतपञ्चाङ्गम् — व्रतानि अनुसरतु',
    },
    description: {
      en: 'Follow Ekadashi, Pradosham, Purnima, Sankashti Chaturthi, and more. Get personalized reminders before each vrat.',
      hi: 'एकादशी, प्रदोष, पूर्णिमा, संकष्टी चतुर्थी आदि व्रतों का अनुसरण करें। प्रत्येक व्रत से पहले स्मरण प्राप्त करें।',
      sa: 'एकादशीप्रदोषपूर्णिमासङ्कष्टचतुर्थ्यादिव्रतानि अनुसरतु। प्रत्येकव्रतात् पूर्वं स्मारणं प्राप्नोतु।',
    },
    keywords: ['vrat calendar', 'ekadashi dates', 'pradosham dates', 'purnima dates', 'fasting calendar', 'hindu vrat tracker'],
  },
  '/lunar-calendar': {
    title: {
      en: 'Lunar Lifestyle Calendar — Moon Phase Energy Guide',
      hi: 'चंद्र जीवनशैली कैलेंडर — चंद्र ऊर्जा मार्गदर्शिका',
      sa: 'चन्द्रकलापत्रम् — चन्द्रशक्तिमार्गदर्शिका',
    },
    description: {
      en: 'Track the Moon\'s daily energy with our precision lunar calendar. See best/avoid activities for each day based on Vedic Panchang.',
      hi: 'वैदिक पंचांग के आधार पर चंद्रमा की दैनिक ऊर्जा को ट्रैक करें। प्रतिदिन के लिए सर्वोत्तम और निषिद्ध गतिविधियां देखें।',
      sa: 'वैदिकपञ्चाङ्गाधारेण चन्द्रस्य दैनिकशक्तिं अनुसरतु। प्रतिदिनं श्रेष्ठनिषिद्धकर्माणि पश्यतु।',
    },
    keywords: ['moon phase calendar', 'lunar cycle planner', 'moon energy today', 'lunar lifestyle', 'vedic lunar calendar'],
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

  // ─── Rashi Detail Pages (12) ──────────────────────────────
  '/panchang/rashi/mesh': {
    title: { en: "Aries (Mesh) — Personality, Career, Love & Today's Horoscope", hi: 'मेष राशि — व्यक्तित्व, करियर, प्रेम और आज का राशिफल', sa: 'मेषराशिः — व्यक्तित्वं वृत्तिः प्रेमः' },
    description: { en: "Complete Aries (Mesh Rashi) guide — personality traits, career aptitude, health, relationships, and daily horoscope. Vedic astrology analysis with lucky numbers, colors, and compatible signs.", hi: 'मेष राशि का पूरा मार्गदर्शन — व्यक्तित्व, करियर, स्वास्थ्य, रिश्ते और दैनिक राशिफल।', sa: 'मेषराशेः सम्पूर्णमार्गदर्शनम् — व्यक्तित्वं वृत्तिः स्वास्थ्यं सम्बन्धाः।' },
    keywords: ['aries vedic astrology', 'mesh rashi', 'aries personality', 'aries horoscope today', 'mesh rashi career'],
  },
  '/panchang/rashi/vrishabh': {
    title: { en: "Taurus (Vrishabh) — Personality, Career, Love & Today's Horoscope", hi: 'वृषभ राशि — व्यक्तित्व, करियर, प्रेम और आज का राशिफल', sa: 'वृषभराशिः — व्यक्तित्वं वृत्तिः प्रेमः' },
    description: { en: "Complete Taurus (Vrishabh Rashi) guide — personality traits, career aptitude, health, relationships, and daily horoscope. Venus-ruled earth sign analysis.", hi: 'वृषभ राशि का पूरा मार्गदर्शन — व्यक्तित्व, करियर, स्वास्थ्य, रिश्ते और दैनिक राशिफल।', sa: 'वृषभराशेः सम्पूर्णमार्गदर्शनम्।' },
    keywords: ['taurus vedic astrology', 'vrishabh rashi', 'taurus personality', 'taurus horoscope today'],
  },
  '/panchang/rashi/mithun': {
    title: { en: "Gemini (Mithun) — Personality, Career, Love & Today's Horoscope", hi: 'मिथुन राशि — व्यक्तित्व, करियर, प्रेम और आज का राशिफल', sa: 'मिथुनराशिः — व्यक्तित्वं वृत्तिः प्रेमः' },
    description: { en: "Complete Gemini (Mithun Rashi) guide — personality traits, career aptitude, health, relationships, and daily horoscope. Mercury-ruled air sign analysis.", hi: 'मिथुन राशि का पूरा मार्गदर्शन — व्यक्तित्व, करियर, स्वास्थ्य, रिश्ते और दैनिक राशिफल।', sa: 'मिथुनराशेः सम्पूर्णमार्गदर्शनम्।' },
    keywords: ['gemini vedic astrology', 'mithun rashi', 'gemini personality', 'gemini horoscope today'],
  },
  '/panchang/rashi/kark': {
    title: { en: "Cancer (Kark) — Personality, Career, Love & Today's Horoscope", hi: 'कर्क राशि — व्यक्तित्व, करियर, प्रेम और आज का राशिफल', sa: 'कर्कटराशिः — व्यक्तित्वं वृत्तिः प्रेमः' },
    description: { en: "Complete Cancer (Kark Rashi) guide — personality traits, career aptitude, health, relationships, and daily horoscope. Moon-ruled water sign analysis.", hi: 'कर्क राशि का पूरा मार्गदर्शन — व्यक्तित्व, करियर, स्वास्थ्य, रिश्ते और दैनिक राशिफल।', sa: 'कर्कटराशेः सम्पूर्णमार्गदर्शनम्।' },
    keywords: ['cancer vedic astrology', 'kark rashi', 'cancer personality', 'cancer horoscope today'],
  },
  '/panchang/rashi/simha': {
    title: { en: "Leo (Simha) — Personality, Career, Love & Today's Horoscope", hi: 'सिंह राशि — व्यक्तित्व, करियर, प्रेम और आज का राशिफल', sa: 'सिंहराशिः — व्यक्तित्वं वृत्तिः प्रेमः' },
    description: { en: "Complete Leo (Simha Rashi) guide — personality traits, career aptitude, health, relationships, and daily horoscope. Sun-ruled fire sign analysis.", hi: 'सिंह राशि का पूरा मार्गदर्शन — व्यक्तित्व, करियर, स्वास्थ्य, रिश्ते और दैनिक राशिफल।', sa: 'सिंहराशेः सम्पूर्णमार्गदर्शनम्।' },
    keywords: ['leo vedic astrology', 'simha rashi', 'leo personality', 'leo horoscope today'],
  },
  '/panchang/rashi/kanya': {
    title: { en: "Virgo (Kanya) — Personality, Career, Love & Today's Horoscope", hi: 'कन्या राशि — व्यक्तित्व, करियर, प्रेम और आज का राशिफल', sa: 'कन्याराशिः — व्यक्तित्वं वृत्तिः प्रेमः' },
    description: { en: "Complete Virgo (Kanya Rashi) guide — personality traits, career aptitude, health, relationships, and daily horoscope. Mercury-ruled earth sign analysis.", hi: 'कन्या राशि का पूरा मार्गदर्शन — व्यक्तित्व, करियर, स्वास्थ्य, रिश्ते और दैनिक राशिफल।', sa: 'कन्याराशेः सम्पूर्णमार्गदर्शनम्।' },
    keywords: ['virgo vedic astrology', 'kanya rashi', 'virgo personality', 'virgo horoscope today'],
  },
  '/panchang/rashi/tula': {
    title: { en: "Libra (Tula) — Personality, Career, Love & Today's Horoscope", hi: 'तुला राशि — व्यक्तित्व, करियर, प्रेम और आज का राशिफल', sa: 'तुलाराशिः — व्यक्तित्वं वृत्तिः प्रेमः' },
    description: { en: "Complete Libra (Tula Rashi) guide — personality traits, career aptitude, health, relationships, and daily horoscope. Venus-ruled air sign analysis.", hi: 'तुला राशि का पूरा मार्गदर्शन — व्यक्तित्व, करियर, स्वास्थ्य, रिश्ते और दैनिक राशिफल।', sa: 'तुलाराशेः सम्पूर्णमार्गदर्शनम्।' },
    keywords: ['libra vedic astrology', 'tula rashi', 'libra personality', 'libra horoscope today'],
  },
  '/panchang/rashi/vrishchik': {
    title: { en: "Scorpio (Vrishchik) — Personality, Career, Love & Today's Horoscope", hi: 'वृश्चिक राशि — व्यक्तित्व, करियर, प्रेम और आज का राशिफल', sa: 'वृश्चिकराशिः — व्यक्तित्वं वृत्तिः प्रेमः' },
    description: { en: "Complete Scorpio (Vrishchik Rashi) guide — personality traits, career aptitude, health, relationships, and daily horoscope. Mars-ruled water sign analysis.", hi: 'वृश्चिक राशि का पूरा मार्गदर्शन — व्यक्तित्व, करियर, स्वास्थ्य, रिश्ते और दैनिक राशिफल।', sa: 'वृश्चिकराशेः सम्पूर्णमार्गदर्शनम्।' },
    keywords: ['scorpio vedic astrology', 'vrishchik rashi', 'scorpio personality', 'scorpio horoscope today'],
  },
  '/panchang/rashi/dhanu': {
    title: { en: "Sagittarius (Dhanu) — Personality, Career, Love & Today's Horoscope", hi: 'धनु राशि — व्यक्तित्व, करियर, प्रेम और आज का राशिफल', sa: 'धनुराशिः — व्यक्तित्वं वृत्तिः प्रेमः' },
    description: { en: "Complete Sagittarius (Dhanu Rashi) guide — personality traits, career aptitude, health, relationships, and daily horoscope. Jupiter-ruled fire sign analysis.", hi: 'धनु राशि का पूरा मार्गदर्शन — व्यक्तित्व, करियर, स्वास्थ्य, रिश्ते और दैनिक राशिफल।', sa: 'धनुराशेः सम्पूर्णमार्गदर्शनम्।' },
    keywords: ['sagittarius vedic astrology', 'dhanu rashi', 'sagittarius personality', 'sagittarius horoscope today'],
  },
  '/panchang/rashi/makar': {
    title: { en: "Capricorn (Makar) — Personality, Career, Love & Today's Horoscope", hi: 'मकर राशि — व्यक्तित्व, करियर, प्रेम और आज का राशिफल', sa: 'मकरराशिः — व्यक्तित्वं वृत्तिः प्रेमः' },
    description: { en: "Complete Capricorn (Makar Rashi) guide — personality traits, career aptitude, health, relationships, and daily horoscope. Saturn-ruled earth sign analysis.", hi: 'मकर राशि का पूरा मार्गदर्शन — व्यक्तित्व, करियर, स्वास्थ्य, रिश्ते और दैनिक राशिफल।', sa: 'मकरराशेः सम्पूर्णमार्गदर्शनम्।' },
    keywords: ['capricorn vedic astrology', 'makar rashi', 'capricorn personality', 'capricorn horoscope today'],
  },
  '/panchang/rashi/kumbh': {
    title: { en: "Aquarius (Kumbh) — Personality, Career, Love & Today's Horoscope", hi: 'कुम्भ राशि — व्यक्तित्व, करियर, प्रेम और आज का राशिफल', sa: 'कुम्भराशिः — व्यक्तित्वं वृत्तिः प्रेमः' },
    description: { en: "Complete Aquarius (Kumbh Rashi) guide — personality traits, career aptitude, health, relationships, and daily horoscope. Saturn-ruled air sign analysis.", hi: 'कुम्भ राशि का पूरा मार्गदर्शन — व्यक्तित्व, करियर, स्वास्थ्य, रिश्ते और दैनिक राशिफल।', sa: 'कुम्भराशेः सम्पूर्णमार्गदर्शनम्।' },
    keywords: ['aquarius vedic astrology', 'kumbh rashi', 'aquarius personality', 'aquarius horoscope today'],
  },
  '/panchang/rashi/meen': {
    title: { en: "Pisces (Meen) — Personality, Career, Love & Today's Horoscope", hi: 'मीन राशि — व्यक्तित्व, करियर, प्रेम और आज का राशिफल', sa: 'मीनराशिः — व्यक्तित्वं वृत्तिः प्रेमः' },
    description: { en: "Complete Pisces (Meen Rashi) guide — personality traits, career aptitude, health, relationships, and daily horoscope. Jupiter-ruled water sign analysis.", hi: 'मीन राशि का पूरा मार्गदर्शन — व्यक्तित्व, करियर, स्वास्थ्य, रिश्ते और दैनिक राशिफल।', sa: 'मीनराशेः सम्पूर्णमार्गदर्शनम्।' },
    keywords: ['pisces vedic astrology', 'meen rashi', 'pisces personality', 'pisces horoscope today'],
  },

  // ─── Dosha Checkers ────────────────────────────────────────
  '/mangal-dosha': {
    title: {
      en: 'Mangal Dosha Calculator — Check Mars Dosha in Your Chart',
      hi: 'मंगल दोष गणक — अपनी कुण्डली में मंगल दोष जाँचें',
      sa: 'मङ्गलदोषगणकम् — स्वकुण्डल्यां मङ्गलदोषं परीक्षतु',
    },
    description: {
      en: 'Free Mangal Dosha (Kuja Dosha) calculator. Check if Mars Dosha is present in your birth chart, its severity, affected life areas, cancellation conditions, and remedies.',
      hi: 'निःशुल्क मंगल दोष (कुज दोष) गणक। जानें कि क्या आपकी कुण्डली में मंगल दोष है, गम्भीरता, प्रभावित जीवन क्षेत्र, निवारण शर्तें और उपाय।',
      sa: 'निःशुल्कमङ्गलदोषगणकम्। स्वजन्मकुण्डल्यां मङ्गलदोषः विद्यते किं वेति परीक्षतु।',
    },
    keywords: ['mangal dosha', 'kuja dosha', 'mars dosha', 'manglik', 'mangal dosha calculator', 'manglik check'],
  },
  '/kaal-sarp': {
    title: {
      en: 'Kaal Sarp Dosha Calculator — Check if Present in Your Kundali',
      hi: 'काल सर्प दोष गणक — क्या आपकी कुण्डली में है?',
      sa: 'कालसर्पदोषगणकम् — स्वकुण्डल्यां विद्यते किम्?',
    },
    description: {
      en: 'Free Kaal Sarp Dosha checker. Check all 12 types of Kaal Sarp Yoga based on Rahu-Ketu axis in your birth chart. Severity analysis and remedies.',
      hi: 'निःशुल्क काल सर्प दोष जाँच। राहु-केतु अक्ष के आधार पर सभी 12 प्रकार जाँचें। गम्भीरता विश्लेषण और उपाय।',
      sa: 'निःशुल्ककालसर्पदोषपरीक्षा। राहुकेत्वक्षाधारेण सर्वान् द्वादशप्रकारान् परीक्षतु।',
    },
    keywords: ['kaal sarp dosha', 'kaal sarp yoga', 'rahu ketu dosha', 'kalsarpa dosha check', 'kaal sarp types'],
  },
  '/pitra-dosha': {
    title: {
      en: 'Pitra Dosha Check — Ancestral Karma in Your Birth Chart',
      hi: 'पितृ दोष जाँच — जन्म कुण्डली में पैतृक कर्म',
      sa: 'पितृदोषपरीक्षा — जन्मकुण्डल्यां पैतृककर्म',
    },
    description: {
      en: 'Free Pitra Dosha checker. Analyze Sun-Rahu conjunction, 9th house affliction, and ancestral karma indicators in your Vedic birth chart. Severity and Shraddha remedies.',
      hi: 'निःशुल्क पितृ दोष जाँच। सूर्य-राहु युति, 9वें भाव पीड़ा और पैतृक कर्म संकेतों का विश्लेषण। गम्भीरता और श्राद्ध उपाय।',
      sa: 'निःशुल्कपितृदोषपरीक्षा। सूर्यराहुयुतिः नवमभावपीडा पैतृककर्मसङ्केताश्च विश्लेष्यन्ते।',
    },
    keywords: ['pitra dosha', 'pitru dosha', 'ancestral karma', 'pitra dosha remedies', 'sun rahu conjunction'],
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
    title: { en: 'Devotional Library — Aarti, Chalisa, Stotram, Mantra with Meaning', hi: 'भक्ति संग्रह — आरती, चालीसा, स्तोत्र, मन्त्र अर्थ सहित', sa: 'भक्तिसंग्रहः — आरती चालीसा स्तोत्रं मन्त्रं अर्थसहितम्' },
    description: { en: 'Complete collection of Hindu aartis, chalisas, stotrams and mantras — full Devanagari text, English transliteration, meaning, and significance. Hanuman Chalisa, Gayatri Mantra, Vishnu Sahasranama and 50+ sacred texts.', hi: 'हिन्दू आरती, चालीसा, स्तोत्र और मन्त्रों का सम्पूर्ण संग्रह — पूर्ण देवनागरी पाठ, अंग्रेजी लिप्यन्तरण, अर्थ और महत्व।', sa: 'हिन्दूआरती-चालीसा-स्तोत्र-मन्त्राणां सम्पूर्णसंग्रहः।' },
    keywords: ['aarti', 'chalisa', 'stotram', 'mantra', 'hanuman chalisa', 'gayatri mantra', 'vishnu sahasranama', 'hindu devotional', 'aarti lyrics hindi', 'chalisa in hindi'],
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
  '/rahu-kaal': {
    title: { en: 'Rahu Kaal Today — Exact Start & End Time | Free, No Ads | Dekho Panchang', hi: 'आज का राहु काल — सटीक समय | मुफ़्त, विज्ञापन रहित | Dekho Panchang', sa: 'अद्य राहुकालः — यथार्थसमयः', mai: 'आइ के राहु काल — सटीक समय | मुफ़्त' },
    description: { en: 'Check today\'s Rahu Kaal, Yamaganda & Gulika Kaal times for your city. Computed from Swiss Ephemeris sunrise — accurate to the minute. Also: Choghadiya, Hora, activities to avoid. Free, no ads, 7 languages.', hi: 'आज का राहु काल, यमगण्ड और गुलिक काल — आपके शहर के लिए सटीक समय। स्विस एफेमेरिस सूर्योदय से गणना — मिनट-स्तरीय सटीकता। साथ में: चौघड़िया, होरा, वर्जित कार्य। मुफ़्त, विज्ञापन रहित।', sa: 'अद्य राहुकालस्य यमगण्डस्य गुलिककालस्य च समयाः।' },
    keywords: ['rahu kaal today', 'rahu kalam today', 'rahukaal timings', 'inauspicious time today', 'rahu kaal by city', 'rahu kaal time', 'today rahu kaal', 'आज का राहु काल'],
  },
  '/choghadiya': {
    title: { en: 'Choghadiya Today — Auspicious & Inauspicious Time Slots', hi: 'आज का चौघड़िया — शुभ और अशुभ समय', sa: 'अद्य चौघड़िया — शुभाशुभकालः' },
    description: { en: 'Check today\'s Choghadiya timings — Amrit, Shubh, Labh, Char, Rog, Kaal, Udveg periods. Find the best time for travel, business, and auspicious activities.', hi: 'आज का चौघड़िया समय — अमृत, शुभ, लाभ, चर, रोग, काल, उद्वेग। यात्रा, व्यापार और शुभ कार्यों के लिए सर्वोत्तम समय।', sa: 'अद्यतनचौघड़ियासमयः — अमृत, शुभ, लाभ, चर, रोग, काल, उद्वेग। यात्रायै शुभकार्याय च उत्तमसमयः।' },
    keywords: ['choghadiya today', 'choghadiya timings', 'auspicious time today', 'shubh muhurat'],
  },
  '/hora': {
    title: { en: 'Hora — Planetary Hours Calculator', hi: 'होरा — ग्रह घंटे गणक', sa: 'होरा — ग्रहघण्टागणकम्' },
    description: { en: 'Calculate planetary hours (Hora) for any day and location. Know which planet rules each hour for muhurta selection and daily planning.', hi: 'किसी भी दिन और स्थान के लिए ग्रह होरा गणना करें। मुहूर्त चयन और दैनिक योजना के लिए प्रत्येक घंटे का ग्रह स्वामी जानें।', sa: 'कस्यापि दिनस्य स्थानस्य च कृते ग्रहहोरां गणयतु। मुहूर्तचयनाय दैनिकयोजनायै च प्रत्येकघण्टायाः ग्रहस्वामिनं जानीयात्।' },
    keywords: ['hora', 'planetary hours', 'hora calculator', 'graha hora', 'planetary hour ruler', 'best time for activity'],
  },
  '/chandrabalam': {
    title: { en: 'Chandrabalam Today — Moon Strength for All 12 Signs', hi: 'आज का चन्द्रबल — सभी 12 राशियों के लिए चन्द्र बल', sa: 'अद्य चन्द्रबलम् — द्वादशराशिषु चन्द्रबलम्' },
    description: { en: 'Check today\'s Chandrabalam (Moon strength) for all 12 zodiac signs. See if the Moon\'s transit is favorable or unfavorable for your birth rashi based on Muhurta Chintamani rules.', hi: 'सभी 12 राशियों के लिए आज का चन्द्रबल देखें। मुहूर्त चिन्तामणि नियमों के आधार पर जानें चन्द्र गोचर आपकी जन्म राशि के लिए अनुकूल है या प्रतिकूल।', sa: 'द्वादशराशिषु अद्यतनचन्द्रबलं पश्यतु। मुहूर्तचिन्तामणिनियमानुसारं चन्द्रगोचरः अनुकूलः प्रतिकूलो वा इति जानीयात्।' },
    keywords: ['chandrabalam', 'moon strength', 'chandrabalam today', 'moon transit', 'muhurta chintamani'],
  },
  '/tarabalam': {
    title: { en: 'Tarabalam Today — Star Strength for All 27 Nakshatras', hi: 'आज का ताराबल — सभी 27 नक्षत्रों के लिए तारा बल', sa: 'अद्य ताराबलम् — सप्तविंशतिनक्षत्रेषु ताराबलम्' },
    description: { en: 'Check today\'s Tarabalam (star strength) for all 27 nakshatras. The 9 tara cycle shows which birth nakshatras have favorable or unfavorable star strength today.', hi: 'सभी 27 नक्षत्रों के लिए आज का ताराबल देखें। 9 तारा चक्र दर्शाता है कि किन जन्म नक्षत्रों के लिए आज ताराबल अनुकूल है।', sa: 'सप्तविंशतिनक्षत्रेषु अद्यतनताराबलं पश्यतु। नवताराचक्रः दर्शयति कस्य जन्मनक्षत्रस्य अद्य ताराबलम् अनुकूलम् इति।' },
    keywords: ['tarabalam', 'star strength', 'tarabalam today', 'nakshatra tara', '9 taras'],
  },
  '/chandra-darshan': {
    title: { en: 'Chandra Darshan Today — Moon Sighting Calculator', hi: 'चन्द्र दर्शन — नव चन्द्र दृश्यता गणक', sa: 'चन्द्रदर्शनम् — नवचन्द्रदृश्यतागणकम्' },
    description: { en: 'Is the new crescent Moon visible tonight? Calculate Moon age, elongation, and visibility conditions for your location. Includes upcoming Chandra Darshan dates for 6 months.', hi: 'क्या आज रात नव चन्द्रमा दृश्य है? अपने स्थान के लिए चन्द्र आयु, दूरी और दृश्यता स्थितियों की गणना करें।', sa: 'किम् अद्य रात्रौ नवचन्द्रः दृश्यते? स्वस्थानस्य कृते चन्द्रवयः दूरी दृश्यतास्थितिश्च गणयतु।' },
    keywords: ['chandra darshan', 'moon sighting', 'new moon visibility', 'hilal', 'crescent moon', 'moon age calculator'],
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
  '/sky': {
    title: { en: 'Live Sky Map — Sidereal Planetary Positions Today', hi: 'लाइव आकाश मानचित्र — आज की ग्रह स्थितियाँ', sa: 'नभोमानचित्रम् — अद्य ग्रहस्थितयः' },
    description: { en: 'Real-time polar sky map showing all 9 Vedic grahas at their current sidereal positions (Lahiri ayanamsha). Rashi, nakshatra, retrograde status, and daily speed.', hi: 'वर्तमान साइडेरियल स्थितियों पर सभी 9 वैदिक ग्रहों को दिखाने वाला रियल-टाइम आकाश मानचित्र — राशि, नक्षत्र, वक्री स्थिति।', sa: 'लाहिर्यायनांशेन सह नवग्रहाणां वर्तमानस्थितिं दर्शयत् नभोमानचित्रम्।' },
    keywords: ['live sky map', 'planet positions today', 'vedic astrology sky', 'sidereal planets', 'graha positions'],
  },
  '/muhurat': {
    title: { en: 'Muhurat Calendar — Monthly Auspicious Dates', hi: 'मुहूर्त कैलेंडर — मासिक शुभ तिथियां', sa: 'मुहूर्तपञ्चाङ्गम् — मासिकशुभतिथयः' },
    description: { en: 'Monthly muhurat calendar for marriage, griha pravesh, vehicle purchase, and more. Find the best dates for any activity.', hi: 'विवाह, गृह प्रवेश, वाहन खरीद आदि के लिए मासिक मुहूर्त कैलेंडर।', sa: 'विवाहगृहप्रवेशवाहनक्रयादीनां कृते मासिकमुहूर्तपञ्चाङ्गम्।' },
    keywords: ['muhurat calendar', 'shubh muhurat', 'auspicious dates', 'marriage dates'],
  },

  // ─── Muhurta Type Landing Pages ──────────────────────────────
  '/muhurta/wedding': {
    title: { en: 'Shubh Muhurat for Wedding 2026 | Vivah Muhurat Dates', hi: 'शुभ विवाह मुहूर्त 2026 | विवाह की शुभ तिथियां', sa: 'शुभविवाहमुहूर्तम् २०२६ | विवाहशुभतिथयः' },
    description: { en: 'Find the most auspicious dates for your wedding in 2026. Vivah Muhurat dates based on Panchang, nakshatras, and Vedic astrology rules.', hi: '2026 में अपने विवाह के लिए सबसे शुभ तिथियां खोजें। पंचांग, नक्षत्र और वैदिक ज्योतिष नियमों पर आधारित विवाह मुहूर्त।', sa: '२०२६ वर्षे स्वविवाहस्य कृते शुभतमां तिथिं अन्विष्यतु। पञ्चाङ्गनक्षत्रवैदिकज्योतिषनियमाधारितं विवाहमुहूर्तम्।' },
    keywords: ['wedding muhurat 2026', 'vivah muhurat', 'shadi ka muhurat', 'marriage muhurat dates', 'shubh vivah muhurat 2026'],
  },
  '/muhurta/griha-pravesh': {
    title: { en: 'Griha Pravesh Muhurat 2026 | Housewarming Auspicious Dates', hi: 'गृह प्रवेश मुहूर्त 2026 | गृह प्रवेश शुभ तिथियां', sa: 'गृहप्रवेशमुहूर्तम् २०२६ | गृहप्रवेशशुभतिथयः' },
    description: { en: 'Find auspicious Griha Pravesh dates for 2026. Housewarming muhurat based on Vedic Panchang, fixed nakshatras, and Vastu principles.', hi: '2026 के लिए शुभ गृह प्रवेश तिथियां खोजें। वैदिक पंचांग, स्थिर नक्षत्र और वास्तु सिद्धान्तों पर आधारित।', sa: '२०२६ वर्षस्य कृते शुभगृहप्रवेशतिथीः अन्विष्यतु। वैदिकपञ्चाङ्गस्थिरनक्षत्रवास्तुसिद्धान्ताधारिताः।' },
    keywords: ['griha pravesh muhurat 2026', 'housewarming muhurat', 'griha pravesh dates', 'new house muhurat'],
  },
  '/muhurta/vehicle-purchase': {
    title: { en: 'Vehicle Purchase Muhurat 2026 | Car Buying Auspicious Dates', hi: 'वाहन खरीद मुहूर्त 2026 | गाड़ी खरीदने की शुभ तिथि', sa: 'वाहनक्रयमुहूर्तम् २०२६ | वाहनक्रयशुभतिथयः' },
    description: { en: 'Find the best dates for buying a new car or vehicle in 2026. Vehicle purchase muhurat based on nakshatras, weekdays, and planetary alignments.', hi: '2026 में नई कार या वाहन खरीदने के लिए शुभ तिथियां। नक्षत्र, वार और ग्रह स्थिति पर आधारित।', sa: '२०२६ वर्षे नववाहनक्रयस्य कृते शुभतिथीः। नक्षत्रवारग्रहस्थित्याधारिताः।' },
    keywords: ['vehicle purchase muhurat 2026', 'car buying muhurat', 'vahan kharid muhurat', 'new car muhurat'],
  },
  '/muhurta/business-start': {
    title: { en: 'Business Start Muhurat 2026 | Shop Opening Auspicious Dates', hi: 'व्यापार आरम्भ मुहूर्त 2026 | दुकान खोलने का शुभ मुहूर्त', sa: 'व्यापारारम्भमुहूर्तम् २०२६ | आपणोद्घाटनशुभतिथयः' },
    description: { en: 'Find auspicious dates to start a business or open a shop in 2026. Pushya Nakshatra and other favorable combinations for commercial success.', hi: '2026 में व्यापार शुरू करने या दुकान खोलने की शुभ तिथियां। पुष्य नक्षत्र और अन्य अनुकूल योग।', sa: '२०२६ वर्षे व्यापारारम्भाय आपणोद्घाटनाय वा शुभतिथीः। पुष्यनक्षत्रम् अन्यानि अनुकूलयोगानि च।' },
    keywords: ['business start muhurat 2026', 'shop opening muhurat', 'vyapar muhurat', 'dukan kholne ka muhurat'],
  },
  '/muhurta/naming-ceremony': {
    title: { en: 'Naming Ceremony Muhurat 2026 | Namkaran Sanskar Dates', hi: 'नामकरण मुहूर्त 2026 | नामकरण संस्कार तिथियां', sa: 'नामकरणमुहूर्तम् २०२६ | नामकरणसंस्कारतिथयः' },
    description: { en: 'Find auspicious dates for your baby\'s naming ceremony in 2026. Namkaran Sanskar muhurat based on birth nakshatra and Vedic traditions.', hi: '2026 में शिशु के नामकरण संस्कार के लिए शुभ तिथियां। जन्म नक्षत्र और वैदिक परम्पराओं पर आधारित।', sa: '२०२६ वर्षे शिशोः नामकरणसंस्कारस्य कृते शुभतिथीः। जन्मनक्षत्रवैदिकपरम्पराधारिताः।' },
    keywords: ['naming ceremony muhurat 2026', 'namkaran muhurat', 'baby naming muhurat', 'namkaran sanskar date'],
  },
  '/muhurta/property-purchase': {
    title: { en: 'Property Purchase Muhurat 2026 | Land Buying Auspicious Dates', hi: 'सम्पत्ति क्रय मुहूर्त 2026 | जमीन खरीदने की शुभ तिथि', sa: 'सम्पत्तिक्रयमुहूर्तम् २०२६ | भूमिक्रयशुभतिथयः' },
    description: { en: 'Find auspicious dates for property registration and land purchase in 2026. Best nakshatras and weekdays for real estate transactions.', hi: '2026 में सम्पत्ति पंजीकरण और जमीन खरीद के लिए शुभ तिथियां। अचल सम्पत्ति लेनदेन के लिए सर्वोत्तम नक्षत्र और वार।', sa: '२०२६ वर्षे सम्पत्तिपञ्जीकरणभूमिक्रयस्य कृते शुभतिथीः।' },
    keywords: ['property purchase muhurat 2026', 'land purchase muhurat', 'bhumi kray muhurat', 'plot registration muhurat'],
  },
  '/muhurta/mundan': {
    title: { en: 'Mundan Muhurat 2026 | First Haircut Ceremony Dates', hi: 'मुंडन मुहूर्त 2026 | मुंडन संस्कार तिथियां', sa: 'मुण्डनमुहूर्तम् २०२६ | मुण्डनसंस्कारतिथयः' },
    description: { en: 'Find auspicious dates for Mundan (Chudakarana) ceremony in 2026. First haircut muhurat based on child\'s age, nakshatras, and Vedic rules.', hi: '2026 में मुंडन (चूड़ाकरण) संस्कार के लिए शुभ तिथियां। बच्चे की आयु, नक्षत्र और वैदिक नियमों पर आधारित।', sa: '२०२६ वर्षे मुण्डनसंस्कारस्य कृते शुभतिथीः। शिशोः वयसः नक्षत्राणां वैदिकनियमानां च आधारेण।' },
    keywords: ['mundan muhurat 2026', 'mundan sanskar date', 'chudakarana muhurat', 'first haircut muhurat'],
  },
  '/muhurta/annaprashan': {
    title: { en: 'Annaprashan Muhurat 2026 | First Feeding Ceremony Dates', hi: 'अन्नप्राशन मुहूर्त 2026 | अन्नप्राशन संस्कार तिथियां', sa: 'अन्नप्राशनमुहूर्तम् २०२६ | अन्नप्राशनसंस्कारतिथयः' },
    description: { en: 'Find auspicious dates for Annaprashan (first rice feeding) in 2026. Rice ceremony muhurat based on baby\'s age, nakshatras, and traditions.', hi: '2026 में अन्नप्राशन (पहला अन्न) संस्कार के लिए शुभ तिथियां। शिशु की आयु, नक्षत्र और परम्पराओं पर आधारित।', sa: '२०२६ वर्षे अन्नप्राशनसंस्कारस्य कृते शुभतिथीः।' },
    keywords: ['annaprashan muhurat 2026', 'first feeding ceremony date', 'rice ceremony muhurat', 'anna prashan date'],
  },
  '/muhurta/upanayana': {
    title: { en: 'Upanayana Muhurat 2026 | Thread Ceremony Auspicious Dates', hi: 'उपनयन मुहूर्त 2026 | जनेऊ संस्कार शुभ तिथियां', sa: 'उपनयनमुहूर्तम् २०२६ | उपनयनसंस्कारशुभतिथयः' },
    description: { en: 'Find auspicious dates for Upanayana (sacred thread ceremony) in 2026. Janeu Sanskar muhurat based on age, nakshatras, and classical rules.', hi: '2026 में उपनयन (जनेऊ संस्कार) के लिए शुभ तिथियां। आयु, नक्षत्र और शास्त्रीय नियमों पर आधारित।', sa: '२०२६ वर्षे उपनयनस्य (यज्ञोपवीतसंस्कारस्य) कृते शुभतिथीः।' },
    keywords: ['upanayana muhurat 2026', 'thread ceremony muhurat', 'janeu sanskar date', 'sacred thread ceremony date'],
  },
  '/muhurta/travel': {
    title: { en: 'Travel Muhurat 2026 | Auspicious Times to Start a Journey', hi: 'यात्रा मुहूर्त 2026 | यात्रा का शुभ मुहूर्त', sa: 'यात्रामुहूर्तम् २०२६ | यात्रारम्भशुभसमयः' },
    description: { en: 'Find the best auspicious times for starting a journey in 2026. Travel muhurat based on nakshatras, Rahu Kaal, and directional analysis.', hi: '2026 में यात्रा शुरू करने के लिए शुभ समय। नक्षत्र, राहु काल और दिशा विश्लेषण पर आधारित यात्रा मुहूर्त।', sa: '२०२६ वर्षे यात्रारम्भस्य कृते शुभसमयः। नक्षत्रराहुकालदिक्विश्लेषणाधारितं यात्रामुहूर्तम्।' },
    keywords: ['travel muhurat 2026', 'yatra muhurat', 'journey muhurat', 'safe travel time astrology'],
  },
  '/regional': {
    title: { en: 'Regional Hindu Calendars — Tamil, Telugu, Bengali, Gujarati', hi: 'क्षेत्रीय हिन्दू कैलेंडर', sa: 'प्रादेशिकहिन्दूपञ्चाङ्गानि' },
    description: { en: 'Regional Hindu calendar variants — Tamil, Telugu, Bengali, Marathi, Gujarati, Malayalam, and Kannada Panchang.', hi: 'तमिल, तेलुगु, बंगाली, मराठी, गुजराती, मलयालम और कन्नड़ पंचांग।', sa: 'तमिलतेलुगुबङ्गालमराठीगुजरातीमलयालकन्नडपञ्चाङ्गानि।' },
    keywords: ['tamil calendar', 'telugu calendar', 'bengali calendar', 'regional panchang'],
  },
  '/calendar/regional/tamil': {
    // Tamil script in title helps this result stand out for Tamil-speaking searches
    title: { en: 'Tamil Calendar (தமிழ் நாள்காட்டி) 2026 — Panchangam & Festivals | Dekho Panchang', hi: 'तमिल कैलेंडर (தமிழ் நாள்காட்டி) 2026 — पंचांगम् और त्योहार | Dekho Panchang', sa: 'तमिलपञ्चाङ्गम् (தமிழ் நாள்காட்டி) 2026 — पर्वाणि च।' },
    description: { en: 'Complete Tamil Panchangam guide — 12 solar months from Chithirai to Panguni, festivals like Pongal, Chithirai Thiruvizha, Karthigai Deepam, and how Tamil calendar differs from North Indian systems.', hi: 'सम्पूर्ण तमिल पंचांगम् — चित्तिरै से पंगुनि तक 12 सौर मास, पोंगल, चित्तिरै तिरुविळा, कार्तिगै दीपम् जैसे त्योहार।', sa: 'सम्पूर्णतमिलपञ्चाङ्गम् — चित्तिरैतः पङ्गुनिपर्यन्तं १२ सौरमासाः पर्वाणि च।' },
    keywords: ['tamil calendar', 'tamil panchangam', 'tamil months', 'pongal', 'puthandu', 'chithirai', 'karthigai deepam', 'தமிழ் நாள்காட்டி', 'தமிழ் பஞ்சாங்கம்'],
  },
  '/calendar/regional/bengali': {
    // Bengali script (বাংলা) in title makes this result stand out for Bangladeshi users searching in their script
    title: { en: 'Bengali Calendar (বাংলা পঞ্জিকা) 2026 — Tithi, Festivals & Ekadashi | Dekho Panchang', hi: 'बंगाली पंचांग (বাংলা পঞ্জিকা) 2026 — तिथि, त्योहार और एकादशी | Dekho Panchang', sa: 'বাংলা পঞ্জিকা 2026 — बङ्गालपञ्जिका पर्वाणि च।' },
    description: { en: 'Complete Bengali Panjika guide — 12 months from Boishakh to Choitro, Durga Puja schedule, Poila Boishakh, Kali Puja, Saraswati Puja, and how Bengali calendar differs from other systems.', hi: 'सम्पूर्ण बंगाली पंजिका — बैशाख से चैत्र तक 12 मास, दुर्गा पूजा, पहला बैशाख, काली पूजा, सरस्वती पूजा।', sa: 'সম্পূর্ণ বাংলা পঞ্জিকা — বৈশাখ থেকে চৈত্র।' },
    keywords: ['bengali calendar', 'bangla panjika', 'bengali months', 'durga puja', 'poila boishakh', 'kali puja', 'saraswati puja', 'বাংলা পঞ্জিকা', 'বাংলা ক্যালেন্ডার'],
  },
  '/calendar/regional/gujarati': {
    // Gujarati script (ગુજરાતી) in title makes this result stand out for Gujarati-script searchers
    title: {
      en: 'ગુજરાતી પંચાંગ (Gujarati Calendar) 2026 — તિથિ, તહેવાર, એકાદશી | Dekho Panchang',
      hi: 'ગુજરાતી પંચાંગ (गुजराती कैलेंडर) 2026 — तिथि, त्योहार, एकादशी | Dekho Panchang',
      sa: 'ગુજરાતી પંચાંગ 2026 — गुजरातपञ्चाङ्गम् पर्वाणि च।',
      gu: 'ગુજરાતી પંચાંગ 2026 — તિથિ, નક્ષત્ર, વ્રત અને ગુજરાતી તહેવારો | Dekho Panchang',
    },
    description: {
      en: 'Complete Gujarati Panchang — Vikram Samvat calendar, Uttarayan (Makar Sankranti), Navratri, Diwali & Bestu Varas (Gujarati New Year), Janmashtami. Tithi, Ekadashi, and key festival dates for the Gujarati community worldwide.',
      hi: 'सम्पूर्ण गुजराती पंचांग — विक्रम सम्वत, उत्तरायण, नवरात्रि, दीवाली और बेस्तु वारस (गुजराती नव वर्ष), जन्माष्टमी। विश्व भर के गुजराती समुदाय के लिए तिथि, एकादशी और मुख्य त्योहारों की तारीखें।',
      sa: 'सम्पूर्णगुजरातपञ्चाङ्गम् — विक्रमसम्वत् उत्तरायणम् नवरात्रिः दीपावली बेस्तुवारस् च।',
      gu: 'ગુજરાત અને વિશ્વભરના ગુજરાતી સમુદાય માટે સંપૂર્ણ વૈદિક પંચાંગ. વિક્રમ સંવત, તિથિ, નવરાત્રિ, દિવાળી, જન્માષ્ટમી તારીખો.',
    },
    keywords: ['gujarati panchang', 'gujarati calendar 2026', 'vikram samvat', 'uttarayan', 'navratri gujarat', 'bestu varas', 'gujarati new year', 'diwali 2026', 'ગુજરાતી પંચાંગ', 'gujarati tithi today'],
  },
  '/about': {
    title: { en: 'About Dekho Panchang — Vedic Astronomy Made Accessible', hi: 'देखो पंचांग के बारे में', sa: 'देखोपञ्चाङ्गस्य विषये' },
    description: { en: 'Dekho Panchang brings the precision of Vedic astronomical calculations to the modern web. Built with pure mathematics, no external APIs.', hi: 'देखो पंचांग वैदिक खगोलीय गणनाओं की सटीकता को आधुनिक वेब पर लाता है।', sa: 'देखोपञ्चाङ्गं वैदिकखगोलगणनानां सम्यक्तां आधुनिकजालपृष्ठे आनयति।' },
    keywords: ['about dekho panchang', 'vedic astronomy', 'panchang calculator'],
  },
  '/vs/drik-panchang': {
    title: { en: 'Dekho Panchang vs Drik Panchang — Feature Comparison 2026', hi: 'देखो पंचांग vs दृक् पंचांग — सुविधा तुलना 2026', sa: 'देखोपञ्चाङ्गं विरुद्ध दृक्पञ्चाङ्गम् — सुविधातुलना' },
    description: { en: 'Objective feature comparison between Dekho Panchang and Drik Panchang. AI interpretation, Muhurta AI, 10 languages, 106-module learning path, modern UI vs legacy platform.', hi: 'देखो पंचांग और दृक् पंचांग के बीच निष्पक्ष सुविधा तुलना। AI व्याख्या, मुहूर्त AI, 10 भाषाएँ, 106-मॉड्यूल शिक्षण पथ, आधुनिक UI।', sa: 'देखोपञ्चाङ्गस्य दृक्पञ्चाङ्गस्य च सुविधातुलना।' },
    keywords: ['dekho panchang vs drik panchang', 'panchang comparison', 'best panchang app', 'vedic astrology platform comparison', 'drik panchang alternative'],
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
  '/panchang/nivas': {
    title: { en: 'Nivas & Shool — Directional & Elemental Energies Today', hi: 'निवास और शूल — आज की दिशात्मक और तात्विक ऊर्जाएं', sa: 'निवासः शूलश्च — अद्यतनदिशात्मकतात्विकशक्तयः' },
    description: { en: 'Disha Shool, Shiva Vaas, Agni Vaas, Chandra Vaas, and Rahu Vaas for today. Directional and elemental energies that influence rituals and activities.', hi: 'आज के लिए दिशा शूल, शिव वास, अग्नि वास, चंद्र वास और राहु वास। अनुष्ठानों और गतिविधियों को प्रभावित करने वाली दिशात्मक और तात्विक ऊर्जाएं।', sa: 'अद्य दिशाशूलः शिववासः अग्निवासः चन्द्रवासः राहुवासश्च। अनुष्ठानानि कार्याणि च प्रभावयन्त्यः दिशात्मकतात्विकशक्तयः।' },
    keywords: ['disha shool', 'shiva vaas', 'agni vaas', 'chandra vaas', 'rahu vaas', 'nivas shool panchang'],
  },
  '/panchang/planets': {
    title: { en: 'Planetary Positions Today — Navagraha in Signs & Nakshatras', hi: 'आज की ग्रह स्थिति — राशि और नक्षत्र में नवग्रह', sa: 'अद्यतनग्रहस्थितिः — राशिनक्षत्रेषु नवग्रहाः' },
    description: { en: "Today's Navagraha positions — Sun, Moon, Mars, Mercury, Jupiter, Venus, Saturn, Rahu, Ketu with sign, longitude, nakshatra, and retrograde status.", hi: 'आज की नवग्रह स्थिति — सूर्य, चंद्र, मंगल, बुध, गुरु, शुक्र, शनि, राहु, केतु की राशि, अंश, नक्षत्र और वक्री स्थिति।', sa: 'अद्यतननवग्रहस्थितिः — सूर्यचन्द्रमङ्गलबुधगुरुशुक्रशनिराहुकेतुनां राशिः अंशः नक्षत्रं वक्रत्वं च।' },
    keywords: ['planetary positions today', 'navagraha', 'graha sthiti', 'planet signs', 'retrograde planets'],
  },
  '/panchang/remedies': {
    title: { en: "Today's Vedic Remedies — Mantras, Charity, Gemstones", hi: 'आज के वैदिक उपाय — मंत्र, दान, रत्न', sa: 'अद्यतनवैदिकोपचाराः — मन्त्राः दानं रत्नानि च' },
    description: { en: "Vara-based remedy prescriptions for today — Beej Mantra, recommended charity, lucky color, gemstone, and optimal Hora windows for maximum effect.", hi: 'आज के वार-आधारित उपाय — बीज मंत्र, अनुशंसित दान, शुभ रंग, रत्न और अधिकतम प्रभाव के लिए इष्ट होरा समय।', sa: 'अद्यतनवाराधारितोपचाराः — बीजमन्त्रः अनुशंसितदानं शुभवर्णः रत्नं च।' },
    keywords: ['vedic remedies today', 'beej mantra', 'vara remedies', 'daily remedies', 'gemstone recommendation'],
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
  '/learn/ayurveda-jyotish': {
    title: { en: 'Ayurveda & Jyotish — The Twin Vedic Sciences', hi: 'आयुर्वेद एवं ज्योतिष — जुड़वाँ वैदिक विद्याएँ', sa: 'आयुर्वेदज्योतिषम् — युग्मवैदिकविद्ये' },
    description: { en: 'Deep connection between Ayurveda and Vedic Astrology: Prakriti from birth chart, Kala Purusha body mapping, dasha health windows, Ritu-dosha cycles, planetary herbs and remedies.', hi: 'आयुर्वेद और वैदिक ज्योतिष का गहन सम्बन्ध: जन्म कुण्डली से प्रकृति, काल पुरुष, दशा स्वास्थ्य, ऋतु-दोष चक्र, ग्रह जड़ी-बूटियाँ।', sa: 'आयुर्वेदवैदिकज्योतिषयोः गहनसम्बन्धः।' },
    keywords: ['ayurveda astrology', 'prakriti birth chart', 'kala purusha', 'dosha planets', 'vedic health', 'planetary herbs'],
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

  '/learn/retrograde-visualizer': {
    title: { en: 'Retrograde Motion Visualizer — Interactive Animation', hi: 'वक्री गति दृश्यावलोकन — अन्तरक्रियात्मक चित्रण', sa: 'वक्रीगतिदृश्यावलोकनम्' },
    description: { en: 'Interactive Canvas animation showing why planets appear to reverse direction. Heliocentric and geocentric views, planet selector, speed controls.', hi: 'अन्तरक्रियात्मक चित्रण जो दिखाता है कि ग्रह उल्टी दिशा में क्यों जाते प्रतीत होते हैं। सौर-केन्द्रीय और भू-केन्द्रीय दृश्य।', sa: 'वक्रीगतिकारणं दर्शयत् अन्तरक्रियात्मकं चित्रणम्।' },
    keywords: ['retrograde motion', 'retrograde visualizer', 'vakri graha animation', 'planetary retrograde explained'],
  },

  '/learn/yoga-animator': {
    title: { en: 'Yoga Formation Animator — Watch Jyotish Yogas Form', hi: 'योग निर्माण एनीमेटर — ज्योतिष योग बनते देखें', sa: 'योगनिर्माणचित्रणम्' },
    description: { en: 'Interactive step-by-step animation showing how planets form classical Vedic astrology yogas. Mahapurusha, Raja, Dhana, Lunar, and Dosha yogas with condition checklists.', hi: 'अन्तरक्रियात्मक एनीमेशन जो दिखाता है कि ग्रह कैसे वैदिक ज्योतिष योग बनाते हैं। महापुरुष, राज, धन, चन्द्र और दोष योग।', sa: 'ग्रहाः कथं ज्योतिषयोगान् निर्मान्ति तद्दर्शकं चित्रणम्।' },
    keywords: ['yoga formation', 'jyotish yoga animation', 'mahapurusha yoga', 'raja yoga', 'gajakesari yoga', 'vedic astrology yogas interactive'],
  },

  '/learn/advanced-houses': {
    title: { en: 'MKS, Badhaka, Maraka — Advanced House Concepts', hi: 'मारक कारक स्थान, बाधक, मारक', sa: 'मारककारकस्थानम् बाधकः मारकश्च' },
    description: { en: 'Marana Karaka Sthana (death places), Badhakesh (obstruction lord), Maraka (death-inflicting lords), and functional benefic/malefic per lagna.', hi: 'मारक कारक स्थान, बाधकेश, मारक ग्रह, और प्रत्येक लग्न के लिए कार्यात्मक शुभ/अशुभ।', sa: 'मारककारकस्थानम् बाधकेशः मारकग्रहाः प्रतिलग्नं कार्यात्मकशुभाशुभाश्च।' },
    keywords: ['marana karaka sthana', 'badhaka', 'maraka', 'yogakaraka', 'functional malefic'],
  },
  '/learn/bhava-chalit': {
    title: { en: 'Bhava Chalit — House System Explained', hi: 'भाव चलित — भाव पद्धति की व्याख्या', sa: 'भावचलितम् — भावपद्धतिव्याख्या' },
    description: { en: 'Understand the Bhava Chalit chart: how it differs from the Rashi chart, when to use it, the expert debate on whole-sign vs house-based systems, and worked examples.', hi: 'भाव चलित कुण्डली को समझें: राशि कुण्डली से कैसे भिन्न है, कब उपयोग करें, और विशेषज्ञ बहस।', sa: 'भावचलितकुण्डलीं जानीत — राशिकुण्डल्याः भेदः, विशेषज्ञविवादश्च।' },
    keywords: ['bhava chalit', 'house system', 'equal house', 'sripati', 'bhava madhya', 'rashi vs bhava chalit'],
  },
  '/learn/compatibility': {
    title: { en: 'Advanced Compatibility — Beyond Ashta Kuta', hi: 'उन्नत अनुकूलता — अष्ट कूट से परे', sa: 'उन्नतमेलनम् — अष्टकूटात् परम्' },
    description: { en: 'Chart-level marriage compatibility: 7th house comparison, Venus assessment, Navamsha matching, dasha compatibility, Mangal Dosha full analysis.', hi: 'चार्ट-स्तरीय विवाह अनुकूलता: 7वां भाव, शुक्र, नवांश, दशा अनुकूलता, मंगल दोष।', sa: 'चक्रस्तरीयविवाहमेलनम् — सप्तमभावः शुक्रः नवांशः दशामेलनम् मङ्गलदोषश्च।' },
    keywords: ['advanced compatibility', 'chart matching', 'navamsha compatibility', 'mangal dosha full'],
  },
  '/learn/compatibility-advanced': {
    title: { en: 'Advanced Compatibility — Dasha Alignment & Rajju Dosha', hi: 'उन्नत अनुकूलता — दशा संरेखण एवं राज्जु दोष', sa: 'उन्नतमेलनम् — दशासंरेखणं राज्जुदोषश्च' },
    description: { en: 'Dasha comparison in synastry and Rajju Dosha (South Indian nakshatra cord matching). Worked examples, 27-nakshatra Rajju mapping table, cancellation conditions, compatibility flowchart.', hi: 'सिनैस्ट्री में दशा तुलना और राज्जु दोष (दक्षिण भारतीय नक्षत्र रज्जु मिलान)। कार्यरत उदाहरण, 27-नक्षत्र राज्जु तालिका, निरसन शर्तें।', sa: 'सिनैस्ट्रीदशातुलना राज्जुदोषश्च — उदाहरणानि, नक्षत्रराज्जुतालिका, निरसनशर्ताः।' },
    keywords: ['dasha comparison', 'rajju dosha', 'nakshatra cord', 'south indian matching', 'dasha sandhi'],
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
  '/learn/ashtakavarga-dasha': {
    title: { en: 'Ashtakavarga Dasha — Timing Predictions from Bindu Scores', hi: 'अष्टकवर्ग दशा — बिन्दु अंकों से समय भविष्यवाणी', sa: 'अष्टकवर्गदशा — बिन्दुअङ्कैः कालभविष्यवाणी' },
    description: { en: 'Predict Maha Dasha quality using Ashtakavarga bindu totals. Step-by-step method from BPHS Ch.66-72 with transit scoring, Kakshya timing, and practical prediction rules.', hi: 'अष्टकवर्ग बिन्दु योग से महा दशा गुणवत्ता की भविष्यवाणी। BPHS अ.66-72 से चरणबद्ध विधि।', sa: 'अष्टकवर्गबिन्दुयोगैः महादशागुणवत्तायाः भविष्यवाणी।' },
    keywords: ['ashtakavarga dasha', 'dasha prediction', 'bindu scoring', 'transit timing', 'BPHS ashtakavarga'],
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
  '/learn/nadi-amsha': {
    title: { en: 'Nadi Amsha (D-150) — The Finest Divisional Chart', hi: 'नाडी अंश (D-150) — सूक्ष्मतम विभागीय चार्ट', sa: 'नाडीअंशः (D-150) — सूक्ष्मतमविभागीयचक्रम्' },
    description: { en: 'Understanding Nadi Amsha (D-150): the 150th divisional chart for subtle karmic analysis, twin differentiation, and birth time rectification. Calculation method, classical sources, and interpretation.', hi: 'नाडी अंश (D-150): सूक्ष्म कार्मिक विश्लेषण, जुड़वाँ विभेदन और जन्म समय शोधन के लिए 150वाँ विभागीय चार्ट।', sa: 'नाडीअंशः (D-150): सूक्ष्मकर्मविश्लेषणाय यमकविभेदनाय जन्मकालशोधनाय च 150तमविभागीयचक्रम्।' },
    keywords: ['nadi amsha', 'd-150', 'divisional chart', 'varga', 'nadi astrology', 'twin differentiation', 'birth time rectification'],
  },
  '/learn/pancha-pakshi': {
    title: { en: 'Pancha Pakshi -- The Five Bird System', hi: 'पंच पक्षी -- पांच पक्षी प्रणाली', sa: 'पञ्चपक्षी -- पञ्चपक्षिप्रणाली' },
    description: { en: 'Pancha Pakshi Shastra: ancient Tamil timing system using five birds (Vulture, Owl, Crow, Cock, Peacock). Birth nakshatra determines your ruling bird and optimal activity windows throughout the day.', hi: 'पंच पक्षी शास्त्र: पांच पक्षियों पर आधारित प्राचीन तमिल समय प्रणाली। जन्म नक्षत्र से शासक पक्षी और दिन भर की गतिविधियों का निर्धारण।', sa: 'पञ्चपक्षीशास्त्रम्: पञ्चपक्षिभिः आधारिता प्राचीना तमिलसमयप्रणाली। जन्मनक्षत्रात् शासकपक्षी दिवसगतिविधीनां च निर्धारणम्।' },
    keywords: ['pancha pakshi', 'five birds', 'tamil astrology', 'kerala astrology', 'timing system', 'nakshatra bird'],
  },
  '/learn/dasha-sandhi': {
    title: { en: 'Dasha Sandhi — Junction Periods Between Planetary Dashas', hi: 'दशा सन्धि — ग्रह दशाओं के संक्रमण काल', sa: 'दशासन्धिः — ग्रहदशासंक्रमणकालाः' },
    description: { en: 'Understanding Dasha Sandhi — the critical transition windows between Maha, Antar, and Pratyantar Dashas. Calculation method, effects, and remedies from BPHS and Phaladeepika.', hi: 'दशा सन्धि — महादशा, अन्तर्दशा और प्रत्यन्तर दशा के बीच के संवेदनशील संक्रमण काल। गणना, प्रभाव और उपाय।', sa: 'दशासन्धिः — महादशान्तर्दशाप्रत्यन्तरदशानां मध्ये संवेदनशीलसंक्रमणकालाः। गणना प्रभावः उपायाश्च।' },
    keywords: ['dasha sandhi', 'dasha transition', 'maha dasha sandhi', 'planetary period junction', 'dasha change effects'],
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

  // ─── Learn core topics (missing entries — added for canonical coverage) ───────
  '/learn/grahas': {
    title: { en: 'The Nine Grahas (Planets) in Vedic Astrology', hi: 'वैदिक ज्योतिष में नव ग्रह', sa: 'वैदिकज्योतिषे नवग्रहाः' },
    description: { en: 'Complete guide to the nine Grahas: Sun, Moon, Mars, Mercury, Jupiter, Venus, Saturn, Rahu, Ketu — their significations, natures, and roles in Jyotish.', hi: 'नौ ग्रहों का सम्पूर्ण मार्गदर्शन — सूर्य, चन्द्र, मंगल, बुध, बृहस्पति, शुक्र, शनि, राहु, केतु।', sa: 'नवग्रहाणां सम्पूर्णमार्गदर्शनम्।' },
    keywords: ['grahas vedic astrology', 'nine planets jyotish', 'navagraha', 'planets in astrology'],
  },
  '/learn/rashis': {
    title: { en: 'The 12 Rashis (Zodiac Signs) in Vedic Astrology', hi: 'वैदिक ज्योतिष में 12 राशियाँ', sa: 'वैदिकज्योतिषे द्वादशराशयः' },
    description: { en: 'Learn the 12 Rashis from Mesha to Meena — their elements, qualities, ruling planets, and meanings in Jyotish birth chart interpretation.', hi: 'मेष से मीन तक 12 राशियाँ — तत्त्व, गुण, स्वामी ग्रह और जन्म कुण्डली में अर्थ।', sa: 'मेषादिमीनान्तं द्वादशराशयः।' },
    keywords: ['12 rashis', 'zodiac signs vedic', 'mesha aries', 'vedic zodiac'],
  },
  '/learn/nakshatras': {
    title: { en: 'The 27 Nakshatras — Lunar Mansions in Jyotish', hi: '27 नक्षत्र — ज्योतिष में चन्द्र मंडल', sa: 'सप्तविंशतिनक्षत्राणि — ज्योतिषे चन्द्रमण्डलम्' },
    description: { en: 'Complete reference for all 27 Nakshatras — their deities, ruling planets, qualities, syllables, and roles in birth chart analysis and muhurta.', hi: '27 नक्षत्रों का सम्पूर्ण संदर्भ — देवता, स्वामी ग्रह, गुण, अक्षर और कुण्डली विश्लेषण में भूमिका।', sa: 'सर्वेषां सप्तविंशतिनक्षत्राणां सम्पूर्णः सन्दर्भः।' },
    keywords: ['27 nakshatras', 'lunar mansions', 'nakshatra astrology', 'birth star'],
  },
  '/learn/tithis': {
    title: { en: 'Tithis — The 30 Lunar Days in Hindu Calendar', hi: 'तिथियाँ — हिन्दू पंचांग में 30 चन्द्र दिवस', sa: 'तिथयः — हिन्दुपञ्चाङ्गे त्रिंशच्चन्द्रदिवसाः' },
    description: { en: 'Learn the 30 Tithis of the Hindu lunar month — from Pratipada to Amavasya. Their meanings, ruling deities, auspicious and inauspicious nature.', hi: 'प्रतिपदा से अमावस्या तक 30 तिथियाँ — अर्थ, अधिदेवता, शुभ और अशुभ स्वभाव।', sa: 'प्रतिपदादि अमावस्यान्तं त्रिंशत् तिथयः।' },
    keywords: ['tithi', 'lunar day', 'panchang tithi', 'pratipada purnima amavasya'],
  },
  '/learn/yogas': {
    title: { en: 'Yogas in Vedic Astrology — Raj, Dhana, Dosha Yogas', hi: 'वैदिक ज्योतिष में योग — राज, धन, दोष योग', sa: 'वैदिकज्योतिषे योगाः — राजयोगः धनयोगः' },
    description: { en: 'Master the major yogas of Jyotish — Pancha Mahapurusha, Raj Yoga, Dhana Yoga, Neecha Bhanga, and dosha yogas. How they form and what they mean in your chart.', hi: 'पञ्च महापुरुष, राज योग, धन योग, नीच भंग और दोष योगों की सम्पूर्ण जानकारी।', sa: 'पञ्चमहापुरुषाः राजयोगाः धनयोगाः नीचभङ्गाश्च।' },
    keywords: ['yogas in astrology', 'raj yoga', 'dhana yoga', 'pancha mahapurusha'],
  },
  '/learn/karanas': {
    title: { en: 'Karanas — The 11 Half-Day Units in Panchang', hi: 'करण — पंचांग में 11 अर्द्ध-दिवस इकाइयाँ', sa: 'करणानि — पञ्चाङ्गे एकादशार्धदिवसाः' },
    description: { en: 'Learn the 11 Karanas (half-Tithis) used in Panchang: Bava, Balava, Kaulava, Taitila, Garaja, Vanija, Vishti (Bhadra), Sakuni, Chatushpada, Naga, Kimstughna.', hi: '11 करण — बव, बालव, कौलव, तैतिल, गर, वणिज, विष्टि, शकुनि, चतुष्पद, नाग, किंस्तुघ्न।', sa: 'पञ्चाङ्गस्य एकादशकरणानि।' },
    keywords: ['karana panchang', 'half tithi', 'bhadra karana', 'vishti karana'],
  },
  '/learn/muhurtas': {
    title: { en: 'Muhurta — Auspicious Timing in Vedic Astrology', hi: 'मुहूर्त — वैदिक ज्योतिष में शुभ समय', sa: 'मुहूर्तः — वैदिकज्योतिषे शुभकालः' },
    description: { en: 'Learn how to choose auspicious Muhurtas for marriage, travel, business, and ceremonies. Tithi, Nakshatra, Vara, and Yoga combinations explained.', hi: 'विवाह, यात्रा, व्यापार और उत्सवों के लिए शुभ मुहूर्त कैसे चुनें।', sa: 'विवाहयात्राव्यापारोत्सवेभ्यः शुभमुहूर्तचयनम्।' },
    keywords: ['muhurta', 'auspicious timing', 'shubh muhurat', 'vedic timing'],
  },
  '/learn/muhurta-selection': {
    title: { en: 'Muhurta Selection — Classical Rules for Choosing Auspicious Times', hi: 'मुहूर्त चयन — शुभ समय निर्धारण के शास्त्रीय नियम', sa: 'मुहूर्तचयनम् — शुभकालनिर्धारणस्य शास्त्रीयनियमाः' },
    description: { en: 'Learn the classical rules for selecting auspicious Muhurtas for marriage and ceremonies. Nakshatra, Tithi, Lagna, Venus/Jupiter combustion, and Panchanga Shuddhi from Muhurta Chintamani and Dharmasindhu.', hi: 'विवाह व संस्कारों हेतु शुभ मुहूर्त चयन के शास्त्रीय नियम। मुहूर्त चिन्तामणि और धर्मसिन्धु से नक्षत्र, तिथि, लग्न, शुक्र/गुरु अस्त और पंचांग शुद्धि।', sa: 'विवाहसंस्कारेभ्यः शुभमुहूर्तचयनस्य शास्त्रीयनियमाः।' },
    keywords: ['muhurta selection', 'vivah muhurat', 'marriage muhurta rules', 'panchanga shuddhi', 'lagna muhurta', 'venus combustion marriage', 'muhurta chintamani'],
  },
  '/learn/eclipses': {
    title: { en: 'Grahan — Eclipses in Vedic Astrology', hi: 'ग्रहण — वैदिक ज्योतिष में ग्रहण', sa: 'ग्रहणम् — वैदिकज्योतिषे सूर्यचन्द्रग्रहणम्' },
    description: { en: 'Complete guide to solar and lunar eclipses in Jyotish — the Rahu-Ketu mythology, how eclipses are calculated, eclipse types, Sutak rules, and eclipse effects in your Kundali.', hi: 'ज्योतिष में सूर्य और चन्द्र ग्रहणों की सम्पूर्ण मार्गदर्शिका — राहु-केतु पौराणिक कथा, गणना, प्रकार, सूतक नियम और कुण्डली में प्रभाव।', sa: 'ज्योतिषे सूर्यचन्द्रग्रहणानाम् सम्पूर्णः मार्गदर्शिका।' },
    keywords: ['grahan vedic astrology', 'solar eclipse jyotish', 'lunar eclipse sutak', 'rahu ketu eclipse', 'eclipse kundali'],
  },
  '/learn/kundali': {
    title: { en: 'Reading a Kundali — Vedic Birth Chart Interpretation', hi: 'कुण्डली पढ़ना — वैदिक जन्म कुण्डली व्याख्या', sa: 'कुण्डलीपठनम् — वैदिकजन्मकुण्डलीव्याख्या' },
    description: { en: 'Step-by-step guide to reading a Vedic birth chart (Kundali): houses, planets, signs, aspects, dashas, and yogas. From beginner to advanced interpretation.', hi: 'वैदिक जन्म कुण्डली पढ़ने की चरणबद्ध मार्गदर्शिका — भाव, ग्रह, राशि, दशा और योग।', sa: 'वैदिकजन्मकुण्डलीपठनस्य क्रमबद्धमार्गदर्शिका।' },
    keywords: ['how to read kundali', 'birth chart interpretation', 'jyotish chart', 'kundali reading'],
  },
  '/learn/lagna': {
    title: { en: 'Lagna (Ascendant) — The Most Important Point in Kundali', hi: 'लग्न — कुण्डली का सबसे महत्त्वपूर्ण बिन्दु', sa: 'लग्नम् — कुण्डल्यां सर्वाधिकमहत्त्वपूर्णः बिन्दुः' },
    description: { en: 'Understand the Lagna (rising sign / ascendant) in Vedic astrology — how it is calculated, its role as chart ruler, and its meaning for personality and life path.', hi: 'वैदिक ज्योतिष में लग्न — गणना, कुण्डली में भूमिका और व्यक्तित्व पर प्रभाव।', sa: 'वैदिकज्योतिषे लग्नस्य गणना कुण्डल्यां भूमिका च।' },
    keywords: ['lagna astrology', 'ascendant vedic', 'rising sign jyotish', 'udaya lagna'],
  },
  '/learn/matching': {
    title: { en: 'Kundali Matching — How Guna Milan Works', hi: 'कुण्डली मिलान — गुण मिलान कैसे काम करता है', sa: 'कुण्डलीमेलनम् — गुणमेलनं कथं कार्यं करोति' },
    description: { en: 'Learn the 8-factor Ashta Kuta Guna Milan system for marriage compatibility — Varna, Vashya, Tara, Yoni, Graha Maitri, Gana, Bhakoot, Nadi, and Nadi Dosha.', hi: 'विवाह अनुकूलता के लिए अष्ट कूट गुण मिलान — वर्ण, वश्य, तारा, योनि, ग्रह मैत्री, गण, भकूट, नाड़ी।', sa: 'विवाहानुकूलतायां अष्टकूटगुणमेलनम्।' },
    keywords: ['kundali matching', 'guna milan', 'ashta kuta', 'marriage compatibility astrology'],
  },
  '/learn/smarta-vaishnava': {
    title: { en: 'Smarta & Vaishnava Calendar Systems — When Festivals Differ', hi: 'स्मार्त एवं वैष्णव पंचांग पद्धति — त्योहारों में अंतर कब', sa: 'स्मार्तवैष्णवपञ्चाङ्गपद्धती — पर्वसु भेदः कदा' },
    description: { en: 'Why Smarta and Vaishnava traditions sometimes observe the same festival on different days. Udaya Tithi vs Viddha rejection, Ekadashi Parana rules, and regional variations explained.', hi: 'स्मार्त और वैष्णव परम्पराएँ एक ही त्योहार अलग-अलग दिन क्यों मनाती हैं। उदय तिथि, विद्धा अस्वीकृति, एकादशी पारण नियम।', sa: 'स्मार्तवैष्णवपरम्परयोः एकस्मिन् पर्वणि भिन्नदिनानि कुतः।' },
    keywords: ['smarta vaishnava', 'festival date difference', 'udaya tithi', 'viddha tithi', 'ekadashi rules', 'dharmasindhu nirnayasindhu'],
  },
  '/learn/vara': {
    title: { en: 'Vara — The 7 Weekdays in Vedic Astrology', hi: 'वार — वैदिक ज्योतिष में 7 दिन', sa: 'वाराः — वैदिकज्योतिषे सप्तदिनानि' },
    description: { en: 'Learn the 7 Varas (weekdays) in Jyotish — their ruling planets, auspicious activities, and role in Panchang and Muhurta.', hi: '7 वार — रवि से शनि तक — स्वामी ग्रह, शुभ कार्य और मुहूर्त में भूमिका।', sa: 'रव्यादिशन्यन्तं सप्तवाराः।' },
    keywords: ['vara weekday astrology', 'panchang vara', 'day of week jyotish'],
  },
  '/learn/vargas': {
    title: { en: 'Varga Charts — Divisional Charts in Vedic Astrology', hi: 'वर्ग कुण्डलियाँ — वैदिक ज्योतिष में विभागीय चार्ट', sa: 'वर्गकुण्डलयः — वैदिकज्योतिषे विभागीयपत्रिकाः' },
    description: { en: 'Master the 16 Varga charts — Rasi, Hora, Drekkana, Navamsha, Dashamsha, and more. How divisional charts reveal deeper life themes.', hi: '16 वर्ग कुण्डलियाँ — राशि, होरा, द्रेक्काण, नवमांश, दशमांश आदि।', sa: 'षोडशवर्गकुण्डलयः।' },
    keywords: ['varga charts', 'divisional charts', 'navamsha', 'shodashamsha astrology'],
  },
  '/learn/dashas': {
    title: { en: 'Dashas — Planetary Period Systems in Vedic Astrology', hi: 'दशा — वैदिक ज्योतिष में ग्रहकाल प्रणाली', sa: 'दशाः — वैदिकज्योतिषे ग्रहकालप्रणाली' },
    description: { en: 'Complete guide to Vimshottari Dasha — maha dasha, antar dasha, pratyantar dasha, and how planetary periods shape life events.', hi: 'विंशोत्तरी दशा — महादशा, अन्तर्दशा, प्रत्यन्तर दशा और जीवन घटनाओं पर प्रभाव।', sa: 'विंशोत्तरीदशा — महादशा अन्तर्दशा प्रत्यन्तर्दशा च।' },
    keywords: ['dasha system', 'vimshottari dasha', 'mahadasha', 'planetary periods vedic'],
  },
  '/learn/doshas': {
    title: { en: 'Doshas in Vedic Astrology — Manglik, Kaal Sarp, Sade Sati', hi: 'वैदिक ज्योतिष में दोष — मांगलिक, काल सर्प, साढ़े साती', sa: 'वैदिकज्योतिषे दोषाः' },
    description: { en: 'Understand the major Doshas in Jyotish — Manglik Dosha, Kaal Sarp Dosha, Sade Sati, Ganda Mula, and Pitra Dosha. Their formation, effects, and remedies.', hi: 'ज्योतिष के प्रमुख दोष — मांगलिक, काल सर्प, साढ़े साती, गण्ड मूल, पितृ दोष — निर्माण, प्रभाव और उपाय।', sa: 'ज्योतिषस्य प्रमुखदोषाः।' },
    keywords: ['manglik dosha', 'kaal sarp dosha', 'astrological doshas', 'pitra dosha'],
  },
  '/learn/grahan-yoga': {
    title: { en: 'Grahan Yoga — Eclipse Yoga in the Birth Chart', hi: 'ग्रहण योग — जन्म कुण्डली में ग्रहण', sa: 'ग्रहणयोगः — जन्मकुण्डल्यां ग्रहणम्' },
    description: { en: 'Complete guide to Grahan Yoga: Sun/Moon conjunct Rahu/Ketu. Four types, house-wise effects, cancellation rules, classical references, severity assessment, and remedies.', hi: 'ग्रहण योग: सूर्य/चन्द्र की राहु/केतु से युति। चार प्रकार, भाव अनुसार प्रभाव, भंग नियम, शास्त्रीय सन्दर्भ और उपाय।', sa: 'ग्रहणयोगः — सूर्यचन्द्रयोः राहुकेतुभ्यां युतिः। चत्वारः प्रकाराः भावफलानि भङ्गनियमाः च।' },
    keywords: ['grahan yoga', 'eclipse yoga', 'sun rahu conjunction', 'moon rahu conjunction', 'chandra grahan yoga', 'surya grahan yoga'],
  },
  '/learn/doshas-detailed': {
    title: { en: 'Doshas Comprehensive Guide — Mangal, Kaal Sarpa, Pitra, Kemdrum, Guru Chandal, Grahan', hi: 'दोष विस्तृत मार्गदर्शिका — मंगल, काल सर्प, पित्र, केमद्रुम, गुरु चाण्डाल, ग्रहण', sa: 'दोषविस्तृतमार्गदर्शिका' },
    description: { en: 'In-depth guide to all major Jyotish doshas: detection methods, severity levels, cancellation conditions, effects, remedies, and classical references with worked examples.', hi: 'ज्योतिष के सभी प्रमुख दोषों का गहन अध्ययन — पहचान विधि, गंभीरता स्तर, रद्दीकरण शर्तें, प्रभाव और उपचार।', sa: 'ज्योतिषस्य सर्वेषां प्रमुखदोषाणां विस्तृतमार्गदर्शिका।' },
    keywords: ['mangal dosha detailed', 'kaal sarpa dosha types', 'pitra dosha', 'kemadruma dosha', 'guru chandal dosha', 'grahan dosha', 'dosha cancellation'],
  },
  '/learn/gochar': {
    title: { en: 'Gochar — Planetary Transits in Vedic Astrology', hi: 'गोचर — वैदिक ज्योतिष में ग्रह गोचर', sa: 'गोचरः — वैदिकज्योतिषे ग्रहगोचरः' },
    description: { en: 'Learn how planetary transits (Gochar) interact with your natal chart — Jupiter, Saturn, Rahu-Ketu transits and their effects on life areas.', hi: 'ग्रह गोचर — बृहस्पति, शनि, राहु-केतु का जन्म कुण्डली पर प्रभाव।', sa: 'ग्रहगोचरः — ग्रहाणां जन्मकुण्डल्यां प्रभावः।' },
    keywords: ['gochar transit', 'planetary transits vedic', 'jupiter transit', 'saturn transit'],
  },
  '/learn/advanced': {
    title: { en: 'Advanced Vedic Astrology — Deeper Jyotish Techniques', hi: 'उन्नत वैदिक ज्योतिष — गहन ज्योतिष तकनीकें', sa: 'उन्नतवैदिकज्योतिषम्' },
    description: { en: 'Advanced Jyotish topics — Jaimini Sutras, Ashtakavarga, Shadbala, Bhavabala, Argala, Varga charts, special lagnas, and predictive techniques.', hi: 'उन्नत ज्योतिष — जैमिनी सूत्र, अष्टकवर्ग, षड्बल, भावबल, अर्गल, वर्ग कुण्डली।', sa: 'उन्नतज्योतिषम् — जैमिनीसूत्राणि अष्टकवर्गः षड्बलं भावबलम्।' },
    keywords: ['advanced vedic astrology', 'jaimini astrology', 'advanced jyotish', 'predictive astrology'],
  },
  '/learn/ayanamsha': {
    title: { en: 'Ayanamsha — The Vedic Sidereal Correction Explained', hi: 'अयनांश — वैदिक नाक्षत्र संशोधन की व्याख्या', sa: 'अयनांशः — वैदिकनाक्षत्रसंशोधनम्' },
    description: { en: 'Understand Ayanamsha — the difference between tropical and sidereal zodiacs. Lahiri, Raman, Krishnamurti ayanamshas compared.', hi: 'अयनांश — उष्णकटिबंधीय और नाक्षत्र राशिचक्र का अंतर। लाहिड़ी, रमण, कृष्णमूर्ति अयनांश।', sa: 'अयनांशः — उष्णकटिबन्धीय नाक्षत्रराशिचक्रयोः भेदः।' },
    keywords: ['ayanamsha', 'lahiri ayanamsha', 'sidereal zodiac', 'tropical vs sidereal'],
  },
  '/learn/bhavas': {
    title: { en: 'The 12 Bhavas (Houses) in Vedic Astrology', hi: 'वैदिक ज्योतिष में 12 भाव', sa: 'वैदिकज्योतिषे द्वादशभावाः' },
    description: { en: 'Complete guide to the 12 Bhavas (houses) in Jyotish — their significations, natural rulers, Kendra/Trikona/Dusthana classification, and interpretation.', hi: 'ज्योतिष के 12 भाव — अर्थ, प्राकृतिक स्वामी, केन्द्र/त्रिकोण/दुःस्थान वर्गीकरण।', sa: 'ज्योतिषस्य द्वादशभावाः।' },
    keywords: ['12 houses vedic astrology', 'bhavas jyotish', 'kendra trikona', 'house astrology'],
  },
  '/learn/calculations': {
    title: { en: 'How Vedic Astrology Calculations Work', hi: 'वैदिक ज्योतिष गणनाएँ कैसे काम करती हैं', sa: 'वैदिकज्योतिषगणनाः' },
    description: { en: 'The mathematics behind Vedic astrology — Julian Day Number, sidereal time, tropical to sidereal conversion, and Lahiri Ayanamsha calculation.', hi: 'वैदिक ज्योतिष का गणित — जूलियन दिन संख्या, नाक्षत्र समय, ग्रह स्थिति और लाहिड़ी अयनांश।', sa: 'वैदिकज्योतिषस्य गणितम्।' },
    keywords: ['vedic astrology calculation', 'julian day number', 'astronomical calculation', 'ayanamsha calculation'],
  },
  '/learn/classical-texts': {
    title: { en: 'Classical Texts of Vedic Astrology — Brihat Parashari & More', hi: 'वैदिक ज्योतिष के शास्त्रीय ग्रन्थ', sa: 'वैदिकज्योतिषस्य शास्त्रीयग्रन्थाः' },
    description: { en: 'Overview of the major classical texts of Jyotish — Brihat Parashari Hora Shastra, Saravali, Phaladeepika, Jataka Parijata, Brihat Jataka, and Jaimini Sutras.', hi: 'ज्योतिष के प्रमुख ग्रन्थ — बृहत् पाराशरी, सारावली, फलदीपिका, जातक परिजात।', sa: 'ज्योतिषस्य प्रमुखशास्त्रीयग्रन्थाः।' },
    keywords: ['classical astrology texts', 'brihat parashari', 'jaimini sutras', 'saravali astrology'],
  },
  '/learn/masa': {
    title: { en: 'Masa — The Hindu Lunar Month System', hi: 'मास — हिन्दू चन्द्र मास प्रणाली', sa: 'मासः — हिन्दुचन्द्रमासप्रणाली' },
    description: { en: 'Learn the Hindu Masa (lunar month) system — Chaitra to Phalguna, Amanta vs Purnimanta traditions, Adhika Masa (leap month), and regional variations.', hi: 'हिन्दू मास — चैत्र से फाल्गुन, अमान्त और पूर्णिमान्त परम्परा, अधिक मास।', sa: 'हिन्दुमासप्रणाली — चैत्रादिफाल्गुनान्तः अमान्तः पूर्णिमान्तः अधिकमासश्च।' },
    keywords: ['hindu month', 'masa panchang', 'chaitra masa', 'lunar calendar month'],
  },

  '/learn/birth-chart': {
    title: { en: 'Understanding Your Birth Chart (Kundali)', hi: 'अपनी जन्म कुण्डली को समझें', sa: 'जन्मकुण्डलीं बोधत' },
    description: { en: 'Complete beginner guide to reading a Vedic birth chart — 12 houses, 9 planets, 12 signs, degrees, chart styles, and common misconceptions.', hi: 'वैदिक जन्म कुण्डली पढ़ने की सम्पूर्ण शुरुआती मार्गदर्शिका — 12 भाव, 9 ग्रह, 12 राशियाँ, अंश, चार्ट शैली।', sa: 'वैदिकजन्मकुण्डलीपठनस्य सम्पूर्णमार्गदर्शिका।' },
    keywords: ['birth chart', 'kundali', 'janam kundli', 'vedic chart reading', 'how to read birth chart'],
  },
  '/learn/tippanni': {
    title: { en: 'Tippanni — Chart Interpretation Guide', hi: 'टिप्पणी — कुण्डली व्याख्या मार्गदर्शिका', sa: 'टिप्पणी — कुण्डलीव्याख्यामार्गदर्शिका' },
    description: { en: 'How Tippanni (interpretive commentary) transforms raw chart data into life insights — personality, planets, yogas, doshas, dashas, and remedies.', hi: 'कैसे टिप्पणी कच्चे कुण्डली डेटा को जीवन अन्तर्दृष्टि में बदलती है — व्यक्तित्व, ग्रह, योग, दोष, दशा, उपाय।', sa: 'टिप्पणी कथं कुण्डलीसमाचारं जीवनबोधे परिणमयति।' },
    keywords: ['tippanni', 'chart interpretation', 'kundali reading', 'vedic astrology interpretation'],
  },
  '/learn/transits': {
    title: { en: 'Understanding Planetary Transits (Gochar)', hi: 'ग्रह गोचर को समझें', sa: 'ग्रहगोचरं बोधत' },
    description: { en: 'How planetary transits activate your birth chart — slow planets, Ashtakavarga scores, Transit Radar, Sade Sati, and practical transit advice.', hi: 'कैसे ग्रह गोचर आपकी जन्म कुण्डली सक्रिय करते हैं — धीमे ग्रह, अष्टकवर्ग, गोचर रडार, साढ़े साती।', sa: 'ग्रहगोचरः जन्मकुण्डलीं कथं सक्रियां करोति।' },
    keywords: ['planetary transits', 'gochar', 'transit astrology', 'ashtakavarga transit', 'sade sati'],
  },
  '/learn/patrika': {
    title: { en: 'Patrika — Your Complete Astrological Document', hi: 'पत्रिका — सम्पूर्ण ज्योतिषीय दस्तावेज़', sa: 'पत्रिका — सम्पूर्णज्योतिषदस्तावेजः' },
    description: { en: 'What is a Janam Patrika — traditional vs digital format, contents, how to read it, when you need it, and export features.', hi: 'जन्म पत्रिका क्या है — पारम्परिक बनाम डिजिटल, विषयवस्तु, कैसे पढ़ें, कब चाहिए।', sa: 'जन्मपत्रिका किम् — पारम्परिकं डिजिटलं च।' },
    keywords: ['patrika', 'janam patri', 'birth chart document', 'kundali document'],
  },

  // ─── Date Listing Pages ──────────────────────────────────
  '/dates/ekadashi': {
    title: { en: 'Ekadashi 2026 — All Dates, Timings & Parana Schedule', hi: 'एकादशी 2026 — सभी तिथियाँ, समय और पारण', sa: 'एकादशी २०२६ — सर्वतिथयः समयश्च' },
    description: { en: 'Complete list of all Ekadashi dates in 2026 with exact start/end timings, paksha, and fasting guidelines. Shukla and Krishna Ekadashi calendar.', hi: '2026 की सभी एकादशी तिथियों की पूरी सूची — सटीक आरम्भ/समाप्ति समय, पक्ष और व्रत दिशानिर्देश।', sa: '२०२६ वर्षस्य सर्वासां एकादशीतिथीनां सूची — सम्यक्कालः पक्षश्च।' },
    keywords: ['ekadashi 2026', 'ekadashi dates', 'ekadashi vrat', 'ekadashi calendar', 'ekadashi timings'],
  },
  '/dates/purnima': {
    title: { en: 'Purnima 2026 — Full Moon Dates, Timings & Significance', hi: 'पूर्णिमा 2026 — सभी तिथियाँ और समय', sa: 'पूर्णिमा २०२६ — सर्वतिथयः समयश्च' },
    description: { en: 'All Purnima (full moon) dates in 2026 with exact timings. Guru Purnima, Sharad Purnima, and monthly full moon schedule.', hi: '2026 की सभी पूर्णिमा तिथियों की सूची — गुरु पूर्णिमा, शरद पूर्णिमा और मासिक पूर्णिमा कार्यक्रम।', sa: '२०२६ वर्षस्य सर्वपूर्णिमातिथिसूची।' },
    keywords: ['purnima 2026', 'full moon dates', 'purnima calendar', 'purnima timings'],
  },
  '/dates/amavasya': {
    title: { en: 'Amavasya 2026 — New Moon Dates, Timings & Rituals', hi: 'अमावस्या 2026 — सभी तिथियाँ और समय', sa: 'अमावस्या २०२६ — सर्वतिथयः समयश्च' },
    description: { en: 'Complete Amavasya (new moon) dates in 2026 with exact timings. Pitru Tarpan, Shani Puja, and monthly new moon schedule.', hi: '2026 की सभी अमावस्या तिथियों की सूची — पितृ तर्पण, शनि पूजा और मासिक अमावस्या।', sa: '२०२६ वर्षस्य सर्वामावस्यातिथिसूची।' },
    keywords: ['amavasya 2026', 'new moon dates', 'amavasya calendar', 'amavasya timings'],
  },
  '/dates/pradosham': {
    title: { en: 'Pradosham 2026 — All Dates, Timings & Vrat Guide', hi: 'प्रदोष 2026 — सभी तिथियाँ और व्रत मार्गदर्शन', sa: 'प्रदोषम् २०२६ — सर्वतिथयः व्रतमार्गदर्शनं च' },
    description: { en: 'All Pradosham dates in 2026 with timings. Shani Pradosham, Soma Pradosham schedule and Shiva worship guidelines.', hi: '2026 की सभी प्रदोष तिथियाँ — शनि प्रदोष, सोम प्रदोष और शिव पूजा मार्गदर्शन।', sa: '२०२६ वर्षस्य सर्वप्रदोषतिथिसूची।' },
    keywords: ['pradosham 2026', 'pradosh vrat', 'shani pradosham', 'soma pradosham'],
  },
  '/dates/chaturthi': {
    title: { en: 'Chaturthi 2026 — Sankashti & Vinayaka Dates & Timings', hi: 'चतुर्थी 2026 — संकष्टी और विनायक तिथियाँ', sa: 'चतुर्थी २०२६ — सङ्कष्टिविनायकतिथयः' },
    description: { en: 'All Chaturthi dates in 2026 — Sankashti Chaturthi (Krishna) and Vinayaka Chaturthi (Shukla) with exact timings and Ganesh Puja guidelines.', hi: '2026 की सभी चतुर्थी तिथियाँ — संकष्टी चतुर्थी और विनायक चतुर्थी।', sa: '२०२६ वर्षस्य सर्वचतुर्थीतिथिसूची।' },
    keywords: ['chaturthi 2026', 'sankashti chaturthi', 'vinayaka chaturthi', 'ganesh chaturthi dates'],
  },

  // ─── Matching ─────────────────────────────────────────────
  '/matching/compatibility': {
    title: { en: 'Vedic Rashi Compatibility Chart — All 12 Signs', hi: 'वैदिक राशि संगतता चार्ट — सभी 12 राशियाँ', sa: 'वैदिकराशिसंगततासारिणी' },
    description: { en: 'Interactive 12×12 Vedic compatibility heatmap. Check rashi-to-rashi compatibility scores based on Ashta Kuta matching.', hi: '12×12 वैदिक संगतता हीटमैप। अष्ट कूट मिलान पर आधारित राशि संगतता स्कोर।', sa: '12×12 संगततासारिणी।' },
    keywords: ['rashi compatibility chart', 'vedic zodiac compatibility', 'ashta kuta chart'],
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
  '/learn/rahu-kaal': {
    title: { en: 'Rahu Kaal — The Shadow Period in Vedic Astrology', hi: 'राहु काल — वैदिक ज्योतिष में छाया का समय', sa: 'राहुकालः — वैदिकज्योतिषे छायाकालः' },
    description: { en: 'Learn about Rahu Kaal — the daily 1.5-hour inauspicious window ruled by Rahu. Daily rotation sequence, difference from Yamaganda and Gulika, and common misconceptions.', hi: 'राहु काल के बारे में जानें — राहु द्वारा शासित दैनिक डेढ़ घंटे की अशुभ अवधि। दैनिक क्रम, यमगण्ड और गुलिक से अंतर।', sa: 'राहुकालं जानीयात् — राहुणा शासितं दैनिकम् अशुभकालखण्डम्।' },
    keywords: ['rahu kaal', 'rahu kalam', 'inauspicious time', 'yamaganda', 'gulika kaal', 'vedic astrology'],
  },
  '/learn/prashna': {
    title: { en: 'Prashna Kundali — Vedic Horary Astrology Guide', hi: 'प्रश्न कुण्डली — वैदिक प्रश्न ज्योतिष मार्गदर्शिका', sa: 'प्रश्नकुण्डली — वैदिकप्रश्नज्योतिषमार्गदर्शिका' },
    description: { en: 'Complete guide to Prashna (horary) astrology — chart casting, Arudha Lagna, Moon analysis, Prashna Yogas, and the Kerala Ashtamangala tradition.', hi: 'प्रश्न ज्योतिष का पूर्ण मार्गदर्शन — कुण्डली निर्माण, आरूढ़ लग्न, चन्द्र विश्लेषण, प्रश्न योग और केरल अष्टमंगल परम्परा।', sa: 'प्रश्नज्योतिषस्य सम्पूर्णमार्गदर्शिका — कुण्डलीनिर्माणम् आरूढलग्नम् च।' },
    keywords: ['prashna kundali', 'horary astrology', 'prashna marga', 'ashtamangala prashna', 'vedic horary'],
  },
  '/learn/tithi-pravesha': {
    title: { en: 'Tithi Pravesha — Vedic Birthday Chart Guide', hi: 'तिथि प्रवेश — वैदिक जन्मदिन कुण्डली मार्गदर्शिका', sa: 'तिथिप्रवेशः — वैदिकजन्मदिवसकुण्डलीमार्गदर्शिका' },
    description: { en: 'Learn Tithi Pravesha — the Vedic birthday chart based on Sun-Moon angle recurrence. Year lord, panchanga reading, comparison with Western solar returns.', hi: 'तिथि प्रवेश सीखें — सूर्य-चन्द्र कोण पुनरावृत्ति पर आधारित वैदिक जन्मदिन कुण्डली। वर्ष स्वामी, पंचांग पठन।', sa: 'तिथिप्रवेशं शिक्षतु — सूर्यचन्द्रकोणपुनरावृत्त्याधारिता वैदिकजन्मदिवसकुण्डली।' },
    keywords: ['tithi pravesha', 'vedic birthday', 'annual chart', 'year lord', 'solar return vedic'],
  },
  '/learn/kaal-sarp': {
    title: { en: 'Kaal Sarpa Dosha — Types, Effects, Cancellation & Honest Context', hi: 'काल सर्प दोष — प्रकार, प्रभाव, निवारण और ईमानदार संदर्भ', sa: 'कालसर्पदोषः — प्रकाराः प्रभावाः निवारणं शास्त्रीयसन्दर्भश्च' },
    description: { en: 'Complete guide to Kaal Sarpa Dosha — 12 types, ascending vs descending, cancellation conditions, remedies, and honest disclosure that it is not found in BPHS.', hi: 'काल सर्प दोष का पूर्ण मार्गदर्शन — 12 प्रकार, आरोही बनाम अवरोही, निवारण शर्तें, उपाय, और BPHS में अनुपस्थिति का ईमानदार खुलासा।', sa: 'कालसर्पदोषस्य सम्पूर्णमार्गदर्शिका — द्वादशप्रकाराः निवारणशर्ताः उपायाश्च।' },
    keywords: ['kaal sarpa dosha', 'kaal sarpa yoga', 'rahu ketu axis', 'kaal amrita', 'dosha remedies'],
  },
  '/learn/tarabalam': {
    title: { en: 'Tara Bala — Star Strength for Daily Auspiciousness', hi: 'तारा बल — दैनिक शुभत्व के लिए नक्षत्र शक्ति', sa: 'ताराबलम् — दैनिकशुभत्वाय नक्षत्रशक्तिः' },
    description: { en: 'Learn Tara Bala — the 9 Taras from birth nakshatra to transit nakshatra. Janma, Sampat, Vipat, Kshema, Pratyari, Sadhaka, Vadha, Mitra, Atimitra explained.', hi: 'तारा बल सीखें — जन्म नक्षत्र से गोचर नक्षत्र तक 9 तारे। जन्म, सम्पत्, विपत्, क्षेम, प्रत्यरि, साधक, वध, मित्र, अतिमित्र।', sa: 'ताराबलं शिक्षतु — जन्मनक्षत्रात् गोचरनक्षत्रपर्यन्तं नवताराः।' },
    keywords: ['tara bala', 'tarabalam', 'star strength', 'nine taras', 'daily auspiciousness', 'nakshatra compatibility'],
  },

  // ─── Missing Pages (SEO gap fill) ────────────────────────
  '/annual-forecast': {
    title: { en: 'Annual Vedic Forecast — Planetary Transits & Predictions', hi: 'वार्षिक वैदिक भविष्यवाणी — ग्रह गोचर और पूर्वानुमान', sa: 'वार्षिकवैदिकभविष्यवाणी — ग्रहगोचरः पूर्वानुमानम्' },
    description: { en: 'Year-ahead Vedic forecast based on planetary transits of Jupiter, Saturn, Rahu-Ketu. Personalized predictions for all 12 Moon signs.', hi: 'बृहस्पति, शनि, राहु-केतु गोचर पर आधारित वार्षिक वैदिक भविष्यवाणी। सभी 12 चन्द्र राशियों के लिए व्यक्तिगत पूर्वानुमान।', sa: 'बृहस्पतिशनिराहुकेतुगोचराधारितं वार्षिकं वैदिकभविष्यवाणी। सर्वासां १२ चन्द्रराशीनां कृते पूर्वानुमानम्।' },
    keywords: ['annual forecast', 'yearly horoscope', 'vedic predictions', 'planetary transits year'],
  },
  '/kundali/compare': {
    title: { en: 'Compare Birth Charts — Side-by-Side Kundali Analysis', hi: 'जन्म कुण्डली तुलना — अगल-बगल विश्लेषण', sa: 'जन्मकुण्डलीतुलना — पार्श्वशः विश्लेषणम्' },
    description: { en: 'Compare two Vedic birth charts side by side. Analyze planet positions, house placements, dashas, and compatibility between any two Kundalis.', hi: 'दो वैदिक जन्म कुण्डलियों की अगल-बगल तुलना। ग्रह स्थिति, भाव, दशा और अनुकूलता विश्लेषण।', sa: 'द्वयोः वैदिकजन्मकुण्डल्योः पार्श्वशः तुलना। ग्रहस्थितिभावदशानुकूलताविश्लेषणम्।' },
    keywords: ['compare kundali', 'birth chart comparison', 'kundali side by side', 'chart synastry vedic'],
  },
  '/kundali/rectify': {
    title: { en: 'Birth Time Rectification — Correct Your Birth Time', hi: 'जन्म समय शुद्धि — अपना जन्म समय सही करें', sa: 'जन्मसमयशुद्धिः — जन्मसमयं संशोधयतु' },
    description: { en: 'Rectify your birth time using major life events. Vedic birth time rectification based on Dasha periods, transit triggers, and divisional chart verification.', hi: 'प्रमुख जीवन घटनाओं से अपना जन्म समय शुद्ध करें। दशा, गोचर और वर्ग कुण्डली सत्यापन।', sa: 'प्रमुखजीवनघटनाभिः स्वजन्मसमयं शोधयतु। दशागोचरवर्गकुण्डलीसत्यापनम्।' },
    keywords: ['birth time rectification', 'correct birth time', 'kundali rectification', 'vedic rectification'],
  },
  '/learn/library': {
    title: { en: 'Jyotish Reference Library — Classical Texts & Resources', hi: 'ज्योतिष सन्दर्भ पुस्तकालय — शास्त्रीय ग्रन्थ एवं संसाधन', sa: 'ज्योतिषसन्दर्भपुस्तकालयः — शास्त्रीयग्रन्थाः संसाधनानि च' },
    description: { en: 'Curated library of classical Jyotish texts, astronomical treatises, and reference materials. From Surya Siddhanta to Brihat Parashari Hora Shastra.', hi: 'सूर्य सिद्धान्त से बृहत् पाराशरी होरा शास्त्र तक — शास्त्रीय ज्योतिष ग्रन्थों का संग्रह।', sa: 'सूर्यसिद्धान्तात् बृहत्पाराशरीपर्यन्तं शास्त्रीयज्योतिषग्रन्थसङ्ग्रहः।' },
    keywords: ['jyotish library', 'vedic astrology books', 'classical texts astrology', 'surya siddhanta'],
  },
  '/calendar/regional/mithila': {
    title: { en: 'Mithila Panchang — Regional Calendar for Bihar & Jharkhand', hi: 'मिथिला पंचांग — बिहार और झारखण्ड का क्षेत्रीय कैलेंडर', sa: 'मिथिलापञ्चाङ्गम् — बिहारझारखण्डयोः प्रादेशिकपञ्चाङ्गम्' },
    description: { en: 'Mithila regional Panchang for Bihar and Jharkhand. Maithili festivals, Chhath Puja, Sama-Chakeva, Jitiya, and Madhushravani with traditional calendar.', hi: 'बिहार और झारखण्ड का मिथिला पंचांग। मैथिली त्योहार, छठ पूजा, सामा-चकेवा, जिउतिया, मधुश्रावणी।', sa: 'बिहारझारखण्डयोः मिथिलापञ्चाङ्गम्। मैथिलीपर्वाणि छठपूजा सामचकेवा जीवितपुत्रिका च।' },
    keywords: ['mithila panchang', 'bihar calendar', 'jharkhand panchang', 'chhath puja', 'maithili festivals'],
  },
  '/stories': {
    title: { en: 'Vedic Stories — Mythology Behind the Stars', hi: 'वैदिक कथाएँ — तारों के पीछे की पौराणिक कथाएँ', sa: 'वैदिककथाः — नक्षत्राणां पृष्ठतः पौराणिककथाः' },
    description: { en: 'Stories from Hindu mythology connected to astronomy and astrology — Navagraha origins, Nakshatra legends, Rahu-Ketu and the cosmic serpent.', hi: 'खगोलशास्त्र और ज्योतिष से जुड़ी हिन्दू पौराणिक कथाएँ — नवग्रह उत्पत्ति, नक्षत्र कथाएँ, राहु-केतु।', sa: 'खगोलज्योतिषसम्बद्धाः हिन्दूपौराणिककथाः — नवग्रहोत्पत्तिः नक्षत्रकथाः राहुकेतू च।' },
    keywords: ['vedic stories', 'hindu mythology astronomy', 'navagraha stories', 'nakshatra legends'],
  },

  // ─── Learn Contributions (India's Mathematical & Astronomical Heritage) ───
  '/learn/contributions/zero': {
    title: { en: 'The Invention of Zero — India\'s Greatest Gift to Mathematics', hi: 'शून्य का आविष्कार — गणित को भारत की सबसे बड़ी देन', sa: 'शून्यस्य आविष्कारः — गणिताय भारतस्य महत्तमा देनम्' },
    description: { en: 'How India invented zero as a number and placeholder. From Brahmagupta\'s rules for zero arithmetic to the global spread of the decimal system.', hi: 'भारत ने शून्य का आविष्कार कैसे किया। ब्रह्मगुप्त से दशमलव प्रणाली के वैश्विक प्रसार तक।', sa: 'भारतः शून्यम् अङ्कत्वेन कथम् आविष्कृतवान्।' },
    keywords: ['invention of zero', 'brahmagupta zero', 'indian mathematics', 'decimal system origin'],
  },
  '/learn/contributions/pi': {
    title: { en: 'Pi in Ancient India — Madhava\'s Infinite Series', hi: 'प्राचीन भारत में पाई — माधव की अनन्त श्रृंखला', sa: 'प्राचीनभारते पाई — माधवस्य अनन्तश्रेणी' },
    description: { en: 'India\'s contributions to Pi — from Aryabhata\'s approximation to Madhava\'s infinite series, 250 years before Leibniz.', hi: 'पाई में भारत का योगदान — आर्यभट की सन्निकटता से माधव की अनन्त श्रृंखला तक।', sa: 'पाई अङ्के भारतस्य योगदानम् — आर्यभटसन्निकटतातः माधवस्य अनन्तश्रेणीपर्यन्तम्।' },
    keywords: ['pi india', 'madhava series', 'aryabhata pi', 'indian mathematics pi'],
  },
  '/learn/contributions/sine': {
    title: { en: 'The Sine Function — Born in India', hi: 'ज्या फलन — भारत में जन्मा', sa: 'ज्याफलनम् — भारते जातम्' },
    description: { en: 'India invented trigonometry: Aryabhata\'s jya (sine) tables, the half-chord revolution, and how Indian sine reached the Arab world and Europe.', hi: 'भारत ने त्रिकोणमिति का आविष्कार किया: आर्यभट की ज्या तालिकाएँ और अर्ध-जीवा क्रान्ति।', sa: 'भारतः त्रिकोणमितिम् आविष्कृतवान् — आर्यभटस्य ज्यासारण्यः।' },
    keywords: ['sine function india', 'aryabhata jya', 'trigonometry origin', 'indian trigonometry'],
  },
  '/learn/contributions/pythagoras': {
    title: { en: 'Pythagoras Theorem — Known in India Before Pythagoras', hi: 'पाइथागोरस प्रमेय — पाइथागोरस से पहले भारत में ज्ञात', sa: 'पाइथागोरसप्रमेयम् — पाइथागोरसात् पूर्वं भारते ज्ञातम्' },
    description: { en: 'The Shulba Sutras (800 BCE) contain the Pythagorean theorem centuries before Pythagoras. Baudhayana, Apastamba, and Vedic geometry.', hi: 'शुल्ब सूत्र (800 BCE) में पाइथागोरस से सदियों पहले यह प्रमेय मिलता है। बौधायन और वैदिक ज्यामिति।', sa: 'शुल्बसूत्रेषु (800 BCE) पाइथागोरसात् शताब्दीभिः पूर्वम् एतत् प्रमेयं विद्यते।' },
    keywords: ['pythagorean theorem india', 'shulba sutras', 'baudhayana', 'vedic geometry'],
  },
  '/learn/contributions/fibonacci': {
    title: { en: 'Fibonacci Sequence — First Described by Indian Mathematicians', hi: 'फिबोनैचि अनुक्रम — भारतीय गणितज्ञों द्वारा पहले वर्णित', sa: 'फिबोनैचि अनुक्रमः — भारतीयगणितज्ञैः प्रथमं वर्णितम्' },
    description: { en: 'The Fibonacci sequence was known to Pingala, Virahanka, and Hemachandra centuries before Fibonacci. Sanskrit prosody and the matra-vrtta connection.', hi: 'फिबोनैचि अनुक्रम पिंगल, विरहंक और हेमचन्द्र को फिबोनैचि से सदियों पहले ज्ञात था।', sa: 'पिङ्गलविरहङ्कहेमचन्द्रैः फिबोनैचितः शताब्दीभिः पूर्वम् एषः अनुक्रमः ज्ञातः आसीत्।' },
    keywords: ['fibonacci india', 'pingala sequence', 'hemachandra', 'sanskrit prosody mathematics'],
  },
  '/learn/contributions/binary': {
    title: { en: 'Binary System — Pingala\'s Chandahshastra (300 BCE)', hi: 'द्विआधारी प्रणाली — पिंगल का छन्दःशास्त्र', sa: 'द्व्याधारीप्रणाली — पिङ्गलस्य छन्दःशास्त्रम्' },
    description: { en: 'Pingala\'s Chandahshastra (300 BCE) used binary-like encoding (laghu/guru) for Sanskrit meters — the conceptual ancestor of modern binary.', hi: 'पिंगल के छन्दःशास्त्र (300 BCE) में संस्कृत छन्दों के लिए द्विआधारी-जैसी संकेतन प्रणाली।', sa: 'पिङ्गलस्य छन्दःशास्त्रे संस्कृतच्छन्दानां कृते द्व्याधारीसंकेतनम्।' },
    keywords: ['binary system india', 'pingala', 'chandahshastra', 'laghu guru binary'],
  },
  '/learn/contributions/calculus': {
    title: { en: 'Calculus — Madhava & the Kerala School (1350 CE)', hi: 'कलन — माधव और केरल स्कूल (1350 CE)', sa: 'कलनम् — माधवः केरलविद्यापीठं च' },
    description: { en: 'Madhava of Sangamagrama discovered infinite series for sine, cosine, and arctangent 250 years before Newton and Leibniz. The Kerala School\'s calculus revolution.', hi: 'सङ्गमग्राम के माधव ने न्यूटन और लाइबनिट्ज़ से 250 वर्ष पहले अनन्त श्रृंखला खोजी।', sa: 'सङ्गमग्रामस्य माधवः न्यूटनलैब्निट्सतः 250 वर्षैः पूर्वम् अनन्तश्रेणीम् आविष्कृतवान्।' },
    keywords: ['calculus india', 'madhava kerala school', 'infinite series', 'indian calculus'],
  },
  '/learn/contributions/negative-numbers': {
    title: { en: 'Negative Numbers — Brahmagupta\'s Rules (628 CE)', hi: 'ऋणात्मक संख्याएँ — ब्रह्मगुप्त के नियम (628 CE)', sa: 'ऋणसंख्याः — ब्रह्मगुप्तस्य नियमाः' },
    description: { en: 'Brahmagupta first formalized rules for negative numbers and zero in Brahmasphutasiddhanta (628 CE) — debt as negative, fortune as positive.', hi: 'ब्रह्मगुप्त ने ब्रह्मस्फुटसिद्धान्त (628 CE) में ऋणात्मक संख्याओं और शून्य के नियम दिए।', sa: 'ब्रह्मगुप्तः ब्रह्मस्फुटसिद्धान्ते ऋणसंख्यानां शून्यस्य च नियमान् प्रथमं निर्धारितवान्।' },
    keywords: ['negative numbers india', 'brahmagupta', 'brahmasphutasiddhanta', 'indian algebra'],
  },
  '/learn/contributions/kerala-school': {
    title: { en: 'Kerala School of Mathematics — India\'s Scientific Revolution', hi: 'केरल गणित स्कूल — भारत की वैज्ञानिक क्रान्ति', sa: 'केरलगणितविद्यापीठम् — भारतस्य वैज्ञानिकक्रान्तिः' },
    description: { en: 'The Kerala School (1300-1600 CE) pioneered infinite series, calculus concepts, and astronomical models. Madhava, Nilakantha, Jyeshtadeva and their legacy.', hi: 'केरल स्कूल (1300-1600 CE) ने अनन्त श्रृंखला, कलन और खगोलीय मॉडल में अग्रणी भूमिका निभाई।', sa: 'केरलविद्यापीठम् (1300-1600 CE) अनन्तश्रेण्यां कलने खगोलमानदण्डेषु च अग्रणीम् भूमिकां निर्वहितवत्।' },
    keywords: ['kerala school mathematics', 'madhava', 'nilakantha', 'indian scientific revolution'],
  },
  '/learn/contributions/speed-of-light': {
    title: { en: 'Speed of Light — Sayana\'s Rig Veda Commentary', hi: 'प्रकाश की गति — सायण का ऋग्वेद भाष्य', sa: 'प्रकाशगतिः — सायणस्य ऋग्वेदभाष्यम्' },
    description: { en: 'Sayana\'s 14th-century commentary on Rig Veda 1.50.4 gives a value for the speed of sunlight remarkably close to the modern measurement.', hi: '14वीं शताब्दी में सायण के ऋग्वेद भाष्य में सूर्य प्रकाश की गति का मूल्य आधुनिक माप के निकट है।', sa: 'सायणस्य ऋग्वेदभाष्ये सूर्यप्रकाशगतेः मूल्यम् आधुनिकमापस्य समीपम् अस्ति।' },
    keywords: ['speed of light vedas', 'sayana commentary', 'rig veda science', 'ancient indian science'],
  },
  '/learn/contributions/earth-rotation': {
    title: { en: 'Earth\'s Rotation — Aryabhata\'s Revolutionary Claim (499 CE)', hi: 'पृथ्वी का घूर्णन — आर्यभट का क्रान्तिकारी दावा', sa: 'पृथिव्याः भ्रमणम् — आर्यभटस्य क्रान्तिकारी वचनम्' },
    description: { en: 'Aryabhata proposed that Earth rotates on its axis in 499 CE — over 1000 years before Copernicus. His Aryabhatiya transformed Indian astronomy.', hi: 'आर्यभट ने 499 CE में पृथ्वी के अपनी धुरी पर घूमने का प्रस्ताव दिया — कोपरनिकस से 1000+ वर्ष पहले।', sa: 'आर्यभटः 499 CE वर्षे पृथिवी स्वधुर्यां भ्रमति इति प्रतिपादितवान्।' },
    keywords: ['aryabhata earth rotation', 'aryabhatiya', 'indian astronomy', 'heliocentric india'],
  },
  '/learn/contributions/gravity': {
    title: { en: 'Gravity — Bhaskaracharya & Varahamihira\'s Insights', hi: 'गुरुत्वाकर्षण — भास्कराचार्य और वराहमिहिर', sa: 'गुरुत्वाकर्षणम् — भास्कराचार्यवराहमिहिरौ' },
    description: { en: 'Indian astronomers described gravitational attraction centuries before Newton. Bhaskaracharya\'s Siddhanta Shiromani and Varahamihira\'s insights on Earth\'s pulling force.', hi: 'भारतीय खगोलशास्त्रियों ने न्यूटन से सदियों पहले गुरुत्वाकर्षण का वर्णन किया। भास्कराचार्य और वराहमिहिर।', sa: 'भारतीयखगोलशास्त्रिणः न्यूटनात् शताब्दीभिः पूर्वं गुरुत्वाकर्षणम् वर्णितवन्तः।' },
    keywords: ['gravity india', 'bhaskaracharya gravity', 'varahamihira', 'indian physics'],
  },
  '/learn/contributions/cosmic-time': {
    title: { en: 'Cosmic Time Scales — Yugas, Kalpas & Brahma\'s Lifespan', hi: 'ब्रह्माण्डीय समय — युग, कल्प और ब्रह्मा का जीवनकाल', sa: 'ब्रह्माण्डीयकालः — युगाः कल्पाः ब्रह्मायुश्च' },
    description: { en: 'Hindu cosmology operates on time scales matching modern cosmology — 4.32 billion year Kalpas, 311 trillion year Brahma cycles. The only ancient system to think in billions.', hi: 'हिन्दू ब्रह्माण्ड विज्ञान आधुनिक ब्रह्माण्ड विज्ञान से मेल खाने वाले समय पैमानों पर काम करता है।', sa: 'हिन्दूब्रह्माण्डविज्ञानम् आधुनिकब्रह्माण्डविज्ञानेन सह मेलयन्तं कालमानम् उपयुनक्ति।' },
    keywords: ['hindu cosmic time', 'yuga kalpa', 'brahma lifespan', 'vedic cosmology time'],
  },
  '/learn/contributions/al-khwarizmi': {
    title: { en: "Al-Khwarizmi & Hindu Mathematics — The True Origin of 'Arabic' Numerals", hi: "अल-ख्वारिज्मी और हिन्दू गणित — 'अरबी' अंकों का वास्तविक मूल", sa: "अल्-ख्वारिज्मी हिन्दूगणितं च — 'अरबी' अङ्कानां वास्तविकमूलम्" },
    description: { en: "How Al-Khwarizmi transmitted Indian mathematics to the Arabic world. The 'Father of Algebra' explicitly credited Hindu mathematicians for the decimal system, zero, and arithmetic methods.", hi: "अल-ख्वारिज्मी ने भारतीय गणित को अरबी दुनिया तक कैसे पहुँचाया। 'बीजगणित के पिता' ने दशमलव प्रणाली, शून्य और अंकगणित विधियों का श्रेय हिन्दू गणितज्ञों को दिया।", sa: "अल्-ख्वारिज्मी भारतीयगणितं अरबीजगति कथं संचरितवान्। दशमलवप्रणाल्याः शून्यस्य अङ्कगणितविधीनां च श्रेयः हिन्दूगणितज्ञेभ्यः दत्तवान्।" },
    keywords: ['al-khwarizmi hindu mathematics', 'arabic numerals indian origin', 'algorithm etymology', 'brahmagupta al-khwarizmi', 'hindu numeral system'],
  },
  '/learn/contributions/timeline': {
    title: { en: 'Timeline of India\'s Mathematical & Astronomical Contributions', hi: 'भारत के गणितीय और खगोलशास्त्रीय योगदानों की समयरेखा', sa: 'भारतस्य गणितखगोलयोगदानानां कालसूची' },
    description: { en: 'Interactive timeline from Shulba Sutras (800 BCE) to Kerala School (1600 CE) — 2400 years of Indian mathematical and astronomical breakthroughs.', hi: 'शुल्ब सूत्र (800 BCE) से केरल स्कूल (1600 CE) तक — 2400 वर्षों की भारतीय गणित और खगोलशास्त्र उपलब्धियों की समयरेखा।', sa: 'शुल्बसूत्रेभ्यः (800 BCE) केरलविद्यापीठपर्यन्तम् (1600 CE) — 2400 वर्षाणां भारतीयगणितखगोलशास्त्रसिद्धीनां कालसूची।' },
    keywords: ['indian mathematics timeline', 'indian astronomy history', 'ancient indian science', 'mathematical contributions india'],
  },

  // ─── Chandra Darshan ──────────────────────────────────────
  '/learn/chandra-darshan': {
    title: { en: 'Chandra Darshan — Science of New Moon Sighting | Dekho Panchang', hi: 'चन्द्र दर्शन — नव चन्द्र दर्शन का विज्ञान | Dekho Panchang', sa: 'चन्द्रदर्शनम् — नवचन्द्रदर्शनविज्ञानम् | Dekho Panchang' },
    description: { en: 'Learn the art and science of Chandra Darshan — how Moon age, elongation, and altitude determine crescent visibility. Covers Hindu, Islamic (Hilal), and historical traditions.', hi: 'चन्द्र दर्शन की कला और विज्ञान सीखें — चन्द्र आयु, दूरी और ऊँचाई कैसे दृश्यता निर्धारित करती है। हिन्दू, इस्लामी (हिलाल) और ऐतिहासिक परम्पराएँ।', sa: 'चन्द्रदर्शनस्य कलां विज्ञानं च अधिगच्छतु — चन्द्रवयः दूरी उन्नतिश्च कथं दृश्यतां निर्धारयन्ति।' },
    keywords: ['chandra darshan', 'moon sighting science', 'hilal visibility', 'crescent moon', 'shukla dwitiya', 'moon age elongation'],
  },

  // ─── Panchak & Holashtak ───────────────────────────────────
  '/learn/panchak': {
    title: { en: 'Panchak — The 5 Inauspicious Nakshatras | Dekho Panchang', hi: 'पंचक — 5 अशुभ नक्षत्र | Dekho Panchang', sa: 'पञ्चकम् — ५ अशुभनक्षत्राणि | Dekho Panchang' },
    description: { en: 'Complete guide to Panchak — the inauspicious period when Moon transits Dhanishtha through Revati. Activities to avoid, cremation rules, and regional practices.', hi: 'पंचक की पूरी जानकारी — धनिष्ठा से रेवती तक चन्द्र का गोचर। वर्जित कार्य, अंत्येष्टि नियम और क्षेत्रीय प्रथाएँ।', sa: 'पञ्चकस्य सम्पूर्णमार्गदर्शनम् — धनिष्ठातः रेवतीपर्यन्तं चन्द्रगोचरः।' },
    keywords: ['panchak', 'panchak nakshatra', 'inauspicious nakshatra', 'dhanishtha panchak', 'cremation panchak'],
  },
  '/learn/holashtak': {
    title: { en: 'Holashtak — 8 Inauspicious Days Before Holi | Dekho Panchang', hi: 'होलाष्टक — होली से पूर्व 8 अशुभ दिन | Dekho Panchang', sa: 'होलाष्टकम् — होलिकापूर्वम् ८ अशुभदिनानि | Dekho Panchang' },
    description: { en: 'Complete guide to Holashtak — the 8 inauspicious days before Holi from Phalguna Shukla Ashtami to Purnima. Activities to avoid and spiritual significance.', hi: 'होलाष्टक — होली से पहले फाल्गुन शुक्ल अष्टमी से पूर्णिमा तक 8 अशुभ दिनों की पूरी जानकारी।', sa: 'होलाष्टकम् — फाल्गुनशुक्लाष्टमीतः पूर्णिमापर्यन्तम् ८ अशुभदिनानां सम्पूर्णमार्गदर्शनम्।' },
    keywords: ['holashtak', 'holashtak 2026', '8 days before holi', 'inauspicious days holi', 'holashtak dates'],
  },
  '/panchak': {
    title: { en: 'Panchak Today — Check Inauspicious Nakshatra Period | Dekho Panchang', hi: 'आज का पंचक — अशुभ नक्षत्र काल जांचें | Dekho Panchang', sa: 'अद्य पञ्चकम् — अशुभनक्षत्रकालं परीक्षयतु | Dekho Panchang' },
    description: { en: 'Is Panchak active today? Check current Moon nakshatra, Panchak type, activities to avoid, and upcoming Panchak dates for your location.', hi: 'क्या आज पंचक है? वर्तमान चन्द्र नक्षत्र, पंचक प्रकार, वर्जित कार्य और आगामी पंचक तिथियाँ जांचें।', sa: 'अद्य पञ्चकं किम्? वर्तमानचन्द्रनक्षत्रं पञ्चकप्रकारं वर्जितकार्याणि च परीक्षयतु।' },
    keywords: ['panchak today', 'panchak check', 'is panchak today', 'panchak dates', 'moon nakshatra panchak'],
  },
  '/holashtak': {
    title: { en: 'Holashtak 2026 — 8 Inauspicious Days Before Holi | Dekho Panchang', hi: 'होलाष्टक 2026 — होली से पूर्व 8 अशुभ दिन | Dekho Panchang', sa: 'होलाष्टकम् 2026 — होलिकापूर्वम् ८ अशुभदिनानि | Dekho Panchang' },
    description: { en: 'Is Holashtak active today? Check which day of the 8-day inauspicious period before Holi, activities to avoid, and Holashtak dates for 2026-2027.', hi: 'क्या आज होलाष्टक है? होली से पहले 8 दिन की अशुभ अवधि, वर्जित कार्य और 2026-2027 की तिथियाँ।', sa: 'अद्य होलाष्टकं किम्? होलिकापूर्वम् ८ दिनानाम् अशुभकालः वर्जितकार्याणि 2026-2027 तिथ्यश्च।' },
    keywords: ['holashtak 2026', 'holashtak today', 'holashtak dates', 'inauspicious days before holi', 'holashtak period'],
  },
  '/dates/ganda-mool': {
    title: {
      en: 'Ganda Mool Nakshatra Dates 2026 — Complete List with Timings',
      hi: 'गण्ड मूल नक्षत्र तिथियां 2026 — समय सहित पूरी सूची',
      sa: 'गण्डमूलनक्षत्रतिथयः 2026',
    },
    description: {
      en: 'Complete list of Ganda Mool Nakshatra dates for 2026 with exact start/end timings. Ashwini, Ashlesha, Magha, Jyeshtha, Mula, Revati transit dates for any location.',
      hi: '2026 के लिए गण्ड मूल नक्षत्र तिथियों की पूरी सूची — सटीक समय सहित। किसी भी स्थान के लिए अश्विनी, आश्लेषा, मघा, ज्येष्ठा, मूल, रेवती गोचर तिथियां।',
      sa: '2026 वर्षस्य गण्डमूलनक्षत्रतिथीनां सम्पूर्णसूची। अश्विनी आश्लेषा मघा ज्येष्ठा मूलं रेवती गोचरतिथयः।',
    },
    keywords: ['ganda mool nakshatra', 'ganda mool dates 2026', 'ganda mool timings', 'ganda mool shanti puja', 'inauspicious nakshatra'],
  },
  '/calendar/regional/iskcon': {
    title: {
      en: 'ISKCON Vaishnava Calendar 2026 — Festivals, Ekadashi, Acharya Days',
      hi: 'इस्कॉन वैष्णव पंचांग 2026 — पर्व, एकादशी, आचार्य दिवस',
      sa: 'इस्कॉनवैष्णवपञ्चाङ्गम् 2026',
    },
    description: {
      en: 'Complete ISKCON Gaudiya Vaishnava calendar for 2026. Gaura Purnima, Janmashtami, Rath Yatra, Ekadashi with Maha Dvadashi rules, and appearance/disappearance days of acharyas.',
      hi: '2026 का सम्पूर्ण इस्कॉन गौड़ीय वैष्णव पंचांग। गौर पूर्णिमा, जन्माष्टमी, रथ यात्रा, महा द्वादशी नियमों सहित एकादशी, और आचार्यों के प्रकट/तिरोभाव दिवस।',
      sa: '2026 वर्षस्य सम्पूर्णम् इस्कॉनगौड़ीयवैष्णवपञ्चाङ्गम्।',
    },
    keywords: ['iskcon calendar 2026', 'gaudiya vaishnava calendar', 'gaura purnima', 'janmashtami', 'ekadashi iskcon', 'maha dvadashi'],
  },
  '/learn/varshaphal': {
    title: { en: 'Varshaphal — Vedic Solar Return & Tajika System', hi: 'वर्षफल — वैदिक सौर प्रत्यागमन और ताजिक पद्धति', sa: 'वर्षफलम् — वैदिकसौरप्रत्यागमनं ताजिकपद्धतिः च' },
    description: { en: 'Learn Varshaphal — the Vedic solar return chart. Tajika system, Muntha, Sahams, Mudda Dasha, 16 Tajika Yogas, and Varshesha explained with classical sources.', hi: 'वर्षफल — वैदिक सौर प्रत्यागमन कुण्डली। ताजिक पद्धति, मुन्था, सहम, मुद्दा दशा, 16 ताजिक योग और वर्षेश शास्त्रीय स्रोतों सहित।', sa: 'वर्षफलम् — वैदिकसौरप्रत्यागमनकुण्डली।' },
    keywords: ['varshaphal', 'vedic solar return', 'tajika system', 'muntha', 'mudda dasha', 'tajika yogas', 'varshesha', 'annual horoscope vedic'],
  },
  '/learn/kp-system': {
    title: { en: 'KP System — Krishnamurti Paddhati Explained', hi: 'केपी पद्धति — कृष्णमूर्ति पद्धति विस्तार से', sa: 'केपीपद्धतिः — कृष्णमूर्तिपद्धतिः' },
    description: { en: 'Complete guide to KP (Krishnamurti Paddhati) astrology — sub-lord theory, Placidus houses, KP Number 1-249, significators, and ruling planets for precise predictions.', hi: 'केपी ज्योतिष की सम्पूर्ण मार्गदर्शिका — उप-स्वामी सिद्धान्त, प्लेसिडस भाव, केपी संख्या 1-249, कारक और शासक ग्रह।', sa: 'केपीज्योतिषस्य सम्पूर्णमार्गदर्शिका।' },
    keywords: ['kp system', 'krishnamurti paddhati', 'sub lord theory', 'placidus houses', 'kp number', 'horary astrology kp', 'significators kp'],
  },
  '/learn/mangal-dosha': {
    title: { en: 'Mangal Dosha — Mars & Marriage Compatibility Guide', hi: 'मांगलिक दोष — मंगल और विवाह अनुकूलता', sa: 'माङ्गलिकदोषः — कुजदोषः विवाहानुकूलता च' },
    description: { en: 'Complete guide to Mangal Dosha (Manglik/Kuja Dosha) — formation in 6 houses, severity levels, 10+ BPHS cancellation rules, misconceptions debunked, and classical remedies.', hi: 'मांगलिक दोष की सम्पूर्ण मार्गदर्शिका — 6 भावों में निर्माण, तीव्रता, 10+ बीपीएचएस निवारण नियम, भ्रम निवारण, शास्त्रीय उपाय।', sa: 'माङ्गलिकदोषस्य सम्पूर्णमार्गदर्शिका।' },
    keywords: ['mangal dosha', 'manglik dosha', 'kuja dosha', 'mars marriage', 'mangal dosha cancellation', 'manglik remedies', 'chevvai dosham'],
  },
  '/learn/panchang-guide': {
    title: { en: 'What is Panchang? Complete Guide to the 5 Limbs', hi: 'पंचांग क्या है? सम्पूर्ण मार्गदर्शिका', sa: 'पञ्चाङ्गं किम्? सम्पूर्णमार्गदर्शिका' },
    description: { en: 'Complete guide to Panchang — the 5 limbs (Tithi, Nakshatra, Yoga, Karana, Vara), sunrise-based calendar, Amanta vs Purnimanta months, and how to use it daily.', hi: 'पंचांग की सम्पूर्ण मार्गदर्शिका — तिथि, नक्षत्र, योग, करण, वार, सूर्योदय कैलेण्डर, अमान्त बनाम पूर्णिमान्त, दैनिक उपयोग।', sa: 'पञ्चाङ्गस्य सम्पूर्णमार्गदर्शिका — तिथिः नक्षत्रं योगः करणं वारः।' },
    keywords: ['what is panchang', 'panchang guide', 'tithi nakshatra yoga karana vara', 'vedic calendar', 'hindu almanac', 'amanta purnimanta'],
  },
  '/learn/choghadiya': {
    title: { en: 'Choghadiya — Auspicious Time Periods Guide', hi: 'चौघड़िया — शुभ समय अवधि मार्गदर्शिका', sa: 'चौघड़िया — शुभकालमार्गदर्शिका' },
    description: { en: 'Complete guide to Choghadiya — the 7 types (Amrit, Shubh, Labh, Char, Rog, Kaal, Udveg), weekday rotation, daily timing decisions, and comparison with Hora system.', hi: 'चौघड़िया की सम्पूर्ण मार्गदर्शिका — 7 प्रकार (अमृत, शुभ, लाभ, चर, रोग, काल, उद्वेग), साप्ताहिक क्रम, दैनिक समय-निर्धारण।', sa: 'चौघड़ियामार्गदर्शिका — सप्तप्रकाराः।' },
    keywords: ['choghadiya', 'chaughadia', 'auspicious time', 'amrit choghadiya', 'shubh muhurat', 'gujarati panchang', 'daily timing vedic'],
  },
  '/rudraksha': {
    title: {
      en: 'Rudraksha Recommendation — Find Your Ideal Bead by Birth Chart',
      hi: 'रुद्राक्ष अनुशंसा — जन्म कुण्डली द्वारा उचित रुद्राक्ष खोजें',
      sa: 'रुद्राक्षानुशंसा — जन्मकुण्डलीद्वारा',
    },
    description: {
      en: 'Find the right Rudraksha based on your Vedic birth chart. Recommendations by Rashi lord and Nakshatra lord with mukhi, deity, mantra, benefits, and wearing instructions.',
      hi: 'अपनी वैदिक जन्म कुण्डली के आधार पर सही रुद्राक्ष खोजें। राशि स्वामी और नक्षत्र स्वामी द्वारा मुखी, देवता, मन्त्र, लाभ और धारण विधि सहित अनुशंसा।',
      sa: 'वैदिकजन्मकुण्डल्याधारेण सम्यक् रुद्राक्षम् अन्विष्यतु।',
    },
    keywords: ['rudraksha recommendation', 'rudraksha by rashi', 'rudraksha calculator', 'which mukhi rudraksha', 'rudraksha benefits'],
  },
};

/**
 * Generate metadata for a page route.
 * Falls back to layout metadata if route not found.
 */
export function getPageMetadata(route: string, locale: string): Metadata {
  const meta = PAGE_META[route];
  if (!meta) return {};

  const title = meta.title[locale] || meta.title.en;
  const description = meta.description[locale] || meta.description.en;
  const url = `${BASE_URL}/${locale}${route}`;

  // Build hreflang alternates for ALL locales
  const alternateLanguages: Record<string, string> = {};
  for (const l of locales) {
    alternateLanguages[l] = `${BASE_URL}/${l}${route}`;
  }
  alternateLanguages['x-default'] = `${BASE_URL}/en${route}`;

  return {
    title,
    description,
    keywords: meta.keywords,
    alternates: {
      canonical: url,
      languages: alternateLanguages,
    },
    openGraph: {
      title,
      description,
      url,
      siteName: 'Dekho Panchang',
      locale: OG_LOCALE_MAP[locale] || 'en_US',
      type: 'website',
      images: [{ url: `${BASE_URL}/${locale}/opengraph-image`, width: 1200, height: 630 }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
  };
}
