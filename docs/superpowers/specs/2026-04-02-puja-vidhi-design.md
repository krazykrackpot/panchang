# Puja Vidhi & Ritual System — Differentiation Spec

**Date:** 2026-04-02
**Status:** Approved
**Goal:** Build the most comprehensive, interactive, and personalized Hindu ritual guidance system on the web — making Drik Panchang's static festival pages obsolete.

---

## 1. Strategic Context

Drik Panchang tells users **when**. We tell them **when, how, what to buy, what to chant, and why — personalized to their location, chart, and tradition.**

Six layers of differentiation, each building on the last:

| Layer | Summary | Drik Panchang | Us |
|-------|---------|---------------|-----|
| 1. Content Depth | 30 complete vidhis | Brief descriptions | Full step-by-step with mantras |
| 2. Computed Muhurta | Exact puja window per location | Generic text | Countdown timer, timezone-aware |
| 3. Puja Mode | Interactive guided ritual | Nothing | Step-by-step with japa counter |
| 4. Smart Samagri | Categorized, substitutions, shareable | Nothing | Diaspora-friendly, printable |
| 5. Personal Sankalpa | Astronomically correct, personalized | Nothing | Name + gotra + live tithi/nakshatra |
| 6. Graha Shanti | Chart-connected remedial pujas | Nothing | Kundali affliction → remedy pipeline |

---

## 2. Layer 1 — Content Depth (30 Vidhis)

### 2.1 Current State

10 vidhis written, only 3 exported in `index.ts`. 7 are orphaned (Navaratri, Holi, Ram Navami, Makar Sankranti, Hanuman Jayanti, Raksha Bandhan, Ekadashi).

### 2.2 Tier 1 — Major Festivals (15 total)

| Festival | Deity | Muhurta Type | Status |
|----------|-------|-------------|--------|
| Ganesh Chaturthi | Ganesha | madhyahna | Done |
| Diwali | Lakshmi+Ganesha | pradosh | Done |
| Maha Shivaratri | Shiva | nishita | Done |
| Navaratri (9 forms) | Durga | computed per day | Done (orphaned) |
| Holi / Holika Dahan | Krishna/Vishnu | pradosh | Done (orphaned) |
| Ram Navami | Rama | madhyahna | Done (orphaned) |
| Makar Sankranti | Surya | fixed (sunrise) | Done (orphaned) |
| Hanuman Jayanti | Hanuman | fixed (sunrise) | Done (orphaned) |
| Raksha Bandhan | Sibling bond | aparahna | Done (orphaned) |
| Ekadashi (generic) | Vishnu | brahma_muhurta | Done (orphaned) |
| Janmashtami | Krishna | nishita (midnight) | **Needs writing** |
| Dussehra | Durga/Rama | aparahna | **Needs writing** |
| Vasant Panchami | Saraswati | madhyahna | **Needs writing** |
| Chhath Puja | Surya/Chhathi Maiya | fixed (sunrise/sunset) | **Needs writing** |
| Dhanteras | Dhanvantari | pradosh | **Needs writing** |

### 2.3 Tier 2 — Vrat Vidhis (10 total)

| Vrat | Deity | Key Feature |
|------|-------|-------------|
| Pradosham | Shiva | Trayodashi evening, Shiva+Nandi puja |
| Sankashti Chaturthi | Ganesha | Monthly, moonrise timing critical for parana |
| Karva Chauth | Shiva/Parvati | Sieve+moon sighting, karva, spousal fast |
| Hartalika Teej | Shiva/Parvati | Sand idol making, nirjala fast |
| Vat Savitri | Savitri | Banyan tree, thread wrapping, katha reading |
| Ahoi Ashtami | Ahoi Mata | Star-watching, wall painting, mothers' vrat |
| Tulsi Vivah | Tulsi/Vishnu | Tulsi-Shaligrama marriage ceremony |
| Nag Panchami | Naga Devta | Serpent worship, milk offering, no digging rule |
| Akshaya Tritiya | Lakshmi/Vishnu | Gold purchase, charity, no muhurta needed (entire day auspicious) |
| Guru Purnima | Vyasa/Guru | Guru vandana, dakshina protocol |

### 2.4 Tier 3 — Recurring Monthly (5 total)

