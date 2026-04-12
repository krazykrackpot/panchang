import { describe, it, expect } from 'vitest';
import { getOnboardingEmail } from '@/lib/email/onboarding-templates';

describe('onboarding email drip', () => {
  it('exports getOnboardingEmail function', () => {
    expect(typeof getOnboardingEmail).toBe('function');
  });

  it('returns valid email for all 7 days (EN)', () => {
    for (let day = 1; day <= 7; day++) {
      const email = getOnboardingEmail(day as 1 | 2 | 3 | 4 | 5 | 6 | 7, 'en');
      expect(email.subject).toBeTruthy();
      expect(email.html).toBeTruthy();
      expect(email.text).toBeTruthy();
    }
  });

  it('returns valid email for all 7 days (HI)', () => {
    for (let day = 1; day <= 7; day++) {
      const email = getOnboardingEmail(day as 1 | 2 | 3 | 4 | 5 | 6 | 7, 'hi');
      expect(email.subject).toBeTruthy();
      expect(email.html).toBeTruthy();
      expect(email.text).toBeTruthy();
    }
  });

  it('day 1 welcome email personalizes with user name', () => {
    const email = getOnboardingEmail(1, 'en', { name: 'Arjun' });
    expect(email.html).toContain('Arjun');
    expect(email.text).toContain('Arjun');
  });

  it('day 1 uses "Friend" as default name (EN)', () => {
    const email = getOnboardingEmail(1, 'en');
    expect(email.html).toContain('Friend');
  });

  it('day 1 uses Hindi default name (HI)', () => {
    const email = getOnboardingEmail(1, 'hi');
    expect(email.html).toContain('मित्र');
  });

  it('all emails contain dekhopanchang.com links', () => {
    for (let day = 1; day <= 7; day++) {
      const email = getOnboardingEmail(day as 1 | 2 | 3 | 4 | 5 | 6 | 7, 'en');
      expect(email.html).toContain('dekhopanchang.com');
    }
  });

  it('all emails have dark theme styling', () => {
    for (let day = 1; day <= 7; day++) {
      const email = getOnboardingEmail(day as 1 | 2 | 3 | 4 | 5 | 6 | 7, 'en');
      expect(email.html).toContain('#0a0e27'); // navy background
      expect(email.html).toContain('#d4a853'); // gold accent
    }
  });

  it('day 2 is about panchang', () => {
    const email = getOnboardingEmail(2, 'en');
    expect(email.subject.toLowerCase()).toContain('tithi');
    expect(email.html).toContain('Panchang');
  });

  it('day 4 personalizes eclipse house reference', () => {
    const email = getOnboardingEmail(4, 'en', { nthHouse: 7 });
    expect(email.subject).toContain('7th house');
  });

  it('day 6 personalizes dasha lord reference', () => {
    const email = getOnboardingEmail(6, 'en', { dashaLord: 'Jupiter' });
    expect(email.subject).toContain('Jupiter');
  });

  it('day 7 contains WhatsApp share link', () => {
    const email = getOnboardingEmail(7, 'en');
    expect(email.html).toContain('wa.me');
  });

  it('subjects are different for each day', () => {
    const subjects = new Set<string>();
    for (let day = 1; day <= 7; day++) {
      const email = getOnboardingEmail(day as 1 | 2 | 3 | 4 | 5 | 6 | 7, 'en');
      subjects.add(email.subject);
    }
    expect(subjects.size).toBe(7);
  });

  it('all emails have manage preferences link', () => {
    const email = getOnboardingEmail(1, 'en');
    expect(email.html).toContain('Manage email preferences');
    expect(email.html).toContain('/settings');
  });
});
