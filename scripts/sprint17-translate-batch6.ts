#!/usr/bin/env tsx
/**
 * Sprint 17 — translate batch 6: 18 learn-leaf routes whose
 * ta/te/bn/gu/kn titles were byte-identical to EN.
 *
 * Tamil quality lessons applied (cumulative from Sprint 12/13/14):
 *   - Dasha → தசா (not தசை = "muscle/flesh")
 *   - No Grantha letters when natural Tamil characters work
 *   - Idiomatic forms preferred
 */
import { Project, SyntaxKind } from 'ts-morph';

const APPLY = process.argv.includes('--apply');
const TARGET = 'src/lib/seo/metadata.ts';

interface RouteTitles {
  ta: string; te: string; bn: string; gu: string; kn: string;
}

const TRANSLATIONS: Record<string, RouteTitles> = {
  '/learn/retrograde-effects': {
    ta: 'வக்ர கிரகங்கள் — அனைத்து 5 கிரகங்களின் ஜாதக & கோசார விளைவுகள் | Retrograde Planets — Natal & Transit Effects',
    te: 'వక్ర గ్రహాలు — అన్ని 5 గ్రహాల జాతక & గోచార ప్రభావాలు | Retrograde Planets — Natal & Transit Effects',
    bn: 'বক্রী গ্রহ — সকল ৫টি গ্রহের জন্ম ও গোচর প্রভাব | Retrograde Planets — Natal & Transit Effects',
    gu: 'વક્રી ગ્રહો — તમામ 5 ગ્રહોના જન્મ અને ગોચર પ્રભાવો | Retrograde Planets — Natal & Transit Effects',
    kn: 'ವಕ್ರ ಗ್ರಹಗಳು — ಎಲ್ಲಾ 5 ಗ್ರಹಗಳ ಜನ್ಮ ಮತ್ತು ಗೋಚಾರ ಪರಿಣಾಮಗಳು | Retrograde Planets — Natal & Transit Effects',
  },
  '/learn/retrograde-visualizer': {
    ta: 'வக்ர இயக்க காட்சியாக்கி — ஊடாடும் அனிமேஷன் | Retrograde Motion Visualizer',
    te: 'వక్ర చలన దృశ్యీకరణ — ఇంటరాక్టివ్ యానిమేషన్ | Retrograde Motion Visualizer',
    bn: 'বক্রী গতির ভিজুয়ালাইজার — ইন্টারঅ্যাকটিভ অ্যানিমেশন | Retrograde Motion Visualizer',
    gu: 'વક્રી ગતિ વિઝ્યુલાઇઝર — ઇન્ટરેક્ટિવ એનિમેશન | Retrograde Motion Visualizer',
    kn: 'ವಕ್ರ ಚಲನೆಯ ದೃಶ್ಯೀಕರಣ — ಸಂವಾದಾತ್ಮಕ ಅನಿಮೇಷನ್ | Retrograde Motion Visualizer',
  },
  '/learn/yoga-animator': {
    ta: 'யோக உருவாக்க அனிமேட்டர் — ஜோதிட யோகங்கள் உருவாவதை பாருங்கள் | Yoga Formation Animator',
    te: 'యోగ ఏర్పాటు యానిమేటర్ — జ్యోతిష యోగాలు ఏర్పడటం చూడండి | Yoga Formation Animator',
    bn: 'যোগ গঠন অ্যানিমেটর — জ্যোতিষ যোগ গঠন দেখুন | Yoga Formation Animator',
    gu: 'યોગ રચના એનિમેટર — જ્યોતિષ યોગો રચાતા જુઓ | Yoga Formation Animator',
    kn: 'ಯೋಗ ರಚನೆ ಅನಿಮೇಟರ್ — ಜ್ಯೋತಿಷ ಯೋಗಗಳು ರೂಪುಗೊಳ್ಳುವುದನ್ನು ನೋಡಿ | Yoga Formation Animator',
  },
  '/learn/advanced-houses': {
    ta: 'MKS, பாதக, மாரக — மேம்பட்ட பாவ கருத்துக்கள் | MKS, Badhaka, Maraka — Advanced House Concepts',
    te: 'MKS, బాధక, మారక — అధునాతన భావ భావనలు | MKS, Badhaka, Maraka — Advanced House Concepts',
    bn: 'MKS, বাধক, মারক — উন্নত ভাব ধারণা | MKS, Badhaka, Maraka — Advanced House Concepts',
    gu: 'MKS, બાધક, મારક — અદ્યતન ભાવ ખ્યાલો | MKS, Badhaka, Maraka — Advanced House Concepts',
    kn: 'MKS, ಬಾಧಕ, ಮಾರಕ — ಉನ್ನತ ಭಾವ ಪರಿಕಲ್ಪನೆಗಳು | MKS, Badhaka, Maraka — Advanced House Concepts',
  },
  '/learn/bhava-chalit': {
    ta: 'பாவ சலித் — பாவ முறை விளக்கம் | Bhava Chalit — House System Explained',
    te: 'భావ చలిత్ — భావ వ్యవస్థ వివరణ | Bhava Chalit — House System Explained',
    bn: 'ভাব চলিত — ভাব ব্যবস্থা ব্যাখ্যা | Bhava Chalit — House System Explained',
    gu: 'ભાવ ચલિત — ભાવ સિસ્ટમ સમજાવી | Bhava Chalit — House System Explained',
    kn: 'ಭಾವ ಚಲಿತ್ — ಭಾವ ವ್ಯವಸ್ಥೆ ವಿವರಣೆ | Bhava Chalit — House System Explained',
  },
  '/learn/compatibility': {
    ta: 'மேம்பட்ட இணக்கம் — அஷ்ட கூட்டத்தைத் தாண்டி | Advanced Compatibility — Beyond Ashta Kuta',
    te: 'అధునాతన అనుకూలత — అష్ట కూటకు అతీతంగా | Advanced Compatibility — Beyond Ashta Kuta',
    bn: 'উন্নত সামঞ্জস্য — অষ্ট কূটের বাইরে | Advanced Compatibility — Beyond Ashta Kuta',
    gu: 'અદ્યતન સુસંગતતા — અષ્ટ કૂટની બહાર | Advanced Compatibility — Beyond Ashta Kuta',
    kn: 'ಉನ್ನತ ಹೊಂದಾಣಿಕೆ — ಅಷ್ಟ ಕೂಟವನ್ನು ಮೀರಿ | Advanced Compatibility — Beyond Ashta Kuta',
  },
  '/learn/combustion': {
    ta: 'அஸ்தம் — கிரகங்கள் சூரியனுக்கு மிக நெருங்கும்போது | Combustion (Asta) — Planets Close to Sun',
    te: 'అస్త (కంబస్షన్) — గ్రహాలు సూర్యునికి చాలా దగ్గరగా ఉన్నప్పుడు | Combustion (Asta) — Planets Close to Sun',
    bn: 'অস্ত (কম্বাশন) — গ্রহগুলো সূর্যের অত্যন্ত কাছাকাছি গেলে | Combustion (Asta) — Planets Close to Sun',
    gu: 'અસ્ત (કમ્બશન) — ગ્રહો સૂર્યની ખૂબ નજીક આવે ત્યારે | Combustion (Asta) — Planets Close to Sun',
    kn: 'ಅಸ್ತ (ಕಂಬಶನ್) — ಗ್ರಹಗಳು ಸೂರ್ಯನಿಗೆ ಬಹಳ ಹತ್ತಿರವಾದಾಗ | Combustion (Asta) — Planets Close to Sun',
  },
  '/learn/transit-guide': {
    ta: 'கோசார வழிகாட்டி — சனி, குரு, ராகு-கேது 12 பாவங்கள் வழியாக | Transit Guide — Saturn, Jupiter, Rahu-Ketu',
    te: 'గోచార మార్గదర్శకం — శని, గురు, రాహు-కేతు 12 భావాల ద్వారా | Transit Guide — Saturn, Jupiter, Rahu-Ketu',
    bn: 'গোচর গাইড — শনি, বৃহস্পতি, রাহু-কেতু ১২ ঘর জুড়ে | Transit Guide — Saturn, Jupiter, Rahu-Ketu',
    gu: 'ગોચર માર્ગદર્શિકા — શનિ, ગુરુ, રાહુ-કેતુ 12 ઘરો દ્વારા | Transit Guide — Saturn, Jupiter, Rahu-Ketu',
    kn: 'ಗೋಚಾರ ಮಾರ್ಗದರ್ಶಿ — ಶನಿ, ಗುರು, ರಾಹು-ಕೇತು 12 ಮನೆಗಳ ಮೂಲಕ | Transit Guide — Saturn, Jupiter, Rahu-Ketu',
  },
  '/learn/hora': {
    ta: 'ஹோரை — கிரக மணி நேரங்கள் & செயல்களுக்கு சிறந்த நேரம் | Hora — Planetary Hours',
    te: 'హోర — గ్రహ గంటలు & కార్యకలాపాలకు ఉత్తమ సమయాలు | Hora — Planetary Hours',
    bn: 'হোরা — গ্রহের ঘণ্টা ও কর্মের শ্রেষ্ঠ সময় | Hora — Planetary Hours',
    gu: 'હોરા — ગ્રહ કલાક & પ્રવૃત્તિઓ માટે શ્રેષ્ઠ સમય | Hora — Planetary Hours',
    kn: 'ಹೋರಾ — ಗ್ರಹ ಗಂಟೆಗಳು ಮತ್ತು ಚಟುವಟಿಕೆಗಳಿಗೆ ಉತ್ತಮ ಸಮಯ | Hora — Planetary Hours',
  },
  '/learn/planet-in-house': {
    ta: 'பாவத்தில் கிரகம் — 108 வேத ஜோதிட விளக்கங்கள் | Planet in House — 108 Interpretations',
    te: 'భావంలో గ్రహం — 108 వేద జ్యోతిష్య వ్యాఖ్యానాలు | Planet in House — 108 Interpretations',
    bn: 'ভাবে গ্রহ — ১০৮ বৈদিক জ্যোতিষ ব্যাখ্যা | Planet in House — 108 Interpretations',
    gu: 'ભાવમાં ગ્રહ — 108 વૈદિક જ્યોતિષ અર્થઘટન | Planet in House — 108 Interpretations',
    kn: 'ಭಾವದಲ್ಲಿ ಗ್ರಹ — 108 ವೈದಿಕ ಜ್ಯೋತಿಷ ವ್ಯಾಖ್ಯಾನಗಳು | Planet in House — 108 Interpretations',
  },
  '/learn/aspects': {
    ta: 'கிரக திருஷ்டிகள் (பார்வை) — காட்சி வழிகாட்டி | Planetary Aspects (Drishti) — Visual Guide',
    te: 'గ్రహ దృష్టులు — దృశ్య మార్గదర్శకం | Planetary Aspects (Drishti) — Visual Guide',
    bn: 'গ্রহের দৃষ্টি — চাক্ষুষ গাইড | Planetary Aspects (Drishti) — Visual Guide',
    gu: 'ગ્રહ દૃષ્ટિ — દૃશ્ય માર્ગદર્શિકા | Planetary Aspects (Drishti) — Visual Guide',
    kn: 'ಗ್ರಹ ದೃಷ್ಟಿಗಳು — ದೃಶ್ಯ ಮಾರ್ಗದರ್ಶಿ | Planetary Aspects (Drishti) — Visual Guide',
  },
  '/learn/planets': {
    ta: 'கிரக நிலைகள் — உங்கள் ஜாதகத்தை வாசிக்கவும் | Planetary Positions — Reading Your Birth Chart',
    te: 'గ్రహ స్థానాలు — మీ జాతక చార్ట్‌ను చదవడం | Planetary Positions — Reading Your Birth Chart',
    bn: 'গ্রহের অবস্থান — আপনার জন্ম কুণ্ডলী পঠন | Planetary Positions — Reading Your Birth Chart',
    gu: 'ગ્રહ સ્થાનો — તમારી જન્મ કુંડળી વાંચન | Planetary Positions — Reading Your Birth Chart',
    kn: 'ಗ್ರಹ ಸ್ಥಾನಗಳು — ನಿಮ್ಮ ಜನ್ಮ ಕುಂಡಲಿಯನ್ನು ಓದುವುದು | Planetary Positions — Reading Your Birth Chart',
  },
  '/learn/ashtakavarga': {
    ta: 'அஷ்டகவர்க்கம் — 8-மடங்கு பிந்து மதிப்பீட்டு முறை | Ashtakavarga — 8-Fold Bindu Scoring',
    te: 'అష్టకవర్గ — 8-రెట్లు బిందు స్కోరింగ్ వ్యవస్థ | Ashtakavarga — 8-Fold Bindu Scoring',
    bn: 'অষ্টকবর্গ — ৮-গুণ বিন্দু স্কোরিং পদ্ধতি | Ashtakavarga — 8-Fold Bindu Scoring',
    gu: 'અષ્ટકવર્ગ — 8-ગણી બિંદુ સ્કોરિંગ સિસ્ટમ | Ashtakavarga — 8-Fold Bindu Scoring',
    kn: 'ಅಷ್ಟಕವರ್ಗ — 8-ಪಟ್ಟು ಬಿಂದು ಸ್ಕೋರಿಂಗ್ ವ್ಯವಸ್ಥೆ | Ashtakavarga — 8-Fold Bindu Scoring',
  },
  '/learn/ashtakavarga-dasha': {
    ta: 'அஷ்டகவர்க்க தசா — பிந்து மதிப்பெண்களிலிருந்து நேர முன்னறிவிப்பு | Ashtakavarga Dasha — Timing Predictions',
    te: 'అష్టకవర్గ దశ — బిందు స్కోర్‌ల నుండి సమయ అంచనా | Ashtakavarga Dasha — Timing Predictions',
    bn: 'অষ্টকবর্গ দশা — বিন্দু স্কোর থেকে সময় ভবিষ্যদ্বাণী | Ashtakavarga Dasha — Timing Predictions',
    gu: 'અષ્ટકવર્ગ દશા — બિંદુ સ્કોરથી સમય આગાહી | Ashtakavarga Dasha — Timing Predictions',
    kn: 'ಅಷ್ಟಕವರ್ಗ ದಶೆ — ಬಿಂದು ಸ್ಕೋರ್‌ಗಳಿಂದ ಸಮಯದ ಭವಿಷ್ಯ | Ashtakavarga Dasha — Timing Predictions',
  },
  '/learn/shadbala': {
    ta: 'ஷட்பலம் — ஆறு-மடங்கு கிரக பலம் | Shadbala — Six-Fold Planetary Strength',
    te: 'షడ్బలం — ఆరు-రెట్లు గ్రహ బలం | Shadbala — Six-Fold Planetary Strength',
    bn: 'ষড়বল — ছয়-গুণ গ্রহ শক্তি | Shadbala — Six-Fold Planetary Strength',
    gu: 'ષડ્બલ — છ-ગણી ગ્રહ શક્તિ | Shadbala — Six-Fold Planetary Strength',
    kn: 'ಷಡ್ಬಲ — ಆರು-ಪಟ್ಟು ಗ್ರಹ ಶಕ್ತಿ | Shadbala — Six-Fold Planetary Strength',
  },
  '/learn/bhavabala': {
    ta: 'பாவபலம் — பாவ பல பகுப்பாய்வு | Bhavabala — House Strength Analysis',
    te: 'భావబలం — భావ బల విశ్లేషణ | Bhavabala — House Strength Analysis',
    bn: 'ভাবাবল — ভাব শক্তি বিশ্লেষণ | Bhavabala — House Strength Analysis',
    gu: 'ભાવબલ — ભાવ શક્તિ વિશ્લેષણ | Bhavabala — House Strength Analysis',
    kn: 'ಭಾವಬಲ — ಭಾವ ಶಕ್ತಿ ವಿಶ್ಲೇಷಣೆ | Bhavabala — House Strength Analysis',
  },
  '/learn/avasthas': {
    ta: 'அவஸ்தைகள் — கிரக நிலைகள் & மனநிலைகள் | Avasthas — Planetary States & Moods',
    te: 'అవస్థలు — గ్రహ స్థితులు & భావాలు | Avasthas — Planetary States & Moods',
    bn: 'অবস্থা — গ্রহের অবস্থা ও মেজাজ | Avasthas — Planetary States & Moods',
    gu: 'અવસ્થાઓ — ગ્રહ સ્થિતિ અને મૂડ | Avasthas — Planetary States & Moods',
    kn: 'ಅವಸ್ಥೆಗಳು — ಗ್ರಹಗಳ ಸ್ಥಿತಿಗಳು ಮತ್ತು ಮನಸ್ಥಿತಿ | Avasthas — Planetary States & Moods',
  },
  '/learn/dasha-sandhi': {
    ta: 'தசா சந்தி — கிரக தசாக்களுக்கு இடையில் சந்திப்பு காலங்கள் | Dasha Sandhi — Junction Periods',
    te: 'దశ సంధి — గ్రహ దశల మధ్య సంధి కాలాలు | Dasha Sandhi — Junction Periods',
    bn: 'দশা সন্ধি — গ্রহ দশাগুলির মধ্যে সন্ধি কাল | Dasha Sandhi — Junction Periods',
    gu: 'દશા સંધિ — ગ્રહ દશાઓ વચ્ચે સંધિ સમય | Dasha Sandhi — Junction Periods',
    kn: 'ದಶಾ ಸಂಧಿ — ಗ್ರಹ ದಶೆಗಳ ನಡುವಿನ ಸಂಧಿ ಕಾಲಗಳು | Dasha Sandhi — Junction Periods',
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
    report.push(`[skip] route ${route} has non-object title initializer`); routesSkipped++; continue;
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