| Observance | Frequency | Content |
|------------|-----------|---------|
| Satyanarayan Katha | Purnima | Full katha text (5 chapters) + puja vidhi |
| Amavasya Tarpan | Amavasya | Pitru tarpan procedure, til-water, darbha grass |
| Masik Shivaratri | Monthly Chaturdashi | Abbreviated Shiva puja |
| Somvar Vrat | Every Monday | Shiva fast protocol + abbreviated puja |
| Mangalvar Vrat | Every Tuesday | Hanuman fast protocol + abbreviated puja |

### 2.5 Content Structure Per Vidhi

Same structure as existing (no type changes needed for this layer):

```
PujaVidhi {
  festivalSlug, category, deity,
  samagri[], muhurtaType, muhurtaDescription, muhurtaWindow?,
  sankalpa, vidhiSteps[], mantras[], stotras?, aarti?,
  naivedya, precautions[], phala, visarjan?
}
```

Each Tier 1 festival: ~300-400 lines, 15-20 steps, 4-8 mantras.
Each Tier 2 vrat: ~150-200 lines, 8-12 steps, 2-4 mantras.
Each Tier 3 monthly: ~80-120 lines, 6-8 steps, 1-3 mantras.

---

## 3. Layer 2 — Computed Muhurta

### 3.1 The Problem

`muhurtaType: 'computed'` exists on many vidhis but is never actually computed. The page just shows the `muhurtaDescription` text. Users in Zurich see "Pradosh Kaal" but not "7:42 PM - 10:06 PM CEST."

### 3.2 Muhurta Window Calculations

All windows derive from sunrise/sunset, which we already compute per location.

| Window | Calculation | Festivals Using It |
|--------|-------------|-------------------|
| `brahma_muhurta` | sunrise - 96min to sunrise - 48min | Ekadashi, morning pujas |
| `abhijit` | midday - ~24min to midday + ~24min | Auspicious starts |
| `madhyahna` | sunrise + 2/5*(sunset-sunrise) to sunrise + 3/5*(sunset-sunrise) | Ganesh Chaturthi, Ram Navami |
| `aparahna` | sunrise + 3/5*(sunset-sunrise) to sunrise + 4/5*(sunset-sunrise) | Raksha Bandhan, Dussehra |
| `pradosh` | sunset to sunset + 2h24m | Diwali, Shivaratri, Pradosham |
| `nishita` | local midnight - 24min to midnight + 24min | Janmashtami, Shivaratri |

### 3.3 Implementation

New utility function in `src/lib/ephem/` or `src/lib/muhurta/`:

```typescript
function computePujaMuhurta(
  muhurtaType: MuhurtaWindowType,
  date: Date,
  lat: number,
  lng: number,
  timezone: string
): { start: Date; end: Date; label: string }
```

Uses existing `getSunrise()` / `getSunset()` from `src/lib/astronomy/`.

### 3.4 Parana (Fast-Breaking) Computation

For vrats, the parana time is critical and location-dependent.

New type addition:

```typescript
interface ParanaRule {
  type: 'sunrise_plus_quarter' | 'moonrise' | 'next_sunrise' | 'tithi_end';
  description: Trilingual;
}
```

| Vrat | Parana Rule | Computation |
|------|------------|-------------|
| Ekadashi | After sunrise, before Dwadashi ends or 1/4 of daytime | `sunrise + min(dwadashiEnd, dayDuration/4)` |
| Karva Chauth | After moonrise + husband sighting | `moonrise` for location |
| Sankashti | After moonrise | `moonrise` for location |
| General vrats | Next sunrise | `nextDaySunrise` |

### 3.5 UI Display

On the puja detail page, when location is available:

```
━━━ Puja Muhurta ━━━━━━━━━━━━━━━━━━━━━━
📍 Corseaux, Switzerland (CEST)
Pradosh Kaal: 7:42 PM — 10:06 PM
Starts in: 3h 28m [live countdown]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

When no location: show generic description + prompt to set location.

For vrats with parana:

```
━━━ Parana (Fast Breaking) ━━━━━━━━━━━━━
📍 Corseaux, Switzerland (CEST)
Break fast: 6:48 AM — 9:12 AM (Apr 3)
Dwadashi ends: 9:12 AM
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

