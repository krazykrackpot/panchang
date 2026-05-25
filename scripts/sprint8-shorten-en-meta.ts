#!/usr/bin/env tsx
/**
 * Sprint 8 — shorten the longest EN-side titles (>65 chars) and EN-side
 * descriptions (>170 chars) in `src/lib/seo/metadata.ts`.
 *
 * For each route:
 *  - TITLE.en gets shortened in-place. Other locales whose title value
 *    contains the OLD EN string get the suffix swapped for the new one
 *    (bilingual `<Script> | <EN>` pattern). Same cascading approach as
 *    Sprint 7.
 *  - DESCRIPTION.en gets shortened only. Other locales are independent
 *    per-script text and are NOT touched here (separate i18n sprint).
 *
 * Idempotent — re-running with the same dicts is a no-op.
 * Pass --apply to write.
 */
import { Project, SyntaxKind } from 'ts-morph';

const APPLY = process.argv.includes('--apply');
const TARGET = 'src/lib/seo/metadata.ts';

interface MetaShortening { oldEn: string; newEn: string }

const TITLE_SHORTENINGS: Record<string, MetaShortening> = {
  '/learn/doshas-detailed': {
    oldEn: 'Doshas Comprehensive Guide  –  Mangal, Kaal Sarpa, Pitra, Kemdrum, Guru Chandal, Grahan',
    newEn: 'Doshas Guide — Mangal, Kaal Sarpa, Pitra, Grahan & More',
  },
  '/learn/contributions/negative-numbers': {
    oldEn: 'Negative Numbers  –  When India Said "Less Than Nothing" and Europe Said "Impossible"',
    newEn: 'Negative Numbers — India\'s Pre-Western Math Breakthrough',
  },
  '/learn/contributions/pythagoras': {
    oldEn: 'The "Pythagorean" Theorem Was Indian  –  Baudhayana Had It 300 Years Earlier',
    newEn: 'Pythagorean Theorem — Baudhayana Had It 300 Years Earlier',
  },
  '/mundane': {
    oldEn: 'Mundane Astrology  –  National Charts, World Forecast & Great Conjunctions',
    newEn: 'Mundane Astrology — National Charts & World Forecast',
  },
  '/learn/contributions/kerala-school': {
    oldEn: 'The Kerala School  –  When India Invented Calculus 250 Years Before Europe',
    newEn: 'Kerala School — India Invented Calculus 250 Years Earlier',
  },
  '/learn/contributions/sine': {
    oldEn: 'Did You Know "Sine" Is a Sanskrit Word? The Indian Origin of Trigonometry',
    newEn: 'Sine Is a Sanskrit Word — Indian Origin of Trigonometry',
  },
  '/learn/contributions/al-khwarizmi': {
    oldEn: "Al-Khwarizmi & Hindu Mathematics  –  The True Origin of 'Arabic' Numerals",
    newEn: 'Al-Khwarizmi & Hindu Math — True Origin of Arabic Numerals',
  },
  '/learn/contributions/timeline': {
    oldEn: '2,000 Years of Indian Science  –  A Visual Timeline (800 BCE to 1600 CE)',
    newEn: '2,000 Years of Indian Science — A Visual Timeline',
  },
  '/sadhaka-path': {
    oldEn: 'Sadhaka Path — Free Vedic Astrology Learning Quest with Levels & Badges',
    newEn: 'Sadhaka Path — Free Vedic Astrology Quest with Levels',
  },
  '/learn/cosmology': {
    oldEn: "Hindu Cosmology  –  Yugas, Kalpas, Brahma's 311 Trillion Year Lifespan",
    newEn: "Hindu Cosmology — Yugas, Kalpas, Brahma's Cosmic Lifespan",
  },
  '/learn/contributions/earth-rotation': {
    oldEn: 'India Knew the Earth Rotates  –  1,000 Years Before Europe (Aryabhata)',
    newEn: 'Earth Rotation — Aryabhata Knew 1,000 Years Before Europe',
  },
  '/panchang/rashi/vrishchik': {
    oldEn: "Scorpio (Vrishchik)  –  Personality, Career, Love & Today's Horoscope",
    newEn: "Scorpio (Vrishchik) — Career, Love & Today's Horoscope",
  },
  '/panchang/rashi/dhanu': {
    oldEn: "Sagittarius (Dhanu)  –  Personality, Career, Love & Today's Horoscope",
    newEn: "Sagittarius (Dhanu) — Career, Love & Today's Horoscope",
  },
  '/learn/contributions/gravity': {
    oldEn: "Gravity  –  500 Years Before Newton's Apple (Bhaskaracharya, 1150 CE)",
    newEn: 'Gravity — Bhaskaracharya 500 Years Before Newton (1150 CE)',
  },
  '/learn/contributions/cosmic-time': {
    oldEn: '4.32 Billion Years  –  How Did the Ancients Know? (Vedic Cosmic Time)',
    newEn: 'Vedic Cosmic Time — 4.32 Billion Years from the Ancients',
  },
  '/festivals': {
    oldEn: 'Hindu Festival Calendar 2026-2029 — Exact Muhurta Times for 55 Cities',
    newEn: 'Hindu Festivals 2026-2029 — Muhurta Times for 55 Cities',
  },
  '/calendar/regional/iskcon': {
    oldEn: 'ISKCON Vaishnava Calendar 2026  –  Festivals, Ekadashi, Acharya Days',
    newEn: 'ISKCON Vaishnava Calendar 2026 — Festivals & Ekadashi',
  },
  '/learn/vivah-muhurta': {
    oldEn: 'Vivah Muhurta  –  How Marriage Dates Are Selected in Vedic Astrology',
    newEn: 'Vivah Muhurta — How Vedic Marriage Dates Are Selected',
  },
  '/sign-shift': {
    oldEn: 'Why Your Western Horoscope Might Be Wrong  –  Sign Shift Calculator',
    newEn: 'Sign Shift Calculator — Western vs Vedic Sun Sign',
  },
  '/muhurta-ai': {
    oldEn: 'Shubh Muhurta Finder  –  Auspicious Dates & Times for 20 Activities',
    newEn: 'Muhurta Finder — Auspicious Dates for 20 Activities',
  },
  '/panchang/rashi/vrishabh': {
    oldEn: "Taurus (Vrishabh)  –  Personality, Career, Love & Today's Horoscope",
    newEn: "Taurus (Vrishabh) — Career, Love & Today's Horoscope",
  },
  '/panchang/rashi/makar': {
    oldEn: "Capricorn (Makar)  –  Personality, Career, Love & Today's Horoscope",
    newEn: "Capricorn (Makar) — Career, Love & Today's Horoscope",
  },
  '/devotional': {
    oldEn: 'Devotional Library  –  Aarti, Chalisa, Stotram, Mantra with Meaning',
    newEn: 'Devotional Library — Aarti, Chalisa, Stotram & Mantra',
  },
  '/learn/muhurta-selection': {
    oldEn: 'Muhurta Selection  –  Classical Rules for Choosing Auspicious Times',
    newEn: 'Muhurta Selection — Classical Rules for Auspicious Times',
  },
  '/learn/hindu-calendar': {
    oldEn: 'Hindu Calendar System  –  Vikram Samvat, Months, Seasons & Panchang',
    newEn: 'Hindu Calendar System — Vikram Samvat, Months & Seasons',
  },
  '/calendars': {
    oldEn: 'Vedic Calendars Hub — Tithi Table, Hindu Months, Regional Calendars',
    newEn: 'Vedic Calendars — Tithi, Hindu Months, Regional Calendars',
  },
  '/panchang/rashi/kumbh': {
    oldEn: "Aquarius (Kumbh)  –  Personality, Career, Love & Today's Horoscope",
    newEn: "Aquarius (Kumbh) — Career, Love & Today's Horoscope",
  },
  '/learn/kaal-sarp': {
    oldEn: 'Kaal Sarpa Dosha  –  Types, Effects, Cancellation & Honest Context',
    newEn: 'Kaal Sarpa Dosha — Types, Effects & Cancellation',
  },
};

