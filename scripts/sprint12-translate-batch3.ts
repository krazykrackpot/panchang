#!/usr/bin/env tsx
/**
 * Sprint 12 — translate batch 3: 17 tool/calculator routes whose
 * ta/te/bn/gu/kn titles were byte-identical to EN.
 *
 * Same idempotent ts-morph pattern as Sprints 9 and 11.
 * Single-file AST manipulation only — no tsconfig load (Gemini #208).
 */
import { Project, SyntaxKind } from 'ts-morph';

const APPLY = process.argv.includes('--apply');
const TARGET = 'src/lib/seo/metadata.ts';

interface RouteTitles {
  ta: string; te: string; bn: string; gu: string; kn: string;
}

const TRANSLATIONS: Record<string, RouteTitles> = {
  '/nadi-jyotish': {
    ta: 'நாடி ஜோதிடம் — பிருகு நந்தி நாடி கிரக வாசிப்பு | Nadi Jyotish — Bhrigu Nandi Nadi',
    te: 'నాడీ జ్యోతిష్యం — భృగు నంది నాడీ గ్రహ పఠనం | Nadi Jyotish — Bhrigu Nandi Nadi',
    bn: 'নাড়ী জ্যোতিষ — ভৃগু নন্দী নাড়ী গ্রহ পাঠ | Nadi Jyotish — Bhrigu Nandi Nadi',
    gu: 'નાડી જ્યોતિષ — ભૃગુ નંદી નાડી ગ્રહ વાચન | Nadi Jyotish — Bhrigu Nandi Nadi',
    kn: 'ನಾಡೀ ಜ್ಯೋತಿಷ್ಯ — ಭೃಗು ನಂದಿ ನಾಡೀ ಗ್ರಹ ಪಠನ | Nadi Jyotish — Bhrigu Nandi Nadi',
  },
  '/tithi-pravesha': {
    ta: 'திதி பிரவேஶ — வேத பிறந்தநாள் கால்குலேட்டர் | Tithi Pravesha — Vedic Birthday',
    te: 'తిథి ప్రవేశ — వేద జన్మదిన కాలిక్యులేటర్ | Tithi Pravesha — Vedic Birthday',
    bn: 'তিথি প্রবেশ — বৈদিক জন্মদিন ক্যালকুলেটর | Tithi Pravesha — Vedic Birthday',
    gu: 'તિથિ પ્રવેશ — વૈદિક જન્મદિવસ કેલ્ક્યુલેટર | Tithi Pravesha — Vedic Birthday',
    kn: 'ತಿಥಿ ಪ್ರವೇಶ — ವೈದಿಕ ಜನ್ಮದಿನ ಕ್ಯಾಲ್ಕುಲೇಟರ್ | Tithi Pravesha — Vedic Birthday',
  },
  '/cosmic-blueprint': {
    ta: 'காஸ்மிக் ப்ளூப்ரிண்ட் — உங்களின் வேத ஆளுமை வரைபடம் | Cosmic Blueprint — Vedic Personality',
    te: 'కాస్మిక్ బ్లూప్రింట్ — మీ వేద వ్యక్తిత్వ ప్రొఫైల్ | Cosmic Blueprint — Vedic Personality',
    bn: 'কসমিক ব্লুপ্রিন্ট — আপনার বৈদিক ব্যক্তিত্ব প্রোফাইল | Cosmic Blueprint — Vedic Personality',
    gu: 'કોસ્મિક બ્લુપ્રિન્ટ — તમારી વૈદિક વ્યક્તિત્વ રૂપરેખા | Cosmic Blueprint — Vedic Personality',
    kn: 'ಕಾಸ್ಮಿಕ್ ಬ್ಲೂಪ್ರಿಂಟ್ — ನಿಮ್ಮ ವೈದಿಕ ವ್ಯಕ್ತಿತ್ವ ಪ್ರೊಫೈಲ್ | Cosmic Blueprint — Vedic Personality',
  },
  '/rituals': {
    ta: 'இந்து சடங்குகள் & பூஜை விதி — படிப்படியான வழிகாட்டிகள் | Hindu Rituals & Puja Vidhi',
    te: 'హిందూ ఆచారాలు & పూజా విధి — దశల వారీ మార్గదర్శకాలు | Hindu Rituals & Puja Vidhi',
    bn: 'হিন্দু আচার ও পূজা বিধি — ধাপে ধাপে গাইড | Hindu Rituals & Puja Vidhi',
    gu: 'હિન્દુ વિધિઓ અને પૂજા વિધિ — પગલા-દર-પગલા માર્ગદર્શિકા | Hindu Rituals & Puja Vidhi',
    kn: 'ಹಿಂದೂ ಆಚರಣೆಗಳು ಮತ್ತು ಪೂಜಾ ವಿಧಿ — ಹಂತ-ಹಂತದ ಮಾರ್ಗದರ್ಶಿಗಳು | Hindu Rituals & Puja Vidhi',
  },
  '/lunar-calendar': {
    ta: 'சந்திர வாழ்க்கை கேலண்டர் — சந்திர கட்ட ஆற்றல் வழிகாட்டி | Lunar Lifestyle Calendar',
    te: 'చాంద్ర జీవనశైలి క్యాలెండర్ — చంద్ర దశ శక్తి మార్గదర్శకం | Lunar Lifestyle Calendar',
    bn: 'চান্দ্র জীবনধারা ক্যালেন্ডার — চাঁদের দশা শক্তি গাইড | Lunar Lifestyle Calendar',
    gu: 'ચાંદ્ર જીવનશૈલી કેલેન્ડર — ચંદ્ર કળા ઊર્જા માર્ગદર્શિકા | Lunar Lifestyle Calendar',
    kn: 'ಚಾಂದ್ರ ಜೀವನಶೈಲಿ ಕ್ಯಾಲೆಂಡರ್ — ಚಂದ್ರ ಕಲಾ ಶಕ್ತಿ ಮಾರ್ಗದರ್ಶಿ | Lunar Lifestyle Calendar',
  },
  '/puja': {
    ta: 'பூஜை விதி — படிப்படியான இந்து வழிபாட்டு வழிகாட்டிகள் | Puja Vidhi — Hindu Worship Guides',
    te: 'పూజా విధి — దశల వారీ హిందూ పూజా మార్గదర్శకాలు | Puja Vidhi — Hindu Worship Guides',
    bn: 'পূজা বিধি — ধাপে ধাপে হিন্দু পূজা গাইড | Puja Vidhi — Hindu Worship Guides',
    gu: 'પૂજા વિધિ — પગલા-દર-પગલા હિન્દુ પૂજા માર્ગદર્શિકા | Puja Vidhi — Hindu Worship Guides',
    kn: 'ಪೂಜಾ ವಿಧಿ — ಹಂತ-ಹಂತದ ಹಿಂದೂ ಪೂಜಾ ಮಾರ್ಗದರ್ಶಿಗಳು | Puja Vidhi — Hindu Worship Guides',
  },
  '/prashna-ashtamangala': {
    ta: 'அஷ்டமங்கல ப்ரஷ்ன — கேரள ஹோரரி கணிப்பு | Ashtamangala Prashna — Kerala Horary',
    te: 'అష్టమంగళ ప్రశ్న — కేరళ హోరరీ జ్యోతిష్యం | Ashtamangala Prashna — Kerala Horary',
    bn: 'অষ্টমঙ্গল প্রশ্ন — কেরালা হোরারি দৈবজ্ঞ | Ashtamangala Prashna — Kerala Horary',
    gu: 'અષ્ટમંગળ પ્રશ્ન — કેરળ હોરરી જ્યોતિષ | Ashtamangala Prashna — Kerala Horary',
    kn: 'ಅಷ್ಟಮಂಗಳ ಪ್ರಶ್ನೆ — ಕೇರಳ ಹೋರರಿ ಜ್ಯೋತಿಷ್ಯ | Ashtamangala Prashna — Kerala Horary',
  },
  '/tarabalam': {
    ta: 'இன்றைய தாராபலம் — அனைத்து 27 நட்சத்திரங்களின் நட்சத்திர பலம் | Tarabalam — Star Strength',
    te: 'నేటి తారాబలం — అన్ని 27 నక్షత్రాల నక్షత్ర బలం | Tarabalam — Star Strength',
    bn: 'আজকের তারাবলম — সকল ২৭টি নক্ষত্রের তারা শক্তি | Tarabalam — Star Strength',
    gu: 'આજનું તારાબલમ — તમામ 27 નક્ષત્રોની તારા શક્તિ | Tarabalam — Star Strength',
    kn: 'ಇಂದಿನ ತಾರಾಬಲಂ — ಎಲ್ಲಾ 27 ನಕ್ಷತ್ರಗಳ ತಾರಾ ಶಕ್ತಿ | Tarabalam — Star Strength',
  },
  '/chandra-darshan': {
    ta: 'இன்றைய சந்திர தரிசனம் — சந்திரன் காண்பித்தல் கால்குலேட்டர் | Chandra Darshan — Moon Sighting',
    te: 'నేటి చంద్ర దర్శనం — చంద్ర దర్శన కాలిక్యులేటర్ | Chandra Darshan — Moon Sighting',
    bn: 'আজকের চন্দ্র দর্শন — চাঁদ দেখা ক্যালকুলেটর | Chandra Darshan — Moon Sighting',
    gu: 'આજનું ચંદ્ર દર્શન — ચંદ્ર દર્શન કેલ્ક્યુલેટર | Chandra Darshan — Moon Sighting',
    kn: 'ಇಂದಿನ ಚಂದ್ರ ದರ್ಶನ — ಚಂದ್ರ ದರ್ಶನ ಕ್ಯಾಲ್ಕುಲೇಟರ್ | Chandra Darshan — Moon Sighting',
  },
  '/kaal-nirnaya': {
    ta: 'கால நிர்ணய — இந்து கால அளவீடு | Kaal Nirnaya — Hindu Time Reckoning',
    te: 'కాల నిర్ణయ — హిందూ కాల గణన | Kaal Nirnaya — Hindu Time Reckoning',
    bn: 'কাল নির্ণয় — হিন্দু কাল গণনা | Kaal Nirnaya — Hindu Time Reckoning',
    gu: 'કાળ નિર્ણય — હિન્દુ કાળ ગણના | Kaal Nirnaya — Hindu Time Reckoning',
    kn: 'ಕಾಲ ನಿರ್ಣಯ — ಹಿಂದೂ ಕಾಲ ಗಣನೆ | Kaal Nirnaya — Hindu Time Reckoning',
  },
  '/nivas-shool': {
    ta: 'நிவாஸ ஶூல — திசை குறை கால்குலேட்டர் | Nivas Shool — Directional Defect',
    te: 'నివాస శూల — దిశా దోష కాలిక్యులేటర్ | Nivas Shool — Directional Defect',
    bn: 'নিবাস শূল — দিকনির্দেশনা দোষ ক্যালকুলেটর | Nivas Shool — Directional Defect',
    gu: 'નિવાસ શૂલ — દિશા દોષ કેલ્ક્યુલેટર | Nivas Shool — Directional Defect',
    kn: 'ನಿವಾಸ ಶೂಲ — ದಿಶಾ ದೋಷ ಕ್ಯಾಲ್ಕುಲೇಟರ್ | Nivas Shool — Directional Defect',
  },
  '/sky': {
    ta: 'லைவ் வான வரைபடம் — இன்றைய நிராயன கிரக நிலைகள் | Live Sky Map — Sidereal Positions',
    te: 'లైవ్ ఆకాశ పటం — నేటి నిరయన గ్రహ స్థానాలు | Live Sky Map — Sidereal Positions',
    bn: 'লাইভ আকাশ মানচিত্র — আজকের নিরয়ন গ্রহ অবস্থান | Live Sky Map — Sidereal Positions',
    gu: 'લાઇવ આકાશ નકશો — આજની નિરયન ગ્રહ સ્થિતિ | Live Sky Map — Sidereal Positions',
    kn: 'ಲೈವ್ ಆಕಾಶ ನಕ್ಷೆ — ಇಂದಿನ ನಿರಯನ ಗ್ರಹ ಸ್ಥಾನಗಳು | Live Sky Map — Sidereal Positions',
  },
  '/chandrabalam': {
    ta: 'இன்றைய சந்திரபலம் — அனைத்து 12 ராசிகளுக்கு சந்திர பலம் | Chandrabalam — Moon Strength',
    te: 'నేటి చంద్రబలం — అన్ని 12 రాశులకు చంద్ర బలం | Chandrabalam — Moon Strength',
    bn: 'আজকের চন্দ্রবলম — সকল ১২টি রাশির চাঁদ শক্তি | Chandrabalam — Moon Strength',
    gu: 'આજનું ચંદ્રબલમ — તમામ 12 રાશિઓ માટે ચંદ્ર શક્તિ | Chandrabalam — Moon Strength',
    kn: 'ಇಂದಿನ ಚಂದ್ರಬಲಂ — ಎಲ್ಲಾ 12 ರಾಶಿಗಳ ಚಂದ್ರ ಶಕ್ತಿ | Chandrabalam — Moon Strength',
  },
  '/muhurta/vehicle-purchase': {
    ta: 'வாகனம் வாங்குவதற்கான முகூர்த்தம் 2026 | Vehicle Purchase Muhurat 2026',
    te: 'వాహన కొనుగోలు ముహూర్తం 2026 | Vehicle Purchase Muhurat 2026',
    bn: 'যানবাহন ক্রয়ের মুহূর্ত ২০২৬ | Vehicle Purchase Muhurat 2026',
    gu: 'વાહન ખરીદી મુહૂર્ત 2026 | Vehicle Purchase Muhurat 2026',
    kn: 'ವಾಹನ ಖರೀದಿ ಮುಹೂರ್ತ 2026 | Vehicle Purchase Muhurat 2026',
  },
  '/muhurta/business-start': {
    ta: 'வணிக தொடக்க முகூர்த்தம் 2026 | Business Start Muhurat 2026',
    te: 'వ్యాపార ప్రారంభ ముహూర్తం 2026 | Business Start Muhurat 2026',
    bn: 'ব্যবসা শুরুর মুহূর্ত ২০২৬ | Business Start Muhurat 2026',
    gu: 'વ્યવસાય શરૂ કરવાનું મુહૂર્ત 2026 | Business Start Muhurat 2026',
    kn: 'ವ್ಯಾಪಾರ ಪ್ರಾರಂಭ ಮುಹೂರ್ತ 2026 | Business Start Muhurat 2026',
  },
  '/sade-sati': {
    ta: 'ஏழரை சனி கால்குலேட்டர் — சனி கோசார பகுப்பாய்வு | Sade Sati Calculator — Saturn Transit',
    te: 'సాడే సాతి కాలిక్యులేటర్ — శని గోచర విశ్లేషణ | Sade Sati Calculator — Saturn Transit',
    bn: 'সাড়ে সাতি ক্যালকুলেটর — শনির গোচর বিশ্লেষণ | Sade Sati Calculator — Saturn Transit',
    gu: 'સાડે સાતી કેલ્ક્યુલેટર — શનિ ગોચર વિશ્લેષણ | Sade Sati Calculator — Saturn Transit',
    kn: 'ಸಾಡೆ ಸಾತಿ ಕ್ಯಾಲ್ಕುಲೇಟರ್ — ಶನಿ ಗೋಚಾರ ವಿಶ್ಲೇಷಣೆ | Sade Sati Calculator — Saturn Transit',
  },
  '/vrat-calendar': {
    ta: 'விரத காலண்டர் — உங்கள் விரதங்களை பின்பற்றி கண்காணிக்கவும் | Vrat Calendar — Track Your Vrats',
    te: 'వ్రత క్యాలెండర్ — మీ వ్రతాలను అనుసరించి ట్రాక్ చేయండి | Vrat Calendar — Track Your Vrats',
    bn: 'ব্রত ক্যালেন্ডার — আপনার ব্রত অনুসরণ ও ট্র্যাক করুন | Vrat Calendar — Track Your Vrats',
    gu: 'વ્રત કેલેન્ડર — તમારા વ્રતો અનુસરો અને ટ્રેક કરો | Vrat Calendar — Track Your Vrats',
    kn: 'ವ್ರತ ಕ್ಯಾಲೆಂಡರ್ — ನಿಮ್ಮ ವ್ರತಗಳನ್ನು ಅನುಸರಿಸಿ ಮತ್ತು ಟ್ರ್ಯಾಕ್ ಮಾಡಿ | Vrat Calendar — Track Your Vrats',
  },
};

const SCRIPT_LOCALES = ['ta', 'te', 'bn', 'gu', 'kn'] as const;

// No tsconfig load — single-file AST manipulation only. Gemini #208 lesson.
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
  if (!titleObj) continue;

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