## 4. Layer 3 — Puja Mode (Interactive Guided Ritual)

### 4.1 Concept

A "Start Puja" button on the detail page enters a focused, step-by-step guided mode. Like a cooking app's step-by-step mode, but for puja.

### 4.2 Puja Mode UI

- **Full-screen overlay** (covers navbar, footer)
- **One step at a time** — large text, no scrolling
- **Navigation**: Previous / Next buttons, step counter ("Step 7 of 18")
- **Progress bar** at top
- **Dark background** with gold accents (minimal distraction)
- **Large Devanagari text** for mantras (~24px)
- **Screen Wake Lock API** to prevent screen sleep

### 4.3 Japa Counter

When a step has `mantraRef` with `japaCount`, show an integrated counter:

- Large circular counter display (like a mala/rosary)
- Tap anywhere to increment
- Haptic feedback on each tap (if device supports)
- Chime/vibration at target count (108, 21, etc.)
- "X of 108" display

### 4.4 Quick Mode vs Full Mode

Type addition to `VidhiStep`:

```typescript
interface VidhiStep {
  step: number;
  title: Trilingual;
  description: Trilingual;
  mantraRef?: string;
  duration?: string;
  // NEW:
  essential: boolean;  // true = included in Quick Mode, false = Full Mode only
}
```

- **Quick Mode**: Only `essential: true` steps (~8-10 steps, 10-15 min)
- **Full Mode**: All steps (~15-20 steps, 30-60 min)
- Toggle at the top of puja mode

This is critical for diaspora users in apartments with limited time. Even a 10-minute focused puja with correct mantras is better than skipping it entirely.

### 4.5 Step Type Hints

```typescript
interface VidhiStep {
  // ... existing + essential ...
  // NEW:
  stepType?: 'preparation' | 'invocation' | 'offering' | 'mantra' | 'meditation' | 'conclusion';
}
```

Each type gets a subtle visual treatment (icon + color accent) so the user knows what kind of action this step involves.

---

## 5. Layer 4 — Smart Samagri System

### 5.1 Enhanced SamagriItem Type

```typescript
interface SamagriItem {
  name: Trilingual;
  quantity?: string;
  note?: Trilingual;
  // NEW:
  category: 'flowers' | 'food' | 'puja_items' | 'clothing' | 'vessels' | 'other';
  essential: boolean;        // true = must-have, false = enhancement
  substitutions?: {
    item: Trilingual;
    note: Trilingual;        // "Available at most European grocery stores"
  }[];
  prepNote?: Trilingual;     // "Soak overnight" or "Make fresh on puja day"
}
```

### 5.2 Grouped Display

Instead of a flat checklist, group by category with headers:

```
ESSENTIALS (7 items)
━━━━━━━━━━━━━━━━━
☐ Modak — 21 pieces (make fresh or buy 1 day before)
☐ Durva grass — 21 blades, 3-5 per bunch
    ↳ Substitute: Fresh wheatgrass
☐ Red hibiscus flowers — handful
    ↳ Substitute: Any red flowers (roses, carnations)
☐ Coconut — 1, unbroken
☐ Incense sticks — 5
☐ Ghee lamp — 1
☐ Camphor — small piece

ADDITIONAL (8 items)
━━━━━━━━━━━━━━━━━
☐ Paan leaves — 5
☐ Supari — 5
...

Progress: 3/15 items ready ████░░░░░░░ 20%
```

### 5.3 Share & Print

- **"Share List" button**: Generates a clean plain-text list (WhatsApp/SMS friendly)
- **"Print List" button**: CSS print stylesheet — clean, no UI chrome
- **Persistent checkmarks**: localStorage keyed by `festivalSlug + year`

### 5.4 Substitution Database

Critical for diaspora. Key substitutions to encode:

| Original | Substitution | Availability |
|----------|-------------|--------------|
| Durva grass | Wheatgrass | Health food stores |
| Tulsi leaves | Fresh basil (Ocimum basilicum) | Any grocery |
| Bilva/Bel leaves | N/A (order online) | Amazon, Indian stores |
| Supari (betel nut) | Order online | Indian grocery stores |
| Camphor (bhimseni) | "Edible camphor" on Amazon | Online |
| Kumkum | Available at Indian stores | Specialty stores |
| Akshat (unbroken rice) | Any unbroken white rice | Any grocery |
| Janeu/Yajnopavita | Order online | Indian stores, Amazon |
| Sindoor | Vermillion powder, Indian stores | Specialty stores |
| Cow dung cakes | Order online or skip | Amazon, Indian stores |

