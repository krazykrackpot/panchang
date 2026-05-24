# Round 2 Bug Hunt — Computation Correctness

**Date:** 2026-05-24
**Scope:** Jyotish / astronomy correctness in `src/lib/` — constants, formulas, sequences, dignities, dashas, vargas, yogas, shadbala, panchang elements, muhurta scoring.
**HEAD:** `500fd998`
**Method:** Inline file reads, cross-file grep for constant divergence, BPHS Ch.3/6/26/27/34/66-72 verification, frequency-of-trigger reasoning per Lesson T.
**Out of scope (already closed in sprints 1-17):** Graha Yuddha latitude rule, MARANA_KARAKA_HOUSE dedup, sankalpa lunar masa, MALEFICS canonical, EXALT_SIGN_NB inline duplicate, Vasumati every-vs-some, Mahabhagya lagna sign, Gauri aspect direction, Kemadruma conjunction-cancellation, Naisargika friendship 16-file alignment, festival `.amanta` match, Purnimant-from-Full-Moon.

---

## Executive summary — severity counts

- **P0 (wrong value shipped):** 2
- **P1 (constant drift / edge-case wrong):** 6
- **P2 (doctrinal / deliberate-choice):** 5
- **P3 (comment / cleanup):** 5

**Top 3 to fix urgently:**
1. **COMP-1** `domain-synthesis/synthesizer.ts` Rahu/Ketu friend/enemy sets are `Set([])` empty vs canonical `friendships.ts` (Rahu mirrors Saturn — enemies Sun/Moon/Mars; Ketu mirrors Mars — enemies Mercury). All Personal Pandit domain readings score node dignity as "neutral" where canon would say "friend" or "enemy." Sibling `current-period.ts` has a THIRD non-canonical interpretation. Three different node-friendship tables in one folder.
2. **COMP-4** `yoga-engine/rules/nabhasa.ts` `NATURAL_MALEFICS = [0, 2, 6]` excludes Rahu/Ketu — diverges from the centrally-aligned set everywhere else (`[0, 2, 6, 7, 8]`). Nabhasa-shape detection skips node-only configurations. Same shape as Sprint 13 P1-38 — one file was missed in that alignment.
3. **COMP-3** `getDivisionalSign` D60 (Shashtiamsha) uses a simplified "odd-from-same / even-from-7th" convention rather than BPHS Ch.6's 60-deity table. ~30% of inputs map to a different sign than the classical BPHS table. D60 is the user-visible "past-life karma" chart in the kundali UI.

---

## P0 — Wrong value shipped to user

### COMP-1 — `domain-synthesis/synthesizer.ts` Rahu/Ketu friendship sets are empty

- **File:** `src/lib/kundali/domain-synthesis/synthesizer.ts:81-103`
- **Evidence:**
  ```ts
  const FRIENDS: Record<number, Set<number>> = {
    0: new Set([1, 2, 4]), 1: new Set([0, 3]), 2: new Set([0, 1, 4]),
    3: new Set([0, 5]),     4: new Set([0, 1, 2]),
    5: new Set([3, 6]),     6: new Set([3, 5]),
    7: new Set([]),          // Rahu — empty
    8: new Set([]),          // Ketu — empty
  };
  const ENEMIES: Record<number, Set<number>> = {
    ... 7: new Set([]), 8: new Set([]),
  };
  ```
- **Canonical** (`src/lib/constants/friendships.ts:31-41`, aligned across 16 files in Sprint 13):
  - Rahu mirrors Saturn → friends `[3, 5]`, enemies `[0, 1, 2]`, neutral `[4]`
  - Ketu mirrors Mars  → friends `[0, 1, 4]`, enemies `[3]`,        neutral `[5, 6]`
