# Round 3 Bug Hunt — Computation Correctness

**Date:** 2026-05-24
**Scope:** Jyotish / astronomy correctness in `src/lib/` — constants, formulas, sequences, dignities, dashas, vargas, yogas, shadbala, panchang elements, muhurta scoring.
**HEAD:** `b4cd2720` (post-sprint-25)
**Method:** Re-verification of Round 2 deferred items + targeted hunt for new issues in varga formulas, Drik Bala aspect math, Jaimini Karaka, Yogini Dasha, sphuta canonical forms, and ancillary dosha detection (Manglik).
**Out of scope (closed by Sprint 22 — confirmed):** COMP-1 (synthesizer Rahu/Ketu friendships), COMP-3 D60 deliberate-choice comment, COMP-4 nabhasa NATURAL_MALEFICS reverted to 3-element per Phaladeepika, COMP-5 (three 7-planet copies → friendsAsSet/enemiesAsSet), Sprint 13 16-file Naisargika alignment, Sprint 14 UTC anchors, Sprint 15 friendship canonical + yoga frequency cluster.

---

## Executive summary — severity counts

- **P0 (wrong value shipped):** 1
- **P1 (constant drift / edge-case wrong):** 4
- **P2 (doctrinal / deliberate-choice):** 7
- **P3 (comment / cleanup):** 3

**Top 3 to fix urgently:**
1. **R3-COMP-1** `shadbala.ts:785` and `tajika-aspects.ts:471` use `((p.house - other.house + 12) % 12) || 12` for house-distance. This formula gives an EXCLUSIVE gap (0-11) coerced to 12 when zero, not the inclusive 1-12 Vedic count the call-site assumes. Consequence: Drik Bala's `houseDistance === 7` actually fires for the 8th house, Mars's special 4th/8th aspects fire on the 5th/9th, Jupiter's 5/9 fire on the 6th/10th. Every Shadbala Drik Bala value in the app is off by one house. The yoga engine and Bhava Bala use the correct `+1` form (`((to - from + 12) % 12) + 1`), so the two engines disagree on which aspects fire.
2. **R3-COMP-2** `getDivisionalSign` D27 (Nakshatramsha) uses `[Aries, Cancer, Libra, Cap]` by element. The standard BPHS Ch.6 D27 uses `[Aries, Cap, Libra, Cancer]` (same element-mapping as D9), OR the 3-fold movable/fixed/dual scheme `[Aries, Cancer, Libra]`. The current mapping (Taurus→Cancer, Cancer→Cap) matches neither convention. D27 is shown as a user-visible varga chart for "strength & stamina."
3. **R3-COMP-3** `getDivisionalSign` D30 (Trimshamsha) — for EVEN signs the code uses the same masculine sign-list `[Libra, Gemini, Sag, Aqua, Aries]` and the same `5°,5°,8°,7°,5°` boundaries as odd signs. Per BPHS Ch.6 Sl.18-19, even-sign Trimshamsha uses **feminine** signs `[Taurus, Capricorn, Pisces, Virgo, Scorpio]` AND **different** boundaries `5°,7°,8°,5°,5°`. ~50% of inputs (even signs) get the wrong D30 placement vs Prokerala/JHora.

---

## P0 — Wrong value shipped to user

### R3-COMP-1 — Drik Bala house-distance off by one (Shadbala AND Tajika)

- **Files:**
  - `src/lib/kundali/shadbala.ts:785` — `const houseDistance = ((p.house - other.house + 12) % 12) || 12;`
  - `src/lib/varshaphal/tajika-aspects.ts:471` — `const houseDist = ((p2.house - p1.house + 12) % 12) || 12;`
- **JSDoc claim at `shadbala.ts:784`:** "House distance from other planet to target planet p (1-based, 1-12)."
- **What the formula actually returns:**
  - Same house: gap=0 → coerced via `|| 12` to 12 (intended "no aspect" but inconsistent with claimed 1-based count where same-house should be 1)
  - 1 sign apart (other in h1, p in h2): gap=1 → 1
  - 7th-from-aspecting (other in h1, p in h7): gap=6 → **6** (should be 7 in inclusive Vedic counting)
  - 8th-from-aspecting (other in h1, p in h8): gap=7 → **7** (caught by the table as "full 7th aspect")
  - 12th-from-aspecting (other in h1, p in h12): gap=11 → 11 (should be 12)