---

## 6. Layer 5 — Personal Sankalpa Generator

### 6.1 Concept

The sankalpa text spoken at puja start includes astronomical data (tithi, nakshatra, yoga, vara, samvatsara) plus personal data (name, gotra, location). We compute the astronomical parts and the user provides the personal parts.

### 6.2 Computed Fields (from our engine)

For a given date + location:
- **Samvatsara**: Year name (e.g., "Shobhakrit")
- **Ayana**: Uttarayana/Dakshinayana
- **Ritu**: Season name (e.g., "Varsha")
- **Masa**: Lunar month (e.g., "Bhadrapada")
- **Paksha**: Shukla/Krishna
- **Tithi**: Lunar day (e.g., "Chaturthi")
- **Vara**: Weekday (e.g., "Mangalavara")
- **Nakshatra**: Current nakshatra
- **Yoga**: Current yoga

### 6.3 User-Provided Fields

- **Name** (Latin → Devanagari transliteration, or direct Devanagari input)
- **Gotra** (dropdown of ~50 common gotras + "Other" free text)
- **Purpose** (pre-filled from festival context, user can customize)

### 6.4 Generated Output

```
ॐ विष्णुर् विष्णुर् विष्णुः
श्रीमद्भगवतो महापुरुषस्य विष्णोराज्ञया
प्रवर्तमानस्य अद्य ब्रह्मणः द्वितीयपरार्धे
श्वेतवाराहकल्पे वैवस्वतमन्वन्तरे
अष्टाविंशतितमे कलियुगे प्रथमचरणे

[शोभकृत्] नाम संवत्सरे [दक्षिणायने] [वर्षा] ऋतौ
[भाद्रपद] मासे [शुक्ल] पक्षे [चतुर्थी] तिथौ
[मंगल] वासरे [रोहिणी] नक्षत्रे [शोभन] योगे

[कोर्सो ग्राम, स्विट्जरलैण्ड] देशे
[आदित्यकुमार] नामधेयस्य [कश्यप] गोत्रस्य
श्रीगणेशप्रीत्यर्थं गणेशचतुर्थीव्रतपूजनम् अहं करिष्ये ॥
```

Brackets show computed/personalized fields. The rest is the traditional template (varies by festival).

### 6.5 UI

- Rendered in large Devanagari text
- IAST transliteration below (toggle)
- "Copy" button for the full sankalpa
- One-time profile setup: name + gotra saved for all future pujas
- Astronomical fields auto-computed from date + location

### 6.6 Implementation

New function:

```typescript
function generateSankalpa(
  festivalSlug: string,
  date: Date,
  lat: number, lng: number, timezone: string,
  userName: string,      // Devanagari
  gotra: string,         // Devanagari
  locale: string
): { devanagari: string; iast: string }
```

Uses existing panchang calc for tithi/nakshatra/yoga/vara + existing samvatsara/masa calculations.

---

## 7. Layer 6 — Graha Shanti Vidhis

### 7.1 Concept

When a kundali shows an afflicted planet, link directly to a remedial puja vidhi. This bridges the chart analysis → ritual action gap.

### 7.2 Nine Graha Shanti Vidhis

Each follows the same `PujaVidhi` type but with `category: 'graha_shanti'` (new category value).

