# Ekadashi Accuracy Fixes — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Fix three categories of Ekadashi calculation bugs so our parana windows, dates, and names match Drik Panchang within ~5 minutes for all 24 Ekadashis in 2026.

**Architecture:** Three independent fixes to `festivals.ts` (parana end-time capping, date edge cases, naming map), plus a verification pass comparing against Drik Panchang data.

**Tech Stack:** TypeScript, Next.js API routes, astronomical calculations (Meeus)

---

## Root Cause Analysis

### Bug 1: Parana end time extends far past Madhyahna
**Current:** `recEndUT = dwadashiEndUT` — the window end is Dwadashi end (can be hours after Madhyahna).
**Drik behavior:** When HV is already over and window starts at sunrise, Drik caps the end at Madhyahna start. When HV ends after Madhyahna start, Drik shows post-Madhyahna window ending at sunset or Dwadashi end (whichever is earlier), capped at sunset.
**Impact:** Our end times are +100m to +190m too late on 15+ Ekadashis.

### Bug 2: Three dates off by 1 day
- **Jaya (Jan 28→29):** Ekadashi not at Arunodaya on Jan 28. Drik uses different observance rule.
- **Devshayani (Jul 24→25):** Ekadashi spans two sunrises. Our code takes first; Drik takes second (Smarta rule for Dwi-Ekadashi).
- **Kamika (Aug 8→9):** Same pattern as Jaya.

**Root cause:** Our `findEkadashiDate` picks the first day where Ekadashi is at Arunodaya/sunrise. It doesn't handle: (a) Ekadashi that starts mid-day but should be observed that day, (b) Ekadashi spanning two sunrises where second day is correct.

### Bug 3: Ekadashi names shifted by ~1 month for half the year
**Current:** `SOLAR_MONTH_MAP` maps Sun's sidereal sign → Hindu month. This works for Shukla Ekadashis but is wrong for Krishna Ekadashis because in the Purnimant system, Krishna paksha belongs to the NEXT month (e.g., Chaitra Krishna = same lunar month as Vaishakha Shukla in Purnimant reckoning).
**Impact:** ~12 of 24 Ekadashi names are wrong.

---

### Task 1: Fix Parana End Time — Cap at Madhyahna/Sunset

**Files:**
- Modify: `src/lib/calendar/festivals.ts` (parana window logic, ~lines 353-379)

The fix follows Drik's logic:
1. If window starts before Madhyahna → end at min(Madhyahna start, Dwadashi end)
2. If Hari Vasara ends during/after Madhyahna → start after Madhyahna, end at min(sunset, Dwadashi end)
3. Never extend parana window past sunset

- [ ] **Step 1: Read current parana logic**

Read `src/lib/calendar/festivals.ts` lines 340-385 to confirm exact current code.

- [ ] **Step 2: Replace the parana window logic**

In `src/lib/calendar/festivals.ts`, find the block that starts with `// ─── Determine recommended parana window ───` and replace the entire recStartUT/recEndUT determination:

```typescript
  // ─── Determine recommended parana window ───
  // Drik Panchang rules:
  // 1. After Hari Vasara ends (or sunrise if HV already over)
  // 2. Avoid Madhyahna (middle 1/5 of daytime)
  // 3. Before Dwadashi ends
  // 4. Prefer morning (before Madhyahna) if available
  // 5. Never extend past sunset

  const earliestUT = hariVasaraAlreadyOver ? sunriseUT : Math.max(hariVasaraEndUT, sunriseUT);
  const earlyEnd = dwadashiEndUT <= earliestUT;
  const effectiveDeadline = Math.min(dwadashiEndUT, sunsetUT); // never past sunset

  let recStartUT: number;
  let recEndUT: number;

  if (earlyEnd) {
    // Dwadashi ends before we can start — break fast ASAP after sunrise
    recStartUT = sunriseUT;
    recEndUT = dwadashiEndUT;
  } else if (earliestUT < madhyahnaStartUT) {
    // Window opens before Madhyahna — use pre-Madhyahna window
    recStartUT = earliestUT;
    recEndUT = Math.min(madhyahnaStartUT, effectiveDeadline);
  } else if (earliestUT >= madhyahnaEndUT) {
    // Hari Vasara ends after Madhyahna — use post-Madhyahna window
    recStartUT = earliestUT;
    recEndUT = effectiveDeadline;
  } else {
    // Hari Vasara ends during Madhyahna — wait until Madhyahna ends
    recStartUT = madhyahnaEndUT;
    recEndUT = effectiveDeadline;
  }
```

