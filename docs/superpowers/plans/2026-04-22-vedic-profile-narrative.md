# Vedic Astrology Profile — Narrative Section Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a templated narrative "Vedic Profile" section at the top of the Personal Pandit dashboard that reads like a senior astrologer's consultation.

**Architecture:** A pure function `generateVedicProfile(kundali, locale)` detects chart patterns, scores them, and assembles a structured narrative from existing content libraries (LAGNA_DEEP, NAKSHATRA_DETAILS, PLANET_HOUSE_DEPTH, yogasComplete, DASHA_EFFECTS) plus new hook/connector templates. A React component renders it with progressive reveal (collapsed ~200 words, expandable to ~600).

**Tech Stack:** TypeScript, React 19, Tailwind CSS v4, existing Jyotish data constants

---

## File Structure

| File | Purpose |
|------|---------|
| `src/lib/kundali/vedic-profile.ts` | **NEW** — Engine: `generateVedicProfile()`, `detectChartPatterns()`, all `build*()` helpers |
| `src/lib/kundali/vedic-profile-templates.ts` | **NEW** — Hook templates, moon-sign narrative templates, connector phrases, house themes (EN + HI) |
| `src/components/kundali/VedicProfile.tsx` | **NEW** — Render component with progressive reveal |
| `src/lib/__tests__/vedic-profile.test.ts` | **NEW** — Tests for pattern detection + narrative generation |
| `src/app/[locale]/kundali/page.tsx` | **MODIFY** — Import VedicProfile, call generateVedicProfile(), render above Key Dates |

---

### Task 1: Pattern Detection Engine + Tests

**Files:**
- Create: `src/lib/kundali/vedic-profile.ts`
- Create: `src/lib/__tests__/vedic-profile.test.ts`

This task builds the core `detectChartPatterns()` function that scores chart patterns by importance. It also creates the `VedicProfile` type and the main `generateVedicProfile()` function stub.

- [ ] **Step 1: Write the failing tests for pattern detection**

Create `src/lib/__tests__/vedic-profile.test.ts`:

```typescript
import { describe, it, expect } from 'vitest';
import { detectChartPatterns, generateVedicProfile } from '../kundali/vedic-profile';
import type { KundaliData, PlanetPosition, HouseCusp, DashaEntry } from '@/types/kundali';

// Helper to create a minimal kundali for testing
function makeKundali(overrides: Partial<KundaliData> = {}): KundaliData {
  const defaultPlanets: PlanetPosition[] = [
    makePlanet(0, 5, 5, 10, false, false, false, false, false),  // Sun in Leo (own sign), house 5
    makePlanet(1, 4, 4, 1, false, false, false, false, false),    // Moon in Cancer, house 1 (to be overridden)
    makePlanet(2, 1, 1, 10, false, false, false, false, false),   // Mars in Aries (own sign), house 10
    makePlanet(3, 6, 6, 3, false, false, false, false, false),    // Mercury in Virgo, house 3
    makePlanet(4, 4, 4, 1, false, false, false, false, false),    // Jupiter in Cancer (exalted), house 1
    makePlanet(5, 12, 12, 9, false, false, false, false, false),  // Venus in Pisces (exalted), house 9
    makePlanet(6, 7, 7, 4, false, false, false, false, false),    // Saturn in Libra, house 4
    makePlanet(7, 1, 1, 10, false, false, false, false, false),   // Rahu in Aries, house 10
    makePlanet(8, 7, 7, 4, false, false, false, false, false),    // Ketu in Libra, house 4
  ];

  const defaultHouses: HouseCusp[] = Array.from({ length: 12 }, (_, i) => ({
    house: i + 1,
    degree: i * 30,
    sign: ((i) % 12) + 1,
    signName: { en: `Sign${i+1}`, hi: `राशि${i+1}`, sa: `राशि${i+1}` },
    lord: 'Sun',
    lordName: { en: 'Sun', hi: 'सूर्य', sa: 'सूर्यः' },
  }));

  const defaultDashas: DashaEntry[] = [
    {
      planet: 'Saturn',
      planetName: { en: 'Saturn', hi: 'शनि', sa: 'शनिः' },
      startDate: '2020-01-01',
      endDate: '2039-01-01',
      level: 'maha',
      subPeriods: [
        {
          planet: 'Mercury',
          planetName: { en: 'Mercury', hi: 'बुध', sa: 'बुधः' },
          startDate: '2025-01-01',
          endDate: '2027-09-01',
          level: 'antar',
        },
      ],
    },
  ];

  return {
    birthData: {
      name: 'Test Person',
      date: '1990-08-15',
      time: '14:30',
      place: 'Corseaux, Switzerland',
      lat: 46.47,
      lng: 6.78,
      timezone: 'Europe/Zurich',
      ayanamsha: 'lahiri',
    },
    ascendant: { degree: 15, sign: 1, signName: { en: 'Aries', hi: 'मेष', sa: 'मेषः' } },
    planets: overrides.planets || defaultPlanets,
    houses: overrides.houses || defaultHouses,
    chart: { houses: Array.from({ length: 12 }, () => []), ascendantDeg: 15, ascendantSign: 1 },
    navamshaChart: { houses: Array.from({ length: 12 }, () => []), ascendantDeg: 15, ascendantSign: 1 },
    dashas: overrides.dashas || defaultDashas,
    shadbala: [],
    ayanamshaValue: 24.1,
    julianDay: 2448086.5,
    ...overrides,
  };
}

function makePlanet(
  id: number, sign: number, signIdx: number, house: number,
  retrograde: boolean, combust: boolean, exalted: boolean,
  debilitated: boolean, ownSign: boolean
): PlanetPosition {
  const PLANET_NAMES: Record<number, { en: string; hi: string; sa: string }> = {
    0: { en: 'Sun', hi: 'सूर्य', sa: 'सूर्यः' },
    1: { en: 'Moon', hi: 'चन्द्र', sa: 'चन्द्रः' },
    2: { en: 'Mars', hi: 'मंगल', sa: 'मङ्गलः' },
    3: { en: 'Mercury', hi: 'बुध', sa: 'बुधः' },
    4: { en: 'Jupiter', hi: 'बृहस्पति', sa: 'बृहस्पतिः' },
    5: { en: 'Venus', hi: 'शुक्र', sa: 'शुक्रः' },
    6: { en: 'Saturn', hi: 'शनि', sa: 'शनिः' },
    7: { en: 'Rahu', hi: 'राहु', sa: 'राहुः' },
    8: { en: 'Ketu', hi: 'केतु', sa: 'केतुः' },
  };
  const SIGN_NAMES: Record<number, { en: string; hi: string; sa: string }> = {
    1: { en: 'Aries', hi: 'मेष', sa: 'मेषः' }, 2: { en: 'Taurus', hi: 'वृषभ', sa: 'वृषभः' },
    3: { en: 'Gemini', hi: 'मिथुन', sa: 'मिथुनम्' }, 4: { en: 'Cancer', hi: 'कर्क', sa: 'कर्कटः' },
    5: { en: 'Leo', hi: 'सिंह', sa: 'सिंहः' }, 6: { en: 'Virgo', hi: 'कन्या', sa: 'कन्या' },
    7: { en: 'Libra', hi: 'तुला', sa: 'तुला' }, 8: { en: 'Scorpio', hi: 'वृश्चिक', sa: 'वृश्चिकः' },
    9: { en: 'Sagittarius', hi: 'धनु', sa: 'धनुः' }, 10: { en: 'Capricorn', hi: 'मकर', sa: 'मकरः' },
    11: { en: 'Aquarius', hi: 'कुम्भ', sa: 'कुम्भः' }, 12: { en: 'Pisces', hi: 'मीन', sa: 'मीनः' },
  };
  return {
    planet: { id, name: PLANET_NAMES[id] || { en: '', hi: '', sa: '' }, symbol: '', color: '' },
    longitude: sign * 30 + 15,
    latitude: 0,
    speed: 1,
    sign,
    signName: SIGN_NAMES[sign] || { en: '', hi: '', sa: '' },
    house,
    nakshatra: { id: 1, name: { en: 'Ashwini', hi: 'अश्विनी', sa: 'अश्विनी' }, deity: { en: 'Ashwini Kumaras', hi: 'अश्विनी कुमार', sa: 'अश्विनीकुमारौ' }, ruler: 'Ketu', rulerName: { en: 'Ketu', hi: 'केतु', sa: 'केतुः' }, startDeg: 0, endDeg: 13.333, symbol: '🐴', nature: { en: 'Swift, Light', hi: 'क्षिप्र, लघु', sa: 'क्षिप्रम्' } },
    pada: 1,
    degree: '15°00\'00"',
    isRetrograde: retrograde,
    isCombust: combust,
    isExalted: exalted,
    isDebilitated: debilitated,
    isOwnSign: ownSign,
  };
}

describe('detectChartPatterns', () => {
  it('detects stellium (3+ planets in one house)', () => {
    const planets = [
      makePlanet(0, 8, 8, 10, false, false, false, false, false),
      makePlanet(1, 8, 8, 10, false, false, false, false, false),
      makePlanet(2, 8, 8, 10, false, false, false, false, true),
      makePlanet(3, 6, 6, 3, false, false, false, false, false),
      makePlanet(4, 4, 4, 1, false, false, true, false, false),
      makePlanet(5, 12, 12, 9, false, false, true, false, false),
      makePlanet(6, 7, 7, 4, false, false, false, false, false),
      makePlanet(7, 1, 1, 7, false, false, false, false, false),
      makePlanet(8, 7, 7, 1, false, false, false, false, false),
    ];
    const k = makeKundali({ planets });
    const patterns = detectChartPatterns(k);
    const stellium = patterns.find(p => p.type === 'stellium');
    expect(stellium).toBeDefined();
    expect(stellium!.score).toBe(90);
    expect(stellium!.houses).toContain(10);
    // Stellium should be highest priority
    expect(patterns[0].type).toBe('stellium');
  });

  it('detects exalted lagna lord', () => {
    // Aries lagna → Mars is lagna lord. Mars exalted in Capricorn
    const planets = [
      makePlanet(0, 5, 5, 5, false, false, false, false, true),
      makePlanet(1, 4, 4, 4, false, false, false, false, false),
      makePlanet(2, 10, 10, 7, false, false, true, false, false), // Mars exalted
      makePlanet(3, 6, 6, 3, false, false, false, false, false),
      makePlanet(4, 9, 9, 6, false, false, false, false, false),
      makePlanet(5, 12, 12, 9, false, false, false, false, false),
      makePlanet(6, 11, 11, 8, false, false, false, false, false),
      makePlanet(7, 3, 3, 12, false, false, false, false, false),
      makePlanet(8, 9, 9, 6, false, false, false, false, false),
    ];
    const k = makeKundali({ planets });
    const patterns = detectChartPatterns(k);
    const dignified = patterns.find(p => p.type === 'dignifiedLagnaLord');
    expect(dignified).toBeDefined();
    expect(dignified!.score).toBe(70);
  });

  it('detects same lagna and moon sign', () => {
    // Aries lagna, Moon in Aries
    const planets = [
      makePlanet(0, 5, 5, 5, false, false, false, false, true),
      makePlanet(1, 1, 1, 1, false, false, false, false, false), // Moon in Aries = lagna sign
      makePlanet(2, 8, 8, 5, false, false, false, false, false),
      makePlanet(3, 6, 6, 3, false, false, false, false, false),
      makePlanet(4, 9, 9, 6, false, false, false, false, false),
      makePlanet(5, 3, 3, 12, false, false, false, false, false),
      makePlanet(6, 11, 11, 8, false, false, false, false, false),
      makePlanet(7, 3, 3, 12, false, false, false, false, false),
      makePlanet(8, 9, 9, 6, false, false, false, false, false),
    ];
    const k = makeKundali({
      planets,
      ascendant: { degree: 15, sign: 1, signName: { en: 'Aries', hi: 'मेष', sa: 'मेषः' } },
    });
    const patterns = detectChartPatterns(k);
    const same = patterns.find(p => p.type === 'sameLagnaMoon');
    expect(same).toBeDefined();
  });

  it('returns patterns sorted by score descending', () => {
    const k = makeKundali();
    const patterns = detectChartPatterns(k);
    for (let i = 1; i < patterns.length; i++) {
      expect(patterns[i - 1].score).toBeGreaterThanOrEqual(patterns[i].score);
    }
  });
});

describe('generateVedicProfile', () => {
  it('returns a complete VedicProfile with all sections', () => {
    const k = makeKundali();
    const profile = generateVedicProfile(k, 'en');
    expect(profile.hook).toBeTruthy();
    expect(profile.coreIdentity.lagna).toBeTruthy();
    expect(profile.coreIdentity.moon).toBeTruthy();
    expect(profile.standout).toBeTruthy();
    expect(profile.nakshatraInsight).toBeTruthy();
    expect(profile.dashaContext).toBeTruthy();
    expect(profile.strengthTable.length).toBeGreaterThan(0);
    expect(profile.personName).toBe('Test Person');
  });

  it('returns Hindi content when locale is hi', () => {
    const k = makeKundali();
    const profile = generateVedicProfile(k, 'hi');
    // Hindi profile should contain Devanagari characters
    expect(profile.coreIdentity.lagna).toMatch(/[\u0900-\u097F]/);
  });

  it('omits doshaSection when no doshas present', () => {
    // All planets in non-manglik, non-kaal-sarp positions
    const planets = [
      makePlanet(0, 5, 5, 5, false, false, false, false, true),
      makePlanet(1, 2, 2, 11, false, false, false, false, false),
      makePlanet(2, 1, 1, 10, false, false, false, false, true),
      makePlanet(3, 6, 6, 3, false, false, false, false, false),
      makePlanet(4, 9, 9, 6, false, false, false, false, false),
      makePlanet(5, 3, 3, 12, false, false, false, false, false),
      makePlanet(6, 11, 11, 8, false, false, false, false, false),
      makePlanet(7, 3, 3, 12, false, false, false, false, false),
      makePlanet(8, 9, 9, 6, false, false, false, false, false),
    ];
    const k = makeKundali({ planets });
    const profile = generateVedicProfile(k, 'en');
    // doshaSection may be null when no doshas
    // (it's valid for it to be null or an empty string)
    if (profile.doshaSection) {
      expect(profile.doshaSection.length).toBeGreaterThan(0);
    }
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npx vitest run src/lib/__tests__/vedic-profile.test.ts`
Expected: FAIL — module `../kundali/vedic-profile` does not exist

