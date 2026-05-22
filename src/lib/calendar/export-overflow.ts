export interface FestivalRow {
  date: string;
  name: string;
}

export interface SplitResult<T> {
  columns: T[][];
  overflow: number;
}

const SINGLE_COL_MAX = 8;
const TOTAL_MAX = 16;

/**
 * Decide how to render the festival rail in the calendar export.
 * - <= 8 entries: single column
 * - 9..16: balanced 2 columns (first column is the larger half on odd counts)
 * - > 16: truncate to 16, return `overflow` for a "+N more" indicator
 */
export function splitFestivalsForExport<T>(items: T[]): SplitResult<T> {
  if (items.length === 0) return { columns: [], overflow: 0 };

  if (items.length <= SINGLE_COL_MAX) {
    return { columns: [items], overflow: 0 };
  }

  const overflow = Math.max(0, items.length - TOTAL_MAX);
  const visible = items.slice(0, TOTAL_MAX);
  const half = Math.ceil(visible.length / 2);
  return {
    columns: [visible.slice(0, half), visible.slice(half)],
    overflow,
  };
}