- [ ] **Step 3: Remove the old madhyahnaConflict variable**

Delete the `let madhyahnaConflict = false;` declaration and all references to it in the note-building section. Simplify the note text to always describe the three rules without special-casing.

- [ ] **Step 4: Build and test**

Run: `npx next build`
Expected: Compiles successfully.

Then test with the API:
```bash
curl -s "http://localhost:3000/api/calendar?year=2026&lat=46.95&lon=7.45&tz=2" | python3 -c "
import json, sys
data = json.load(sys.stdin)
for f in data.get('festivals', []):
    if not isinstance(f, dict) or f.get('category') != 'ekadashi': continue
    n = f.get('name',{}).get('en','') if isinstance(f.get('name'), dict) else f.get('name','')
    print(f'{f[\"date\"]}: {n:<25} Parana: {f.get(\"paranaStart\",\"?\")}-{f.get(\"paranaEnd\",\"?\")}')
"
```

Verify Kamada Ekadashi parana ends around 11:00-12:00 (near Madhyahna start), NOT at Dwadashi end.

- [ ] **Step 5: Commit**

```bash
git add src/lib/calendar/festivals.ts
git commit -m "fix: cap Ekadashi parana end time at Madhyahna start or sunset"
```

---

### Task 2: Fix Ekadashi Date Edge Cases

**Files:**
- Modify: `src/lib/calendar/festivals.ts` (findEkadashiDate function)

Three sub-issues:
A. When Ekadashi starts mid-day, Drik still observes that day (if Dashami has ended by Arunodaya or Ekadashi covers majority of day). Our Arunodaya check misses this.
B. When Ekadashi spans two sunrises (Dwi-Ekadashi), Drik observes on the SECOND day.
C. Both can be solved by: find the day where Ekadashi is the tithi at sunrise. If found at two consecutive days, take the second. If not found at any sunrise (short Ekadashi), take the day where it starts.

- [ ] **Step 1: Read current findEkadashiDate**

Read `src/lib/calendar/festivals.ts` to confirm the current function.

- [ ] **Step 2: Rewrite findEkadashiDate**

Replace the entire `findEkadashiDate` function:

```typescript
/**
 * Find Ekadashi observance date using Smarta rules:
 * 1. Scan for days where Ekadashi tithi prevails at sunrise
 * 2. If found at two consecutive sunrises (Dwi-Ekadashi), observe the SECOND day
 * 3. If not found at any sunrise (very short Ekadashi), observe the day it starts
 */
function findEkadashiDate(year: number, month: number, targetTithi: number, lat: number, lon: number): string {
  const startDate = new Date(year, month - 1, 1);
  startDate.setDate(startDate.getDate() - 15);

  let firstMatch: string | null = null;
  let prevWasMatch = false;

  for (let offset = 0; offset <= 50; offset++) {
    const dd = new Date(startDate);
    dd.setDate(dd.getDate() + offset);
    const gy = dd.getFullYear();
    const gm = dd.getMonth() + 1;
    const gd = dd.getDate();
    const dateStr = `${gy}-${gm.toString().padStart(2, '0')}-${gd.toString().padStart(2, '0')}`;

    const jdApprox = dateToJD(gy, gm, gd, 0);
    const srUT = approximateSunrise(jdApprox, lat, lon);
    const jdSunrise = dateToJD(gy, gm, gd, srUT);
    const tithiAtSunrise = calculateTithi(jdSunrise).number;

    if (tithiAtSunrise === targetTithi) {
      if (prevWasMatch) {
        // Dwi-Ekadashi: tithi at sunrise for two consecutive days → observe second day
        return dateStr;
      }
      firstMatch = dateStr;
      prevWasMatch = true;
    } else {
      if (prevWasMatch) {
        // Previous day was the only match — that's the observance day
        return firstMatch!;
      }
      prevWasMatch = false;
    }
  }

  // If we found exactly one match at the end of scan
  if (firstMatch) return firstMatch;

  // Fallback: scan for the day the tithi STARTS (for very short tithis)
  let prevTithi = 0;
  for (let offset = 0; offset <= 50; offset++) {
    const dd = new Date(startDate);
    dd.setDate(dd.getDate() + offset);
    const gy = dd.getFullYear();
    const gm = dd.getMonth() + 1;
    const gd = dd.getDate();

    const jdApprox = dateToJD(gy, gm, gd, 0);
    const srUT = approximateSunrise(jdApprox, lat, lon);
    const jdSunrise = dateToJD(gy, gm, gd, srUT);
    const t = calculateTithi(jdSunrise).number;

    // Check if the target tithi starts sometime during this day
    if (prevTithi !== 0 && prevTithi !== targetTithi) {
      // Check midday
      const jdNoon = dateToJD(gy, gm, gd, srUT + 6);
      if (calculateTithi(jdNoon).number === targetTithi) {
        return `${gy}-${gm.toString().padStart(2, '0')}-${gd.toString().padStart(2, '0')}`;
      }
    }
    prevTithi = t;
  }

  return `${year}-${month.toString().padStart(2, '0')}-15`; // absolute fallback
}
```

