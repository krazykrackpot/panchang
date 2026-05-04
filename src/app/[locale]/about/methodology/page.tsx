import { getLocale } from 'next-intl/server';
import { isDevanagariLocale } from '@/lib/utils/locale-fonts';
import { generateBreadcrumbLD } from '@/lib/seo/structured-data';
import { safeJsonLd } from '@/lib/seo/safe-jsonld';

export const revalidate = 604800; // 7 days — static text page
import {
  Calculator,
  Sun,
  Moon,
  Star,
  BookOpen,
  Shield,
  Globe,
  Clock,
  Compass,
  Layers,
  CheckCircle,
  GitBranch,
  Zap,
  Archive,
} from 'lucide-react';

// ---------------------------------------------------------------------------
// Inline multilingual content — SSR server component, no client JS
// ---------------------------------------------------------------------------

const CONTENT = {
  en: {
    badge: 'Transparency & Rigor',
    title: 'Our Methodology',
    subtitle:
      'Every calculation on Dekho Panchang is derived from first principles using the same mathematics that powered the observatories of Ujjain. No black-box APIs. No guesswork. Every result is reproducible.',

    sections: [
      {
        id: 'overview',
        icon: 'compass',
        heading: 'Overview & Mission',
        body: [
          'Dekho Panchang was built on a single conviction: astronomical accuracy is non-negotiable. The Vedic calendar tradition rests on observations that ancient Indian astronomers refined over millennia — observations so precise that the Surya Siddhanta\'s sidereal year (365.2563627 days) differs from the modern value by less than two seconds per year.',
          'We honour that tradition by doing every computation from first principles. Planetary positions, tithi boundaries, nakshatra transitions, sunrise/sunset times, dasha dates — all are calculated using peer-reviewed astronomical algorithms and verified against independent reference data before release.',
          'There are no external astrology APIs. Every result you see on this site is a direct product of mathematics, running on our servers, from the parameters you provide. This means every result is fully reproducible: given the same date, time, and geographic coordinates, the same calculation will always produce the same answer.',
        ],
      },
      {
        id: 'planetary-engine',
        icon: 'star',
        heading: 'Planetary Position Engine',
        body: [
          'Accurate planetary positions are the foundation of everything else. We use a two-tier engine:',
          '**Primary — Swiss Ephemeris (DE431 / VSOP87):** The Swiss Ephemeris is based on JPL\'s DE431 lunar theory and the VSOP87 planetary theory, the same mathematical foundations used by major observatories worldwide. It achieves sub-arcsecond accuracy for all planets from 13,200 BCE to 17,191 CE — far beyond what any panchang calculation requires.',
          '**Fallback — Jean Meeus "Astronomical Algorithms" (1991):** When the full Swiss Ephemeris is not available, we fall back to Jean Meeus\'s algorithms, the gold standard for computational astronomy in software. Accuracy: Sun positions within ~0.01°, Moon within ~0.5°. This fallback is clearly flagged in the output via internal warnings.',
          '**Corrections applied:** All positions include nutation (the 18.6-year wobble of Earth\'s rotational axis), aberration (the apparent shift of stars due to Earth\'s orbital velocity), and light-time correction (the time taken for reflected sunlight to reach the observer — significant for outer planets). The result is the apparent topocentric position as seen from the observer\'s location.',
          '**Ayanamsha:** We use the Lahiri Ayanamsha (Chitrapaksha) by default — the official standard adopted by India\'s Calendar Reform Committee in 1957. The current value is approximately 24°09\'. All planetary positions displayed on this site are sidereal (nirayana), computed by subtracting the Lahiri ayanamsha from the tropical ecliptic longitude.',
          '**Verification:** Computed positions have been cross-checked against NASA/JPL Horizons ephemeris data for multiple test dates and locations, confirming agreement within instrument-grade tolerances.',
        ],
      },
      {
        id: 'panchang-elements',
        icon: 'layers',
        heading: 'Panchang Elements',
        subsections: [
          {
            title: 'Tithi (Lunar Day)',
            text: 'A tithi is defined as 12° of elongation between the Moon and the Sun along the ecliptic. There are 30 tithis in a lunar month (15 in Shukla Paksha, 15 in Krishna Paksha). We compute the exact moment the elongation crosses each 12° boundary using a bisection algorithm, converging to within 0.0001° — producing start and end times accurate to the nearest minute. Because the Moon\'s elliptical orbit causes its speed to vary from ~12°/day to ~15°/day, no fixed-duration approximation is used. All boundaries are computed from the precise instantaneous elongation.',
          },
          {
            title: 'Nakshatra (Lunar Mansion)',
            text: 'The 27 nakshatras each span exactly 13°20\' (360° ÷ 27) of sidereal longitude. The Moon\'s nakshatra at any moment is computed from its sidereal longitude: ⌊λ_moon_sidereal ÷ 13.333°⌋. Transition times are computed via bisection to arc-minute precision. The 28th nakshatra Abhijit (used in Muhurta) spans 276°40\'–280°53\'20\" sidereal longitude and is computed separately.',
          },
          {
            title: 'Yoga (Luni-Solar Combination)',
            text: 'Each of the 27 yogas corresponds to 13°20\' of the sum of the Sun\'s and Moon\'s sidereal longitudes: yoga = ⌊(λ_sun + λ_moon) mod 360° ÷ 13.333°⌋. Because this sum advances faster than either body alone, each yoga lasts roughly 0.9 days on average, though actual duration varies considerably with the Moon\'s velocity.',
          },
          {
            title: 'Karana (Half-Tithi)',
            text: 'A karana is half a tithi — 6° of Sun-Moon elongation. Each tithi contains two karanas. The cycle of 11 karanas (4 fixed Sthira karanas + 7 repeating Chara karanas) follows the rules in Brihat Parashara Hora Shastra exactly: Vishti (Bhadra) falls at positions 7, 14, 21, and 28 of the 60-karana cycle. This enables classical muhurta inauspiciousness calculations that flag Vishti karanas automatically.',
          },
          {
            title: 'Vara (Weekday)',
            text: 'The weekday lord is derived from the Julian Day Number: weekday = ⌊JD + 1.5⌋ mod 7, where 0 = Sunday, 1 = Monday, …, 6 = Saturday. This matches the UTC weekday convention (Date.getUTCDay()). The vara lord (Surya, Chandra, Mangala, Budha, Guru, Shukra, Shani) follows from this weekday index per classical Jyotish.',
          },
        ],
      },
      {
        id: 'sunrise-sunset',
        icon: 'sun',
        heading: 'Sunrise, Sunset & Moonrise',
        body: [
          '**Sunrise/Sunset Algorithm:** We use the Meeus algorithm with the full geometric solar position, not simplified tables. Atmospheric refraction of exactly 34\' (arcminutes) is applied at the horizon — matching the classical definition used in Indian panchang tradition. The "upper limb" convention is used: sunrise is the moment the upper edge of the Sun\'s disc first appears above the geometrical horizon after applying refraction.',
          '**Observer elevation:** Altitude above sea level is factored into the horizon dip calculation. This matters for mountainous regions: at 2000 m elevation, sunrise can be several minutes earlier than at sea level due to the extended line of sight.',
          '**Accuracy:** Sunrise and sunset times computed by this engine are within ±1 minute of NASA solar tables and United States Naval Observatory (USNO) data for all test locations (including equatorial, mid-latitude, and high-latitude sites). Polar day/night edge cases are handled gracefully.',
          '**Moonrise/Moonset:** The Moon requires special treatment because its parallax (~1°) is the largest of any solar system body visible to the naked eye. We apply horizontal parallax correction (the difference between the Moon\'s geocentric and topocentric positions) before computing rise/set times. This correction can shift the computed moonrise by up to 60 minutes depending on the Moon\'s distance and the observer\'s latitude.',
        ],
      },
      {
        id: 'dasha-system',
        icon: 'clock',
        heading: 'Dasha Systems',
        body: [
          '**Vimshottari Dasha** is the primary dasha system used. The 120-year cycle is divided among nine planets (grahas) with the following durations: Ketu 7y, Venus 20y, Sun 6y, Moon 10y, Mars 7y, Rahu 18y, Jupiter 16y, Saturn 19y, Mercury 17y. The starting point is determined by the Moon\'s position within its birth nakshatra: the fraction of the nakshatra remaining at birth multiplies the planet\'s dasha duration to give the balance of the first dasha.',
          '**Date arithmetic:** All dasha dates are computed using millisecond-precision arithmetic: `new Date(baseDate.getTime() + years × 365.25 × 86400 × 1000)`. This avoids the month-truncation error that plagues many dasha calculators (where a 7.5-year dasha calculated via setMonth() can drift by weeks over successive periods). No fixed-interval shortcuts are used anywhere.',
          '**UTC internal representation:** All birth times are converted to UTC immediately upon entry. Dasha dates are computed in UTC and converted to the observer\'s local timezone only for display. This prevents the class of bug where a birth time of 10:30 IST is incorrectly computed as 10:30 UTC.',
          '**Additional dasha systems:** Yogini Dasha (36-year cycle), Chara Dasha (Jaimini system using sign periods), and Narayana Dasha (sign-based with reversals for odd/even signs) are all available. Each follows its classical rules as described in the primary Jyotish texts.',
        ],
      },
      {
        id: 'kundali',
        icon: 'gitbranch',
        heading: 'Kundali (Birth Chart) Computation',
        body: [
          '**House (Bhava) System:** We use the Whole Sign house system by default, the oldest and most widely used system in classical Jyotish. The Lagna (Ascendant) degree is computed from the Local Sidereal Time and the observer\'s geographic latitude using the standard astronomical formula. All 12 bhavas are then whole signs counted from the Lagna sign.',
          '**Planetary Dignities (per BPHS Ch. 3–4):** Each planet\'s condition is assessed by its placement in its sign of exaltation, debilitation, moolatrikona, own sign, or friend/enemy sign. The canonical tables from Brihat Parashara Hora Shastra are used — exaltation degrees, moolatrikona ranges, and natural friendship/enmity tables are defined once in a single canonical source file and referenced everywhere to prevent drift.',
          '**Shadbala (Six-fold Strength):** All six components are computed per BPHS Ch. 21–27: Sthana Bala (positional strength — uccha, moolatrikona, own sign, great friend, friend, neutral, enemy, great enemy, debilitation), Dig Bala (directional strength — Jupiter/Mercury strong in East/1st, Sun/Mars in South/10th, Saturn in West/7th, Moon/Venus in North/4th), Kaala Bala (temporal strength — day/night, paksha, tribhaga, abda, masa, vara, hora, ayana), Cheshta Bala (motional strength — retrograde planets get the maximum), Naisargika Bala (permanent natural strength — Sun > Moon > Venus > Jupiter > Mercury > Mars > Saturn), Drik Bala (aspectual strength from other planets).',
          '**Ashtakavarga:** The Sarvashtakavarga and Prashtarashtakavarga are computed following BPHS Ch. 66–72 exactly. Each planet contributes bindus (dots) to the 12 rashi positions based on its natal placement relative to the other planets and the Lagna. The total bindus across all 8 significators give the Sarvashtakavarga, used for transit strength prediction.',
          '**Yoga Detection:** 30+ classical yogas are detected, including all five Mahapurusha Yogas (Ruchaka, Bhadra, Hamsa, Malavya, Shasha), Gajakesari Yoga, Chandra-Mangala Yoga, Adhi Yoga, Neecha Bhanga Raja Yoga, Viparita Raja Yoga, and major Raja Yoga combinations. Each yoga has a frequency-validated detection condition — we measure expected occurrence rates in random charts to ensure "rare" yogas are not triggering in 40% of charts (a common failure mode in other implementations).',
          '**Combustion and Planetary War (Graha Yuddha):** Combustion is computed with BPHS-specified orbs, with reduced orbs for retrograde Mercury (12°) and Venus (8°) per BPHS. Planetary war is detected when two planets are within 1° of each other in longitude; the winner is determined by northern latitude (greater positive latitude = victor), per the Surya Siddhanta rule.',
        ],
      },
      {
        id: 'festival-engine',
        icon: 'zap',
        heading: 'Festival & Vrat Engine',
        body: [
          '**Tithi-based determination:** Every festival and vrat is defined by its masa (month), paksha (fortnight), and tithi — exactly as prescribed in the Dharmasindhu and Nirnaya Sindhu. These are the canonical texts governing festival observance in the Smarta and Vaishnava traditions respectively. The engine evaluates each tithi\'s presence across the calendar day to determine the correct observance date.',
          '**Amanta month convention:** All festival definitions use Amanta (new-moon-to-new-moon) month names, the convention used in all major Jyotish references. During Krishna Paksha, Purnimanta months are one month ahead of Amanta — the engine always compares against the Amanta masa to prevent the class of error where festivals fall a full month early.',
          '**Kala-Vyapti rules:** The "time prevalence" rule determines which calendar day gets a tithi that spans two days. The nine classical kala windows (Madhyahna, Pradosh, Nishita, Arunodaya, Chandrodaya, Pratah, Aparahna, Sunrise, Sunset) are evaluated in priority order per Nirnaya Sindhu. For example, Ekadashi fasting is observed on the day when Ekadashi tithi is present at Arunodaya (pre-dawn), not merely any time during the calendar day.',
          '**Adhika Masa (Leap Month) Detection:** The intercalary month is detected astronomically from New Moon positions: when two consecutive New Moons fall within the same solar month (i.e., the Sun does not transit a rashi boundary between them), the first lunar month is declared Adhika. This produces correctly-placed leap months verified against the Indian Government\'s official Saka calendar.',
        ],
      },
      {
        id: 'classical-references',
        icon: 'book',
        heading: 'Classical Textual References',
        refs: [
          {
            title: 'Brihat Parashara Hora Shastra (BPHS)',
            desc: 'The foundational text of Parashari Jyotish. Primary authority for planetary dignities (Ch. 3–4), house significations (Ch. 11–12), Shadbala (Ch. 21–27), Ashtakavarga (Ch. 66–72), and yoga identification. All our tables for exaltation degrees, moolatrikona ranges, natural friendships, and house lordships are sourced directly from BPHS and cross-checked against multiple critical editions.',
          },
          {
            title: 'Surya Siddhanta (c. 400 CE)',
            desc: 'The foundational astronomical text used for core constants: sidereal year length, planetary revolution periods, and eclipse computation theory. The text\'s formula for the Moon\'s mean motion (13°10\'35" per day) informs our anomaly calculations. The Graha Yuddha (planetary war) victor rule — greater northern latitude wins — is sourced directly from this text.',
          },
          {
            title: 'Dharmasindhu & Nirnaya Sindhu (c. 17th–18th century)',
            desc: 'The two definitive smriti digests governing festival and vrat observance rules across Smarta and Vaishnava traditions. The Dharmasindhu by Kasinatha Upadhyaya and the Nirnaya Sindhu by Kamalakara Bhatta provide the kala-vyapti (time-prevalence) rules and the specific tithi, paksha, and masa conditions for all major festivals encoded in the festival engine.',
          },
          {
            title: 'Phaladeepika (Mantreshvara, c. 12th century)',
            desc: 'Used for yoga interpretation and planet-in-sign significations in the interpretive commentary (Tippanni) system. Particularly relied upon for graha phala (planetary effects) in the 12 rashis and for interpreting Raja Yoga and Dhana Yoga combinations.',
          },
          {
            title: 'Jataka Parijata (Vaidyanatha Dikshita, c. 15th century)',
            desc: 'Supplementary authority for Chara and Yogini dasha rules and for Jaimini Karaka determination. The text\'s treatment of Atma Karaka, Amatya Karaka, and other Jaimini-specific karakas informs the Jaimini-system computations.',
          },
          {
            title: 'Jean Meeus, "Astronomical Algorithms" (2nd ed., 1998)',
            desc: 'The computational backbone of the astronomical engine. Meeus\'s algorithms for solar and lunar position, sunrise/sunset, Julian Day conversions, and atmospheric refraction are implemented directly. Known limitations: Jupiter retrograde stations can be ~40 days late vs. Swiss Ephemeris values with the simplified series; Saturn ~13 days late. These fallback-mode limitations are flagged internally.',
          },
        ],
      },
      {
        id: 'accuracy',
        icon: 'shield',
        heading: 'Accuracy & Verification',
        metrics: [
          { label: 'Sunrise / Sunset', value: '±1 minute', detail: 'of NASA solar tables and USNO data for all test locations' },
          { label: 'Tithi / Nakshatra boundaries', value: '±1–2 minutes', detail: 'of multiple independent panchang reference sources' },
          { label: 'Planetary positions (Sun)', value: '~0.01°', detail: 'via Meeus; sub-arcsecond via Swiss Ephemeris' },
          { label: 'Planetary positions (Moon)', value: '~0.5°', detail: 'via Meeus; sub-arcsecond via Swiss Ephemeris' },
          { label: 'Festival dates', value: 'Exact day', detail: 'verified against the Indian Government\'s official Saka calendar and multiple traditional panchangs' },
          { label: 'Dasha date precision', value: 'Millisecond', detail: 'no month-truncation approximations; all arithmetic in UTC epoch time' },
        ],
        body: 'Before any astronomical computation is released, it is spot-checked against at least three independent reference sources for at least three test dates and locations. All computations are cross-checked against NASA/JPL Horizons ephemeris data and verified against the Indian Government\'s official calendar data. Where discrepancies exceed the stated tolerances, the computation is revised before release.',
      },
      {
        id: 'open-methodology',
        icon: 'globe',
        heading: 'Open Methodology & Reproducibility',
        body: [
          '**No external astrology APIs.** Every value computed by Dekho Panchang is derivable from the input parameters (date, time, latitude, longitude) alone. Given the same inputs, the same outputs will always result. This is a deliberate architectural choice: it means our results are auditable, and any discrepancy can be traced to a specific algorithm step.',
          '**Timezone from coordinates only.** We never use the browser\'s system timezone for birth chart computations. Geographic coordinates are converted to an IANA timezone identifier using a coordinate-based lookup, and all local-time conversions use that resolved timezone. This prevents the class of error where a birth time of "10:30 IST" is silently computed as "10:30 in the server\'s timezone."',
          '**Historical timezone corrections.** Our timezone resolution is aware of historical timezone changes. For example, India operated on UTC+6:30 from September 1941 to October 1945 during World War II, and on UTC+5:30:20 (LMT-based) before 1906. Birth charts for these periods use the correct historical offset.',
          '**Single canonical source for constants.** Every Jyotish constant (exaltation degrees, moolatrikona ranges, sign lords, natural friendships, karana cycles, nakshatra boundaries) is defined exactly once in a canonical source file and imported everywhere else in the codebase. This eliminates the class of error — common in multi-file astrological software — where the same table has different values in different modules, producing inconsistent results on different pages.',
          '**Midnight-crossing time ranges.** Choghadiya, Hora, Varjyam, and Amrit Kalam windows that cross midnight are handled with wrap-aware comparison logic (`if end < start, check now >= start OR now < end`), preventing the "NOW badge never appears for night slots" class of bug.',
        ],
      },
    ],
  },

  hi: {
    badge: 'पारदर्शिता और कठोरता',
    title: 'हमारी पद्धति',
    subtitle:
      'देखो पंचांग पर प्रत्येक गणना मूल सिद्धान्तों से की जाती है — वही गणित जो उज्जैन की वेधशालाओं में प्रयुक्त होती थी। कोई बाहरी API नहीं, कोई अनुमान नहीं।',

    sections: [
      {
        id: 'overview',
        icon: 'compass',
        heading: 'सिंहावलोकन और मिशन',
        body: [
          'देखो पंचांग एक दृढ़ विश्वास पर बना है: खगोलीय सटीकता अनिवार्य है। पंचांग की प्रत्येक गणना — तिथि, नक्षत्र, योग, करण, वार — शास्त्रीय ज्योतिष नियमों और प्रमाणित खगोलीय एल्गोरिदम से की जाती है।',
          'कोई बाहरी ज्योतिष API नहीं है। इस साइट पर दिखाई देने वाला प्रत्येक परिणाम शुद्ध गणित का प्रत्यक्ष परिणाम है — आपके द्वारा प्रदान किए गए मापदण्डों से। समान इनपुट, हमेशा समान आउटपुट।',
        ],
      },
      {
        id: 'planetary-engine',
        icon: 'star',
        heading: 'ग्रह स्थिति इंजन',
        body: [
          'हम दो-स्तरीय इंजन का उपयोग करते हैं: प्राथमिक — स्विस एफेमेरिस (DE431 / VSOP87), जो JPL की चन्द्र सिद्धान्त पर आधारित है और उप-आर्क-सेकंड सटीकता प्रदान करती है। द्वितीयक — जीन मीउस के "Astronomical Algorithms" — सूर्य ~0.01°, चन्द्र ~0.5° सटीकता।',
          'लाहिड़ी अयनांश (चित्रपक्ष) डिफ़ॉल्ट रूप से उपयोग किया जाता है — 1957 में भारत की कैलेण्डर सुधार समिति द्वारा अपनाया गया आधिकारिक मानक। सभी ग्रह स्थितियाँ निरायण (सायन राशिचक्र से अयनांश घटाकर) प्रदर्शित की जाती हैं।',
        ],
      },
      {
        id: 'panchang-elements',
        icon: 'layers',
        heading: 'पंचांग तत्व',
        body: [
          'तिथि: सूर्य-चन्द्र के बीच 12° के अन्तर पर आधारित। सटीक समय bisection एल्गोरिदम से निकाला जाता है — कोई निश्चित अवधि का अनुमान नहीं।',
          'नक्षत्र: चन्द्र का निरायण देशान्तर ÷ 13°20\' — प्रत्येक सीमा आर्क-मिनट तक सटीक।',
          'योग: (सूर्य + चन्द्र का निरायण देशान्तर) ÷ 13°20\' — 27 योग चक्र।',
          'करण: अर्ध-तिथि, BPHS के अनुसार 11 करणों का चक्र — विष्टि/भद्र का स्वचालित पहचान।',
          'वार: जूलियन दिवस संख्या से व्युत्पन्न — 0=रविवार, शास्त्रीय ज्योतिष की परम्परा के अनुसार।',
        ],
      },
      {
        id: 'classical-references',
        icon: 'book',
        heading: 'शास्त्रीय सन्दर्भ',
        body: [
          'बृहत् पराशर होरा शास्त्र (BPHS): ग्रह गरिमा (अध्याय 3-4), षड्बल (अध्याय 21-27), अष्टकवर्ग (अध्याय 66-72) का प्राथमिक प्राधिकरण।',
          'सूर्य सिद्धान्त: नाक्षत्र वर्ष, ग्रह परिक्रमण काल और ग्रह युद्ध नियमों के लिए मूल स्रोत।',
          'धर्मसिन्धु और निर्णय सिन्धु: सभी पर्व और व्रत की तिथि निर्धारण नियमों का प्राधिकरण।',
          'फलदीपिका और जातक पारिजात: योग व्याख्या और दशा नियमों के लिए पूरक सन्दर्भ।',
        ],
      },
      {
        id: 'accuracy',
        icon: 'shield',
        heading: 'सटीकता और सत्यापन',
        body: [
          'सूर्योदय/सूर्यास्त: NASA सौर सारणी से ±1 मिनट। तिथि/नक्षत्र सीमाएँ: स्वतन्त्र संदर्भ स्रोतों से ±1-2 मिनट।',
          'ग्रह स्थितियाँ: मीउस द्वारा सूर्य ~0.01°, चन्द्र ~0.5°; स्विस एफेमेरिस द्वारा उप-आर्क-सेकंड।',
          'प्रत्येक गणना को जारी करने से पहले कम से कम तीन स्वतन्त्र सन्दर्भ स्रोतों और कम से कम तीन परीक्षण तिथियों के विरुद्ध सत्यापित किया जाता है।',
        ],
      },
    ],
  },
};

