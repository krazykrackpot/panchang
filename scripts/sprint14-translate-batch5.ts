#!/usr/bin/env tsx
/**
 * Sprint 14 — translate batch 5: 18 learn-track / learn-lab / learn-domain
 * routes whose ta/te/bn/gu/kn titles were byte-identical to EN.
 *
 * Same idempotent ts-morph pattern as Sprints 9 / 11 / 12 / 13.
 * Single-file AST manipulation; no tsconfig load (Sprint 11 lesson).
 *
 * Tamil quality lessons codified from Gemini #210 / #211 applied
 * throughout — avoid Grantha letters where natural Tamil characters
 * work; idiomatic forms preferred.
 */
import { Project, SyntaxKind } from 'ts-morph';

const APPLY = process.argv.includes('--apply');
const TARGET = 'src/lib/seo/metadata.ts';

interface RouteTitles {
  ta: string; te: string; bn: string; gu: string; kn: string;
}

const TRANSLATIONS: Record<string, RouteTitles> = {
  '/learn/labs/panchang': {
    ta: 'ஊடாடும் ஆய்வகம்: உங்கள் பஞ்சாங்கத்தை படிப்படியாக கணக்கிடுங்கள் | Interactive Lab — Panchang',
    te: 'ఇంటరాక్టివ్ ల్యాబ్: మీ పంచాంగాన్ని దశల వారీగా లెక్కించండి | Interactive Lab — Panchang',
    bn: 'ইন্টারঅ্যাকটিভ ল্যাব: আপনার পঞ্চাঙ্গ ধাপে ধাপে গণনা করুন | Interactive Lab — Panchang',
    gu: 'ઇન્ટરેક્ટિવ લેબ: તમારું પંચાંગ પગલા-દર-પગલા ગણો | Interactive Lab — Panchang',
    kn: 'ಸಂವಾದಾತ್ಮಕ ಪ್ರಯೋಗಾಲಯ: ನಿಮ್ಮ ಪಂಚಾಂಗವನ್ನು ಹಂತ-ಹಂತವಾಗಿ ಲೆಕ್ಕಾಚಾರ ಮಾಡಿ | Interactive Lab — Panchang',
  },
  '/learn/labs/moon': {
    ta: 'ஊடாடும் ஆய்வகம்: சந்திரனைத் தடம் தேடுங்கள் — 60 சைன் சொற்கள் | Interactive Lab — Trace the Moon',
    te: 'ఇంటరాక్టివ్ ల్యాబ్: చంద్రుని పథాన్ని కనుగొనండి — 60 సైన్ పదాలు | Interactive Lab — Trace the Moon',
    bn: 'ইন্টারঅ্যাকটিভ ল্যাব: চাঁদের গতি খুঁজুন — ৬০টি সাইন পদ | Interactive Lab — Trace the Moon',
    gu: 'ઇન્ટરેક્ટિવ લેબ: ચંદ્રને ટ્રેસ કરો — 60 સાઇન પદો | Interactive Lab — Trace the Moon',
    kn: 'ಸಂವಾದಾತ್ಮಕ ಪ್ರಯೋಗಾಲಯ: ಚಂದ್ರನ ಪಥ ಹುಡುಕಿ — 60 ಸೈನ್ ಪದಗಳು | Interactive Lab — Trace the Moon',
  },
  '/learn/labs/dasha': {
    ta: 'ஊடாடும் ஆய்வகம்: உங்கள் விம்சோத்தரி தசா காலவரிசை | Interactive Lab — Vimshottari Dasha',
    te: 'ఇంటరాక్టివ్ ల్యాబ్: మీ విమ్శోత్తరి దశ కాలరేఖ | Interactive Lab — Vimshottari Dasha',
    bn: 'ইন্টারঅ্যাকটিভ ল্যাব: আপনার বিম্শোত্তরি দশা সময়রেখা | Interactive Lab — Vimshottari Dasha',
    gu: 'ઇન્ટરેક્ટિવ લેબ: તમારી વિમ્શોત્તરી દશા સમયરેખા | Interactive Lab — Vimshottari Dasha',
    kn: 'ಸಂವಾದಾತ್ಮಕ ಪ್ರಯೋಗಾಲಯ: ನಿಮ್ಮ ವಿಮ್ಶೋತ್ತರಿ ದಶೆ ಕಾಲರೇಖೆ | Interactive Lab — Vimshottari Dasha',
  },
  '/learn/labs/shadbala': {
    ta: 'ஊடாடும் ஆய்வகம்: ஷட்பலம் — 6-மடங்கு கிரக பலம் | Interactive Lab — Shadbala',
    te: 'ఇంటరాక్టివ్ ల్యాబ్: షడ్బలం — 6-రెట్లు గ్రహ బలం | Interactive Lab — Shadbala',
    bn: 'ইন্টারঅ্যাকটিভ ল্যাব: ষড়বল — ৬-গুণ গ্রহ শক্তি | Interactive Lab — Shadbala',
    gu: 'ઇન્ટરેક્ટિવ લેબ: ષડ્બલ — 6-ગણી ગ્રહ શક્તિ | Interactive Lab — Shadbala',
    kn: 'ಸಂವಾದಾತ್ಮಕ ಪ್ರಯೋಗಾಲಯ: ಷಡ್ಬಲ — 6-ಪಟ್ಟು ಗ್ರಹ ಶಕ್ತಿ | Interactive Lab — Shadbala',
  },
  '/learn/labs/kp': {
    ta: 'ஊடாடும் ஆய்வகம்: KP துணை-அதிபதி தேடல் | Interactive Lab — KP Sub-Lord Lookup',
    te: 'ఇంటరాక్టివ్ ల్యాబ్: KP ఉప-అధిపతి శోధన | Interactive Lab — KP Sub-Lord Lookup',
    bn: 'ইন্টারঅ্যাকটিভ ল্যাব: KP উপ-অধিপতি অনুসন্ধান | Interactive Lab — KP Sub-Lord Lookup',
    gu: 'ઇન્ટરેક્ટિવ લેબ: KP ઉપ-અધિપતિ શોધ | Interactive Lab — KP Sub-Lord Lookup',
    kn: 'ಸಂವಾದಾತ್ಮಕ ಪ್ರಯೋಗಾಲಯ: KP ಉಪ-ಅಧಿಪತಿ ಹುಡುಕಾಟ | Interactive Lab — KP Sub-Lord Lookup',
  },
  '/learn/vedanga': {
    ta: 'வேதாங்க ஜோதிஷம் & இந்திய வானியல் பாரம்பரியம் | Vedanga Jyotisha — Indian Astronomy Heritage',
    te: 'వేదాంగ జ్యోతిషం & భారతీయ ఖగోళశాస్త్ర వారసత్వం | Vedanga Jyotisha — Indian Astronomy Heritage',
    bn: 'বেদাঙ্গ জ্যোতিষ ও ভারতীয় জ্যোতির্বিজ্ঞান ঐতিহ্য | Vedanga Jyotisha — Indian Astronomy Heritage',
    gu: 'વેદાંગ જ્યોતિષ અને ભારતીય ખગોળશાસ્ત્ર વારસો | Vedanga Jyotisha — Indian Astronomy Heritage',
    kn: 'ವೇದಾಂಗ ಜ್ಯೋತಿಷ್ಯ ಮತ್ತು ಭಾರತೀಯ ಖಗೋಳಶಾಸ್ತ್ರ ಪರಂಪರೆ | Vedanga Jyotisha — Indian Astronomy Heritage',
  },
  '/learn/observatories': {
    ta: "ஜந்தர் மந்தர் — இந்தியாவின் கல் வானியல் வேதசாலைகள் | Jantar Mantar — India's Stone Observatories",
    te: "జంతర్ మంతర్ — భారతదేశ రాతి ఖగోళ వేధశాలలు | Jantar Mantar — India's Stone Observatories",
    bn: "যন্তর মন্তর — ভারতের পাথরের জ্যোতির্বিজ্ঞান মানমন্দির | Jantar Mantar — India's Stone Observatories",
    gu: "જંતર મંતર — ભારતની પથ્થરની વેધશાળાઓ | Jantar Mantar — India's Stone Observatories",
    kn: "ಜಂತರ್ ಮಂತರ್ — ಭಾರತದ ಕಲ್ಲಿನ ವೇಧಶಾಲೆಗಳು | Jantar Mantar — India's Stone Observatories",
  },
  '/learn/planetary-cycles': {
    ta: 'கிரக சுற்றுக் காலங்கள் — சூர்ய சித்தாந்தம் vs NASA | Planetary Orbital Periods',
    te: 'గ్రహ కక్ష్య కాలాలు — సూర్య సిద్ధాంతం vs NASA | Planetary Orbital Periods',
    bn: 'গ্রহ কক্ষপথ কাল — সূর্য সিদ্ধান্ত vs NASA | Planetary Orbital Periods',
    gu: 'ગ્રહ ભ્રમણકાળ — સૂર્ય સિદ્ધાંત vs NASA | Planetary Orbital Periods',
    kn: 'ಗ್ರಹ ಕಕ್ಷಾ ಕಾಲಗಳು — ಸೂರ್ಯ ಸಿದ್ಧಾಂತ vs NASA | Planetary Orbital Periods',
  },
  '/learn/track/cosmology': {
    ta: 'இந்து பிரபஞ்சவியல் & அடித்தளம் — முழுமையான கற்றல் வழி | Hindu Cosmology — Learning Track',
    te: 'హిందూ విశ్వశాస్త్రం & పునాదులు — సంపూర్ణ అభ్యాస మార్గం | Hindu Cosmology — Learning Track',
    bn: 'হিন্দু সৃষ্টিতত্ত্ব ও মৌলিক — সম্পূর্ণ শিক্ষা পথ | Hindu Cosmology — Learning Track',
    gu: 'હિન્દુ બ્રહ્માંડ વિજ્ઞાન અને પાયા — સંપૂર્ણ શિક્ષણ માર્ગ | Hindu Cosmology — Learning Track',
    kn: 'ಹಿಂದೂ ಬ್ರಹ್ಮಾಂಡ ವಿಜ್ಞಾನ ಮತ್ತು ಮೂಲಭೂತಗಳು — ಸಂಪೂರ್ಣ ಕಲಿಕಾ ಮಾರ್ಗ | Hindu Cosmology — Learning Track',
  },
  '/learn/track/panchang': {
    ta: 'பஞ்சாங்கம் — தினசரி பிரபஞ்ச கேலண்டரை கற்றுக் கொள்ளுங்கள் | Panchang — Daily Cosmic Calendar',
    te: 'పంచాంగం — దైనందిన విశ్వ క్యాలెండర్ నేర్చుకోండి | Panchang — Daily Cosmic Calendar',
    bn: 'পঞ্চাঙ্গ — দৈনিক মহাজাগতিক ক্যালেন্ডার শিখুন | Panchang — Daily Cosmic Calendar',
    gu: 'પંચાંગ — દૈનિક બ્રહ્માંડ કેલેન્ડર શીખો | Panchang — Daily Cosmic Calendar',
    kn: 'ಪಂಚಾಂಗ — ದೈನಂದಿನ ವಿಶ್ವ ಕ್ಯಾಲೆಂಡರ್ ಕಲಿಯಿರಿ | Panchang — Daily Cosmic Calendar',
  },
  '/learn/track/kundali': {
    ta: 'ஜாதகம் — அடிப்படை முதல் உயர் வரை ஜாதக வாசிப்பு கற்க | Kundali — Birth Chart Reading',
    te: 'కుండలి — ప్రాథమికాల నుండి అధునాతనాల వరకు జాతక పఠనం | Kundali — Birth Chart Reading',
    bn: 'কুণ্ডলী — মৌলিক থেকে উন্নত পর্যন্ত জন্ম কুণ্ডলী পঠন | Kundali — Birth Chart Reading',
    gu: 'કુંડળી — પાયાથી અદ્યતન સુધી જન્મ કુંડળી વાચન | Kundali — Birth Chart Reading',
    kn: 'ಕುಂಡಲಿ — ಮೂಲಭೂತದಿಂದ ಉನ್ನತದವರೆಗೆ ಜನ್ಮ ಕುಂಡಲಿ ಪಠನ | Kundali — Birth Chart Reading',
  },
  '/learn/career': {
    ta: 'தொழில் முன்னறிவிப்பு — 10வது வீடு, D10 & அமாத்யகாரக வழிகாட்டி | Career Prediction Guide',
    te: 'కెరీర్ అంచనా — 10వ ఇల్లు, D10 & అమాత్యకారక మార్గదర్శకం | Career Prediction Guide',
    bn: 'কর্মজীবন ভবিষ্যদ্বাণী — ১০ম ঘর, D10 ও অমাত্যকারক গাইড | Career Prediction Guide',
    gu: 'કારકિર્દી આગાહી — 10મું ઘર, D10 અને અમાત્યકારક માર્ગદર્શિકા | Career Prediction Guide',
    kn: 'ವೃತ್ತಿ ಭವಿಷ್ಯ — 10ನೇ ಮನೆ, D10 ಮತ್ತು ಅಮಾತ್ಯಕಾರಕ ಮಾರ್ಗದರ್ಶಿ | Career Prediction Guide',
  },
  '/learn/marriage': {
    ta: 'திருமண முன்னறிவிப்பு — 7வது வீடு, D9 நவாம்சம் & நேரம் | Marriage Prediction Guide',
    te: 'వివాహ అంచనా — 7వ ఇల్లు, D9 నవాంశ & సమయం | Marriage Prediction Guide',
    bn: 'বিবাহ ভবিষ্যদ্বাণী — ৭ম ঘর, D9 নবাংশ ও সময় | Marriage Prediction Guide',
    gu: 'લગ્ન આગાહી — 7મું ઘર, D9 નવાંશ અને સમય | Marriage Prediction Guide',
    kn: 'ವಿವಾಹ ಭವಿಷ್ಯ — 7ನೇ ಮನೆ, D9 ನವಾಂಶ ಮತ್ತು ಸಮಯ | Marriage Prediction Guide',
  },
  '/learn/wealth': {
    ta: 'செல்வ முன்னறிவிப்பு — தன யோகங்கள், 2வது/11வது வீடு பகுப்பாய்வு | Wealth Prediction Guide',
    te: 'సంపద అంచనా — ధన యోగాలు, 2వ/11వ ఇల్లు విశ్లేషణ | Wealth Prediction Guide',
    bn: 'সম্পদ ভবিষ্যদ্বাণী — ধন যোগ, ২য়/১১তম ঘর বিশ্লেষণ | Wealth Prediction Guide',
    gu: 'સંપત્તિ આગાહી — ધન યોગ, 2જું/11મું ઘર વિશ્લેષણ | Wealth Prediction Guide',
    kn: 'ಸಂಪತ್ತು ಭವಿಷ್ಯ — ಧನ ಯೋಗ, 2ನೇ/11ನೇ ಮನೆ ವಿಶ್ಲೇಷಣೆ | Wealth Prediction Guide',
  },
  '/learn/health': {
    ta: 'மருத்துவ ஜோதிடம் — கிரக-உடல் வரைபடம் & ஆரோக்கிய முன்னறிவிப்பு | Medical Astrology',
    te: 'వైద్య జ్యోతిష్యం — గ్రహ-శరీర మ్యాపింగ్ & ఆరోగ్య అంచనా | Medical Astrology',
    bn: 'চিকিৎসা জ্যোতিষ — গ্রহ-শরীর মানচিত্রণ ও স্বাস্থ্য ভবিষ্যদ্বাণী | Medical Astrology',
    gu: 'તબીબી જ્યોતિષ — ગ્રહ-શરીર મેપિંગ અને આરોગ્ય આગાહી | Medical Astrology',
    kn: 'ವೈದ್ಯಕೀಯ ಜ್ಯೋತಿಷ್ಯ — ಗ್ರಹ-ಶರೀರ ಮ್ಯಾಪಿಂಗ್ ಮತ್ತು ಆರೋಗ್ಯ ಭವಿಷ್ಯ | Medical Astrology',
  },
  '/learn/ayurveda-jyotish': {
    ta: 'ஆயுர்வேதம் & ஜோதிடம் — இரட்டை வேத அறிவியல்கள் | Ayurveda & Jyotish — Twin Vedic Sciences',
    te: 'ఆయుర్వేదం & జ్యోతిష్యం — జంట వేద శాస్త్రాలు | Ayurveda & Jyotish — Twin Vedic Sciences',
    bn: 'আয়ুর্বেদ ও জ্যোতিষ — জোড়া বৈদিক বিজ্ঞান | Ayurveda & Jyotish — Twin Vedic Sciences',
    gu: 'આયુર્વેદ અને જ્યોતિષ — જોડિયા વૈદિક વિજ્ઞાન | Ayurveda & Jyotish — Twin Vedic Sciences',
    kn: 'ಆಯುರ್ವೇದ ಮತ್ತು ಜ್ಯೋತಿಷ್ಯ — ಅವಳಿ ವೈದಿಕ ವಿಜ್ಞಾನಗಳು | Ayurveda & Jyotish — Twin Vedic Sciences',
  },
  '/learn/children': {
    ta: 'குழந்தைகள் முன்னறிவிப்பு — 5வது வீடு, D7 & கருவளம் பகுப்பாய்வு | Children Prediction Guide',
    te: 'పిల్లల అంచనా — 5వ ఇల్లు, D7 & సంతానోత్పత్తి విశ్లేషణ | Children Prediction Guide',
    bn: 'সন্তান ভবিষ্যদ্বাণী — ৫ম ঘর, D7 ও সন্তানদায়ক বিশ্লেষণ | Children Prediction Guide',
    gu: 'બાળકો આગાહી — 5મું ઘર, D7 અને પ્રજનન વિશ્લેષણ | Children Prediction Guide',
    kn: 'ಮಕ್ಕಳ ಭವಿಷ್ಯ — 5ನೇ ಮನೆ, D7 ಮತ್ತು ಸಂತಾನ ವಿಶ್ಲೇಷಣೆ | Children Prediction Guide',
  },
  '/learn/remedies': {
    ta: 'வேத பரிகாரங்கள் — ரத்தினங்கள், மந்திரங்கள், தானம் (9 கிரகங்களுக்கும்) | Vedic Remedies',
    te: 'వేద పరిహారాలు — రత్నాలు, మంత్రాలు, దానం (9 గ్రహాలకు) | Vedic Remedies',
    bn: 'বৈদিক প্রতিকার — রত্ন, মন্ত্র, দান (৯ গ্রহের জন্য) | Vedic Remedies',
    gu: 'વૈદિક ઉપાય — રત્નો, મંત્રો, દાન (9 ગ્રહો માટે) | Vedic Remedies',
    kn: 'ವೈದಿಕ ಪರಿಹಾರಗಳು — ರತ್ನಗಳು, ಮಂತ್ರಗಳು, ದಾನ (9 ಗ್ರಹಗಳಿಗೆ) | Vedic Remedies',
  },
};

const SCRIPT_LOCALES = ['ta', 'te', 'bn', 'gu', 'kn'] as const;

const project = new Project();
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

for (const [route, t] of Object.entries(TRANSLATIONS)) {
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
  if (!titleObj) {
    report.push(`[skip] route ${route} has non-object title initializer`);
    routesSkipped++;
    continue;
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
    if (cur === newVal) continue;
    lit.replaceWithText(JSON.stringify(newVal));
    routeChanges++;
    entriesUpdated++;
  }
  report.push(`[ok]   ${route} — ${routeChanges} locale${routeChanges === 1 ? '' : 's'}`);
}

if (APPLY) {
  src.saveSync();
  console.log(`\nApplied: ${entriesUpdated} title entries across ${Object.keys(TRANSLATIONS).length} routes (${routesSkipped} skipped).`);
} else {
  console.log(`\nDRY-RUN — pass --apply to write. Would update ${entriesUpdated} entries (${routesSkipped} routes skipped).`);
}
console.log();
for (const line of report) console.log(line);