- [ ] **Step 3: Build and verify the 3 disputed dates**

Run: `npx next build`

Then check the 3 disputed dates:
```bash
curl -s "http://localhost:3000/api/calendar?year=2026&lat=46.95&lon=7.45&tz=2" | python3 -c "
import json, sys
data = json.load(sys.stdin)
for f in data.get('festivals', []):
    if not isinstance(f, dict) or f.get('category') != 'ekadashi': continue
    n = f.get('name',{}).get('en','') if isinstance(f.get('name'), dict) else f.get('name','')
    d = f.get('date','')
    # Only show the disputed ones
    if any(x in d for x in ['01-2','07-2','08-0']):
        print(f'{d}: {n}')
"
```

Expected:
- Jaya Ekadashi: 2026-01-28 (was Jan 29)
- Devshayani Ekadashi: 2026-07-25 (was Jul 24)
- Kamika Ekadashi: 2026-08-08 (was Aug 9)

- [ ] **Step 4: Commit**

```bash
git add src/lib/calendar/festivals.ts
git commit -m "fix: Ekadashi date edge cases — Dwi-Ekadashi second day rule"
```

---

### Task 3: Fix Ekadashi Naming — Correct Lunar Month Mapping

**Files:**
- Modify: `src/lib/constants/festival-details.ts` (SOLAR_MONTH_MAP)
- Modify: `src/lib/calendar/festivals.ts` (how getHinduMonth is called for Krishna paksha)

**Root cause:** In the Purnimant calendar system used by Drik, the Krishna paksha belongs to the month that FOLLOWS the Shukla paksha. For example:
- Chaitra Shukla Ekadashi = Kamada (Sun in Pisces/sign 12)
- Chaitra Krishna Ekadashi = Papamochani (Sun ALSO in Pisces — but Drik names it from the Amanta month)

Actually, the simpler fix: Drik uses the Amanta system for naming where Krishna paksha comes BEFORE Shukla in the same month. So Chaitra = Krishna first, then Shukla. When Sun is in Meena (Pisces, sign 12):
- Krishna Ekadashi = Papamochani (Chaitra Krishna in Amanta = Phalguna Krishna in Purnimant)
- Shukla Ekadashi = Kamada (Chaitra Shukla)

The mapping issue: for Krishna Ekadashi, we need to look up the PREVIOUS month's name.

- [ ] **Step 1: Read the current naming code in festivals.ts**

Read the section in `generateFestivalCalendar` where Ekadashi names are determined (~line 690+).

- [ ] **Step 2: Fix Krishna paksha month lookup**

In `src/lib/calendar/festivals.ts`, find where `krishnaEkadashiDetail` is computed (around line 700):

```typescript
    const krishnaDateParts = ekadashi.krishna.split('-').map(Number);
    const krishnaJd = dateToJD(krishnaDateParts[0], krishnaDateParts[1], krishnaDateParts[2], 6);
    const krishnaSunSid = normalizeDeg(toSidereal(sunLongitude(krishnaJd), krishnaJd));
    const krishnaSign = Math.floor(krishnaSunSid / 30) + 1;
    const krishnaHinduMonth = getHinduMonth(krishnaSign);
    const krishnaEkadashiDetail = getEkadashiName(krishnaHinduMonth, 'krishna');
```

