/**
 * Yoga Engine — Core Engine + Context Integration Tests
 *
 * Tests the full yoga detection pipeline via generateKundali() using
 * two real charts with known yoga configurations:
 *
 * - Arjun Jha:    2016-09-09 19:45 Luxembourg (Aquarius lagna)
 * - Vaibhavi Jha: 2008-06-21 12:08 Delhi      (Virgo lagna)
 *
 * All assertions verified against command-line engine output (May 2026).
 *
 * Planet IDs: 0=Sun, 1=Moon, 2=Mars, 3=Mercury, 4=Jupiter, 5=Venus, 6=Saturn, 7=Rahu, 8=Ketu
 * Sign IDs:   1=Aries through 12=Pisces (1-based)
 */

import { describe, it, expect } from 'vitest';
import { generateKundali } from '@/lib/ephem/kundali-calc';
import { ALL_YOGA_RULES } from '@/lib/kundali/yoga-engine/rules';
import type { BirthData } from '@/types/kundali';
import type { EvaluatedYoga } from '@/lib/kundali/yoga-engine/types';

// ---------------------------------------------------------------------------
// Test chart definitions
// ---------------------------------------------------------------------------

const ARJUN: BirthData = {
  name: 'Arjun Jha',
  date: '2016-09-09',
  time: '19:45',
  place: 'Luxembourg',
  lat: 49.6117,
  lng: 6.1319,
  timezone: 'Europe/Luxembourg',
  ayanamsha: 'lahiri',
};

const VAIBHAVI: BirthData = {
  name: 'Vaibhavi Jha',
  date: '2008-06-21',
  time: '12:08',
  place: 'Delhi',
  lat: 28.6139,
  lng: 77.2090,
  timezone: 'Asia/Kolkata',
  ayanamsha: 'lahiri',
};

// Synthetic fixture engineered for the Mangal Dosha + cancellation integration
// test. Virgo lagna, Mars in own sign Aries placed in the 8th house from
// Lagna → Mangal Dosha PRESENT (8th is in {1,2,4,7,8,12} from Lagna) AND
// Mars in own sign triggers cancellation C1 (weaken effect, not full cancel).
// This pair lets us exercise the full yoga-engine cancellationStatus pipeline
// after the Mangal Dosha rule was tightened to the classical Lagna-only gate
// (which removed coverage from the Arjun + Vaibhavi fixtures whose Mars lands
// in the 10th and 11th from Lagna respectively — both non-Mangal houses).
const MANGAL_PRESENT_FIXTURE: BirthData = {
  name: 'Mangal Test Fixture',
  date: '1985-03-22',
  time: '18:00',
  place: 'Delhi',
  lat: 28.6139,
  lng: 77.2090,
  timezone: 'Asia/Kolkata',
  ayanamsha: 'lahiri',
};

// ---------------------------------------------------------------------------
// Generate charts once (deterministic — same inputs = same outputs)
// ---------------------------------------------------------------------------

const arjunChart = generateKundali(ARJUN);
const vaibhaviChart = generateKundali(VAIBHAVI);
const mangalFixtureChart = generateKundali(MANGAL_PRESENT_FIXTURE);

// Helpers
function findYoga(yogas: EvaluatedYoga[], id: string): EvaluatedYoga | undefined {
  return yogas.find(y => y.id === id);
}

function presentYogaIds(yogas: EvaluatedYoga[]): string[] {
  return yogas.filter(y => y.present).map(y => y.id);
}

// ==========================================================================
// ENGINE BASICS
// ==========================================================================