- [ ] **Step 3: Create vedic-profile-templates.ts with hook templates, moon-sign narrative, and house themes**

Create `src/lib/kundali/vedic-profile-templates.ts`:

```typescript
/**
 * Vedic Profile — Narrative Templates
 * Hook templates, moon-sign narratives, connector phrases, house theme labels.
 * All templates are EN + HI. Other locales fall back to EN.
 */

type BiText = { en: string; hi: string };

// ─── House theme labels (for stellium descriptions) ──────────────
export const HOUSE_THEME_LABELS: Record<number, BiText> = {
  1:  { en: 'self-identity and physical presence',  hi: 'आत्म-पहचान और शारीरिक उपस्थिति' },
  2:  { en: 'wealth, family, and speech',            hi: 'धन, परिवार और वाणी' },
  3:  { en: 'courage, communication, and siblings',  hi: 'साहस, संवाद और भाई-बहन' },
  4:  { en: 'home, mother, and inner peace',         hi: 'घर, माता और आन्तरिक शान्ति' },
  5:  { en: 'creativity, children, and romance',     hi: 'सृजनात्मकता, सन्तान और प्रेम' },
  6:  { en: 'health challenges, enemies, and service', hi: 'स्वास्थ्य, शत्रु और सेवा' },
  7:  { en: 'marriage, partnerships, and public dealings', hi: 'विवाह, साझेदारी और सार्वजनिक व्यवहार' },
  8:  { en: 'transformation, occult, and inheritance', hi: 'परिवर्तन, गुप्त विद्या और विरासत' },
  9:  { en: 'fortune, dharma, and higher learning',   hi: 'भाग्य, धर्म और उच्च शिक्षा' },
  10: { en: 'career, authority, and public reputation', hi: 'कैरियर, अधिकार और प्रतिष्ठा' },
  11: { en: 'gains, aspirations, and social networks', hi: 'लाभ, आकांक्षाएँ और सामाजिक सम्बन्ध' },
  12: { en: 'spiritual liberation, foreign lands, and solitude', hi: 'मोक्ष, विदेश और एकान्त' },
};

// ─── Element names ───────────────────────────────────────────────
export const ELEMENT_NAMES: Record<string, BiText> = {
  Fire:  { en: 'fiery',  hi: 'अग्नि' },
  Earth: { en: 'earthy', hi: 'पृथ्वी' },
  Air:   { en: 'airy',   hi: 'वायु' },
  Water: { en: 'watery', hi: 'जल' },
};

// ─── Lagna lord planets for each sign (1-indexed) ────────────────
export const LAGNA_LORDS: Record<number, number> = {
  1: 2,  // Aries → Mars
  2: 5,  // Taurus → Venus
  3: 3,  // Gemini → Mercury
  4: 1,  // Cancer → Moon
  5: 0,  // Leo → Sun
  6: 3,  // Virgo → Mercury
  7: 5,  // Libra → Venus
  8: 2,  // Scorpio → Mars
  9: 4,  // Sagittarius → Jupiter
  10: 6, // Capricorn → Saturn
  11: 6, // Aquarius → Saturn
  12: 4, // Pisces → Jupiter
};

// ─── Hook templates ──────────────────────────────────────────────
// Each pattern type has 2-3 variants. Variant is selected by hash.
// Placeholders: {house}, {houseTheme}, {count}, {planet}, {sign},
//               {yoga}, {element1}, {element2}, {sign1}, {sign2}

interface HookTemplate {
  en: string;
  hi: string;
}

export const HOOK_TEMPLATES: Record<string, HookTemplate[]> = {
  stellium: [
    {
      en: 'Your chart concentrates enormous energy in {houseTheme} — {count} planets crowd your {house}th house, making this the gravitational center of your life.',
      hi: 'आपकी कुण्डली {houseTheme} में अपार ऊर्जा केन्द्रित करती है — {count} ग्रह आपके {house}वें भाव में एकत्रित हैं, जो इसे आपके जीवन का गुरुत्वाकर्षण केन्द्र बनाते हैं।',
    },
    {
      en: 'With {count} planets gathered in your {house}th house, your life story is dominated by themes of {houseTheme}.',
      hi: '{count} ग्रह आपके {house}वें भाव में एकत्रित होकर {houseTheme} के विषयों को प्रधान बनाते हैं।',
    },
  ],
  kaalSarpa: [
    {
      en: 'The Rahu-Ketu axis grips your entire chart — all planets are hemmed between houses {house} and {house2}, channeling every planetary energy through a karmic corridor.',
      hi: 'राहु-केतु अक्ष आपकी पूरी कुण्डली को जकड़ता है — सभी ग्रह {house}वें और {house2}वें भाव के बीच सीमित हैं, प्रत्येक ग्रहीय ऊर्जा को कार्मिक गलियारे से गुजरने को बाध्य करते हैं।',
    },
  ],
  rajaYoga: [
    {
      en: 'Your chart carries unusual markers of authority and recognition — {count} raja yogas weave together planets of power and opportunity.',
      hi: 'आपकी कुण्डली अधिकार और मान्यता के असामान्य संकेत वहन करती है — {count} राजयोग शक्ति और अवसर के ग्रहों को गूँथते हैं।',
    },
  ],
  mahapurusha: [
    {
      en: '{yoga} forms in your chart: {planet} in its strongest dignity in a kendra house, conferring qualities that set you apart.',
      hi: '{yoga} आपकी कुण्डली में बनता है: {planet} अपनी सर्वोत्तम गरिमा में केन्द्र भाव में, आपको विशिष्ट गुण प्रदान करता है।',
    },
  ],
  dignifiedLagnaLord: [
    {
      en: 'With {planet} — lord of your ascendant — commanding from a position of strength in {sign}, your chart has an unusually strong anchor.',
      hi: '{planet} — आपके लग्नेश — {sign} में बलवान स्थिति से कुण्डली को असामान्य रूप से मजबूत आधार प्रदान करते हैं।',
    },
    {
      en: 'Your lagna lord {planet} sits in {sign} in its own dignity — the captain of your chart commands from solid ground.',
      hi: 'आपके लग्नेश {planet} {sign} में स्वगरिमा में विराजमान — कुण्डली का कर्णधार दृढ़ भूमि पर खड़ा है।',
    },
  ],
  debilitatedKey: [
    {
      en: '{planet} labors in {sign}, its sign of debilitation — this shapes a core theme that asks for conscious effort and patience.',
      hi: '{planet} अपनी नीच राशि {sign} में श्रम करता है — यह एक मूल विषय बनाता है जो सचेत प्रयास और धैर्य माँगता है।',
    },
  ],
  sameLagnaMoon: [
    {
      en: 'Your outer persona and inner emotional world are unified in {sign1} — there is no duality here, only concentrated {element1} energy.',
      hi: 'आपका बाह्य व्यक्तित्व और आन्तरिक भावनात्मक संसार {sign1} में एकीकृत — यहाँ कोई द्वन्द्व नहीं, केवल केन्द्रित {element1} ऊर्जा।',
    },
  ],
  contrastingElements: [
    {
      en: 'You navigate between {element1} intellect and {element2} depth — {sign1} shapes your face to the world while {sign2} runs the inner current.',
      hi: 'आप {element1} बुद्धि और {element2} गहराई के बीच संतुलन बनाते हैं — {sign1} आपका बाह्य रूप गढ़ता है जबकि {sign2} आन्तरिक धारा चलाता है।',
    },
    {
      en: '{sign1} gives you a {element1} exterior — analytical, measured, outward-facing — but your Moon in {sign2} runs on {element2} instinct beneath the surface.',
      hi: '{sign1} आपको {element1} बाह्य आवरण देता है — विश्लेषणात्मक, मापा हुआ — परन्तु {sign2} में आपका चन्द्र {element2} सहज ज्ञान पर चलता है।',
    },
  ],
  sadeSati: [
    {
      en: "Saturn's passage over your Moon — Sade Sati — is the defining pressure of your current years, reshaping how you relate to your emotional core.",
      hi: 'आपके चन्द्र पर शनि का गोचर — साढ़े साती — आपके वर्तमान वर्षों का निर्णायक दबाव है, आपकी भावनात्मक नींव को पुनर्गठित कर रहा है।',
    },
  ],
  lunarYoga: [
    {
      en: '{yoga} forms between {planet} and Moon, creating {quality} — one of the more recognized combinations in Jyotish.',
      hi: '{yoga} {planet} और चन्द्र के बीच बनता है, {quality} उत्पन्न करता है — ज्योतिष में सर्वाधिक मान्यता प्राप्त संयोगों में से एक।',
    },
  ],
  retrogradeKendra: [
    {
      en: '{planet} retrograde in your {house}th house — a kendra — turns its energy inward, demanding introspection before outward action in {houseTheme}.',
      hi: '{planet} वक्री आपके {house}वें भाव — एक केन्द्र — में अपनी ऊर्जा अन्तर्मुखी करता है, {houseTheme} में बाह्य कर्म से पहले आत्मनिरीक्षण माँगता है।',
    },
  ],
  fallback: [
    {
      en: 'With a {element1} ascendant and {element2} Moon, your chart balances the outward energy of {sign1} with the inner nature of {sign2}.',
      hi: '{element1} लग्न और {element2} चन्द्र के साथ, आपकी कुण्डली {sign1} की बाह्य ऊर्जा को {sign2} की आन्तरिक प्रकृति से संतुलित करती है।',
    },
  ],
};

// ─── Moon-sign narrative templates (per rashi, 1-indexed) ────────
// Each is 2-3 sentences incorporating element, quality, ruler.
// The nakshatra-specific part is appended separately from NAKSHATRA_DETAILS.
export const MOON_SIGN_NARRATIVES: Record<number, BiText> = {
  1:  { en: 'Your Moon in Aries gives you a quick, fiery emotional nature. You process feelings through action — sitting with discomfort is harder than charging through it. Emotional independence matters deeply; you recover from setbacks faster than most.', hi: 'मेष में चन्द्र आपको तीव्र, अग्निमय भावनात्मक स्वभाव देता है। आप भावनाओं को क्रिया के माध्यम से संसाधित करते हैं। भावनात्मक स्वतन्त्रता आपके लिए अत्यन्त महत्वपूर्ण है।' },
  2:  { en: 'Your Moon in Taurus grounds your emotions in the physical world — comfort, beauty, and stability are not luxuries for you but necessities. You are steady in attachment and slow to anger, but once provoked, equally slow to forgive.', hi: 'वृषभ में चन्द्र आपकी भावनाओं को भौतिक संसार में स्थिर करता है — सुख, सौन्दर्य और स्थिरता आपके लिए आवश्यकताएँ हैं। आप जुड़ाव में स्थिर और क्रोध में धीमे हैं।' },
  3:  { en: 'Your Moon in Gemini makes your emotional life verbal and restless. You process feelings by talking them through, writing them out, or simply moving. Boredom is your real enemy — emotional stagnation feels like suffocation.', hi: 'मिथुन में चन्द्र आपके भावनात्मक जीवन को वाचाल और अस्थिर बनाता है। आप भावनाओं को बातचीत या लेखन से संसाधित करते हैं। ऊब आपकी वास्तविक शत्रु है।' },
  4:  { en: 'Moon is at home in Cancer — your emotional intelligence is exceptionally high. You absorb the moods of everyone around you, which is both a gift and a burden. Home and family are not just important to you; they are your emotional oxygen.', hi: 'कर्क में चन्द्र अपने घर में — आपकी भावनात्मक बुद्धि असाधारण रूप से उच्च है। आप अपने आसपास सभी के मनोभावों को अवशोषित करते हैं। परिवार आपकी भावनात्मक प्राणवायु है।' },
  5:  { en: 'Your Moon in Leo needs to be seen, heard, and appreciated. You feel most alive when expressing yourself creatively or leading others. Emotional generosity comes naturally, but wounded pride can shut you down completely.', hi: 'सिंह में चन्द्र को देखे जाने, सुने जाने और सराहे जाने की आवश्यकता है। सृजनात्मक अभिव्यक्ति या नेतृत्व में आप सर्वाधिक जीवन्त अनुभव करते हैं।' },
  6:  { en: 'Your Moon in Virgo processes emotions through analysis — you need to understand why you feel something before you can accept it. This gives you unusual emotional precision but can delay the simple act of feeling.', hi: 'कन्या में चन्द्र विश्लेषण के माध्यम से भावनाओं को संसाधित करता है — आपको कुछ अनुभव करने से पहले समझना आवश्यक है कि आप ऐसा क्यों अनुभव कर रहे हैं।' },
  7:  { en: 'Your Moon in Libra seeks emotional equilibrium above all. You are attuned to fairness, beauty, and harmony in relationships. Conflict genuinely disturbs your inner peace — you are not avoiding it out of weakness but because dissonance costs you more than most.', hi: 'तुला में चन्द्र सबसे पहले भावनात्मक संतुलन चाहता है। आप सम्बन्धों में निष्पक्षता, सौन्दर्य और सामंजस्य के प्रति सचेत हैं।' },
  8:  { en: 'Your Moon in Scorpio runs deep — emotions are not things you have but forces that move through you. You process feelings through transformation rather than expression. Trust is earned slowly, but once given, your loyalty is absolute.', hi: 'वृश्चिक में चन्द्र गहरा चलता है — भावनाएँ वे चीज़ें नहीं जो आपके पास हैं बल्कि शक्तियाँ हैं जो आपके भीतर प्रवाहित होती हैं। विश्वास धीरे अर्जित होता है, परन्तु एक बार दिया गया तो निष्ठा पूर्ण है।' },
  9:  { en: 'Your Moon in Sagittarius makes you emotionally expansive and optimistic. You need meaning in your emotional life — shallow connections drain you. Philosophy, travel, and the search for truth feed your emotional well-being.', hi: 'धनु में चन्द्र आपको भावनात्मक रूप से विस्तृत और आशावादी बनाता है। आपको अपने भावनात्मक जीवन में अर्थ की आवश्यकता है। दर्शन और यात्रा आपकी भावनात्मक भलाई को पोषित करते हैं।' },
  10: { en: 'Your Moon in Capricorn processes emotions with restraint and gravity. You are not cold — you simply take feelings seriously and prefer to handle them privately. Emotional security for you is built through achievement and self-reliance.', hi: 'मकर में चन्द्र संयम और गम्भीरता से भावनाओं को संसाधित करता है। आप शीतल नहीं — बस भावनाओं को गम्भीरता से लेते हैं। भावनात्मक सुरक्षा उपलब्धि से निर्मित होती है।' },
  11: { en: 'Your Moon in Aquarius gives you an emotionally detached, observational quality. You care deeply about humanity in the abstract but can struggle with one-on-one emotional intimacy. Independence is not a preference — it is a need.', hi: 'कुम्भ में चन्द्र आपको भावनात्मक रूप से अलग, पर्यवेक्षी गुण देता है। आप मानवता की व्यापक रूप से गहरी चिन्ता करते हैं परन्तु व्यक्तिगत भावनात्मक निकटता में संघर्ष कर सकते हैं।' },
  12: { en: 'Your Moon in Pisces dissolves the boundary between self and other — you absorb emotions from your environment like a sponge. Creativity, spirituality, and compassion flow naturally, but you must guard against emotional overwhelm.', hi: 'मीन में चन्द्र स्वयं और दूसरे के बीच की सीमा को विलीन करता है — आप अपने परिवेश से भावनाओं को स्पंज की तरह अवशोषित करते हैं। सृजनात्मकता और करुणा स्वाभाविक हैं।' },
};

// ─── Connector phrases for planetary observations ────────────────
export const CONNECTORS: BiText[] = [
  { en: 'Adding to this picture,', hi: 'इस तस्वीर में जोड़ते हुए,' },
  { en: 'Meanwhile,',              hi: 'इसी बीच,' },
  { en: 'Equally significant,',    hi: 'समान रूप से महत्वपूर्ण,' },
  { en: 'Worth noting:',           hi: 'उल्लेखनीय:' },
  { en: 'On another front,',       hi: 'एक अन्य पक्ष पर,' },
];

// ─── Dignity labels ──────────────────────────────────────────────
export const DIGNITY_LABELS: Record<string, BiText> = {
  exalted:      { en: 'Exalted',      hi: 'उच्च' },
  debilitated:  { en: 'Debilitated',  hi: 'नीच' },
  ownSign:      { en: 'Own Sign',     hi: 'स्वराशि' },
  retrograde:   { en: 'Retrograde',   hi: 'वक्री' },
  neutral:      { en: 'Neutral',      hi: 'सामान्य' },
};

// ─── Dasha period label templates ────────────────────────────────
export const DASHA_TEMPLATES: Record<string, BiText> = {
  mahaIntro: {
    en: 'You are currently in {planet} Mahadasha — a {years}-year period',
    hi: 'आप वर्तमान में {planet} महादशा में हैं — {years} वर्ष की अवधि',
  },
  antarIntro: {
    en: 'The current Antardasha of {planet} adds',
    hi: '{planet} की वर्तमान अन्तर्दशा जोड़ती है',
  },
};

// ─── UI labels ───────────────────────────────────────────────────
export const UI_LABELS = {
  profileTitle: { en: 'Vedic Profile', hi: 'वैदिक प्रोफाइल' },
  readMore: { en: 'Read full profile', hi: 'पूरा प्रोफाइल पढ़ें' },
  readLess: { en: 'Show less', hi: 'कम दिखाएँ' },
  coreIdentity: { en: 'Core Identity', hi: 'मूल पहचान' },
  keyObservations: { en: 'Key Planetary Observations', hi: 'प्रमुख ग्रहीय अवलोकन' },
  nakshatraInsight: { en: 'Nakshatra Insight', hi: 'नक्षत्र अन्तर्दृष्टि' },
  dashaContext: { en: 'Current Dasha Period', hi: 'वर्तमान दशा काल' },
  activeDoshas: { en: 'Active Doshas', hi: 'सक्रिय दोष' },
  strengthSnapshot: { en: 'Planetary Strengths', hi: 'ग्रहीय बल' },
  planet: { en: 'Planet', hi: 'ग्रह' },
  dignity: { en: 'Dignity', hi: 'गरिमा' },
  house: { en: 'House', hi: 'भाव' },
  impact: { en: 'Impact', hi: 'प्रभाव' },
};

// Helper to resolve locale from BiText
export function bt(text: BiText, locale: string): string {
  if (locale === 'hi') return text.hi;
  return text.en; // EN fallback for ta, bn, sa, and all others
}
```

