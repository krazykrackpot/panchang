/**
 * Yoga Interaction Engine (G4)
 *
 * Post-processing pass that detects three categories of yoga-to-yoga interactions:
 *   B. Cluster detection — 2+ yogas in same group amplify each other
 *   A. Same-planet conflicts — planet in both auspicious + inauspicious yoga
 *   C. Cross-yoga cancellation — opposing yoga pairs neutralise each other
 *
 * Runs AFTER individual yoga evaluation. Mutates EvaluatedYoga[] in-place
 * (attaches interactions[], adjusts strength).
 *
 * Execution order: cluster → conflict → cancellation (spec §5).
 */

import type { EvaluatedYoga, YogaInteraction, YogaContext, YogaGroup } from './types';

// Planet ID → English name for descriptions
const P_EN: Record<number, string> = {
  0: 'Sun', 1: 'Moon', 2: 'Mars', 3: 'Mercury', 4: 'Jupiter', 5: 'Venus', 6: 'Saturn',
};
const P_HI: Record<number, string> = {
  0: 'सूर्य', 1: 'चन्द्र', 2: 'मंगल', 3: 'बुध', 4: 'बृहस्पति', 5: 'शुक्र', 6: 'शनि',
};

// Groups that classically amplify each other when clustered
const CLUSTER_GROUPS: Set<YogaGroup> = new Set(['raja', 'dhana', 'mahapurusha']);

// Strength tier helpers
type Strength = 'Strong' | 'Moderate' | 'Weak';
const STRENGTH_ORDER: Strength[] = ['Weak', 'Moderate', 'Strong'];

function boostStrength(s: Strength): Strength {
  const idx = STRENGTH_ORDER.indexOf(s);
  return idx < 2 ? STRENGTH_ORDER[idx + 1] : 'Strong';
}

function weakenStrength(s: Strength): Strength {
  const idx = STRENGTH_ORDER.indexOf(s);
  return idx > 0 ? STRENGTH_ORDER[idx - 1] : 'Weak';
}

function addInteraction(yoga: EvaluatedYoga, interaction: YogaInteraction): void {
  if (!yoga.interactions) yoga.interactions = [];
  yoga.interactions.push(interaction);
}

// ─────────────────────────────────────────────────────────────────────────────
// B: Cluster Detection
// ─────────────────────────────────────────────────────────────────────────────

const GROUP_LABELS_EN: Partial<Record<YogaGroup, string>> = {
  raja: 'Raja Yoga', dhana: 'Dhana Yoga', mahapurusha: 'Mahapurusha Yoga',
};
const GROUP_LABELS_HI: Partial<Record<YogaGroup, string>> = {
  raja: 'राज योग', dhana: 'धन योग', mahapurusha: 'महापुरुष योग',
};

