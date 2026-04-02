# Puja Vidhi — Festival Ritual Procedures

**Date:** 2026-04-02
**Status:** Draft

---

## 1. Overview

Add detailed puja vidhi (ritual procedures) for major Hindu festivals. Each puja vidhi includes step-by-step instructions, mantras in Devanagari + IAST romanization, required materials (samagri), best muhurta timing, precautions, and phala (benefits). Content is trilingual (EN/HI/SA) and integrated into the festival calendar.

---

## 2. What Each Puja Vidhi Contains

### 2.1 Structure per Festival

| Field | Description | Example (Ganesh Chaturthi) |
|-------|-------------|---------------------------|
| **Deity** | Primary deity being worshipped | Ganesha |
| **Sankalpa** | Declaration of intent | "I perform this puja for removal of obstacles..." |
| **Samagri (Materials)** | Complete list of required items | Modak, durva grass, red flowers, coconut, turmeric, kumkum, incense, ghee lamp, betel leaves, jaggery |
| **Muhurta** | Best timing window | Madhyahna (midday) — computed from the kundali engine |
| **Vidhi (Procedure)** | Step-by-step ritual instructions | 15-20 numbered steps |
| **Mantras** | Key mantras with transliteration | Each mantra in Devanagari + IAST + meaning |
| **Stotra/Path** | Recitation texts | Ganesh Atharvashirsha, Sankatanashana Stotra |
| **Aarti** | Closing aarti text | "Jai Ganesh Jai Ganesh Deva..." |
| **Naivedya (Offering)** | Food offering details | 21 modaks, fruits, coconut |
| **Precautions** | Do's and Don'ts | "Do not look at the moon on Chaturthi", "Use only red/orange flowers" |
| **Phala (Benefits)** | Spiritual benefits of the puja | "Removes obstacles, grants wisdom and success" |
| **Visarjan (Immersion)** | Closing ritual if applicable | "Immerse idol on Anant Chaturdashi after 1.5/3/5/7/10 days" |

### 2.2 Mantra Format

Each mantra entry:

```typescript
interface MantraDetail {
  name: Trilingual;            // "Ganesh Beej Mantra"
  devanagari: string;          // "ॐ गं गणपतये नमः"
  iast: string;                // "oṃ gaṃ gaṇapataye namaḥ"
  meaning: Trilingual;         // "Salutations to Lord Ganesha"
  japaCount?: number;          // 108 (recommended repetitions)
  usage: Trilingual;           // "Chant at the beginning of puja"
}
```

IAST (International Alphabet of Sanskrit Transliteration) uses diacritics: ā, ī, ū, ṛ, ṣ, ś, ṇ, ṃ, ḥ — this is the scholarly standard that maps 1:1 to Devanagari.

---

## 3. Festival Coverage

### 3.1 Tier 1 — Major Festivals with Full Puja Vidhi (15)

These have the most elaborate rituals and highest user demand:

| Festival | Deity | Key Mantras | Samagri Items | Steps |
|----------|-------|-------------|---------------|-------|
| **Ganesh Chaturthi** | Ganesha | Ganesh Beej, Ganesh Gayatri, Atharvashirsha | Modak, durva, red flowers, coconut | ~20 |
| **Navaratri** (9 days) | Durga (9 forms) | Durga Beej, Navarna Mantra, Durga Suktam | Per-day varying (color, flower, bhog) | ~15 per day |
| **Dussehra** | Durga/Rama | Rama Mantra, Aparajita Stotra | Shami leaves, weapons puja, blue flowers | ~12 |
| **Diwali** | Lakshmi + Ganesha | Lakshmi Beej, Shri Suktam, Ganesh Mantra | New utensils, coins, lotus, rice | ~25 |
| **Maha Shivaratri** | Shiva | Panchakshari, Rudram, Shiva Gayatri | Bel leaves, milk, water, bhang | ~18 |
| **Holi** | Krishna/Vishnu | Narasimha Mantra, Vishnu Sahasranama | Cow dung cakes, grains, coconut, gulal | ~10 |
| **Ram Navami** | Rama | Rama Taraka Mantra, Rama Raksha Stotra | Tulsi, flowers, fruits, panchamrit | ~15 |
| **Janmashtami** | Krishna | Krishna Beej, Gopala Mantra | Makhan, mishri, tulsi, flute, cradle | ~20 |
| **Makar Sankranti** | Surya | Surya Gayatri, Aditya Hridayam | Til (sesame), gur (jaggery), khichdi | ~10 |
| **Vasant Panchami** | Saraswati | Saraswati Beej, Saraswati Vandana | White flowers, books, pen, yellow cloth | ~12 |
| **Hanuman Jayanti** | Hanuman | Hanuman Beej, Hanuman Chalisa | Sindoor, jasmine oil, bananas, janeyu | ~12 |
| **Raksha Bandhan** | Sibling bond | Raksha Sutra Mantra | Rakhi, roli, chawal, mishri, diya | ~8 |
| **Chhath Puja** | Surya/Chhathi Maiya | Chhath Mantra, Surya Arghya | Thekua, fruits, sugarcane, bamboo soop | ~15 (2-day) |
| **Dhanteras** | Dhanvantari/Lakshmi | Dhanvantari Mantra | Gold/silver, new utensils, diya | ~10 |
| **Guru Purnima** | Guru/Vyasa | Guru Mantra, Guru Stotram | Flowers, fruits, dakshina, books | ~10 |

### 3.2 Tier 2 — Important Vrats with Puja Vidhi (10)

| Festival | Deity | Key Feature |
|----------|-------|-------------|
| **Ekadashi** (generic) | Vishnu | Common puja for all 24 Ekadashis + parana rules |
| **Pradosham** | Shiva | Shiva puja during pradosh kaal |
| **Chaturthi** (monthly) | Ganesha | Sankata Nashana puja |
| **Karva Chauth** | Shiva/Parvati | Karva puja with sieve + moon sighting |
| **Hartalika Teej** | Shiva/Parvati | Sand/clay Shiva-Parvati idols |
| **Vat Savitri** | Savitri/Satyavan | Banyan tree puja, thread wrapping |
| **Ahoi Ashtami** | Ahoi Mata | Star-watching, wall painting |
| **Tulsi Vivah** | Tulsi/Vishnu | Tulsi-Shaligrama marriage |
| **Nag Panchami** | Naga Devta | Serpent worship with milk |
| **Akshaya Tritiya** | Lakshmi/Vishnu | Gold purchase, charity puja |

### 3.3 Tier 3 — Monthly/Recurring with Brief Vidhi (5)

| Observance | Deity | Content |
|------------|-------|---------|
| **Purnima** | Satyanarayan | Satyanarayan Katha + puja |
| **Amavasya** | Pitrs (ancestors) | Tarpan + shraddha vidhi |
| **Masik Shivaratri** | Shiva | Abbreviated Shivaratri puja |
| **Somvar Vrat** | Shiva | Monday fasting + Shiva puja |
| **Mangalvar Vrat** | Hanuman | Tuesday Hanuman puja |

---

## 4. Data Architecture

### 4.1 New Type: PujaVidhi