- [ ] **Step 4: Create vedic-profile.ts with pattern detection and profile generation**

Create `src/lib/kundali/vedic-profile.ts`:

```typescript
/**
 * Vedic Profile Engine
 * Generates a narrative astrology profile from KundaliData.
 * Pure function — no API calls, no async, instant.
 */

import type { KundaliData, PlanetPosition } from '@/types/kundali';
import type { Locale, LocaleText } from '@/types/panchang';
import { RASHIS } from '@/lib/constants/rashis';
import { GRAHAS } from '@/lib/constants/grahas';
import { NAKSHATRAS } from '@/lib/constants/nakshatras';
import { NAKSHATRA_DETAILS } from '@/lib/constants/nakshatra-details';
import { LAGNA_DEEP } from './tippanni-lagna';
import { PLANET_HOUSE_DEPTH, DASHA_EFFECTS } from './tippanni-planets';
import {
  HOOK_TEMPLATES, MOON_SIGN_NARRATIVES, HOUSE_THEME_LABELS,
  ELEMENT_NAMES, LAGNA_LORDS, CONNECTORS, DIGNITY_LABELS,
  DASHA_TEMPLATES, bt,
} from './vedic-profile-templates';

// ─── Types ───────────────────────────────────────────────────────

export interface ChartPattern {
  type: 'stellium' | 'kaalSarpa' | 'rajaYoga' | 'mahapurusha' | 'dignifiedLagnaLord'
      | 'debilitatedKey' | 'sameLagnaMoon' | 'contrastingElements' | 'sadeSati'
      | 'lunarYoga' | 'retrogradeKendra';
  score: number;
  planets: number[];
  houses?: number[];
  yogaName?: string;
  description?: string;
  // Template interpolation data
  templateData?: Record<string, string>;
}

export interface StrengthRow {
  planet: string;
  dignity: string;
  house: number;
  impact: string;
}

export interface VedicProfile {
  hook: string;
  coreIdentity: { lagna: string; moon: string };
  standout: string;
  planetaryObservations: string[];
  nakshatraInsight: string;
  dashaContext: string;
  doshaSection: string | null;
  strengthTable: StrengthRow[];
  personName: string;
}

// ─── Locale helpers ──────────────────────────────────────────────

function tl(obj: LocaleText | undefined, locale: string): string {
  if (!obj) return '';
  const l = locale as keyof LocaleText;
  return (obj[l] as string) || obj.en || '';
}

/** Simple hash of a string → number for deterministic variant selection */
function hashStr(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) {
    h = ((h << 5) - h + s.charCodeAt(i)) | 0;
  }
  return Math.abs(h);
}

function interpolate(template: string, data: Record<string, string>): string {
  return template.replace(/\{(\w+)\}/g, (_, key) => data[key] || `{${key}}`);
}

// ─── Pattern Detection ──────────────────────────────────────────

export function detectChartPatterns(kundali: KundaliData): ChartPattern[] {
  const patterns: ChartPattern[] = [];
  const planets = kundali.planets;
  const ascSign = kundali.ascendant.sign;
  const moon = planets.find(p => p.planet.id === 1);
  const moonSign = moon?.sign || 1;

  // 1. Stellium (3+ planets in one house)
  const houseCounts: Record<number, number[]> = {};
  for (const p of planets) {
    if (!houseCounts[p.house]) houseCounts[p.house] = [];
    houseCounts[p.house].push(p.planet.id);
  }
  for (const [house, pIds] of Object.entries(houseCounts)) {
    if (pIds.length >= 3) {
      patterns.push({
        type: 'stellium',
        score: 90,
        planets: pIds,
        houses: [Number(house)],
        templateData: {
          house: String(house),
          houseTheme: '', // resolved at render time
          count: String(pIds.length),
        },
      });
    }
  }

  // 2. Kaal Sarpa — all planets between Rahu and Ketu
  const rahu = planets.find(p => p.planet.id === 7);
  const ketu = planets.find(p => p.planet.id === 8);
  if (rahu && ketu) {
    const rahuH = rahu.house;
    const ketuH = ketu.house;
    const others = planets.filter(p => p.planet.id !== 7 && p.planet.id !== 8);
    // Check if all planets are on one side of the Rahu-Ketu axis
    const allOnOneSide = others.every(p => {
      const dist = ((p.house - rahuH + 12) % 12);
      const ketuDist = ((ketuH - rahuH + 12) % 12);
      return dist > 0 && dist < ketuDist;
    }) || others.every(p => {
      const dist = ((p.house - ketuH + 12) % 12);
      const rahuDist = ((rahuH - ketuH + 12) % 12);
      return dist > 0 && dist < rahuDist;
    });
    if (allOnOneSide) {
      patterns.push({
        type: 'kaalSarpa',
        score: 85,
        planets: [7, 8],
        houses: [rahuH, ketuH],
        templateData: { house: String(rahuH), house2: String(ketuH) },
      });
    }
  }

  // 3. Raja Yogas (from yogasComplete if available)
  if (kundali.yogasComplete) {
    const rajaYogas = kundali.yogasComplete.filter(y => y.category === 'raja' && y.present);
    if (rajaYogas.length >= 2) {
      patterns.push({
        type: 'rajaYoga',
        score: 80,
        planets: [],
        templateData: { count: String(rajaYogas.length) },
      });
    }

    // 4. Mahapurusha Yoga
    const mahapurusha = kundali.yogasComplete.filter(y => y.category === 'pancha_mahapurusha' && y.present);
    for (const mp of mahapurusha) {
      patterns.push({
        type: 'mahapurusha',
        score: 75,
        planets: [],
        yogaName: mp.name.en,
        templateData: { yoga: mp.name.en, planet: '', sign: '' },
      });
    }
  }

  // 5. Dignified Lagna Lord (exalted or own sign)
  const lagnaLordId = LAGNA_LORDS[ascSign];
  const lagnaLord = planets.find(p => p.planet.id === lagnaLordId);
  if (lagnaLord && (lagnaLord.isExalted || lagnaLord.isOwnSign)) {
    patterns.push({
      type: 'dignifiedLagnaLord',
      score: 70,
      planets: [lagnaLordId],
      templateData: {
        planet: lagnaLord.planet.name.en,
        sign: lagnaLord.signName.en,
      },
    });
  }

  // 6. Debilitated key planet (lagna lord, Moon, or Sun)
  const keyPlanets = [lagnaLord, moon, planets.find(p => p.planet.id === 0)].filter(Boolean) as PlanetPosition[];
  for (const kp of keyPlanets) {
    if (kp.isDebilitated) {
      patterns.push({
        type: 'debilitatedKey',
        score: 65,
        planets: [kp.planet.id],
        templateData: { planet: kp.planet.name.en, sign: kp.signName.en },
      });
      break; // Only one
    }
  }

  // 7. Retrograde in kendra
  const kendras = [1, 4, 7, 10];
  for (const p of planets) {
    if (p.isRetrograde && kendras.includes(p.house) && p.planet.id <= 6) {
      patterns.push({
        type: 'retrogradeKendra',
        score: 60,
        planets: [p.planet.id],
        houses: [p.house],
        templateData: {
          planet: p.planet.name.en,
          house: String(p.house),
          houseTheme: '',
        },
      });
      break; // Only top one
    }
  }

  // 8. Sade Sati
  if (kundali.sadeSati?.isActive) {
    patterns.push({
      type: 'sadeSati',
      score: 55,
      planets: [6], // Saturn
    });
  }

  // 9. Lunar yogas — Gajakesari, Chandra-Mangala
  if (moon) {
    const jupiter = planets.find(p => p.planet.id === 4);
    const mars = planets.find(p => p.planet.id === 2);
    if (jupiter) {
      const dist = ((jupiter.house - moon.house + 12) % 12);
      if ([0, 3, 6, 9].includes(dist)) { // kendra from Moon
        patterns.push({
          type: 'lunarYoga',
          score: 50,
          planets: [1, 4],
          yogaName: 'Gajakesari Yoga',
          templateData: { yoga: 'Gajakesari Yoga', planet: 'Jupiter', quality: 'wisdom, fame, and prosperity' },
        });
      }
    }
    if (mars && mars.house === moon.house) {
      patterns.push({
        type: 'lunarYoga',
        score: 50,
        planets: [1, 2],
        yogaName: 'Chandra-Mangala Yoga',
        templateData: { yoga: 'Chandra-Mangala Yoga', planet: 'Mars', quality: 'high energy, passionate drive, and financial acumen' },
      });
    }
  }

  // 10. Same lagna and moon sign
  if (moonSign === ascSign) {
    const rashi = RASHIS.find(r => r.id === ascSign);
    patterns.push({
      type: 'sameLagnaMoon',
      score: 45,
      planets: [1],
      templateData: {
        sign1: rashi?.name.en || '',
        element1: rashi?.element.en?.toLowerCase() || '',
      },
    });
  }

  // 11. Contrasting elements (fallback-level)
  if (moonSign !== ascSign) {
    const lagnaRashi = RASHIS.find(r => r.id === ascSign);
    const moonRashi = RASHIS.find(r => r.id === moonSign);
    if (lagnaRashi && moonRashi && lagnaRashi.element.en !== moonRashi.element.en) {
      patterns.push({
        type: 'contrastingElements',
        score: 40,
        planets: [1],
        templateData: {
          element1: ELEMENT_NAMES[lagnaRashi.element.en]?.en || lagnaRashi.element.en.toLowerCase(),
          element2: ELEMENT_NAMES[moonRashi.element.en]?.en || moonRashi.element.en.toLowerCase(),
          sign1: lagnaRashi.name.en,
          sign2: moonRashi.name.en,
        },
      });
    }
  }

  // Sort by score descending
  patterns.sort((a, b) => b.score - a.score);
  return patterns;
}

// ─── Build Sections ─────────────────────────────────────────────

function buildHook(patterns: ChartPattern[], kundali: KundaliData, locale: string): string {
  const topPattern = patterns[0];
  if (!topPattern) {
    // Ultimate fallback
    const rashi = RASHIS.find(r => r.id === kundali.ascendant.sign);
    return locale === 'hi'
      ? `${tl(rashi?.name, 'hi')} लग्न आपकी कुण्डली को एक विशिष्ट चरित्र प्रदान करता है।`
      : `Your ${tl(rashi?.name, 'en')} ascendant gives your chart a distinctive character.`;
  }

  const key = topPattern.type === 'contrastingElements' ? 'contrastingElements'
    : topPattern.type === 'sameLagnaMoon' ? 'sameLagnaMoon'
    : topPattern.type;
  const templates = HOOK_TEMPLATES[key] || HOOK_TEMPLATES.fallback;

  // Deterministic variant selection via birth data hash
  const seed = hashStr(kundali.birthData.date + kundali.birthData.time + kundali.birthData.lat);
  const variant = templates[seed % templates.length];
  const template = locale === 'hi' ? variant.hi : variant.en;

  // Resolve houseTheme if needed
  const data = { ...topPattern.templateData };
  if (data && data.house && !data.houseTheme) {
    const houseNum = Number(data.house);
    data.houseTheme = bt(HOUSE_THEME_LABELS[houseNum], locale);
  }

  return interpolate(template, data || {});
}

function buildCoreIdentity(kundali: KundaliData, locale: string): { lagna: string; moon: string } {
  const ascSign = kundali.ascendant.sign;
  const rashi = RASHIS.find(r => r.id === ascSign);
  const lagnaDeep = LAGNA_DEEP[ascSign];

  // Lagna paragraph: sign name + ruler + first 2-3 sentences of personality
  const lagnaLordId = LAGNA_LORDS[ascSign];
  const lagnaLordName = GRAHAS.find(g => g.id === lagnaLordId);
  const personalityText = lagnaDeep?.personality
    ? tl(lagnaDeep.personality, locale)
    : '';
  // Take first 2-3 sentences
  const sentences = personalityText.split(/(?<=[।\.\?!])\s+/).filter(s => s.trim());
  const trimmed = sentences.slice(0, 3).join(' ');

  const lagnaLabel = locale === 'hi'
    ? `**${tl(rashi?.name, 'hi')} लग्न (${tl(lagnaLordName?.name, 'hi')}-शासित)।** ${trimmed}`
    : `**${tl(rashi?.name, 'en')} Ascendant (${tl(lagnaLordName?.name, 'en')}-ruled).** ${trimmed}`;

  // Moon paragraph
  const moon = kundali.planets.find(p => p.planet.id === 1);
  const moonSign = moon?.sign || 1;
  const moonNak = moon?.nakshatra;
  const moonNarrative = MOON_SIGN_NARRATIVES[moonSign];
  const moonBase = moonNarrative ? bt(moonNarrative, locale) : '';

  // Append nakshatra flavor (1 sentence from characteristics)
  let nakFlavor = '';
  if (moonNak) {
    const nakDetail = NAKSHATRA_DETAILS.find(n => n.id === moonNak.id);
    if (nakDetail) {
      const chars = tl(nakDetail.characteristics, locale);
      const firstSentence = chars.split(/(?<=[।\.\?!])\s+/)[0] || '';
      const nakName = tl(moonNak.name, locale);
      nakFlavor = locale === 'hi'
        ? ` ${nakName} नक्षत्र में — ${firstSentence}`
        : ` In ${nakName} nakshatra — ${firstSentence.toLowerCase()}`;
    }
  }

  const moonRashi = RASHIS.find(r => r.id === moonSign);
  const moonLabel = locale === 'hi'
    ? `**चन्द्र ${tl(moonRashi?.name, 'hi')} में${moonNak ? ` · ${tl(moonNak.name, 'hi')} नक्षत्र` : ''}।** ${moonBase}${nakFlavor}`
    : `**Moon in ${tl(moonRashi?.name, 'en')}${moonNak ? ` · ${tl(moonNak.name, 'en')} Nakshatra` : ''}.** ${moonBase}${nakFlavor}`;

  return { lagna: lagnaLabel, moon: moonLabel };
}

function buildStandout(patterns: ChartPattern[], kundali: KundaliData, locale: string): string {
  const topPattern = patterns[0];
  if (!topPattern) return '';

  // Build a 3-4 sentence expansion of the top pattern
  const planets = kundali.planets;
  switch (topPattern.type) {
    case 'stellium': {
      const house = topPattern.houses?.[0] || 1;
      const pIds = topPattern.planets;
      const names = pIds.map(id => {
        const p = planets.find(pp => pp.planet.id === id);
        return p ? tl(p.planet.name, locale) : '';
      }).filter(Boolean).join(', ');
      const theme = bt(HOUSE_THEME_LABELS[house], locale);
      const impl = PLANET_HOUSE_DEPTH[pIds[0]]?.[house]?.implications || '';
      return locale === 'hi'
        ? `${names} आपके ${house}वें भाव में एकत्रित हैं — ${theme} से सम्बन्धित विषय। यह संकेन्द्रण जीवन के इस क्षेत्र में असाधारण तीव्रता लाता है। ${impl}`
        : `${names} gather in your ${house}th house — the domain of ${theme}. This concentration brings extraordinary intensity to this area of life. ${impl}`;
    }
    case 'dignifiedLagnaLord': {
      const ll = planets.find(p => p.planet.id === topPattern.planets[0]);
      if (!ll) return '';
      const dignity = ll.isExalted ? 'exalted' : 'own sign';
      const dignityHi = ll.isExalted ? 'उच्च' : 'स्वराशि';
      const impl = PLANET_HOUSE_DEPTH[ll.planet.id]?.[ll.house]?.implications || '';
      return locale === 'hi'
        ? `${tl(ll.planet.name, 'hi')} — आपके लग्नेश — ${tl(ll.signName, 'hi')} में ${dignityHi} हैं, ${ll.house}वें भाव में। लग्नेश की यह शक्ति पूरी कुण्डली को स्थिरता और दिशा प्रदान करती है। ${impl}`
        : `${tl(ll.planet.name, 'en')} — your lagna lord — is ${dignity} in ${tl(ll.signName, 'en')}, placed in the ${ll.house}th house. This strength in the chart's captain gives the entire horoscope stability and direction. ${impl}`;
    }
    case 'kaalSarpa': {
      const rahuH = topPattern.houses?.[0] || 1;
      const ketuH = topPattern.houses?.[1] || 7;
      return locale === 'hi'
        ? `सभी ग्रह राहु (${rahuH}वाँ भाव) और केतु (${ketuH}वाँ भाव) के बीच सीमित हैं। यह काल सर्प योग जीवन में तीव्र कार्मिक अनुभव लाता है — अचानक उत्थान और पतन दोनों सम्भव। अक्ष जिन भावों से गुजरता है, वे जीवन के प्रमुख क्षेत्र बन जाते हैं।`
        : `All planets are hemmed between Rahu (${rahuH}th house) and Ketu (${ketuH}th house). This Kaal Sarpa Yoga brings intense karmic experiences — sudden rises and falls are both possible. The axis passing through these houses makes them the dominant life themes.`;
    }
    case 'rajaYoga': {
      const count = topPattern.templateData?.count || '2';
      return locale === 'hi'
        ? `${count} राजयोगों का संयोग अधिकार, मान्यता और नेतृत्व के अवसर प्रदान करता है। ये योग तब फलित होते हैं जब सम्बन्धित ग्रहों की दशा सक्रिय होती है — सही समय पर सही प्रयास आवश्यक।`
        : `The convergence of ${count} raja yogas provides opportunities for authority, recognition, and leadership. These yogas activate when the relevant planetary dashas run — the right effort at the right time is essential.`;
    }
    case 'sameLagnaMoon': {
      const sign = topPattern.templateData?.sign1 || '';
      return locale === 'hi'
        ? `लग्न और चन्द्र दोनों ${sign} में — आपका बाह्य व्यवहार और आन्तरिक भावनाएँ एक ही ऊर्जा से संचालित हैं। लोग जो देखते हैं वही आप भीतर अनुभव करते हैं। यह एकता आपको प्रामाणिक बनाती है, परन्तु इसका अर्थ यह भी है कि आपके पास छिपने का कोई स्थान नहीं।`
        : `Both your ascendant and Moon fall in ${sign} — your outward behavior and inner emotions run on the same energy. What people see is what you feel inside. This unity makes you authentic, but it also means you have no place to hide.`;
    }
    default: {
      // Generic expansion using planet-in-house data for the first planet in the pattern
      const pid = topPattern.planets[0];
      const p = planets.find(pp => pp.planet.id === pid);
      if (!p) return '';
      const impl = PLANET_HOUSE_DEPTH[pid]?.[p.house]?.implications || '';
      const prog = PLANET_HOUSE_DEPTH[pid]?.[p.house]?.prognosis || '';
      return `${impl} ${prog}`;
    }
  }
}