function SectionIcon({ name }: { name: string }) {
  const cls = 'w-6 h-6 text-gold-primary';
  switch (name) {
    case 'compass': return <Compass className={cls} />;
    case 'star': return <Star className={cls} />;
    case 'layers': return <Layers className={cls} />;
    case 'sun': return <Sun className={cls} />;
    case 'moon': return <Moon className={cls} />;
    case 'clock': return <Clock className={cls} />;
    case 'gitbranch': return <GitBranch className={cls} />;
    case 'zap': return <Zap className={cls} />;
    case 'book': return <BookOpen className={cls} />;
    case 'shield': return <Shield className={cls} />;
    case 'globe': return <Globe className={cls} />;
    case 'check': return <CheckCircle className={cls} />;
    case 'archive': return <Archive className={cls} />;
    default: return <Calculator className={cls} />;
  }
}

// Render bold **text** inline (simple server-side transform — no markdown library needed)
function RichText({ text, bodyFont }: { text: string; bodyFont?: React.CSSProperties }) {
  const parts = text.split(/\*\*(.*?)\*\*/g);
  return (
    <p className="text-text-secondary leading-relaxed text-base lg:text-[1.0625rem]" style={bodyFont}>
      {parts.map((part, i) =>
        i % 2 === 1 ? (
          <strong key={i} className="text-text-primary font-semibold">
            {part}
          </strong>
        ) : (
          part
        )
      )}
    </p>
  );
}