| Graha | Trigger Conditions | Best Day | Key Samagri | Beej Mantra | Japa Count |
|-------|--------------------|----------|-------------|-------------|------------|
| Surya | Debilitated, combust, in 6/8/12 | Sunday | Wheat, jaggery, copper vessel, red flowers | oṃ hrāṃ hrīṃ hrauṃ saḥ sūryāya namaḥ | 7,000 |
| Chandra | Weak (paksha bala), afflicted, in 6/8/12 | Monday | Rice, white flowers, silver, milk, white cloth | oṃ śrāṃ śrīṃ śrauṃ saḥ candrāya namaḥ | 11,000 |
| Mangal | In 1/4/7/8/12, Mangal Dosha | Tuesday | Red lentils (masoor), red cloth, copper | oṃ krāṃ krīṃ krauṃ saḥ bhaūmāya namaḥ | 10,000 |
| Budha | Combust, debilitated, with malefics | Wednesday | Moong dal, green cloth, bronze | oṃ brāṃ brīṃ brauṃ saḥ budhāya namaḥ | 9,000 |
| Guru | Debilitated, retrograde in dusthana | Thursday | Chana dal, yellow cloth, gold, turmeric | oṃ grāṃ grīṃ grauṃ saḥ gurave namaḥ | 19,000 |
| Shukra | Combust, debilitated, relationship issues | Friday | Rice, white cloth, silver, white flowers | oṃ drāṃ drīṃ drauṃ saḥ śukrāya namaḥ | 16,000 |
| Shani | In dusthana, Sade Sati, Dhaiya | Saturday | Black sesame (til), iron, blue/black cloth | oṃ prāṃ prīṃ prauṃ saḥ śanaiścarāya namaḥ | 23,000 |
| Rahu | In 1/5/7/8, Kaal Sarpa, with luminaries | Saturday (night) | Black sesame, coconut, blue cloth | oṃ bhṛāṃ bhṛīṃ bhṛauṃ saḥ rāhave namaḥ | 18,000 |
| Ketu | Afflicting lagna/Moon, spiritual blocks | Tuesday (night) | Kusha grass, mixed 7 grains, grey cloth | oṃ srāṃ srīṃ srauṃ saḥ ketave namaḥ | 17,000 |

### 7.3 Each Graha Shanti Vidhi Includes

- **Samagri** specific to the planet (colors, metals, grains, flowers)
- **Vidhi steps** (8-12 steps): Achamana → Sankalpa → Kalash → Graha Avahana → Beej Japa → Homa (if applicable) → Daan → Visarjan
- **Beej mantra** with full Devanagari + IAST + meaning
- **Gayatri mantra** for that planet
- **Recommended daan** (donation): what item, to whom, when
- **Dietary guidance** during remedy period
- **Duration**: single-sitting (1-2 hours) vs extended (43-day daily japa protocol)

### 7.4 Kundali Integration

Add a new category value to `PujaVidhi`:

```typescript
category: 'festival' | 'vrat' | 'graha_shanti';
```

On the Kundali results page, in the Tippanni (interpretation) section, when a planet is afflicted:

```
━━━ Saturn — Afflicted ━━━━━━━━━━━━━━
Position: 8th House, Aries (Debilitated)
Sade Sati: Active (Phase 2)
Shadbala: 62% (below threshold)

Recommended Remedy:
→ Shani Graha Shanti Puja [View Vidhi]
→ Saturday fasting + til daan
→ Shani Beej Mantra: 23,000 japa over 43 days
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

The `[View Vidhi]` link goes to `/puja/graha-shanti-shani`.

### 7.5 Trigger Logic

New function in `src/lib/kundali/` or alongside tippanni:

```typescript
function detectAfflictedPlanets(kundali: KundaliData): {
  planetId: number;
  severity: 'mild' | 'moderate' | 'severe';
  reasons: string[];
  remedySlug: string;  // e.g., 'graha-shanti-shani'
}[]
```

Conditions checked:
- Planet in 6th, 8th, or 12th house
- Planet debilitated
- Planet combust (too close to Sun)
- Planet retrograde in dusthana
- Shadbala below threshold (<60%)
- Specific doshas (Mangal Dosha, Sade Sati, Kaal Sarpa)

---

## 8. Type Changes Summary

### 8.1 Changes to Existing Types

```typescript
// In src/lib/constants/puja-vidhi/types.ts

// UPDATE category to include graha_shanti
interface PujaVidhi {
  festivalSlug: string;
  category: 'festival' | 'vrat' | 'graha_shanti';  // ADD graha_shanti
  deity: Trilingual;
  samagri: SamagriItem[];
  muhurtaType: 'computed' | 'fixed';
  muhurtaDescription: Trilingual;
  muhurtaWindow?: {
    type: 'madhyahna' | 'aparahna' | 'pradosh' | 'nishita' | 'brahma_muhurta' | 'abhijit';
  };
  sankalpa: Trilingual;
  vidhiSteps: VidhiStep[];
  mantras: MantraDetail[];
  stotras?: StotraReference[];
  aarti?: AartiText;
  naivedya: Trilingual;
  precautions: Trilingual[];
  phala: Trilingual;
  visarjan?: Trilingual;
  // NEW:
  parana?: ParanaRule;
}