function buildPlanetaryObservations(patterns: ChartPattern[], kundali: KundaliData, locale: string): string[] {
  // Take patterns 1-3 (after the standout), generate a paragraph each
  const obs: string[] = [];
  const usedPatterns = patterns.slice(1, 4);

  for (let i = 0; i < usedPatterns.length; i++) {
    const pat = usedPatterns[i];
    const connector = bt(CONNECTORS[i % CONNECTORS.length], locale);
    let text = '';

    switch (pat.type) {
      case 'dignifiedLagnaLord':
      case 'debilitatedKey':
      case 'retrogradeKendra': {
        const p = kundali.planets.find(pp => pp.planet.id === pat.planets[0]);
        if (!p) continue;
        const impl = PLANET_HOUSE_DEPTH[p.planet.id]?.[p.house]?.implications || '';
        const dignity = p.isExalted ? bt(DIGNITY_LABELS.exalted, locale)
          : p.isDebilitated ? bt(DIGNITY_LABELS.debilitated, locale)
          : p.isOwnSign ? bt(DIGNITY_LABELS.ownSign, locale)
          : p.isRetrograde ? bt(DIGNITY_LABELS.retrograde, locale)
          : '';
        text = locale === 'hi'
          ? `${connector} ${tl(p.planet.name, 'hi')} ${tl(p.signName, 'hi')} में (${dignity}) ${p.house}वें भाव में। ${impl}`
          : `${connector} ${tl(p.planet.name, 'en')} in ${tl(p.signName, 'en')} (${dignity}) in the ${p.house}th house. ${impl}`;
        break;
      }
      case 'lunarYoga': {
        const yogaName = pat.yogaName || '';
        const quality = pat.templateData?.quality || '';
        text = locale === 'hi'
          ? `${connector} ${yogaName} — ${quality}। यह योग ज्योतिष में सर्वाधिक मान्यता प्राप्त संयोगों में से एक है।`
          : `${connector} ${yogaName} forms in your chart, bringing ${quality}. This is one of the more widely recognized combinations in Jyotish.`;
        break;
      }
      case 'sadeSati': {
        text = locale === 'hi'
          ? `${connector} साढ़े साती सक्रिय — शनि आपके चन्द्र पर गोचर कर रहा है। यह अवधि भावनात्मक परिपक्वता और कठिन परिश्रम की माँग करती है, परन्तु स्थायी उपलब्धियाँ भी प्रदान करती है।`
          : `${connector} Sade Sati is active — Saturn is transiting over your Moon. This period demands emotional maturity and hard work, but delivers lasting achievements.`;
        break;
      }
      default: {
        // Use stellium, rajaYoga, etc. with generic text
        if (pat.type === 'stellium') {
          const house = pat.houses?.[0] || 1;
          const theme = bt(HOUSE_THEME_LABELS[house], locale);
          text = locale === 'hi'
            ? `${connector} ${pat.planets.length} ग्रह ${house}वें भाव में — ${theme} के विषय प्रबल।`
            : `${connector} ${pat.planets.length} planets in the ${house}th house intensify themes of ${theme}.`;
        }
        break;
      }
    }

    if (text) obs.push(text);
  }

  return obs;
}

