// src/lib/kundali/health-diagnosis/weights.ts
//
// Per-element weight vectors for the health diagnosis engine (Phase A4).
//
// Each WeightVector is a Record<axisName, weight> whose values must sum to
// ~1.0 (tolerance ±0.05 for floating-point representation).  The named axes
// map directly onto the StrengthInputs fields collected in strength-inputs.ts.
//
// Named axes used across vectors:
//   sunShadbala        — Sun's normalised Shadbala ratio (0–100)
//   moonShadbala       — Moon's normalised Shadbala ratio (0–100)
//   marsShadbala       — Mars's normalised Shadbala (0–100)
//   mercuryShadbala    — Mercury's normalised Shadbala (0–100)
//   jupiterShadbala    — Jupiter's normalised Shadbala (0–100)
//   venusShadbala      — Venus's normalised Shadbala (0–100)
//   saturnShadbala     — Saturn's normalised Shadbala (0–100)
//   lagnaLordDignity   — Lagna lord's dignity score (0–100)
//   lagnaLordShadbala  — Lagna lord's Shadbala (0–100)
//   eighthLordDignity  — 8th-house lord's dignity score (0–100)
//   eighthHouseBhavabala — 8th-house Bhavabala (0–100)
//   fourthHouseBhavabala — 4th-house Bhavabala (0–100)
//   fifthHouseBhavabala  — 5th-house Bhavabala (0–100)
//   sixthHouseBhavabala  — 6th-house Bhavabala (0–100)
//   twelfthHouseBhavabala — 12th-house Bhavabala (0–100)
//   aspectsOnMoon      — Composite aspect-quality score on Moon (0–100)
//   kemadrumaFlag      — Binary (0 or 100): 1 when Kemadruma yoga present
//   saturnAvastha      — Saturn's Baladi avastha as 0–100 strength
//   moonPakshaBala     — Moon's Paksha bala (0–100)
//   yogaSignatures     — Aggregate score from classical yoga detections
//
// When an axis is absent from an element's vector the element scorer treats
// it as weight 0.  No axis is silently omitted — the sum check below guards
// this at test time.

import type { ElementId } from './types';

/** Named axis → weight, summing to 1.0 (±0.05). */
export type WeightVector = Record<string, number>;

/**
 * Fallback used when an element has no bespoke entry in ELEMENT_WEIGHTS.
 * Four general axes weighted evenly.
 */
export const DEFAULT_WEIGHTS: WeightVector = {
  lagnaLordDignity:   0.30,
  lagnaLordShadbala:  0.30,
  eighthHouseBhavabala: 0.20,
  yogaSignatures:     0.20,
  // sum = 1.00
};

/**
 * Element-specific weight vectors.  All 22 ElementId values must have an
 * entry here (the test in __tests__/weights.test.ts enforces this).
 *
 * Design principle: axes named in §4's "Strength inputs" list for the element
 * receive the highest weights.  House Bhavabala and yoga signatures appear in
 * every vector with smaller but non-zero weights to ensure no axis is ignored.
 */
