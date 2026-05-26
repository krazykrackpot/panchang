#!/usr/bin/env tsx
/**
 * Sprint 11 — translate-and-normalise titles for 17 routes whose
 * ta/te/bn/gu/kn fields were byte-identical to EN.
 *
 * Scope:
 *   - 12 rashi pages (/panchang/rashi/{mesh,vrishabh,…,meen}) — normalise
 *     the seven still on the pre-Sprint-8 long EN ("Personality, Career…")
 *     to the short form and add bilingual translations across all 5
 *     South-Indian / Bengali scripts.
 *   - /shraddha — Shraddha Tithi Calculator
 *   - /vedic-time — Vedic Time + Ghati/Pala/Muhurta
 *   - /upagraha — Upagraha (shadow sub-planets)
 *   - /muhurta/wedding — Vivah Muhurat
 *   - /muhurta/griha-pravesh — housewarming muhurat
 *
 * Same idempotent ts-morph pattern as Sprints 7/8/9. Pass --apply to write.
 */
import { Project, SyntaxKind } from 'ts-morph';

const APPLY = process.argv.includes('--apply');
const TARGET = 'src/lib/seo/metadata.ts';

interface RouteTitles {
  /** Optional — if set, overwrites title.en with this value. */
  en?: string;
  ta: string;
  te: string;
  bn: string;
  gu: string;
  kn: string;
}

const RASHI_SHORT_SUFFIX = "Career, Love & Today's Horoscope";

