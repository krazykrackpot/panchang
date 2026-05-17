# Kundali Simple Mode Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a beginner-friendly Simple mode to the kundali page that renders identity cards, domain rings, timeline, and strengths in plain language — while keeping the existing Expert mode completely untouched.

**Architecture:** New `KundaliSimple.tsx` component dynamically imported inside the existing `Client.tsx` at the post-generation render point (line 956). A `viewMode` state (persisted in localStorage) conditionally renders Simple or existing content. Simple mode composes ~8 new sub-components that read from the same `KundaliData`. Zero modifications to existing rendering logic.

**Tech Stack:** React 19, Framer Motion, Tailwind CSS v4, existing TarotCard component, existing archetype-engine, existing domain synthesis scorer.

---

### Task 1: Data Files — Archetype Lookups + Ashram + Plain Names

**Files:**
- Create: `src/lib/constants/rashi-archetypes.ts`
- Create: `src/lib/constants/nakshatra-archetypes.ts`
- Create: `src/lib/constants/yoga-plain-names.ts`
- Create: `src/lib/constants/dosha-gentle-text.ts`
- Create: `src/lib/constants/ashram-data.ts`

- [ ] **Step 1: Create rashi-archetypes.ts**

12 entries — each rashi mapped to an archetype name, sub-title, one-liner, and colour.

```typescript
// src/lib/constants/rashi-archetypes.ts
export interface RashiArchetype {
  rashiId: number;
  archetype: string;          // "The Warrior"
  oneLineEn: string;          // Poetic one-liner
  oneLineHi: string;
  glowColor: string;          // For the tarot card glow
}

export const RASHI_ARCHETYPES: RashiArchetype[] = [
  { rashiId: 1,  archetype: 'The Warrior',    oneLineEn: 'First to act, first to dare. You enter every room like it was built for you.', oneLineHi: 'सबसे पहले कार्य, सबसे पहले साहस। आप हर कमरे में ऐसे प्रवेश करते हैं जैसे वह आपके लिए बना हो।', glowColor: '#ef4444' },
  { rashiId: 2,  archetype: 'The Builder',    oneLineEn: 'Beneath the fire burns a soul that craves beauty, loyalty, and the slow art of creation.', oneLineHi: 'अग्नि के नीचे एक आत्मा है जो सौन्दर्य, निष्ठा और धीमी सृजनकला चाहती है।', glowColor: '#22c55e' },
  { rashiId: 3,  archetype: 'The Messenger',  oneLineEn: 'Your mind moves faster than the world. Words are your weapons and your wings.', oneLineHi: 'आपका मन संसार से तेज़ चलता है। शब्द आपके अस्त्र और पंख हैं।', glowColor: '#f59e0b' },
  { rashiId: 4,  archetype: 'The Nurturer',   oneLineEn: 'You feel everything twice — once for yourself, once for the world. That is your power.', oneLineHi: 'आप सब कुछ दो बार अनुभव करते हैं — एक बार स्वयं के लिए, एक बार संसार के लिए।', glowColor: '#e0e0e0' },
  { rashiId: 5,  archetype: 'The Sovereign',  oneLineEn: 'Born to lead, not to follow. The spotlight finds you whether you seek it or not.', oneLineHi: 'नेतृत्व के लिए जन्मे, अनुसरण के लिए नहीं। प्रकाश आपको ढूँढ लेता है।', glowColor: '#f59e0b' },
  { rashiId: 6,  archetype: 'The Analyst',    oneLineEn: 'Precision is your art. Where others see chaos, you find patterns waiting to be named.', oneLineHi: 'सटीकता आपकी कला है। जहाँ अन्य अराजकता देखते हैं, आप प्रतिरूप खोज लेते हैं।', glowColor: '#22c55e' },
  { rashiId: 7,  archetype: 'The Harmonizer', oneLineEn: 'Balance is not passive — it is the hardest act of creation. You make it look effortless.', oneLineHi: 'संतुलन निष्क्रिय नहीं — यह सृजन का सबसे कठिन कार्य है। आप इसे सहज बना देते हैं।', glowColor: '#3b82f6' },
  { rashiId: 8,  archetype: 'The Alchemist',  oneLineEn: 'You transform everything you touch. Destruction and creation are the same act in your hands.', oneLineHi: 'आप जो छूते हैं उसे रूपान्तरित कर देते हैं। विनाश और सृजन आपके हाथों में एक ही क्रिया हैं।', glowColor: '#ef4444' },
  { rashiId: 9,  archetype: 'The Seeker',     oneLineEn: 'The horizon is not a destination — it is an invitation. You were born to explore.', oneLineHi: 'क्षितिज गन्तव्य नहीं — यह निमन्त्रण है। आप अन्वेषण के लिए जन्मे हैं।', glowColor: '#8b5cf6' },
  { rashiId: 10, archetype: 'The Architect',  oneLineEn: 'You build structures that outlast you. Discipline is your love language.', oneLineHi: 'आप ऐसी संरचनाएँ बनाते हैं जो आपसे आगे जीवित रहें। अनुशासन आपकी प्रेम भाषा है।', glowColor: '#8a6d2b' },
  { rashiId: 11, archetype: 'The Visionary',  oneLineEn: 'You see the future before it arrives. The world catches up to your ideas — eventually.', oneLineHi: 'आप भविष्य को उसके आने से पहले देखते हैं। संसार आपके विचारों तक पहुँचता है — अन्ततः।', glowColor: '#3b82f6' },
  { rashiId: 12, archetype: 'The Mystic',     oneLineEn: 'The boundary between dream and reality is thinner for you than for anyone else alive.', oneLineHi: 'स्वप्न और वास्तविकता की सीमा आपके लिए किसी भी अन्य से पतली है।', glowColor: '#8b5cf6' },
];
```

