// src/lib/gamification/badge-compute.ts

export interface BadgeInputs {
  profileComplete: boolean;
  chartsSaved: number;
  modulesDone: number;
  nakshatraModulesDone: number;
  toolsUsedCount: number;
  streakDays: number;
  visitedOnBirthday: boolean;
  visitedBeforeSixAmIst: boolean;
  visitedOnFestival: boolean;
}

/**
 * Pure: returns the set of badge slugs currently earned.
 * Caller diffs this against user_badges rows to figure out which to insert.
 */
export function computeEarnedBadges(i: BadgeInputs): Set<string> {
  const out = new Set<string>();
  if (i.profileComplete) { out.add('lit-the-lamp'); out.add('star-identified'); }
  if (i.chartsSaved >= 1)  out.add('family-constellation');
  if (i.chartsSaved >= 5)  out.add('five-star-family');
  if (i.chartsSaved >= 10) out.add('constellation-keeper');
  if (i.modulesDone >= 1)  out.add('first-page');
  if (i.modulesDone >= 5)  out.add('scholar');
  if (i.modulesDone >= 20) out.add('curriculum-master');
  if (i.nakshatraModulesDone >= 27) out.add('twenty-seven-nakshatras');
  if (i.toolsUsedCount >= 3)  out.add('tool-explorer');
  if (i.toolsUsedCount >= 5)  out.add('pentavalent');
  if (i.toolsUsedCount >= 10) out.add('all-around');
  if (i.streakDays >= 7)  out.add('first-cycle');
  if (i.streakDays >= 15) out.add('lunar-cycle');
  if (i.streakDays >= 30) out.add('full-moon');
  if (i.visitedOnBirthday)     out.add('solar-return');
  if (i.visitedBeforeSixAmIst) out.add('early-bird');
  if (i.visitedOnFestival)     out.add('festival-witness');
  return out;
}
