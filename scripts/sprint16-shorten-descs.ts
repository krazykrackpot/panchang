#!/usr/bin/env tsx
/**
 * Sprint 16 — shorten the 27 worst remaining EN-side descriptions
 * (170-280 chars) in `src/lib/seo/metadata.ts`.
 *
 * Same idempotent ts-morph pattern as Sprint 8.
 * Single-file AST manipulation; no tsconfig load (Sprint 11 lesson).
 * Source `oldEn` values copied verbatim from
 * `scripts/dump-long-en-descs.ts` output.
 */
import { Project, SyntaxKind } from 'ts-morph';

const APPLY = process.argv.includes('--apply');
const TARGET = 'src/lib/seo/metadata.ts';

interface Shortening { oldEn: string; newEn: string }

const DESC_SHORTENINGS: Record<string, Shortening> = {
  '/calendars/masa': {
    oldEn: 'The 12 Hindu lunar months for 2026 — Chaitra, Vaishakha, Jyeshtha through Phalguna. Both Amanta (south Indian) and Purnimanta (north Indian) conventions. Adhika Masa (intercalary month) marked. Each month with start/end dates, ruling deity, festivals and traditional significance.',
    newEn: 'The 12 Hindu lunar months for 2026 — Chaitra through Phalguna. Both Amanta and Purnimanta conventions, Adhika Masa marked, start/end dates, deity and festivals per month.',
  },
  '/learn/caesarean-muhurta': {
    oldEn: 'Learn the classical Jyotish rules for electing a C-section birth time. Covers the 5 scoring pillars  –  lagna shuddhi, Moon strength, benefic/malefic distribution, dasha trajectory, and structural defects like Gandanta. Based on BPHS, Muhurta Chintamani & Prasna Marga.',
    newEn: 'Classical Jyotish rules for electing a C-section birth time — 5 scoring pillars (lagna, Moon, benefics, dasha, structural defects). BPHS + Muhurta Chintamani + Prasna Marga.',
  },
  '/calendars/tithi': {
    oldEn: 'All 360+ tithis for 2026, organised by month with start/end times for your city. Each tithi shows masa (Amanta + Purnimanta), paksha, ruling deity, deity icon, and associated festivals or vrats. Mark Kshaya (lost) and Vriddhi (doubled) tithis. Free, computed daily.',
    newEn: 'All 360+ tithis for 2026 with start/end times for your city. Each shows masa, paksha, deity, festivals. Kshaya/Vriddhi marked. Free, computed daily.',
  },
  '/accuracy': {
    oldEn: 'How Dekho Panchang achieves professional-grade accuracy. Swiss Ephemeris (NASA JPL DE441), USNO solar tables, IAU Lahiri standard. 88 automated tests across 9 global locations. Sunrise within ±2 min, tithi within ±2 min of authoritative references.',
    newEn: 'Dekho Panchang accuracy — Swiss Ephemeris (DE441), USNO solar tables, IAU Lahiri. 88 automated tests across 9 cities. Sunrise + tithi within ±2 min of references.',
  },
  '/calendar/regional/malayalam': {
    oldEn: 'Complete Malayalam Panchangam — Kollavarsham (Malayalam Era) calendar, Vishu, Onam, Thiruvonam, Malayalam New Year. 12 solar months from Chingam to Karkidakam, with tithi, nakshatra and festival timings for Kerala and Malayalee community worldwide.',
    newEn: 'Malayalam Panchangam — Kollavarsham calendar, Vishu, Onam, Thiruvonam, New Year. 12 solar months Chingam-Karkidakam, tithi + nakshatra + festival timings.',
  },
  '/caesarean-muhurta': {
    oldEn: 'Find the most auspicious birth time for a planned C-section delivery. 5-pillar classical scoring  –  lagna strength, Moon strength, benefic distribution, dasha trajectory & structural defects. 15-minute resolution across your hospital date range.',
    newEn: 'Find the most auspicious birth time for a planned C-section. 5-pillar classical scoring — lagna, Moon, benefics, dasha, defects. 15-min resolution across your date range.',
  },
  '/calendar/regional/odia': {
    oldEn: 'Complete Odia Panji — Pana Sankranti (Odia New Year), Raja Parba, Kumar Purnima, and the Jagannath temple calendar of Puri. Solar months from Mesha to Meena with tithi, nakshatra, and festival timings for Odisha and the Odia diaspora.',
    newEn: 'Odia Panji — Pana Sankranti (New Year), Raja Parba, Kumar Purnima, Jagannath calendar of Puri. Solar months Mesha-Meena, tithi + nakshatra + festival timings.',
  },
  '/learn/vivah-muhurta': {
    oldEn: 'The complete classical guide to selecting auspicious marriage dates  –  solar months, 11 blessed nakshatras, Venus/Jupiter combustion, lagna selection, prohibited karanas & tithis. Based on Muhurta Chintamani, Brihat Samhita & BPHS.',
    newEn: 'Classical guide to electing marriage dates — solar months, 11 blessed nakshatras, Venus/Jupiter rules, lagna selection, prohibited karanas/tithis. Muhurta Chintamani + BPHS.',
  },
  '/festivals': {
    oldEn: 'Exact dates, Tithi, Muhurta & puja timings for 20 major Hindu festivals across 55 cities worldwide. Computed from Vedic algorithms — not fixed tables. Diwali, Janmashtami, Maha Shivaratri, Ram Navami, Holi & more for 2026-2029.',
    newEn: 'Exact dates, Tithi, Muhurta & puja timings for 20 major Hindu festivals across 55 cities. Vedic-computed, not fixed tables. Diwali, Holi, Janmashtami, more for 2026-2029.',
  },
  '/calendars': {
    oldEn: 'All Vedic calendar views in one hub — full year tithi table, 12 Hindu months (Amanta + Purnimanta), Bengali/Tamil/Telugu/Kannada/Malayalam/Mithila/Gujarati/Odia regional calendars, and ISKCON Vaishnava calendar.',
    newEn: 'All Vedic calendars in one hub — full year tithi table, 12 Hindu months (Amanta + Purnimanta), 8 regional calendars plus the ISKCON Vaishnava calendar.',
  },
  '/vivah-muhurat/2026': {
    oldEn: 'Complete list of auspicious Hindu marriage dates for 2026 with nakshatra, tithi, lagna windows, and Vedic scores. Computed using 36 classical rules from Muhurta Chintamani and BPHS. Free and location-aware.',
    newEn: 'Auspicious Hindu marriage dates for 2026 — nakshatra, tithi, lagna windows, Vedic scores. 36 classical rules from Muhurta Chintamani + BPHS. Free, location-aware.',
  },
  '/vivah-muhurat/2027': {
    oldEn: 'Complete list of auspicious Hindu marriage dates for 2027 with nakshatra, tithi, lagna windows, and Vedic scores. Computed using 36 classical rules from Muhurta Chintamani and BPHS. Free and location-aware.',
    newEn: 'Auspicious Hindu marriage dates for 2027 — nakshatra, tithi, lagna windows, Vedic scores. 36 classical rules from Muhurta Chintamani + BPHS. Free, location-aware.',
  },
  '/calendar/regional/telugu': {
    oldEn: 'Complete Telugu Panchangam — Ugadi (Telugu New Year), Bonalu, Bathukamma, Sankranti, Dasara. Tithi, Nakshatra, Yoga, Karana with monthly view for Andhra Pradesh, Telangana and Telugu community worldwide.',
    newEn: 'Telugu Panchangam — Ugadi (New Year), Bonalu, Bathukamma, Sankranti, Dasara. Tithi + Nakshatra + Yoga + Karana monthly view for Andhra Pradesh, Telangana and diaspora.',
  },
  '/learn/contributions/cosmic-time': {
    oldEn: "Hindu cosmology says Earth is 4.32 billion years old. Modern science says 4.54 billion. The only ancient civilisation that thought in billions  –  Yugas, Kalpas, and Brahma's 311 trillion year lifespan.",
    newEn: "Hindu cosmology says Earth is 4.32 billion years old. Modern science says 4.54 billion. Only ancient civilisation to think in billions — Yugas, Kalpas, Brahma's lifespan.",
  },
  '/calendar/regional/kannada': {
    oldEn: 'Complete Kannada Panchanga — Ugadi (Yugadi), Karnataka Rajyotsava, Gowri Ganesha, Deepavali. Tithi, Nakshatra, Yoga, Karana with daily and monthly views for Karnataka and Kannadiga community worldwide.',
    newEn: 'Kannada Panchanga — Ugadi (Yugadi), Karnataka Rajyotsava, Gowri Ganesha, Deepavali. Tithi + Nakshatra + Yoga + Karana daily and monthly views for Karnataka and diaspora.',
  },
  '/learn/nadi-amsha': {
    oldEn: 'Understanding Nadi Amsha (D-150): the 150th divisional chart for subtle karmic analysis, twin differentiation, and birth time rectification. Calculation method, classical sources, and interpretation.',
    newEn: 'Nadi Amsha (D-150): the 150th divisional chart for subtle karmic analysis, twin differentiation, and birth time rectification. Calculation, sources, interpretation.',
  },
  '/tools': {
    oldEn: 'All 24 free Vedic astrology tools in one place — Choghadiya, Hora, Rahu Kaal, Sade Sati, Baby Names, Sign Calculator, Prashna, Vedic Time, Sky Map, Mangal Dosha, Kaal Sarp, Pitra Dosha and more.',
    newEn: 'All 24 free Vedic astrology tools — Choghadiya, Hora, Rahu Kaal, Sade Sati, Baby Names, Sign Calculator, Prashna, Sky Map, Mangal Dosha, Kaal Sarp, and more.',
  },
  '/learn/gun-milan': {
    oldEn: 'Complete guide to Gun Milan (Ashta Kuta matching)  –  all 8 kutas explained with scoring, Nadi Dosha, Mangal Dosha, score interpretation (18+ minimum), and North vs South Indian traditions.',
    newEn: 'Gun Milan (Ashta Kuta matching) — 8 kutas with scoring, Nadi Dosha, Mangal Dosha, 18+ minimum interpretation, and North vs South Indian traditions.',
  },
  '/learn/hindu-calendar': {
    oldEn: 'Complete guide to the Hindu calendar  –  Vikram Samvat vs Shaka vs Gregorian, 12 lunar months, 6 Ritus (seasons), Amanta vs Purnimanta, Adhika Masa, and how to read a traditional panchang.',
    newEn: 'Hindu calendar guide — Vikram Samvat vs Shaka vs Gregorian, 12 lunar months, 6 Ritus, Amanta vs Purnimanta, Adhika Masa, how to read a traditional panchang.',
  },
  '/learn/contributions/al-khwarizmi': {
    oldEn: "How Al-Khwarizmi transmitted Indian mathematics to the Arabic world. The 'Father of Algebra' explicitly credited Hindu mathematicians for the decimal system, zero, and arithmetic methods.",
    newEn: "How Al-Khwarizmi transmitted Indian mathematics to the Arabic world. The 'Father of Algebra' credited Hindu mathematicians for the decimal system, zero, and arithmetic.",
  },
  '/learn/compatibility-advanced': {
    oldEn: 'Dasha comparison in synastry and Rajju Dosha (South Indian nakshatra cord matching). Worked examples, 27-nakshatra Rajju mapping table, cancellation conditions, compatibility flowchart.',
    newEn: 'Dasha comparison in synastry and Rajju Dosha (South Indian nakshatra cord). 27-nakshatra mapping, cancellation conditions, compatibility flowchart.',
  },
  '/learn/mesha': {
    oldEn: 'Complete guide to Mesha (Aries) in Vedic astrology  –  fire sign ruled by Mars. Personality, nakshatras, planetary dignities, each planet in Aries, career, compatibility, and remedies.',
    newEn: 'Mesha (Aries) in Vedic astrology — fire sign ruled by Mars. Personality, nakshatras, dignities, each planet in Aries, career, compatibility, remedies.',
  },
  '/widget': {
    oldEn: 'Embed a free daily Panchang widget on any website. One line of HTML adds tithi, nakshatra, yoga, karana, sunrise and sunset for your visitors. Self-hosted, GDPR-friendly, no tracking.',
    newEn: 'Embed a free daily Panchang widget on any website. One HTML line adds tithi, nakshatra, yoga, karana, sunrise/sunset. Self-hosted, GDPR-friendly, no tracking.',
  },
  '/learn/smarta-vaishnava': {
    oldEn: 'Why Smarta and Vaishnava traditions sometimes observe the same festival on different days. Udaya Tithi vs Viddha rejection, Ekadashi Parana rules, and regional variations explained.',
    newEn: 'Why Smarta and Vaishnava observe the same festival on different days. Udaya Tithi vs Viddha rejection, Ekadashi Parana rules, and regional variations.',
  },
  '/learn/muhurta-selection': {
    oldEn: 'Classical rules for electing auspicious Muhurtas for marriages and ceremonies — Nakshatra, Tithi, Lagna, Venus/Jupiter, Panchanga Shuddhi. From Muhurta Chintamani and Dharmasindhu.',
    newEn: 'Classical rules for electing Muhurtas — Nakshatra, Tithi, Lagna, Venus/Jupiter, Panchanga Shuddhi. From Muhurta Chintamani and Dharmasindhu.',
  },
  '/learn/contributions/gravity': {
    oldEn: '"The earth attracts all objects towards itself by an inherent force"  –  Bhaskaracharya wrote this in 1150 CE. Newton published Principia in 1687. Read the original Sanskrit verse.',
    newEn: '"The earth attracts all objects by an inherent force" — Bhaskaracharya wrote this in 1150 CE. Newton published Principia in 1687. Read the original Sanskrit verse.',
  },
  '/learn/nakshatra-baby-names': {
    oldEn: 'Find the right baby name by birth Nakshatra  –  complete syllable table for all 27 Nakshatras and 108 Padas. Namakarana ceremony, Moon vs Lagna Nakshatra, and modern naming tips.',
    newEn: 'Find the right baby name by birth Nakshatra — syllable table for 27 Nakshatras + 108 Padas. Namakarana, Moon vs Lagna Nakshatra, modern naming tips.',
  },
  '/learn/guru-pushya-yoga': {
    oldEn: "Guru Pushya Yoga occurs when Thursday (Jupiter's day) coincides with Pushya nakshatra  –  considered the single most auspicious time for new ventures, purchases, and investments.",
    newEn: "Guru Pushya Yoga — Thursday (Jupiter's day) + Pushya nakshatra. The single most auspicious time for new ventures, purchases, and investments.",
  },
};

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