- [ ] **Step 2: Create nakshatra-archetypes.ts**

27 entries — same structure. Use the nakshatra deity and nature for archetype inspiration. Example entries:

```typescript
// src/lib/constants/nakshatra-archetypes.ts
export interface NakshatraArchetype {
  nakshatraId: number;
  archetype: string;
  oneLineEn: string;
  oneLineHi: string;
}

export const NAKSHATRA_ARCHETYPES: NakshatraArchetype[] = [
  { nakshatraId: 1,  archetype: 'The Healer',      oneLineEn: 'Swift as dawn, you restore what others believe is broken beyond repair.', oneLineHi: 'उषा के समान शीघ्र, आप वह ठीक करते हैं जो अन्य टूटा मानते हैं।' },
  { nakshatraId: 2,  archetype: 'The Transformer',  oneLineEn: 'You carry the weight of endings so new beginnings can breathe.', oneLineHi: 'आप अन्त का भार वहन करते हैं ताकि नई शुरुआत साँस ले सके।' },
  { nakshatraId: 3,  archetype: 'The Flame',        oneLineEn: 'Sharp, purifying, unstoppable. You cut through illusion with a blade of truth.', oneLineHi: 'तीक्ष्ण, शुद्ध करने वाली, अजेय। आप सत्य की तलवार से भ्रम काटते हैं।' },
  { nakshatraId: 4,  archetype: 'The Creator',      oneLineEn: 'The most abundant star. Where you focus, beauty and prosperity grow without limit.', oneLineHi: 'सबसे समृद्ध नक्षत्र। जहाँ आप ध्यान देते हैं, सौन्दर्य और समृद्धि अपार बढ़ती है।' },
  // ... remaining 23 entries with unique archetypes and one-liners
  // Full list curated from nakshatra deity, nature, and traditional characteristics
];
```

Write all 27 entries. Use NAKSHATRA_DETAILS characteristics for inspiration.

- [ ] **Step 3: Create yoga-plain-names.ts**

Top 30 most common yogas mapped to plain-language names:

