# G4: Yoga Interaction Engine — Design Spec

> **Status:** FINALISED
> **Date:** 2026-05-15
> **Depends on:** G1/G2/G3/G5 (all shipped)

---

## 1. Problem

The yoga engine evaluates 210+ yogas independently. Each yoga is detected, strength-assessed, and reported in isolation. But classical Jyotish texts describe three categories of yoga-to-yoga interactions that the current engine misses:

1. **Yoga clusters** — 2+ raja yogas amplify each other non-linearly (BPHS Ch.41)
2. **Same-planet conflicts** — a planet forming both auspicious and inauspicious yogas produces a mixed result
3. **Cross-yoga cancellation** — opposing yogas (dhana + daridra) on the same house axis neutralise each other

Without these, domain scoring treats yoga contributions as purely additive, and users see individual yogas without understanding how they interact.

---

## 2. Architecture

A post-processing pass that runs after individual evaluation, before consumers read the results.

```
evaluateWithRules(rules, ctx)
    → EvaluatedYoga[]  (individual, no interactions)
    
analyseInteractions(yogas, ctx)
    → mutates yogas in-place: attaches interactions[], adjusts strength
    
Consumers (UI, tippanni, domainScore) read enriched yogas
```

### Why mutate in-place?

The `EvaluatedYoga[]` array is created fresh per chart and consumed immediately. No shared references, no caching. In-place mutation avoids allocating a parallel array and keeps the consumer interface unchanged — `evaluatedYogas` on `KundaliData` already has the type, consumers already read `.strength` and `.interactions`.

### New file

`src/lib/kundali/yoga-engine/interactions.ts` — single file, ~200-250 lines. No new dependencies.

---

## 3. Data Model

```typescript
// Added to EvaluatedYoga in types.ts
interactions?: YogaInteraction[];

interface YogaInteraction {
  type: 'cluster_boost' | 'planet_conflict' | 'cross_cancellation';
  /** IDs of the other yogas involved in this interaction */
  relatedYogaIds: string[];
  /** Net effect on this yoga */
  effect: 'amplified' | 'conflicted' | 'neutralised';
  /** Bilingual description for UI/tippanni */
  description: { en: string; hi: string };
  /** Strength modifier: +1 = boost one tier, -1 = weaken one tier, 0 = informational only */
  strengthDelta: -1 | 0 | 1;
}
```

Backward-compatible: `interactions` is optional. Consumers that don't check it see no change.

---

## 4. Detection Rules

### 4.1 Cluster Detection (B)

**Trigger:** 2+ present yogas in the same group.

**Groups that cluster:** `raja`, `dhana`, `mahapurusha`. Other groups (chandra, surya, nabhasa, dosha) don't classically amplify each other.

**Effect:**
- 2 in group → boost the weakest yoga by 1 tier (Weak→Moderate or Moderate→Strong). If both are at the same tier, boost the first one found (arbitrary but deterministic). The strongest stays unchanged.
- 3+ in group → boost ALL non-Strong yogas by 1 tier. This is the "rare concentration" case.

**Strength cap:** Strong is the maximum — no tier above Strong exists.

**Description template:**
- EN: `"Part of a {count}-yoga {group} cluster — amplified by mutual reinforcement"`
- HI: `"{count} {group} योगों का समूह — पारस्परिक प्रबलन से प्रवर्धित"`

**Classical basis:** BPHS Ch.41 states that multiple raja yogas produce results "many times greater" than individual ones. Phaladeepika Ch.6 similarly notes dhana yoga clusters.

### 4.2 Same-Planet Conflicts (A)

**Trigger:** A planet (0-6) appears in `involvedPlanets` of both a present auspicious yoga AND a present inauspicious yoga.

**Effect:** Informational only (`strengthDelta: 0`). No automatic strength change — the conflict is noted for the user/AI to interpret. The reason: the relative strength of the two yogas determines which dominates, and that's chart-specific reasoning beyond what a rule can capture.

**Description template:**
- EN: `"{planet} participates in both {auspicious_yoga} and {inauspicious_yoga} — effects are moderated"`
- HI: `"{planet_hi} {auspicious_yoga} और {inauspicious_yoga} दोनों में सहभागी — प्रभाव संयमित"`

**Exclusions:**
- Rahu/Ketu (7, 8) are excluded — they appear in many yogas by nature of their orbital mechanics, and their "conflict" is already handled by the cancellation system.
- If the auspicious and inauspicious yogas share the same planet but the inauspicious one is cancelled (present=false), no conflict is noted.

### 4.3 Cross-Yoga Cancellation (C)

**Trigger:** Specific opposing yoga pairs where classical texts describe mutual neutralisation.

**Defined pairs:**