describe('Yoga Engine — Basics', () => {
  it('evaluatedYogas is present on KundaliData after generateKundali', () => {
    expect(arjunChart.evaluatedYogas).toBeDefined();
    expect(Array.isArray(arjunChart.evaluatedYogas)).toBe(true);
  });

  it('total rules count matches', () => {
    // Asserts on ALL_YOGA_RULES.length itself so a future rule add/remove
    // updates one place. 193 = 210 prior - 16 Tajika rules moved out
    // (Tajika belongs in the Varshaphal engine — see learn module 21-1)
    // - 1 kendradhipati-dosha rule removed (see spec
    // docs/superpowers/specs/2026-05-31-kendradhipati-refactor.md —
    // surfaced per-planet via functional-nature.ts instead).
    expect(ALL_YOGA_RULES.length).toBe(193);
  });

  it('evaluatedYogas has one entry per rule', () => {
    expect(arjunChart.evaluatedYogas!.length).toBe(ALL_YOGA_RULES.length);
    expect(vaibhaviChart.evaluatedYogas!.length).toBe(ALL_YOGA_RULES.length);
  });

  it('present yogas count is > 0 for both charts', () => {
    const arjunPresent = arjunChart.evaluatedYogas!.filter(y => y.present);
    const vaibhaviPresent = vaibhaviChart.evaluatedYogas!.filter(y => y.present);
    expect(arjunPresent.length).toBeGreaterThan(0);
    expect(vaibhaviPresent.length).toBeGreaterThan(0);
  });

  it('each evaluated yoga has required fields', () => {
    for (const y of arjunChart.evaluatedYogas!) {
      expect(y.id).toBeTruthy();
      expect(y.name).toBeDefined();
      expect(y.name.en).toBeTruthy();
      expect(y.name.hi).toBeTruthy();
      expect(y.group).toBeTruthy();
      expect(typeof y.present).toBe('boolean');
      expect(['Strong', 'Moderate', 'Weak']).toContain(y.strength);
      expect(y.classicalRef).toBeTruthy();
      expect(y.formationRule).toBeDefined();
      expect(y.description).toBeDefined();
      expect(y.affectedDomains).toBeDefined();
      expect([1, 2, 3]).toContain(y.domainImpactWeight);
      expect(Array.isArray(y.involvedPlanets)).toBe(true);
    }
  });

  it('no duplicate yoga IDs in results', () => {
    const ids = arjunChart.evaluatedYogas!.map(y => y.id);
    const uniqueIds = new Set(ids);
    expect(uniqueIds.size).toBe(ids.length);
  });
});

// ==========================================================================
// ARJUN'S CHART (Aquarius lagna)
// ==========================================================================

describe("Yoga Engine — Arjun's chart (Aquarius lagna)", () => {
  const yogas = arjunChart.evaluatedYogas!;
  const present = presentYogaIds(yogas);

  // ── Present yogas ──

  it('Ruchaka Yoga present (Mars in own sign Scorpio in 10th kendra)', () => {
    expect(present).toContain('ruchaka');
    const ruchaka = findYoga(yogas, 'ruchaka')!;
    expect(ruchaka.present).toBe(true);
    expect(ruchaka.group).toBe('mahapurusha');
  });

  it('Kaal Sarpa present (weakened — planets conjunct nodes)', () => {
    expect(present).toContain('kaal-sarpa');
    const ks = findYoga(yogas, 'kaal-sarpa')!;
    expect(ks.present).toBe(true);
    expect(ks.group).toBe('dosha');
    expect(ks.strength).toBe('Weak');
  });

  it('Mangal Dosha NOT present (Mars in 10th from Aquarius Lagna)', () => {
    // Arjun's chart: Mars in own sign Scorpio in the 10th house from Aquarius
    // Lagna. The 10th is NOT in the Mangal house set {1,2,4,7,8,12}, so under
    // the classical Phaladeepika rule (fromLagna only) the dosha is absent.
    // Pre-classical-fix this fired because Mars was in a Mangal house from
    // Moon or Venus — those references are now informational only.
    const md = findYoga(yogas, 'mangal-dosha')!;
    expect(md.present).toBe(false);
  });

  it('Chandra-Mangala present (Moon-Mars conjunction)', () => {
    expect(present).toContain('chandra-mangala');
    const cm = findYoga(yogas, 'chandra-mangala')!;
    expect(cm.present).toBe(true);
    // Moderate for Aquarius lagna: Moon (6th lord = func malefic) + Mars (3rd/10th = neutral).
    // G3 lagna-aware modifier penalises when no involved planet is func benefic.
    expect(cm.strength).toBe('Moderate');
  });

  it('Kendra-Trikona Raja present', () => {
    expect(present).toContain('kendra-trikona-raja');
  });

  it('Neechabhanga Raja present', () => {
    expect(present).toContain('neechabhanga-raja');
  });

  it('Angarak Yoga present (Mars-Saturn conjunction)', () => {
    expect(present).toContain('angarak-yoga');
  });

  it('Vish Yoga present (Moon-Saturn conjunction)', () => {
    expect(present).toContain('vish-yoga');
  });

  // ── Absent yogas ──

  it('Hamsa NOT present (Jupiter not in kendra in own/exalted)', () => {
    expect(present).not.toContain('hamsa');
  });

  it('Malavya NOT present', () => {
    expect(present).not.toContain('malavya');
  });

  it('Bhadra NOT present', () => {
    expect(present).not.toContain('bhadra');
  });

  it('Shasha NOT present', () => {
    expect(present).not.toContain('shasha');
  });
});