export default async function MethodologyPage() {
  const locale = await getLocale();
  const isDevanagari = isDevanagariLocale(locale);
  const headingFont = isDevanagari
    ? { fontFamily: 'var(--font-devanagari-heading)' }
    : { fontFamily: 'var(--font-heading)' };
  const bodyFont = isDevanagari
    ? { fontFamily: 'var(--font-devanagari-body)' }
    : undefined;

  const l = (CONTENT as Record<string, typeof CONTENT.en>)[locale] || CONTENT.en;
  const breadcrumbLD = generateBreadcrumbLD(`/${locale}/about/methodology`, locale);

  return (
    <main className="min-h-screen py-16 px-4">
      {/* BreadcrumbList JSON-LD — E-E-A-T + rich results */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLd(breadcrumbLD) }}
      />

      {/* Page Header */}
      <div className="max-w-4xl mx-auto mb-16 text-center">
        <div className="inline-block mb-4 px-4 py-1.5 rounded-full border border-gold-primary/30 bg-gold-primary/10">
          <span className="text-gold-light text-sm font-medium">{l.badge}</span>
        </div>
        <h1
          className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6 bg-gradient-to-r from-gold-light via-gold-primary to-gold-light bg-clip-text text-transparent"
          style={headingFont}
        >
          {l.title}
        </h1>
        <p className="text-text-secondary text-lg max-w-2xl mx-auto leading-relaxed" style={bodyFont}>
          {l.subtitle}
        </p>
      </div>

      {/* Sections */}
      <div className="max-w-4xl mx-auto space-y-10">
        {l.sections.map((section) => {
          const enSection = CONTENT.en.sections.find((s) => s.id === section.id);
          return (
            <section
              key={section.id}
              id={section.id}
              className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-2xl p-7 sm:p-9 hover:border-gold-primary/25 transition-colors"
            >
              {/* Section heading */}
              <div className="flex items-center gap-3 mb-6">
                <div className="w-11 h-11 rounded-xl bg-gold-primary/15 border border-gold-primary/25 flex items-center justify-center shrink-0">
                  <SectionIcon name={section.icon} />
                </div>
                <h2
                  className="text-xl sm:text-2xl font-bold text-gold-light"
                  style={headingFont}
                >
                  {section.heading}
                </h2>
              </div>

              {/* Body paragraphs (plain string array) */}
              {'body' in section && Array.isArray(section.body) && (
                <div className="space-y-4">
                  {(section.body as string[]).map((para, i) => (
                    <RichText key={i} text={para} bodyFont={bodyFont} />
                  ))}
                </div>
              )}

              {/* Subsections (Panchang Elements) — only in EN */}
              {'subsections' in section && enSection && 'subsections' in enSection && (
                <div className="space-y-6 mt-2">
                  {(enSection.subsections as { title: string; text: string }[]).map((sub, i) => (
                    <div
                      key={i}
                      className="border-l-2 border-gold-primary/30 pl-5"
                    >
                      <h3
                        className="text-gold-light font-semibold text-base mb-2"
                        style={headingFont}
                      >
                        {sub.title}
                      </h3>
                      <p className="text-text-secondary leading-relaxed text-sm lg:text-base">
                        {sub.text}
                      </p>
                    </div>
                  ))}
                </div>
              )}

              {/* Classical References grid */}
              {'refs' in section && enSection && 'refs' in enSection && (
                <div className="space-y-5 mt-2">
                  {(enSection.refs as { title: string; desc: string }[]).map((ref, i) => (
                    <div
                      key={i}
                      className="bg-[#1a1040]/40 border border-gold-primary/10 rounded-xl p-5"
                    >
                      <h3
                        className="text-gold-light font-semibold text-base mb-2"
                        style={headingFont}
                      >
                        {ref.title}
                      </h3>
                      <p className="text-text-secondary leading-relaxed text-sm lg:text-base">
                        {ref.desc}
                      </p>
                    </div>
                  ))}
                </div>
              )}

              {/* Accuracy metrics table */}
              {'metrics' in section && enSection && 'metrics' in enSection && (
                <div className="mt-2 space-y-4">
                  <div className="grid sm:grid-cols-2 gap-3 mb-6">
                    {(enSection.metrics as { label: string; value: string; detail: string }[]).map(
                      (m, i) => (
                        <div
                          key={i}
                          className="bg-[#1a1040]/50 border border-gold-primary/10 rounded-xl p-4"
                        >
                          <div className="flex items-start gap-3">
                            <CheckCircle className="w-4 h-4 text-gold-primary mt-0.5 shrink-0" />
                            <div>
                              <p className="text-text-primary font-semibold text-sm">{m.label}</p>
                              <p className="text-gold-light font-bold text-base mt-0.5">{m.value}</p>
                              <p className="text-text-secondary text-xs mt-1 leading-relaxed">
                                {m.detail}
                              </p>
                            </div>
                          </div>
                        </div>
                      )
                    )}
                  </div>
                  {enSection.body && typeof enSection.body === 'string' && (
                    <p className="text-text-secondary leading-relaxed text-base" style={bodyFont}>
                      {enSection.body}
                    </p>
                  )}
                </div>
              )}
            </section>
          );
        })}
      </div>

      {/* CTA — cross-link to About and Learn */}
      <div className="max-w-4xl mx-auto mt-14 grid sm:grid-cols-2 gap-4">
        <a
          href={`/${locale}/about`}
          className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-6 hover:border-gold-primary/40 transition-colors group"
        >
          <div className="flex items-center gap-3 mb-2">
            <BookOpen className="w-5 h-5 text-gold-primary" />
            <span className="text-gold-light font-semibold group-hover:text-gold-primary transition-colors">
              {locale === 'hi' ? 'हमारे बारे में' : 'About Us'}
            </span>
          </div>
          <p className="text-text-secondary text-sm leading-relaxed">
            {locale === 'hi'
              ? 'परियोजना की कहानी, लेखक और दर्शन।'
              : 'The story behind the project, the author, and the philosophy.'}
          </p>
        </a>
        <a
          href={`/${locale}/learn`}
          className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-6 hover:border-gold-primary/40 transition-colors group"
        >
          <div className="flex items-center gap-3 mb-2">
            <Star className="w-5 h-5 text-gold-primary" />
            <span className="text-gold-light font-semibold group-hover:text-gold-primary transition-colors">
              {locale === 'hi' ? 'जाें सीखें' : 'Learn Jyotish'}
            </span>
          </div>
          <p className="text-text-secondary text-sm leading-relaxed">
            {locale === 'hi'
              ? '100+ मॉड्यूल — पंचांग मूल बातों से लेकर उन्नत Shadbala तक।'
              : '100+ modules covering Panchang basics to advanced Shadbala and Jaimini.'}
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
