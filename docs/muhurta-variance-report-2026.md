# Muhurta Variance Report — 2026

**Date:** 2026-05-03
**Location:** New Delhi (28.6139°N, 77.209°E), IST (UTC+5:30)
**Our engine:** `scanDateRangeV2` with `score >= 50` threshold, 180-min windows, sunrise-to-sunset only

## Reference Sources

| Source | Coverage | Notes |
|--------|----------|-------|
| Drik Panchang | Marriage, Griha Pravesh, Vehicle | Annual listing pages for New Delhi (geoname-id 1261481) |
| Prokerala | Marriage, Griha Pravesh, Mundan, Namakarana, Vehicle | Annual listing pages (default location, likely Delhi) |
| PanchangBodh | Engagement/Sagai | Annual listing with monthly breakdown |

Drik Panchang does **not** publish annual listing pages for Mundan, Namakarana, Upanayana, or Engagement — those are single-day calculators only. Prokerala does not publish Upanayana or Engagement annual listings.

---

## Summary Table

| Activity | Our Total | Drik Total | Prokerala Total | Other Source | Variance vs Drik | Variance vs Prokerala |
|----------|-----------|------------|-----------------|--------------|-------------------|------------------------|
| Marriage | 48 | 51 | 37 | — | -3 (-6%) | +11 (+30%) |
| Griha Pravesh | 46 | 35 | 33 | — | +11 (+31%) | +13 (+39%) |
| Mundan | 103 | N/A | 17 | — | N/A | +86 (+506%) |
| Namakarana | 181 | N/A | 107 | — | N/A | +74 (+69%) |
| Upanayana | 78 | N/A | N/A | — | N/A | N/A |
| Vehicle | 179 | 102 | 60 | — | +77 (+75%) | +119 (+198%) |
| Engagement | 56 | N/A | N/A | PanchangBodh: 69 | N/A | -13 (-19%) vs PanchangBodh |

---

## Marriage — Month-by-Month Comparison

| Month | Ours | Drik Panchang | Prokerala | Notes |
|-------|------|---------------|-----------|-------|
| Jan | 0 | 0 | 4 | Drik: Shukra Tara Asta (Venus combust). Prokerala does not exclude Venus combustion for marriage. We correctly exclude Jan. |
| Feb | 0 | 12 | 6 | **MAJOR GAP** — We show 0, Drik shows 12. Our engine is too strict in Feb or has a blocking rule. |
| Mar | 3 | 8 | 1 | We're between Drik and Prokerala |
| Apr | 11 | 8 | 5 | We're more permissive than both references |
| May | 7 | 8 | 6 | Close to Drik |
| Jun | 10 | 8 | 7 | Slightly more permissive |
| Jul | 3 | 4 | 2 | Close to Drik |
| Aug | 0 | 0 | 0 | All agree: Guru Tara Asta / prohibited months |
| Sep | 0 | 0 | 0 | All agree: prohibited solar month |
| Oct | 0 | 0 | 0 | All agree |
| Nov | 9 | 4 | 3 | We're 2-3x more permissive |
| Dec | 5 | 7 | 3 | Close to Drik |

### Marriage Key Findings

1. **February = 0 is a bug.** Drik shows 12 dates, Prokerala shows 6. Our engine is blocking the entire month. Likely cause: Venus combustion check is too aggressive (Venus combustion in Jan bleeds into Feb in our engine), OR a lunar month exclusion is wrong.
2. **November over-count.** We show 9 vs Drik's 4. Possible cause: we're not excluding enough days during Chaturmas tail / post-Kartik period, or our nakshatra/yoga shuddhi is more lenient.
3. **April over-count.** We show 11 vs Drik's 8. Our scoring threshold of 50 may be too permissive for dates that Drik filters on stricter nakshatra shuddhi.

---

## Griha Pravesh — Month-by-Month Comparison

| Month | Ours | Drik Panchang | Prokerala |
|-------|------|---------------|-----------|
| Jan | 0 | 0 | 4 |
| Feb | 1 | 7 | 2 |
| Mar | 4 | 6 | 1 |
| Apr | 12 | 1 | 3 |
| May | 5 | 3 | 3 |
| Jun | 8 | 3 | 2 |
| Jul | 1 | 3 | 3 |
| Aug | 0 | 0 | 3 |
| Sep | 0 | 0 | 3 |
| Oct | 0 | 0 | 2 |
| Nov | 9 | 6 | 2 |
| Dec | 6 | 8 | 3 |
| **Total** | **46** | **35** | **33** |

### Griha Pravesh Key Findings

1. **April: 12 vs 1 (Drik).** Massive over-count. Drik lists only Apr 20 as auspicious. We're allowing 12 dates. Likely cause: Drik applies strict Adhika Masa (intercalary month) exclusion in Apr-May 2026 — our engine may not be filtering Adhika Masa.
2. **Aug-Oct: 0 vs Prokerala 2-3/month.** Prokerala is more permissive during Chaturmas. Drik agrees with us at 0. Our approach matches Drik's stricter methodology for these months.
3. **Feb under-count.** We show 1 vs Drik's 7. Same Venus combustion over-exclusion as marriage.