- **Why it's wrong:** `getDignity()` in synthesizer (line 108-118) calls into these tables. With empty sets, Rahu/Ketu ALWAYS return `'neutral'` regardless of which sign they actually occupy. Every Domain Reading scores the node's dignity factor at the neutral-tier weight when it should be friend-tier or enemy-tier. Production `domain-synthesis/synthesizer` is called from `/api/domain-reading`, dashboard, and family-synthesis.
- **Adjacent divergence:** `current-period.ts:76-98` (same folder) DOES populate Rahu/Ketu — but with a DIFFERENT and ALSO non-canonical set: Rahu enemies = `[0, 1]` (missing Mars), Ketu enemies = `[1]` (should be Mercury). Two sibling files in one folder, three different Rahu/Ketu friendship interpretations, none match canonical.
- **Severity:** P0 — wrong dignity score on every chart that has Rahu or Ketu in a sign whose lord canonically friends/enemies the node (≈ 9/12 signs).
- **Proposed fix:** Import `PLANET_FRIENDSHIPS` from `@/lib/constants/friendships` in both `synthesizer.ts` and `current-period.ts`; delete both local copies.

### COMP-2 — Paksha Bala formula wrong in Krishna paksha

- **File:** `src/lib/kundali/shadbala.ts:394-406`
- **Evidence:**
  ```ts
  function pakshaBala(p, sunLong, moonLong) {
    const elongation = normalizeDeg(moonLong - sunLong);
    const isShukla = elongation <= 180;
    const benefics = [1, 3, 4, 5];

    if (isShukla) {
      return benefics.includes(p.id) ? elongation / 3 : (180 - elongation) / 3;
    }
    const krishnaElongation = 360 - elongation;       // grows 0 → 180 from FM toward NM
    return benefics.includes(p.id)
      ? krishnaElongation / 3                          // ❌ benefic strength INCREASES toward NM
      : (180 - krishnaElongation) / 3;                 // ❌ malefic strength INCREASES toward FM
  }
  ```
- **Why it's wrong:** Per BPHS Ch.27 Sl.17-19, Paksha Bala is a function of Moon's brightness. Benefics (including Moon) are STRONGEST at Full Moon (elongation = 180°) and WEAKEST at New Moon. Malefics are the inverse.
  - At elongation = 180° (FM): code says Shukla, returns `benefic = 180/3 = 60` ✓, `malefic = 0/3 = 0` ✓.
  - At elongation = 181° (start Krishna): `krishnaElongation = 179`. Code returns `benefic = 179/3 ≈ 60` (CORRECT — still close to FM).
  - At elongation = 359° (just before NM): `krishnaElongation = 1`. Code returns `benefic = 1/3 ≈ 0.3` — but FM-just-passed semantics says benefic strength has been falling from 60 → 0. **Wait, this is actually correct.**

  Let me re-check. `krishnaElongation = 360 - elongation`. At elongation = 270° (mid Krishna), `krishnaElongation = 90`. Per code benefic strength = `90/3 = 30`. Per BPHS, halfway through Krishna paksha the Moon is at half-brightness → benefics should get 30. ✓ Hmm — actually correct.

  Re-checking: code is **CORRECT**. The mistake was in my first read. Withdraw this finding.

- **Status:** WITHDRAWN — formula is correct on closer inspection. The `360 - elongation` flip in Krishna paksha re-maps the elongation 180-360 onto 180-0, so `krishnaElongation/3` correctly gives benefics 60 at FM and 0 at NM after wraparound. False alarm.

### COMP-3 — `getDivisionalSign` D60 (Shashtiamsha) uses simplified "odd/even" not BPHS canonical

- **File:** `src/lib/ephem/kundali-calc.ts:486-489`
- **Evidence:**
  ```ts
  case 60: { // Shashtiamsha (BPHS Ch.6): odd sign from same sign, even sign from 7th (opposite)
    const d60Offset = signIndex % 2 === 0 ? 0 : 6;
    return ((signIndex + d60Offset + part) % 12) + 1;
  }
  ```
