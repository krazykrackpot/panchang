// src/components/gamification/StreakGrid.tsx
import { todayIst, daysBetweenIst } from '@/lib/gamification/ist-day';

interface Props {
  streakDays: number;
  streakLastVisit: string | null;
}

/**
 * 15-day rolling grid. Lit cells = days within the current streak that fall in the last 15 days.
 * Today's cell is highlighted.
 */
export function StreakGrid({ streakDays, streakLastVisit }: Props) {
  const today = todayIst();
  const cells: ('lit' | 'today' | 'unlit')[] = [];

  for (let i = 14; i >= 0; i--) {
    const [y, m, d] = today.split('-').map(Number);
    const date = new Date(Date.UTC(y, m - 1, d));
    date.setUTCDate(date.getUTCDate() - i);
    const yy = date.getUTCFullYear();
    const mm = String(date.getUTCMonth() + 1).padStart(2, '0');
    const dd = String(date.getUTCDate()).padStart(2, '0');
    const cellDay = `${yy}-${mm}-${dd}`;

    if (cellDay === today && streakLastVisit === today) {
      cells.push('today');
    } else if (streakLastVisit) {
      const gap = daysBetweenIst(cellDay, streakLastVisit);
      if (gap >= 0 && gap < streakDays) cells.push('lit');
      else cells.push('unlit');
    } else {
      cells.push('unlit');
    }
  }

  return (
    <div style={{
      display: 'grid', gridTemplateColumns: 'repeat(15, 1fr)',
      gap: 2, marginTop: 8,
    }}>
      {cells.map((s, i) => (
        <div key={i} style={{
          aspectRatio: '1',
          borderRadius: 2,
          background:
            s === 'today' ? '#fff5cf' :
            s === 'lit'   ? 'linear-gradient(135deg, #f0d48a, #d4a853)' :
                            'rgba(255,255,255,0.06)',
          boxShadow: s === 'today' ? '0 0 4px #f0d48a' : undefined,
        }}/>
      ))}
    </div>
  );
}