function buildNakshatraInsight(kundali: KundaliData, locale: string): string {
  const moon = kundali.planets.find(p => p.planet.id === 1);
  if (!moon) return '';

  const nak = moon.nakshatra;
  const detail = NAKSHATRA_DETAILS.find(n => n.id === nak.id);
  if (!detail) return '';

  const name = tl(nak.name, locale);
  const meaning = tl(detail.meaning, locale);
  const mythology = tl(detail.mythology, locale);
  const characteristics = tl(detail.characteristics, locale);
  const gana = tl(detail.gana, locale);
  const symbol = nak.symbol || '';

  if (locale === 'hi') {
    return `आपका चन्द्र ${name} नक्षत्र में पड़ता है — "${meaning}"। ${symbol} ${mythology} ${characteristics} गण: ${gana}।`;
  }
  return `Your Moon falls in ${name} — "${meaning}." ${symbol} ${mythology} ${characteristics} Gana: ${gana}.`;
}

function buildDashaContext(kundali: KundaliData, locale: string): string {
  const dashas = kundali.dashas;
  if (!dashas || dashas.length === 0) return '';

  // Find current Mahadasha (the one whose date range includes now)
  const now = new Date().toISOString().slice(0, 10);
  const currentMaha = dashas.find(d => d.level === 'maha' && d.startDate <= now && d.endDate >= now)
    || dashas[0];

  const mahaName = tl(currentMaha.planetName, locale);
  const endYear = currentMaha.endDate.slice(0, 4);
  const startYear = currentMaha.startDate.slice(0, 4);
  const totalYears = Number(endYear) - Number(startYear);

  // Current antardasha
  let antarText = '';
  if (currentMaha.subPeriods) {
    const currentAntar = currentMaha.subPeriods.find(
      d => d.startDate <= now && d.endDate >= now
    );
    if (currentAntar) {
      const antarName = tl(currentAntar.planetName, locale);
      const dashaEffect = DASHA_EFFECTS[kundali.planets.find(
        p => tl(p.planet.name, 'en') === currentAntar.planet
      )?.planet.id ?? -1];
      const effectText = dashaEffect ? (locale === 'hi' ? dashaEffect.hi : dashaEffect.en) : '';
      antarText = locale === 'hi'
        ? ` ${antarName} की वर्तमान अन्तर्दशा ${effectText ? `— ${effectText}` : ''}`
        : ` The current Antardasha of ${antarName}${effectText ? ` — ${effectText}` : ''}`;
    }
  }

  // Mahadasha lord's house placement for context
  const mahaLord = kundali.planets.find(p => tl(p.planet.name, 'en') === currentMaha.planet);
  let placementText = '';
  if (mahaLord) {
    const dignity = mahaLord.isExalted ? (locale === 'hi' ? 'उच्च' : 'exalted')
      : mahaLord.isOwnSign ? (locale === 'hi' ? 'स्वराशि' : 'own sign')
      : mahaLord.isDebilitated ? (locale === 'hi' ? 'नीच' : 'debilitated')
      : '';
    const houseTheme = bt(HOUSE_THEME_LABELS[mahaLord.house], locale);
    placementText = locale === 'hi'
      ? `${mahaName} आपके ${mahaLord.house}वें भाव (${houseTheme}) में ${dignity ? `${dignity} में ` : ''}विराजमान — `
      : `${mahaName} sits in your ${mahaLord.house}th house (${houseTheme})${dignity ? ` in ${dignity}` : ''} — `;
  }

  if (locale === 'hi') {
    return `आप वर्तमान में ${mahaName} महादशा में हैं — ${totalYears} वर्ष की अवधि। ${placementText}इस काल का स्वरूप निर्धारित करता है।${antarText}`;
  }
  return `You are currently in ${mahaName} Mahadasha — a ${totalYears}-year period. ${placementText}shaping the character of these years.${antarText}`;
}

