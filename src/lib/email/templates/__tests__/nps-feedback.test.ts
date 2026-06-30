import { describe, it, expect, beforeAll } from 'vitest';
import { npsFeedbackEmail } from '../nps-feedback';

// signNpsToken needs NPS_TOKEN_SECRET; we don't assert the token contents,
// only the subject, so any non-empty value works here.
beforeAll(() => {
  process.env.NPS_TOKEN_SECRET ??= 'test-secret-not-real';
});

const USER_ID = '00000000-0000-0000-0000-000000000001';

describe('npsFeedbackEmail subject line', () => {
  it('chart engagement asks about the kundali with first name', () => {
    const { subject } = npsFeedbackEmail({
      displayName: 'Aditya Kumar Jha',
      engagement: 'chart',
      userId: USER_ID,
    });
    expect(subject).toBe('Was your kundali useful, Aditya?');
  });

  it('brihaspati engagement asks about the reading with first name', () => {
    const { subject } = npsFeedbackEmail({
      displayName: 'Arti Karpate',
      engagement: 'brihaspati',
      userId: USER_ID,
    });
    expect(subject).toBe('How was your Brihaspati reading, Arti?');
  });

  it('both engagement uses the short generic ask', () => {
    const { subject } = npsFeedbackEmail({
      displayName: 'Prem',
      engagement: 'both',
      userId: USER_ID,
    });
    expect(subject).toBe('Honest feedback, Prem?');
  });

  it('drops the comma-name suffix when display name is empty', () => {
    const { subject } = npsFeedbackEmail({
      displayName: '',
      engagement: 'chart',
      userId: USER_ID,
    });
    expect(subject).toBe('Was your kundali useful?');
  });

  it('drops the comma-name suffix when display name is whitespace only', () => {
    const { subject } = npsFeedbackEmail({
      displayName: '   ',
      engagement: 'brihaspati',
      userId: USER_ID,
    });
    expect(subject).toBe('How was your Brihaspati reading?');
  });

  it('never reintroduces the brand-name or "quick question" tells', () => {
    for (const engagement of ['chart', 'brihaspati', 'both'] as const) {
      const { subject } = npsFeedbackEmail({
        displayName: 'Sam',
        engagement,
        userId: USER_ID,
      });
      expect(subject.toLowerCase()).not.toContain('dekho panchang');
      expect(subject.toLowerCase()).not.toContain('quick question');
    }
  });
});
