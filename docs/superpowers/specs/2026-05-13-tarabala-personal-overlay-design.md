# Personal Tarabala Overlay — Detailed Design

**Date:** 2026-05-13  
**Status:** Design Only (no implementation yet)  
**Depends on:** Best Windows Today card (done), activity-aware mode (done), auth + saved kundali

---

## 1. What Tarabala Is

Tarabala (Star Strength) is a **personal** auspiciousness indicator based on the transit of the Moon through the 27 nakshatras relative to your **birth nakshatra**. It creates a repeating 9-tara cycle:

| Tara # | Name | Sanskrit | Nature | Effect |
|--------|------|----------|--------|--------|
| 1 | Janma | जन्मा | Neutral-Unfavourable | Birth star — mixed results, proceed with caution |
| 2 | **Sampat** | **सम्पत्** | **Favourable** | Wealth & prosperity — excellent for financial matters |
| 3 | Vipat | विपत् | Unfavourable | Danger & obstacles — avoid new beginnings |
| 4 | **Kshema** | **क्षेम** | **Favourable** | Well-being & comfort — good for all activities |
| 5 | Pratyari | प्रत्यरि | Unfavourable | Obstacles & enemies — avoid confrontation |
| 6 | **Sadhana** | **साधनम्** | **Favourable** | Achievement — good for goal-oriented work |
| 7 | Vadha | वधः | Unfavourable | Destruction — avoid important decisions |
| 8 | **Mitra** | **मित्रम्** | **Favourable** | Friendship — excellent for social activities |
| 9 | **Parama Mitra** | **परममित्रम्** | **Favourable** | Supreme friendship — best possible tara |

The cycle repeats 3 times across the 27 nakshatras (27 / 9 = 3 cycles). Each repetition is progressively weaker:
- 1st cycle (nakshatras 1-9 from birth): full strength
- 2nd cycle (10-18 from birth): 75% strength
- 3rd cycle (19-27 from birth): 50% strength

**Formula:** `tara = ((todayNakshatra - birthNakshatra + 27) % 9) || 9`

**Favourable taras:** 2 (Sampat), 4 (Kshema), 6 (Sadhana), 8 (Mitra), 9 (Parama Mitra)  
**Unfavourable taras:** 3 (Vipat), 5 (Pratyari), 7 (Vadha)  
**Neutral:** 1 (Janma) — debated, treated as mildly unfavourable by most practitioners

## 2. What Already Exists

All computation is already built:

| Component | File | What it does |
|-----------|------|-------------|
| `computeBalam()` | `src/lib/panchang/balam.ts` | Returns `BalamResult` with tarabalam + chandrabalam for given birth/today nakshatras |
| `computeTarabalamGrid()` | Same file | Returns tara status for ALL 27 nakshatras at once |
| `TARA_NAMES` | Same file | Trilingual names for all 9 taras |
| `FAVORABLE_TARAS` | Same file | Set {2, 4, 6, 8, 9} |
| Muhurta rule | `src/lib/muhurta/engine/rules/personal.ts` | Scores windows using tara + cycle degradation |
| Scanner inline | `src/lib/muhurta/engine/scanner.ts:339-348` | Populates `ScoredWindow.taraBala` |

Birth nakshatra is available from:
- **Logged-in users:** `user_profiles.moon_nakshatra` or `kundali_snapshots.moon_nakshatra` in Supabase
- **Saved charts:** The dashboard already reads `snapshot.moon_nakshatra` for personalization
- **Manual input:** The panchang page has `birthNakshatra` state (used for muhurta scanning)

## 3. Design: How the Overlay Works

### 3.1 Trigger

A toggle on the BestWindowsCard: **"Apply my chart"** (or "मेरा लग्न लागू करें" in Hindi).

**Three states:**
1. **No birth data available:** Toggle is greyed out with tooltip "Sign in with birth data to personalise"
2. **Birth data available, toggle OFF:** General verdict shown (current behaviour)
3. **Birth data available, toggle ON:** Personal overlay applied

### 3.2 Data Flow

```
User's birth nakshatra (from auth store / saved kundali)
  ↓
computeBalam(birthNakshatra, birthRashi, todayNakshatra, todayMoonRashi)
  ↓
BalamResult { tarabalam: { tara, taraName, favorable }, chandrabalam: { house, favorable } }
  ↓
Overlay on BestWindowsCard verdict
```

### 3.3 How It Affects the Verdict

The personal overlay does NOT replace the general verdict. It adds a **personal layer** on top:

**When Tarabala is UNFAVOURABLE (tara 3, 5, or 7):**
- A slot that's generally "Good" becomes "Good (Personal: Caution)"
- The slot card shows a blue badge: "Vipat Tara — obstacles likely for you today"
- The verdict bar gets a blue-hatched overlay on all slots (since tara is day-level)
- The best window callout adds a note: "Note: your birth star (Pushya) is in Vipat Tara today. Proceed with awareness."