```typescript
interface PujaVidhi {
  festivalSlug: string;                    // Links to FESTIVAL_DETAILS key
  deity: Trilingual;

  // Materials
  samagri: SamagriItem[];                  // Required materials

  // Timing
  muhurtaType: 'computed' | 'fixed';       // 'computed' uses the engine, 'fixed' uses description
  muhurtaDescription: Trilingual;          // "Madhyahna (midday)" or "Pradosh Kaal (evening twilight)"
  muhurtaWindow?: {                        // For computed: which time window to use
    type: 'madhyahna' | 'aparahna' | 'pradosh' | 'nishita' | 'brahma_muhurta' | 'abhijit';
  };

  // Procedure
  sankalpa: Trilingual;                    // Declaration text
  vidpiSteps: VidpiStep[];                 // Numbered procedure

  // Mantras
  mantras: MantraDetail[];                 // All mantras for this puja

  // Recitation texts
  stotras?: StotraReference[];             // Stotras/paths to recite
  aarti?: AartiText;                       // Closing aarti

  // Offering
  naivedya: Trilingual;                    // Food offering description

  // Rules
  precautions: Trilingual[];               // Do's and Don'ts (array of items)
  phala: Trilingual;                       // Benefits

  // Optional closing
  visarjan?: Trilingual;                   // Immersion/conclusion ritual
}

interface SamagriItem {
  name: Trilingual;                        // "Coconut" / "नारियल" / "नारिकेलम्"
  quantity?: string;                       // "1", "5 pieces", "handful"
  note?: Trilingual;                       // "Must be unbroken"
}

interface VidhiStep {
  step: number;
  title: Trilingual;                       // "Kalash Sthapana"
  description: Trilingual;                 // Detailed instruction
  mantraRef?: string;                      // ID linking to MantraDetail
  duration?: string;                       // "5 minutes"
}

interface MantraDetail {
  id: string;                              // Unique ID for cross-referencing
  name: Trilingual;                        // "Ganesh Beej Mantra"
  devanagari: string;                      // Full mantra in Devanagari
  iast: string;                            // IAST romanization with diacritics
  meaning: Trilingual;                     // Translation
  japaCount?: number;                      // 108, 21, 11, etc.
  usage: Trilingual;                       // When/how to use
}

interface StotraReference {
  name: Trilingual;                        // "Ganesh Atharvashirsha"
  text?: string;                           // Full Devanagari text (if short)
  verseCount?: number;                     // Number of verses
  duration?: string;                       // "10 minutes"
  note?: Trilingual;                       // "Recite all 24 verses"
}

interface AartiText {
  name: Trilingual;                        // "Jai Ganesh Deva"
  devanagari: string;                      // Full aarti text
  iast: string;                            // Romanization
}
```

### 4.2 File Structure

```
src/lib/constants/puja-vidhi/
├── index.ts                    — Exports PUJA_VIDHIS Record<string, PujaVidhi>
├── types.ts                    — Type definitions
├── ganesh-chaturthi.ts         — Ganesh Chaturthi puja
├── navaratri.ts                — 9-day Navaratri (9 sub-pujas)
├── diwali.ts                   — Lakshmi-Ganesh puja
├── maha-shivaratri.ts          — Shivaratri puja
├── holi.ts                     — Holika Dahan vidhi
├── ram-navami.ts               — Ram Navami puja
├── janmashtami.ts              — Krishna Janmashtami
├── makar-sankranti.ts          — Surya puja
├── vasant-panchami.ts          — Saraswati puja
├── hanuman-jayanti.ts          — Hanuman puja
├── raksha-bandhan.ts           — Rakhi tying vidhi
├── chhath-puja.ts              — Chhath (2-day)
├── dhanteras.ts                — Dhanvantari puja
├── guru-purnima.ts             — Guru vandana
├── dussehra.ts                 — Vijaya Dashami puja
├── ekadashi.ts                 — Generic Ekadashi vrat vidhi
├── pradosham.ts                — Pradosham Shiva puja
├── monthly-vrats.ts            — Chaturthi, Purnima, Amavasya
└── additional-vrats.ts         — Karva Chauth, Teej, Nag Panchami, etc.
```

Each file is ~100-200 lines of pure data (no logic). Total: ~3,000-4,000 lines of content across all files.

---

## 5. Integration Points

### 5.1 Festival Detail Modal Enhancement

Extend `src/components/calendar/FestivalDetailModal.tsx` to show puja vidhi:

```
Existing sections:
  - Mythology
  - Observance
  - Significance

New sections (if puja vidhi exists for this festival):
  - Samagri (Materials) — checklist with checkboxes
  - Muhurta (Timing) — computed window or description
  - Puja Vidhi — numbered steps with expandable detail
  - Mantras — Devanagari + IAST toggle, copy button
  - Aarti — full text with Devanagari/Roman toggle
  - Precautions — bullet list
  - Phala (Benefits)
```

### 5.2 Dedicated Puja Vidhi Page

New route: `/[locale]/puja/[slug]`