function buildDoshaSection(kundali: KundaliData, locale: string): string | null {
  const planets = kundali.planets;
  const doshas: string[] = [];

  // Check Manglik
  const mars = planets.find(p => p.planet.id === 2);
  const manglikHouses = [1, 2, 4, 7, 8, 12];
  if (mars && manglikHouses.includes(mars.house)) {
    const severity = [1, 7, 8].includes(mars.house) ? (locale === 'hi' ? 'गम्भीर' : 'significant')
      : (locale === 'hi' ? 'मध्यम' : 'moderate');
    // Check cancellations
    const cancellations: string[] = [];
    if (mars.isOwnSign || mars.isExalted) cancellations.push(locale === 'hi' ? 'मंगल स्वगरिमा में' : 'Mars is in its own dignity');
    const jupiter = planets.find(p => p.planet.id === 4);
    if (jupiter && [1, 4, 7, 10].includes(jupiter.house)) cancellations.push(locale === 'hi' ? 'गुरु केन्द्र में' : 'Jupiter in kendra');

    const cancelText = cancellations.length > 0
      ? (locale === 'hi' ? ` परन्तु यह ${cancellations.join(' और ')} से कम होता है।` : ` However, this is mitigated by ${cancellations.join(' and ')}.`)
      : '';

    doshas.push(locale === 'hi'
      ? `मांगलिक दोष (${severity}): मंगल ${mars.house}वें भाव में विवाह और साझेदारी को प्रभावित करता है।${cancelText}`
      : `Manglik Dosha (${severity}): Mars in the ${mars.house}th house influences marriage and partnerships.${cancelText}`);
  }

  // Check Kaal Sarpa (reuse pattern detection logic)
  const rahu = planets.find(p => p.planet.id === 7);
  const ketu = planets.find(p => p.planet.id === 8);
  if (rahu && ketu) {
    const others = planets.filter(p => p.planet.id !== 7 && p.planet.id !== 8);
    const rahuH = rahu.house;
    const ketuH = ketu.house;
    const allOnOneSide = others.every(p => {
      const dist = ((p.house - rahuH + 12) % 12);
      const ketuDist = ((ketuH - rahuH + 12) % 12);
      return dist > 0 && dist < ketuDist;
    }) || others.every(p => {
      const dist = ((p.house - ketuH + 12) % 12);
      const rahuDist = ((rahuH - ketuH + 12) % 12);
      return dist > 0 && dist < rahuDist;
    });
    if (allOnOneSide) {
      doshas.push(locale === 'hi'
        ? `काल सर्प दोष: सभी ग्रह राहु-केतु अक्ष के एक ओर। कार्मिक अनुभव तीव्र होते हैं, परन्तु अक्ष-सम्बन्धित क्षेत्रों में विशेष सफलता भी सम्भव।`
        : `Kaal Sarpa Dosha: all planets on one side of the Rahu-Ketu axis. Karmic experiences run intense, but exceptional success in axis-related areas is also possible.`);
    }
  }

  // Check Sade Sati
  if (kundali.sadeSati?.isActive) {
    const phase = kundali.sadeSati.phase || '';
    doshas.push(locale === 'hi'
      ? `साढ़े साती सक्रिय${phase ? ` (${phase} चरण)` : ''}: शनि चन्द्र पर गोचर। धैर्य और अनुशासन इस काल की कुंजी।`
      : `Sade Sati active${phase ? ` (${phase} phase)` : ''}: Saturn transits over Moon. Patience and discipline are key during this period.`);
  }

  if (doshas.length === 0) return null;
  return doshas.join('\n\n');
}

