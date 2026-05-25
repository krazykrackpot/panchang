#!/usr/bin/env tsx
/**
 * Sprint 3: write 25 opengraph-image.tsx files using the shared
 * renderOgImage + resolveOgTitle helpers established in PR #180.
 * Each file is ~10 lines; this script generates them all consistently.
 */
import { writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';

interface OgSpec {
  /** Route segment under src/app/[locale]/, e.g. "mangal-dosha" or "calendar/regional/tamil" */
  route: string;
  /** PAGE_META key used by resolveOgTitle, e.g. "/mangal-dosha" */
  pageMetaKey: string;
  /** Fallback title if PAGE_META lookup fails. */
  fallbackTitle: string;
  /** Alt text (English, descriptive). */
  alt: string;
  /** ALL-CAPS tagline shown beneath the title. */
  tagline: string;
  /** Optional supporting footer line. */
  footer?: string;
}

const SPECS: OgSpec[] = [
  // Tools
  { route: 'mangal-dosha', pageMetaKey: '/mangal-dosha', fallbackTitle: 'Mangal Dosha Check', alt: 'Mangal Dosha — Mars Affliction Check', tagline: 'MANGLIK CHECK', footer: 'Severity · Cancellation · Remedies' },
  { route: 'kaal-sarp', pageMetaKey: '/kaal-sarp', fallbackTitle: 'Kaal Sarpa Dosha', alt: 'Kaal Sarpa Dosha — Rahu-Ketu Axis Analysis', tagline: 'RAHU–KETU AXIS', footer: '12 serpent formations · Cancellation conditions' },
  { route: 'pitra-dosha', pageMetaKey: '/pitra-dosha', fallbackTitle: 'Pitra Dosha', alt: 'Pitra Dosha — Ancestral Karma Analysis', tagline: 'ANCESTRAL KARMA', footer: 'Detection · Shraddha rites · Remedies' },
  { route: 'varshaphal', pageMetaKey: '/varshaphal', fallbackTitle: 'Varshaphal — Annual Forecast', alt: 'Varshaphal — Solar Return Annual Chart', tagline: 'TAJIKA SOLAR RETURN', footer: 'Muntha · Sahams · Mudda Dasha' },
  { route: 'kp-system', pageMetaKey: '/kp-system', fallbackTitle: 'KP System', alt: 'KP System — Krishnamurti Paddhati', tagline: 'SUB-LORD PRECISION', footer: 'Placidus houses · 249 sub-lords · Significators' },
  { route: 'sign-calculator', pageMetaKey: '/sign-calculator', fallbackTitle: 'Vedic Sign Calculator', alt: 'Vedic vs Western Sign Calculator', tagline: 'VEDIC + TROPICAL', footer: 'Find your Vedic Rashi · Compare with Western Sun sign' },
  { route: 'shraddha', pageMetaKey: '/shraddha', fallbackTitle: 'Shraddha Calculator', alt: 'Shraddha — Ancestral Tithi Calculator', tagline: 'ANCESTRAL TITHI', footer: 'Death tithi · Annual Shraddha date · Pitru Paksha' },
  { route: 'upagraha', pageMetaKey: '/upagraha', fallbackTitle: 'Upagraha Calculator', alt: 'Upagraha — Shadow Planet Sphutas', tagline: 'SHADOW PLANETS', footer: 'Mandi · Gulika · Dhuma · Vyatipata' },
  { route: 'devotional', pageMetaKey: '/devotional', fallbackTitle: 'Devotional Library', alt: 'Devotional — Mantras, Stotras, Aartis', tagline: 'BHAKTI LIBRARY', footer: 'Mantras · Stotras · Aartis · Chalisas' },
  { route: 'prashna', pageMetaKey: '/prashna', fallbackTitle: 'Prashna Kundali', alt: 'Prashna — Vedic Horary Astrology', tagline: 'VEDIC HORARY', footer: 'Ask the stars · Arudha Lagna · Moon analysis' },
  { route: 'prashna-ashtamangala', pageMetaKey: '/prashna-ashtamangala', fallbackTitle: 'Ashtamangala Prashna', alt: 'Ashtamangala Prashna — Kerala Horary', tagline: 'KERALA HORARY', footer: '8 ritual signs · 12 houses · Classical method' },
  { route: 'sky', pageMetaKey: '/sky', fallbackTitle: 'Live Sky View', alt: 'Live Sky — Real-time Planetary Positions', tagline: 'LIVE SKY', footer: 'Real-time graha positions · Signs · Nakshatras' },
  { route: 'vedic-time', pageMetaKey: '/vedic-time', fallbackTitle: 'Vedic Time Converter', alt: 'Vedic Time — Ghati Pala Vipala', tagline: 'ANCIENT TIME UNITS', footer: 'Ghati · Pala · Vipala · Muhurta · Prahara' },
  { route: 'tithi-pravesha', pageMetaKey: '/tithi-pravesha', fallbackTitle: 'Tithi Pravesha Birthday Chart', alt: 'Tithi Pravesha — Vedic Birthday Chart', tagline: 'VEDIC BIRTHDAY', footer: 'Sun–Moon angle recurrence · Year lord' },
  { route: 'cosmic-blueprint', pageMetaKey: '/cosmic-blueprint', fallbackTitle: 'Cosmic Blueprint', alt: 'Cosmic Blueprint — Your Celestial Signature', tagline: 'CELESTIAL SIGNATURE', footer: 'Sun · Moon · Lagna · Dasha lord · Life-domain scores' },
  { route: 'chandrabalam', pageMetaKey: '/chandrabalam', fallbackTitle: 'Chandrabalam', alt: 'Chandrabalam — Moon Strength Calculator', tagline: 'MOON STRENGTH', footer: '12-sign Moon transit · Daily Chandrabala for your Rashi' },
  { route: 'tarabalam', pageMetaKey: '/tarabalam', fallbackTitle: 'Tarabalam', alt: 'Tarabalam — Star Strength Calculator', tagline: 'STAR STRENGTH', footer: '27-nakshatra Tara cycle · 9 Tara phases' },
  // Regional calendars
  { route: 'calendar/regional/tamil', pageMetaKey: '/calendar/regional/tamil', fallbackTitle: 'Tamil Calendar 2026', alt: 'Tamil Panchangam 2026', tagline: 'TAMIL PANCHANGAM', footer: 'Chithirai New Year · Pongal · Festivals · Muhurtas' },
  { route: 'calendar/regional/bengali', pageMetaKey: '/calendar/regional/bengali', fallbackTitle: 'Bangla Calendar 2026', alt: 'Bengali Panjika 2026', tagline: 'BANGLA PANJIKA', footer: 'Pohela Boishakh · Durga Puja · Festivals' },
  { route: 'calendar/regional/mithila', pageMetaKey: '/calendar/regional/mithila', fallbackTitle: 'Mithila Panchang 2026', alt: 'Mithila Panchang 2026', tagline: 'MITHILA PANCHANG', footer: 'Maithili festivals · Sama Chakeva · Chhath' },
  { route: 'calendar/regional/telugu', pageMetaKey: '/calendar/regional/telugu', fallbackTitle: 'Telugu Panchangam 2026', alt: 'Telugu Panchangam 2026', tagline: 'TELUGU PANCHANGAM', footer: 'Ugadi · Bhogi · Sankranti · Festivals' },
  { route: 'calendar/regional/malayalam', pageMetaKey: '/calendar/regional/malayalam', fallbackTitle: 'Malayalam Panchangam 2026', alt: 'Malayalam Panchangam 2026', tagline: 'MALAYALAM PANCHANGAM', footer: 'Vishu · Onam · Festivals · Muhurtas' },
  { route: 'calendar/regional/gujarati', pageMetaKey: '/calendar/regional/gujarati', fallbackTitle: 'Gujarati Panchang 2026', alt: 'Gujarati Panchang 2026', tagline: 'VIKRAM SAMVAT', footer: 'Bestu Varas · Diwali · Navratri · Festivals' },
  { route: 'calendar/regional/kannada', pageMetaKey: '/calendar/regional/kannada', fallbackTitle: 'Kannada Panchanga 2026', alt: 'Kannada Panchanga 2026', tagline: 'KANNADA PANCHANGA', footer: 'Ugadi · Festivals · Muhurtas · Lunar months' },
  { route: 'calendar/regional/odia', pageMetaKey: '/calendar/regional/odia', fallbackTitle: 'Odia Panji 2026', alt: 'Odia Panji 2026', tagline: 'ODIA PANJI', footer: 'Pana Sankranti · Raja Parba · Jagannath calendar' },
];

const TEMPLATE = (spec: OgSpec) => `import { renderOgImage, resolveOgTitle, OG_SIZE, OG_CONTENT_TYPE } from '@/lib/seo/og-template';

export const runtime = 'edge';
export const alt = ${JSON.stringify(spec.alt)};
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default async function Image({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return renderOgImage({
    title: resolveOgTitle(${JSON.stringify(spec.pageMetaKey)}, locale, ${JSON.stringify(spec.fallbackTitle)}),
    tagline: ${JSON.stringify(spec.tagline)},
${spec.footer ? `    footer: ${JSON.stringify(spec.footer)},\n` : ''}  });
}
`;

let created = 0;
for (const spec of SPECS) {
  const path = `src/app/[locale]/${spec.route}/opengraph-image.tsx`;
  if (existsSync(path)) {
    console.log(`[skip] ${spec.route} — already exists`);
    continue;
  }
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, TEMPLATE(spec), 'utf8');
  console.log(`[write] ${spec.route}`);
  created++;
}

console.log(`\nCreated ${created} opengraph-image.tsx files.`);
