/**
 * Locale-aware label table for /baby-names pages.
 *
 * Hardcodes en/hi/sa/ta directly (kept as canonical authored copy);
 * mai/mr/te/kn/gu/bn are sourced from a Gemini-translated overlay JSON
 * built by scripts/translate-baby-names-via-gemini.py.
 *
 * Lookup helper `pickBabyLabel(key, locale)` resolves locale → hi → en.
 * Templates with `{NAK}` placeholders use `formatBabyLabel(key, locale,
 * { NAK: <name> })` to substitute at render time.
 *
 * Spec: docs/specs/2026-06-04-noindex-thin-translation-locales.md §3
 * (lifecycle state 2 → 3 — promotion).
 */

import overlay from '@/lib/constants/baby-names-labels-overlay.json';

type Overlay = Record<string, Record<string, string>>;
const OVERLAY = overlay as Overlay;

/** Canonical authored strings — en/hi/sa/ta. Other locales merge from
 *  the Gemini overlay JSON at module load. */
const AUTHORED: Record<string, Record<string, string>> = {
  en: {
    heroTitle: 'Baby Name Suggester',
    heroSubtitle: 'Find auspicious name syllables based on your birth Nakshatra & Pada',
    intro1: 'Enter your child’s birth date, time, and place below to find the starting syllables (Aksharas) prescribed by Vedic tradition. Each of the 27 birth Nakshatras has 4 Padas, giving 108 sacred starting sounds — one for each bead of the Japa Mala — and a name beginning with the right syllable aligns the child with the vibration of their birth star.',
    intro2: 'This naming convention comes from the Namakarana Samskara, one of the 16 sacred rites (Shodasha Samskaras) in the Grihya Sutras. Many families today use the Nakshatra syllable as a guide rather than a strict rule, choosing a name that begins with the right sound but fits their language and culture.',
    whyTitle: 'Why Nakshatra Syllables?',
    whyBody: 'Each nakshatra spans 13°20′ of the zodiac and has 4 padas (quarters). Each pada has a designated starting syllable rooted in Sanskrit phonetics. The sound vibration of the first syllable sets the energetic tone for the name.',
    howTitle: 'How It Works',
    howBody: 'Find the Moon’s nakshatra at birth → identify the pada (1–4) → use the corresponding syllable as the starting sound for the child’s name. The Moon’s exact degree determines which of the 108 padas applies.',
    modernTitle: 'Modern Practice',
    modernBody: 'While traditional, many families today use nakshatra syllables as a guide rather than strict rule — choosing a name that starts with the right sound but fits their language and culture.',
    padaTitle: 'What are Padas?',
    padaBody: 'Each nakshatra (birth star) is divided into 4 quarters called "Padas." Each pada is associated with a specific starting syllable for the baby\'s name. In the Hindu naming tradition (Namakarana), the child\'s name should begin with the syllable of their birth pada — this is believed to align the child\'s identity with their cosmic vibration. Your baby\'s pada is determined by the exact position of the Moon at the time of birth.',
    syllableHint: 'Your baby\'s name should ideally start with one of these syllables',
    exampleHint: 'For example, if the syllable is "Chu", names like "Chudamani", "Chulbul" etc. are auspicious.',
    referenceTitle: 'Complete Syllable Reference',
    referenceSubtitle: 'All 27 Nakshatras × 4 Padas — find the starting syllable for any birth star',
    enterBirth: 'Enter Birth Details (auto-detects Nakshatra)',
    birthCityPlaceholder: 'Birth city...',
    selectNakshatra: 'Select Birth Nakshatra',
    orChangeBelow: 'or change below',
    selectPada: 'Select Pada (Quarter)',
    allPadas: 'All Padas',
    pada: 'Pada',
    syllablesTitle: 'Name Starting Syllables',
    detectedLabel: 'Detected',
    nakshatraSuffix: '',
    detailEdu1: 'According to Vedic tradition, a child\'s name should begin with the syllable associated with their birth nakshatra pada. For babies born in {NAK} nakshatra, the first letter of the name is determined by the pada (quarter) of the Moon\'s nakshatra at the time of birth. This practice, called Namakarana, aligns the child\'s name with their cosmic vibration.',
    detailEdu2: 'To determine the exact syllable, you need the child\'s birth date, time, and location — this allows precise calculation of the Moon\'s nakshatra and pada. Our Kundali tool computes this automatically.',
    detailHeroSuffix: 'Nakshatra — Baby Names',
    detailDeityLine: '{NAK} nakshatra is ruled by {RULER}. Deity: {DEITY}.',
    padaSyllables: 'Starting Syllables by Pada',
    otherScripts: 'Syllables in Other Scripts',
    howToChoose: 'How to Choose a Name for {NAK} Nakshatra?',
    allNakshatras: 'All Nakshatras',
    nameFinderLink: 'Nakshatra Name Finder',
    generateKundaliLink: 'Generate Kundali',
    detailsSuffix: 'Details',
    padaAnalysisLink: 'Pada Analysis',
  },
  hi: {
    heroTitle: 'शिशु नाम सुझावक',
    heroSubtitle: 'जन्म नक्षत्र और पद के अनुसार शुभ नाम अक्षर खोजें',
    intro1: 'नीचे शिशु की जन्म तिथि, समय और स्थान दर्ज करें — वैदिक परम्परा से निर्धारित आरम्भिक अक्षर (अक्षर) मिल जाएँगे। 27 नक्षत्रों में से प्रत्येक के 4 पद होते हैं, जिनसे 108 पवित्र आरम्भिक ध्वनियाँ निकलती हैं — जप माला के प्रत्येक मनके के लिए एक — और सही अक्षर से शुरू होने वाला नाम शिशु को उनके जन्म नक्षत्र की कम्पन से जोड़ता है।',
    intro2: 'यह परम्परा नामकरण संस्कार से आती है, जो गृह्य सूत्रों के 16 पवित्र संस्कारों में से एक है। आज कई परिवार नक्षत्र अक्षर को कठोर नियम के बजाय मार्गदर्शक के रूप में उपयोग करते हैं — ऐसा नाम चुनते हैं जो सही ध्वनि से शुरू हो पर उनकी भाषा और संस्कृति के अनुरूप हो।',
    whyTitle: 'नक्षत्र अक्षर क्यों?',
    whyBody: 'प्रत्येक नक्षत्र राशिचक्र के 13°20′ में फैला है और इसके 4 पाद हैं। प्रत्येक पाद का संस्कृत ध्वनि विज्ञान में निहित एक निर्धारित प्रारम्भिक अक्षर है। पहले अक्षर का ध्वनि कम्पन नाम की ऊर्जा का स्वर निर्धारित करता है।',
    howTitle: 'यह कैसे काम करता है',
    howBody: 'जन्म के समय चन्द्रमा का नक्षत्र ज्ञात करें → पाद (1–4) पहचानें → बच्चे के नाम के लिए संबंधित अक्षर का उपयोग करें। चन्द्रमा का सटीक अंश निर्धारित करता है कि 108 पादों में से कौन सा लागू होता है।',
    modernTitle: 'आधुनिक अभ्यास',
    modernBody: 'परम्परागत होते हुए भी, आज कई परिवार नक्षत्र अक्षरों को कठोर नियम के बजाय मार्गदर्शक के रूप में उपयोग करते हैं — ऐसा नाम चुनते हैं जो सही ध्वनि से शुरू हो पर उनकी भाषा और संस्कृति के अनुरूप हो।',
    padaTitle: 'पाद क्या हैं?',
    padaBody: 'प्रत्येक नक्षत्र (जन्म तारा) को 4 भागों में बाँटा जाता है जिन्हें "पाद" कहते हैं। प्रत्येक पाद एक विशिष्ट प्रारम्भिक अक्षर से जुड़ा होता है। हिन्दू नामकरण परम्परा में बच्चे का नाम उनके जन्म पाद के अक्षर से शुरू होना चाहिए — माना जाता है कि यह बच्चे की पहचान को उनके ब्रह्मांडीय कम्पन से जोड़ता है। पाद जन्म के समय चन्द्रमा की सटीक स्थिति से निर्धारित होता है।',
    syllableHint: 'आपके बच्चे का नाम इनमें से किसी एक अक्षर से शुरू होना चाहिए',
    exampleHint: 'उदाहरण: यदि अक्षर "चू" है तो "चूड़ामणि", "चुलबुल" आदि नाम शुभ हैं।',
    referenceTitle: 'सम्पूर्ण अक्षर सन्दर्भ',
    referenceSubtitle: 'सभी 27 नक्षत्र × 4 पाद — किसी भी जन्म तारे के लिए प्रारम्भिक अक्षर',
    enterBirth: 'जन्म विवरण दर्ज करें (नक्षत्र स्वतः पहचानेगा)',
    birthCityPlaceholder: 'जन्म शहर...',
    selectNakshatra: 'जन्म नक्षत्र चुनें',
    orChangeBelow: 'या नीचे बदलें',
    selectPada: 'पाद चुनें (चतुर्थांश)',
    allPadas: 'सभी पाद',
    pada: 'पाद',
    syllablesTitle: 'नाम के प्रारम्भिक अक्षर',
    detectedLabel: 'पहचाना',
    nakshatraSuffix: 'नक्षत्र',
    detailEdu1: 'वैदिक परम्परा के अनुसार, बच्चे का नाम जन्म नक्षत्र के पद के अनुसार रखा जाता है। {NAK} नक्षत्र में जन्मे बच्चे का नाम ऊपर दिए गए अक्षरों से शुरू होना चाहिए। नाम का पहला अक्षर बच्चे की जन्म कुण्डली के चन्द्र नक्षत्र पद से निर्धारित होता है।',
    detailEdu2: 'सही अक्षर जानने के लिए आपको बच्चे की जन्म तिथि, समय और स्थान की आवश्यकता होती है। इससे चन्द्र नक्षत्र और पद की सटीक गणना की जा सकती है। हमारा कुण्डली टूल यह गणना स्वचालित रूप से करता है।',
    detailHeroSuffix: 'नक्षत्र — शिशु नाम',
    detailDeityLine: '{NAK} ({NAK_EN}) नक्षत्र के स्वामी {RULER} हैं। देवता: {DEITY}।',
    padaSyllables: 'पद-वार नाम के अक्षर',
    otherScripts: 'अन्य लिपियों में अक्षर',
    howToChoose: '{NAK} नक्षत्र में जन्मे बच्चे का नाम कैसे चुनें?',
    allNakshatras: 'सभी नक्षत्र',
    nameFinderLink: 'नक्षत्र नाम खोजक',
    generateKundaliLink: 'कुण्डली बनाएँ',
    detailsSuffix: 'विस्तार',
    padaAnalysisLink: 'पद विश्लेषण',
  },
  ta: {
    heroTitle: 'குழந்தை பெயர் பரிந்துரை',
    heroSubtitle: 'உங்கள் பிறப்பு நட்சத்திரம் மற்றும் பாதத்தின் அடிப்படையில் சுபமான பெயர் எழுத்துக்களைக் கண்டறியவும்',
    enterBirth: 'பிறப்பு விவரங்களை உள்ளிடுங்கள் (நட்சத்திரம் தானாக கணிக்கப்படும்)',
    birthCityPlaceholder: 'பிறந்த நகரம்...',
    selectNakshatra: 'பிறப்பு நட்சத்திரத்தைத் தேர்ந்தெடுக்கவும்',
    orChangeBelow: 'அல்லது கீழே மாற்றவும்',
    selectPada: 'பாதத்தைத் தேர்ந்தெடுக்கவும்',
    allPadas: 'அனைத்து பாதங்கள்',
    pada: 'பாதம்',
    syllablesTitle: 'பரிந்துரைக்கப்பட்ட எழுத்துகள்',
    referenceTitle: 'முழுமையான எழுத்துகள் குறிப்பு',
    referenceSubtitle: 'அனைத்து 27 நட்சத்திரங்கள் × 4 பாதங்கள் — எந்த பிறப்பு நட்சத்திரத்திற்கும் ஆரம்ப எழுத்து',
    padaTitle: 'பாதங்கள் என்றால் என்ன?',
    nakshatraSuffix: 'நட்சத்திரம்',
  },
};

/** Resolve a label with locale → hi → en → '' fallback. */
export function pickBabyLabel(key: string, locale: string): string {
  // Authored entries beat overlay (canonical en/hi/sa/ta).
  const authored = AUTHORED[locale]?.[key];
  if (authored !== undefined) return authored;
  // Overlay-supplied locales (mai/mr/te/kn/gu/bn).
  const ov = OVERLAY[locale]?.[key];
  if (ov !== undefined) return ov;
  // Fallback chain.
  return AUTHORED.hi?.[key] ?? AUTHORED.en?.[key] ?? '';
}

/** Render a label with `{NAME}` placeholders substituted. Unknown
 *  placeholders are left in place — defensive so a template typo doesn't
 *  silently swallow the substitution. */
export function formatBabyLabel(
  key: string,
  locale: string,
  vars: Record<string, string>,
): string {
  const template = pickBabyLabel(key, locale);
  return template.replace(/\{([A-Z_]+)\}/g, (m, name: string) => vars[name] ?? m);
}