// UPDATE SamagriItem with categorization + substitutions
interface SamagriItem {
  name: Trilingual;
  quantity?: string;
  note?: Trilingual;
  // NEW:
  category?: 'flowers' | 'food' | 'puja_items' | 'clothing' | 'vessels' | 'other';
  essential?: boolean;
  substitutions?: { item: Trilingual; note: Trilingual }[];
  prepNote?: Trilingual;
}

// UPDATE VidhiStep with essential flag + step type
interface VidhiStep {
  step: number;
  title: Trilingual;
  description: Trilingual;
  mantraRef?: string;
  duration?: string;
  // NEW:
  essential?: boolean;           // true = included in Quick Mode
  stepType?: 'preparation' | 'invocation' | 'offering' | 'mantra' | 'meditation' | 'conclusion';
}
```

### 8.2 New Types

```typescript
interface ParanaRule {
  type: 'sunrise_plus_quarter' | 'moonrise' | 'next_sunrise' | 'tithi_end';
  description: Trilingual;
}

interface ComputedMuhurta {
  start: Date;
  end: Date;
  label: Trilingual;
  type: string;
}

interface SankalpaProfile {
  name: string;          // Devanagari
  nameIast: string;      // IAST
  gotra: string;         // Devanagari
  gotraIast: string;     // IAST
}

interface GeneratedSankalpa {
  devanagari: string;
  iast: string;
  computedFields: {
    samvatsara: string;
    ayana: string;
    ritu: string;
    masa: string;
    paksha: string;
    tithi: string;
    vara: string;
    nakshatra: string;
    yoga: string;
  };
}
```

All new fields are optional (`?`) to maintain backward compatibility with existing 10 vidhis. They can be incrementally enriched.

---

## 9. New File Structure

```
src/lib/constants/puja-vidhi/
├── types.ts                        ← UPDATE (new fields)
├── index.ts                        ← UPDATE (export all 10, then expand)
├── ganesh-chaturthi.ts             ← EXISTS
├── diwali.ts                       ← EXISTS
├── maha-shivaratri.ts              ← EXISTS
├── navaratri.ts                    ← EXISTS (wire up)
├── holi.ts                         ← EXISTS (wire up)
├── ram-navami.ts                   ← EXISTS (wire up)
├── makar-sankranti.ts              ← EXISTS (wire up)
├── hanuman-jayanti.ts              ← EXISTS (wire up)
├── raksha-bandhan.ts               ← EXISTS (wire up)
├── ekadashi.ts                     ← EXISTS (wire up)
├── janmashtami.ts                  ← NEW
├── dussehra.ts                     ← NEW
├── vasant-panchami.ts              ← NEW
├── chhath-puja.ts                  ← NEW
├── dhanteras.ts                    ← NEW
├── pradosham.ts                    ← NEW
├── sankashti-chaturthi.ts          ← NEW
├── karva-chauth.ts                 ← NEW
├── hartalika-teej.ts               ← NEW
├── vat-savitri.ts                  ← NEW
├── ahoi-ashtami.ts                 ← NEW
├── tulsi-vivah.ts                  ← NEW
├── nag-panchami.ts                 ← NEW
├── akshaya-tritiya.ts              ← NEW
├── guru-purnima.ts                 ← NEW
├── satyanarayan-katha.ts           ← NEW
├── amavasya-tarpan.ts              ← NEW
├── masik-shivaratri.ts             ← NEW
├── somvar-vrat.ts                  ← NEW
├── mangalvar-vrat.ts               ← NEW
├── graha-shanti/
│   ├── index.ts                    ← NEW (exports all 9)
│   ├── surya.ts                    ← NEW
│   ├── chandra.ts                  ← NEW
│   ├── mangal.ts                   ← NEW
│   ├── budha.ts                    ← NEW
│   ├── guru.ts                     ← NEW
│   ├── shukra.ts                   ← NEW
│   ├── shani.ts                    ← NEW
│   ├── rahu.ts                     ← NEW
│   └── ketu.ts                     ← NEW
└── substitutions.ts                ← NEW (shared substitution database)

