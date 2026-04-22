/**
 * Family Synthesis Orchestrator
 *
 * Takes the user's primary kundali + family charts, runs all cross-chart
 * analysis modules, and assembles the FamilyReading payload.
 */

import type { KundaliData, PlanetPosition } from '@/types/kundali';
import type { FamilyContext, FamilyReading } from './types';
import { computeMarriageDynamics } from './marriage-dynamics';
import { computeChildDynamics } from './child-dynamics';
import { generateFamilySummary } from './narrative-gen';

/**
 * Compute the complete family reading.
 *
 * @param userKundali - The logged-in user's computed kundali
 * @param familyContext - Spouse and children kundali data
 * @param transitPlanets - Current planetary positions for transit analysis
 */
export function computeFamilyReading(
  userKundali: KundaliData,
  familyContext: FamilyContext,
  transitPlanets: PlanetPosition[],
): FamilyReading {
  // Marriage dynamics
  const marriageDynamics = familyContext.spouse
    ? computeMarriageDynamics(userKundali, familyContext.spouse.kundali, transitPlanets)
    : null;

  // Children dynamics (one per child)
  const childrenDynamics = familyContext.children.map(child =>
    ({
      childName: child.name,
      chartId: child.chartId,
      dynamics: computeChildDynamics(userKundali, child.kundali, child.name, transitPlanets),
    }),
  );

  // Family summary
  const familySummary = generateFamilySummary(
    !!familyContext.spouse,
    familyContext.children.length,
    marriageDynamics?.transitImpact.overallTone,
    marriageDynamics?.dashaSynchronicity.inSync ||
      childrenDynamics.some(c => c.dynamics.dashaSynchronicity.inSync),
  );

  return {
    marriageDynamics,
    childrenDynamics,
    familySummary,
    computedAt: new Date().toISOString(),
  };
}