**When Tarabala is FAVOURABLE (tara 2, 4, 6, 8, 9):**
- A slot that's generally "Good" becomes "Good (Personal: Excellent)"
- The slot card shows a blue badge: "Sampat Tara — prosperity for you today"
- The best window callout adds: "Your birth star (Pushya) is in Sampat Tara — personally auspicious"

**When combined with hard blocks:**
- Rahu Kaal is still AVOID regardless of personal tara. Hard blocks are never overridden by personal factors.
- But a favourable tara during a clean window makes that window EVEN better for this specific user.

**When Chandrabala is also available:**
- Both tarabala and chandrabala are shown
- Chandrabala checks if the Moon's transit rashi is in a favourable house from the birth Moon sign
- If both are favourable → "Strongly favourable personally"
- If one favourable, one not → "Mixed personal indicators"
- If both unfavourable → "Personally unfavourable day — postpone if possible"

### 3.4 Visual Design

**The toggle:**
```
┌─────────────────────────────────────────────────────┐
│  ✦ Best Windows Today              [👤 My Chart ◯]  │
│                                                      │
│  (toggle is a small switch, right-aligned)           │
└─────────────────────────────────────────────────────┘
```

When toggled ON, the header changes:
```
┌─────────────────────────────────────────────────────┐
│  ✦ Best Windows Today              [👤 My Chart ●]  │
│  Pushya birth star • Sampat Tara today • Favourable │
└─────────────────────────────────────────────────────┘
```

**Personal lane in the timeline:**

Add a 4th lane below the Net Result:

```
INAUSP:   ░░░░░░[Rahu Kaal]░░░░░░░[Yamaganda]░░░░░░░░░░░░░░░
AUSP:     [Brahma]░░░░░░░░░░░[Amrit Kalam][Abhijit]░░░░░░░░░░
RESULT:   ████████▓▓▓▓▓▓▓▓▓▓████████████████████▓▓▓▓▓▓████████
PERSONAL: ████████████████████████████████████████████████████████
          Sampat Tara — favourable all day (day-level)
```

