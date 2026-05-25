#!/usr/bin/env tsx
/**
 * Sprint 9 — translate the EN-seeded ta/te/bn/gu/kn title entries on
 * 15 priority routes whose ta/te/bn/gu/kn title was byte-identical to
 * the EN title (silent English fallback to non-English locales).
 *
 * Approach: hand-written bilingual titles in the codified
 * `<RegionalScript> | <English>` format (same pattern enforced by
 * scripts/bilingualize-priority-titles.ts), using standard Tamil /
 * Telugu / Bengali / Gujarati / Kannada transliterations for the
 * Sanskrit-origin Jyotish terms:
 *   - Ekadashi   = ஏகாதசி / ఏకాదశి / একাদশী / એકાદશી / ಏಕಾದಶಿ
 *   - Tithi      = திதி / తిథి / তিথি / તિથિ / ತಿಥಿ
 *   - Nakshatra  = நட்சத்திரம் / నక్షత్రం / নক্ষত্র / નક્ષત્ર / ನಕ್ಷತ್ರ
 *   - Muhurta    = முகூர்த்தம் / ముహూర్తం / মুহূর্ত / મુહૂર્ત / ಮುಹೂರ್ತ
 *   - Mangal     = மங்கள / మంగళ / মঙ্গল / મંગળ / ಮಂಗಳ
 *   - Kaal Sarp  = காளசர்ப்ப / కాలసర్ప / কালসর্প / કાળસર્પ / ಕಾಲಸರ್ಪ
 *   - Pitru      = பித்ரு / పిత్రు / পিত্রু / પિતૃ / ಪಿತೃ
 *   - Sidereal   = நிராயனம் / నిరయన / নিরয়ন / નિરયન / ನಿರಯನ
 *   - Tropical   = சாயனம் / సాయన / সায়ন / સાયન / ಸಾಯನ
 *
 * Bilingual `Script | English` is mandatory per feedback_bilingual_titles
 * — never script-only or English-only.
 *
 * Descriptions are NOT touched in this PR (each locale needs an actual
 * native translation, not a bilingual concatenation — separate sprint).
 *
 * Idempotent. Pass --apply to write.
 */
import { Project, SyntaxKind } from 'ts-morph';

const APPLY = process.argv.includes('--apply');
const TARGET = 'src/lib/seo/metadata.ts';

interface LocaleTitles {
  /** Expected current EN value (used to confirm we're touching the right route). */
  en: string;
  ta: string;
  te: string;
  bn: string;
  gu: string;
  kn: string;
}