```typescript
// src/lib/constants/yoga-plain-names.ts
export const YOGA_PLAIN_NAMES: Record<string, { en: string; hi: string }> = {
  'gajakesari': { en: 'Wisdom & Public Recognition', hi: 'ज्ञान और सार्वजनिक मान्यता' },
  'budhaditya': { en: 'Sharp Intellect & Communication', hi: 'तीव्र बुद्धि और संवाद कौशल' },
  'chandra-mangala': { en: 'Wealth Through Action', hi: 'कर्म से धन' },
  'hamsa': { en: 'Noble Character & Spiritual Wisdom', hi: 'उत्तम चरित्र और आध्यात्मिक ज्ञान' },
  'malavya': { en: 'Beauty, Luxury & Romantic Fulfilment', hi: 'सौन्दर्य, विलासिता और प्रेम पूर्ति' },
  'ruchaka': { en: 'Physical Courage & Leadership', hi: 'शारीरिक साहस और नेतृत्व' },
  'bhadra': { en: 'Eloquence & Analytical Brilliance', hi: 'वाक्पटुता और विश्लेषणात्मक प्रतिभा' },
  'shasha': { en: 'Authority & Enduring Power', hi: 'अधिकार और स्थायी शक्ति' },
  // ... 22 more entries for raja yogas, dhana yogas, common chandra yogas
};

/** Get plain name for a yoga. Falls back to first sentence of description. */
export function getYogaPlainName(yogaId: string, descriptionEn: string, locale: string): string {
  const plain = YOGA_PLAIN_NAMES[yogaId];
  if (plain) return locale === 'hi' ? plain.hi : plain.en;
  // Fallback: first sentence of the yoga's description
  return descriptionEn.split('.')[0] + '.';
}
```

- [ ] **Step 4: Create dosha-gentle-text.ts**

```typescript
// src/lib/constants/dosha-gentle-text.ts
export const DOSHA_GENTLE: Record<string, { titleEn: string; titleHi: string; bodyEn: string; bodyHi: string }> = {
  'mangal-dosha': {
    titleEn: 'Relationships need patience',
    titleHi: 'संबंधों में धैर्य आवश्यक',
    bodyEn: 'A karmic pattern suggests delayed but ultimately stable partnerships. Marriage after careful consideration tends to be more fulfilling. Remedies can smooth the path.',
    bodyHi: 'एक कार्मिक प्रवृत्ति विलम्बित किन्तु अन्ततः स्थिर साझेदारी का संकेत देती है। सावधानीपूर्वक विचार के बाद विवाह अधिक सन्तोषजनक होता है। उपाय मार्ग सुगम कर सकते हैं।',
  },
  'kaal-sarpa': {
    titleEn: 'Life unfolds in concentrated bursts',
    titleHi: 'जीवन केन्द्रित विस्फोटों में प्रकट होता है',
    bodyEn: 'A pattern of intense focus and sudden breakthroughs characterises your path. What feels like constraint is actually concentration — your energy is channelled, not blocked.',
    bodyHi: 'तीव्र ध्यान और अचानक सफलताओं का प्रतिरूप आपके मार्ग की विशेषता है। जो बाधा प्रतीत होती है वह वास्तव में एकाग्रता है।',
  },
  'pitra-dosha': {
    titleEn: 'Ancestral patterns seek resolution',
    titleHi: 'पैतृक प्रवृत्तियाँ समाधान चाहती हैं',
    bodyEn: 'Inherited karmic patterns from your lineage influence career and father relationships. Conscious acknowledgement and specific remedies help dissolve these patterns over time.',
    bodyHi: 'आपके वंश से विरासत में मिली कार्मिक प्रवृत्तियाँ करियर और पिता सम्बन्धों को प्रभावित करती हैं। सचेत स्वीकृति और विशिष्ट उपाय इन प्रवृत्तियों को समय के साथ विसर्जित करते हैं।',
  },
};

export function getDoshaGentleText(doshaId: string, locale: string): { title: string; body: string } | null {
  const entry = DOSHA_GENTLE[doshaId];
  if (!entry) return null;
  return {
    title: locale === 'hi' ? entry.titleHi : entry.titleEn,
    body: locale === 'hi' ? entry.bodyHi : entry.bodyEn,
  };
}
```

- [ ] **Step 5: Create ashram-data.ts**