Full-page puja vidhi with:
- Festival header (name, deity, date from calendar)
- Samagri checklist (interactive — user can check off items)
- Muhurta timing (computed for user's location if available)
- Step-by-step procedure with expandable steps
- Mantras with Devanagari / IAST toggle and audio pronunciation (future)
- Stotra texts (scrollable, with verse numbers)
- Aarti text
- Precautions
- Benefits

This page can be accessed from:
- Festival modal → "View Full Puja Vidhi" button
- Homepage tool cards (new "Puja Vidhi" card)
- Direct URL sharing

### 5.3 Puja Vidhi Index Page

New route: `/[locale]/puja`

Grid of all available puja vidhis as cards:
- Grouped by: Upcoming (next 30 days), Major Festivals, Monthly Vrats
- Each card: deity icon, festival name, date, "View Vidhi" link
- Search/filter functionality

### 5.4 Calendar Integration

On the festival calendar page, festivals with puja vidhi get a special badge/icon indicating "Vidhi Available". Clicking opens the modal with the puja tab, or links to the full page.

### 5.5 Muhurta Integration

For festivals where `muhurtaType === 'computed'`, use the existing muhurta engine (`src/lib/muhurta/`) to compute the exact puja window based on:
- User's location (lat/lng/timezone)
- Festival date
- Muhurta type (Madhyahna, Aparahna, Pradosh, etc.)

The computed window shows: "Best time for puja: 11:42 AM — 1:18 PM" with countdown.

---

## 6. Mantra Rendering

### 6.1 Display Modes

| Mode | Shows | Use Case |
|------|-------|----------|
| **Devanagari** | ॐ गं गणपतये नमः | Default for Hindi/Sanskrit users |
| **IAST** | oṃ gaṃ gaṇapataye namaḥ | For users who can't read Devanagari |
| **Both** | Devanagari on top, IAST below | Learning mode |
| **Meaning** | Below the mantra text | Always shown |

### 6.2 Mantra Component

```typescript
<MantraCard
  mantra={mantra}
  displayMode="both"        // 'devanagari' | 'iast' | 'both'
  showMeaning={true}
  showJapaCount={true}
  copyable={true}            // Copy button for text
/>
```

### 6.3 Font Requirements

- Devanagari: Already have `--font-devanagari-heading` and `--font-devanagari-body`
- IAST: Needs a font that supports diacritics (ā, ī, ū, ṛ, ṣ, ś, ṇ, ṃ, ḥ). Most system fonts support this. Fallback: "Gentium Plus" or "Noto Sans" (already loaded via Google Fonts).

---

## 7. Content Sourcing

### 7.1 Authoritative Sources

All puja vidhi content should be sourced from:

1. **Classical texts**: Puja Paddhati, Dharma Sindhu, Nirnaya Sindhu
2. **Regional traditions**: North Indian (UP/Bihar), South Indian (Tamil Nadu, Kerala), Marathi, Gujarati
3. **Sanskrit originals**: Mantras from Vedas, Puranas, Agamas
4. **Standard compilations**: Vrataraj, Vratarke, Hemadri's Chaturvarga Chintamani

### 7.2 Regional Variations

Some festivals have significantly different puja vidhis by region:
- Navaratri: North (Durga Puja) vs South (Golu/Bommai) vs Gujarat (Garba)
- Ganesh Chaturthi: Maharashtra vs Tamil Nadu vs North India
- Chhath: Bihar/Jharkhand specific

For now: document the most widely practiced (pan-Indian) version. Add regional variants as a future enhancement.

### 7.3 Content Accuracy

Every mantra must be:
- Verified against published Sanskrit texts
- Cross-checked with at least 2 authoritative sources
- IAST romanization validated for correct diacritics
- Meaning reviewed for accuracy

---

## 8. Monetization

**All puja vidhi content is free for all users — no paywall.** Festivals and devotional content are the high-traffic gateway that brings users to the app. Monetization happens on depth features (kundali analysis, AI chat, shadbala, varshaphal) not on devotional content.

Free puja vidhis serve as:
- SEO magnets (high search volume for "Diwali puja vidhi", "Ganesh Chaturthi mantra", etc.)
- Trust builders (users come for puja → discover kundali → convert to Pro)
- Daily engagement drivers (monthly vrats keep users returning)

---

## 9. UI Design

### 9.1 Puja Vidhi Page Layout

```
┌─────────────────────────────────────────┐
│  [Deity Icon]  Festival Name            │
│  Date: 25 Oct 2026  │  Deity: Lakshmi   │
│  Muhurta: 6:12 PM — 8:45 PM (Pradosh)  │
├─────────────────────────────────────────┤
│                                         │
│  ▼ SAMAGRI (Materials)                  │
│  ☐ Coconut (1, unbroken)               │
│  ☐ Red flowers (handful)               │
│  ☐ Ghee lamp (1)                       │
│  ☐ Incense sticks (5)                  │
│  ...                                   │
│                                         │
│  ▼ PUJA VIDHI (Procedure)              │
│  1. Achamana (Sipping water)           │
│     Sip water 3 times reciting...      │
│     ॐ अच्युताय नमः                      │
│     oṃ acyutāya namaḥ                  │
│                                         │
│  2. Sankalpa (Declaration)             │
│     Hold water, flowers, akshat...     │
│     ...                                │
│                                         │
│  3. Kalash Sthapana                    │
│     ...                                │
│                                         │
│  ▼ MANTRAS                             │
│  ┌─────────────────────────┐           │
│  │ Lakshmi Beej Mantra     │           │
│  │ ॐ श्रीं महालक्ष्म्यै नमः  │           │
│  │ oṃ śrīṃ mahālakṣmyai   │           │
│  │ namaḥ                   │           │
│  │ Japa: 108 times         │ [Copy]    │
│  └─────────────────────────┘           │
│                                         │
│  ▼ AARTI                               │
│  ॐ जय लक्ष्मी माता...                   │
│  oṃ jaya lakṣmī mātā...               │
│                                         │
│  ▼ PRECAUTIONS                         │
│  • Do not use broken coconut           │
│  • Puja should face East               │
│  • ...                                 │
│                                         │
│  ▼ PHALA (Benefits)                    │
│  Performing this puja with devotion... │
└─────────────────────────────────────────┘
```

### 9.2 Styling

- Glass-card sections with gold headers (consistent with app)
- Mantra text: larger font size (~18px Devanagari, ~14px IAST)
- Steps: numbered with gold circles, expandable
- Samagri: interactive checkboxes (state stored in localStorage)
- Devanagari/Roman toggle: pill buttons at top of mantra section
- Countdown timer to muhurta (if computed and within 24 hours)

---

## 10. Implementation Order

1. **Types + data structure** — `puja-vidhi/types.ts`
2. **Content: 5 free-tier festivals** — Diwali, Ganesh Chaturthi, Shivaratri, Navaratri, Holi
3. **MantraCard component** — Devanagari/IAST/Both display with copy
4. **Puja page** — `/[locale]/puja/[slug]`
5. **Puja index page** — `/[locale]/puja`
6. **Festival modal integration** — "View Puja Vidhi" link
7. **Content: remaining 10 Tier 1 festivals**
8. **Content: Tier 2 vrats** (Ekadashi, Pradosham, etc.)
9. **Computed muhurta integration**
10. **Content: Tier 3 monthly observances**
11. **Paywall gating** (free gets 5, Pro gets all)
12. **PDF export** of puja vidhi

---

## 11. Content Volume Estimate

| Category | Festivals | Content per Festival | Total |
|----------|-----------|---------------------|-------|
| Tier 1 (full vidhi) | 15 | ~200 lines (~5KB) | ~75KB |
| Tier 2 (vrat vidhi) | 10 | ~100 lines (~2.5KB) | ~25KB |
| Tier 3 (brief vidhi) | 5 | ~50 lines (~1.2KB) | ~6KB |
| **Total** | **30** | | **~106KB** |

This is a content-heavy feature. The code infrastructure (~500 lines for types, components, pages) is small compared to the ~4,000 lines of ritual content.
