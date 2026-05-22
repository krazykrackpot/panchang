export type ExportExt = 'pdf' | 'jpg' | 'png';

export interface FilenameInput {
  masaName: string;
  year: number;
  ext: ExportExt;
  /** Fallback when masaName has no usable Latin characters (1-indexed). */
  month?: number;
}

/**
 * Build a download filename like `tithi-calendar-vaisakha-2026.pdf`.
 * Falls back to `tithi-calendar-month-{n}-{year}.{ext}` when the masa name
 * has no Latin chars (e.g. caller passed the localised Devanagari name).
 */
export function buildExportFilename({ masaName, year, ext, month }: FilenameInput): string {
  const slug = masaName
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

  const usable = slug.length > 0 ? slug : `month-${month ?? 0}`;
  return `tithi-calendar-${usable}-${year}.${ext}`;
}
