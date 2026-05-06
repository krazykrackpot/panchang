# Muhurta Nakshatra Audit — May 2026

## Sources Consulted
- ChatGPT classical muhurta analysis (strict filter model)
- Gemini corrected per-activity lists
- Our existing activity-rules-extended.ts
- Classical references: Muhurta Chintamani (MC), B.V. Raman Muhurtha, Jyotirnibandha

## Core Design Flaw Identified

**Old logic**: "If not explicitly forbidden → allow"
**Classical logic**: "If not explicitly permitted → reject"

This inversion caused Ardra (6), Bharani (2), and Krittika (3) to appear in goodNakshatras
for 15/20 activities. All three are Tikshna/Ugra and should only be good for
destruction, surgery, litigation, or intense spiritual practice.

## Nakshatra Nature Reference

| ID | Name | Nature | Deity | Classical Use |
|----|------|--------|-------|---------------|
| 1 | Ashwini | Kshipra (swift) | Ashwini Kumaras | Medicine, travel, quick actions |
| 2 | Bharani | Tikshna (sharp) | Yama | Discipline, legal, destruction — NOT gentle activities |
| 3 | Krittika | Ugra (fierce) | Agni | Cutting, purification, fire rituals — NOT stability activities |
| 4 | Rohini | Sthira (fixed) | Brahma | Growth, business, property, marriage — UNIVERSALLY GOOD |
| 5 | Mrigashira | Mrdu (soft) | Soma | Travel, search, learning, marriage |
| 6 | Ardra | Tikshna (sharp) | Rudra | Surgery, medicine, litigation, tapas ONLY |
| 7 | Punarvasu | Chara (movable) | Aditi | Restart, business, travel, education |
| 8 | Pushya | Laghu (light) | Brihaspati | BEST universal nakshatra — good for almost everything |
| 9 | Ashlesha | Tikshna (sharp) | Sarpa | Surgery, occult, binding — AVOID for most activities |
| 10 | Magha | Ugra (fierce) | Pitris | Ancestral rites, authority — NOT for gentle starts |
| 11 | P.Phalguni | Ugra (fierce) | Bhaga | Pleasure, arts — NOT for serious commitments |
| 12 | U.Phalguni | Sthira (fixed) | Aryaman | Marriage, business, property — UNIVERSALLY GOOD |
| 13 | Hasta | Kshipra (swift) | Savita | Skilled work, business, education — UNIVERSALLY GOOD |
| 14 | Chitra | Mrdu (soft) | Tvashta | Creative work, business, decoration |
| 15 | Swati | Chara (movable) | Vayu | Travel, trade, education — conditional for stability |
| 16 | Vishakha | Mishra (mixed) | Indra-Agni | Split energy — avoid for marriage, conditional elsewhere |
| 17 | Anuradha | Mrdu (soft) | Mitra | Friendship, business, marriage — GOOD |
| 18 | Jyeshtha | Tikshna (sharp) | Indra | Authority, protection — AVOID for samskaras |
| 19 | Mula | Tikshna (sharp) | Nirrti | Destruction, uprooting — AVOID for most starts |
| 20 | P.Ashadha | Ugra (fierce) | Apas | Purification — limited use |
| 21 | U.Ashadha | Sthira (fixed) | Vishve Devas | Victory, commitment — GOOD for stability activities |
| 22 | Shravana | Chara (movable) | Vishnu | Learning, business, travel — GOOD |
| 23 | Dhanishtha | Chara (movable) | Vasus | Wealth, travel — conditional (volatile) |
| 24 | Shatabhisha | Chara (movable) | Varuna | Healing — conditional, NOT for business/commerce |
| 25 | P.Bhadrapada | Ugra (fierce) | Aja Ekapada | Fierce transformation — limited use |
| 26 | U.Bhadrapada | Sthira (fixed) | Ahir Budhnya | Deep wisdom, property — GOOD for stability |
| 27 | Revati | Mrdu (soft) | Pushan | Travel, completion, marriage — UNIVERSALLY GOOD |

## Proposed Corrected Lists

### Agreement across all sources (ChatGPT + Gemini + Classical):

#### marriage
- **Good**: 4, 5, 7, 8, 12, 13, 14, 15, 17, 21, 22, 23, 26, 27
- **Avoid**: 1, 2, 3, 9, 10, 11, 16, 18, 19, 20, 24, 25
- **Hard Avoid**: 6, 9, 16, 18

#### griha_pravesh
- **Good**: 4, 7, 8, 12, 13, 14, 17, 21, 22, 26, 27
- **Avoid**: 1, 2, 3, 5, 6, 9, 11, 15, 16, 18, 19, 20, 23, 24, 25
- **Hard Avoid**: 6, 9, 16, 18

#### mundan
- **Good**: 1, 4, 5, 7, 8, 13, 14, 15, 22, 23, 24, 27
- **Avoid**: 2, 3, 6, 9, 10, 11, 16, 17, 18, 19, 20, 25, 26
- **Hard Avoid**: 6, 9

#### vehicle
- **Good**: 1, 4, 5, 7, 8, 12, 13, 14, 15, 17, 21, 22, 23, 24, 26, 27
- **Avoid**: 2, 3, 6, 9, 10, 11, 16, 18, 19, 20, 25
- **Hard Avoid**: 9, 18

#### travel
- **Good**: 1, 4, 5, 7, 8, 12, 13, 14, 15, 17, 22, 23, 27
- **Avoid**: 2, 3, 6, 9, 10, 11, 16, 18, 19, 20, 21, 24, 25, 26
- **Hard Avoid**: 6, 9

