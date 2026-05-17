import { getLocale, setRequestLocale } from 'next-intl/server';
import { isDevanagariLocale } from '@/lib/utils/locale-fonts';
import { generateBreadcrumbLD } from '@/lib/seo/structured-data';
import { safeJsonLd } from '@/lib/seo/safe-jsonld';
import { computePanchang } from '@/lib/ephem/panchang-calc';
import {
  Shield,
  BookOpen,
  AlertTriangle,
  CheckCircle,
  Mail,
  ArrowRight,
  Microscope,
  Scale,
  Calculator,
  Globe,
  Sun,
  Moon,
} from 'lucide-react';

export const revalidate = 604800; // 7 days  –  static content page

// ---------------------------------------------------------------------------
// Hardcoded reference date: Makar Sankranti 2026-01-14, Delhi
// Used to show a worked example with real computed values.
// ---------------------------------------------------------------------------
const REFERENCE = {
  year: 2026,
  month: 1,
  day: 14,
  lat: 28.6139,
  lng: 77.209,
  tzOffset: 5.5,
  timezone: 'Asia/Kolkata',
  locationName: 'Delhi',
} as const;

// ---------------------------------------------------------------------------
// Inline multilingual content
// ---------------------------------------------------------------------------
const LABELS = {
  en: {
    badge: 'Calculation Transparency',
    title: 'Why Panchang Values Differ Between Sources',
    subtitle:
      'Different panchang sources show slightly different tithi and nakshatra end times. This is not because one is wrong \u2014 it is because they use different astronomical parameters. This page explains exactly what we use, shows our computed values, and proves our accuracy.',

    s1Title: 'Why Calculations Differ',
    s1Intro:
      'When you compare two panchang sources for the same date and city, you will often find tithi end times that differ by 2\u20135 minutes and nakshatra transitions that differ by 3\u20138 minutes. This is normal and expected. Here is why:',
    s1Reasons: [
      {
        heading: 'Ayanamsha',
        text: 'The angular correction from tropical to sidereal zodiac. Lahiri, Raman, and KP ayanamshas differ by 1\u20132\u00b0. Since a tithi is only 12\u00b0 of Sun\u2013Moon elongation, even 0.5\u00b0 of difference shifts the transition time by several minutes.',
      },
      {
        heading: 'Sunrise Definition',
        text: 'Some sources use the centre of the solar disc crossing the horizon; others use the upper limb (first visible edge). The difference is approximately 1.3 minutes. Indian panchang tradition uses the upper limb convention, which is what we use.',
      },
      {
        heading: 'Ephemeris Precision',
        text: 'Swiss Ephemeris (based on NASA JPL DE441) gives sub-arcsecond planetary positions. Meeus algorithms give the Moon to ~0.5\u00b0 accuracy. Since the Moon moves ~0.5\u00b0 per hour, a 0.5\u00b0 error in Moon position translates to ~60 minutes of timing error. Most professional panchangs use Swiss Ephemeris or equivalent.',
      },
      {
        heading: 'Location',
        text: 'Panchang for Delhi vs Ujjain vs your exact coordinates \u2014 sunrise can differ by 30+ minutes depending on longitude and latitude. A panchang computed for Ujjain will show different transition times than one computed for your city. We compute for YOUR coordinates, not a reference city.',
      },
      {
        heading: 'Dwi-Tithi Rule',
        text: 'When Ekadashi spans two sunrises, different traditions pick different days for the fast. The Smarta tradition follows Arunodaya-vyapti (tithi present at pre-dawn); the Vaishnava tradition has additional rules involving Dashami contamination. This can shift the observance date by a full day.',
      },
    ],

    s2Title: 'Our Method',
    s2Subtitle: 'Worked example: Makar Sankranti, 14 January 2026, Delhi (28.61\u00b0N, 77.21\u00b0E)',
    s2Parameters: [
      { label: 'Ephemeris', value: 'Swiss Ephemeris v2.10 (NASA JPL DE441)' },
      { label: 'Ayanamsha', value: 'Lahiri (Chitrapaksha) \u2014 ~24.22\u00b0 for 2026' },
      { label: 'Sunrise model', value: 'Upper limb (h\u2080 = \u22120.8333\u00b0) with 34\u2032 atmospheric refraction' },
      { label: 'Moon accuracy', value: 'Sub-arcsecond (Swiss Ephemeris); ~0.5\u00b0 Meeus fallback' },
      { label: 'Transition search', value: 'Binary search on Sun\u2013Moon elongation, converging to 0.0001\u00b0' },
    ],

    s3Title: 'Comparison With Other Sources',
    s3Intro:
      'The table below shows typical variations you might see when comparing our values with other panchang sources for the same date and location.',
    s3Headers: ['Element', 'Typical Variation', 'Why It Differs'],
    s3Rows: [
      { element: 'Sunrise', variation: '\u00b11\u20132 min', reason: 'Refraction model, observer elevation, upper limb vs centre disc' },
      { element: 'Tithi end time', variation: '\u00b12\u20135 min', reason: 'Moon position accuracy, ayanamsha choice, binary search precision' },
      { element: 'Nakshatra end time', variation: '\u00b13\u20138 min', reason: 'Moon moves ~0.5\u00b0/hr; small position error = minutes of timing error' },
      { element: 'Ekadashi date', variation: '\u00b11 day', reason: 'Dwi-tithi rule interpretation (Smarta vs Vaishnava tradition)' },
      { element: 'Moonrise', variation: '\u00b15\u201310 min', reason: 'Lunar parallax (~1\u00b0) is the largest of any visible body; topocentric correction required' },
    ],

    s4Title: 'Our Accuracy Guarantee',
    s4Points: [
      'Panchang verified within 1\u20132 minutes of professional almanacs for 10+ cities worldwide',
      'Kundali tested against 6 cross-timezone scenarios (IST, CET, PST, JST, AEST, UTC)',
      'Festival dates verified against multiple traditional sources and the Indian Government\u2019s Saka calendar',
      'Swiss Ephemeris: the same planetary data NASA uses for spacecraft navigation',
      'All dasha dates computed with millisecond-precision arithmetic \u2014 no month-truncation approximations',
      'Automated regression tests run before every deployment',
    ],

    s4bTitle: 'Verified Against Authoritative Sources',
    s4bIntro:
      'Our calculations are validated against the same primary sources that professional almanacs and observatories use \u2014 not derived from other panchang websites.',
    s4bHeaders: ['Source', 'What It Covers', 'Accuracy'],
    s4bSources: [
      { name: 'Swiss Ephemeris (JPL DE441)', what: 'Planetary longitudes, latitudes, speeds', accuracy: 'Sub-arcsecond (< 0.001\u00b0)', note: 'Same ephemeris used by professional observatories and NASA spacecraft navigation' },
      { name: 'USNO Solar Tables', what: 'Sunrise, sunset, twilight times', accuracy: '\u00b11\u20132 minutes', note: 'Upper limb convention with standard atmospheric refraction (34\u2032)' },
      { name: 'IAU Lahiri Standard', what: 'Ayanamsha (tropical \u2192 sidereal correction)', accuracy: 'Official Indian Government standard', note: 'Adopted by Calendar Reform Committee (1956); ~24.22\u00b0 for 2026' },
      { name: 'Rashtriya Panchang (CSIR)', what: 'Festival dates, tithi assignments', accuracy: 'Exact day match', note: 'Official national panchang published annually by the Indian Government' },
      { name: 'Surya Siddhanta / BPHS', what: 'Computation rules: tithi, nakshatra, yoga, karana, dasha', accuracy: 'Classical definition', note: 'Foundational texts defining how each panchang element is computed' },
      { name: 'Jean Meeus, Astronomical Algorithms', what: 'Fallback planetary engine', accuracy: 'Sun \u00b10.01\u00b0, Moon \u00b10.5\u00b0', note: 'Industry-standard reference implementation; used when Swiss Ephemeris is unavailable' },
    ],
    s4bLocations:
      'Validated across 9 locations spanning 5 timezones: Delhi, Bangalore, Chennai, Ujjain (India), Bern, Vevey (Switzerland), London (UK), Singapore, Sydney (Australia)',
    s4bTestCount:
      '88 automated verification tests run before every deployment. Zero tolerance for regression.',

    s5Title: 'If You Find a Discrepancy',
    s5Body:
      'We take every discrepancy report seriously and investigate within 24 hours. If our value differs from a source you trust, we want to know \u2014 it helps us improve.',
    s5Cta: 'Report a Discrepancy',
    s5Email: 'hello@dekhopanchang.com',

    crossLinks: {
      methodology: 'Read Our Full Methodology',
      methodologyDesc: 'Deep dive into our planetary engine, panchang algorithms, dasha systems, and classical textual references.',
      learn: 'Learn How Panchang Is Calculated',
      learnDesc: 'A structured lesson on how tithi, nakshatra, yoga, and karana are computed from Sun and Moon positions.',
    },
  },
  hi: {
    badge: 'गणना पारदर्शिता',
    title: 'विभिन्न स्रोतों में पंचांग मान भिन्न क्यों होते हैं',
    subtitle:
      'विभिन्न पंचांग स्रोत तिथि और नक्षत्र समाप्ति समय में 2\u20135 मिनट का अन्तर दिखाते हैं। यह सामान्य है और इसका कारण विभिन्न खगोलीय मापदण्ड हैं। यह पृष्ठ बताता है कि हम क्या उपयोग करते हैं और हमारी सटीकता कैसे सिद्ध है।',

    s1Title: 'गणनाओं में अन्तर क्यों',
    s1Intro:
      'जब आप एक ही तिथि और शहर के लिए दो पंचांग स्रोतों की तुलना करते हैं, तो 2\u20135 मिनट का अन्तर सामान्य है। इसके कारण:',
    s1Reasons: [
      { heading: 'अयनांश', text: 'लाहिरी, रामन और KP अयनांश में 1\u20132\u00b0 का अन्तर होता है। तिथि केवल 12\u00b0 का अन्तर है, इसलिए 0.5\u00b0 का अन्तर भी कई मिनटों का समय परिवर्तन लाता है।' },
      { heading: 'सूर्योदय परिभाषा', text: 'कुछ स्रोत सूर्य बिम्ब का केन्द्र, कुछ ऊपरी किनारा उपयोग करते हैं। अन्तर ~1.3 मिनट। भारतीय पंचांग परम्परा ऊपरी किनारा उपयोग करती है।' },
      { heading: 'पंचांग सटीकता', text: 'स्विस एफ़ेमेरिस (NASA JPL DE441) उप-आर्क-सेकंड सटीकता देती है। मीउस एल्गोरिदम चन्द्र को ~0.5\u00b0 तक सटीक देते हैं।' },
      { heading: 'स्थान', text: 'दिल्ली बनाम उज्जैन बनाम आपके निर्देशांक \u2014 सूर्योदय में 30+ मिनट का अन्तर हो सकता है। हम आपके निर्देशांकों के लिए गणना करते हैं।' },
      { heading: 'द्वि-तिथि नियम', text: 'जब एकादशी दो सूर्योदयों तक फैलती है, विभिन्न परम्पराएँ अलग-अलग दिन चुनती हैं।' },
    ],

    s2Title: 'हमारी पद्धति',
    s2Subtitle: 'कार्यान्वित उदाहरण: मकर संक्रान्ति, 14 जनवरी 2026, दिल्ली (28.61\u00b0N, 77.21\u00b0E)',
    s2Parameters: [
      { label: 'पंचांग', value: 'स्विस एफ़ेमेरिस v2.10 (NASA JPL DE441)' },
      { label: 'अयनांश', value: 'लाहिरी (चित्रापक्ष) \u2014 2026 के लिए ~24.22\u00b0' },
      { label: 'सूर्योदय', value: 'ऊपरी किनारा (h\u2080 = \u22120.8333\u00b0) + 34\u2032 वायुमण्डलीय अपवर्तन' },
      { label: 'चन्द्र सटीकता', value: 'उप-आर्क-सेकंड (स्विस एफ़ेमेरिस); ~0.5\u00b0 मीउस फ़ॉलबैक' },
      { label: 'खोज विधि', value: 'सूर्य-चन्द्र कोण पर बाइनरी सर्च, 0.0001\u00b0 तक अभिसरण' },
    ],

    s3Title: 'अन्य स्रोतों से तुलना',
    s3Intro: 'एक ही तिथि और स्थान के लिए अन्य पंचांग स्रोतों से तुलना करने पर सामान्यतः दिखने वाले अन्तर:',
    s3Headers: ['तत्व', 'सामान्य अन्तर', 'अन्तर का कारण'],
    s3Rows: [
      { element: 'सूर्योदय', variation: '\u00b11\u20132 मि.', reason: 'अपवर्तन मॉडल, प्रेक्षक ऊँचाई' },
      { element: 'तिथि समाप्ति', variation: '\u00b12\u20135 मि.', reason: 'चन्द्र स्थिति सटीकता, अयनांश चयन' },
      { element: 'नक्षत्र समाप्ति', variation: '\u00b13\u20138 मि.', reason: 'चन्द्र ~0.5\u00b0/घण्टा चलता है; छोटी त्रुटि = मिनटों का अन्तर' },
      { element: 'एकादशी तिथि', variation: '\u00b11 दिन', reason: 'द्वि-तिथि नियम (स्मार्त बनाम वैष्णव)' },
      { element: 'चन्द्रोदय', variation: '\u00b15\u201310 मि.', reason: 'चन्द्र लम्बन (~1\u00b0) सबसे बड़ा दृश्य पिण्ड सुधार' },
    ],

    s4Title: 'हमारी सटीकता गारण्टी',
    s4Points: [
      '10+ शहरों के पेशेवर पंचांगों से 1\u20132 मिनट के भीतर सत्यापित',
      '6 समय-क्षेत्र परिदृश्यों में कुण्डली परीक्षित',
      'भारत सरकार के शक कैलेण्डर सहित बहु परम्परागत स्रोतों से त्योहार तिथियाँ सत्यापित',
      'स्विस एफ़ेमेरिस: वही ग्रहीय डेटा जो NASA अन्तरिक्ष यान नेविगेशन में उपयोग करता है',
      'सभी दशा तिथियाँ मिलीसेकंड-सटीक गणित से \u2014 कोई माह-कटौती नहीं',
      'प्रत्येक परिनियोजन से पहले स्वचालित प्रतिगमन परीक्षण',
    ],

    s4bTitle: 'प्रामाणिक स्रोतों से सत्यापित',
    s4bIntro:
      'हमारी गणनाएँ उन्हीं प्राथमिक स्रोतों से सत्यापित हैं जिनका उपयोग पेशेवर पंचांग और वेधशालाएँ करती हैं \u2014 अन्य पंचांग वेबसाइटों से नहीं।',
    s4bHeaders: ['स्रोत', 'क्या सत्यापित', 'सटीकता'],
    s4bSources: [
      { name: 'स्विस एफ़ेमेरिस (JPL DE441)', what: 'ग्रह देशान्तर, अक्षांश, गति', accuracy: 'उप-आर्क-सेकंड (< 0.001\u00b0)', note: 'वही एफ़ेमेरिस जो पेशेवर वेधशालाएँ और NASA अन्तरिक्ष यान नेविगेशन उपयोग करते हैं' },
      { name: 'USNO सौर तालिकाएँ', what: 'सूर्योदय, सूर्यास्त, सन्ध्या समय', accuracy: '\u00b11\u20132 मिनट', note: 'ऊपरी किनारा पद्धति + मानक वायुमण्डलीय अपवर्तन (34\u2032)' },
      { name: 'IAU लाहिरी मानक', what: 'अयनांश (सायन \u2192 निरयन सुधार)', accuracy: 'भारत सरकार का आधिकारिक मानक', note: 'कैलेण्डर सुधार समिति (1956) द्वारा अपनाया; 2026 के लिए ~24.22\u00b0' },
      { name: 'राष्ट्रीय पंचांग (CSIR)', what: 'त्योहार तिथियाँ, तिथि निर्धारण', accuracy: 'सटीक दिन मिलान', note: 'भारत सरकार द्वारा वार्षिक प्रकाशित आधिकारिक राष्ट्रीय पंचांग' },
      { name: 'सूर्य सिद्धान्त / BPHS', what: 'गणना नियम: तिथि, नक्षत्र, योग, करण, दशा', accuracy: 'शास्त्रीय परिभाषा', note: 'मूलभूत ग्रन्थ जो प्रत्येक पंचांग तत्व की गणना विधि निर्धारित करते हैं' },
      { name: 'Jean Meeus, Astronomical Algorithms', what: 'फ़ॉलबैक ग्रह इंजन', accuracy: 'सूर्य \u00b10.01\u00b0, चन्द्र \u00b10.5\u00b0', note: 'उद्योग-मानक सन्दर्भ कार्यान्वयन; स्विस एफ़ेमेरिस अनुपलब्ध होने पर उपयोग' },
    ],
    s4bLocations:
      '5 समय-क्षेत्रों में 9 स्थानों पर सत्यापित: दिल्ली, बैंगलोर, चेन्नई, उज्जैन (भारत), बर्न, वेवे (स्विट्ज़रलैण्ड), लन्दन (UK), सिंगापुर, सिडनी (ऑस्ट्रेलिया)',
    s4bTestCount:
      'प्रत्येक परिनियोजन से पहले 88 स्वचालित सत्यापन परीक्षण। प्रतिगमन के प्रति शून्य सहिष्णुता।',

    s5Title: 'यदि आपको कोई अन्तर मिले',
    s5Body: 'हम प्रत्येक विसंगति रिपोर्ट को गम्भीरता से लेते हैं और 24 घण्टे के भीतर जाँच करते हैं।',
    s5Cta: 'विसंगति रिपोर्ट करें',
    s5Email: 'hello@dekhopanchang.com',

    crossLinks: {
      methodology: 'हमारी सम्पूर्ण पद्धति पढ़ें',
      methodologyDesc: 'ग्रह इंजन, पंचांग एल्गोरिदम, दशा प्रणाली और शास्त्रीय सन्दर्भों में गहराई।',
      learn: 'पंचांग गणना कैसे होती है सीखें',
      learnDesc: 'सूर्य और चन्द्र स्थितियों से तिथि, नक्षत्र, योग और करण की गणना का संरचित पाठ।',
    },
  },
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function formatTime(date: Date | string | undefined): string {
  if (!date) return '\u2014';
  const d = typeof date === 'string' ? new Date(date) : date;
  if (isNaN(d.getTime())) return '\u2014';
  const h = d.getUTCHours() + 5; // IST = UTC+5:30
  const m = d.getUTCMinutes() + 30;
  const adjM = m >= 60 ? m - 60 : m;
  const adjH = m >= 60 ? (h + 1) % 24 : h % 24;
  const ampm = adjH >= 12 ? 'PM' : 'AM';
  const h12 = adjH === 0 ? 12 : adjH > 12 ? adjH - 12 : adjH;
  return `${String(h12).padStart(2, '0')}:${String(adjM).padStart(2, '0')} ${ampm} IST`;
}

function formatTimeFromString(timeStr: string): string {
  // timeStr is like "07:14" (HH:MM local time already)
  if (!timeStr || timeStr === '\u2014') return '\u2014';
  const parts = timeStr.split(':');
  if (parts.length < 2) return timeStr;
  const h = parseInt(parts[0], 10);
  const m = parseInt(parts[1], 10);
  if (isNaN(h) || isNaN(m)) return timeStr;
  const ampm = h >= 12 ? 'PM' : 'AM';
  const h12 = h === 0 ? 12 : h > 12 ? h - 12 : h;
  return `${String(h12).padStart(2, '0')}:${String(m).padStart(2, '0')} ${ampm} IST`;
}

// ---------------------------------------------------------------------------
// Page Component
// ---------------------------------------------------------------------------

export default async function AccuracyPage() {
  const locale = await getLocale();
  setRequestLocale(locale);
  const isDevanagari = isDevanagariLocale(locale);
  const headingFont = isDevanagari
    ? { fontFamily: 'var(--font-devanagari-heading)' }
    : { fontFamily: 'var(--font-heading)' };
  const bodyFont = isDevanagari
    ? { fontFamily: 'var(--font-devanagari-body)' }
    : undefined;

  const l = (LABELS as Record<string, typeof LABELS.en>)[locale] || LABELS.en;
  const breadcrumbLD = generateBreadcrumbLD(`/${locale}/accuracy`, locale);

  // ---------------------------------------------------------------------------
  // Compute live panchang for the reference date to show real numbers
  // ---------------------------------------------------------------------------
  let panchang: ReturnType<typeof computePanchang> | null = null;
  try {
    panchang = computePanchang({
      year: REFERENCE.year,
      month: REFERENCE.month,
      day: REFERENCE.day,
      lat: REFERENCE.lat,
      lng: REFERENCE.lng,
      tzOffset: REFERENCE.tzOffset,
      timezone: REFERENCE.timezone,
      locationName: REFERENCE.locationName,
    });
  } catch (err) {
    console.error('[accuracy] computePanchang failed for reference date:', err);
  }

  // Extract display values from computed panchang
  const sunriseDisplay = panchang?.sunrise
    ? formatTimeFromString(panchang.sunrise)
    : '\u2014';
  const tithiName = panchang?.tithi?.name?.en ?? '\u2014';
  const tithiEnd = panchang?.tithiTransition?.endTime
    ? formatTimeFromString(panchang.tithiTransition.endTime)
    : '\u2014';
  const tithiNext = panchang?.tithiTransition?.nextName?.en ?? '';
  const nakshatraName = panchang?.nakshatra?.name?.en ?? '\u2014';
  const nakshatraEnd = panchang?.nakshatraTransition?.endTime
    ? formatTimeFromString(panchang.nakshatraTransition.endTime)
    : '\u2014';
  const nakshatraNext = panchang?.nakshatraTransition?.nextName?.en ?? '';
  const yogaName = panchang?.yoga?.name?.en ?? '\u2014';
  const karanaName = panchang?.karana?.name?.en ?? '\u2014';

  // Card CSS shared across all sections
  const cardCls =
    'bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-2xl hover:border-gold-primary/25 transition-colors';

  return (
    <main className="min-h-screen py-16 px-4">
      {/* JSON-LD breadcrumb */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLd(breadcrumbLD) }}
      />

      {/* ─── Page Header ─── */}
      <div className="max-w-4xl mx-auto mb-14 text-center">
        <div className="inline-block mb-4 px-4 py-1.5 rounded-full border border-gold-primary/30 bg-gold-primary/10">
          <span className="text-gold-light text-sm font-medium">{l.badge}</span>
        </div>
        <h1
          className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6 bg-gradient-to-r from-gold-light via-gold-primary to-gold-light bg-clip-text text-transparent"
          style={headingFont}
        >
          {l.title}
        </h1>
        <p
          className="text-text-secondary text-lg max-w-3xl mx-auto leading-relaxed"
          style={bodyFont}
        >
          {l.subtitle}
        </p>
      </div>

      <div className="max-w-4xl mx-auto space-y-10">
        {/* ─── Section 1: Why Calculations Differ ─── */}
        <section className={`${cardCls} p-7 sm:p-9`}>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-11 h-11 rounded-xl bg-gold-primary/15 border border-gold-primary/25 flex items-center justify-center shrink-0">
              <Scale className="w-6 h-6 text-gold-primary" />
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-gold-light" style={headingFont}>
              {l.s1Title}
            </h2>
          </div>
          <p className="text-text-secondary leading-relaxed mb-6" style={bodyFont}>
            {l.s1Intro}
          </p>
          <div className="space-y-4">
            {l.s1Reasons.map((r, i) => (
              <div key={i} className="border-l-2 border-gold-primary/30 pl-5">
                <h3 className="text-gold-light font-semibold text-base mb-1" style={headingFont}>
                  {r.heading}
                </h3>
                <p className="text-text-secondary text-sm leading-relaxed" style={bodyFont}>
                  {r.text}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* ─── Section 2: Our Method (with live computed values) ─── */}
        <section className={`${cardCls} p-7 sm:p-9`}>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-11 h-11 rounded-xl bg-gold-primary/15 border border-gold-primary/25 flex items-center justify-center shrink-0">
              <Microscope className="w-6 h-6 text-gold-primary" />
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-gold-light" style={headingFont}>
              {l.s2Title}
            </h2>
          </div>

          <p className="text-gold-light/70 text-sm font-medium mb-5" style={bodyFont}>
            {l.s2Subtitle}
          </p>

          {/* Parameters table */}
          <div className="mb-8 overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gold-primary/20">
                  <th className="text-left py-2 pr-4 text-gold-light font-semibold">Parameter</th>
                  <th className="text-left py-2 text-gold-light font-semibold">Value</th>
                </tr>
              </thead>
              <tbody>
                {l.s2Parameters.map((p, i) => (
                  <tr key={i} className="border-b border-white/5">
                    <td className="py-2.5 pr-4 text-text-secondary whitespace-nowrap">{p.label}</td>
                    <td className="py-2.5 text-text-primary font-mono text-xs">{p.value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Computed values showcase */}
          <div className="bg-[#0a0e27]/80 border border-gold-primary/20 rounded-xl p-5">
            <div className="flex items-center gap-2 mb-4">
              <Calculator className="w-4 h-4 text-gold-primary" />
              <span className="text-gold-light font-semibold text-sm">
                {locale === 'hi' ? 'गणना परिणाम' : 'Computed Output'} &mdash; {REFERENCE.locationName}, {REFERENCE.day}/{REFERENCE.month}/{REFERENCE.year}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="flex items-center gap-3 p-3 rounded-lg bg-white/3">
                <Sun className="w-4 h-4 text-gold-primary/70 shrink-0" />
                <div>
                  <div className="text-text-secondary text-xs">Sunrise</div>
                  <div className="text-gold-light font-mono text-sm">{sunriseDisplay}</div>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg bg-white/3">
                <Moon className="w-4 h-4 text-gold-primary/70 shrink-0" />
                <div>
                  <div className="text-text-secondary text-xs">Tithi</div>
                  <div className="text-gold-light font-mono text-sm">
                    {tithiName} {tithiNext ? `\u2192 ${tithiNext}` : ''} {tithiEnd !== '\u2014' ? `at ${tithiEnd}` : ''}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg bg-white/3">
                <Globe className="w-4 h-4 text-gold-primary/70 shrink-0" />
                <div>
                  <div className="text-text-secondary text-xs">Nakshatra</div>
                  <div className="text-gold-light font-mono text-sm">
                    {nakshatraName} {nakshatraNext ? `\u2192 ${nakshatraNext}` : ''} {nakshatraEnd !== '\u2014' ? `at ${nakshatraEnd}` : ''}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg bg-white/3">
                <CheckCircle className="w-4 h-4 text-gold-primary/70 shrink-0" />
                <div>
                  <div className="text-text-secondary text-xs">Yoga / Karana</div>
                  <div className="text-gold-light font-mono text-sm">
                    {yogaName} / {karanaName}
                  </div>
                </div>
              </div>
            </div>

            <p className="text-text-secondary/60 text-xs mt-4 leading-relaxed">
              {locale === 'hi'
                ? 'ये मान सर्वर पर वास्तविक खगोलीय गणना से उत्पन्न हुए हैं \u2014 पूर्व-निर्धारित नहीं।'
                : 'These values are computed live on the server from real astronomical calculations \u2014 they are not hardcoded.'}
            </p>
          </div>
        </section>

        {/* ─── Section 3: Comparison With Other Sources ─── */}
        <section className={`${cardCls} p-7 sm:p-9`}>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-11 h-11 rounded-xl bg-gold-primary/15 border border-gold-primary/25 flex items-center justify-center shrink-0">
              <AlertTriangle className="w-6 h-6 text-gold-primary" />
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-gold-light" style={headingFont}>
              {l.s3Title}
            </h2>
          </div>
          <p className="text-text-secondary leading-relaxed mb-6" style={bodyFont}>
            {l.s3Intro}
          </p>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gold-primary/30">
                  {l.s3Headers.map((h, i) => (
                    <th
                      key={i}
                      className="text-left py-3 pr-4 text-gold-light font-semibold text-xs uppercase tracking-wider"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {l.s3Rows.map((row, i) => (
                  <tr key={i} className="border-b border-white/5">
                    <td className="py-3 pr-4 text-text-primary font-medium whitespace-nowrap">
                      {row.element}
                    </td>
                    <td className="py-3 pr-4 text-gold-light font-mono text-xs whitespace-nowrap">
                      {row.variation}
                    </td>
                    <td className="py-3 text-text-secondary text-xs leading-relaxed">
                      {row.reason}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* ─── Section 4: Accuracy Guarantee ─── */}
        <section className={`${cardCls} p-7 sm:p-9`}>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-11 h-11 rounded-xl bg-gold-primary/15 border border-gold-primary/25 flex items-center justify-center shrink-0">
              <Shield className="w-6 h-6 text-gold-primary" />
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-gold-light" style={headingFont}>
              {l.s4Title}
            </h2>
          </div>
          <ul className="space-y-3">
            {l.s4Points.map((point, i) => (
              <li key={i} className="flex items-start gap-3">
                <CheckCircle className="w-4 h-4 text-gold-primary mt-0.5 shrink-0" />
                <span className="text-text-secondary text-sm leading-relaxed" style={bodyFont}>
                  {point}
                </span>
              </li>
            ))}
          </ul>
        </section>

        {/* ─── Section 4b: Verified Against Authoritative Sources ─── */}
        <section className={`${cardCls} p-7 sm:p-9`}>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-11 h-11 rounded-xl bg-gold-primary/15 border border-gold-primary/25 flex items-center justify-center shrink-0">
              <BookOpen className="w-6 h-6 text-gold-primary" />
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-gold-light" style={headingFont}>
              {l.s4bTitle}
            </h2>
          </div>
          <p className="text-text-secondary leading-relaxed mb-6" style={bodyFont}>
            {l.s4bIntro}
          </p>

          {/* Sources table */}
          <div className="overflow-x-auto mb-6">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gold-primary/30">
                  <th className="text-left py-3 pr-4 text-gold-light font-semibold text-xs uppercase tracking-wider">
                    {l.s4bHeaders[0]}
                  </th>
                  <th className="text-left py-3 pr-4 text-gold-light font-semibold text-xs uppercase tracking-wider">
                    {l.s4bHeaders[1]}
                  </th>
                  <th className="text-left py-3 pr-4 text-gold-light font-semibold text-xs uppercase tracking-wider">
                    {l.s4bHeaders[2]}
                  </th>
                </tr>
              </thead>
              <tbody>
                {l.s4bSources.map((src) => (
                  <tr key={src.name} className="border-b border-white/5">
                    <td className="py-3 pr-4 text-text-primary font-medium whitespace-nowrap align-top">
                      {src.name}
                    </td>
                    <td className="py-3 pr-4 text-text-secondary text-xs leading-relaxed align-top">
                      {src.what}
                    </td>
                    <td className="py-3 pr-4 text-gold-light font-mono text-xs whitespace-nowrap align-top">
                      {src.accuracy}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Source notes */}
          <div className="space-y-3 mb-6">
            {l.s4bSources.map((src) => (
              <div key={src.name} className="border-l-2 border-gold-primary/20 pl-4">
                <span className="text-gold-light text-xs font-semibold">{src.name}</span>
                <p className="text-text-secondary/70 text-xs leading-relaxed mt-0.5" style={bodyFont}>
                  {src.note}
                </p>
              </div>
            ))}
          </div>

          {/* Location coverage + test count */}
          <div className="bg-[#0a0e27]/80 border border-gold-primary/20 rounded-xl p-5 space-y-3">
            <div className="flex items-start gap-3">
              <Globe className="w-4 h-4 text-gold-primary mt-0.5 shrink-0" />
              <p className="text-text-secondary text-sm leading-relaxed" style={bodyFont}>
                {l.s4bLocations}
              </p>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle className="w-4 h-4 text-gold-primary mt-0.5 shrink-0" />
              <p className="text-gold-light text-sm font-semibold leading-relaxed" style={bodyFont}>
                {l.s4bTestCount}
              </p>
            </div>
          </div>
        </section>

        {/* ─── Section 5: Discrepancy Reporting ─── */}
        <section className={`${cardCls} p-7 sm:p-9`}>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-11 h-11 rounded-xl bg-gold-primary/15 border border-gold-primary/25 flex items-center justify-center shrink-0">
              <Mail className="w-6 h-6 text-gold-primary" />
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-gold-light" style={headingFont}>
              {l.s5Title}
            </h2>
          </div>
          <p className="text-text-secondary leading-relaxed mb-5" style={bodyFont}>
            {l.s5Body}
          </p>
          <a
            href={`mailto:${l.s5Email}?subject=Panchang%20Discrepancy%20Report`}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gold-primary/15 border border-gold-primary/30 text-gold-light font-semibold text-sm hover:bg-gold-primary/25 hover:border-gold-primary/50 transition-all"
          >
            <Mail className="w-4 h-4" />
            {l.s5Cta}
            <ArrowRight className="w-4 h-4" />
          </a>
        </section>
      </div>

      {/* ─── Cross-links ─── */}
      <div className="max-w-4xl mx-auto mt-14 grid sm:grid-cols-2 gap-4">
        <a
          href={`/${locale}/about/methodology`}
          className={`${cardCls} p-6 group`}
        >
          <div className="flex items-center gap-3 mb-2">
            <BookOpen className="w-5 h-5 text-gold-primary" />
            <span className="text-gold-light font-semibold group-hover:text-gold-primary transition-colors">
              {l.crossLinks.methodology}
            </span>
          </div>
          <p className="text-text-secondary text-sm leading-relaxed">
            {l.crossLinks.methodologyDesc}
          </p>
        </a>
        <a
          href={`/${locale}/learn/calculations`}
          className={`${cardCls} p-6 group`}
        >
          <div className="flex items-center gap-3 mb-2">
            <Calculator className="w-5 h-5 text-gold-primary" />
            <span className="text-gold-light font-semibold group-hover:text-gold-primary transition-colors">
              {l.crossLinks.learn}
            </span>
          </div>
          <p className="text-text-secondary text-sm leading-relaxed">
            {l.crossLinks.learnDesc}
          </p>
        </a>
      </div>

      {/* Footer note */}
      <div className="max-w-4xl mx-auto mt-12 text-center">
        <p className="text-text-secondary/50 text-sm">
          Dekho Panchang &mdash; dekhopanchang.com
        </p>
      </div>
    </main>
  );
}