```typescript
// src/lib/constants/ashram-data.ts
export interface AshramInfo {
  id: string;
  nameEn: string;
  nameHi: string;
  nameSa: string;
  ageMin: number;
  ageMax: number;
  descriptionEn: string;
  descriptionHi: string;
  focusAreas: { en: string; hi: string }[];
}

export const ASHRAMS: AshramInfo[] = [
  {
    id: 'brahmacharya', nameEn: 'Brahmacharya', nameHi: 'ब्रह्मचर्य', nameSa: 'ब्रह्मचर्यम्',
    ageMin: 0, ageMax: 25,
    descriptionEn: 'The Student — your dharma now is to learn, build discipline, and lay the foundation for everything that follows.',
    descriptionHi: 'विद्यार्थी — आपका वर्तमान धर्म सीखना, अनुशासन बनाना और आगे आने वाली हर चीज़ की नींव रखना है।',
    focusAreas: [
      { en: 'Education', hi: 'शिक्षा' },
      { en: 'Skill Building', hi: 'कौशल निर्माण' },
      { en: 'Self-Discipline', hi: 'आत्म-अनुशासन' },
      { en: 'Foundation', hi: 'नींव निर्माण' },
    ],
  },
  {
    id: 'grihastha', nameEn: 'Grihastha', nameHi: 'गृहस्थ', nameSa: 'गृहस्थम्',
    ageMin: 25, ageMax: 50,
    descriptionEn: 'The Householder — the most active ashram. Build wealth, raise family, serve society. All four Purusharthas are pursued simultaneously.',
    descriptionHi: 'गृहस्थी — सबसे सक्रिय आश्रम। धन बनाएँ, परिवार पालें, समाज सेवा करें। चारों पुरुषार्थ एक साथ साधें।',
    focusAreas: [
      { en: 'Career Growth', hi: 'करियर उन्नति' },
      { en: 'Family Building', hi: 'परिवार निर्माण' },
      { en: 'Wealth Creation', hi: 'धन सृजन' },
      { en: 'Dharmic Service', hi: 'धार्मिक सेवा' },
    ],
  },
  {
    id: 'vanaprastha', nameEn: 'Vanaprastha', nameHi: 'वानप्रस्थ', nameSa: 'वानप्रस्थम्',
    ageMin: 50, ageMax: 75,
    descriptionEn: 'The Mentor — step back from active accumulation. Share wisdom, mentor the young, deepen spiritual practice.',
    descriptionHi: 'मार्गदर्शक — सक्रिय संचय से पीछे हटें। ज्ञान बाँटें, युवाओं का मार्गदर्शन करें, आध्यात्मिक साधना गहरी करें।',
    focusAreas: [
      { en: 'Mentoring', hi: 'मार्गदर्शन' },
      { en: 'Giving Back', hi: 'समाज सेवा' },
      { en: 'Spiritual Practice', hi: 'आध्यात्मिक साधना' },
      { en: 'Legacy Building', hi: 'विरासत निर्माण' },
    ],
  },
  {
    id: 'sannyasa', nameEn: 'Sannyasa', nameHi: 'संन्यास', nameSa: 'संन्यासम्',
    ageMin: 75, ageMax: 150,
    descriptionEn: 'The Sage — release attachment to worldly outcomes. Focus on inner peace, moksha, and the transmission of wisdom.',
    descriptionHi: 'संन्यासी — सांसारिक परिणामों से आसक्ति त्यागें। आन्तरिक शान्ति, मोक्ष और ज्ञान के संचरण पर ध्यान दें।',
    focusAreas: [
      { en: 'Inner Peace', hi: 'आन्तरिक शान्ति' },
      { en: 'Moksha', hi: 'मोक्ष' },
      { en: 'Wisdom Sharing', hi: 'ज्ञान दान' },
      { en: 'Spiritual Legacy', hi: 'आध्यात्मिक विरासत' },
    ],
  },
];

export function getAshram(birthDate: string): AshramInfo {
  const birth = new Date(birthDate);
  const today = new Date();
  const age = today.getFullYear() - birth.getFullYear();
  return ASHRAMS.find(a => age >= a.ageMin && age < a.ageMax) ?? ASHRAMS[1]; // Default grihastha
}
```

- [ ] **Step 6: Type-check and commit**

```bash
npx tsc --noEmit -p tsconfig.build-check.json
git add src/lib/constants/rashi-archetypes.ts src/lib/constants/nakshatra-archetypes.ts src/lib/constants/yoga-plain-names.ts src/lib/constants/dosha-gentle-text.ts src/lib/constants/ashram-data.ts
git commit -m "feat(kundali-simple): data files — archetype lookups, ashram, plain names"
```

---