// Description shortenings — `oldEn` values were dumped via
// scripts/dump-long-en-descs.ts to ensure exact match against source.
const DESC_SHORTENINGS: Record<string, MetaShortening> = {
  '/panchang': {
    oldEn: "Check today's Panchang for your city  –  Tithi, Nakshatra, Yoga, Karana, Rahu Kaal, Shubh Muhurat, sunrise & sunset. Computed from real planetary positions using Surya Siddhanta algorithms. Free, accurate, updated daily for any location worldwide.",
    newEn: "Today's Panchang for your city — Tithi, Nakshatra, Yoga, Karana, Rahu Kaal, Muhurat, sunrise & sunset. Real planetary positions. Free, accurate, updated daily.",
  },
  '/kundali': {
    oldEn: 'Create your free Kundali in seconds. Simple Mode for beginners — visual identity cards, life domain scores, plain-language insights. Expert Mode for practitioners — 19 charts, 15 dasha systems, 210+ yogas, Shadbala, Ashtakavarga & AI reading. Swiss Ephemeris precision. No signup required.',
    newEn: 'Free Kundali in seconds. Simple Mode for beginners; Expert Mode with 19 charts, 15 dashas, 210+ yogas, Shadbala, Ashtakavarga & AI reading. Swiss Ephemeris precision. No signup.',
  },
  '/hindu-calendar/2026': {
    oldEn: 'Complete Hindu calendar for 2026  –  all 180+ festivals, 24 Ekadashi vrat dates, eclipses, Purnima & Amavasya. Month-by-month with exact dates for every major Hindu festival.',
    newEn: 'Hindu calendar for 2026 — 180+ festivals, 24 Ekadashi vrats, eclipses, Purnima & Amavasya. Month-by-month with exact dates for every major Hindu festival.',
  },
  '/hindu-calendar/2027': {
    oldEn: 'Complete Hindu calendar for 2027  –  all 180+ festivals, 24 Ekadashi vrat dates, eclipses, Purnima & Amavasya. Month-by-month with exact dates for every major Hindu festival.',
    newEn: 'Hindu calendar for 2027 — 180+ festivals, 24 Ekadashi vrats, eclipses, Purnima & Amavasya. Month-by-month with exact dates for every major Hindu festival.',
  },
  '/financial-astrology': {
    oldEn: 'Discover your Dhana yoga activations, personal financial windows, hora-based timing guide, and top sectors from your Vedic birth chart. Traditional Vedic knowledge for self-awareness only.',
    newEn: 'Your Dhana yoga activations, financial windows, hora-based timing guide, and top sectors from your Vedic birth chart. Self-awareness only.',
  },
  '/mundane': {
    oldEn: 'Explore foundation charts for 22 nations, Jupiter-Saturn Great Conjunction cycles, and domain-by-domain world forecasts using Vedic mundane astrology. For educational purposes only.',
    newEn: 'Foundation charts for 22 nations, Jupiter-Saturn Great Conjunction cycles, and domain-by-domain world forecasts. Vedic mundane astrology. Educational only.',
  },
  '/medical-astrology': {
    oldEn: 'Discover your Ayurvedic constitution (Prakriti), body vulnerability map, health timeline, and disease susceptibility patterns from your Vedic birth chart. For self-awareness only.',
    newEn: 'Your Ayurvedic constitution (Prakriti), body vulnerability map, health timeline and disease susceptibility from your Vedic birth chart. Self-awareness only.',
  },
  '/sign-shift': {
    oldEn: 'See how the 24° ayanamsha shift between tropical and sidereal zodiacs changes your entire birth chart. Compare all 9 planets side by side and discover your true Vedic signs.',
    newEn: 'How the 24° ayanamsha shift between tropical and sidereal zodiacs changes your chart. Compare all 9 planets side by side — find your true Vedic signs.',
  },
  '/horoscope': {
    oldEn: 'Free daily horoscope for all 12 zodiac signs based on actual sidereal planetary transits, not seasonal approximations. Check your Aries, Taurus, Gemini, Cancer, Leo, Virgo, Libra, Scorpio, Sagittarius, Capricorn, Aquarius, Pisces horoscope today.',
    newEn: 'Free daily horoscope for all 12 zodiac signs from real sidereal planetary transits — not seasonal approximations. Aries through Pisces, refreshed every day.',
  },
  '/panchang/rashi/mesh': {
    oldEn: 'Complete Aries (Mesh Rashi) guide  –  personality traits, career aptitude, health, relationships, and daily horoscope. Vedic astrology analysis with lucky numbers, colors, and compatible signs.',
    newEn: 'Aries (Mesh Rashi) guide — personality, career, health, relationships, daily horoscope. Vedic analysis with lucky numbers, colours and compatible signs.',
  },
  '/devotional': {
    oldEn: 'Complete collection of Hindu aartis, chalisas, stotrams and mantras  –  full Devanagari text, English transliteration, meaning, and significance. Hanuman Chalisa, Gayatri Mantra, Vishnu Sahasranama and 50+ sacred texts.',
    newEn: 'Hindu aartis, chalisas, stotrams and mantras — Devanagari text, transliteration, meaning, significance. Hanuman Chalisa, Gayatri Mantra, Sahasranama and 50+ texts.',
  },
  '/choghadiya': {
    oldEn: "Check today's Choghadiya now  –  find Amrit, Shubh & Labh slots for your city. Best times for travel, business, shopping & auspicious activities. Free, accurate, no signup.",
    newEn: "Today's Choghadiya — Amrit, Shubh & Labh slots for your city. Best times for travel, business, shopping and auspicious activities. Free, accurate, no signup.",
  },
  '/chandrabalam': {
    oldEn: "Check today's Chandrabalam (Moon strength) for all 12 zodiac signs. See if the Moon's transit is favorable or unfavorable for your birth rashi based on Muhurta Chintamani rules.",
    newEn: "Today's Chandrabalam (Moon strength) for all 12 zodiac signs. See if the Moon's transit favours your birth rashi — based on Muhurta Chintamani rules.",
  },
  '/muhurat': {
    oldEn: 'Auspicious muhurat dates for 20+ activities — wedding, travel, griha pravesh, mundan, annaprashan. Computed from Vedic Panchang with nakshatra, tithi & planetary alignment. Free, no signup.',
    newEn: 'Auspicious muhurat dates for 20+ activities — wedding, travel, griha pravesh, mundan, annaprashan. Vedic Panchang nakshatra/tithi/planet alignment. Free.',
  },
  '/calendar/regional/tamil': {
    oldEn: 'Complete Tamil Panchangam guide  –  12 solar months from Chithirai to Panguni, festivals like Pongal, Chithirai Thiruvizha, Karthigai Deepam, and how Tamil calendar differs from North Indian systems.',
    newEn: 'Tamil Panchangam — 12 solar months from Chithirai to Panguni; festivals like Pongal, Chithirai Thiruvizha, Karthigai Deepam. How Tamil calendar differs from the North.',
  },
  '/calendar/regional/bengali': {
    oldEn: 'Bangla Calendar 2026 (বাংলা পঞ্জিকা ২০২৬): Boishakh 14 Apr, Durga Puja 1-5 Oct, Kali Puja 20 Oct, Poila Boishakh 14 Apr. Free 12-month panjika with tithi, ekadashi & festival dates for any city worldwide.',
    newEn: 'Bangla Calendar 2026 — Boishakh 14 Apr, Durga Puja 1-5 Oct, Kali Puja 20 Oct, Poila Boishakh 14 Apr. Free 12-month panjika with tithi and festival dates.',
  },
  '/calendar/regional/gujarati': {
    oldEn: 'Complete Gujarati Panchang  –  Vikram Samvat calendar, Uttarayan (Makar Sankranti), Navratri, Diwali & Bestu Varas (Gujarati New Year), Janmashtami. Tithi, Ekadashi, and key festival dates for the Gujarati community worldwide.',
    newEn: 'Gujarati Panchang — Vikram Samvat calendar, Uttarayan, Navratri, Diwali, Bestu Varas (New Year), Janmashtami. Tithi, Ekadashi and festival dates.',
  },
  '/brihaspati': {
    oldEn: 'Brihaspati is a conversational Vedic AI astrologer that reads your kundali — dashas, transits, yogas, doshas. Every claim cites BPHS / Saravali / Phaladeepika. Swiss Ephemeris precision. Free monthly questions with your plan, no per-question fee.',
    newEn: 'Brihaspati — conversational Vedic AI astrologer reading your kundali (dashas, transits, yogas, doshas). Claims cite BPHS / Saravali / Phaladeepika. Swiss Ephemeris precision.',
  },
  '/sadhaka-path': {
    oldEn: 'Learn Vedic astrology free with the Sadhaka Path — a structured quest with 5 levels, 12 badges, and a daily streak. Built on a 30+ module curriculum covering panchang, kundali, dashas, yogas, transits, and remedies. Earn portraits as you progress. No subscription needed.',
    newEn: 'Free structured Jyotish quest — 5 levels, 12 badges, daily streak. 30+ modules: panchang, kundali, dashas, yogas, transits, remedies. Earn portraits. No subscription.',
  },
  '/learn/cosmology': {
    oldEn: "From Truti (29.6μs) to Brahma's lifespan (311 trillion years). The only ancient civilization to think in billions of years  –  matching modern cosmology. Yugas, Manvantaras, Kalpas explained.",
    newEn: "From Truti (29.6μs) to Brahma's lifespan (311 trillion years). The only ancient civilisation that thought in billions — matching modern cosmology. Yugas, Manvantaras, Kalpas.",
  },
  '/learn/pancha-pakshi': {
    oldEn: 'Pancha Pakshi Shastra: ancient Tamil timing system using five birds (Vulture, Owl, Crow, Cock, Peacock). Birth nakshatra determines your ruling bird and optimal activity windows throughout the day.',
    newEn: 'Pancha Pakshi Shastra — ancient Tamil timing system using five birds (Vulture, Owl, Crow, Cock, Peacock). Birth nakshatra sets your ruling bird and activity windows.',
  },
  '/learn/muhurta-selection': {
    oldEn: 'Learn the classical rules for selecting auspicious Muhurtas for marriage and ceremonies. Nakshatra, Tithi, Lagna, Venus/Jupiter combustion, and Panchanga Shuddhi from Muhurta Chintamani and Dharmasindhu.',
    newEn: 'Classical rules for electing auspicious Muhurtas for marriages and ceremonies — Nakshatra, Tithi, Lagna, Venus/Jupiter, Panchanga Shuddhi. From Muhurta Chintamani and Dharmasindhu.',
  },
  '/learn/rahu': {
    oldEn: 'Comprehensive guide to Rahu (North Lunar Node) in Jyotish  –  the shadow planet of obsession, illusion, and worldly desire. Dignities, effects in 12 signs and houses, 18-year dasha, remedies, and mythology.',
    newEn: 'Comprehensive Jyotish guide to Rahu (North Lunar Node) — shadow planet of obsession, illusion and desire. Dignities, effects in 12 signs/houses, 18-year dasha, remedies.',
  },
  '/learn/ketu': {
    oldEn: 'Comprehensive guide to Ketu (South Lunar Node) in Jyotish  –  the shadow planet of detachment, moksha, and past-life karma. Dignities, effects in 12 signs and houses, 7-year dasha, remedies, and mythology.',
    newEn: 'Comprehensive Jyotish guide to Ketu (South Lunar Node) — shadow planet of detachment, moksha and past-life karma. Effects in 12 signs/houses, 7-year dasha, remedies.',
  },
};

