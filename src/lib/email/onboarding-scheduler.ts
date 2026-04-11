/**
 * Onboarding email scheduler.
 * Determines which email to send based on user signup date.
 * Does NOT send emails — just resolves the correct day/template.
 */

import { getOnboardingEmail } from './onboarding-templates';

type Day = 1 | 2 | 3 | 4 | 5 | 6 | 7;

interface SchedulerResult {
  day: Day;
  getEmail: typeof getOnboardingEmail;
}

/**
 * Given a signup date, determine which onboarding email should be sent today.
 * Returns null if all 7 emails have already been sent (signup > 7 days ago).
 *
 * @param signupDate - ISO date string (YYYY-MM-DD) of user signup
 * @param today - Optional ISO date string for "today" (defaults to actual today, useful for testing)
 * @returns { day, getEmail } or null if sequence is complete
 */
export function getOnboardingEmailForUser(
  signupDate: string,
  today?: string
): SchedulerResult | null {
  const signup = new Date(signupDate + 'T00:00:00Z');
  const now = today
    ? new Date(today + 'T00:00:00Z')
    : new Date(new Date().toISOString().split('T')[0] + 'T00:00:00Z');

  // Calculate days since signup (day 1 = signup day itself)
  const diffMs = now.getTime() - signup.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  // Day 1 is sent on signup day (diffDays = 0), day 7 on diffDays = 6
  const day = (diffDays + 1) as number;

  if (day < 1 || day > 7) {
    return null;
  }

  return {
    day: day as Day,
    getEmail: getOnboardingEmail,
  };
}

/**
 * Check if a user is still in the onboarding window (first 7 days).
 */
export function isInOnboardingWindow(
  signupDate: string,
  today?: string
): boolean {
  return getOnboardingEmailForUser(signupDate, today) !== null;
}

/**
 * Get all remaining onboarding days for a user.
 * Useful for displaying progress or catching up missed emails.
 */
export function getRemainingOnboardingDays(
  signupDate: string,
  today?: string
): Day[] {
  const result = getOnboardingEmailForUser(signupDate, today);
  if (!result) return [];

  const days: Day[] = [];
  for (let d = result.day; d <= 7; d++) {
    days.push(d as Day);
  }
  return days;
}