### Task 2: ArchetypeIcons Component — 9 Bold SVG Icons

**Files:**
- Create: `src/components/icons/ArchetypeIcons.tsx`

- [ ] **Step 1: Create 9 archetype SVG icons**

Each icon follows the same gold gradient + glow filter pattern as `RashiIcons.tsx` and `NakshatraIcons.tsx`. Multi-layered, bold, tarot-style — NOT simple line art.

The 9 archetypes (from archetype-engine.ts):
- Sovereign (Sun) — crown with radiating rays
- Empath (Moon) — crescent moon with flowing water drops
- Warrior (Mars) — shield with crossed spears
- Analyst (Mercury) — all-seeing eye with geometric patterns
- Visionary (Jupiter) — open third eye with cosmic spiral
- Harmonizer (Venus) — balanced scales with lotus flowers
- Architect (Saturn) — pillared temple structure
- Maverick (Rahu) — comet with disrupted orbit trail
- Mystic (Ketu) — flame dissolving into cosmic void

Each SVG: 96×96 viewBox, gold gradient defs (`#f0d48a → #d4a853 → #8a6d2b`), glow filter, multiple layered paths for depth.

```typescript
// src/components/icons/ArchetypeIcons.tsx
'use client';

import type { ArchetypeId } from '@/lib/constants/archetype-data';

interface Props {
  archetype: ArchetypeId;
  size?: number;
  className?: string;
}

export default function ArchetypeIcon({ archetype, size = 96, className = '' }: Props) {
  return (
    <svg width={size} height={size} viewBox="0 0 96 96" className={className} xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id={`archGrad-${archetype}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#f0d48a" />
          <stop offset="50%" stopColor="#d4a853" />
          <stop offset="100%" stopColor="#8a6d2b" />
        </linearGradient>
        <filter id={`archGlow-${archetype}`}>
          <feGaussianBlur stdDeviation="3" result="glow" />
          <feMerge><feMergeNode in="glow" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>
      {ICON_PATHS[archetype]}
    </svg>
  );
}

// Each archetype gets its own multi-layered SVG paths
const ICON_PATHS: Record<ArchetypeId, React.ReactNode> = {
  sovereign: (
    <g filter="url(#archGlow-sovereign)" fill="url(#archGrad-sovereign)">
      {/* Crown base */}
      <path d="M24 72 L48 16 L72 72 Z" fill="none" stroke="url(#archGrad-sovereign)" strokeWidth="2" />
      {/* Crown points */}
      <path d="M30 72 L36 40 L48 60 L60 40 L66 72" fill="none" stroke="url(#archGrad-sovereign)" strokeWidth="1.5" />
      {/* Central jewel */}
      <circle cx="48" cy="52" r="4" fill="url(#archGrad-sovereign)" />
      {/* Radiating rays */}
      <path d="M48 12 L48 4 M36 18 L30 12 M60 18 L66 12" stroke="url(#archGrad-sovereign)" strokeWidth="1" opacity="0.6" />
      {/* Base ornament */}
      <path d="M20 76 L76 76" stroke="url(#archGrad-sovereign)" strokeWidth="2" />
      <circle cx="32" cy="76" r="2" fill="url(#archGrad-sovereign)" opacity="0.5" />
      <circle cx="48" cy="76" r="2" fill="url(#archGrad-sovereign)" opacity="0.5" />
      <circle cx="64" cy="76" r="2" fill="url(#archGrad-sovereign)" opacity="0.5" />
    </g>
  ),
  // ... 8 more archetypes with equally detailed SVG paths
  // Each should be 10-20 lines of SVG path elements, multi-layered, dramatic
};
```

Write ALL 9 icon path sets with the same level of detail as the sovereign example. Refer to existing RashiIcons.tsx for quality bar — those are 20-30 lines of SVG each.

- [ ] **Step 2: Type-check and commit**

```bash
npx tsc --noEmit -p tsconfig.build-check.json
git add src/components/icons/ArchetypeIcons.tsx
git commit -m "feat(kundali-simple): 9 bold archetype SVG icons"
```

---

### Task 3: Simple Sub-Components (6 focused components)

**Files:**
- Create: `src/components/kundali/simple/ViewModeToggle.tsx`
- Create: `src/components/kundali/simple/AshramStage.tsx`
- Create: `src/components/kundali/simple/DomainRingsCard.tsx`
- Create: `src/components/kundali/simple/SimpleTimeline.tsx`
- Create: `src/components/kundali/simple/StrengthsList.tsx`
- Create: `src/components/kundali/simple/GrowthAreas.tsx`

- [ ] **Step 1: Create ViewModeToggle.tsx**

```typescript
// src/components/kundali/simple/ViewModeToggle.tsx
'use client';