const project = new Project({ tsConfigFilePath: 'tsconfig.json', skipAddingFilesFromTsConfig: true });
const src = project.addSourceFileAtPath(TARGET);
const pageMetaDecl = src.getVariableDeclarationOrThrow('PAGE_META');
const pageMetaObj = pageMetaDecl.getInitializerIfKindOrThrow(SyntaxKind.ObjectLiteralExpression);

let titleEntries = 0;
let descEntries = 0;
let routesSkipped = 0;
const report: string[] = [];

function getStringLit(node: import('ts-morph').Node | undefined) {
  if (!node) return null;
  return node.asKind(SyntaxKind.StringLiteral) ?? node.asKind(SyntaxKind.NoSubstitutionTemplateLiteral) ?? null;
}

function applyTitleShortening(routeMeta: import('ts-morph').ObjectLiteralExpression, route: string, { oldEn, newEn }: MetaShortening) {
  const titleProp = routeMeta.getProperty('title');
  if (!titleProp || titleProp.getKind() !== SyntaxKind.PropertyAssignment) return 0;
  const titleObj = titleProp.asKindOrThrow(SyntaxKind.PropertyAssignment).getInitializerIfKind(SyntaxKind.ObjectLiteralExpression);
  if (!titleObj) return 0;

  let n = 0;
  for (const e of titleObj.getProperties()) {
    if (e.getKind() !== SyntaxKind.PropertyAssignment) continue;
    const pa = e.asKindOrThrow(SyntaxKind.PropertyAssignment);
    const locale = pa.getName();
    const lit = getStringLit(pa.getInitializer());
    if (!lit) continue;
    const v = lit.getLiteralValue();
    let newV: string | null = null;
    if (locale === 'en') {
      if (v === oldEn) newV = newEn;
      else if (v === newEn) { /* idempotent */ }
      else report.push(`[warn] ${route}.title.en doesn't match expected — actual prefix: "${v.slice(0, 50)}…"`);
    } else if (v.includes(oldEn)) {
      newV = v.replace(oldEn, newEn);
    }
    if (newV && newV !== v) { lit.replaceWithText(JSON.stringify(newV)); n++; }
  }
  return n;
}