export const ELEMENT_WEIGHTS: Partial<Record<ElementId, WeightVector>> = {
  // ── 4.1  Vitality / Lifespan ──────────────────────────────────────────────
  vitality: {
    sunShadbala:          0.20, // [BPHS-4] Sun = jiva-shakti
    lagnaLordDignity:     0.15,
    lagnaLordShadbala:    0.10,
    eighthLordDignity:    0.15, // strong 8th lord = long life [Phala-Deepika-9]
    saturnAvastha:        0.10, // yuva Saturn grants longevity
    eighthHouseBhavabala: 0.10,
    lagnaHouseBhavabala:  0.10, // lagna bhava strength as proxy for bodily frame
    yogaSignatures:       0.10,
    // sum = 1.00
  },

  // ── 4.2  Mental Health ────────────────────────────────────────────────────
  mental: {
    moonShadbala:         0.25, // Moon = manas karaka [BPHS-4]
    moonPakshaBala:       0.10,
    mercuryShadbala:      0.10, // cognition
    aspectsOnMoon:        0.15, // Saturn/Mars/Rahu aspects are high-risk signals
    fourthHouseBhavabala: 0.10, // chitta / settledness [BPHS-12]
    kemadrumaFlag:        0.10, // mental isolation yoga [BPHS-Kemadruma]
    yogaSignatures:       0.10, // Adhi, Pisaca, Grahan etc.
    fifthHouseBhavabala:  0.10, // buddhi house
    // sum = 1.00
  },

  // ── 4.3  Digestive System ─────────────────────────────────────────────────
  digestive: {
    sunShadbala:          0.20, // jatharagni [Charaka-Sutra]
    marsShadbala:         0.15, // pitta agni
    mercuryShadbala:      0.10, // intestinal absorption
    fifthHouseBhavabala:  0.15, // stomach/upper GI [BPHS-12]
    sixthHouseBhavabala:  0.15, // lower GI / disease [BPHS-24]
    yogaSignatures:       0.15, // chronic digestive patterns, Mahodara
    moonShadbala:         0.10, // stomach fluids
    // sum = 1.00
  },

  // ── 4.4  Cardiac / Circulatory ────────────────────────────────────────────
  cardiac: {
    sunShadbala:          0.25, // Sun rules the heart [BPHS-4]
    fourthHouseBhavabala: 0.20, // hridaya house [BPHS-12]
    marsShadbala:         0.15, // blood pressure, acute events
    moonShadbala:         0.10, // rasa dhatu / blood plasma
    yogaSignatures:       0.15, // cardiac risk patterns
    lagnaLordShadbala:    0.05,
    lagnaLordDignity:     0.05,
    eighthHouseBhavabala: 0.05, // chronic heart disease linkage
    // sum = 1.00
  },

  // ── 4.5  Respiratory System ───────────────────────────────────────────────
  respiratory: {
    mercuryShadbala:      0.25, // Mercury rules pulmonary vessels [Saravali-5]
    saturnShadbala:       0.15, // chronic obstructive conditions
    thirdHouseBhavabala:  0.20, // chest/lungs [BPHS-12]
    fourthHouseBhavabala: 0.10, // pleural cavity
    jupiterShadbala:      0.10, // immunity protection
    yogaSignatures:       0.15, // Saturn-Mercury aspect = chronic asthma
    lagnaLordDignity:     0.05,
    // sum = 1.00
  },

  // ── 4.6  Nervous System ───────────────────────────────────────────────────
  nervous: {
    mercuryShadbala:      0.25, // nervous signal karaka [Saravali]
    saturnShadbala:       0.20, // Vata aggravation
    rahuPlacement:        0.15, // uncontrolled nerve responses
    lagnaHouseBhavabala:  0.10, // overall nervous tone
    thirdHouseBhavabala:  0.10, // peripheral nerves (arms)
    yogaSignatures:       0.10, // Mercury-Saturn in Lagna etc.
    moonShadbala:         0.10, // moon-combust nervous linkage
    // sum = 1.00
  },

  // ── 4.7  Bones / Joints / Skeletal ───────────────────────────────────────
  skeletal: {
    saturnShadbala:       0.25, // asthi karaka [BPHS-4]
    saturnAvastha:        0.15,
    sunShadbala:          0.15, // skeletal frame vitality
    tenthHouseBhavabala:  0.20, // knees / spine [BPHS-12]
    eighthHouseBhavabala: 0.10, // chronic joint issues
    yogaSignatures:       0.15, // Sade Sati, Mars-Saturn in 10th
    // sum = 1.00
  },

  // ── 4.8  Muscular / Inflammation ──────────────────────────────────────────
  muscular: {
    marsShadbala:         0.30, // mamsa karaka [BPHS-4]
    sunShadbala:          0.15, // heat / vitality
    rahuPlacement:        0.10, // unexplained inflammation
    thirdHouseBhavabala:  0.15, // muscular strength of arms
    sixthHouseBhavabala:  0.15, // acute inflammation / disease house
    yogaSignatures:       0.15, // Mars-combust + 6th malefic, Mars-Rahu
    // sum = 1.00
  },

  // ── 4.9  Skin & Hair ──────────────────────────────────────────────────────
  skin: {
    mercuryShadbala:      0.20, // twak karaka [Saravali-5]
    venusShadbala:        0.20, // lustre, hair quality
    saturnShadbala:       0.15, // chronic skin disease
    marsShadbala:         0.10, // acne / eruptions
    sixthHouseBhavabala:  0.15, // skin diseases generally [BPHS-24]
    eighthHouseBhavabala: 0.10, // chronic skin disease
    yogaSignatures:       0.10, // Mercury+Saturn in 6th etc.
    // sum = 1.00
  },

  // ── 4.10 Eyes / Vision ────────────────────────────────────────────────────
  eyes: {
    sunShadbala:          0.20, // right/left eye [BPHS-12]
    moonShadbala:         0.20, // opposite eye
    secondHouseBhavabala: 0.15, // right eye house [BPHS-12]
    twelfthHouseBhavabala:0.15, // left eye house
    sixthHouseBhavabala:  0.10, // eye disease house
    yogaSignatures:       0.15, // Andhya yoga, Sun in 12th with malefic
    venusShadbala:        0.05, // eye lustre
    // sum = 1.00
  },

  // ── 4.11 Reproductive / Sexual Health ────────────────────────────────────
  reproductive: {
    venusShadbala:        0.25, // shukra karaka [BPHS-4]
    marsShadbala:         0.15, // menstruation / vigour
    moonShadbala:         0.10, // hormonal cycles
    jupiterShadbala:      0.10, // fertility (putra-karaka)
    seventhHouseBhavabala:0.20, // genitals [BPHS-12]
    eighthHouseBhavabala: 0.05, // chronic reproductive disease
    yogaSignatures:       0.15, // Urogenital pattern, Mars-in-7th
    // sum = 1.00
  },

  // ── 4.12 Endocrine / Hormonal  (Inferential) ──────────────────────────────
  endocrine: {
    jupiterShadbala:      0.30, // pancreas / medha karaka [Jataka-Parijata-5]
    venusShadbala:        0.20, // hormonal balance
    moonShadbala:         0.15, // cyclical hormones
    fifthHouseBhavabala:  0.20, // pancreas (Jupiter's karaka house)
    yogaSignatures:       0.15, // Jupiter debilitated in 5/6
    // sum = 1.00
  },

  // ── 4.13 Immunity / Ojas ─────────────────────────────────────────────────
  immunity: {
    jupiterShadbala:      0.30, // ojas karaka [Charaka-Sutra]
    sunShadbala:          0.15, // agni → ojas
    lagnaLordDignity:     0.15, // sharira-bala
    lagnaLordShadbala:    0.10,
    lagnaHouseBhavabala:  0.10, // body's defence frame
    eighthHouseBhavabala: 0.10, // depletion (inverted: strong 8th = good)
    yogaSignatures:       0.10, // Jupiter in dusthana, Sade Sati
    // sum = 1.00
  },

  // ── 4.14 Chronic / Hidden Disease (Gupta Roga) ───────────────────────────
  chronic: {
    eighthHouseBhavabala: 0.25, // gupta roga sthana [BPHS-24]
    eighthLordDignity:    0.20,
    saturnShadbala:       0.20, // chronicity karaka [BPHS-4]
    rahuPlacement:        0.15, // mysterious / undiagnosable
    twelfthHouseBhavabala:0.10, // hospitalisation
    yogaSignatures:       0.10, // Ketu in 8th with Mars
    // sum = 1.00
  },

  // ── 4.15 Accidents / Injuries ────────────────────────────────────────────
  accidents: {
    marsShadbala:         0.30, // accident karaka [BPHS-4]
    rahuPlacement:        0.20, // vehicular / electric accidents
    eighthHouseBhavabala: 0.20, // sudden trauma house
    fourthHouseBhavabala: 0.10, // vehicles
    yogaSignatures:       0.20, // Mars+Rahu in 8th/4th, Mars-Saturn opposition
    // sum = 1.00
  },

  // ── 4.16 Surgery / Hospitalisation ───────────────────────────────────────
  surgery: {
    marsShadbala:         0.25, // the surgeon / the knife
    saturnShadbala:       0.15, // chronic hospitalisation
    eighthHouseBhavabala: 0.25, // surgical event house
    twelfthHouseBhavabala:0.20, // hospitalisation / confinement
    yogaSignatures:       0.15, // Mars-Saturn in 8th, 12L in 6th
    // sum = 1.00
  },

  // ── 4.17 Psychiatric / Severe Mental Illness  (disclaimer-gated) ─────────
  psychiatric: {
    moonShadbala:         0.20, // Moon affliction [BPHS-4]
    rahuPlacement:        0.20, // delusions / paranoia
    mercuryShadbala:      0.15, // cognitive break
    fourthHouseBhavabala: 0.10, // chitta
    fifthHouseBhavabala:  0.10, // buddhi-bhrama
    twelfthHouseBhavabala:0.10, // subconscious imbalance
    yogaSignatures:       0.15, // Pisaca yoga, Buddhi-bhrama yoga
    // sum = 1.00
  },

  // ── 4.18 Addictions / Substance Vulnerability ────────────────────────────
  addictions: {
    rahuPlacement:        0.25, // primary addiction karaka [Saravali]
    moonShadbala:         0.15, // emotional / sentiment-driven addiction
    marsShadbala:         0.10, // impulsive addiction
    venusShadbala:        0.10, // pleasure-seeking
    twelfthHouseBhavabala:0.15, // foreign substances, escapism [BPHS-12]
    sixthHouseBhavabala:  0.10, // vices
    eighthHouseBhavabala: 0.05, // hidden addictions
    yogaSignatures:       0.10, // Moon-Rahu in 12th, Venus-Mars-Rahu
    // sum = 1.00
  },

  // ── 4.19 Sleep / Dreams ───────────────────────────────────────────────────
  sleep: {
    moonShadbala:         0.20, // sleep itself [BPHS]
    moonPakshaBala:       0.15, // waning Moon = sleep difficulty
    saturnShadbala:       0.15, // sleep disruption
    twelfthHouseBhavabala:0.25, // shayya sukha [BPHS-12]
    yogaSignatures:       0.15, // Moon-Saturn opposition, Ketu in 12th
    mercuryShadbala:      0.10, // mental chatter blocking sleep
    // sum = 1.00
  },

  // ── 4.20 Allergies / Autoimmune  (opt-in, Inferential) ───────────────────
  allergies: {
    rahuPlacement:        0.30, // foreign-substance reaction [Bhrigu-Samhita]
    mercuryShadbala:      0.20, // sensitivity of skin and nerves
    ketuPlacement:        0.15, // autoimmune (body attacking itself)
    sixthHouseBhavabala:  0.20, // immune disease house
    lagnaHouseBhavabala:  0.05, // overall sensitivity tone
    yogaSignatures:       0.10, // Rahu in 6th, Mercury-debil + Rahu aspect
    // sum = 1.00
  },

  // ── 4.21 Cancer / Tumour  (opt-in, mixed Classical + Inferential) ────────
  cancer: {
    saturnShadbala:       0.20, // chronic-cellular-degeneration [Saravali]
    rahuPlacement:        0.20, // unnatural growth
    marsShadbala:         0.15, // acute malignant transition
    eighthHouseBhavabala: 0.20, // malignancy house
    sixthHouseBhavabala:  0.10, // disease house
    lagnaHouseBhavabala:  0.05, // lagna-in-dusthana risk factor
    yogaSignatures:       0.10, // Saturn+Rahu conjunction/7th aspect
    // sum = 1.00
  },

  // ── 4.22 Longevity / Maraka windows  (opt-in, Classical) ─────────────────
  longevity: {
    saturnAvastha:        0.20, // Ayur karaka [BPHS-Ayur]
    eighthLordDignity:    0.25, // 8th lord = Ayur sthana lord
    eighthHouseBhavabala: 0.15,
    lagnaLordDignity:     0.15, // lagna vs 8th lord comparison
    lagnaLordShadbala:    0.10,
    yogaSignatures:       0.15, // Pinda / Amsha / Naisargika Ayurdaya
    // sum = 1.00
  },
};

/**
 * Returns the WeightVector for the given ElementId.
 * Falls back to DEFAULT_WEIGHTS if no specific vector is defined.
 * The fallback path is legitimate but should not normally be reached
 * since ELEMENT_WEIGHTS covers all 22 ElementIds — tests assert this.
 */
export function weightVectorForElement(id: ElementId): WeightVector {
  return ELEMENT_WEIGHTS[id] ?? DEFAULT_WEIGHTS;
}