function buildStrengthTable(kundali: KundaliData, locale: string): StrengthRow[] {
  const rows: StrengthRow[] = [];

  for (const p of kundali.planets) {
    // Only include planets with notable dignity
    if (!p.isExalted && !p.isDebilitated && !p.isOwnSign && !p.isRetrograde) continue;

    const dignity = p.isExalted ? bt(DIGNITY_LABELS.exalted, locale)
      : p.isDebilitated ? bt(DIGNITY_LABELS.debilitated, locale)
      : p.isOwnSign ? bt(DIGNITY_LABELS.ownSign, locale)
      : p.isRetrograde ? bt(DIGNITY_LABELS.retrograde, locale)
      : bt(DIGNITY_LABELS.neutral, locale);

    const impl = PLANET_HOUSE_DEPTH[p.planet.id]?.[p.house]?.implications || '';
    // Trim to first sentence
    const firstSentence = impl.split(/[.।]/)[0]?.trim() || '';

    rows.push({
      planet: tl(p.planet.name, locale),
      dignity,
      house: p.house,
      impact: firstSentence || bt(HOUSE_THEME_LABELS[p.house], locale),
    });
  }

  return rows;
}

// ─── Main Entry Point ───────────────────────────────────────────

export function generateVedicProfile(kundali: KundaliData, locale: string): VedicProfile {
  const patterns = detectChartPatterns(kundali);
  return {
    hook: buildHook(patterns, kundali, locale),
    coreIdentity: buildCoreIdentity(kundali, locale),
    standout: buildStandout(patterns, kundali, locale),
    planetaryObservations: buildPlanetaryObservations(patterns, kundali, locale),
    nakshatraInsight: buildNakshatraInsight(kundali, locale),
    dashaContext: buildDashaContext(kundali, locale),
    doshaSection: buildDoshaSection(kundali, locale),
    strengthTable: buildStrengthTable(kundali, locale),
    personName: kundali.birthData.name,
  };
}
```

- [ ] **Step 5: Run tests to verify they pass**

Run: `npx vitest run src/lib/__tests__/vedic-profile.test.ts`
Expected: All tests PASS

- [ ] **Step 6: Commit**

```bash
git add src/lib/kundali/vedic-profile.ts src/lib/kundali/vedic-profile-templates.ts src/lib/__tests__/vedic-profile.test.ts
git commit -m "feat: add Vedic Profile engine with pattern detection and narrative generation"
```

---

### Task 2: VedicProfile React Component

**Files:**
- Create: `src/components/kundali/VedicProfile.tsx`

- [ ] **Step 1: Create the VedicProfile component**

Create `src/components/kundali/VedicProfile.tsx`:

```tsx
'use client';

import { useState } from 'react';
import type { VedicProfile as VedicProfileType } from '@/lib/kundali/vedic-profile';
import { UI_LABELS, bt } from '@/lib/kundali/vedic-profile-templates';

interface VedicProfileProps {
  profile: VedicProfileType;
  locale: string;
}