// ==========================================================================
// VAIBHAVI'S CHART (Virgo lagna)
// ==========================================================================

describe("Yoga Engine — Vaibhavi's chart (Virgo lagna)", () => {
  const yogas = vaibhaviChart.evaluatedYogas!;
  const present = presentYogaIds(yogas);

  // ── Present yogas ──

  it('Hamsa present (Jupiter in Sagittarius in 4th kendra)', () => {
    expect(present).toContain('hamsa');
    const hamsa = findYoga(yogas, 'hamsa')!;
    expect(hamsa.present).toBe(true);
    expect(hamsa.group).toBe('mahapurusha');
  });

  it('Dharma-Karmadhipati present', () => {
    expect(present).toContain('dharma-karmadhipati');
  });

  it('Anapha present', () => {
    expect(present).toContain('anapha');
    const anapha = findYoga(yogas, 'anapha')!;
    expect(anapha.present).toBe(true);
    expect(anapha.group).toBe('chandra');
  });

  it('Mangal Dosha NOT present (Mars in 11th from Virgo Lagna)', () => {
    // Vaibhavi's chart: Mars in the 11th house from Virgo Lagna. 11th is NOT
    // in the Mangal house set {1,2,4,7,8,12} so the classical Phaladeepika
    // rule (fromLagna only) gives `present: false`. Pre-classical-fix this
    // fired via fromMoon or fromVenus; both are now informational only.
    const md = findYoga(yogas, 'mangal-dosha')!;
    expect(md.present).toBe(false);
  });

  it('Viparita Raja present', () => {
    expect(present).toContain('viparita-raja');
  });

  it('Maha Parivartana present', () => {
    expect(present).toContain('maha-parivartana');
  });

  // ── Absent yogas ──

  it('Ruchaka NOT present', () => {
    expect(present).not.toContain('ruchaka');
  });

  it('Bhadra NOT present', () => {
    expect(present).not.toContain('bhadra');
  });

  it('Kaal Sarpa NOT present', () => {
    expect(present).not.toContain('kaal-sarpa');
  });
});

// ==========================================================================
// CANCELLATION TESTS
// ==========================================================================

describe('Yoga Engine — Cancellations', () => {
  it('Mangal Dosha has cancellation status with weaken effect (Mars own sign, 8th from Lagna)', () => {
    // Uses the synthetic MANGAL_PRESENT_FIXTURE — Virgo lagna, Mars in own
    // sign Aries placed in the 8th house. Mangal Dosha is classically
    // present (8th is a Mangal house) AND Mars in own sign triggers the
    // C1 cancellation (weaken effect, not full cancel).
    const md = findYoga(mangalFixtureChart.evaluatedYogas!, 'mangal-dosha')!;
    expect(md.present).toBe(true);
    expect(md.cancellationStatus).toBeDefined();
    expect(md.cancellationStatus!.anyCancelled).toBe(false); // weakened, not cancelled
    // At least one cancellation detail with effect 'weaken' is active.
    const weakeners = md.cancellationStatus!.details.filter(
      (d) => d.cancelled && d.effect === 'weaken',
    );
    expect(weakeners.length).toBeGreaterThan(0);
  });

  it("Kaal Sarpa for Arjun has cancellation status (weakened by planet conjunct node)", () => {
    const ks = findYoga(arjunChart.evaluatedYogas!, 'kaal-sarpa')!;
    expect(ks.present).toBe(true);
    expect(ks.cancellationStatus).toBeDefined();
    const weakeners = ks.cancellationStatus!.details.filter(d => d.cancelled && d.effect === 'weaken');
    expect(weakeners.length).toBeGreaterThan(0);
  });

  it('Dhana Yoga for Arjun is weakened (lords in dusthana)', () => {
    const dg = findYoga(arjunChart.evaluatedYogas!, 'dhana-general')!;
    expect(dg.present).toBe(true);
    expect(dg.strength).toBe('Weak');
    const weakeners = dg.cancellationStatus?.details.filter(d => d.cancelled && d.effect === 'weaken');
    expect(weakeners!.length).toBeGreaterThan(0);
  });
});

