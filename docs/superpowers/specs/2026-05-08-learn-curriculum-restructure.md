# Learn Curriculum Restructure — 17 Phases, ~260 Modules

## Summary

Absorb all 143 standalone learn pages into the MODULE_SEQUENCE curriculum. No orphaned reference articles. Every learn page is a proper curriculum module with a phase assignment and module ID.

India's Contributions moves from Phase 11 to **Phase 1** (right after Pre-Foundation) — it's the hook that makes students proud and curious before diving into technical content.

## Phase Structure

### Phase 0: Pre-Foundation (11 modules)
*Existing:* 0-1 through 0-6
*Add:*
- `hindu-calendar`
- `panchang-guide`
- `cosmology` (was ref)
- `vedanga` (was ref)
- `observatories` (was ref)

### Phase 1: India's Contributions (27 modules) ← MOVED FROM 11
*Existing 13 modules (25-1 through 26-4) + absorb:*
- `contributions/zero`, `contributions/sine`, `contributions/pi`, `contributions/negative-numbers`
- `contributions/binary`, `contributions/fibonacci`, `contributions/calculus`, `contributions/pythagoras`
- `contributions/kerala-school`, `contributions/earth-rotation`, `contributions/gravity`
- `contributions/speed-of-light`, `contributions/cosmic-time`, `contributions/al-khwarizmi`
- `contributions/timeline`

Note: verify if contributions/ standalone pages duplicate the existing 13 modules or are separate content. Merge/redirect as needed.

### Phase 2: The Sky (25 modules) ← was Phase 1
*Existing 13 + absorb all graha deep-dives:*
- `surya`, `chandra`, `mangal`, `budha`, `guru`, `shukra`, `shani`, `rahu`, `ketu`
- `grahas` (was ref), `rashis` (was ref), `nakshatras` (was ref)

### Phase 3: Pancha Anga (26 modules) ← was Phase 2
*Existing 12 + absorb panchang topics:*
- `tithis`, `yogas`, `karanas`, `vara`, `hora`, `masa`, `muhurtas` (all were ref)
- `choghadiya`, `rahu-kaal`, `tarabalam`, `chandra-darshan`
- `panchak`, `holashtak`
- `amrit-siddhi-yoga`, `sarvartha-siddhi-yoga`, `guru-pushya-yoga`, `ravi-pushya-yoga`
- `dwipushkar-yoga`, `tripushkar-yoga`, `siddha-yoga`

### Phase 4: The Chart (28 modules) ← was Phase 3
*Existing 17 + absorb:*
- `lagna`, `bhavas`, `birth-chart`, `patrika`, `kundali`
- `planets`, `planet-in-house`, `planet-in-house/[slug]` (was ref)
- `bhava-chalit`, `dashas`, `transit-guide`, `sade-sati` (was ref)
- `vargas`, `nadi-amsha`

### Phase 5: Applied Jyotish (23 modules) ← was Phase 4
*Existing 9 + absorb:*
- `matching`, `compatibility`, `gun-milan`, `compatibility-advanced` (was ref)
- `doshas`, `doshas-detailed`, `kaal-sarp`, `mangal-dosha`
- `career`, `marriage`, `wealth`, `health`, `children` (was ref)
- `remedies` (was ref)

### Phase 6: Classical Knowledge (18 modules) ← was Phase 5
*Existing 12 + absorb:*
- `shadbala`, `bhavabala`, `avasthas`, `sphutas` (was ref)
- `ashtakavarga`, `ashtakavarga-dasha` (was ref)
- `advanced`, `advanced-houses`, `calculations` (was ref)
- `classical-texts`, `library` (was ref)

### Phase 7: Jaimini System (5 modules) ← was Phase 6
*Existing 4 + promote:*
- `jaimini` (was ref), `argala` (was ref)

### Phase 8: KP System (5 modules) ← was Phase 7
*Existing 4 + absorb:*
- `kp-system`

### Phase 9: Varshaphal (6 modules) ← was Phase 8
*Existing 4 + absorb:*
- `varshaphal`, `tithi-pravesha`

### Phase 10: Astronomy Engine (12 modules) ← was Phase 9
*Existing 6 + absorb:*
- `labs/panchang`, `labs/moon`, `labs/shadbala`, `labs/dasha`, `labs/kp`
- `ayanamsha`, `retrograde-effects`, `combustion` (was ref)
- `planetary-cycles`

### Phase 11: Advanced Prediction (11 modules) ← was Phase 10
*Existing 6 + absorb:*
- `eclipses`, `grahan-yoga` (was ref)
- `gochar`, `transits`, `transits/[slug]`
- `dasha-sandhi`, `tippanni`

### Phase 12: Festival Calendar Science (6 modules) ← was Phase 12
*Existing 3 + promote refs:*
- `adhika-masa`, `festival-rules`, `smarta-vaishnava` (was ref)

### Phase 13: Prashna & Medical (7 modules) ← was Phase 13
*Existing 4 + absorb:*
- `prashna`, `ayurveda-jyotish`, `pancha-pakshi`

### Phase 14: Classical Mastery (6 modules) ← was Phase 14
*Existing 4 + absorb:*
- `muhurta-selection`, `vivah-muhurta`

### Phase 15: Rashi Deep Dives (12 modules) ← NEW
- `mesha`, `vrishabha`, `mithuna`, `karka`, `simha`, `kanya`
- `tula`, `vrishchika`, `dhanu`, `makara`, `kumbha`, `meena`

### Phase 16: Special Topics (8 modules) ← NEW
- `caesarean-muhurta`, `nakshatra-baby-names`
- `nakshatra-pada`, `nakshatra-pada/[slug]`
- `retrograde-visualizer`, `yoga-animator`

## Excluded (not modules)
- `dashboard` — UI page
- `track/cosmology`, `track/kundali`, `track/panchang` — learning track meta-navigation
- `page.tsx` — learn index page

## Implementation
Only file to change: `src/lib/learn/module-sequence.ts`
- Renumber all phase assignments
- Add ~143 new module entries with proper IDs
- Remove all `ref:` entries (promote to curriculum)
- Update PHASE_INFO titles and phase numbers
- The learn pages themselves don't need to change — they render independently of the module system

## Result
- **~260 curriculum modules** across **17 phases**
- Zero orphaned pages
- India's Contributions as Phase 1 hooks students with pride before the technical grind
- Every standalone learn page reachable via the learning path sidebar