const TRANSLATIONS: Record<string, RouteTitles> = {
  '/panchang/rashi/mesh': {
    en: `Aries (Mesh) — ${RASHI_SHORT_SUFFIX}`,
    ta: "மேஷம் — தொழில், காதல், இன்றைய ராசிபலன் | Aries (Mesh) — Today's Horoscope",
    te: "మేషం — కెరీర్, ప్రేమ, నేటి రాశిఫలం | Aries (Mesh) — Today's Horoscope",
    bn: "মেষ — কর্মজীবন, প্রেম, আজকের রাশিফল | Aries (Mesh) — Today's Horoscope",
    gu: "મેષ — કારકિર્દી, પ્રેમ, આજનું રાશિફળ | Aries (Mesh) — Today's Horoscope",
    kn: "ಮೇಷ — ವೃತ್ತಿ, ಪ್ರೇಮ, ಇಂದಿನ ರಾಶಿಫಲ | Aries (Mesh) — Today's Horoscope",
  },
  '/panchang/rashi/vrishabh': {
    ta: "ரிஷபம் — தொழில், காதல், இன்றைய ராசிபலன் | Taurus (Vrishabh) — Today's Horoscope",
    te: "వృషభం — కెరీర్, ప్రేమ, నేటి రాశిఫలం | Taurus (Vrishabh) — Today's Horoscope",
    bn: "বৃষ — কর্মজীবন, প্রেম, আজকের রাশিফল | Taurus (Vrishabh) — Today's Horoscope",
    gu: "વૃષભ — કારકિર્દી, પ્રેમ, આજનું રાશિફળ | Taurus (Vrishabh) — Today's Horoscope",
    kn: "ವೃಷಭ — ವೃತ್ತಿ, ಪ್ರೇಮ, ಇಂದಿನ ರಾಶಿಫಲ | Taurus (Vrishabh) — Today's Horoscope",
  },
  '/panchang/rashi/mithun': {
    en: `Gemini (Mithun) — ${RASHI_SHORT_SUFFIX}`,
    ta: "மிதுனம் — தொழில், காதல், இன்றைய ராசிபலன் | Gemini (Mithun) — Today's Horoscope",
    te: "మిథునం — కెరీర్, ప్రేమ, నేటి రాశిఫలం | Gemini (Mithun) — Today's Horoscope",
    bn: "মিথুন — কর্মজীবন, প্রেম, আজকের রাশিফল | Gemini (Mithun) — Today's Horoscope",
    gu: "મિથુન — કારકિર્દી, પ્રેમ, આજનું રાશિફળ | Gemini (Mithun) — Today's Horoscope",
    kn: "ಮಿಥುನ — ವೃತ್ತಿ, ಪ್ರೇಮ, ಇಂದಿನ ರಾಶಿಫಲ | Gemini (Mithun) — Today's Horoscope",
  },
  '/panchang/rashi/kark': {
    en: `Cancer (Kark) — ${RASHI_SHORT_SUFFIX}`,
    ta: "கடகம் — தொழில், காதல், இன்றைய ராசிபலன் | Cancer (Kark) — Today's Horoscope",
    te: "కర్కాటకం — కెరీర్, ప్రేమ, నేటి రాశిఫలం | Cancer (Kark) — Today's Horoscope",
    bn: "কর্কট — কর্মজীবন, প্রেম, আজকের রাশিফল | Cancer (Kark) — Today's Horoscope",
    gu: "કર્ક — કારકિર્દી, પ્રેમ, આજનું રાશિફળ | Cancer (Kark) — Today's Horoscope",
    kn: "ಕರ್ಕ — ವೃತ್ತಿ, ಪ್ರೇಮ, ಇಂದಿನ ರಾಶಿಫಲ | Cancer (Kark) — Today's Horoscope",
  },
  '/panchang/rashi/simha': {
    en: `Leo (Simha) — ${RASHI_SHORT_SUFFIX}`,
    ta: "சிம்மம் — தொழில், காதல், இன்றைய ராசிபலன் | Leo (Simha) — Today's Horoscope",
    te: "సింహం — కెరీర్, ప్రేమ, నేటి రాశిఫలం | Leo (Simha) — Today's Horoscope",
    bn: "সিংহ — কর্মজীবন, প্রেম, আজকের রাশিফল | Leo (Simha) — Today's Horoscope",
    gu: "સિંહ — કારકિર્દી, પ્રેમ, આજનું રાશિફળ | Leo (Simha) — Today's Horoscope",
    kn: "ಸಿಂಹ — ವೃತ್ತಿ, ಪ್ರೇಮ, ಇಂದಿನ ರಾಶಿಫಲ | Leo (Simha) — Today's Horoscope",
  },
  '/panchang/rashi/kanya': {
    en: `Virgo (Kanya) — ${RASHI_SHORT_SUFFIX}`,
    ta: "கன்னி — தொழில், காதல், இன்றைய ராசிபலன் | Virgo (Kanya) — Today's Horoscope",
    te: "కన్య — కెరీర్, ప్రేమ, నేటి రాశిఫలం | Virgo (Kanya) — Today's Horoscope",
    bn: "কন্যা — কর্মজীবন, প্রেম, আজকের রাশিফল | Virgo (Kanya) — Today's Horoscope",
    gu: "કન્યા — કારકિર્દી, પ્રેમ, આજનું રાશિફળ | Virgo (Kanya) — Today's Horoscope",
    kn: "ಕನ್ಯಾ — ವೃತ್ತಿ, ಪ್ರೇಮ, ಇಂದಿನ ರಾಶಿಫಲ | Virgo (Kanya) — Today's Horoscope",
  },
  '/panchang/rashi/tula': {
    en: `Libra (Tula) — ${RASHI_SHORT_SUFFIX}`,
    ta: "துலா — தொழில், காதல், இன்றைய ராசிபலன் | Libra (Tula) — Today's Horoscope",
    te: "తుల — కెరీర్, ప్రేమ, నేటి రాశిఫలం | Libra (Tula) — Today's Horoscope",
    bn: "তুলা — কর্মজীবন, প্রেম, আজকের রাশিফল | Libra (Tula) — Today's Horoscope",
    gu: "તુલા — કારકિર્દી, પ્રેમ, આજનું રાશિફળ | Libra (Tula) — Today's Horoscope",
    kn: "ತುಲಾ — ವೃತ್ತಿ, ಪ್ರೇಮ, ಇಂದಿನ ರಾಶಿಫಲ | Libra (Tula) — Today's Horoscope",
  },
  '/panchang/rashi/vrishchik': {
    ta: "விருச்சிகம் — தொழில், காதல், இன்றைய ராசிபலன் | Scorpio (Vrishchik) — Today's Horoscope",
    te: "వృశ్చికం — కెరీర్, ప్రేమ, నేటి రాశిఫలం | Scorpio (Vrishchik) — Today's Horoscope",
    bn: "বৃশ্চিক — কর্মজীবন, প্রেম, আজকের রাশিফল | Scorpio (Vrishchik) — Today's Horoscope",
    gu: "વૃશ્ચિક — કારકિર્દી, પ્રેમ, આજનું રાશિફળ | Scorpio (Vrishchik) — Today's Horoscope",
    kn: "ವೃಶ್ಚಿಕ — ವೃತ್ತಿ, ಪ್ರೇಮ, ಇಂದಿನ ರಾಶಿಫಲ | Scorpio (Vrishchik) — Today's Horoscope",
  },
  '/panchang/rashi/dhanu': {
    ta: "தனுசு — தொழில், காதல், இன்றைய ராசிபலன் | Sagittarius (Dhanu) — Today's Horoscope",
    te: "ధనుస్సు — కెరీర్, ప్రేమ, నేటి రాశిఫలం | Sagittarius (Dhanu) — Today's Horoscope",
    bn: "ধনু — কর্মজীবন, প্রেম, আজকের রাশিফল | Sagittarius (Dhanu) — Today's Horoscope",
    gu: "ધનુ — કારકિર્દી, પ્રેમ, આજનું રાશિફળ | Sagittarius (Dhanu) — Today's Horoscope",
    kn: "ಧನು — ವೃತ್ತಿ, ಪ್ರೇಮ, ಇಂದಿನ ರಾಶಿಫಲ | Sagittarius (Dhanu) — Today's Horoscope",
  },
  '/panchang/rashi/makar': {
    ta: "மகரம் — தொழில், காதல், இன்றைய ராசிபலன் | Capricorn (Makar) — Today's Horoscope",
    te: "మకరం — కెరీర్, ప్రేమ, నేటి రాశిఫలం | Capricorn (Makar) — Today's Horoscope",
    bn: "মকর — কর্মজীবন, প্রেম, আজকের রাশিফল | Capricorn (Makar) — Today's Horoscope",
    gu: "મકર — કારકિર્દી, પ્રેમ, આજનું રાશિફળ | Capricorn (Makar) — Today's Horoscope",
    kn: "ಮಕರ — ವೃತ್ತಿ, ಪ್ರೇಮ, ಇಂದಿನ ರಾಶಿಫಲ | Capricorn (Makar) — Today's Horoscope",
  },
  '/panchang/rashi/kumbh': {
    ta: "கும்பம் — தொழில், காதல், இன்றைய ராசிபலன் | Aquarius (Kumbh) — Today's Horoscope",
    te: "కుంభం — కెరీర్, ప్రేమ, నేటి రాశిఫలం | Aquarius (Kumbh) — Today's Horoscope",
    bn: "কুম্ভ — কর্মজীবন, প্রেম, আজকের রাশিফল | Aquarius (Kumbh) — Today's Horoscope",
    gu: "કુંભ — કારકિર્દી, પ્રેમ, આજનું રાશિફળ | Aquarius (Kumbh) — Today's Horoscope",
    kn: "ಕುಂಭ — ವೃತ್ತಿ, ಪ್ರೇಮ, ಇಂದಿನ ರಾಶಿಫಲ | Aquarius (Kumbh) — Today's Horoscope",
  },
  '/panchang/rashi/meen': {
    en: `Pisces (Meen) — ${RASHI_SHORT_SUFFIX}`,
    ta: "மீனம் — தொழில், காதல், இன்றைய ராசிபலன் | Pisces (Meen) — Today's Horoscope",
    te: "మీనం — కెరీర్, ప్రేమ, నేటి రాశిఫలం | Pisces (Meen) — Today's Horoscope",
    bn: "মীন — কর্মজীবন, প্রেম, আজকের রাশিফল | Pisces (Meen) — Today's Horoscope",
    gu: "મીન — કારકિર્દી, પ્રેમ, આજનું રાશિફળ | Pisces (Meen) — Today's Horoscope",
    kn: "ಮೀನ — ವೃತ್ತಿ, ಪ್ರೇಮ, ಇಂದಿನ ರಾಶಿಫಲ | Pisces (Meen) — Today's Horoscope",
  },
  '/shraddha': {
    ta: 'ஶ்ராத்த திதி கால்குலேட்டர் | Shraddha Tithi Calculator',
    te: 'శ్రాద్ధ తిథి కాలిక్యులేటర్ | Shraddha Tithi Calculator',
    bn: 'শ্রাদ্ধ তিথি ক্যালকুলেটর | Shraddha Tithi Calculator',
    gu: 'શ્રાદ્ધ તિથિ કેલ્ક્યુલેટર | Shraddha Tithi Calculator',
    kn: 'ಶ್ರಾದ್ಧ ತಿಥಿ ಕ್ಯಾಲ್ಕುಲೇಟರ್ | Shraddha Tithi Calculator',
  },
  '/vedic-time': {
    ta: 'வேத காலம் — கடி, பல, முகூர்த்தம் | Vedic Time — Ghati, Pala, Muhurta',
    te: 'వేద కాలం — ఘటి, పల, ముహూర్తం | Vedic Time — Ghati, Pala, Muhurta',
    bn: 'বৈদিক সময় — ঘটি, পল, মুহূর্ত | Vedic Time — Ghati, Pala, Muhurta',
    gu: 'વૈદિક સમય — ઘટિ, પલ, મુહૂર્ત | Vedic Time — Ghati, Pala, Muhurta',
    kn: 'ವೈದಿಕ ಕಾಲ — ಘಟಿ, ಪಲ, ಮುಹೂರ್ತ | Vedic Time — Ghati, Pala, Muhurta',
  },
  '/upagraha': {
    ta: 'உபக்ரஹ — நிழல் உப-கிரகங்கள் | Upagraha — Shadow Sub-Planets',
    te: 'ఉపగ్రహ — నీడ ఉప-గ్రహాలు | Upagraha — Shadow Sub-Planets',
    bn: 'উপগ্রহ — ছায়া উপ-গ্রহ | Upagraha — Shadow Sub-Planets',
    gu: 'ઉપગ્રહ — છાયા ઉપ-ગ્રહો | Upagraha — Shadow Sub-Planets',
    kn: 'ಉಪಗ್ರಹ — ನೆರಳು ಉಪ-ಗ್ರಹಗಳು | Upagraha — Shadow Sub-Planets',
  },
  '/muhurta/wedding': {
    ta: 'விவாகத்திற்கான சுப முகூர்த்தம் 2026 | Shubh Muhurat for Wedding 2026',
    te: 'వివాహానికి శుభ ముహూర్తం 2026 | Shubh Muhurat for Wedding 2026',
    bn: 'বিবাহের জন্য শুভ মুহূর্ত ২০২৬ | Shubh Muhurat for Wedding 2026',
    gu: 'વિવાહ માટે શુભ મુહૂર્ત 2026 | Shubh Muhurat for Wedding 2026',
    kn: 'ವಿವಾಹಕ್ಕೆ ಶುಭ ಮುಹೂರ್ತ 2026 | Shubh Muhurat for Wedding 2026',
  },
  '/muhurta/griha-pravesh': {
    ta: 'க்ருஹ ப்ரவேஶ முகூர்த்தம் 2026 | Griha Pravesh Muhurat 2026',
    te: 'గృహ ప్రవేశ ముహూర్తం 2026 | Griha Pravesh Muhurat 2026',
    bn: 'গৃহ প্রবেশ মুহূর্ত ২০২৬ | Griha Pravesh Muhurat 2026',
    gu: 'ગૃહ પ્રવેશ મુહૂર્ત 2026 | Griha Pravesh Muhurat 2026',
    kn: 'ಗೃಹ ಪ್ರವೇಶ ಮುಹೂರ್ತ 2026 | Griha Pravesh Muhurat 2026',
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

  // Optionally update EN
  if (t.en !== undefined) {
    const enEntry = titleObj.getProperty('en') ?? titleObj.getProperty("'en'") ?? titleObj.getProperty('"en"');
    if (enEntry && enEntry.getKind() === SyntaxKind.PropertyAssignment) {
      const lit = getStringLit(enEntry.asKindOrThrow(SyntaxKind.PropertyAssignment).getInitializer());
      if (lit && lit.getLiteralValue() !== t.en) {
        lit.replaceWithText(JSON.stringify(t.en));
        routeChanges++;
        entriesUpdated++;
      }
    }
  }

  // Always update the 5 script locales
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
  report.push(`[ok]   ${route} — ${routeChanges} entr${routeChanges === 1 ? 'y' : 'ies'}`);
}

if (APPLY) {
  src.saveSync();
  console.log(`\nApplied: ${entriesUpdated} title entries across ${Object.keys(TRANSLATIONS).length} routes (${routesSkipped} skipped).`);
} else {
  console.log(`\nDRY-RUN — pass --apply to write. Would update ${entriesUpdated} entries (${routesSkipped} routes skipped).`);
}
console.log();
for (const line of report) console.log(line);