---

## Mundan — Comparison (Prokerala only)

| Month | Ours | Prokerala |
|-------|------|-----------|
| Jan | 0 | 3 |
| Feb | 8 | 5 |
| Mar | 13 | 2 |
| Apr | 18 | 3 |
| May | 6 | 3 |
| Jun | 9 | 2 |
| Jul | 2 | 2 |
| Aug | 8 | 0 |
| Sep | 14 | 0 |
| Oct | 6 | 0 |
| Nov | 8 | 0 |
| Dec | 11 | 0 |
| **Total** | **103** | **17** |

### Mundan Key Findings

1. **6x over-count (103 vs 17).** This is the largest variance. Our engine is far too permissive for mundan.
2. **Prokerala shows 0 dates Aug-Dec** while we show 8-14/month. This strongly suggests we're missing a major exclusion — likely **Dakshinayana** (Sun in southern declination, roughly Jul-Dec) which many texts prohibit for mundan. Also possibly missing Chaturmas exclusion.
3. **Even in shared months (Jan-Jul), we're 2-9x higher.** Our nakshatra/tithi/weekday filters for mundan are much looser than classical requirements. Prokerala applies stricter nakshatra shuddhi (only specific nakshatras like Shravana, Dhanishta, Mrigashirsha, Pushya, Punarvasu, Hasta, Jyeshtha, Anuradha).

---

## Namakarana — Comparison (Prokerala only)

| Month | Ours | Prokerala |
|-------|------|-----------|
| Jan | 15 | 8 |
| Feb | 14 | 8 |
| Mar | 17 | 8 |
| Apr | 19 | 7 |
| May | 19 | 7 |
| Jun | 18 | 7 |
| Jul | 13 | 8 |
| Aug | 12 | 8 |
| Sep | 16 | 8 |
| Oct | 15 | 8 |
| Nov | 9 | 8 |
| Dec | 14 | 8 |
| **Total** | **181** | **107** |

### Namakarana Key Findings

1. **69% over-count (181 vs 107).** Our engine is significantly more permissive.
2. **Prokerala is remarkably consistent at 7-8/month.** This suggests they use a strict nakshatra-based filter (likely only specific naming-ceremony nakshatras — Rohini, Pushya, Hasta, Anuradha, Uttara Ashadha, Dhanishta, Uttara Bhadrapada, Revati, Ashwini, Mrigashirsha). We're likely allowing many more nakshatras.
3. **Our score=50 threshold is too low** for this activity — it passes dates that fail classical nakshatra shuddhi.

---

## Vehicle Purchase — Comparison

| Month | Ours | Drik Panchang | Prokerala |
|-------|------|---------------|-----------|
| Jan | 17 | 10 | 6 |
| Feb | 11 | 5 | 4 |
| Mar | 16 | 10 | 4 |
| Apr | 20 | 9 | 6 |
| May | 20 | 5 | 6 |
| Jun | 18 | 4 | 5 |
| Jul | 13 | 9 | 4 |
| Aug | 15 | 10 | 4 |
| Sep | 13 | 8 | 6 |
| Oct | 14 | 5 | 4 |
| Nov | 12 | 5 | 5 |
| Dec | 10 | 8 | 6 |
| **Total** | **179** | **102** | **60** |

### Vehicle Key Findings

1. **75% over-count vs Drik (179 vs 102).** We're allowing nearly every other day.
2. **Drik uses stricter criteria:** only Chara (movable) nakshatras — Punarvasu, Swati, Shravana, Dhanishta, Shatabhisha — plus Chara/Dwiswabhava lagna. We appear to be counting any day with a reasonable generic muhurta score.
3. **Our activity-specific nakshatra filter for vehicle purchase is too broad.** Vehicle purchase has a very specific classical rule set that we're not enforcing tightly enough.

---

## Engagement — Comparison (PanchangBodh only)

| Month | Ours | PanchangBodh |
|-------|------|--------------|
| Jan | 0 | 0 |
| Feb | 0 | 12 |
| Mar | 4 | 9 |
| Apr | 13 | 9 |
| May | 9 | 8 |
| Jun | 11 | 10 |
| Jul | 3 | 5 |
| Aug | 0 | 0 |
| Sep | 0 | 0 |
| Oct | 0 | 0 |
| Nov | 10 | 6 |
| Dec | 6 | 10 |
| **Total** | **56** | **69** |

### Engagement Key Findings

1. **Feb = 0 is a bug.** Same as marriage — Venus combustion check is over-zealous, blocking all of February when PanchangBodh shows 12 dates.
2. **Aug-Oct = 0 agrees** with PanchangBodh (Chaturmas / Venus combustion).
3. Overall shape is reasonable aside from the February gap.

---

## Root Cause Analysis