for (const [route, { oldEn, newEn }] of Object.entries(DESC_SHORTENINGS)) {
  const routeProp = pageMetaObj.getProperty(`'${route}'`) ?? pageMetaObj.getProperty(`"${route}"`);
  if (!routeProp || routeProp.getKind() !== SyntaxKind.PropertyAssignment) {
    report.push(`[skip] route ${route} not found`); routesSkipped++; continue;
  }
  const meta = routeProp.asKindOrThrow(SyntaxKind.PropertyAssignment).getInitializerIfKindOrThrow(SyntaxKind.ObjectLiteralExpression);
  const descProp = meta.getProperty('description');
  if (!descProp || descProp.getKind() !== SyntaxKind.PropertyAssignment) {
    report.push(`[skip] route ${route} has no description block`); routesSkipped++; continue;
  }
  const descObj = descProp.asKindOrThrow(SyntaxKind.PropertyAssignment).getInitializerIfKind(SyntaxKind.ObjectLiteralExpression);
  if (!descObj) {
    report.push(`[skip] route ${route} has non-object description initializer`);
    routesSkipped++; continue;
  }
  const enEntry = descObj.getProperty('en') ?? descObj.getProperty("'en'") ?? descObj.getProperty('"en"');
  if (!enEntry || enEntry.getKind() !== SyntaxKind.PropertyAssignment) {
    report.push(`[skip] route ${route} has no description.en`); routesSkipped++; continue;
  }
  const lit = getStringLit(enEntry.asKindOrThrow(SyntaxKind.PropertyAssignment).getInitializer());
  if (!lit) {
    report.push(`[skip] route ${route} description.en not a string literal`); routesSkipped++; continue;
  }
  const v = lit.getLiteralValue();
  if (v === newEn) { report.push(`[ok]   ${route} — already shortened`); continue; }
  if (v !== oldEn) {
    report.push(`[warn] ${route}.description.en mismatch — actual prefix: "${v.slice(0, 60)}…"`);
    continue;
  }
  lit.replaceWithText(JSON.stringify(newEn));
  entriesUpdated++;
  report.push(`[ok]   ${route} — shortened ${v.length} → ${newEn.length} chars`);
}

if (APPLY) {
  src.saveSync();
  console.log(`\nApplied: ${entriesUpdated} descriptions shortened across ${Object.keys(DESC_SHORTENINGS).length} routes (${routesSkipped} skipped).`);
} else {
  console.log(`\nDRY-RUN — pass --apply to write. Would shorten ${entriesUpdated} descriptions (${routesSkipped} routes skipped).`);
}
console.log();
for (const line of report) console.log(line);