interface Props {
  mode: 'simple' | 'expert';
  onToggle: (mode: 'simple' | 'expert') => void;
}

export default function ViewModeToggle({ mode, onToggle }: Props) {
  return (
    <div className="inline-flex rounded-full border border-gold-primary/30 overflow-hidden text-xs">
      <button
        onClick={() => onToggle('simple')}
        className={`px-4 py-1.5 font-semibold transition-colors ${
          mode === 'simple'
            ? 'bg-gold-primary/20 text-gold-light'
            : 'text-text-secondary hover:text-gold-light'
        }`}
      >
        Simple
      </button>
      <button
        onClick={() => onToggle('expert')}
        className={`px-4 py-1.5 font-semibold transition-colors ${
          mode === 'expert'
            ? 'bg-gold-primary/20 text-gold-light'
            : 'text-text-secondary hover:text-gold-light'
        }`}
      >
        Expert
      </button>
    </div>
  );
}
```

- [ ] **Step 2: Create AshramStage.tsx**

Uses `getAshram()` from ashram-data.ts. Renders the ashram card with Sanskrit name and focus area pills.

- [ ] **Step 3: Create DomainRingsCard.tsx**

Renders three concentric SVG rings (overall/natal/current) with the numeric score in the centre. Uses `buildDomainVerdicts()` from the AI Pandit context builder for verdict data. Expandable on tap for full domain narrative.

- [ ] **Step 4: Create SimpleTimeline.tsx**

Horizontal progress bar + current maha/antar dasha. Uses `kundali.dashas[]` to find active periods. Descriptions from archetype engine's `chapterDescription`.

- [ ] **Step 5: Create StrengthsList.tsx**

Filters `evaluatedYogas` to `present && isAuspicious`, takes top 5, maps via `getYogaPlainName()`. Renders as bullet list with ✦ prefix.

- [ ] **Step 6: Create GrowthAreas.tsx**

Filters `evaluatedYogas` to `present && !isAuspicious`, maps via `getDoshaGentleText()`. Renders as gentle amber cards without alarmist language.

- [ ] **Step 7: Type-check and commit**

```bash
npx tsc --noEmit -p tsconfig.build-check.json
git add src/components/kundali/simple/
git commit -m "feat(kundali-simple): 6 sub-components — toggle, ashram, rings, timeline, strengths, growth"
```

---

### Task 4: CosmicIdentityCard — Synthesis Hero + Three Tarot Cards

**Files:**
- Create: `src/components/kundali/simple/CosmicIdentityCard.tsx`

- [ ] **Step 1: Create CosmicIdentityCard.tsx**

This is the hero section — synthesis card on top, three individual cards below. Uses:
- `generateCosmicBlueprint(kundali)` for archetype data
- `ArchetypeIcon` for the hero card icon
- `RashiIconById` for Rising and Moon cards
- `NakshatraIconById` for Star card
- `RASHI_ARCHETYPES` and `NAKSHATRA_ARCHETYPES` for sub-names and one-liners
- TarotCard ornate styling (borders, flourishes, noise, glow) — match the quality bar of `TarotCard.tsx`

The three individual cards use a horizontal scroll with snap on mobile (<480px), side-by-side on desktop. Moon card (centre) is elevated by `transform: translateY(-10px)`.

~250 lines.

- [ ] **Step 2: Type-check and commit**

```bash
npx tsc --noEmit -p tsconfig.build-check.json
git add src/components/kundali/simple/CosmicIdentityCard.tsx
git commit -m "feat(kundali-simple): cosmic identity — synthesis hero + three tarot cards"
```

---

### Task 5: KundaliSimple Container + Integration into Client.tsx

**Files:**
- Create: `src/components/kundali/KundaliSimple.tsx`
- Modify: `src/app/[locale]/kundali/Client.tsx` (~15 lines added, zero existing lines changed)

- [ ] **Step 1: Create KundaliSimple.tsx**

Main container that composes all sub-components in order:
1. CosmicIdentityCard
2. AshramStage
3. DomainRingsCard × 4 (Career, Relationships, Health, Wealth)
4. SimpleTimeline
5. StrengthsList
6. GrowthAreas
7. Share + PDF + Expert toggle footer

Receives `kundali: KundaliData`, `locale: string`, `onSwitchToExpert: () => void` as props.

Computes on mount: `generateCosmicBlueprint(kundali)`, `buildDomainVerdicts(kundali, 'general')`.

Skeleton shimmer during computation (~50ms).

~400 lines.

- [ ] **Step 2: Integrate into Client.tsx**

Add a `viewMode` state and conditionally render Simple or existing content. The integration point is at line 956 (`{kundali && !editing && (`).

Add at the top of Client.tsx:
```typescript
const KundaliSimple = dynamic(() => import('@/components/kundali/KundaliSimple'), { ssr: false });
```

Add state:
```typescript
const [viewMode, setViewMode] = useState<'simple' | 'expert'>(() => {
  if (typeof window === 'undefined') return 'simple';
  return (localStorage.getItem('kundali-view-mode') as 'simple' | 'expert') ?? 'simple';
});
```

At line 956, wrap the existing content:
```typescript
{kundali && !editing && (
  viewMode === 'simple' ? (
    <KundaliSimple
      kundali={kundali}
      locale={locale}
      onSwitchToExpert={() => {
        localStorage.setItem('kundali-view-mode', 'expert');
        setViewMode('expert');
      }}
    />
  ) : (
    <motion.div ...> {/* existing content — UNCHANGED */}
```

This is ~15 lines added. Zero existing rendering logic is modified — the existing `<motion.div>` block is wrapped in an `else` branch, not rewritten.

- [ ] **Step 3: Run full verification**

```bash
npx tsc --noEmit -p tsconfig.build-check.json
npx vitest run
```

Both must pass. The existing kundali tests must not be affected.

- [ ] **Step 4: Commit**

```bash
git add src/components/kundali/KundaliSimple.tsx src/app/[locale]/kundali/Client.tsx
git commit -m "feat(kundali-simple): container + Client.tsx integration (15 lines added)"
```

---

### Task 6: Final Verification + Push

- [ ] **Step 1: Full test suite**

```bash
npx vitest run
```

Expected: all existing tests pass, zero regressions.

- [ ] **Step 2: Type-check**

```bash
npx tsc --noEmit -p tsconfig.build-check.json
```

Expected: zero errors.

- [ ] **Step 3: Verify Expert mode is untouched**

```bash
# Confirm Client.tsx only has the ~15 line wrapper addition
git diff src/app/[locale]/kundali/Client.tsx | head -40
```

Verify: only the dynamic import, viewMode state, and conditional wrapper are added. No existing rendering code is modified.

- [ ] **Step 4: Push**

```bash
git push origin main
```

---

## Self-Review

1. **Spec coverage:** §3.1 toggle → Task 5 step 2. §3.2 hero card → Task 4. §3.3 three cards → Task 4. §3.4 ashram → Task 1+3. §3.5 rings → Task 3. §3.6 timeline → Task 3. §3.7 strengths → Task 3. §3.8 growth → Task 3. §3.9 actions → Task 5. §4 exclusions → enforced by conditional render. §5 expert mode → untouched. §6 components → Tasks 1-5. §7 integration → Task 5. §11 loading → Task 5 skeleton. All covered.

2. **Placeholder scan:** Task 2 says "Write ALL 9 icon path sets" — during implementation, each must have actual SVG paths, not placeholders. Task 1 step 2 says "Write all 27 entries" — same. These are content tasks that must be fully completed.

3. **Type consistency:** `KundaliSimple` props: `kundali: KundaliData, locale: string, onSwitchToExpert: () => void` — consistent across Task 5 steps 1 and 2. `viewMode: 'simple' | 'expert'` — consistent across ViewModeToggle and Client.tsx. `ArchetypeId` type imported from `archetype-data.ts` — consistent with existing usage.
