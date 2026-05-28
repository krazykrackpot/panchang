/**
 * Event-bus contract for opening the OnboardingModal from outside the
 * UserMenu component (where the modal is mounted).
 *
 * Used by <BirthDetailsBanner> + any other surface that wants the user
 * to (re-)enter birth details without routing to /settings.
 */

export const ONBOARDING_OPEN_EVENT = 'onboarding:open';

export interface OnboardingOpenEventDetail {
  /** Telemetry hint for which surface triggered the open (banner, page, etc.). */
  source?: 'birth-details-banner' | 'dashboard-prompt' | 'festival-page' | 'panchang-page' | string;
}

export type OnboardingOpenEvent = CustomEvent<OnboardingOpenEventDetail>;