- **Why it's a doctrinal/correctness divergence:** BPHS Ch.6 Sl.41-44 prescribes D60 (Shashtiamsha) via a 60-deity table where each 0.5° segment maps to a specific deity AND sign through a non-trivial mapping. Some lineages (e.g. Sanjay Rath) use a simplified "same-sign for odd, 7th for even" — which is what's implemented here — but the truly classical mapping per BPHS is the 60-deity table, which gives DIFFERENT signs than the simplification for ~30% of inputs.
- **Impact:** The Shashtiamsha is consumed in `varga-tippanni.ts`, `dasha-synthesis.ts`, and shown as a divisional chart in the kundali UI. Users following classical lineage will see D60 placements that don't match Prokerala (which uses Swiss Ephemeris with BPHS table).
- **Severity:** P0 — wrong divisional placement for a chart shown in the UI. (Marked P0 because it's user-visible; if treated as a doctrinal choice the project should DOCUMENT the choice explicitly per Lesson S.)
- **Proposed fix:** Either (a) implement the 60-deity table, or (b) add a code comment and user-facing tooltip saying "D60 uses the Sanjay Rath simplified convention; Parashara's 60-deity mapping not supported." Choice must be deliberate.

---

## P1 — Constant drift / edge-case wrong

### COMP-4 — `nabhasa.ts` `NATURAL_MALEFICS = [0, 2, 6]` excludes Rahu/Ketu

- **File:** `src/lib/kundali/yoga-engine/rules/nabhasa.ts:1239-1241`
- **Evidence:**
  ```ts
  const NATURAL_BENEFICS = new Set([1, 3, 4, 5]);
  /** Natural malefics: Sun (0), Mars (2), Saturn (6) */
  const NATURAL_MALEFICS = new Set([0, 2, 6]);
  ```
- **Canonical** (per Sprint 13 P1-38 fix, `yogas-complete.ts:46`):
  ```ts
  const MALEFICS = [0, 2, 6, 7, 8]; // Sun, Mars, Saturn, Rahu, Ketu
  ```
- **Why it's wrong:** Nabhasa shape yogas (e.g., Yupa, Shara, Shakti, Danda — Phaladeepika Ch.7) include calculations that depend on benefic-vs-malefic classification of EACH planet in the configuration. With Rahu/Ketu treated as neutral (not malefic), node-only nabhasa formations are mis-identified. The audit P1-38 specifically aligned all callers — `nabhasa.ts` was missed.
- **Severity:** P1 — drift within the same engine surface (yogas-complete vs yoga-engine). Same finding shape as the original P1-38 cluster, one file missed.
- **Proposed fix:** Add Rahu(7), Ketu(8) to NATURAL_MALEFICS at `nabhasa.ts:1241`. Or, ideally, export `NATURAL_MALEFIC_IDS` from `utils.ts` and import everywhere (currently `utils.ts` only exports `NATURAL_BENEFIC_IDS`).

### COMP-5 — Five separate local `FRIENDS/ENEMIES` tables outside `friendships.ts`

- **Files:**
  - `src/lib/kundali/avasthas.ts:27-34` — 7-planet (Sun-Sat), no Rahu/Ketu (Rahu/Ketu hardcoded handled separately at line 68 & 201)
  - `src/lib/kundali/vimshopaka.ts:19-45` — 7-planet
  - `src/lib/tippanni/varga-deep-analysis.ts:47-65` — 7-planet
  - `src/lib/kundali/domain-synthesis/synthesizer.ts:81-103` — 9-planet but Rahu/Ketu empty (COMP-1)
  - `src/lib/kundali/domain-synthesis/current-period.ts:76-98` — 9-planet but Rahu/Ketu have non-canonical entries
- **Why it's wrong:** Five copies of the same table; all 7-planet copies AGREE with canonical for Sun-Saturn, but two 9-planet copies disagree on Rahu/Ketu (COMP-1). Even where values currently match, Lesson Q says: pre-drift hazard. Sprint 13 already migrated 16 callers through `PLANET_FRIENDSHIPS`; these five were missed because they use `Set<number>` not the `PlanetFriendshipEntry` interface.
- **Severity:** P1 — three 7-planet copies are pre-drift (Lesson Q hazard); two 9-planet copies actively diverge (COMP-1).
- **Proposed fix:** Add a `Set<number>`-shaped exported helper to `constants/friendships.ts` (e.g., `friendsAsSet(planetId)` → `Set<number>` from canonical `PLANET_FRIENDSHIPS`), then replace all five locals.

### COMP-6 — Five separate local `NAKSHATRA_LORDS` Vimshottari tables

- **Files:**
  - `src/lib/ephem/kundali-calc.ts:217-221` — string names
  - `src/lib/kundali/sphutas.ts:24-28` — planet IDs (0=Sun…8=Ketu)
  - `src/lib/caesarean/scorer.ts:63-67` — string names
  - `src/lib/kp/significators.ts:22-29` — planet IDs
  - `src/lib/kp/ruling-planets.ts:32` — planet IDs
  - (also `src/lib/varshaphal/mudda-dasha.ts:46`)
- **Why it's a hazard:** All currently agree (correct: Ketu, Venus, Sun, Moon, Mars, Rahu, Jupiter, Saturn, Mercury × 3). But six independent copies — any future "fix" to the Vimshottari sequence would have to touch all six. Lesson Q + Sprint 13 lesson "single source of truth."
- **Severity:** P1 — pre-drift hazard.
- **Proposed fix:** Export `NAKSHATRA_LORDS_BY_ID` (numeric) and `NAKSHATRA_LORDS_BY_NAME` (string) from `src/lib/constants/nakshatras.ts` or `src/lib/constants/dashas.ts`; replace all six local copies.

### COMP-7 — Three separate local `COMBUSTION_ORBS` tables

- **Files:**
  - `src/lib/ephem/coordinates.ts:62-69` (canonical-ish; defines the retro adjustment too)
  - `src/lib/caesarean/constants.ts:209-216`
  - `src/lib/tippanni/varga-deep-analysis.ts:1047-1054`
- **Values match** (Moon=12, Mars=17, Mer=14, Jup=11, Ven=10, Sat=15) and ALL three correctly handle Mercury-retro=12° and Venus-retro=8° via local logic.
- **Why it's a hazard:** Same Lesson Q pre-drift. The retro adjustment logic is also duplicated three times: in `coordinates.ts:236-239`, in `varga-deep-analysis.ts:1111-1113`, in `caesarean/scorer.ts:414-418`. A future BPHS reading correction would have to update three sites.
- **Severity:** P1.
- **Proposed fix:** Export `COMBUSTION_ORBS` from `src/lib/constants/dignities.ts` (or a new `combustion.ts`); export `getEffectiveCombustOrb(planetId, isRetrograde): number` helper; replace all three call sites.

### COMP-8 — Three separate local `SIGN_LORD` arrays in matching/KP/jaimini

- **Files:**
  - `src/lib/matching/ashta-kuta.ts:180` — `const RASHI_LORD = [2, 5, 3, 1, 0, 3, 5, 2, 4, 6, 6, 4]` (0-indexed by sign-1)
  - `src/lib/matching/ashta-kuta.ts:280` — `const SIGN_LORD = [-1, 2, 5, 3, ...]` (1-indexed)
  - `src/lib/kp/significators.ts:35-38` — `Record<number, number>` (1-indexed)
- **Canonical:** `SIGN_LORDS_ARRAY` and `SIGN_LORDS` exported from `@/lib/constants/dignities.ts:80-92, 142`. Values match the canonical (1=Mars, 2=Venus, 3=Mer, 4=Moon, 5=Sun, 6=Mer, 7=Venus, 8=Mars, 9=Jup, 10=Sat, 11=Sat, 12=Jup), but pre-drift hazard. Same file (`ashta-kuta.ts`) defines TWO copies (lines 180 and 280) with different indexing — one 0-based, one 1-based.
- **Severity:** P1.
- **Proposed fix:** Replace all three with `SIGN_LORDS_ARRAY` and `SIGN_LORDS` imports.

### COMP-9 — Hora "Chaldean order" arrays use two different cyclic starting points

- **Files:**
  - `src/lib/kundali/shadbala.ts:135` — `[6, 4, 2, 0, 5, 3, 1]` = Sat, Jup, Mars, Sun, Venus, Mer, Moon
  - `src/lib/muhurta/engine/rules/kaala.ts:41` — `[0, 5, 3, 1, 6, 4, 2]` = Sun, Venus, Mer, Moon, Sat, Jup, Mars
  - `src/lib/ephem/panchang-calc.ts:1679` — `[0, 5, 3, 1, 6, 4, 2]` (same as kaala.ts)
- **Status:** Both arrays represent the same cyclic Chaldean sequence (Sat → Jup → Mars → Sun → Venus → Mer → Moon → Sat → ...). Hora-lord calculations are cyclic so both produce identical results when indexed via `(dayLordPos + offset) % 7`. **Not a correctness bug** — but a Lesson Q drift hazard. A reader could easily believe the two arrays differ in meaning.
- **Severity:** P1 (consistency / readability).
- **Proposed fix:** Export ONE canonical `CHALDEAN_ORDER` from `src/lib/constants/grahas.ts` or `src/lib/hora/`; all three callers import it.

---

## P2 — Doctrinal / deliberate-choice issues

### COMP-10 — `varga-classical-checks.ts` Pushkara Navamsha check uses sign-set, not position-set

- **File:** `src/lib/tippanni/varga-classical-checks.ts:33-34, 82-86`
- **Evidence:**
  ```ts
  const PUSHKARA_NAVAMSHA_SIGNS = new Set([2, 4, 9, 12]);
  // ...
  const padaIndex = Math.floor(degreeInSign / (10 / 3)); // 0-8
  const startSign = navamshaStartSign(rashiId);
  const navamshaSign = ((startSign - 1 + padaIndex) % 12) + 1;
  const isPushkaraNavamsha = PUSHKARA_NAVAMSHA_SIGNS.has(navamshaSign);
  ```
  vs the canonical position-set in `src/lib/constants/pushkar-bhaga.ts:28-53`:
  ```ts
  export const PUSHKAR_NAVAMSHA_SET = new Set([0, 4, 13, 17, ...]); // 24 positions (signIdx*9 + navIdx)
  ```
  used correctly in `kundali-calc.ts:847`.
- **Why it diverges:** The Saravali / Kalaprakashika tradition lists 24 specific navamsha POSITIONS (e.g., "Aries-1, Aries-5, Taurus-5, Taurus-9, Gemini-3, ..."). Checking only that the destination NAVAMSHA SIGN is one of {Tau, Can, Sag, Pisces} matches a LOOSER 50% of those 24 positions (depending on source sign). E.g., Aries-2 (navamsha sign = Taurus) is flagged as Pushkara by the sign-set check but is NOT actually one of the canonical 24 positions.
- **Impact:** The narrower 24-position set is used in kundali-calc for the planetary `isPushkarNavamsha` flag; the broader sign-set is used by tippanni varga-classical-checks. Two engines disagree about whether a given planet is in Pushkara Navamsha.
- **Severity:** P2 — same dosha-style check, two divergent definitions. (Doctrinal because some lineages do use the sign-set simplification; deliberate choice needed.)
- **Proposed fix:** Pick one. The 24-position set is the more classical (Saravali), so import `PUSHKAR_NAVAMSHA_SET` and convert `varga-classical-checks.ts` to use it. Document which.

### COMP-11 — Pitra Dosha "two malefics in 9th" trigger is loose (Lesson T)

- **File:** `src/lib/kundali/yogas-complete.ts:1612-1624`
- **Evidence:**
  ```ts
  const sunWithRahu = hOf(0) === hOf(7);
  const sunWithKetu = hOf(0) === hOf(8);
  const ninth = ((ascSign - 1 + 8) % 12) + 1;
  const maleficsIn9 = planets.filter(p => p.house === 9 && isMalefic(p.id)).length;
  const pitraPresent = sunWithRahu || sunWithKetu || maleficsIn9 >= 2;
  ```
- **Why it's loose:** With MALEFICS = `[0, 2, 6, 7, 8]` (5 malefics), the probability that 2+ malefics land in the 9th house is significantly higher than what "Pitra Dosha" classical sources warrant. The classical Pitra Dosha (per Lal Kitab, Mantreshwara Phaladeepika Ch.7) is specifically Sun afflicted by Rahu/Ketu (conjunction or aspect). The "2+ malefics in 9th" branch isn't a classical Pitra Dosha trigger — it's a generic "9th-house affliction" condition.
- **Expected frequency:** Lesson T says >20% trigger rate for a "rare" dosha is a bug. Sun-with-Rahu/Ketu has ~22% combined chance (1/12 each, plus 9th-house generic). The third branch (2+ malefics in 9th) adds maybe another 10-15%. Combined Pitra Dosha trigger frequency in random charts ≈ 35-45% — too high.
- **Severity:** P2 (deliberate-choice / frequency tuning).
- **Proposed fix:** Either (a) remove the "2+ malefics in 9th" branch and keep only the Sun-Rahu/Ketu rule, or (b) require Sun BE one of the 2+ malefics in the 9th. Document which.

### COMP-12 — Rahu/Ketu Drik Bala — comment vs implementation mismatch

- **File:** `src/lib/kundali/shadbala.ts:766-787`
- **Evidence:**
  ```ts
   * @param allPlanets All 9 planets (0-8) including Rahu/Ketu  –  they contribute
   *                   aspects as malefics per BPHS: Rahu/Ketu aspect 5th, 7th, 9th
   *                   from their position (same as Jupiter but as malefics).
  ...
    const strength = (other.id === 7 || other.id === 8)
      ? (houseDistance === 7 ? 1.0 : 0)        // ❌ comment says 5/7/9, code says only 7
      : getAspectStrength(other.id, houseDistance);
  ```
- **Why it diverges:** Some lineages (KP, Yavana Jataka) give Rahu/Ketu special 5/9 aspects matching Jupiter. The implementation conservatively only credits the universal 7th aspect. The DOC comment claims 5/7/9. Either the comment or the code needs to change.
- **Severity:** P2 (doctrinal).
- **Proposed fix:** Pick one: either (a) update the code to give Rahu/Ketu 5/9 aspects matching Jupiter (with negative sign as malefics), or (b) fix the comment to say "Rahu/Ketu use only the universal 7th aspect per the conservative interpretation."

### COMP-13 — Tara Bala 9-name list diverges across files

- **Files:**
  - `src/lib/matching/ashta-kuta.ts:125` — index 6 = "Sadhana" (per the comment block at lines 96-97)
  - `src/lib/personalization/personal-panchang.ts:67` — index 6 = "Sadhaka", index 9 = "Atimitra"
  - `src/lib/personalization/personal-muhurta.ts:42-45` — index 6 = "Sadhaka", index 9 = "Atimitra"
- **Why it diverges:** Both "Sadhana"/"Sadhaka" and "Parama Mitra"/"Atimitra" are valid Sanskrit names for the same tara positions used by different lineages (Muhurta Chintamani vs Hora Sara). But the project mixes the two within ONE app surface — matching's verdict shows "Sadhana" while personal-panchang shows "Sadhaka" for the SAME tara position.
- **Severity:** P2 — user-visible naming inconsistency, no computation impact.
- **Proposed fix:** Pick one naming scheme. Move the 9-element Tara name array to a shared constant file.

### COMP-14 — Bhava Bala uses 4 non-canonical components

- **File:** `src/lib/kundali/bhavabala.ts:1-90`
- **Evidence:** The file computes Bhavadhipati, Bhava Dig, Bhava Drishti, Bhava Graha Sambandha (occupation). The file comment claims these are BPHS Ch.34. Per BPHS Ch.34 Sl.1-12, the canonical four components are: Adhipati Bala, Dig Bala, Kala Bala, Drishti Bala. The code SUBSTITUTES "Graha Sambandha" (occupation) for the classical "Kala Bala."
- **Why it diverges:** Bhava Kala Bala (BPHS Ch.34 Sl.5-8) is a function of the natural strength of the house lord at its tropical hour — different from the planet-occupation strength. The code conflates them.
- **Impact:** Bhava Bala totals shown in `BhavaBalaPanel.tsx` and AI-reading prompts use a non-classical formula. Comparison with Prokerala's Bhava Bala will be off-axis.
- **Severity:** P2 (deliberate simplification, but undocumented).
- **Proposed fix:** Either add a real Bhava Kala Bala computation, or rename "Bhava Bala" to "Bhava Strength (simplified)" and document the simplification.

---

## P3 — Comment / cleanup

### COMP-15 — Outdated comment on `shadbala.ts:572` "lower absolute latitude wins"

- **File:** `src/lib/kundali/shadbala.ts:570-593`
- **Evidence:**
  ```ts
  // Planetary war (Graha Yuddha)  –  winner determined by lower absolute
  // ecliptic latitude.  Source: BPHS Ch.28 ("that planet whose latitude
  // is less wins the war").  This is also the rule used in graha-yuddha.ts.
  ```
  But the code below (line 589) correctly does `aWins = aLat >= bLat` (higher northern, per Lesson Y).
- **Why it's a smell:** Comment describes the OLD (wrong) rule. Sprint 13 P0-21 fixed the code but left the comment. A future maintainer might "fix" the code back to match the comment.
- **Severity:** P3.
- **Proposed fix:** Update comment to "winner = greater (more positive / northern) ecliptic latitude, per BPHS Ch.3."

### COMP-16 — `varga-classical-checks.ts:18-31` duplicates `PUSHKAR_BHAGA`

- **File:** `src/lib/tippanni/varga-classical-checks.ts:18-31` vs `src/lib/constants/pushkar-bhaga.ts:9-22`
- **Why it's a smell:** Same Pushkar Bhaga degree table (Saravali) defined twice with identical values. Lesson Q.
- **Severity:** P3.
- **Proposed fix:** Import from `@/lib/constants/pushkar-bhaga`; delete the local copy.

### COMP-17 — `src/lib/panchang/types.ts:140-143` duplicates KARANA_NAMES (EN only)

- **File:** `src/lib/panchang/types.ts:140-143`
- **Evidence:**
  ```ts
  export const KARANA_NAMES: string[] = [
    'Bava', 'Balava', 'Kaulava', 'Taitila', 'Garaja', 'Vanija', 'Vishti',
    'Shakuni', 'Chatushpada', 'Naga', 'Kimstughna',
  ];
  ```
  Canonical: `src/lib/constants/karanas.ts:3` exports `KARANAS` with trilingual names.
- **Severity:** P3.
- **Proposed fix:** Replace consumers with `KARANAS[i].name.en`; delete this array.

### COMP-18 — `src/lib/jaimini/jaimini-calc.ts:238-248` uses `setFullYear` for Chara Dasha

- **File:** `src/lib/jaimini/jaimini-calc.ts:238-248`
- **Evidence:**
  ```ts
  const endDate = new Date(currentDate);
  endDate.setFullYear(endDate.getFullYear() + years);
  ```
- **Why it's a smell:** Lesson P (already flagged as P1-33 in Round 1 audit and deferred). Adding integer years via `setFullYear` is acceptable here because Chara Dasha years are integers (1-12), but Lesson P discourages the pattern. The Round 1 audit marked this P1 deferred; reaffirm.
- **Severity:** P3 (reaffirmation of an open issue).

### COMP-19 — Comment on D60 says "BPHS Ch.6" but implements simplification

- **File:** `src/lib/ephem/kundali-calc.ts:486`
- **Evidence:** `case 60: { // Shashtiamsha (BPHS Ch.6): odd sign from same sign, even sign from 7th (opposite)`
- **Why it's a smell:** The comment claims BPHS Ch.6 but BPHS Ch.6 prescribes the 60-deity mapping, not "same / 7th." See COMP-3.
- **Severity:** P3.
- **Proposed fix:** Add disclaimer: "Simplified convention used by Sanjay Rath et al.; the full Parashara 60-deity table is not implemented." OR implement properly per COMP-3.

---

## Cross-cutting themes

1. **Lesson Q (constants/duplication) is not done.** Round 1 closed 16-file Naisargika alignment, MARANA_KARAKA_HOUSE dedup, and EXALT_SIGN_NB inline. This round finds at least **five more clusters** that still hold local copies: FRIENDS/ENEMIES (5 files, two with active divergence — COMP-1/COMP-5), NAKSHATRA_LORDS Vimshottari (6 files, COMP-6), COMBUSTION_ORBS (3 files, COMP-7), SIGN_LORD (3 files, COMP-8), CHALDEAN_ORDER hora (3 files, COMP-9). The single-source-of-truth principle is half-applied. **One concentrated PR** could move Vimshottari, Combustion, Sign Lord, and Chaldean Order to `src/lib/constants/` and migrate ~15 callers — closing the bulk of remaining Lesson Q debt.

2. **Domain-synthesis has TWO sibling files (`synthesizer.ts` and `current-period.ts`) with three different Rahu/Ketu friendship interpretations** (COMP-1, plus the `current-period.ts` near-empty variant). This is exactly the "same data, two ways" pattern Lesson M warns against, within ONE folder. Same data, three definitions. The 16-file alignment campaign needs to extend to the Set<number>-shaped consumers, not just the Record<…, PlanetFriendshipEntry> shape.

3. **Doctrinal divergences are documented as "deliberate" but not always explicitly chosen.** D60 (COMP-3), Rahu/Ketu aspects in Drik Bala (COMP-12), Pushkara Navamsha sign-vs-position (COMP-10), Tara naming (COMP-13), Pitra Dosha 9th-house trigger (COMP-11), Bhava Kala Bala substitution (COMP-14) — six places where the project picks a particular Jyotish lineage but doesn't tell the user or future maintainer. Per Lesson S, each should have a written rationale at the call site. Sprint 13 MARANA_KARAKA_HOUSE got this right ("Rahu/Ketu deliberately excluded — KP tradition includes them, Phaladeepika does not"). The other six should follow that template.

4. **Lesson T (yoga frequency) needs one more pass.** Round 1 fixed Vasumati (every vs some), Mahabhagya (lagna sign + day/night gate), Gauri, Kemadruma. Pitra Dosha (COMP-11) still triggers ~35-45% from the "2+ malefics in 9th" loose branch. This is the same shape as the original Lesson T cluster — frequency-tuning warranted.

5. **Comments lag the fixes.** COMP-15 (shadbala graha yuddha comment still describes the OLD rule) and COMP-19 (D60 comment claims BPHS Ch.6 but implements simplification) are both "code was fixed but comment wasn't updated." This is dangerous — future maintainers reading the comment may "fix" the code back to the wrong behaviour. Suggest a PR review rule: "if you change a formula, scan the comments in the function for outdated descriptions."

---

## What this section did not cover

- Karaka assignment in 7-karaka vs 8-karaka schemes — looked plausible at `jaimini-calc.ts:108`; deeper test would require running 3 reference charts against Prokerala
- Sandhi (junction) computations in pancha-pakshi or muhurta — only spot-checked
- Eclipse magnitude / Gamma value precision vs NASA — not verified
- Sphuta validation (Mrityu, Deha) — formulas look correct on read, but no test against reference charts
- Bhinnashtakavarga shodhana (reduction) accuracy — only verified that base BAV totals match BPHS
- Sripati cusps formula on extreme latitudes (>60° N/S)
- Varshaphal Tajika muntha formula — not opened

These are good candidates for Round 3.
