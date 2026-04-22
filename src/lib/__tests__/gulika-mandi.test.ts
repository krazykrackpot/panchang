import { describe, it, expect } from 'vitest';
import { generateKundali } from '@/lib/ephem/kundali-calc';

describe('Gulika and Mandi computation', () => {
  const kundali = generateKundali({
    name: 'Test', date: '1990-05-15', time: '14:30',
    place: 'Delhi', lat: 28.6139, lng: 77.2090,
    timezone: 'Asia/Kolkata', ayanamsha: 'lahiri',
  });

  it('includes Gulika in upagrahas', () => {
    const gulika = kundali.upagrahas?.find(u => u.name.en === 'Gulika');
    expect(gulika).toBeDefined();
    expect(gulika!.longitude).toBeGreaterThanOrEqual(0);
    expect(gulika!.longitude).toBeLessThan(360);
    expect(gulika!.sign).toBeGreaterThanOrEqual(1);
    expect(gulika!.sign).toBeLessThanOrEqual(12);
  });

  it('includes Mandi in upagrahas', () => {
    const mandi = kundali.upagrahas?.find(u => u.name.en === 'Mandi');
    expect(mandi).toBeDefined();
    expect(mandi!.longitude).toBeGreaterThanOrEqual(0);
    expect(mandi!.longitude).toBeLessThan(360);
  });

  it('Gulika and Mandi are within 15 degrees of each other', () => {
    const gulika = kundali.upagrahas?.find(u => u.name.en === 'Gulika');
    const mandi = kundali.upagrahas?.find(u => u.name.en === 'Mandi');
    if (gulika && mandi) {
      let diff = Math.abs(gulika.longitude - mandi.longitude);
      if (diff > 180) diff = 360 - diff;
      expect(diff).toBeLessThan(15); // same segment, start vs mid
    }
  });

  it('Gulika is distinct from the 5 Sun-derived upagrahas', () => {
    const gulika = kundali.upagrahas?.find(u => u.name.en === 'Gulika');
    const others = kundali.upagrahas?.filter(u => !['Gulika', 'Mandi'].includes(u.name.en)) || [];
    for (const other of others) {
      expect(Math.abs(gulika!.longitude - other.longitude)).toBeGreaterThan(0.01);
    }
  });

  it('total upagrahas count is 7 (5 existing + Gulika + Mandi)', () => {
    expect(kundali.upagrahas).toHaveLength(7);
  });
});