// ==========================================================================
// DOMAIN MAPPING TESTS
// ==========================================================================

describe('Yoga Engine — Domain mapping', () => {
  it("Ruchaka's affectedDomains includes career and health", () => {
    const ruchaka = findYoga(arjunChart.evaluatedYogas!, 'ruchaka')!;
    expect(ruchaka.affectedDomains).toContain('career');
    expect(ruchaka.affectedDomains).toContain('health');
  });

  it("Gajakesari's affectedDomains includes education", () => {
    // Gajakesari is not present in either chart, but check its rule definition
    const gk = findYoga(arjunChart.evaluatedYogas!, 'gajakesari');
    expect(gk).toBeDefined();
    expect(gk!.affectedDomains).toContain('education');
  });

  it("Mangal Dosha's affectedDomains includes marriage", () => {
    const md = findYoga(arjunChart.evaluatedYogas!, 'mangal-dosha')!;
    expect(md.affectedDomains).toContain('marriage');
  });

  it("Kaal Sarpa's affectedDomains is 'all'", () => {
    const ks = findYoga(arjunChart.evaluatedYogas!, 'kaal-sarpa')!;
    expect(ks.affectedDomains).toBe('all');
  });

  it("Hamsa's affectedDomains includes spiritual and education", () => {
    const hamsa = findYoga(vaibhaviChart.evaluatedYogas!, 'hamsa')!;
    expect(hamsa.affectedDomains).toContain('spiritual');
    expect(hamsa.affectedDomains).toContain('education');
  });

  it("Chandra-Mangala's affectedDomains includes wealth and marriage", () => {
    const cm = findYoga(arjunChart.evaluatedYogas!, 'chandra-mangala')!;
    expect(cm.affectedDomains).toContain('wealth');
    expect(cm.affectedDomains).toContain('marriage');
  });
});

// ==========================================================================
// BACKWARD COMPATIBILITY
// ==========================================================================

describe('Yoga Engine — Backward compatibility', () => {
  it('yogasComplete (old format) is still present on KundaliData', () => {
    expect(arjunChart.yogasComplete).toBeDefined();
    expect(Array.isArray(arjunChart.yogasComplete)).toBe(true);
  });

  it('yogasComplete has > 100 entries (old detector produces many)', () => {
    expect(arjunChart.yogasComplete!.length).toBeGreaterThan(100);
    expect(vaibhaviChart.yogasComplete!.length).toBeGreaterThan(100);
  });

  it('yogasComplete entries have required fields', () => {
    for (const y of arjunChart.yogasComplete!.slice(0, 10)) {
      expect(y.id).toBeTruthy();
      expect(y.name).toBeDefined();
      expect(typeof y.present).toBe('boolean');
      expect(['Strong', 'Moderate', 'Weak']).toContain(y.strength);
    }
  });
});

// ==========================================================================
// STRENGTH ASSESSMENT
// ==========================================================================