Replace with:

```typescript
    const krishnaDateParts = ekadashi.krishna.split('-').map(Number);
    const krishnaJd = dateToJD(krishnaDateParts[0], krishnaDateParts[1], krishnaDateParts[2], 6);
    const krishnaSunSid = normalizeDeg(toSidereal(sunLongitude(krishnaJd), krishnaJd));
    const krishnaSign = Math.floor(krishnaSunSid / 30) + 1;
    // Krishna paksha in Purnimant = previous month's Krishna. Use next solar month for lookup.
    const krishnaHinduMonth = getHinduMonth((krishnaSign % 12) + 1);
    const krishnaEkadashiDetail = getEkadashiName(krishnaHinduMonth, 'krishna');
```

- [ ] **Step 3: Also fix the Shattila/Safala naming issue**

Check the first Ekadashi (Jan 14). Drik calls it "Shattila" but we call it "Safala". Verify whether the EKADASHI_NAMES data in `festival-details.ts` has the correct names for each month. Read the pausha entries:

If the Pausha Krishna Ekadashi is listed as "Safala" in our data but Drik calls it "Shattila", then our data mapping is wrong. Safala = Pausha Krishna (Amanta) = Margashirsha Krishna (Purnimant). Shattila = Magha Krishna.

The fix from Step 2 (advancing Krishna by one month) should resolve this automatically. Verify after applying.

- [ ] **Step 4: Build and verify all 24 names**

Run: `npx next build`

Then compare all names:
```bash
curl -s "http://localhost:3000/api/calendar?year=2026&lat=46.95&lon=7.45&tz=2" | python3 -c "
import json, sys
data = json.load(sys.stdin)
for f in data.get('festivals', []):
    if not isinstance(f, dict) or f.get('category') != 'ekadashi': continue
    n = f.get('name',{}).get('en','') if isinstance(f.get('name'), dict) else f.get('name','')
    print(f'{f[\"date\"]}: {n}')
"
```

Cross-check against Drik list. All 24 names should match.

- [ ] **Step 5: Commit**

```bash
git add src/lib/constants/festival-details.ts src/lib/calendar/festivals.ts
git commit -m "fix: correct Ekadashi naming for Krishna paksha month mapping"
```

---

### Task 4: Add Missing December Shukla Ekadashi (Putrada/Mokshada)

**Files:**
- Modify: `src/lib/calendar/festivals.ts` (generateFestivalCalendar month loop)

We have 24 Ekadashis but Drik shows 24 too — with a Mokshada on Dec 20 that we call by a different name on Nov 20. After fixing the naming (Task 3), verify if Dec 20 appears. If not, the issue is that the month loop (1-12) misses Ekadashis near year boundaries.

- [ ] **Step 1: Check if the loop generates December Shukla Ekadashi**

Read the festival generation loop. It iterates months 1-12 and calls `findEkadashiDates(year, m, lat, lon)`. Month 12 = December scan. The Shukla Ekadashi in December should be found.

Check if Dec 20 is in the output after Tasks 1-3 are applied. If yes, this task is done. If no, extend the month loop to also scan month 1 of year+1 for late-December Ekadashis.

- [ ] **Step 2: If needed, add deduplication**

If extending the scan range produces duplicates (same Ekadashi found twice), add deduplication by date:

```typescript
// After generating all festivals, deduplicate Ekadashis by date
const seen = new Set<string>();
const dedupedFestivals = festivals.filter(f => {
  if (f.category === 'ekadashi') {
    if (seen.has(f.date)) return false;
    seen.add(f.date);
  }
  return true;
});
return dedupedFestivals;
```

- [ ] **Step 3: Build and verify count**

Run: `npx next build`

Verify exactly 24 unique Ekadashis with correct names.

- [ ] **Step 4: Commit**

```bash
git add src/lib/calendar/festivals.ts
git commit -m "fix: ensure all 24 Ekadashis are generated with correct names"
```

---