### Systematic Issues (affecting multiple activities)

| Issue | Affected Activities | Likely Cause |
|-------|---------------------|-------------|
| **February blocked entirely** | Marriage, Engagement | Venus combustion (Shukra Asta) check extends too long. Drik shows Venus combust only in January. Our engine likely uses a wider orb or incorrect combustion dates. |
| **Score threshold too low (50)** | All activities | A score of 50 allows dates that fail classical shuddhi. Drik and Prokerala use binary pass/fail on nakshatra+tithi+weekday+lunar month, not a scoring system. |
| **Missing Dakshinayana exclusion** | Mundan | Classical texts prohibit mundan during Dakshinayana (Sun's southern course, ~Jul-Jan). Our engine has no such check. |
| **Missing Adhika Masa filter** | Griha Pravesh, possibly others | 2026 has an Adhika (intercalary) month around Apr-May. Drik excludes this entirely for griha pravesh. |
| **Activity-specific nakshatra filters too broad** | Mundan, Namakarana, Vehicle | Each activity has a canonical set of permitted nakshatras. Our scoring penalises bad nakshatras but doesn't hard-reject them. |

### Per-Activity Recommendations

| Activity | Action | Priority |
|----------|--------|----------|
| Marriage | Fix Venus combustion dates for 2026; verify Feb dates re-appear | HIGH |
| Griha Pravesh | Add Adhika Masa exclusion; fix Feb Venus issue | HIGH |
| Mundan | Add Dakshinayana exclusion; restrict to classical nakshatras; raise score threshold to 65-70 | HIGH |
| Namakarana | Restrict to classical naming nakshatras; raise threshold | MEDIUM |
| Vehicle | Enforce Chara nakshatra requirement; raise threshold to 60+ | MEDIUM |
| Engagement | Fix Venus combustion (same as marriage); otherwise reasonable | HIGH |
| Upanayana | No reference data available for comparison — needs manual spot-check against Drik day-by-day | LOW |

---

## Methodology Notes

1. **Our engine uses a scoring system (0-100)** with a threshold of 50. Reference sources use binary pass/fail based on classical shuddhi rules. This fundamental difference explains why we're consistently more permissive.
2. **Drik Panchang is the strictest source** — it applies Venus/Jupiter combustion, Adhika Masa, prohibited solar months, and strict nakshatra shuddhi. It's the gold standard for North Indian muhurta.
3. **Prokerala is moderately strict** — similar nakshatra filters but sometimes omits combustion checks (e.g., Jan marriage dates despite Venus combustion).
4. **Location matters** — Drik Panchang data was fetched for New Delhi (geoname-id 1261481). Our engine used the same coordinates (28.6139, 77.209).
5. **Engagement has no Drik Panchang annual page** — Drik subsumes engagement into marriage dates. PanchangBodh was used as the reference.

---

## Data Appendix

### Our Raw Output (score >= 50, dates per month)

```
Activity:        Jan Feb Mar Apr May Jun Jul Aug Sep Oct Nov Dec  TOTAL
marriage:         0   0   3  11   7  10   3   0   0   0   9   5    48
griha_pravesh:    0   1   4  12   5   8   1   0   0   0   9   6    46
mundan:           0   8  13  18   6   9   2   8  14   6   8  11   103
namakarana:      15  14  17  19  19  18  13  12  16  15   9  14   181
upanayana:        0   7  15  20   6  10   2   0   0   0   6  12    78
vehicle:         17  11  16  20  20  18  13  15  13  14  12  10   179
engagement:       0   0   4  13   9  11   3   0   0   0  10   6    56
```

### Drik Panchang (New Delhi, 2026)

```
Activity:        Jan Feb Mar Apr May Jun Jul Aug Sep Oct Nov Dec  TOTAL
marriage:         0  12   8   8   8   8   4   0   0   0   4   7    51 (*)
griha_pravesh:    0   7   6   1   3   3   3   0   0   0   6   8    35 (*)
vehicle:         10   5  10   9   5   4   9  10   8   5   5   8   102 (*)
```

### Prokerala (2026)

```
Activity:        Jan Feb Mar Apr May Jun Jul Aug Sep Oct Nov Dec  TOTAL
marriage:         4   6   1   5   6   7   2   0   0   0   3   3    37
griha_pravesh:    4   2   1   3   3   2   3   3   3   2   2   3    33 (*)
mundan:           3   5   2   3   3   2   2   0   0   0   0   0    17 (*)
namakarana:       8   8   8   7   7   7   8   8   8   8   8   8   107 (*)
vehicle:          6   4   4   6   6   5   4   4   6   4   5   6    60
```

### PanchangBodh (2026)

```
Activity:        Jan Feb Mar Apr May Jun Jul Aug Sep Oct Nov Dec  TOTAL
engagement:       0  12   9   9   8  10   5   0   0   0   6  10    69
```

(*) Counts extracted via web scraping; minor counting errors possible due to multi-day muhurats spanning midnight.