describe('Yoga Engine — Strength assessment', () => {
  it('Ruchaka in Arjun chart is Moderate (Mars in own sign, not exalted)', () => {
    const ruchaka = findYoga(arjunChart.evaluatedYogas!, 'ruchaka')!;
    expect(ruchaka.strength).toBe('Moderate');
  });

  it('Chandra-Mangala in Arjun chart is Moderate (G3: no func benefic for Aquarius)', () => {
    const cm = findYoga(arjunChart.evaluatedYogas!, 'chandra-mangala')!;
    expect(cm.strength).toBe('Moderate');
  });

  it('Kaal Sarpa in Arjun chart is Weak (planet conjunct node weakens)', () => {
    const ks = findYoga(arjunChart.evaluatedYogas!, 'kaal-sarpa')!;
    expect(ks.strength).toBe('Weak');
  });

  it('Hamsa in Vaibhavi chart is Moderate (Jupiter in own sign, retrograde)', () => {
    const hamsa = findYoga(vaibhaviChart.evaluatedYogas!, 'hamsa')!;
    expect(hamsa.strength).toBe('Moderate');
  });

  it('absent yogas have Weak strength', () => {
    const absent = arjunChart.evaluatedYogas!.filter(y => !y.present);
    for (const y of absent) {
      expect(y.strength).toBe('Weak');
    }
  });
});

// ==========================================================================
// GROUP CLASSIFICATION
// ==========================================================================

describe('Yoga Engine — Group classification', () => {
  const yogas = arjunChart.evaluatedYogas!;

  it('all mahapurusha yogas are in the mahapurusha group', () => {
    const mahapurusha = ['ruchaka', 'bhadra', 'hamsa', 'malavya', 'shasha'];
    for (const id of mahapurusha) {
      const y = findYoga(yogas, id);
      expect(y).toBeDefined();
      expect(y!.group).toBe('mahapurusha');
    }
  });

  it('dosha yogas are in the dosha group', () => {
    const doshas = ['mangal-dosha', 'kaal-sarpa', 'pitru-dosha'];
    for (const id of doshas) {
      const y = findYoga(yogas, id);
      expect(y).toBeDefined();
      expect(y!.group).toBe('dosha');
    }
  });

  it('all groups are represented in the rules', () => {
    const groups = new Set(yogas.map(y => y.group));
    expect(groups.has('mahapurusha')).toBe(true);
    expect(groups.has('raja')).toBe(true);
    expect(groups.has('dhana')).toBe(true);
    expect(groups.has('chandra')).toBe(true);
    expect(groups.has('surya')).toBe(true);
    expect(groups.has('dosha')).toBe(true);
    expect(groups.has('nabhasa')).toBe(true);
    expect(groups.has('malika')).toBe(true);
    expect(groups.has('parivartana')).toBe(true);
    expect(groups.has('conjunction')).toBe(true);
    expect(groups.has('arishta')).toBe(true);
    expect(groups.has('sannyasa')).toBe(true);
    expect(groups.has('navamsha')).toBe(true);
    // daridra rules use group 'dhana' (already checked above)
    expect(groups.size).toBeGreaterThanOrEqual(13);
  });
});

// ==========================================================================
// TAJIKA SEPARATION — Tajika yogas are Varshaphal-only (see learn module 21-1)
// ==========================================================================

describe('Yoga Engine — Tajika exclusion', () => {
  it('natal engine emits NO Tajika-group yogas', () => {
    // Tajika aspects (degree-based applying/separating) belong to the
    // Varshaphal (annual-chart) framework, not Parashari natal. The
    // canonical Tajika engine lives in src/lib/varshaphal/tajika-aspects.ts
    // and surfaces through /api/varshaphal — never through the natal
    // kundali yoga list.
    const arjunTajika = arjunChart.evaluatedYogas!.filter(y => (y.group as string) === 'tajika');
    const vaibhaviTajika = vaibhaviChart.evaluatedYogas!.filter(y => (y.group as string) === 'tajika');
    expect(arjunTajika.length).toBe(0);
    expect(vaibhaviTajika.length).toBe(0);
  });
});

// ==========================================================================
// DARIDRA GROUP (uses 'dhana' group)
// ==========================================================================

describe('Yoga Engine — Daridra rules', () => {
  it('Daridra yoga IDs use group "dhana"', () => {
    const daridraYogas = arjunChart.evaluatedYogas!.filter(y => y.id.startsWith('daridra'));
    expect(daridraYogas.length).toBeGreaterThan(0);
    for (const y of daridraYogas) {
      expect(y.group).toBe('dhana');
    }
  });

  it('Daridra yogas are marked as inauspicious', () => {
    const daridraYogas = arjunChart.evaluatedYogas!.filter(y => y.id.startsWith('daridra'));
    for (const y of daridraYogas) {
      expect(y.isAuspicious).toBe(false);
    }
  });
});