const TITLE_TRANSLATIONS: Record<string, LocaleTitles> = {
  '/ekadashi': {
    en: 'Ekadashi 2026  –  All 24 Dates, Names, Stories & Benefits',
    ta: 'ஏகாதசி 2026 — 24 தேதிகள், பெயர்கள், கதைகள் | Ekadashi 2026 — All 24 Dates',
    te: 'ఏకాదశి 2026 — 24 తేదీలు, పేర్లు, కథలు | Ekadashi 2026 — All 24 Dates',
    bn: 'একাদশী ২০২৬ — ২৪টি তারিখ, নাম, গল্প | Ekadashi 2026 — All 24 Dates',
    gu: 'એકાદશી 2026 — 24 તારીખો, નામો, કથાઓ | Ekadashi 2026 — All 24 Dates',
    kn: 'ಏಕಾದಶಿ 2026 — 24 ದಿನಾಂಕಗಳು, ಹೆಸರುಗಳು, ಕಥೆಗಳು | Ekadashi 2026 — All 24 Dates',
  },
  '/mangal-dosha': {
    en: 'Mangal Dosha Calculator  –  Check Mars Dosha in Your Chart',
    ta: 'மங்கள தோஷ கால்குலேட்டர் — ஜாதகத்தில் செவ்வாய் தோஷம் சரிபார்க்கவும் | Mangal Dosha Calculator',
    te: 'మంగళ దోష కాలిక్యులేటర్ — జాతకంలో మంగళ దోషం తనిఖీ | Mangal Dosha Calculator',
    bn: 'মঙ্গল দোষ ক্যালকুলেটর — কুণ্ডলীতে মঙ্গল দোষ যাচাই | Mangal Dosha Calculator',
    gu: 'મંગળ દોષ કેલ્ક્યુલેટર — કુંડળીમાં મંગળ દોષ તપાસો | Mangal Dosha Calculator',
    kn: 'ಮಂಗಳ ದೋಷ ಕ್ಯಾಲ್ಕುಲೇಟರ್ — ಜಾತಕದಲ್ಲಿ ಮಂಗಳ ದೋಷ ಪರಿಶೀಲಿಸಿ | Mangal Dosha Calculator',
  },
  '/kaal-sarp': {
    en: 'Kaal Sarp Dosha Calculator  –  Check if Present in Your Kundali',
    ta: 'காளசர்ப்ப தோஷ கால்குலேட்டர் — ஜாதகத்தில் உள்ளதா சரிபார்க்கவும் | Kaal Sarp Dosha Calculator',
    te: 'కాలసర్ప దోష కాలిక్యులేటర్ — కుండలిలో ఉందా తనిఖీ | Kaal Sarp Dosha Calculator',
    bn: 'কালসর্প দোষ ক্যালকুলেটর — কুণ্ডলীতে আছে কি যাচাই | Kaal Sarp Dosha Calculator',
    gu: 'કાળસર્પ દોષ કેલ્ક્યુલેટર — કુંડળીમાં છે કે કેમ તપાસો | Kaal Sarp Dosha Calculator',
    kn: 'ಕಾಲಸರ್ಪ ದೋಷ ಕ್ಯಾಲ್ಕುಲೇಟರ್ — ಜಾತಕದಲ್ಲಿ ಇದೆಯೇ ಪರಿಶೀಲಿಸಿ | Kaal Sarp Dosha Calculator',
  },
  '/pitra-dosha': {
    en: 'Pitra Dosha Check  –  Ancestral Karma in Your Birth Chart',
    ta: 'பித்ரு தோஷ சரிபார்ப்பு — ஜாதகத்தில் முன்னோர் கர்மா | Pitra Dosha Check',
    te: 'పిత్రు దోష తనిఖీ — జన్మ కుండలిలో పూర్వీకుల కర్మ | Pitra Dosha Check',
    bn: 'পিত্রু দোষ পরীক্ষা — জন্ম কুণ্ডলীতে পূর্বপুরুষের কর্ম | Pitra Dosha Check',
    gu: 'પિતૃ દોષ તપાસ — જન્મ કુંડળીમાં પૂર્વજોના કર્મ | Pitra Dosha Check',
    kn: 'ಪಿತೃ ದೋಷ ಪರಿಶೀಲನೆ — ಜನ್ಮ ಜಾತಕದಲ್ಲಿ ಪೂರ್ವಜರ ಕರ್ಮ | Pitra Dosha Check',
  },
  '/panchang/tithi': {
    en: 'Tithi  –  The Lunar Day in Vedic Astrology',
    ta: 'திதி — வேத ஜோதிடத்தில் சந்திர நாள் | Tithi — Lunar Day in Vedic Astrology',
    te: 'తిథి — వేద జ్యోతిష్యంలో చాంద్ర దినం | Tithi — Lunar Day in Vedic Astrology',
    bn: 'তিথি — বৈদিক জ্যোতিষে চান্দ্র দিন | Tithi — Lunar Day in Vedic Astrology',
    gu: 'તિથિ — વૈદિક જ્યોતિષમાં ચાંદ્ર દિવસ | Tithi — Lunar Day in Vedic Astrology',
    kn: 'ತಿಥಿ — ವೈದಿಕ ಜ್ಯೋತಿಷ್ಯದಲ್ಲಿ ಚಾಂದ್ರ ದಿನ | Tithi — Lunar Day in Vedic Astrology',
  },
  '/panchang/nakshatra': {
    en: '27 Nakshatras  –  Lunar Mansions in Vedic Astrology',
    ta: '27 நட்சத்திரங்கள் — வேத ஜோதிடத்தில் சந்திர மண்டபங்கள் | 27 Nakshatras — Lunar Mansions',
    te: '27 నక్షత్రాలు — వేద జ్యోతిష్యంలో చాంద్ర మండపాలు | 27 Nakshatras — Lunar Mansions',
    bn: '২৭টি নক্ষত্র — বৈদিক জ্যোতিষে চান্দ্র মণ্ডপ | 27 Nakshatras — Lunar Mansions',
    gu: '27 નક્ષત્રો — વૈદિક જ્યોતિષમાં ચાંદ્ર મંડપો | 27 Nakshatras — Lunar Mansions',
    kn: '27 ನಕ್ಷತ್ರಗಳು — ವೈದಿಕ ಜ್ಯೋತಿಷ್ಯದಲ್ಲಿ ಚಾಂದ್ರ ಮಂಟಪಗಳು | 27 Nakshatras — Lunar Mansions',
  },
  '/retrograde': {
    en: 'Retrograde Calendar 2026  –  Mercury, Venus, Mars, Jupiter, Saturn',
    ta: 'வக்ர காலண்டர் 2026 — புதன், சுக்கிரன், செவ்வாய், குரு, சனி | Retrograde Calendar 2026',
    te: 'వక్ర క్యాలెండర్ 2026 — బుధ, శుక్ర, మంగళ, గురు, శని | Retrograde Calendar 2026',
    bn: 'বক্রী ক্যালেন্ডার ২০২৬ — বুধ, শুক্র, মঙ্গল, বৃহস্পতি, শনি | Retrograde Calendar 2026',
    gu: 'વક્રી કેલેન્ડર 2026 — બુધ, શુક્ર, મંગળ, ગુરુ, શનિ | Retrograde Calendar 2026',
    kn: 'ವಕ್ರ ಕ್ಯಾಲೆಂಡರ್ 2026 — ಬುಧ, ಶುಕ್ರ, ಮಂಗಳ, ಗುರು, ಶನಿ | Retrograde Calendar 2026',
  },
  '/prashna': {
    en: 'Prashna Kundali  –  Vedic Horary Astrology',
    ta: 'ப்ரஷ்ன ஜாதகம் — வேத ஹோரரி ஜோதிடம் | Prashna Kundali — Vedic Horary Astrology',
    te: 'ప్రశ్న కుండలి — వేద హోరరీ జ్యోతిష్యం | Prashna Kundali — Vedic Horary Astrology',
    bn: 'প্রশ্ন কুণ্ডলী — বৈদিক হোরারি জ্যোতিষ | Prashna Kundali — Vedic Horary Astrology',
    gu: 'પ્રશ્ન કુંડળી — વૈદિક હોરરી જ્યોતિષ | Prashna Kundali — Vedic Horary Astrology',
    kn: 'ಪ್ರಶ್ನೆ ಕುಂಡಲಿ — ವೈದಿಕ ಹೋರರಿ ಜ್ಯೋತಿಷ್ಯ | Prashna Kundali — Vedic Horary Astrology',
  },
  '/varshaphal': {
    en: 'Varshaphal  –  Annual Horoscope (Tajika System)',
    ta: 'வர்ஷபலம் — ஆண்டுபலம் (தாஜிக முறை) | Varshaphal — Annual Horoscope (Tajika)',
    te: 'వర్షఫలం — వార్షిక జాతక (తాజిక పద్ధతి) | Varshaphal — Annual Horoscope (Tajika)',
    bn: 'বর্ষফল — বার্ষিক রাশিফল (তাজিক পদ্ধতি) | Varshaphal — Annual Horoscope (Tajika)',
    gu: 'વર્ષફળ — વાર્ષિક રાશિફળ (તાજિક પદ્ધતિ) | Varshaphal — Annual Horoscope (Tajika)',
    kn: 'ವರ್ಷಫಲ — ವಾರ್ಷಿಕ ಜಾತಕ (ತಾಜಿಕ ಪದ್ಧತಿ) | Varshaphal — Annual Horoscope (Tajika)',
  },
  '/kp-system': {
    en: 'KP System  –  Krishnamurti Paddhati Chart',
    ta: 'KP முறை — கிருஷ்ணமூர்த்தி பத்ததி ஜாதகம் | KP System — Krishnamurti Paddhati Chart',
    te: 'KP పద్ధతి — కృష్ణమూర్తి పద్ధతి జాతక | KP System — Krishnamurti Paddhati Chart',
    bn: 'KP পদ্ধতি — কৃষ্ণমূর্তি পদ্ধতি কুণ্ডলী | KP System — Krishnamurti Paddhati Chart',
    gu: 'KP પદ્ધતિ — કૃષ્ણમૂર્તિ પદ્ધતિ કુંડળી | KP System — Krishnamurti Paddhati Chart',
    kn: 'KP ಪದ್ಧತಿ — ಕೃಷ್ಣಮೂರ್ತಿ ಪದ್ಧತಿ ಜಾತಕ | KP System — Krishnamurti Paddhati Chart',
  },
  '/tropical-compare': {
    en: 'Sidereal vs Tropical  –  Your Real Star Signs',
    ta: 'நிராயனம் vs சாயனம் — உங்களின் உண்மையான ராசிகள் | Sidereal vs Tropical — Real Star Signs',
    te: 'నిరయన vs సాయన — మీ నిజమైన రాశులు | Sidereal vs Tropical — Real Star Signs',
    bn: 'নিরয়ন vs সায়ন — আপনার আসল রাশি | Sidereal vs Tropical — Real Star Signs',
    gu: 'નિરયન vs સાયન — તમારી સાચી રાશિઓ | Sidereal vs Tropical — Real Star Signs',
    kn: 'ನಿರಯನ vs ಸಾಯನ — ನಿಮ್ಮ ನಿಜವಾದ ರಾಶಿಗಳು | Sidereal vs Tropical — Real Star Signs',
  },
  '/panchang/auspicious': {
    en: 'Auspicious Timings Today  –  Muhurta, Abhijit, Amrit Kalam',
    ta: 'இன்றைய சுப நேரங்கள் — முகூர்த்தம், அபிஜித், அம்ருத காலம் | Auspicious Timings Today',
    te: 'నేటి శుభ సమయాలు — ముహూర్తం, అభిజిత్, అమృత కాలం | Auspicious Timings Today',
    bn: 'আজকের শুভ সময় — মুহূর্ত, অভিজিৎ, অমৃত কাল | Auspicious Timings Today',
    gu: 'આજના શુભ સમય — મુહૂર્ત, અભિજિત, અમૃત કાળ | Auspicious Timings Today',
    kn: 'ಇಂದಿನ ಶುಭ ಸಮಯಗಳು — ಮುಹೂರ್ತ, ಅಭಿಜಿತ್, ಅಮೃತ ಕಾಲ | Auspicious Timings Today',
  },
  '/panchang/inauspicious': {
    en: 'Inauspicious Timings Today  –  Rahu Kaal, Yamaganda, Varjyam',
    ta: 'இன்றைய அசுப நேரங்கள் — ராகு காலம், யமகண்டம், வர்ஜ்யம் | Inauspicious Timings Today',
    te: 'నేటి అశుభ సమయాలు — రాహు కాలం, యమగండం, వర్జ్యం | Inauspicious Timings Today',
    bn: 'আজকের অশুভ সময় — রাহু কাল, যমগণ্ড, বর্জ্যম | Inauspicious Timings Today',
    gu: 'આજના અશુભ સમય — રાહુ કાળ, યમગંડ, વર્જ્ય | Inauspicious Timings Today',
    kn: 'ಇಂದಿನ ಅಶುಭ ಸಮಯಗಳು — ರಾಹು ಕಾಲ, ಯಮಗಂಡ, ವರ್ಜ್ಯ | Inauspicious Timings Today',
  },
  '/glossary': {
    en: 'Vedic Astrology Glossary  –  50+ Terms Explained',
    ta: 'வேத ஜோதிட சொற்களஞ்சியம் — 50+ சொற்கள் விளக்கம் | Vedic Astrology Glossary',
    te: 'వేద జ్యోతిష్య పదకోశం — 50+ పదాలు వివరణ | Vedic Astrology Glossary',
    bn: 'বৈদিক জ্যোতিষ শব্দকোষ — ৫০+ পরিভাষা ব্যাখ্যা | Vedic Astrology Glossary',
    gu: 'વૈદિક જ્યોતિષ શબ્દકોશ — 50+ શબ્દો સમજાવ્યા | Vedic Astrology Glossary',
    kn: 'ವೈದಿಕ ಜ್ಯೋತಿಷ್ಯ ಪದಕೋಶ — 50+ ಪದಗಳ ವಿವರಣೆ | Vedic Astrology Glossary',
  },
  '/accuracy': {
    en: 'Calculation Accuracy — Swiss Ephemeris, JPL & USNO Verified',
    ta: 'கணக்கீட்டு துல்லியம் — Swiss Ephemeris, JPL & USNO சரிபார்க்கப்பட்டது | Calculation Accuracy',
    te: 'గణన ఖచ్చితత్వం — Swiss Ephemeris, JPL & USNO ధృవీకరించబడింది | Calculation Accuracy',
    bn: 'গণনা নির্ভুলতা — Swiss Ephemeris, JPL & USNO যাচাইকৃত | Calculation Accuracy',
    gu: 'ગણતરી ચોકસાઈ — Swiss Ephemeris, JPL & USNO ચકાસાયેલ | Calculation Accuracy',
    kn: 'ಲೆಕ್ಕಾಚಾರದ ನಿಖರತೆ — Swiss Ephemeris, JPL & USNO ಪರಿಶೀಲಿಸಲಾಗಿದೆ | Calculation Accuracy',
  },
};

