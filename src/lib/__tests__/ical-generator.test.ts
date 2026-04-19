import { describe, it, expect } from 'vitest';
import { generateICal, escapeICalText, type ICalEvent, type ICalOptions } from '../calendar/ical-generator';

describe('escapeICalText', () => {
  it('escapes commas', () => {
    expect(escapeICalText('Hello, World')).toBe('Hello\\, World');
  });

  it('escapes semicolons', () => {
    expect(escapeICalText('A;B;C')).toBe('A\\;B\\;C');
  });

  it('escapes newlines', () => {
    expect(escapeICalText('Line1\nLine2')).toBe('Line1\\nLine2');
  });

  it('escapes Windows-style newlines', () => {
    expect(escapeICalText('Line1\r\nLine2')).toBe('Line1\\nLine2');
  });

  it('escapes backslashes before other chars', () => {
    expect(escapeICalText('path\\to\\file')).toBe('path\\\\to\\\\file');
    // Backslash + comma
    expect(escapeICalText('a\\,b')).toBe('a\\\\\\,b');
  });

  it('handles empty string', () => {
    expect(escapeICalText('')).toBe('');
  });

  it('handles string with no special chars', () => {
    expect(escapeICalText('Hello World')).toBe('Hello World');
  });
});

describe('generateICal', () => {
  it('produces valid VCALENDAR wrapper', () => {
    const result = generateICal({ calName: 'Test', events: [] });
    expect(result).toContain('BEGIN:VCALENDAR');
    expect(result).toContain('END:VCALENDAR');
    expect(result).toContain('VERSION:2.0');
    expect(result).toContain('PRODID:-//Dekho Panchang//Vedic Calendar//EN');
    expect(result).toContain('CALSCALE:GREGORIAN');
    expect(result).toContain('METHOD:PUBLISH');
  });

  it('sets X-WR-CALNAME', () => {
    const result = generateICal({ calName: 'My Vedic Calendar', events: [] });
    expect(result).toContain('X-WR-CALNAME:My Vedic Calendar');
  });

  it('sets X-WR-TIMEZONE when provided', () => {
    const result = generateICal({
      calName: 'Test',
      timezone: 'Europe/Zurich',
      events: [],
    });
    expect(result).toContain('X-WR-TIMEZONE:Europe/Zurich');
  });

  it('omits X-WR-TIMEZONE when not provided', () => {
    const result = generateICal({ calName: 'Test', events: [] });
    expect(result).not.toContain('X-WR-TIMEZONE');
  });

  it('generates a single all-day event correctly', () => {
    const events: ICalEvent[] = [
      {
        uid: 'diwali-2026-11-08@dekhopanchang.com',
        dtstart: '2026-11-08',
        summary: 'Diwali',
        description: 'Festival of Lights',
        categories: ['festival'],
      },
    ];

    const result = generateICal({ calName: 'Test', events });

    expect(result).toContain('BEGIN:VEVENT');
    expect(result).toContain('END:VEVENT');
    expect(result).toContain('UID:diwali-2026-11-08@dekhopanchang.com');
    expect(result).toContain('DTSTART;VALUE=DATE:20261108');
    // DTEND should be next day (exclusive)
    expect(result).toContain('DTEND;VALUE=DATE:20261109');
    expect(result).toContain('SUMMARY:Diwali');
    expect(result).toContain('DESCRIPTION:Festival of Lights');
    expect(result).toContain('CATEGORIES:festival');
    // Must have DTSTAMP
    expect(result).toMatch(/DTSTAMP:\d{8}T\d{6}Z/);
  });

  it('generates an event with an alarm', () => {
    const events: ICalEvent[] = [
      {
        uid: 'test-alarm@dekhopanchang.com',
        dtstart: '2026-03-14',
        summary: 'Holi',
        alarm: { trigger: '-P1D', description: 'Tomorrow: Holi' },
      },
    ];

    const result = generateICal({ calName: 'Test', events });

    expect(result).toContain('BEGIN:VALARM');
    expect(result).toContain('ACTION:DISPLAY');
    expect(result).toContain('TRIGGER:-P1D');
    expect(result).toContain('DESCRIPTION:Tomorrow: Holi');
    expect(result).toContain('END:VALARM');
  });

  it('handles multiple events', () => {
    const events: ICalEvent[] = [
      { uid: 'a@test', dtstart: '2026-01-15', summary: 'Event A' },
      { uid: 'b@test', dtstart: '2026-02-20', summary: 'Event B' },
      { uid: 'c@test', dtstart: '2026-03-10', summary: 'Event C' },
    ];

    const result = generateICal({ calName: 'Multi', events });

    // Count VEVENT blocks
    const veventCount = (result.match(/BEGIN:VEVENT/g) || []).length;
    expect(veventCount).toBe(3);

    expect(result).toContain('SUMMARY:Event A');
    expect(result).toContain('SUMMARY:Event B');
    expect(result).toContain('SUMMARY:Event C');
  });

  it('returns valid content for empty events list', () => {
    const result = generateICal({ calName: 'Empty', events: [] });

    expect(result).toContain('BEGIN:VCALENDAR');
    expect(result).toContain('END:VCALENDAR');
    expect(result).not.toContain('BEGIN:VEVENT');
    // Should still be valid iCal
    expect(result).toContain('VERSION:2.0');
  });

  it('uses CRLF line endings per RFC 5545', () => {
    const result = generateICal({ calName: 'Test', events: [] });
    // Every line should end with \r\n
    const lines = result.split('\r\n');
    // Last element after split should be empty (trailing CRLF)
    expect(lines[lines.length - 1]).toBe('');
    // First line should be BEGIN:VCALENDAR
    expect(lines[0]).toBe('BEGIN:VCALENDAR');
  });

  it('escapes special characters in summary and description', () => {
    const events: ICalEvent[] = [
      {
        uid: 'test@test',
        dtstart: '2026-01-01',
        summary: 'Ram, Sita; and Lakshman',
        description: 'Line 1\nLine 2, with commas; and semicolons',
      },
    ];

    const result = generateICal({ calName: 'Test', events });

    expect(result).toContain('SUMMARY:Ram\\, Sita\\; and Lakshman');
    expect(result).toContain('DESCRIPTION:Line 1\\nLine 2\\, with commas\\; and semicolons');
  });

  it('includes URL when provided', () => {
    const events: ICalEvent[] = [
      {
        uid: 'test@test',
        dtstart: '2026-01-01',
        summary: 'Test',
        url: 'https://dekhopanchang.com/en/calendar/diwali',
      },
    ];

    const result = generateICal({ calName: 'Test', events });
    expect(result).toContain('URL:https://dekhopanchang.com/en/calendar/diwali');
  });

  it('handles timed UTC events (not all-day)', () => {
    const events: ICalEvent[] = [
      {
        uid: 'timed@test',
        dtstart: '20261108T140000Z',
        dtend: '20261108T160000Z',
        summary: 'Timed Event',
      },
    ];

    const result = generateICal({ calName: 'Test', events });

    // Timed events should NOT have VALUE=DATE
    expect(result).toContain('DTSTART:20261108T140000Z');
    expect(result).toContain('DTEND:20261108T160000Z');
    expect(result).not.toContain('VALUE=DATE');
  });

  it('folds long lines at 75 octets', () => {
    const longDesc = 'A'.repeat(200);
    const events: ICalEvent[] = [
      {
        uid: 'long@test',
        dtstart: '2026-01-01',
        summary: 'Test',
        description: longDesc,
      },
    ];

    const result = generateICal({ calName: 'Test', events });

    // Find the DESCRIPTION line(s) — they should be folded
    const allLines = result.split('\r\n');
    const descLineIdx = allLines.findIndex(l => l.startsWith('DESCRIPTION:'));
    expect(descLineIdx).toBeGreaterThan(-1);
    // The raw DESCRIPTION: + 200 A's = 212 chars, must be folded
    expect(allLines[descLineIdx].length).toBeLessThanOrEqual(75);
    // Next line(s) should be continuation (start with space)
    expect(allLines[descLineIdx + 1].startsWith(' ')).toBe(true);
  });
});