src/lib/puja/
├── muhurta-compute.ts              ← NEW (Layer 2: computed puja timing)
├── parana-compute.ts               ← NEW (Layer 2: fast-breaking time)
├── sankalpa-generator.ts           ← NEW (Layer 5: personalized sankalpa)
└── affliction-detector.ts          ← NEW (Layer 6: kundali → remedy link)

src/components/puja/
├── MantraCard.tsx                   ← EXISTS
├── PujaMode.tsx                     ← NEW (Layer 3: full-screen guided mode)
├── JapaCounter.tsx                  ← NEW (Layer 3: tap counter for japa)
├── SamagriList.tsx                  ← NEW (Layer 4: categorized + shareable)
├── SankalpaDisplay.tsx              ← NEW (Layer 5: personalized sankalpa)
├── MuhurtaCountdown.tsx             ← NEW (Layer 2: live countdown)
└── ParanaDisplay.tsx                ← NEW (Layer 2: fast-breaking time)
```

---

## 10. Implementation Priority

### Phase 1: Foundation (wire up + fix)
1. Export 7 orphaned vidhis in `index.ts`
2. Update types with new optional fields
3. Implement `muhurta-compute.ts` (uses existing sunrise/sunset)
4. Add `MuhurtaCountdown` component to puja detail page
5. Persist samagri checkmarks in localStorage

### Phase 2: New Content — Tier 1 Completion
6. Write 5 remaining Tier 1 festival vidhis (Janmashtami, Dussehra, Vasant Panchami, Chhath, Dhanteras)
7. Enrich existing 10 vidhis with `essential` flags on steps + `category`/`essential` on samagri

### Phase 3: Puja Mode
8. Build `PujaMode.tsx` full-screen guided experience
9. Build `JapaCounter.tsx`
10. Add Quick Mode / Full Mode toggle using `essential` flags

### Phase 4: Smart Samagri
11. Build `SamagriList.tsx` with grouping + substitutions
12. Add share/print functionality
13. Create `substitutions.ts` shared database
14. Enrich existing vidhis with substitution data

### Phase 5: Personal Sankalpa
15. Build `sankalpa-generator.ts` (panchang calc integration)
16. Build `SankalpaDisplay.tsx` with profile input
17. Add gotra dropdown + name transliteration
18. Integrate into puja detail page

### Phase 6: Vrat Vidhis + Parana
19. Write 10 Tier 2 vrat vidhis
20. Implement `parana-compute.ts`
21. Build `ParanaDisplay.tsx`
22. Integrate parana into Ekadashi and other vrat pages

### Phase 7: Graha Shanti
23. Write 9 graha shanti vidhis
24. Build `affliction-detector.ts`
25. Integrate remedy suggestions into kundali tippanni
26. Add graha shanti section to puja index page

### Phase 8: Monthly Recurring + Polish
27. Write 5 Tier 3 monthly vidhis
28. Add regional variant toggle (future — just data structure for now)
29. PDF export of puja vidhi
30. Calendar integration badges

---

## 11. Content Sourcing

All mantras and procedures sourced from:
- **Puja Paddhati** (standard ritual manual)
- **Dharma Sindhu** by Kasinath Upadhyaya
- **Nirnaya Sindhu** by Kamalakara Bhatta
- **Vrataraj** by Visvanatha
- **Vedic texts**: Rig Veda, Yajur Veda (for core mantras)
- **Puranic texts**: Shiva Purana, Vishnu Purana, Skanda Purana (for festival-specific content)

Every mantra cross-checked against at least 2 published sources. IAST diacritics validated against Devanagari 1:1.

---

## 12. Monetization

**All puja vidhi content is FREE.** No paywall on devotional content.

Rationale:
- High-traffic SEO gateway ("Diwali puja vidhi", "Ekadashi mantra" — massive search volume)
- Trust builder → users discover kundali/AI features → convert to Pro
- Daily engagement via monthly vrats
- Graha Shanti vidhis naturally drive kundali usage (the trigger is chart analysis)

Revenue comes from depth features: AI chart chat, detailed tippanni, varshaphal, KP system, muhurta AI — not from telling people how to pray.