| Auspicious | Inauspicious | Condition | Effect |
|---|---|---|---|
| Any `dhana` group yoga | Any `daridra` group yoga | Both present + share at least one `involvedPlanet` OR `ctx.houseLord(2)` or `ctx.houseLord(11)` appears in both yogas' `involvedPlanets` | Weaken both by 1 tier |
| Any `raja` group yoga | Any `arishta` group yoga | Both present + share at least one `involvedPlanet` | Weaken the raja yoga by 1 tier (arishta unaffected — it's already inauspicious) |

**Strength floor:** Weak is the minimum — no tier below Weak.

**Description template:**
- EN: `"Neutralised by opposing {inauspicious_yoga} — {planet} creates tension between prosperity and obstruction"`
- HI: `"विपरीत {inauspicious_yoga} द्वारा निष्प्रभावित — {planet_hi} समृद्धि और बाधा के बीच तनाव उत्पन्न करता है"`

---

## 5. Execution Order

Within `analyseInteractions()`:

1. **Clusters first** — boost before conflicts, so conflict detection sees the boosted strengths
2. **Same-planet conflicts second** — informational, no strength change
3. **Cross-cancellation last** — weakens after all boosts are applied, so the net effect is correct

This order prevents: cluster boosts a yoga to Strong, then cross-cancellation brings it back to Moderate. If reversed, the boost would override the cancellation — wrong.

---

## 6. Integration Points

### 6.1 engine.ts

After `evaluateWithRules()` returns, call `analyseInteractions()`:

```typescript
// In kundali-calc.ts (the caller), NOT inside evaluateWithRules
// evaluateWithRules is a pure mapper; interaction analysis is a post-pass.
const yogas = evaluateWithRules(ALL_YOGA_RULES, ctx);
analyseInteractions(yogas, ctx); // mutates in-place
kundali.evaluatedYogas = yogas;
```

### 6.2 domainScore()

Already reads `y.strength` which is modified by interactions. No change needed — the boosted/weakened strengths flow through automatically.

### 6.3 Tippanni

Already reads `evaluatedYogas` (G5). Interactions attached to each yoga will be available. The tippanni can optionally render interaction descriptions — but this is out of scope for this commit.

### 6.4 YogasTab UI

Can render interaction badges (e.g., "Part of 3-yoga Raja cluster") — but UI changes are out of scope. The data is available; rendering is a follow-up.

---

## 7. Testing

### Fixtures needed

The existing test chart (Arjun, Aquarius lagna) needs to be checked for whether it naturally produces clusters or conflicts. If not, a second fixture chart may be needed that has:
- 2+ raja yogas (for cluster testing)
- A planet in both an auspicious and inauspicious yoga (for conflict testing)
- A dhana + daridra pair (for cross-cancellation testing)

### Test cases

| Test | Input | Expected |
|---|---|---|
| No interactions | Chart with 1 raja yoga, no conflicts | `interactions` is undefined/empty on all yogas |
| 2-yoga cluster | Chart with 2 present raja yogas | Weakest gets `cluster_boost` interaction, strength +1 |
| 3+ yoga cluster | Chart with 3 present raja yogas | All non-Strong get `cluster_boost`, strength +1 |
| Same-planet conflict | Jupiter in Gajakesari + dosha | Both get `planet_conflict` interaction, strength unchanged |
| Cross-cancellation | Dhana + Daridra sharing a planet | Both get `cross_cancellation`, strength -1 each |
| Cluster + cancellation | 2 raja yogas, one also cross-cancelled | Cluster boosts first, then cancellation weakens — net effect depends on order |
| No false positives | Yogas sharing a planet but both auspicious | No conflict reported (conflicts require auspicious + inauspicious) |
| Rahu/Ketu exclusion | Kaal Sarpa (Rahu+Ketu) + auspicious yoga with Rahu | No conflict — Rahu excluded from conflict detection |

---

## 8. Scope Boundary

**In scope:**
- `interactions.ts` — detection + strength mutation
- `types.ts` — `YogaInteraction` type + `interactions?` field on `EvaluatedYoga`
- `engine.ts` — call `analyseInteractions()` after evaluation
- Tests for all three interaction types

**Out of scope:**
- UI rendering of interaction badges (follow-up)
- Tippanni narrative for interactions (follow-up)
- AI Pandit handling of interactions (already flows via evaluatedYogas)
- More than the defined cross-cancellation pairs (expandable later)

---

## 9. Self-Review

- **Placeholders:** None. All interaction types, rules, and templates are fully specified.
- **Internal consistency:** Execution order (cluster → conflict → cancellation) matches the described behaviour. Strength deltas are consistent (+1 for boost, -1 for cancellation, 0 for conflict).
- **Scope:** Focused on detection + annotation. UI and narrative are explicitly deferred.
- **Ambiguity:** "Share at least one involvedPlanet" for cross-cancellation is unambiguous. "Same house axis" for dhana-daridra means both involve the 2nd or 11th lord — this is specified.
- **Edge case:** A yoga that gets both a cluster boost (+1) and a cross-cancellation (-1) nets to 0 change — this is correct and doesn't need special handling.