const SCRIPT_LOCALES = ['ta', 'te', 'bn', 'gu', 'kn'] as const;

const project = new Project({ tsConfigFilePath: 'tsconfig.json', skipAddingFilesFromTsConfig: true });
const src = project.addSourceFileAtPath(TARGET);
const pageMetaDecl = src.getVariableDeclarationOrThrow('PAGE_META');
const pageMetaObj = pageMetaDecl.getInitializerIfKindOrThrow(SyntaxKind.ObjectLiteralExpression);

function getStringLit(node: import('ts-morph').Node | undefined) {
  if (!node) return null;
  return node.asKind(SyntaxKind.StringLiteral) ?? node.asKind(SyntaxKind.NoSubstitutionTemplateLiteral) ?? null;
}

let entriesUpdated = 0;
let routesSkipped = 0;
const report: string[] = [];

for (const [route, t] of Object.entries(TITLE_TRANSLATIONS)) {
  const routeProp = pageMetaObj.getProperty(`'${route}'`) ?? pageMetaObj.getProperty(`"${route}"`);
  if (!routeProp || routeProp.getKind() !== SyntaxKind.PropertyAssignment) {
    report.push(`[skip] route ${route} not found`); routesSkipped++; continue;
  }
  const meta = routeProp.asKindOrThrow(SyntaxKind.PropertyAssignment).getInitializerIfKindOrThrow(SyntaxKind.ObjectLiteralExpression);
  const titleProp = meta.getProperty('title');
  if (!titleProp || titleProp.getKind() !== SyntaxKind.PropertyAssignment) {
    report.push(`[skip] route ${route} has no title block`); routesSkipped++; continue;
  }
  const titleObj = titleProp.asKindOrThrow(SyntaxKind.PropertyAssignment).getInitializerIfKind(SyntaxKind.ObjectLiteralExpression);
  if (!titleObj) continue;

  // Confirm EN value matches what we're translating against — if it has
  // already been shortened by Sprint 7/8, we want to know and re-author.
  const enEntry = titleObj.getProperty('en') ?? titleObj.getProperty("'en'") ?? titleObj.getProperty('"en"');
  if (!enEntry || enEntry.getKind() !== SyntaxKind.PropertyAssignment) continue;
  const enLit = getStringLit(enEntry.asKindOrThrow(SyntaxKind.PropertyAssignment).getInitializer());
  if (!enLit) continue;
  const actualEn = enLit.getLiteralValue();
  if (actualEn !== t.en) {
    report.push(`[warn] ${route}.title.en mismatch — expected "${t.en.slice(0, 50)}…" got "${actualEn.slice(0, 50)}…" — skipping`);
    routesSkipped++; continue;
  }

  let routeChanges = 0;
  for (const locale of SCRIPT_LOCALES) {
    const localeEntry =
      titleObj.getProperty(locale) ?? titleObj.getProperty(`'${locale}'`) ?? titleObj.getProperty(`"${locale}"`);
    if (!localeEntry || localeEntry.getKind() !== SyntaxKind.PropertyAssignment) continue;
    const lit = getStringLit(localeEntry.asKindOrThrow(SyntaxKind.PropertyAssignment).getInitializer());
    if (!lit) continue;
    const cur = lit.getLiteralValue();
    const newVal = t[locale];
    if (cur === newVal) continue; // idempotent
    lit.replaceWithText(JSON.stringify(newVal));
    routeChanges++;
    entriesUpdated++;
  }
  report.push(`[ok]   ${route} — ${routeChanges} locale${routeChanges === 1 ? '' : 's'} translated`);
}

if (APPLY) {
  src.saveSync();
  console.log(`\nApplied: ${entriesUpdated} title entries across ${Object.keys(TITLE_TRANSLATIONS).length} routes (${routesSkipped} skipped).`);
} else {
  console.log(`\nDRY-RUN — pass --apply to write. Would update ${entriesUpdated} title entries (${routesSkipped} routes skipped).`);
}
console.log();
for (const line of report) console.log(line);