function applyDescShortening(routeMeta: import('ts-morph').ObjectLiteralExpression, route: string, { oldEn, newEn }: MetaShortening) {
  const descProp = routeMeta.getProperty('description');
  if (!descProp || descProp.getKind() !== SyntaxKind.PropertyAssignment) return 0;
  const descObj = descProp.asKindOrThrow(SyntaxKind.PropertyAssignment).getInitializerIfKind(SyntaxKind.ObjectLiteralExpression);
  if (!descObj) return 0;
  const enEntry = descObj.getProperty('en');
  if (!enEntry || enEntry.getKind() !== SyntaxKind.PropertyAssignment) return 0;
  const pa = enEntry.asKindOrThrow(SyntaxKind.PropertyAssignment);
  const lit = getStringLit(pa.getInitializer());
  if (!lit) return 0;
  const v = lit.getLiteralValue();
  if (v === newEn) return 0; // idempotent
  if (v !== oldEn) {
    report.push(`[warn] ${route}.description.en doesn't match expected — actual prefix: "${v.slice(0, 50)}…"`);
    return 0;
  }
  lit.replaceWithText(JSON.stringify(newEn));
  return 1;
}

for (const [route, sh] of Object.entries(TITLE_SHORTENINGS)) {
  const routeProp = pageMetaObj.getProperty(`'${route}'`) ?? pageMetaObj.getProperty(`"${route}"`);
  if (!routeProp || routeProp.getKind() !== SyntaxKind.PropertyAssignment) {
    report.push(`[skip] title route ${route} not found`); routesSkipped++; continue;
  }
  const meta = routeProp.asKindOrThrow(SyntaxKind.PropertyAssignment).getInitializerIfKindOrThrow(SyntaxKind.ObjectLiteralExpression);
  const n = applyTitleShortening(meta, route, sh);
  report.push(`[ok]   title ${route} — ${n} locale${n === 1 ? '' : 's'}`);
  titleEntries += n;
}
for (const [route, sh] of Object.entries(DESC_SHORTENINGS)) {
  const routeProp = pageMetaObj.getProperty(`'${route}'`) ?? pageMetaObj.getProperty(`"${route}"`);
  if (!routeProp || routeProp.getKind() !== SyntaxKind.PropertyAssignment) {
    report.push(`[skip] desc route ${route} not found`); routesSkipped++; continue;
  }
  const meta = routeProp.asKindOrThrow(SyntaxKind.PropertyAssignment).getInitializerIfKindOrThrow(SyntaxKind.ObjectLiteralExpression);
  const n = applyDescShortening(meta, route, sh);
  report.push(`[ok]   desc  ${route} — ${n}`);
  descEntries += n;
}

if (APPLY) {
  src.saveSync();
  console.log(`\nApplied: ${titleEntries} title entries (across ${Object.keys(TITLE_SHORTENINGS).length} routes) + ${descEntries} description entries (across ${Object.keys(DESC_SHORTENINGS).length} routes). Skipped ${routesSkipped} routes.`);
} else {
  console.log(`\nDRY-RUN — pass --apply to write. Would update ${titleEntries} title entries + ${descEntries} description entries (skipped ${routesSkipped}).`);
}
console.log();
for (const line of report) console.log(line);