function detectClusters(yogas: EvaluatedYoga[]): void {
  // Group present yogas by their group
  const groupMap = new Map<YogaGroup, EvaluatedYoga[]>();
  for (const y of yogas) {
    // Only cluster auspicious yogas — daridra (group=dhana, isAuspicious=false) should NOT cluster with dhana
    if (!y.present || !y.isAuspicious || !CLUSTER_GROUPS.has(y.group)) continue;
    const list = groupMap.get(y.group) ?? [];
    list.push(y);
    groupMap.set(y.group, list);
  }

  for (const [group, members] of groupMap) {
    if (members.length < 2) continue;

    const count = members.length;
    const groupEn = GROUP_LABELS_EN[group] ?? group;
    const groupHi = GROUP_LABELS_HI[group] ?? group;
    const otherIds = (y: EvaluatedYoga) => members.filter(m => m.id !== y.id).map(m => m.id);

    if (count === 2) {
      // Boost the weakest by 1 tier. If tied, boost the first.
      const sorted = [...members].sort(
        (a, b) => STRENGTH_ORDER.indexOf(a.strength) - STRENGTH_ORDER.indexOf(b.strength)
      );
      const weakest = sorted[0];
      if (weakest.strength !== 'Strong') {
        weakest.strength = boostStrength(weakest.strength);
        addInteraction(weakest, {
          type: 'cluster_boost',
          relatedYogaIds: otherIds(weakest),
          effect: 'amplified',
          description: {
            en: `Part of a ${count}-yoga ${groupEn} cluster — amplified by mutual reinforcement`,
            hi: `${count} ${groupHi} समूह का भाग — पारस्परिक प्रबलन से प्रवर्धित`,
          },
          strengthDelta: 1,
        });
      }
      // Add informational interaction to the other(s) without strength change
      for (const m of members) {
        if (m === weakest) continue;
        addInteraction(m, {
          type: 'cluster_boost',
          relatedYogaIds: otherIds(m),
          effect: 'amplified',
          description: {
            en: `Part of a ${count}-yoga ${groupEn} cluster`,
            hi: `${count} ${groupHi} समूह का भाग`,
          },
          strengthDelta: 0,
        });
      }
    } else {
      // 3+ in group: boost ALL non-Strong by 1 tier
      for (const m of members) {
        const delta = m.strength !== 'Strong' ? 1 : 0;
        if (delta === 1) {
          m.strength = boostStrength(m.strength);
        }
        addInteraction(m, {
          type: 'cluster_boost',
          relatedYogaIds: otherIds(m),
          effect: 'amplified',
          description: {
            en: `Part of a rare ${count}-yoga ${groupEn} cluster — significantly amplified`,
            hi: `दुर्लभ ${count} ${groupHi} समूह का भाग — अत्यधिक प्रवर्धित`,
          },
          strengthDelta: delta as 0 | 1,
        });
      }
    }
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// A: Same-Planet Conflicts
// ─────────────────────────────────────────────────────────────────────────────

function detectPlanetConflicts(yogas: EvaluatedYoga[]): void {
  // Build planet → yoga map (classical planets 0-6 only, present yogas only)
  const planetYogaMap = new Map<number, EvaluatedYoga[]>();
  for (const y of yogas) {
    if (!y.present) continue;
    for (const pid of y.involvedPlanets) {
      if (pid > 6) continue; // Exclude Rahu/Ketu — they appear in many yogas by nature
      const list = planetYogaMap.get(pid) ?? [];
      list.push(y);
      planetYogaMap.set(pid, list);
    }
  }

  // For each planet, check if it appears in both auspicious and inauspicious yogas
  for (const [pid, yogaList] of planetYogaMap) {
    const auspicious = yogaList.filter(y => y.isAuspicious);
    const inauspicious = yogaList.filter(y => !y.isAuspicious);

    if (auspicious.length === 0 || inauspicious.length === 0) continue;

    const planetEn = P_EN[pid] ?? `Planet ${pid}`;
    const planetHi = P_HI[pid] ?? `ग्रह ${pid}`;

    // Mark all involved yogas with the conflict (informational only)
    for (const ay of auspicious) {
      const conflictPartners = inauspicious.map(iy => iy.id);
      // Avoid duplicate interactions if this yoga already has a conflict with this planet
      const alreadyHas = ay.interactions?.some(
        i => i.type === 'planet_conflict' && i.relatedYogaIds.some(id => conflictPartners.includes(id))
      );
      if (alreadyHas) continue;

      addInteraction(ay, {
        type: 'planet_conflict',
        relatedYogaIds: conflictPartners,
        effect: 'conflicted',
        description: {
          en: `${planetEn} participates in both ${ay.name.en} and ${inauspicious.map(i => i.name.en).join(', ')} — effects are moderated`,
          hi: `${planetHi} ${ay.name.hi} और ${inauspicious.map(i => i.name.hi).join(', ')} दोनों में सहभागी — प्रभाव संयमित`,
        },
        strengthDelta: 0,
      });
    }

    for (const iy of inauspicious) {
      const conflictPartners = auspicious.map(ay => ay.id);
      const alreadyHas = iy.interactions?.some(
        i => i.type === 'planet_conflict' && i.relatedYogaIds.some(id => conflictPartners.includes(id))
      );
      if (alreadyHas) continue;

      addInteraction(iy, {
        type: 'planet_conflict',
        relatedYogaIds: conflictPartners,
        effect: 'conflicted',
        description: {
          en: `${planetEn} participates in both ${iy.name.en} and ${auspicious.map(a => a.name.en).join(', ')} — effects are moderated`,
          hi: `${planetHi} ${iy.name.hi} और ${auspicious.map(a => a.name.hi).join(', ')} दोनों में सहभागी — प्रभाव संयमित`,
        },
        strengthDelta: 0,
      });
    }
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// C: Cross-Yoga Cancellation
// ─────────────────────────────────────────────────────────────────────────────

/** Check if two yogas share at least one involved planet (classical 0-6 only). */
function sharesPlanet(a: EvaluatedYoga, b: EvaluatedYoga): number | null {
  for (const pid of a.involvedPlanets) {
    if (pid > 6) continue;
    if (b.involvedPlanets.includes(pid)) return pid;
  }
  return null;
}

/** Check if both yogas involve the 2nd or 11th house lord (dhana-daridra axis). */
function sharesDhanaAxis(a: EvaluatedYoga, b: EvaluatedYoga, ctx: YogaContext): number | null {
  const lord2 = ctx.houseLord(2);
  const lord11 = ctx.houseLord(11);
  for (const lord of [lord2, lord11]) {
    if (a.involvedPlanets.includes(lord) && b.involvedPlanets.includes(lord)) {
      return lord;
    }
  }
  return null;
}

function detectCrossCancellations(yogas: EvaluatedYoga[], ctx: YogaContext): void {
  const present = yogas.filter(y => y.present);
  // Daridra yogas are group='dhana' + isAuspicious=false (not a separate group)
  const dhana = present.filter(y => y.group === 'dhana' && y.isAuspicious);
  const daridra = present.filter(y => y.group === 'dhana' && !y.isAuspicious);
  const raja = present.filter(y => y.group === 'raja' && y.isAuspicious);
  const arishta = present.filter(y => y.group === 'arishta' && !y.isAuspicious);

  // Dhana vs Daridra — share a planet or dhana axis
  for (const dy of dhana) {
    for (const dr of daridra) {
      const sharedPid = sharesPlanet(dy, dr) ?? sharesDhanaAxis(dy, dr, ctx);
      if (sharedPid === null) continue;

      const planetEn = P_EN[sharedPid] ?? `Planet ${sharedPid}`;
      const planetHi = P_HI[sharedPid] ?? `ग्रह ${sharedPid}`;

      dy.strength = weakenStrength(dy.strength);
      addInteraction(dy, {
        type: 'cross_cancellation',
        relatedYogaIds: [dr.id],
        effect: 'neutralised',
        description: {
          en: `Neutralised by opposing ${dr.name.en} — ${planetEn} creates tension between prosperity and obstruction`,
          hi: `विपरीत ${dr.name.hi} द्वारा निष्प्रभावित — ${planetHi} समृद्धि और बाधा के बीच तनाव उत्पन्न करता है`,
        },
        strengthDelta: -1,
      });

      dr.strength = weakenStrength(dr.strength);
      addInteraction(dr, {
        type: 'cross_cancellation',
        relatedYogaIds: [dy.id],
        effect: 'neutralised',
        description: {
          en: `Neutralised by opposing ${dy.name.en} — ${planetEn} moderates the poverty indication`,
          hi: `विपरीत ${dy.name.hi} द्वारा निष्प्रभावित — ${planetHi} दरिद्रता संकेत को संयमित करता है`,
        },
        strengthDelta: -1,
      });
    }
  }

  // Raja vs Arishta — share a planet
  for (const ry of raja) {
    for (const ar of arishta) {
      const sharedPid = sharesPlanet(ry, ar);
      if (sharedPid === null) continue;

      const planetEn = P_EN[sharedPid] ?? `Planet ${sharedPid}`;
      const planetHi = P_HI[sharedPid] ?? `ग्रह ${sharedPid}`;

      // Weaken raja only (arishta is already inauspicious — no change)
      ry.strength = weakenStrength(ry.strength);
      addInteraction(ry, {
        type: 'cross_cancellation',
        relatedYogaIds: [ar.id],
        effect: 'neutralised',
        description: {
          en: `Weakened by opposing ${ar.name.en} — ${planetEn} carries both authority and affliction`,
          hi: `विपरीत ${ar.name.hi} द्वारा दुर्बलित — ${planetHi} अधिकार और कष्ट दोनों वहन करता है`,
        },
        strengthDelta: -1,
      });

      // Informational on the arishta
      addInteraction(ar, {
        type: 'cross_cancellation',
        relatedYogaIds: [ry.id],
        effect: 'conflicted',
        description: {
          en: `Opposed by ${ry.name.en} — ${planetEn} moderates the affliction`,
          hi: `${ry.name.hi} द्वारा विरोधित — ${planetHi} कष्ट को संयमित करता है`,
        },
        strengthDelta: 0,
      });
    }
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Main entry point
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Analyse yoga-to-yoga interactions and mutate the array in-place.
 *
 * Execution order (spec §5): clusters → conflicts → cancellations.
 * Called from kundali-calc.ts after evaluateWithRules().
 *
 * @param yogas - The evaluated yogas array (mutated in-place)
 * @param ctx - The yoga context (needed for house lord lookups in cross-cancellation)
 */
export function analyseInteractions(yogas: EvaluatedYoga[], ctx: YogaContext): void {
  // Only process present yogas exist
  if (yogas.filter(y => y.present).length < 2) return; // Need at least 2 present yogas for any interaction

  detectClusters(yogas);
  detectPlanetConflicts(yogas);
  detectCrossCancellations(yogas, ctx);
}
