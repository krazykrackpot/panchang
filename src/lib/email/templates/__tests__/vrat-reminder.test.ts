import { describe, it, expect } from 'vitest';
import {
  vratDayBeforeEmail,
  vratParanaEmail,
  type VratReminderTemplateData,
} from '../vrat-reminder';

const BASE: VratReminderTemplateData = {
  displayName: 'Aditya',
  vratName: 'Ekadashi',
  deity: 'Vishnu',
  fastDate: '2026-06-10',
  fastDateLocal: 'Wednesday, 10 June',
  fastStartLocal: '06:14',
  paranaDate: '2026-06-11',
  paranaDateLocal: 'Thursday, 11 June',
  paranaStartLocal: '06:15',
  paranaEndLocal: '09:42',
  dashboardUrl: 'https://dekhopanchang.com/en/dashboard/vrats',
  unsubscribeUrl: 'https://dekhopanchang.com/en/dashboard/vrats',
  pujaUrl: 'https://dekhopanchang.com/en/puja/ekadashi',
};

describe('vratDayBeforeEmail', () => {
  it('subject names the vrat', () => {
    const { subject } = vratDayBeforeEmail(BASE);
    expect(subject).toContain('Ekadashi');
    expect(subject.toLowerCase()).toContain('tomorrow');
  });

  it('body includes fast start, parana date, parana window, deity', () => {
    const { html } = vratDayBeforeEmail(BASE);
    expect(html).toContain('06:14');
    expect(html).toContain('Thursday, 11 June');
    expect(html).toContain('06:15');
    expect(html).toContain('09:42');
    expect(html).toContain('Vishnu');
  });

  it('greeting falls back to "there" when displayName is empty', () => {
    const { html } = vratDayBeforeEmail({ ...BASE, displayName: '   ' });
    expect(html).toContain('Dear there');
  });

  it('omits puja link if pujaUrl is undefined', () => {
    const { html } = vratDayBeforeEmail({ ...BASE, pujaUrl: undefined });
    expect(html).not.toContain('puja vidhi');
  });

  it('uses paranaNote when window times are absent (moonrise case)', () => {
    const { html } = vratDayBeforeEmail({
      ...BASE,
      paranaStartLocal: undefined,
      paranaEndLocal: undefined,
      paranaNote: 'Break at moonrise (≈ 22:14)',
    });
    expect(html).toContain('Break at moonrise');
  });
});

describe('vratParanaEmail', () => {
  it('subject names the vrat and the opening time', () => {
    const { subject } = vratParanaEmail(BASE);
    expect(subject).toContain('Ekadashi');
    expect(subject).toContain('06:15');
  });

  it('body highlights the window range', () => {
    const { html } = vratParanaEmail(BASE);
    expect(html).toContain('06:15');
    expect(html).toContain('09:42');
  });

  it('falls back to moonrise note when window times are missing', () => {
    const { html } = vratParanaEmail({
      ...BASE,
      paranaStartLocal: undefined,
      paranaEndLocal: undefined,
      paranaNote: 'Break at moonrise',
    });
    // Subject defaults to "—" when no start time — body still has the
    // note for context.
    expect(html).toContain('Break at moonrise');
  });

  it('greeting falls back gracefully', () => {
    const { html } = vratParanaEmail({ ...BASE, displayName: '' });
    expect(html).toContain('Dear there');
  });
});