The personal lane is:
- **Solid blue-green** (#0ea5e9) when tara is favourable → full day
- **Solid blue-red** (#6366f1, indigo) when tara is unfavourable → full day
- Since tara is DAY-LEVEL (nakshatra doesn't change every 30 min), it's one solid bar
- Exception: if the nakshatra transitions mid-day, the lane would show two segments (before/after transition) — but for v1, use the primary nakshatra

**Colour language:**
- General factors: red (block), amber (caution), green (good), gold (excellent) — existing
- Personal factors: **blue spectrum** — clearly distinct from the general palette
  - Blue-green (#0ea5e9): personally favourable
  - Indigo (#6366f1): personally unfavourable
  - This ensures the user can instantly distinguish "general" from "personal"

### 3.5 The Best Window Callout (personalised)

When toggle is ON and a best window exists:

```
┌─────────────────────────────────────────────────────┐
│  BEST WINDOW     ★★★ Excellent                     │
│  11:30 AM – 12:40 PM                                │
│  Abhijit Muhurta + Amrit Kalam                       │
│                                                      │
│  👤 Personal: Sampat Tara — prosperity for you.      │
│     Moon in 10th house from birth Moon — favourable.  │
└─────────────────────────────────────────────────────┘
```

When personal indicators are mixed or unfavourable:
```
│  👤 Personal: Vipat Tara — obstacles likely.          │
│     Consider postponing to tomorrow (Kshema Tara).    │
│     Moon in 8th house from birth Moon — unfavourable. │
```

The "consider postponing" suggestion should compute WHEN the next favourable tara occurs (by checking which nakshatra follows and what tara it maps to).

### 3.6 "When will my tara improve?" — Forward Lookup

When the personal overlay shows an unfavourable tara, the user's natural question is: "When does it get better?"

**Algorithm:**
1. Get current nakshatra and remaining duration
2. Walk forward through nakshatras: current → current+1 → current+2 → ...
3. For each, compute tara from birth nakshatra
4. Stop at the first favourable tara (2, 4, 6, 8, or 9)
5. Show: "Next favourable window: {nakshatra name} starts ~{date/time}"

The nakshatra transition time is already available in `panchang.nakshatraTransition.endTime`. Each nakshatra lasts ~1 day (actually 13h20m average), so the next favourable tara is at most 4 nakshatras away (since the cycle is 9 and we need one of {2,4,6,8,9}, the maximum gap between two consecutive favourable taras is 2 — from 6 to 8, skipping 7).

This means the "next good window" is at most ~2 days away. Often it's the very next nakshatra.

## 4. Implementation Architecture

### 4.1 New Props for BestWindowsCard

```typescript
interface BestWindowsCardProps {
  panchang: PanchangData;
  locale: string;
  timezone?: string;
  // Personal overlay (optional — only when user has birth data)
  birthNakshatra?: number;  // 1-27
  birthRashi?: number;      // 1-12
}
```

### 4.2 Component Logic

```typescript
// Inside BestWindowsCard:
const [personalMode, setPersonalMode] = useState(false);
const hasBirthData = birthNakshatra != null && birthRashi != null;

const personalBalam = useMemo(() => {
  if (!hasBirthData || !personalMode) return null;
  const todayNak = panchang.nakshatra.id;  // or .number
  const todayMoonRashi = getRashiFromLongitude(panchang.moonLongitude); // need this
  return computeBalam(birthNakshatra!, birthRashi!, todayNak, todayMoonRashi);
}, [hasBirthData, personalMode, birthNakshatra, birthRashi, panchang]);
```

### 4.3 Passing Birth Data from PanchangClient

PanchangClient already has `birthNakshatra` and `birthRashi` state (used for muhurta scanner):

```typescript
// In PanchangClient.tsx, find:
const [birthNakshatra, setBirthNakshatra] = useState(0);
const [birthRashi, setBirthRashi] = useState(0);

// Pass to BestWindowsCard:
<BestWindowsCard
  panchang={panchang}
  locale={locale}
  timezone={location.ianaTimezone}
  birthNakshatra={birthNakshatra || undefined}
  birthRashi={birthRashi || undefined}
/>
```

### 4.4 Passing Birth Data from Dashboard

The dashboard already loads `snapshot.moon_nakshatra` and `snapshot.moon_sign`:

```typescript
<BestWindowsCard
  panchang={panchangData}
  locale={locale}
  timezone={locStore.timezone ?? undefined}
  birthNakshatra={userMoonNakshatra || undefined}
  birthRashi={userMoonSign || undefined}
/>
```

### 4.5 Today's Moon Rashi

For chandrabala, we need today's Moon rashi (sign). This is available in PanchangData as:
- `panchang.moonSign` (if present), or
- Derivable from `panchang.nakshatra.id`: `moonRashi = Math.ceil(nakshatra.id / 2.25)` (approximate — each rashi spans 2.25 nakshatras)
- Better: check if `panchang` has a direct `moonRashi` or `moonSign` field

## 5. Data Access Considerations

### 5.1 Who Has Birth Data?

- **Logged-in users with saved kundali:** ~13 users currently. Their `moon_nakshatra` is in the `kundali_snapshots` table.
- **Anonymous users:** No birth data. The toggle is greyed out → "Sign in to personalise"
- **Logged-in without birth data:** Toggle greyed out → "Add your birth details to personalise"

This creates a natural **conversion funnel**: users who want personalised tarabala must create an account and enter birth data. The free feature (general verdict) is visible to everyone, and the personal overlay is the incentive to sign up.

### 5.2 Privacy

Birth data is stored in Supabase with RLS (users can only read their own data). The tarabala computation happens client-side using the user's stored nakshatra — no new API call needed.

## 6. Edge Cases

1. **Nakshatra transition mid-day:** The primary nakshatra is used for the day-level tara. If the transition happens during the best window, a note should say "Nakshatra changes to {next} at {time} — tara will shift to {next_tara}."

2. **Multiple saved charts (family):** The toggle could show a dropdown of family members (self, spouse, child). Each person has a different birth nakshatra → different tara. This is a v2 enhancement.

3. **Janma Tara (tara 1):** Debated — treated as neutral by some, unfavourable by others. Our existing code (`FAVORABLE_TARAS = {2,4,6,8,9}`) treats Janma as NOT favourable. The `personal.ts` rule gives it +3 pts (reduced positive). For the overlay, show it as "Neutral — birth star day" with a subtle amber indicator, not blue-green or indigo.

4. **Cycle degradation:** The 3-cycle rule (1st=full, 2nd=75%, 3rd=50%) means a Sampat Tara in the 3rd cycle is weaker than in the 1st. The overlay should reflect this: "Sampat Tara (3rd cycle — moderate strength)" vs "Sampat Tara (1st cycle — full strength)."

## 7. Tarabala Discrepancy

Note from codebase exploration: there is a minor discrepancy between `balam.ts` and `scanner.ts`:
- `balam.ts`: Favourable = {2, 4, 6, 8, 9}. Janma(1) NOT favourable.
- `scanner.ts`: Unfavourable = {3, 5, 7}. Janma(1) IS favourable (by exclusion).

**Resolution for the overlay:** Use `balam.ts` (Janma = not favourable). This is the more conservative and widely accepted interpretation. Update `scanner.ts` to match if/when implementing the overlay.

## 8. Implementation Effort Estimate

| Task | Effort | Dependencies |
|------|--------|-------------|
| Add toggle to BestWindowsCard | Small | None |
| Compute personal balam in component | Small | Birth data props |
| Add 4th "Personal" lane to timeline | Small | Lane component exists |
| Personalise best window callout text | Small | balam result |
| "Next favourable tara" forward lookup | Medium | Nakshatra transition times |
| Pass birth data from PanchangClient | Trivial | Already has the state |
| Pass birth data from Dashboard | Trivial | Already has the state |
| Grey-out toggle when no birth data | Small | Auth state |
| Fix scanner.ts Janma discrepancy | Trivial | One line |

**Total: ~half a day of implementation** — all the hard computation is already built.