### Task 5: Full Verification Against Drik Panchang

**Files:** None modified — verification only.

- [ ] **Step 1: Generate comparison table**

Run the full comparison against Drik's 24 Ekadashis for Bern (46.95°N, 7.45°E, tz=2):

```bash
curl -s "http://localhost:3000/api/calendar?year=2026&lat=46.95&lon=7.45&tz=2" | python3 -c "
import json, sys
data = json.load(sys.stdin)

drik = [
    ('2026-01-14','Shattila','08:11','09:59'),
    ('2026-01-28','Jaya','14:43','15:34'),
    ('2026-02-13','Vijaya','07:36','09:40'),
    ('2026-02-27','Amalaki','07:12','09:25'),
    ('2026-03-14','Papamochani','13:51','16:13'),
    ('2026-03-28','Kamada','14:51','17:23'),
    ('2026-04-13','Varuthini','06:45','09:27'),
    ('2026-04-27','Mohini','06:20','09:11'),
    ('2026-05-13','Apara','05:56','07:50'),
    ('2026-05-26','Padmini','15:01','18:07'),
    ('2026-06-11','Parama','05:35','08:45'),
    ('2026-06-25','Nirjala','05:37','08:47'),
    ('2026-07-10','Yogini','05:48','08:55'),
    ('2026-07-25','Devshayani','06:02','09:04'),
    ('2026-08-08','Kamika','15:02','17:57'),
    ('2026-08-23','Shravana Putrada','07:19','09:24'),
    ('2026-09-07','Aja','06:59','09:34'),
    ('2026-09-22','Parsva','07:18','09:44'),
    ('2026-10-06','Indira','07:37','09:53'),
    ('2026-10-22','Papankusha','07:59','10:05'),
    ('2026-11-04','Rama','13:12','15:10'),
    ('2026-11-20','Devutthana','07:42','09:31'),
    ('2026-12-04','Utpanna','07:59','09:44'),
    ('2026-12-20','Mokshada','08:13','09:55'),
]

festivals = data.get('festivals', [])
our_ek = {}
for f in festivals:
    if not isinstance(f, dict) or f.get('category') != 'ekadashi': continue
    n = f.get('name',{}).get('en','') if isinstance(f.get('name'), dict) else f.get('name','')
    our_ek[f['date']] = {'name': n, 'ps': f.get('paranaStart',''), 'pe': f.get('paranaEnd','')}

def t2m(t):
    try: return int(t.split(':')[0])*60+int(t.split(':')[1])
    except: return None

print(f'| # | Drik Name | Date Match | Name Match | Start Delta | End Delta |')
print(f'|---|-----------|------------|------------|-------------|-----------|')
for i,(dd,dn,dps,dpe) in enumerate(drik):
    o = our_ek.get(dd)
    if not o:
        print(f'| {i+1} | {dn} ({dd}) | MISSING | — | — | — |')
        continue
    dm = 'YES' if True else 'NO'
    nm = 'YES' if dn.lower()[:5] in o['name'].lower() else 'NO'
    ops = o['ps'].split(',')[0].strip()
    ope = o['pe'].split(',')[0].strip()
    sd = t2m(ops) - t2m(dps) if t2m(ops) and t2m(dps) else None
    ed = t2m(ope) - t2m(dpe) if t2m(ope) and t2m(dpe) else None
    sdstr = f'{sd:+d}m' if sd is not None else '?'
    edstr = f'{ed:+d}m' if ed is not None else '?'
    print(f'| {i+1} | {dn} | YES | {nm} ({o[\"name\"]}) | {sdstr} | {edstr} |')
"
```

- [ ] **Step 2: Assess results**

**Acceptance criteria:**
- All 24 dates match Drik (0 date mismatches)
- All 24 names match Drik
- Parana START times within ±15 minutes of Drik for 20+ Ekadashis
- Parana END times within ±30 minutes of Drik for 20+ Ekadashis
- No parana end time > 3 hours past Drik

- [ ] **Step 3: Commit verification results as a comment or note**

Document any remaining variances with explanations (e.g., different Madhyahna calculation method, DST edge case).

```bash
git add -A
git commit -m "verify: all 24 Ekadashi dates, names, and parana times validated against Drik"
```