// ==========================================================================
// PER-LAGNA RAJA YOGA
// ==========================================================================

describe('Yoga Engine — Per-lagna Raja', () => {
  it('per-lagna-raja for wrong lagna is NOT present (Arjun = Aquarius)', () => {
    // Arjun has Aquarius (sign 11) lagna — all non-Aquarius per-lagna rules must be absent
    const arjunPresent = presentYogaIds(arjunChart.evaluatedYogas!);
    const wrongLagnaRajas = arjunChart.evaluatedYogas!.filter(y =>
      y.id.startsWith('per-lagna-raja-') && !y.id.startsWith('per-lagna-raja-aquarius'),
    );
    for (const y of wrongLagnaRajas) {
      expect(y.present).toBe(false);
    }
    // Virgo-specific should definitely not be present for Aquarius lagna
    expect(arjunPresent).not.toContain('per-lagna-raja-virgo');
  });

  it('per-lagna-raja for wrong lagna is NOT present (Vaibhavi = Virgo)', () => {
    // Vaibhavi has Virgo (sign 6) lagna — all non-Virgo per-lagna rules must be absent
    const vaibhaviPresent = presentYogaIds(vaibhaviChart.evaluatedYogas!);
    const wrongLagnaRajas = vaibhaviChart.evaluatedYogas!.filter(y =>
      y.id.startsWith('per-lagna-raja-') && !y.id.startsWith('per-lagna-raja-virgo'),
    );
    for (const y of wrongLagnaRajas) {
      expect(y.present).toBe(false);
    }
    expect(vaibhaviPresent).not.toContain('per-lagna-raja-aquarius');
  });

  it('per-lagna-raja rules exist for all 12 lagnas (primary + secondary)', () => {
    const perLagnaRules = arjunChart.evaluatedYogas!.filter(y => y.id.startsWith('per-lagna-raja-'));
    // 12 primary + ~26 secondary kendra-trikona pairs = 38 total
    expect(perLagnaRules.length).toBeGreaterThanOrEqual(12);
    // Every lagna must have at least one primary rule
    for (let sign = 1; sign <= 12; sign++) {
      const lagnaName = ['aries','taurus','gemini','cancer','leo','virgo','libra','scorpio','sagittarius','capricorn','aquarius','pisces'][sign - 1];
      const hasRule = perLagnaRules.some(r => r.id.includes(lagnaName));
      expect(hasRule).toBe(true);
    }
  });
});

// ==========================================================================
// CONJUNCTION GROUP — Angarak (Mars-Saturn)
// ==========================================================================

describe('Yoga Engine — Conjunction group', () => {
  it('Angarak Yoga (Mars-Saturn conjunction) present for Arjun', () => {
    const present = presentYogaIds(arjunChart.evaluatedYogas!);
    expect(present).toContain('angarak-yoga');
    const angarak = findYoga(arjunChart.evaluatedYogas!, 'angarak-yoga')!;
    expect(angarak.group).toBe('conjunction');
    // Mars (2) and Saturn (6) should be involved
    expect(angarak.involvedPlanets).toContain(2);
    expect(angarak.involvedPlanets).toContain(6);
  });
});

// ==========================================================================
// NAVAMSHA GROUP
// ==========================================================================

describe('Yoga Engine — Navamsha group', () => {
  it('at least one navamsha yoga is present in one of the test charts', () => {
    const arjunNav = arjunChart.evaluatedYogas!.filter(y => y.group === 'navamsha' && y.present);
    const vaibhaviNav = vaibhaviChart.evaluatedYogas!.filter(y => y.group === 'navamsha' && y.present);
    expect(arjunNav.length + vaibhaviNav.length).toBeGreaterThan(0);
  });

  it('navamsha yogas have classical references', () => {
    const navYogas = arjunChart.evaluatedYogas!.filter(y => y.group === 'navamsha');
    expect(navYogas.length).toBeGreaterThan(0);
    for (const y of navYogas) {
      expect(y.classicalRef).toBeTruthy();
    }
  });
});
