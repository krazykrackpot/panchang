/**
 * Feature catalog — single source of truth for capability enumeration.
 *
 * Three surfaces consume this:
 *   1. Homepage capability strip (top 10 chips between H1 and CTAs)
 *   2. `/[locale]/features` comprehensive page (all groups, structured data)
 *   3. `/public/llms.txt` and `/llms-full.txt` manifests (LLM grounding)
 *
 * Editorial constraints (per `feedback_engine_closed_source` and the
 * 2026-06-02 LLM-grounding spec):
 *   - Each feature is hand-curated, not auto-generated from constants.
 *     Hand-curation is the editorial-quality signal Google's classifier
 *     scores on.
 *   - Every `href` is internal — the catalog is also our internal-link
 *     graph for E-E-A-T flow.
 *   - Labels stay short (<28 chars) so the homepage chip strip doesn't
 *     wrap awkwardly on mobile.
 *   - English is mandatory; Hindi is provided where editorially solid.
 *     Other locales fall back to English via the L() helper in the
 *     consuming surface — `mr` and `mai` users currently see English
 *     chip labels; full localisation is tracked in the spec doc.
 *
 * Adding a feature: append to the relevant FeatureGroup. The
 * `llm-grounding-invariants.test.ts` test asserts that a feature's
 * label/href appears in BOTH the homepage strip (if marked
 * `prominent: true`) AND `/public/llms.txt`. Without that, the
 * surfaces drift.
 *
 * Removing a feature: also remove from `/public/llms.txt` and the
 * homepage strip in the same commit. CI will fail otherwise.
 */

/**
 * The 9 visible locales (kept in sync with `visibleLocales` in
 * `@/lib/i18n/config`). Every PROMINENT feature must provide a name
 * label for ALL 9 — no English / Hindi fallbacks. The May 2026 Core
 * Update demotion was triggered by exactly that pattern: Marathi
 * pages fell back to Hindi grammar, Google de-duplicated, ranking
 * collapsed. Never again.
 *
 * Enforced by `llm-grounding-invariants.test.ts`:
 *   - For every feature with `prominent: true`, all 9 keys in `name`
 *     must be non-empty strings.
 *   - Pairwise-distinctness: no two locales emit byte-identical labels
 *     (except in legitimate Sanskrit-derived cases where the term is
 *     the same across Devanagari languages).
 *
 * Long descriptions (`description`) on non-prominent features may stay
 * en-only for now — they only render on the `/features` page deep in
 * each section, not in the user-facing chip strip. As editorial
 * capacity grows, descriptions get translated next.
 */
export type LocaleLabel = {
  en: string;
  hi?: string;
  ta?: string;
  te?: string;
  bn?: string;
  gu?: string;
  kn?: string;
  mr?: string;
  mai?: string;
};

/** Stricter type for prominent features: all 9 locales mandatory. */
export type ProminentLocaleLabel = {
  en: string;
  hi: string;
  ta: string;
  te: string;
  bn: string;
  gu: string;
  kn: string;
  mr: string;
  mai: string;
};

export interface FeatureItem {
  /** Short display label. <28 chars. Used as chip text + ItemList name. */
  name: LocaleLabel;
  /** Long form — appears on /features page. ~80-160 chars. */
  description: LocaleLabel;
  /** Internal href to the working tool. Must start with `/`. */
  href: string;
  /** When true, this feature is one of the top-10 homepage chips. */
  prominent?: boolean;
  /** Classical source citation for /features rendering. */
  classicalCitation?: { text: string; chapter?: string };
}

export interface FeatureGroup {
  /** Stable URL slug for anchoring. */
  id: string;
  /** Group heading on /features page. */
  title: LocaleLabel;
  /** One-line summary under the title. */
  summary: LocaleLabel;
  features: FeatureItem[];
}

