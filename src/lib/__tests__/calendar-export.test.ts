import { describe, it, expect } from 'vitest';
import { buildExportFilename } from '@/lib/calendar/export-filename';

describe('buildExportFilename', () => {
  it('produces lowercase kebab-case slug from masa name', () => {
    expect(buildExportFilename({ masaName: 'Vaisakha', year: 2026, ext: 'pdf' }))
      .toBe('tithi-calendar-vaisakha-2026.pdf');
  });

  it('handles adhika masa (compound name)', () => {
    expect(buildExportFilename({ masaName: 'Adhika Ashadha', year: 2026, ext: 'jpg' }))
      .toBe('tithi-calendar-adhika-ashadha-2026.jpg');
  });

  it('falls back to month-{n} when masaName empty', () => {
    expect(buildExportFilename({ masaName: '', year: 2026, month: 5, ext: 'png' }))
      .toBe('tithi-calendar-month-5-2026.png');
  });

  it('strips Devanagari and falls back when masaName has no Latin chars', () => {
    expect(buildExportFilename({ masaName: 'वैशाख', year: 2026, month: 5, ext: 'pdf' }))
      .toBe('tithi-calendar-month-5-2026.pdf');
  });

  it('supports png extension', () => {
    expect(buildExportFilename({ masaName: 'Shravan', year: 2026, ext: 'png' }))
      .toBe('tithi-calendar-shravan-2026.png');
  });
});
