import { describe, it, expect } from 'vitest';
import { buildExportFilename } from '@/lib/calendar/export-filename';
import { splitFestivalsForExport } from '@/lib/calendar/export-overflow';

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

describe('splitFestivalsForExport', () => {
  const make = (n: number) =>
    Array.from({ length: n }, (_, i) => ({
      date: `2026-05-${(i + 1).toString().padStart(2, '0')}`,
      name: `F${i + 1}`,
    }));

  it('returns a single column when count <= 8', () => {
    const result = splitFestivalsForExport(make(8));
    expect(result.columns).toHaveLength(1);
    expect(result.columns[0]).toHaveLength(8);
    expect(result.overflow).toBe(0);
  });

  it('splits into 2 balanced columns when count is 9..16', () => {
    const result = splitFestivalsForExport(make(12));
    expect(result.columns).toHaveLength(2);
    expect(result.columns[0]).toHaveLength(6);
    expect(result.columns[1]).toHaveLength(6);
    expect(result.overflow).toBe(0);
  });

  it('truncates to 16 with overflow indicator when count > 16', () => {
    const result = splitFestivalsForExport(make(20));
    expect(result.columns).toHaveLength(2);
    expect(result.columns[0]).toHaveLength(8);
    expect(result.columns[1]).toHaveLength(8);
    expect(result.overflow).toBe(4);
  });

  it('handles empty list', () => {
    const result = splitFestivalsForExport([]);
    expect(result.columns).toEqual([]);
    expect(result.overflow).toBe(0);
  });

  it('handles odd count in 2-col mode (9 -> 5/4)', () => {
    const result = splitFestivalsForExport(make(9));
    expect(result.columns).toHaveLength(2);
    expect(result.columns[0]).toHaveLength(5);
    expect(result.columns[1]).toHaveLength(4);
  });
});