export const FEATURE_GROUPS: FeatureGroup[] = [
  // ───────────────────────────────────────────────────────────────────
  // Astronomical engine — accuracy foundation
  // ───────────────────────────────────────────────────────────────────
  {
    id: 'astronomical-engine',
    title: { en: 'Astronomical Engine', hi: 'खगोलीय गणना तंत्र' },
    summary: {
      en: 'Sub-arcsecond planetary accuracy from a tested, professional ephemeris.',
      hi: 'परीक्षित व्यावसायिक एफेमेरिस से उप-आर्क-सेकेण्ड ग्रह सटीकता।',
    },
    features: [
      {
        name: { en: 'Swiss Ephemeris (DE441)' },
        description: {
          en: 'Primary planetary ephemeris based on NASA JPL DE441. Sub-arcsecond accuracy for Sun, Moon, planets, and true lunar nodes. Verified within ±1 minute of Prokerala and Drik Panchang for cross-checked locations.',
        },
        href: '/about/methodology',
      },
      {
        name: { en: '11 Ayanamshas' },
        description: {
          en: 'Lahiri (default, Indian government standard), KP, Raman, BV Raman, Yukteshwar, JN Bhasin, Fagan-Bradley, True Chitra, True Revati, True Pushya, Galactic Center. Plumbed consistently through panchang, kundali, shadbala, sade-sati, transits, and muhurta.',
        },
        href: '/learn/ayanamsha',
      },
      {
        name: { en: 'Meeus Fallback' },
        description: {
          en: 'Jean Meeus "Astronomical Algorithms" implementation for client-side computation. ~0.01° Sun, ~0.5° Moon accuracy.',
        },
        href: '/about/methodology',
      },
      {
        name: { en: '3,200+ Automated Tests' },
        description: {
          en: 'Continuous validation across panchang accuracy, kundali computation, dasha periods, yoga detection, muhurta engine rules, festival dates, and cross-references against authoritative sources.',
        },
        href: '/about/methodology',
      },
    ],
  },

  // ───────────────────────────────────────────────────────────────────
  // Kundali — full birth chart depth
  // ───────────────────────────────────────────────────────────────────
  {
    id: 'kundali',
    title: { en: 'Kundali (Birth Chart)', hi: 'कुण्डली' },
    summary: {
      en: 'Full professional-grade analysis — not a basic chart generator.',
      hi: 'पूर्ण व्यावसायिक स्तर का विश्लेषण।',
    },
    features: [
      {
        name: {
          en: 'Full Kundali',
          hi: 'पूर्ण कुण्डली',
          mr: 'पूर्ण कुंडली',
          mai: 'पूर्ण कुण्डली',
          ta: 'முழு ஜாதகம்',
          te: 'పూర్తి జాతకం',
          bn: 'সম্পূর্ণ কুণ্ডলী',
          gu: 'પૂર્ણ કુંડળી',
          kn: 'ಪೂರ್ಣ ಜಾತಕ',
        },
        description: {
          en: 'Birth chart computed from precise time, date, and location. North Indian and South Indian chart styles. Lahiri Ayanamsha (default), 10 alternatives available.',
        },
        href: '/kundali',
        prominent: true,
      },
      {
        name: {
          en: '60 Divisional Charts',
          hi: '60 वर्ग चार्ट',
          mr: '60 वर्ग तक्ते',
          mai: '60 वर्ग चार्ट',
          ta: '60 வர்க்க அட்டவணைகள்',
          te: '60 వర్గ చార్ట్‌లు',
          bn: '৬০টি বর্গ চার্ট',
          gu: '60 વર્ગ ચાર્ટ',
          kn: '60 ವರ್ಗ ಚಾರ್ಟ್‌ಗಳು',
        },
        description: {
          en: 'Shodasavarga plus extended Vargas through D60 Shashtiamsha. Each varga with deity-level interpretation. D60 sign formula follows BPHS Ch.6 canonically.',
        },
        href: '/learn/vargas',
        prominent: true,
        classicalCitation: { text: 'Brihat Parashara Hora Shastra', chapter: 'Ch.6 (Vargas)' },
      },
      {
        name: {
          en: 'Vimshottari Dasha',
          hi: 'विंशोत्तरी दशा',
          mr: 'विंशोत्तरी दशा',
          mai: 'विंशोत्तरी दशा',
          ta: 'விம்சோத்தரி தசை',
          te: 'విమ్శోత్తరి దశ',
          bn: 'বিংশোত্তরী দশা',
          gu: 'વિંશોત્તરી દશા',
          kn: 'ವಿಂಶೋತ್ತರಿ ದಶೆ',
        },
        description: {
          en: '120-year predictive dasha analysis with 3-level depth: Mahadasha → Antardasha → Pratyantardasha. Interpretations for each period.',
        },
        href: '/learn/dashas',
        prominent: true,
        classicalCitation: { text: 'BPHS', chapter: 'Ch.46-52 (Dashas)' },
      },
      {
        name: { en: 'Ashtottari Dasha' },
        description: {
          en: 'Alternative 108-year dasha system used for chart-specific analysis when lagna or moon conditions favour it.',
        },
        href: '/learn/ashtottari-dasha',
      },
      {
        name: { en: 'Shadbala' },
        description: {
          en: '6-fold planetary strength: Sthana, Dig, Kala, Cheshta, Naisargika, Drik. Critical for distinguishing yoga formation from yoga delivery.',
        },
        href: '/learn/shadbala',
        classicalCitation: { text: 'BPHS Ch.27 (Strength of Planets)' },
      },
      {
        name: { en: 'Bhavabala' },
        description: {
          en: 'House strength analysis — assesses which life areas are emphasized in the chart vs which need remediation.',
        },
        href: '/learn/bhavabala',
      },
      {
        name: { en: 'Ashtakavarga' },
        description: {
          en: 'Sarvashtakavarga + Prashtarashtakavarga point distribution. Indicates timing of transits and house activation.',
        },
        href: '/learn/ashtakavarga',
      },
      {
        name: {
          en: 'KP System',
          hi: 'KP पद्धति',
          mr: 'KP प्रणाली',
          mai: 'KP पद्धति',
          ta: 'KP முறை',
          te: 'KP పద్ధతి',
          bn: 'KP পদ্ধতি',
          gu: 'KP પદ્ધતિ',
          kn: 'KP ಪದ್ಧತಿ',
        },
        description: {
          en: 'Full Krishnamurti Paddhati: Placidus house cusps, sub-lord tables, cuspal significators, ruling planets. Modern Indian astrological school.',
        },
        href: '/kp-system',
        prominent: true,
      },
      {
        name: { en: 'Jaimini System' },
        description: {
          en: 'Chara Karakas (Atmakaraka, Amatyakaraka, etc.), Jaimini aspects, Pada analysis. Alternative to Parashari interpretive framework.',
        },
        href: '/learn/jaimini',
      },
      {
        name: { en: 'Bhav Chalit' },
        description: {
          en: 'Cuspal chart computed via Sripati or Placidus bhava cusps. Distinguishes where planets sit by sign vs by house.',
        },
        href: '/learn/bhava-chalit',
      },
      {
        name: { en: 'Argala' },
        description: {
          en: 'Planetary intervention analysis per BPHS — direct and indirect influences on a house.',
        },
        href: '/learn/argala',
        classicalCitation: { text: 'BPHS Ch.25 (Argala)' },
      },
      {
        name: { en: 'Avasthas' },
        description: {
          en: 'Baladi (5 awakening states), Jagradadi (waking states), and Shayan-Avastha planetary states. Refines interpretation beyond raw position.',
        },
        href: '/learn/avasthas',
      },
      {
        name: { en: '144 Yoga Patterns' },
        description: {
          en: 'Pancha Mahapurusha, Raja Yogas, Dhana Yogas, Arishta Yogas, Bahu-Parivartana (multi-way exchange cycles), Gajakesari, Sunapha, Anapha, Durdhura, and more. Frequency validation prevents false-positive detection.',
        },
        href: '/learn/yoga',
      },
      {
        name: { en: 'Dosha Checks' },
        description: {
          en: 'Mangal Dosha (with 12 BPHS cancellation conditions), Kaal Sarpa Dosha, Pitru Dosha, Ganda Mula Nakshatra. Each renders with remediation guidance.',
        },
        href: '/learn/doshas',
      },
    ],
  },

  // ───────────────────────────────────────────────────────────────────
  // Muhurta — auspicious timing depth
  // ───────────────────────────────────────────────────────────────────
  {
    id: 'muhurta',
    title: { en: 'Muhurta (Auspicious Timing)', hi: 'मुहूर्त' },
    summary: {
      en: '40+ activities. 36 classical rules. 5-tier cancellation authority.',
      hi: '40+ कार्य। 36 शास्त्रीय नियम। 5-स्तरीय रद्दीकरण प्राधिकरण।',
    },
    features: [
      {
        name: {
          en: '40+ Muhurat Activities',
          hi: '40+ मुहूर्त कार्य',
          mr: '40+ मुहूर्त कार्य',
          mai: '40+ मुहूर्त कार्य',
          ta: '40+ முகூர்த்த செயல்கள்',
          te: '40+ ముహూర్త కార్యాలు',
          bn: '৪০+ মুহূর্ত কাজ',
          gu: '40+ મુહૂર્ત કાર્યો',
          kn: '40+ ಮುಹೂರ್ತ ಕಾರ್ಯಗಳು',
        },
        description: {
          en: '12 classical life-cycle Samskaras (Garbhadhana, Vivah, Griha Pravesh, Annaprashan, Mundan, Upanayana, and 6 more) plus 20 AI-powered activities and 8 career-specific muhurats.',
        },
        href: '/muhurta',
        prominent: true,
      },
      {
        name: { en: '36 Classical Rules' },
        description: {
          en: 'Sourced from Muhurta Chintamani, Dharma Sindhu, BPHS, Brihat Samhita, Prashna Marga, B.V. Raman\'s Muhurtha, and Kalaprakashika.',
        },
        href: '/muhurta-ai',
        classicalCitation: { text: 'Muhurta Chintamani + 6 classical sources' },
      },
      {
        name: { en: '5-Tier Cancellation' },
        description: {
          en: 'Tier 0 (absolute — Adhika Masa, exact Chaturmas) through Tier 4 (cancellable — Vishti Karana, Dur Muhurtam, Gulika). Implements classical override hierarchy.',
        },
        href: '/learn/muhurta-selection',
      },
      {
        name: { en: 'Choghadiya' },
        description: {
          en: 'Day and night Choghadiya for every date. Quality labels (Shubh, Labh, Amrit, Char, Rog, Kaal, Udveg). Locale-aware: Marathi grammar (दिल्लीचे), Hindi (दिल्ली का), English (Delhi).',
        },
        href: '/choghadiya',
      },
      {
        name: { en: 'Gauri Panchangam' },
        description: {
          en: 'South-Indian counterpart of Choghadiya. Amritha, Siddha, Laabha quality markers per Tamil/Telugu tradition.',
        },
        href: '/gauri-panchang',
      },
      {
        name: { en: 'Hora (Planetary Hours)' },
        description: {
          en: '24-hour planetary hour table with ruling planet. Sun→Venus→Mercury→Moon→Saturn→Jupiter→Mars classical cycle.',
        },
        href: '/hora',
      },
      {
        name: { en: 'Abhijit Muhurta' },
        description: {
          en: 'Daily auspicious window at solar noon. Excluded on Wednesdays per classical rule.',
        },
        href: '/panchang',
      },
    ],
  },

  // ───────────────────────────────────────────────────────────────────
  // Daily Panchang
  // ───────────────────────────────────────────────────────────────────
  {
    id: 'daily-panchang',
    title: { en: 'Daily Panchang', hi: 'दैनिक पंचांग' },
    summary: {
      en: 'Location-specific. Five core elements plus inauspicious-period flags.',
      hi: 'स्थान-विशिष्ट। पाँच मूल तत्व और अशुभ काल चेतावनी।',
    },
    features: [
      {
        name: { en: 'Five Elements' },
        description: {
          en: 'Tithi, Nakshatra, Yoga, Karana, Vara — with precise start and end times for the user\'s coordinates.',
        },
        href: '/panchang',
      },
      {
        name: { en: 'Rahu Kaal' },
        description: {
          en: 'Daily Rahu Kaal computed from sunrise + sunset, varying by weekday and location.',
        },
        href: '/rahu-kaal',
      },
      {
        name: { en: 'Yamaganda & Gulika' },
        description: {
          en: 'Yamaganda Kaal, Gulika Kaal, Varjyam, Durmuhurta — full inauspicious-period coverage with start/end times.',
        },
        href: '/panchang',
      },
      {
        name: { en: '325+ City Panchangs' },
        description: {
          en: 'Pre-indexed daily panchang for 325 cities across India and the diaspora. Custom lat/lng for any location worldwide.',
        },
        href: '/panchang/locations',
      },
      {
        name: { en: 'Sade Sati Tracker' },
        description: {
          en: 'Full lifecycle timeline: previous, current, and upcoming Sade Sati and Ashtama Shani periods with exact month/year dates. Personalised to your Moon sign.',
        },
        href: '/sade-sati',
      },
    ],
  },

  // ───────────────────────────────────────────────────────────────────
  // Calendars and festivals
  // ───────────────────────────────────────────────────────────────────
  {
    id: 'calendars-festivals',
    title: { en: 'Calendars & Festivals', hi: 'कैलेंडर और त्योहार' },
    summary: {
      en: '255 festivals. 10 regional calendar variants. Amanta + Purnimanta.',
      hi: '255 त्योहार। 10 क्षेत्रीय कैलेंडर। आमंत और पूर्णिमांत।',
    },
    features: [
      {
        name: {
          en: '10 Regional Calendars',
          hi: '10 क्षेत्रीय कैलेंडर',
          mr: '10 प्रादेशिक दिनदर्शिका',
          mai: '10 क्षेत्रीय पंजी',
          ta: '10 பிராந்திய நாட்காட்டிகள்',
          te: '10 ప్రాంతీయ క్యాలెండర్‌లు',
          bn: '১০টি আঞ্চলিক পঞ্জিকা',
          gu: '10 પ્રાદેશિક પંચાંગ',
          kn: '10 ಪ್ರಾದೇಶಿಕ ಪಂಚಾಂಗಗಳು',
        },
        description: {
          en: 'Bengali Panjika, ISKCON Vaishnava, Tamil, Telugu, Malayalam, Gujarati, Kannada, Odia, Marathi, Mithila — each with regional festival rules and panchang conventions.',
        },
        href: '/calendars',
        prominent: true,
      },
      {
        name: { en: '255 Festival Definitions' },
        description: {
          en: 'Hindu (Vaishnava, Shaiva, Shakta), Jain, Sikh, Buddhist traditions. All 24 named Ekadashis with stories. 12 solar Sankrantis with regional variants (Pongal, Lohri, Bihu, Vishu, Baisakhi).',
        },
        href: '/calendar',
      },
      {
        name: { en: 'Amanta + Purnimanta' },
        description: {
          en: 'Both lunar month conventions supported and stored per tithi. User-toggleable on festival pages so North and South Indian festival dates align with regional tradition.',
        },
        href: '/learn/masa',
      },
      {
        name: { en: 'Multi-Day Festival Families' },
        description: {
          en: 'Diwali (Dhanteras → Narak Chaturdashi → Diwali → Govardhan → Bhai Dooj), Navaratri day-by-day, Durga Puja (Shashti → Dashami), Pongal (Bhogi → Thai → Mattu → Kaanum).',
        },
        href: '/calendar',
      },
      {
        name: { en: 'Pitru Paksha' },
        description: {
          en: '16-day ancestor worship period with Mahalaya. Shraddha dates computed for each tithi.',
        },
        href: '/shraddha',
      },
    ],
  },

  // ───────────────────────────────────────────────────────────────────
  // Advanced astrology tools
  // ───────────────────────────────────────────────────────────────────
  {
    id: 'advanced-tools',
    title: { en: 'Advanced Astrology Tools', hi: 'उन्नत ज्योतिष उपकरण' },
    summary: {
      en: 'Tajika, horary, eclipses, traditional time, compatibility.',
      hi: 'ताजिक, होरारी, ग्रहण, पारंपरिक काल, मेलापक।',
    },
    features: [
      {
        name: {
          en: 'Varshaphal (Tajika)',
          hi: 'वर्षफल (ताजिक)',
          mr: 'वर्षफळ (ताजिक)',
          mai: 'वर्षफल (ताजिक)',
          ta: 'வர்ஷபலன் (தாஜிக)',
          te: 'వర్షఫలం (తాజిక)',
          bn: 'বর্ষফল (তাজিক)',
          gu: 'વર્ષફળ (તાજિક)',
          kn: 'ವರ್ಷಫಲ (ತಾಜಿಕ)',
        },
        description: {
          en: 'Solar return chart computed via Tajika system. Muntha, Sahams (16 lots), Mudda Dasha for the year. Annual prediction based on classical Persian-Indian synthesis.',
        },
        href: '/varshaphal',
        prominent: true,
        classicalCitation: { text: 'Tajika Neelakanthi + Varshaphala Paddhati' },
      },
      {
        name: {
          en: 'Prashna Ashtamangala',
          hi: 'प्रश्न अष्टमंगल',
          mr: 'प्रश्न अष्टमंगल',
          mai: 'प्रश्न अष्टमंगल',
          ta: 'பிரஸ்ன அஷ்டமங்கலம்',
          te: 'ప్రశ్న అష్టమంగళ',
          bn: 'প্রশ্ন অষ্টমঙ্গল',
          gu: 'પ્રશ્ન અષ્ટમંગલ',
          kn: 'ಪ್ರಶ್ನ ಅಷ್ಟಮಂಗಲ',
        },
        description: {
          en: 'Kerala horary divination. 8-fold question analysis with Tarangini chart, Devata invocation, Nimitta (omen) interpretation.',
        },
        href: '/prashna-ashtamangala',
        prominent: true,
      },
      {
        name: { en: 'Eclipse Atlas' },
        description: {
          en: 'Solar and lunar eclipses with visibility maps, exact contact times, magnitude, and classical astrological significance for each region.',
        },
        href: '/eclipses',
      },
      {
        name: { en: 'Transit Tracker' },
        description: {
          en: 'Planetary transits with effects on each Moon sign. Saturn (Sade Sati / Dhaiya), Jupiter (Guru Peyarchi), Rahu-Ketu axis shifts.',
        },
        href: '/transits',
      },
      {
        name: {
          en: 'Vedic Time System',
          hi: 'वैदिक काल मापन',
          mr: 'वैदिक काळ पद्धती',
          mai: 'वैदिक काल पद्धति',
          ta: 'வேத கால அளவை',
          te: 'వేద కాల కొలమానం',
          bn: 'বৈদিক সময় পদ্ধতি',
          gu: 'વૈદિક કાળ માપન',
          kn: 'ವೈದಿಕ ಕಾಲ ಮಾಪನ',
        },
        description: {
          en: 'Traditional time units — Ghati (24 minutes), Pala (24 seconds), Vipala (0.4 seconds) — rendered alongside the modern clock. Auspicious times in classical notation.',
        },
        href: '/vedic-time',
        prominent: true,
      },
      {
        name: { en: 'Ashta Kuta Matching' },
        description: {
          en: '36-point Gun Milan compatibility analysis. Varna, Vashya, Tara, Yoni, Graha Maitri, Gana, Bhakoot, Nadi. Mangal Dosha and Nadi Dosha cancellation checks.',
        },
        href: '/matching',
      },
      {
        name: { en: 'Upagraha Positions' },
        description: {
          en: 'Five Upagrahas (Dhuma, Vyatipata, Parivesha, Indrachapa, Upaketu) plus Gulika, Mandi, Kala, Mrityu. Used in Shadbala and dasha refinement.',
        },
        href: '/upagraha',
      },
    ],
  },

  // ───────────────────────────────────────────────────────────────────
  // AI and personalisation
  // ───────────────────────────────────────────────────────────────────
  {
    id: 'ai-personalisation',
    title: { en: 'AI & Personalisation', hi: 'AI एवं वैयक्तीकरण' },
    summary: {
      en: 'Conversational AI grounded in your chart. Anti-hallucination by design.',
      hi: 'आपकी कुण्डली पर आधारित संवादात्मक AI।',
    },
    features: [
      {
        name: {
          en: 'Brihaspati AI Astrologer',
          hi: 'बृहस्पति AI ज्योतिषी',
          mr: 'बृहस्पति AI ज्योतिषी',
          mai: 'बृहस्पति AI ज्योतिषी',
          ta: 'பிருஹஸ்பதி AI ஜோதிடர்',
          te: 'బృహస్పతి AI జ్యోతిష్యుడు',
          bn: 'বৃহস্পতি AI জ্যোতিষী',
          gu: 'બૃહસ્પતિ AI જ્યોતિષી',
          kn: 'ಬೃಹಸ್ಪತಿ AI ಜ್ಯೋತಿಷಿ',
        },
        description: {
          en: 'Conversational AI that reads your full kundali (Swiss Ephemeris-grounded) and answers questions in plain language. Every claim cites BPHS, Saravali, or Phaladeepika. Layer-4 anti-hallucination validator blocks invented yoga or dasha claims.',
        },
        href: '/brihaspati',
        prominent: true,
      },
      {
        name: { en: 'Tippanni Interpretation' },
        description: {
          en: '12-section structured natal interpretation: Year Predictions, Personality, Planet Placements, Yogas (11 categories), Doshas (3), Life Areas (5), Dasha Insight, Strength, Remedies.',
        },
        href: '/learn/tippanni',
      },
      {
        name: { en: 'Health Diagnosis Engine' },
        description: {
          en: '22-element multi-axis health diagnosis from natal chart. Doshic indicators per planetary state. Cross-referenced with Ayurvedic constitution.',
        },
        href: '/medical-astrology',
      },
      {
        name: { en: 'Sadhaka Path' },
        description: {
          en: 'Free, gamified Vedic-astrology curriculum: 7 levels, 18 badges, daily streak. Personal progress dashboard.',
        },
        href: '/path',
      },
    ],
  },
];