- **Why it's wrong:** The aspect table at `getAspectStrength` (lines 751-763) tests `houseDistance === 7`, `=== 4 || 8` (Mars), `=== 5 || 9` (Jupiter), `=== 3 || 10` (Saturn), `=== 3 || 10` (partial 0.25), `=== 4 || 8` (partial 0.75), `=== 5 || 9` (partial 0.5). All these reference numbers expect inclusive 1-12 (e.g., "Mars aspects the 4th, 7th, 8th from itself"). The off-by-one shifts every aspect rule by one house:
  - Universal 7th aspect → fires for planet at 8th-from-aspecting (gap=7)
  - Mars 4th/8th → fires for 5th/9th-from-aspecting
  - Jupiter 5th/9th → fires for 6th/10th-from-aspecting (which is the universal 7th's neighbour, not a Jupiter special at all)
  - Saturn 3rd/10th → fires for 4th/11th-from-aspecting
- **Yoga engine sanity check:** `yogas-complete.ts:60` defines `houseOffset(fromHouse, toHouse) = ((toHouse - fromHouse + 12) % 12) + 1` — this is the correct inclusive 1-12 Vedic count. `bhavabala.ts:108-127` uses `((planetHouse - 1 + offset) % 12) + 1` with offset 2/3/4/6/7/8/9 for the BPHS aspects — also correct. So the project has the right formula in two engines and the wrong formula in two engines. The yoga engine fires Jupiter's 5/9 aspects correctly; the Shadbala does not.
- **Blast radius:**
  - **Drik Bala** (one of the 6 Shadbala components) — wrong on every chart. Final `totalPinda` shifts by Drik's contribution (which can be ±60 virupas, ±1 rupa).
  - **Strength ranks** (`shadbala.ts:867`) shift when Drik moves a planet across a strength boundary.
  - **Ishta/Kashta Phala**, **strengthRatio**, **minRequired comparison** — all flow downstream of `totalPinda`.
  - **Tajika Induvara Yoga** (`tajika-aspects.ts:471`) — checks `[1,4,5,7,9,10]` as kendra/trikona houseDist. With the off-by-one, these match planets that are 0, 3, 4, 6, 8, 9 houses APART (i.e., 1st-conjunct, 4th, 5th, 7th, 9th, 10th in inclusive count). So actually for Tajika the `|| 12` flip plus the table happen to alias correctly for `[4, 7, 10]` (offsets that round-trip via `+ 0` exclusive = 1-based ASPECT positions if reading off-by-zero), but for `[1, 5, 9]` it's broken. Mixed.
- **Severity:** P0 — every Drik Bala value in the app is wrong. Same shape as Sprint 13 P0 cluster (constants off-by-one).
- **Proposed fix:**
  ```ts
  // shadbala.ts:785
  const houseDistance = ((p.house - other.house + 12) % 12) + 1; // inclusive 1-12
  // Same fix in tajika-aspects.ts:471
  ```
  Then the table entries at `getAspectStrength` (7th = 7, Mars 4&8, Jupiter 5&9, Saturn 3&10) ALL correctly map to the BPHS aspect houses.
  Add a Vitest invariant: "Jupiter in house 1 → getAspectStrength returns 1.0 for houseDistance=5, 7, 9; 0 for 6 and 8."

---

## P1 — Constant drift / edge-case wrong

### R3-COMP-2 — `getDivisionalSign` D27 (Nakshatramsha) — non-classical 4-fold starting signs

- **File:** `src/lib/ephem/kundali-calc.ts:465-468`
- **Evidence:**
  ```ts
  case 27: { // Nakshatramsha: fire→Aries, earth→Cancer, air→Libra, water→Capricorn
    const elem27 = signIndex % 4;
    const start27 = [0, 3, 6, 9][elem27];
    return ((start27 + part) % 12) + 1;
  }
  ```
- **Why it's wrong:** Two competing canonical readings:
  - **BPHS Ch.6 Sl.55-57** (3-fold movable/fixed/dual): movable→Aries(0), fixed→Cancer(3), dual→Libra(6).
  - **Modern element-based 4-fold (PVR Narasimha Rao, JHora)**: fire→Aries(0), earth→Capricorn(9), air→Libra(6), water→Cancer(3). This matches D9's element mapping.
  - **What the code does:** fire→Aries(0), earth→Cancer(3), air→Libra(6), water→Capricorn(9). Earth and water are SWAPPED relative to the modern 4-fold convention, and the scheme is 4-fold (so doesn't match BPHS 3-fold either).
- **Impact:** Taurus & Virgo & Capricorn planets get sent to Cancer-start instead of Capricorn-start; Cancer & Scorpio & Pisces planets get sent to Capricorn-start instead of Cancer-start. D27 placements (rendered in the kundali UI as "Strengths/vitality" chart) diverge from Prokerala/JHora for these 6 signs (50% of placements).
- **Severity:** P1 — same shape as COMP-3 (D60) but more clearly wrong; no published lineage uses this particular element mapping.
- **Proposed fix:** Either align to JHora's `[0, 9, 6, 3]` (Aries, Cap, Libra, Cancer — same as D9) OR collapse to BPHS Ch.6's 3-fold `[0, 3, 6][signIndex % 3]`. Add `Lesson S` deliberate-choice comment either way.

### R3-COMP-3 — D30 (Trimshamsha) even-sign uses masculine signs + odd-sign boundaries

- **File:** `src/lib/ephem/kundali-calc.ts:470-478`
- **Evidence:**
  ```ts
  case 30: { // Trimshamsha: unequal parts (5°,5°,8°,7°,5°)
    const bounds = [5, 10, 18, 25, 30];
    let p30 = 0;
    for (let b = 0; b < bounds.length; b++) { if (degInSign < bounds[b]) { p30 = b; break; } }
    const oddSigns = [1, 11, 9, 3, 7]; // Aries, Aqua, Sag, Gem, Libra
    const evenSigns = [7, 3, 9, 11, 1]; // Libra, Gem, Sag, Aqua, Aries
    return signIndex % 2 === 0 ? oddSigns[p30] : evenSigns[p30];
  }
  ```
- **Canonical BPHS Ch.6 Sl.18-19:**
  - Odd-sign boundaries: 5°, 5°, 8°, 7°, 5° → cumulative [5, 10, 18, 25, 30]; planets Mars, Saturn, Jupiter, Mercury, Venus → signs **Aries(1), Aquarius(11), Sagittarius(9), Gemini(3), Libra(7)** ✓ matches code.
  - Even-sign boundaries: **5°, 7°, 8°, 5°, 5°** → cumulative **[5, 12, 20, 25, 30]**; order **reversed** (Venus, Mercury, Jupiter, Saturn, Mars) → using **feminine** signs ruled by these: **Taurus(2), Capricorn(10), Pisces(12), Virgo(6), Scorpio(8)**.
- **What the code does for even signs:**
  - Uses SAME boundaries as odd `[5, 10, 18, 25, 30]` (should be `[5, 12, 20, 25, 30]`)
  - Uses MASCULINE signs `[7, 3, 9, 11, 1]` = Libra, Gemini, Sag, Aqua, Aries (should be feminine `[2, 10, 12, 6, 8]`)
- **Impact:** 50% of inputs (planets in even rashis: Taurus, Cancer, Virgo, Scorpio, Capricorn, Pisces) get the wrong D30 sign. D30 is the "Misfortunes, evils & suffering" chart — incorrect placements directly affect that user-visible chart and any tippanni narration tied to it.
- **Severity:** P1 — clearly divergent from BPHS Ch.6 Sl.19 and from JHora's even-sign mapping. Some lineages (Sanjay Rath) do use masculine signs for both odd and even, so a "deliberate lineage choice" disclaimer is defensible — but the BOUNDARIES (5/7/8/5/5 vs 5/5/8/7/5) need to be fixed regardless of which sign-set you adopt.
- **Proposed fix:** Pick one lineage explicitly. Either implement the BPHS Ch.6.19 even-sign mapping (feminine signs + 5,7,8,5,5 boundaries) OR document the Sanjay Rath choice and at minimum fix the even-sign boundaries to 5,7,8,5,5 (which most lineages agree on regardless of which sign set).

### R3-COMP-4 — `getDivisionalSign` D8 (Ashtamsha) formula non-standard

- **File:** `src/lib/ephem/kundali-calc.ts:444-445`
- **Evidence:**
  ```ts
  case 8: // Ashtamsha: movable→same, fixed→9th, dual→5th
    return (((signIndex % 3 === 0 ? signIndex : signIndex % 3 === 1 ? signIndex + 8 : signIndex + 4) + part) % 12) + 1;
  ```
- **Why it's wrong:** D8 is not part of the 16-Shodashavarga but IS computed and displayed in the UI (`kundali-calc.ts:886` shows `D8 Ashtamsha`). There are several conventions for D8; none of them match the code's mapping. Common conventions:
  - Sanjay Rath / Achyut Pisharoti: movable→Aries(0), fixed→Leo(4), dual→Sagittarius(8) — similar to D16.
  - Some texts: each sign divided into 8 equal parts starting from the sign itself (cyclic from same sign).
  - The code's "movable→same, fixed→9th, dual→5th" is undocumented in any source I can find.
- **Severity:** P1 — likely an authoring error (the dual→5th, fixed→9th pattern resembles D4's "fixed→4th, dual→7th" inversed but with wrong magnitudes).
- **Proposed fix:** Confirm which D8 convention to use (probably Sanjay Rath's element-based, matching D16). Add `Lesson S` deliberate-choice comment.

### R3-COMP-5 — Manglik dosha — FOUR divergent definitions in one codebase

- **Files:**
  - `src/lib/kundali/mangal-dosha-engine.ts:29` — `MANGAL_HOUSES = [1, 2, 4, 7, 8, 12]` AND checks from Lagna, Moon, Venus (3 reference points). Canonical.
  - `src/lib/kundali/tippanni-engine.ts:799` — `manglikHouses = [1, 2, 4, 7, 8, 12]` BUT checks only from Lagna.
  - `src/lib/kundali/yogas-complete.ts:117-130` — `mangalHouses = [1, 2, 4, 7, 8, 12]` BUT checks only from Lagna.
  - `src/lib/kundali/eli5-engine.ts:319-321` — `[1, 4, 7, 8, 12]` (FIVE houses, excluding 2nd) AND checks only from Lagna.
- **Why it's wrong:**
  - eli5-engine drops the 2nd house (some Lal Kitab lineages do this; most modern Jyotish includes 2nd because Phaladeepika does).
  - tippanni-engine and yogas-complete skip the Moon and Venus reference points — Phaladeepika Ch.5 explicitly checks all three. Mars in 7th from Lagna but NOT from Moon/Venus is "partial Manglik;" the code labels it "full Manglik."
- **Severity:** P1 — same dosha gets different verdicts across 4 surfaces. User on dashboard might see "Manglik (mild)" from one engine and "Manglik (severe)" from another for the same chart. Same Lesson Q/M shape as the 16-file Naisargika cluster fixed in Sprint 13.
- **Proposed fix:** Migrate tippanni-engine, yogas-complete, eli5-engine to call `analyzeMangalDosha()` from `mangal-dosha-engine.ts`. Delete local Manglik tables and three-reference-point logic copies.

---

## P2 — Doctrinal / deliberate-choice issues

### R3-COMP-6 — Round 2 COMP-10 still open — Pushkar Navamsha sign-set vs position-set

- **Files:** `src/lib/tippanni/varga-classical-checks.ts:33` (sign-set `[2,4,9,12]`) vs `src/lib/constants/pushkar-bhaga.ts:28-53` (24-position set used by `kundali-calc.ts:847`).
- **Status:** Confirmed STILL OPEN at HEAD `b4cd2720`. Sprint 22 did not touch this. The same dosha-style check has two divergent definitions. The 24-position set is more classical (Saravali Ch.5); the 4-sign set is a loose simplification.
- **Severity:** P2 (doctrinal — Lesson S).
- **Proposed fix:** Pick one. Recommend importing `PUSHKAR_NAVAMSHA_SET` in `varga-classical-checks.ts` and removing the looser sign-set check. If keeping the sign-set as a "Drik Panchang folk" mode, name it explicitly.

### R3-COMP-7 — Round 2 COMP-11 still open — Pitra Dosha "2 malefics in 9th" branch

- **File:** `src/lib/kundali/yogas-complete.ts:1612-1624`
- **Status:** Confirmed STILL OPEN. The triple-branch trigger `sunWithRahu || sunWithKetu || maleficsIn9 >= 2` still fires in ≈35-45% of random charts per Lesson T frequency reasoning. Classical Pitra Dosha (Lal Kitab + Phaladeepika Ch.7) is specifically Sun afflicted by Rahu/Ketu.
- **Severity:** P2.
- **Proposed fix:** Either (a) remove the "2+ malefics in 9th" branch, OR (b) require Sun BE one of the 2+ malefics in the 9th. Document the choice.

### R3-COMP-8 — Round 2 COMP-12 still open — Rahu/Ketu Drik Bala comment vs implementation

- **File:** `src/lib/kundali/shadbala.ts:765-792`
- **Status:** Confirmed STILL OPEN. Comment lines 771-773 still claim "Rahu/Ketu aspect 5th, 7th, 9th from their position (same as Jupiter but as malefics)." Code at line 790-791 only applies the universal 7th aspect: `(houseDistance === 7 ? 1.0 : 0)`. Per the off-by-one in R3-COMP-1, this is actually testing for the 8th-from-aspecting, but the larger issue is that the comment promises 5/7/9 while the code does only one of those.
- **Severity:** P2 (doctrinal).
- **Proposed fix:** Either implement Rahu/Ketu's 5/9 aspects (with the off-by-one fix from R3-COMP-1 applied first), or correct the comment to "Rahu/Ketu use only the universal 7th aspect per the conservative interpretation."

### R3-COMP-9 — Round 2 COMP-13 still open — Tara Bala 9-name list divergence

- **Files:**
  - `src/lib/matching/ashta-kuta.ts:96, 125` — uses "Sadhana" and "Parama Mitra" naming.
  - `src/lib/personalization/personal-panchang.ts:67, 96` — uses "Sadhaka" (#6) and "Atimitra" (#9).
  - `src/lib/personalization/personal-muhurta.ts:44` — uses "Sadhaka", "Atimitra".
- **Status:** Confirmed STILL OPEN. Both naming conventions are valid (Muhurta Chintamani vs Hora Sara), but the project mixes them within ONE app surface. User sees "Sadhana" in matching and "Sadhaka" in personal-panchang for the same tara position.
- **Severity:** P2 (user-visible naming inconsistency, no computation impact).
- **Proposed fix:** Pick one naming scheme. Extract to shared `src/lib/constants/tara.ts`.

### R3-COMP-10 — Round 2 COMP-14 still open — Bhava Bala uses 4 non-canonical components

- **File:** `src/lib/kundali/bhavabala.ts:1-90`
- **Status:** Confirmed STILL OPEN. BPHS Ch.34 canonical 4 components are Adhipati, Dig, Kala, Drishti. The code substitutes "Bhava Graha Sambandha" (occupation) for "Kala Bala." File header comment claims BPHS Ch.34 but does not document the substitution.
- **Severity:** P2.
- **Proposed fix:** Either implement real Bhava Kala Bala (the lord's natural strength at its tropical hour) or rename "Bhava Bala" → "Bhava Strength (simplified)" and document the substitution at file-top.

### R3-COMP-11 — Jaimini 8-karaka scheme puts PiK (Pitrakaraka) in 8th position, not 5th

- **File:** `src/lib/jaimini/jaimini-calc.ts:56-61`
- **Evidence:**
  ```ts
  const KARAKA_ORDER_8 = [
    ...KARAKA_ORDER_7.slice(0, 5), // AK, AmK, BK, MK, PK
    { key: 'GK', name: ... },
    { key: 'DK', name: ... },
    { key: 'PiK', name: { en: 'Pitrakaraka (Father)', ... } },
  ];
  ```
- **Canonical (Sanjay Rath, Jaimini Sutras Adhikara 1 Sutra 21-24):** The 8-karaka order INSERTS PiK as the 5th karaka, shifting the 7-karaka order forward: AK, AmK, BK, MK, **PiK**, PK, GK, DK. The code's order keeps PK in the 5th slot and appends PiK at the END, which conflates PiK with the 7-karaka's DK position semantics.
- **Impact:** The 5th karaka (Putrakaraka in code, should be Pitrakaraka in 8-karaka) determines mantra/spiritual practice signifier in Karakamsha analysis. The 8th-position karaka (PiK in code) is assigned a degree-rank that classical Pitrakaraka would not occupy. All Jaimini-based Karakamsha narrations using the 8-karaka scheme show wrong karakas in 5th and 8th slots.
- **Severity:** P2 (doctrinal — but in the way the code intends to follow Sanjay Rath's commentary, this is wrong; if intending Iyer's lineage, it's also wrong).
- **Proposed fix:**
  ```ts
  const KARAKA_ORDER_8 = [
    KARAKA_ORDER_7[0], // AK
    KARAKA_ORDER_7[1], // AmK
    KARAKA_ORDER_7[2], // BK
    KARAKA_ORDER_7[3], // MK
    { key: 'PiK', name: { en: 'Pitrakaraka (Father)', ... } },
    KARAKA_ORDER_7[4], // PK
    KARAKA_ORDER_7[5], // GK
    KARAKA_ORDER_7[6], // DK
  ];
  ```

### R3-COMP-12 — Sphuta formulas non-classical (Prana, Deha, Mrityu) and Avayogi offset

- **File:** `src/lib/kundali/sphutas.ts:47-83`
- **Evidence:**
  ```ts
  // ── Prana Sphuta ── = Lagna + Moon + Sun
  const pranaDeg = normalizeDeg(lagnaLong + moonLong + sunLong);
  // ── Deha Sphuta ── = (Moon × 8 + Lagna) / 9
  const dehaDeg = normalizeDeg((moonLong * 8 + lagnaLong) / 9);
  // ── Mrityu Sphuta ── = (Moon × 8 + Lagna + Sun × 7) / 16
  const mrityuDeg = normalizeDeg((moonLong * 8 + lagnaLong + sunLong * 7) / 16);
  // ── Avayogi ── = Yogi + 186°40'
  const avayogiDeg = normalizeDeg(yogiDeg + 186.667);
  ```
- **Canonical BPHS Ch.10:**
  - **Prana Sphuta** = Lagna × 5 + Sun. (The "5×Lagna" multiplier is essential; the code uses Lagna × 1 + Moon + Sun which is the "Tri Sphuta" formula.)
  - **Deha Sphuta** = Moon × 8 + Lagna (NO division by 9 — the code's `/ 9` re-scales the result inappropriately).
  - **Mrityu Sphuta** = Sun × 7 + Lagna (NO Moon component — the code adds Moon × 8 / 16 which is non-classical).
  - **Avayogi** = Yogi + 6 nakshatras (= 6 × 13°20' = 80°), NOT 186°40' (= 14 nakshatras).
- **Why it diverges:** The current Sphuta engine seems to implement Sanjay Rath's textbook variations rather than the BPHS Ch.10 originals. Both are defensible but no source identifies the project's exact formula set.
- **Impact:** All Mrityu Sphuta-based health predictions, transit alerts to "vitality point," and Yogi/Avayogi predictions point to wrong degrees. Comparison with JHora's Sphuta panel will diverge significantly.
- **Severity:** P2.
- **Proposed fix:** Pick one lineage explicitly. If staying on the current formulas, add per-formula source citation comments (e.g., "Sanjay Rath, Sphuta Lessons 2009 — Prana = L+M+S simplified").

---

## P3 — Comment / cleanup

### R3-COMP-13 — Yogini Dasha formula `(n%9)%8` gives Mangala 6 nakshatras vs ~3 for others — undocumented

- **File:** `src/lib/kundali/yogini-dasha.ts:84-91`
- **Evidence:** Formula `(nakshatraIndex % 9) % 8` maps:
  - Mangala (Yogini 0): Ashwini(0), Ashlesha(8), Magha(9), Jyeshtha(17), Mula(18), Revati(26) — **6 nakshatras**
  - Pingala (1) through Sankata (7): 3 nakshatras each
- **Discussion:** The "extra Mangala" mapping IS a known Yogini Dasha convention (Brihat Naradiya Purana / Saravali list 6 nakshatras for Mangala). But many modern Jyotish software (JHora, Parashara's Light) use the simpler `nakshatraIndex % 8` which spreads more evenly (Ashlesha=0, Magha=1, etc.).
- **Severity:** P3 (doctrinal; formula appears intentional given the documentation block at line 13-26 lists Mangala's 6 nakshatras explicitly).
- **Proposed fix:** Add a "DELIBERATE LINEAGE CHOICE (Lesson S)" comment at line 89 stating: "Following Saravali / Brihat Naradiya which assigns 6 nakshatras to Mangala. Simpler `% 8` (JHora-style) is not used because the canonical groups list Ashlesha + Jyeshtha + Revati explicitly under Mangala."

### R3-COMP-14 — `jaimini-calc.ts:239` still uses `setFullYear` (Lesson P reaffirmed)

- **File:** `src/lib/jaimini/jaimini-calc.ts:238-239`
- **Evidence:**
  ```ts
  const endDate = new Date(currentDate);
  endDate.setFullYear(endDate.getFullYear() + years);
  ```
- **Status:** Still open at HEAD `b4cd2720`. Round 1's `additional-dashas.ts` migrated to ms-based `addYears` (commit history shows `function addYears... = new Date(date.getTime() + years * 365.25 * 24 * 60 * 60 * 1000)`). The Jaimini Chara Dasha file was not migrated.
- **Why it's a smell:** Chara Dasha years ARE integers (1-12), so `setFullYear` produces correct integer-year endings UNLESS the year crosses Feb 29 → Mar 1 boundaries (the leap-day cliff). Per Lesson P, the ms-arithmetic pattern is preferred for consistency and avoids the leap-year cliff entirely.
- **Severity:** P3 (reaffirmation of the Round 1 / Round 2 finding).

### R3-COMP-15 — `kundali-calc.ts:486-505` D60 deliberate-choice comment quality

- **File:** `src/lib/ephem/kundali-calc.ts:486-505`
- **Status:** Sprint 22 added a long Lesson-S comment block on D60. Quality is high. One minor smell: the comment claims "BPHS Ch.6 Sl.41-44 prescribes a 60-deity table" but the code's first-line comment summary at line 487 still reads "Shashtiamsha (D60) — DELIBERATE LINEAGE CHOICE (Lesson S)." The summary doesn't say WHICH lineage (Sanjay Rath) — a code-reader skimming the file may miss it because the lineage attribution is in the body, not the summary.
- **Severity:** P3 (polish).
- **Proposed fix:** Change line 487 to: `case 60: { // Shashtiamsha (D60) — Sanjay Rath simplified; see comment for Lesson S rationale.`

---

## Cross-cutting themes

1. **Two aspect engines, two conventions.** The yoga engine (`yogas-complete.ts`, `bhavabala.ts`) uses `((to - from + 12) % 12) + 1` for inclusive 1-12 Vedic counting. The Shadbala Drik Bala and Tajika Induvara use `((to - from + 12) % 12) || 12` which produces exclusive 0-11 with 0→12 coercion. **R3-COMP-1**'s off-by-one is a Lesson Q symptom: two implementations of "house distance" diverged silently because neither imports from a shared helper. **One concentrated PR** that exports `houseDistance(from, to)` from `src/lib/utils/jyotish.ts` (or similar) and migrates BOTH engines fixes this entire class.

2. **Varga formula divergence cluster.** D8 (R3-COMP-4), D27 (R3-COMP-2), D30 even-sign (R3-COMP-3), D60 (Round 2 COMP-3, deliberately documented Sprint 22). Four of the 16 Shodashavarga formulas have some divergence from BPHS Ch.6. The D60 fix demonstrated the right pattern: pick a lineage, document, test. **Same template should be applied to D8, D27, D30** in one varga-doctrine PR.

3. **Manglik definition fragmentation (R3-COMP-5) is the same shape as Sprint 13's 16-file Naisargika.** Sprint 13 closed Naisargika across 16 files. Manglik is in 4 files with 3 different rule sets (5-house vs 6-house, Lagna-only vs three-references). The dispatch should follow the same template: extract one `analyzeMangalDosha` in the canonical engine, migrate all 3 callers, delete local definitions. Same PR should close Round 3 R3-COMP-1's `houseDistance` and migrate Sphuta canonicalisation (R3-COMP-12) — they're all Lesson Q+S clusters.

4. **The off-by-one in R3-COMP-1 has been live since Shadbala first shipped.** No user has reported it because Drik Bala is one of 6 components and its contribution is a small percentage of `totalPinda`. The strength rank rarely flips because of Drik alone. But every chart's Drik Bala number is wrong. This is the highest-blast-radius unreported bug in the audit — same shape as Sprint 14's `jdToDate()` UTC fix (every JD conversion was wrong, no user noticed because the magnitude was minutes-to-hours).

5. **Deferred Round 2 COMP-* items (10, 11, 12, 13, 14) have not been touched by Sprints 22-25.** All confirmed still open. Each is genuinely doctrinal (Lesson S) rather than wrong-value (Lesson K), so the deferral is defensible. But the project's pattern of leaving them as TODO across 3 rounds suggests they need a single "doctrinal manifesto" PR that addresses all 5 in one sweep with explicit lineage citations rather than ad-hoc per-finding fixes.

---

## Diminishing-returns note

**Two full audit rounds (Round 1 + Round 2, 19 COMP findings combined) plus 25 sprints of fixes have aggressively hardened the computation surface.** Sprint 13 alone closed the 16-file Naisargika alignment, MARANA_KARAKA_HOUSE dedup, EXALT_SIGN_NB inline duplicate, plus Vasumati/Mahabhagya/Gauri/Kemadruma yoga-frequency fixes. Sprint 14 closed UTC anchors and the `jdToDate()` cluster. Sprint 15 closed friendship canonical + yoga frequency. Sprint 22 closed friendship sets in domain-synthesis, nabhasa NATURAL_MALEFICS, D60 deliberate-choice, and three Lesson-Q duplicate FRIENDS/ENEMIES copies.

This Round 3 found **1 P0** (Drik Bala off-by-one — genuinely new, surviving 25 sprints), **4 P1** (varga formula divergences + Manglik fragmentation), and **7 P2** doctrinal items. **The P0 (R3-COMP-1) is the most material remaining finding.** After fixing it, the surface will be sufficiently hardened that a Round 4 would likely return mostly P3 polish + new doctrinal P2s — the rate of "wrong value shipped" findings has dropped from ~5 per round (Round 1) to 2 (Round 2) to 1 (Round 3).

**Round 3 should be the last full-domain audit.** Subsequent passes should be targeted (a) when a new feature lands in a previously-audited area, or (b) when user-reported divergence vs Prokerala/JHora surfaces a numeric mismatch worth tracing. Continued audit-driven hardening past this point yields diminishing returns relative to the engineering hours.

---

## What this section did not cover (candidates for future targeted audits)

- KP-system sub-sub-lord chains beyond the first two levels.
- Varshaphal Tajika muntha formula and Sahams beyond Hora Sahama.
- Prashna ghati-based Ascendant calculations.
- Eclipse magnitude / Gamma precision vs NASA JPL Horizons.
- Sripati cusps formula on extreme latitudes (>60° N/S).
- Combust orb modifications for retrograde Mercury/Venus across the 3 still-separate `COMBUSTION_ORBS` tables (R2-COMP-7 still open per drift tests added Sprint 22).
- Bhinnashtakavarga shodhana (reduction) — only base totals were verified, not the trikona/ekadhipatya shodhana steps.
- The `Yogi/Avayogi` planet derivation when a nakshatra spans a sign boundary.