#### property
- **Good**: 4, 8, 12, 13, 17, 21, 22, 26, 27
- **Avoid**: 1, 2, 3, 5, 6, 7, 9, 10, 11, 14, 15, 16, 18, 19, 20, 23, 24, 25
- **Hard Avoid**: 6

#### business
- **Good**: 4, 7, 8, 12, 13, 14, 17, 22, 27
- **Avoid**: 1, 2, 3, 5, 6, 9, 10, 11, 15, 16, 18, 19, 20, 21, 23, 24, 25, 26
- **Hard Avoid**: 6, 9

#### education
- **Good**: 1, 4, 5, 7, 8, 12, 13, 15, 17, 22, 23, 27
- **Avoid**: 2, 3, 6, 9, 10, 11, 14, 16, 18, 19, 20, 21, 24, 25, 26
- **Hard Avoid**: 9

#### namakarana
- **Good**: 1, 4, 5, 7, 8, 12, 13, 14, 15, 17, 21, 22, 23, 24, 26, 27
- **Avoid**: 2, 3, 6, 9, 10, 11, 16, 18, 19, 20, 25
- **Hard Avoid**: 9

#### upanayana
- **Good**: 1, 4, 5, 7, 8, 12, 13, 14, 15, 17, 22, 27
- **Avoid**: 2, 3, 6, 9, 10, 11, 16, 18, 19, 20, 21, 23, 24, 25, 26
- **Hard Avoid**: 6

#### engagement
- **Good**: 4, 5, 7, 8, 12, 13, 14, 15, 17, 21, 22, 26, 27
- **Avoid**: 1, 2, 3, 6, 9, 10, 11, 16, 18, 19, 20, 23, 24, 25
- **Hard Avoid**: 6

#### gold_purchase
- **Good**: 4, 7, 8, 12, 13, 17, 21, 22, 26, 27
- **Avoid**: 1, 2, 3, 5, 6, 9, 10, 11, 14, 15, 16, 18, 19, 20, 23, 24, 25
- **Hard Avoid**: 6

#### medical_treatment
- **Good**: 1, 4, 6, 7, 8, 13, 15, 17, 22, 24, 27
- **Avoid**: 2, 3, 5, 9, 10, 11, 12, 14, 16, 18, 19, 20, 21, 23, 25, 26
- **Note**: Ardra (6) correct here — Rudra is the Celestial Physician

#### court_case
- **Good**: 1, 2, 3, 6, 8, 13, 14, 18, 19
- **Avoid**: 4, 5, 7, 9, 10, 11, 12, 15, 16, 17, 20, 21, 22, 23, 24, 25, 26, 27
- **Note**: Fierce/Tikshna nakshatras actually HELP in litigation

#### exam
- **Good**: 1, 4, 5, 7, 8, 12, 13, 15, 17, 22, 23, 27
- **Avoid**: 2, 3, 6, 9, 10, 11, 14, 16, 18, 19, 20, 21, 24, 25, 26
- **Hard Avoid**: 9

#### spiritual_practice
- **Good**: 1, 2, 3, 6, 7, 8, 12, 13, 14, 17, 19, 20, 21, 22, 25, 27
- **Avoid**: 5, 9, 10, 11, 15, 16, 18, 23, 24, 26
- **Note**: Tikshna nakshatras are valid for intense tapas/sadhana

#### agriculture
- **Good**: 4, 8, 12, 13, 17, 21, 22, 26, 27
- **Avoid**: 1, 2, 3, 5, 6, 7, 9, 10, 11, 14, 15, 16, 18, 19, 20, 23, 24, 25
- **Hard Avoid**: 6

#### financial_signing
- **Good**: 4, 5, 8, 12, 13, 17, 21, 22, 26, 27
- **Avoid**: 1, 2, 3, 6, 7, 9, 10, 11, 14, 15, 16, 18, 19, 20, 23, 24, 25
- **Hard Avoid**: 2, 6

#### surgery
- **Good**: 1, 6, 8, 9, 10, 13, 18, 19
- **Avoid**: 4, 5, 7, 11, 12, 14, 15, 16, 17, 20, 21, 22, 23, 24, 25, 26, 27
- **Note**: Tikshna/Ugra nakshatras are CORRECT for surgery

#### relocation
- **Good**: 4, 5, 7, 8, 12, 13, 15, 17, 22, 23, 27
- **Avoid**: 1, 2, 3, 6, 9, 10, 11, 14, 16, 18, 19, 20, 21, 24, 25, 26
- **Hard Avoid**: 6

## Points of Discussion

1. **Dhanishtha (23) for business**: Gemini includes it, our original had it avoided.
   Classically Chara nakshatra good for wealth. Include with caution?

2. **Swati (15) for business**: Gemini excludes, some sources include.
   Vayu energy = independent but unstable. Exclude for safety.

3. **Chitra (14) for financial_signing**: Gemini excludes. Creative not financial.
   Exclude for contracts, keep for business (creative ventures).

4. **Court case list**: Radically different from generic template.
   Fierce nakshatras HELP in litigation — this is a complete inversion.

5. **Surgery list**: Only 8 nakshatras. Correct — surgery needs sharp energy.

## Status
- [ ] User to review and approve proposed lists
- [ ] Implement approved lists in activity-rules-extended.ts
- [ ] Re-run muhurta scan to verify results match classical expectations
