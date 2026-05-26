#!/usr/bin/env tsx
/**
 * Sprint 13 — translate batch 4: 19 muhurta / panchang sub-pages /
 * regional / pricing routes whose ta/te/bn/gu/kn titles were
 * byte-identical to EN.
 *
 * Same idempotent ts-morph pattern as Sprint 11/12. Single-file AST
 * manipulation; no tsconfig load (Sprint 11 Gemini lesson).
 *
 * Tamil translations follow the Sprint 12 lessons:
 *   - Use idiomatic Tamil where one exists (கிரகணம் not க்ரஹண்);
 *   - Avoid unnecessary Grantha letters (ஸ, ஶ) when natural Tamil
 *     characters work;
 *   - Use natural consonant clusters (வி-ர not வ்-ர).
 */
import { Project, SyntaxKind } from 'ts-morph';

const APPLY = process.argv.includes('--apply');
const TARGET = 'src/lib/seo/metadata.ts';

interface RouteTitles {
  ta: string; te: string; bn: string; gu: string; kn: string;
}

const TRANSLATIONS: Record<string, RouteTitles> = {
  '/muhurta/naming-ceremony': {
    ta: 'பெயரிடு விழா முகூர்த்தம் 2026 | Naming Ceremony Muhurat 2026',
    te: 'నామకరణ ముహూర్తం 2026 | Naming Ceremony Muhurat 2026',
    bn: 'নামকরণ মুহূর্ত ২০২৬ | Naming Ceremony Muhurat 2026',
    gu: 'નામકરણ મુહૂર્ત 2026 | Naming Ceremony Muhurat 2026',
    kn: 'ನಾಮಕರಣ ಮುಹೂರ್ತ 2026 | Naming Ceremony Muhurat 2026',
  },
  '/muhurta/property-purchase': {
    ta: 'சொத்து வாங்கும் முகூர்த்தம் 2026 | Property Purchase Muhurat 2026',
    te: 'ఆస్తి కొనుగోలు ముహూర్తం 2026 | Property Purchase Muhurat 2026',
    bn: 'সম্পত্তি ক্রয়ের মুহূর্ত ২০২৬ | Property Purchase Muhurat 2026',
    gu: 'મિલકત ખરીદી મુહૂર્ત 2026 | Property Purchase Muhurat 2026',
    kn: 'ಆಸ್ತಿ ಖರೀದಿ ಮುಹೂರ್ತ 2026 | Property Purchase Muhurat 2026',
  },
  '/muhurta/mundan': {
    ta: 'முண்டன் முகூர்த்தம் 2026 | Mundan Muhurat 2026',
    te: 'ముండన ముహూర్తం 2026 | Mundan Muhurat 2026',
    bn: 'মুণ্ডন মুহূর্ত ২০২৬ | Mundan Muhurat 2026',
    gu: 'મુંડન મુહૂર્ત 2026 | Mundan Muhurat 2026',
    kn: 'ಮುಂಡನ ಮುಹೂರ್ತ 2026 | Mundan Muhurat 2026',
  },
  '/muhurta/annaprashan': {
    ta: 'அன்னபிராசன முகூர்த்தம் 2026 | Annaprashan Muhurat 2026',
    te: 'అన్నప్రాశన ముహూర్తం 2026 | Annaprashan Muhurat 2026',
    bn: 'অন্নপ্রাশন মুহূর্ত ২০২৬ | Annaprashan Muhurat 2026',
    gu: 'અન્નપ્રાશન મુહૂર્ત 2026 | Annaprashan Muhurat 2026',
    kn: 'ಅನ್ನಪ್ರಾಶನ ಮುಹೂರ್ತ 2026 | Annaprashan Muhurat 2026',
  },
  '/muhurta/upanayana': {
    ta: 'உபநயன முகூர்த்தம் 2026 | Upanayana Muhurat 2026',
    te: 'ఉపనయన ముహూర్తం 2026 | Upanayana Muhurat 2026',
    bn: 'উপনয়ন মুহূর্ত ২০২৬ | Upanayana Muhurat 2026',
    gu: 'ઉપનયન મુહૂર્ત 2026 | Upanayana Muhurat 2026',
    kn: 'ಉಪನಯನ ಮುಹೂರ್ತ 2026 | Upanayana Muhurat 2026',
  },
  '/muhurta/travel': {
    ta: 'பயண முகூர்த்தம் 2026 | Travel Muhurat 2026',
    te: 'ప్రయాణ ముహూర్తం 2026 | Travel Muhurat 2026',
    bn: 'ভ্রমণ মুহূর্ত ২০২৬ | Travel Muhurat 2026',
    gu: 'પ્રવાસ મુહૂર્ત 2026 | Travel Muhurat 2026',
    kn: 'ಪ್ರಯಾಣ ಮುಹೂರ್ತ 2026 | Travel Muhurat 2026',
  },
  '/panchang/yoga': {
    ta: '27 யோகங்கள் — பஞ்சாங்கத்தில் சூரிய-சந்திர சேர்க்கைகள் | 27 Yogas in Panchang',
    te: '27 యోగాలు — పంచాంగంలో సూర్య-చంద్ర సంయోగాలు | 27 Yogas in Panchang',
    bn: '২৭টি যোগ — পঞ্চাঙ্গে সূর্য-চাঁদ সমন্বয় | 27 Yogas in Panchang',
    gu: '27 યોગ — પંચાંગમાં સૂર્ય-ચંદ્ર સંયોગ | 27 Yogas in Panchang',
    kn: '27 ಯೋಗಗಳು — ಪಂಚಾಂಗದಲ್ಲಿ ಸೂರ್ಯ-ಚಂದ್ರ ಸಂಯೋಗಗಳು | 27 Yogas in Panchang',
  },
  '/panchang/karana': {
    ta: '11 கரணங்கள் — வேத கேலண்டரில் அரை-திதிகள் | 11 Karanas in Vedic Calendar',
    te: '11 కరణాలు — వేద క్యాలెండర్‌లో అర్ధ-తిథులు | 11 Karanas in Vedic Calendar',
    bn: '১১টি করণ — বৈদিক ক্যালেন্ডারে অর্ধ-তিথি | 11 Karanas in Vedic Calendar',
    gu: '11 કરણ — વૈદિક કેલેન્ડરમાં અર્ધ-તિથિ | 11 Karanas in Vedic Calendar',
    kn: '11 ಕರಣಗಳು — ವೈದಿಕ ಕ್ಯಾಲೆಂಡರ್‌ನಲ್ಲಿ ಅರ್ಧ-ತಿಥಿಗಳು | 11 Karanas in Vedic Calendar',
  },
  '/panchang/grahan': {
    // Tamil: use idiomatic கிரகணம் (eclipse), not Grantha க்ரஹண். Sprint 12 lesson.
    ta: 'கிரகணம் — இந்து வானியலில் கிரகணங்கள் | Grahan — Eclipses in Hindu Astronomy',
    te: 'గ్రహణ — హిందూ ఖగోళశాస్త్రంలో గ్రహణాలు | Grahan — Eclipses in Hindu Astronomy',
    bn: 'গ্রহণ — হিন্দু খগোলশাস্ত্রে গ্রহণ | Grahan — Eclipses in Hindu Astronomy',
    gu: 'ગ્રહણ — હિન્દુ ખગોળશાસ્ત્રમાં ગ્રહણ | Grahan — Eclipses in Hindu Astronomy',
    kn: 'ಗ್ರಹಣ — ಹಿಂದೂ ಖಗೋಳಶಾಸ್ತ್ರದಲ್ಲಿ ಗ್ರಹಣಗಳು | Grahan — Eclipses in Hindu Astronomy',
  },
  '/panchang/rashi': {
    ta: '12 ராசிகள் — வேத ராசிமண்டலம் | 12 Rashis — Vedic Zodiac',
    te: '12 రాశులు — వేద రాశి చక్రం | 12 Rashis — Vedic Zodiac',
    bn: '১২টি রাশি — বৈদিক রাশিচক্র | 12 Rashis — Vedic Zodiac',
    gu: '12 રાશિઓ — વૈદિક રાશિચક્ર | 12 Rashis — Vedic Zodiac',
    kn: '12 ರಾಶಿಗಳು — ವೈದಿಕ ರಾಶಿಚಕ್ರ | 12 Rashis — Vedic Zodiac',
  },
  '/panchang/masa': {
    ta: 'இந்து மாதங்கள் (மாசம்) — சந்திர கேலண்டர் முறை | Hindu Months — Lunar Calendar',
    te: 'హిందూ మాసాలు (మాస) — చాంద్ర క్యాలెండర్ వ్యవస్థ | Hindu Months — Lunar Calendar',
    bn: 'হিন্দু মাস (মাসা) — চান্দ্র ক্যালেন্ডার ব্যবস্থা | Hindu Months — Lunar Calendar',
    gu: 'હિન્દુ માસ (માસા) — ચાંદ્ર કેલેન્ડર પ્રણાલી | Hindu Months — Lunar Calendar',
    kn: 'ಹಿಂದೂ ಮಾಸಗಳು (ಮಾಸ) — ಚಾಂದ್ರ ಕ್ಯಾಲೆಂಡರ್ ವ್ಯವಸ್ಥೆ | Hindu Months — Lunar Calendar',
  },
  '/panchang/samvatsara': {
    ta: '60 சம்வத்சரங்கள் — வேத கேலண்டரில் குரு சுழற்சி | 60 Samvatsaras — Jupiter Cycle',
    te: '60 సంవత్సరాలు — వేద క్యాలెండర్‌లో గురు చక్రం | 60 Samvatsaras — Jupiter Cycle',
    bn: '৬০টি সংবৎসর — বৈদিক ক্যালেন্ডারে বৃহস্পতি চক্র | 60 Samvatsaras — Jupiter Cycle',
    gu: '60 સંવત્સર — વૈદિક કેલેન્ડરમાં ગુરુ ચક્ર | 60 Samvatsaras — Jupiter Cycle',
    kn: '60 ಸಂವತ್ಸರಗಳು — ವೈದಿಕ ಕ್ಯಾಲೆಂಡರ್‌ನಲ್ಲಿ ಗುರು ಚಕ್ರ | 60 Samvatsaras — Jupiter Cycle',
  },
  '/panchang/muhurta': {
    ta: '30 முகூர்த்தங்கள் — இந்து நாளில் காலப் பிரிவுகள் | 30 Muhurtas in Hindu Day',
    te: '30 ముహూర్తాలు — హిందూ దినంలో కాల విభాగాలు | 30 Muhurtas in Hindu Day',
    bn: '৩০টি মুহূর্ত — হিন্দু দিনে কাল বিভাজন | 30 Muhurtas in Hindu Day',
    gu: '30 મુહૂર્ત — હિન્દુ દિવસમાં કાળ વિભાગ | 30 Muhurtas in Hindu Day',
    kn: '30 ಮುಹೂರ್ತಗಳು — ಹಿಂದೂ ದಿನದಲ್ಲಿ ಕಾಲ ವಿಭಾಗಗಳು | 30 Muhurtas in Hindu Day',
  },
  '/panchang/nivas': {
    // Tamil: avoid Grantha ஸ / ஶ — use நிவாச / சூலம் natural transliteration.
    ta: 'நிவாச சூலம் — இன்றைய திசை மற்றும் தத்துவ ஆற்றல்கள் | Nivas & Shool — Directional Energies',
    te: 'నివాస & శూల — నేటి దిశా మరియు తత్త్వ శక్తులు | Nivas & Shool — Directional Energies',
    bn: 'নিবাস ও শূল — আজকের দিকনির্দেশনা ও তত্ত্ব শক্তি | Nivas & Shool — Directional Energies',
    gu: 'નિવાસ અને શૂલ — આજની દિશા અને તત્ત્વ ઊર્જા | Nivas & Shool — Directional Energies',
    kn: 'ನಿವಾಸ ಮತ್ತು ಶೂಲ — ಇಂದಿನ ದಿಶಾ ಮತ್ತು ತತ್ತ್ವ ಶಕ್ತಿಗಳು | Nivas & Shool — Directional Energies',
  },
  '/panchang/planets': {
    ta: 'இன்றைய கிரக நிலைகள் — ராசிகள் மற்றும் நட்சத்திரங்களில் நவகிரகம் | Planetary Positions Today',
    te: 'నేటి గ్రహ స్థానాలు — రాశులు మరియు నక్షత్రాలలో నవగ్రహ | Planetary Positions Today',
    bn: 'আজকের গ্রহ অবস্থান — রাশি ও নক্ষত্রে নবগ্রহ | Planetary Positions Today',
    gu: 'આજની ગ્રહ સ્થિતિ — રાશિઓ અને નક્ષત્રોમાં નવગ્રહ | Planetary Positions Today',
    kn: 'ಇಂದಿನ ಗ್ರಹ ಸ್ಥಾನಗಳು — ರಾಶಿಗಳು ಮತ್ತು ನಕ್ಷತ್ರಗಳಲ್ಲಿ ನವಗ್ರಹ | Planetary Positions Today',
  },
  '/panchang/remedies': {
    ta: 'இன்றைய வேத பரிகாரங்கள் — மந்திரங்கள், தானம், ரத்தினங்கள் | Today\'s Vedic Remedies',
    te: 'నేటి వేద పరిహారాలు — మంత్రాలు, దానం, రత్నాలు | Today\'s Vedic Remedies',
    bn: 'আজকের বৈদিক প্রতিকার — মন্ত্র, দান, রত্ন | Today\'s Vedic Remedies',
    gu: 'આજના વૈદિક ઉપાય — મંત્ર, દાન, રત્ન | Today\'s Vedic Remedies',
    kn: 'ಇಂದಿನ ವೈದಿಕ ಪರಿಹಾರಗಳು — ಮಂತ್ರ, ದಾನ, ರತ್ನ | Today\'s Vedic Remedies',
  },
  '/panchang/yearly': {
    ta: 'ஆண்டுக் கணக்கான பஞ்சாங்கம் — மாதம் வாரியான தோற்றம் | Yearly Panchang — Month by Month',
    te: 'వార్షిక పంచాంగం — నెల వారీ వీక్షణ | Yearly Panchang — Month by Month',
    bn: 'বার্ষিক পঞ্চাঙ্গ — মাসিক দৃশ্য | Yearly Panchang — Month by Month',
    gu: 'વાર્ષિક પંચાંગ — મહિના પ્રમાણે દૃશ્ય | Yearly Panchang — Month by Month',
    kn: 'ವಾರ್ಷಿಕ ಪಂಚಾಂಗ — ತಿಂಗಳ ಪ್ರಕಾರ ನೋಟ | Yearly Panchang — Month by Month',
  },
  '/regional': {
    ta: 'பிராந்திய இந்து கேலண்டர்கள் — தமிழ், தெலுங்கு, பெங்காலி, குஜராத்தி | Regional Hindu Calendars',
    te: 'ప్రాంతీయ హిందూ క్యాలెండర్‌లు — తమిళ, తెలుగు, బెంగాలి, గుజరాతీ | Regional Hindu Calendars',
    bn: 'আঞ্চলিক হিন্দু ক্যালেন্ডার — তামিল, তেলুগু, বাংলা, গুজরাটি | Regional Hindu Calendars',
    gu: 'પ્રાદેશિક હિન્દુ કેલેન્ડર — તમિલ, તેલુગુ, બંગાળી, ગુજરાતી | Regional Hindu Calendars',
    kn: 'ಪ್ರಾದೇಶಿಕ ಹಿಂದೂ ಕ್ಯಾಲೆಂಡರ್‌ಗಳು — ತಮಿಳು, ತೆಲುಗು, ಬಂಗಾಳಿ, ಗುಜರಾತಿ | Regional Hindu Calendars',
  },
  '/pricing': {
    ta: 'விலை — Dekho Panchang திட்டங்கள் | Pricing — Dekho Panchang Plans',
    te: 'ధర — Dekho Panchang ప్లాన్‌లు | Pricing — Dekho Panchang Plans',
    bn: 'মূল্য — Dekho Panchang প্ল্যান | Pricing — Dekho Panchang Plans',
    gu: 'ભાવ — Dekho Panchang યોજનાઓ | Pricing — Dekho Panchang Plans',
    kn: 'ಬೆಲೆ — Dekho Panchang ಯೋಜನೆಗಳು | Pricing — Dekho Panchang Plans',
  },
};

const SCRIPT_LOCALES = ['ta', 'te', 'bn', 'gu', 'kn'] as const;

// No tsconfig load — single-file AST manipulation only. Sprint 11 Gemini lesson.
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