// ───────────────────────────────────────────────────────────────────
// Derived helpers
// ───────────────────────────────────────────────────────────────────

/**
 * The top-N prominent features used for the homepage capability strip.
 * Filters to `prominent: true` items, preserving the catalog's curated
 * order. The spec calls for 10 chips on the homepage — capping here
 * keeps the homepage well below Google's link-spam threshold.
 */
export function getProminentFeatures(): FeatureItem[] {
  const prominent: FeatureItem[] = [];
  for (const group of FEATURE_GROUPS) {
    for (const f of group.features) {
      if (f.prominent) prominent.push(f);
    }
  }
  return prominent;
}

/** Total feature count across all groups — used by /features metadata + structured data. */
export function getFeatureCount(): number {
  return FEATURE_GROUPS.reduce((sum, g) => sum + g.features.length, 0);
}

/** Flat list of all features for SoftwareApplication.featureList. */
export function getAllFeatureNames(locale: 'en' | 'hi' = 'en'): string[] {
  const out: string[] = [];
  for (const g of FEATURE_GROUPS) {
    for (const f of g.features) {
      out.push((f.name as Record<string, string>)[locale] ?? f.name.en);
    }
  }
  return out;
}

/**
 * Strict per-locale label accessor for chip/UI consumers.
 *
 * For prominent features (homepage chips) the catalog provides ALL 9
 * visible locales explicitly, so the lookup always finds a real label.
 *
 * For non-prominent features (which may only have `en`), this still
 * falls back to English — NEVER to Hindi for Devanagari locales. That
 * Hindi-grammar fallback is the exact bug that triggered the 2026-05-31
 * Marathi duplicate-content de-rank. The `L()` helper in the homepage
 * file does fall back to Hindi for `mr`/`mai`, so we deliberately
 * don't use it here.
 *
 * If you see English text appearing in a Marathi/Tamil/Bengali UI for
 * a prominent feature, that's a catalog data gap — add the missing
 * translation; do NOT introduce a Hindi fallback shortcut.
 */
export function getFeatureLabel(label: LocaleLabel, locale: string): string {
  const map = label as Record<string, string | undefined>;
  return map[locale] ?? label.en;
}