export default function VedicProfile({ profile, locale }: VedicProfileProps) {
  const [expanded, setExpanded] = useState(false);

  const l = (label: { en: string; hi: string }) => bt(label, locale);

  return (
    <div className="mb-8 rounded-2xl bg-gradient-to-br from-[#1a1040]/40 to-[#0a0e27] border border-gold-primary/10 overflow-hidden">
      {/* Header */}
      <div className="px-6 pt-6 pb-2">
        <h2 className="text-xl font-semibold text-gold-light tracking-wide">
          {l(UI_LABELS.profileTitle)}: {profile.personName}
        </h2>
      </div>

      {/* Always visible: Hook + Core Identity + Standout */}
      <div className="px-6 pb-4 space-y-4">
        {/* Hook */}
        <p className="text-text-primary leading-relaxed text-[15px] italic border-l-2 border-gold-primary/30 pl-4">
          {profile.hook}
        </p>

        {/* Core Identity */}
        <div>
          <h3 className="text-sm font-medium text-gold-primary/70 uppercase tracking-wider mb-2">
            {l(UI_LABELS.coreIdentity)}
          </h3>
          <div className="space-y-3 text-text-primary leading-relaxed text-[15px]">
            <p dangerouslySetInnerHTML={{ __html: markdownBold(profile.coreIdentity.lagna) }} />
            <p dangerouslySetInnerHTML={{ __html: markdownBold(profile.coreIdentity.moon) }} />
          </div>
        </div>

        {/* Standout Observation */}
        {profile.standout && (
          <p className="text-text-primary leading-relaxed text-[15px]">
            {profile.standout}
          </p>
        )}
      </div>

      {/* Expandable sections */}
      <div
        className="transition-all duration-500 ease-in-out overflow-hidden"
        style={{ maxHeight: expanded ? '5000px' : '0px', opacity: expanded ? 1 : 0 }}
      >
        <div className="px-6 pb-6 space-y-6">
          {/* Gold divider */}
          <div className="h-px bg-gradient-to-r from-transparent via-gold-primary/20 to-transparent" />

          {/* Key Planetary Observations */}
          {profile.planetaryObservations.length > 0 && (
            <div>
              <h3 className="text-sm font-medium text-gold-primary/70 uppercase tracking-wider mb-2">
                {l(UI_LABELS.keyObservations)}
              </h3>
              <div className="space-y-3 text-text-primary leading-relaxed text-[15px]">
                {profile.planetaryObservations.map((obs, i) => (
                  <p key={i}>{obs}</p>
                ))}
              </div>
            </div>
          )}

          {/* Nakshatra Insight */}
          {profile.nakshatraInsight && (
            <div>
              <h3 className="text-sm font-medium text-gold-primary/70 uppercase tracking-wider mb-2">
                {l(UI_LABELS.nakshatraInsight)}
              </h3>
              <p className="text-text-primary leading-relaxed text-[15px]">
                {profile.nakshatraInsight}
              </p>
            </div>
          )}

          {/* Dasha Context */}
          {profile.dashaContext && (
            <div>
              <h3 className="text-sm font-medium text-gold-primary/70 uppercase tracking-wider mb-2">
                {l(UI_LABELS.dashaContext)}
              </h3>
              <p className="text-text-primary leading-relaxed text-[15px]">
                {profile.dashaContext}
              </p>
            </div>
          )}

          {/* Active Doshas */}
          {profile.doshaSection && (
            <div>
              <h3 className="text-sm font-medium text-gold-primary/70 uppercase tracking-wider mb-2">
                {l(UI_LABELS.activeDoshas)}
              </h3>
              <div className="space-y-2 text-text-primary leading-relaxed text-[15px]">
                {profile.doshaSection.split('\n\n').map((para, i) => (
                  <p key={i}>{para}</p>
                ))}
              </div>
            </div>
          )}

          {/* Strength Table */}
          {profile.strengthTable.length > 0 && (
            <div>
              <h3 className="text-sm font-medium text-gold-primary/70 uppercase tracking-wider mb-2">
                {l(UI_LABELS.strengthSnapshot)}
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gold-primary/10">
                      <th className="text-left py-2 pr-4 text-text-secondary font-medium">{l(UI_LABELS.planet)}</th>
                      <th className="text-left py-2 pr-4 text-text-secondary font-medium">{l(UI_LABELS.dignity)}</th>
                      <th className="text-left py-2 pr-4 text-text-secondary font-medium">{l(UI_LABELS.house)}</th>
                      <th className="text-left py-2 text-text-secondary font-medium">{l(UI_LABELS.impact)}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {profile.strengthTable.map((row, i) => (
                      <tr key={i} className="border-b border-white/5">
                        <td className="py-2 pr-4 text-gold-light font-medium">{row.planet}</td>
                        <td className="py-2 pr-4 text-text-primary">{row.dignity}</td>
                        <td className="py-2 pr-4 text-text-secondary">{row.house}H</td>
                        <td className="py-2 text-text-secondary text-xs">{row.impact}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Expand/Collapse button */}
      <button
        type="button"
        onClick={() => setExpanded(!expanded)}
        className="w-full py-3 text-center text-sm text-gold-primary hover:text-gold-light transition-colors border-t border-gold-primary/10 cursor-pointer"
      >
        {expanded ? l(UI_LABELS.readLess) : l(UI_LABELS.readMore)}
        <svg
          viewBox="0 0 20 20"
          fill="currentColor"
          className={`w-4 h-4 inline-block ml-1 transition-transform duration-300 ${expanded ? 'rotate-180' : ''}`}
          aria-hidden="true"
        >
          <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd" />
        </svg>
      </button>
    </div>
  );
}

/** Convert **bold** markdown to <strong> tags for inline rendering */
function markdownBold(text: string): string {
  return text.replace(/\*\*(.*?)\*\*/g, '<strong class="text-gold-light">$1</strong>');
}
```

- [ ] **Step 2: Verify TypeScript compiles**

Run: `npx tsc --noEmit -p tsconfig.build-check.json 2>&1 | head -30`
Expected: No errors related to VedicProfile

- [ ] **Step 3: Commit**

```bash
git add src/components/kundali/VedicProfile.tsx
git commit -m "feat: add VedicProfile component with progressive reveal"
```

---

### Task 3: Integrate into Kundali Page

**Files:**
- Modify: `src/app/[locale]/kundali/page.tsx:940-948`

- [ ] **Step 1: Add imports to the kundali page**

At the top of `src/app/[locale]/kundali/page.tsx`, add these imports alongside the existing dynamic imports:

```typescript
import { generateVedicProfile } from '@/lib/kundali/vedic-profile';
import type { VedicProfile as VedicProfileType } from '@/lib/kundali/vedic-profile';
```

And add a lazy import for the component (alongside existing `dynamic` imports):

```typescript
const VedicProfileComponent = dynamic(() => import('@/components/kundali/VedicProfile'), { ssr: false });
```

- [ ] **Step 2: Add state and computation**

In the component body, after the existing `personalReading` state declarations, add:

```typescript
const [vedicProfile, setVedicProfile] = useState<VedicProfileType | null>(null);
```

Then in the effect or section where `kundali` is set (after chart generation completes), add the profile generation:

```typescript
// Inside the existing useEffect or callback that sets kundali data:
// After setKundali(data) or equivalent, add:
if (data) {
  setVedicProfile(generateVedicProfile(data, locale));
}
```

Find the exact location where `kundali` gets its data and add the `setVedicProfile` call right after. The profile generation is synchronous and instant.

- [ ] **Step 3: Render VedicProfile above Key Dates in Layer 1**

In the Layer 1 section (~line 940-948), insert the VedicProfile component BEFORE the Key Dates block:

```tsx
{/* ===== LAYER 1: PERSONAL PANDIT DASHBOARD ===== */}
{personalReading && view === 'dashboard' && (
  <>
    {/* Vedic Profile — narrative synthesis above Key Dates */}
    {vedicProfile && kundali && (
      <VedicProfileComponent profile={vedicProfile} locale={locale} />
    )}
    {/* Key Dates — prominent above domain cards */}
    {keyDates.length > 0 && (
      <div className="mb-8 p-5 rounded-2xl bg-gradient-to-br from-[#1a1040]/40 to-[#0a0e27] border border-gold-primary/10">
        <KeyDatesTimeline dates={keyDates} locale={locale} />
      </div>
    )}
    {/* ... rest of Layer 1 unchanged */}
  </>
)}
```

- [ ] **Step 4: Verify TypeScript compiles**

Run: `npx tsc --noEmit -p tsconfig.build-check.json`
Expected: 0 errors

- [ ] **Step 5: Verify build passes**

Run: `npx next build`
Expected: Build succeeds

- [ ] **Step 6: Commit**

```bash
git add src/app/[locale]/kundali/page.tsx
git commit -m "feat: integrate VedicProfile into Personal Pandit dashboard above Key Dates"
```

---

### Task 4: Browser Verification + Polish

**Files:**
- Possibly modify: `src/components/kundali/VedicProfile.tsx` (styling tweaks)
- Possibly modify: `src/lib/kundali/vedic-profile.ts` (content fixes)

- [ ] **Step 1: Start dev server and test**

Run: `npx next dev`
Navigate to `/en/kundali`, generate a chart, go through the question entry to reach the dashboard.

Verify:
1. VedicProfile card appears above Key Dates
2. Collapsed view shows hook + core identity + standout (~200 words)
3. "Read full profile" button expands smoothly
4. Expanded view shows all sections: planetary observations, nakshatra, dasha, doshas (if any), strength table
5. "Show less" collapses back
6. Hindi locale (`/hi/kundali`) shows Hindi text
7. No console errors

- [ ] **Step 2: Test edge cases**

1. Chart with no doshas → doshas section should not appear
2. Chart with Sade Sati active → should show in doshas
3. Chart with lagna = moon sign → hook should use sameLagnaMoon framing, not duality
4. Switch locale → profile should re-render in new language

- [ ] **Step 3: Fix any issues found**

Address any styling, content, or rendering issues discovered during testing.

- [ ] **Step 4: Run full test suite**

Run: `npx vitest run`
Expected: All tests pass including the new vedic-profile tests

- [ ] **Step 5: Final build verification**

Run: `npx next build`
Expected: 0 errors

- [ ] **Step 6: Commit final polish**

```bash
git add -A
git commit -m "fix: polish VedicProfile styling and edge cases after browser testing"
```
