/**
 * iCal Generator — RFC 5545 compliant .ics file builder
 *
 * Generates iCalendar format strings for Vedic calendar events
 * (festivals, eclipses, ekadashi, etc.).
 *
 * Spec reference: https://datatracker.ietf.org/doc/html/rfc5545
 *
 * Limitation: This generator produces all-day events (DATE values)
 * and timed events (DATE-TIME in UTC). It does NOT handle VTIMEZONE
 * components — timed events must be pre-converted to UTC before passing in.
 */

export interface ICalEvent {
  uid: string;
  /** YYYY-MM-DD for all-day events, or YYYYMMDDTHHMMSSZ for timed UTC events */
  dtstart: string;
  /** Optional end date/time. Omit for single-day all-day events. */
  dtend?: string;
  summary: string;
  description?: string;
  categories?: string[];
  url?: string;
  /** Optional alarm. trigger uses RFC 5545 duration format, e.g. '-P1D' for 1 day before */
  alarm?: { trigger: string; description: string };
}

export interface ICalOptions {
  calName: string;
  /** IANA timezone for X-WR-TIMEZONE header (informational only) */
  timezone?: string;
  events: ICalEvent[];
}

/**
 * Escape text per RFC 5545 Section 3.3.11:
 * - Backslash → \\
 * - Semicolons → \;
 * - Commas → \,
 * - Newlines → \n (literal backslash + n)
 */
export function escapeICalText(text: string): string {
  return text
    .replace(/\\/g, '\\\\')
    .replace(/;/g, '\\;')
    .replace(/,/g, '\\,')
    .replace(/\r?\n/g, '\\n');
}

/**
 * Fold long lines per RFC 5545 Section 3.1:
 * Lines longer than 75 octets SHOULD be folded by inserting a CRLF
 * followed by a single whitespace character (space or tab).
 */
function foldLine(line: string): string {
  if (line.length <= 75) return line;

  const parts: string[] = [];
  parts.push(line.slice(0, 75));
  let pos = 75;
  while (pos < line.length) {
    // Continuation lines start with a space, so effective content is 74 chars
    parts.push(' ' + line.slice(pos, pos + 74));
    pos += 74;
  }
  return parts.join('\r\n');
}

/**
 * Format a YYYY-MM-DD string as an iCal DATE value (YYYYMMDD).
 * If the input already looks like YYYYMMDD or has a T (datetime), return as-is.
 */
function formatDateValue(dateStr: string): string {
  // Already in iCal format (YYYYMMDD or YYYYMMDDTHHMMSS or YYYYMMDDTHHMMSSZ)
  if (/^\d{8}(T\d{6}Z?)?$/.test(dateStr)) return dateStr;

  // YYYY-MM-DD → YYYYMMDD
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
    return dateStr.replace(/-/g, '');
  }

  return dateStr;
}

/**
 * Determine if a dtstart value is an all-day date (no time component).
 */
function isAllDay(dtstart: string): boolean {
  const formatted = formatDateValue(dtstart);
  return /^\d{8}$/.test(formatted);
}

/**
 * Generate an RFC 5545 compliant iCalendar string.
 *
 * @param options - Calendar name, timezone, and events
 * @returns Complete .ics file content as a string
 */
export function generateICal(options: ICalOptions): string {
  const { calName, timezone, events } = options;

  const lines: string[] = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Dekho Panchang//Vedic Calendar//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    `X-WR-CALNAME:${escapeICalText(calName)}`,
  ];

  if (timezone) {
    lines.push(`X-WR-TIMEZONE:${timezone}`);
  }

  for (const event of events) {
    lines.push('BEGIN:VEVENT');
    lines.push(`UID:${event.uid}`);

    // DTSTAMP — required by RFC 5545, use current time in UTC
    const now = new Date();
    const dtstamp = now.toISOString().replace(/[-:]/g, '').replace(/\.\d+Z$/, 'Z');
    lines.push(`DTSTAMP:${dtstamp}`);

    const startFormatted = formatDateValue(event.dtstart);
    if (isAllDay(event.dtstart)) {
      lines.push(`DTSTART;VALUE=DATE:${startFormatted}`);
      if (event.dtend) {
        lines.push(`DTEND;VALUE=DATE:${formatDateValue(event.dtend)}`);
      } else {
        // All-day events: DTEND = DTSTART + 1 day (per RFC 5545, DTEND is exclusive)
        const y = parseInt(startFormatted.slice(0, 4));
        const m = parseInt(startFormatted.slice(4, 6)) - 1;
        const d = parseInt(startFormatted.slice(6, 8));
        const nextDay = new Date(y, m, d + 1);
        const endStr = `${nextDay.getFullYear()}${String(nextDay.getMonth() + 1).padStart(2, '0')}${String(nextDay.getDate()).padStart(2, '0')}`;
        lines.push(`DTEND;VALUE=DATE:${endStr}`);
      }
    } else {
      lines.push(`DTSTART:${startFormatted}`);
      if (event.dtend) {
        lines.push(`DTEND:${formatDateValue(event.dtend)}`);
      }
    }

    lines.push(`SUMMARY:${escapeICalText(event.summary)}`);

    if (event.description) {
      lines.push(`DESCRIPTION:${escapeICalText(event.description)}`);
    }

    if (event.categories && event.categories.length > 0) {
      lines.push(`CATEGORIES:${event.categories.map(escapeICalText).join(',')}`);
    }

    if (event.url) {
      lines.push(`URL:${event.url}`);
    }

    // Alarm (VALARM)
    if (event.alarm) {
      lines.push('BEGIN:VALARM');
      lines.push('ACTION:DISPLAY');
      lines.push(`TRIGGER:${event.alarm.trigger}`);
      lines.push(`DESCRIPTION:${escapeICalText(event.alarm.description)}`);
      lines.push('END:VALARM');
    }

    lines.push('END:VEVENT');
  }

  lines.push('END:VCALENDAR');

  // RFC 5545 requires CRLF line endings; fold long lines
  return lines.map(foldLine).join('\r\n') + '\r\n';
}
