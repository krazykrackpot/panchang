import { describe, it, expect } from 'vitest';
import { generateDailyProtocol } from '../protocol-engine';

describe('generateDailyProtocol', () => {
  const baseParams = {
    tithi: { number: 3, name: 'Tritiya' },
    nakshatra: { number: 4, name: 'Rohini' },
    sunrise: '06:15',
    sunset: '20:30',
    horaSlots: [
      { planetId: 0, startTime: '06:15', endTime: '07:24', isCurrent: true },
      { planetId: 5, startTime: '07:24', endTime: '08:33', isCurrent: false },
    ],
    rahuKaal: { start: '12:24', end: '14:00' },
    yamaganda: { start: '07:30', end: '09:06' },
    varjyam: [{ start: '15:12', end: '16:48' }],
    prakriti: null,
  };

  it('returns complete protocol structure', () => {
    const protocol = generateDailyProtocol(baseParams);
    expect(protocol.tithi.number).toBe(3);
    expect(protocol.nakshatra.number).toBe(4);
    expect(protocol.horaSchedule.length).toBeGreaterThanOrEqual(2);
    expect(protocol.energyPhases.length).toBeGreaterThanOrEqual(3);
    expect(protocol.nutrition).toBeDefined();
    expect(protocol.nutrition.agniLevel).toBeDefined();
    expect(protocol.practice).toBeDefined();
    expect(protocol.deadZones.length).toBeGreaterThanOrEqual(2);
  });

  it('calculates moon phase from tithi', () => {
    const protocol = generateDailyProtocol(baseParams);
    // Tithi 3 (Shukla) -> 3/15 * 100 = 20%
    expect(protocol.moonPhasePercent).toBe(20);
  });

  it('calculates waning moon phase correctly', () => {
    const protocol = generateDailyProtocol({
      ...baseParams,
      tithi: { number: 20, name: 'Panchami' },
    });
    // Tithi 20 (Krishna) -> (30 - 20) / 15 * 100 = 66.67 -> 67%
    expect(protocol.moonPhasePercent).toBe(67);
  });

  it('classifies nakshatra activity type', () => {
    const protocol = generateDailyProtocol(baseParams);
    // Rohini (4) is Fixed
    expect(protocol.practice.nakshatraActivity).toBe('fixed');
  });

  it('classifies movable nakshatra', () => {
    const protocol = generateDailyProtocol({
      ...baseParams,
      nakshatra: { number: 1, name: 'Ashwini' },
    });
    expect(protocol.practice.nakshatraActivity).toBe('movable');
  });

  it('classifies sharp nakshatra', () => {
    const protocol = generateDailyProtocol({
      ...baseParams,
      nakshatra: { number: 5, name: 'Mrigashira' },
    });
    expect(protocol.practice.nakshatraActivity).toBe('sharp');
  });

  it('classifies soft nakshatra', () => {
    const protocol = generateDailyProtocol({
      ...baseParams,
      nakshatra: { number: 3, name: 'Krittika' },
    });
    expect(protocol.practice.nakshatraActivity).toBe('soft');
  });

  it('classifies mixed nakshatra', () => {
    const protocol = generateDailyProtocol({
      ...baseParams,
      nakshatra: { number: 2, name: 'Bharani' },
    });
    expect(protocol.practice.nakshatraActivity).toBe('mixed');
  });

  it('has dual voice on all text fields', () => {
    const protocol = generateDailyProtocol(baseParams);
    expect(protocol.moonPhaseLabel.traditional).toBeTruthy();
    expect(protocol.moonPhaseLabel.modern).toBeTruthy();
    expect(protocol.practice.focus.traditional).toBeTruthy();
    expect(protocol.practice.focus.modern).toBeTruthy();
    for (const dz of protocol.deadZones) {
      expect(dz.advice.traditional).toBeTruthy();
      expect(dz.advice.modern).toBeTruthy();
    }
  });

  it('includes prakriti advice when profile provided', () => {
    const withPrakriti = generateDailyProtocol({
      ...baseParams,
      prakriti: {
        dominant: 'pitta',
        secondary: 'vata',
        scores: { vata: 1, pitta: 3, kapha: 1 },
        label: 'Pitta-Vata',
      },
    });
    expect(withPrakriti.prakritiAdvice).not.toBeNull();
    expect(withPrakriti.prakritiAdvice!.traditional).toContain('cool');
    expect(withPrakriti.prakritiAdvice!.modern).toBeTruthy();
  });

  it('returns null prakriti advice when no profile', () => {
    const protocol = generateDailyProtocol(baseParams);
    expect(protocol.prakritiAdvice).toBeNull();
  });

  it('maps nutrition to tithi type', () => {
    // Tithi 3 = Jaya -> strong agni
    const protocol = generateDailyProtocol(baseParams);
    expect(protocol.nutrition.agniLevel).toBe('strong');
  });

  it('maps rikta tithi to low agni', () => {
    const protocol = generateDailyProtocol({
      ...baseParams,
      tithi: { number: 4, name: 'Chaturthi' },
    });
    expect(protocol.nutrition.agniLevel).toBe('low');
  });

  it('maps nanda tithi to strong agni', () => {
    const protocol = generateDailyProtocol({
      ...baseParams,
      tithi: { number: 6, name: 'Shashthi' },
    });
    expect(protocol.nutrition.agniLevel).toBe('strong');
  });

  it('sets paksha correctly for shukla and krishna', () => {
    const shukla = generateDailyProtocol(baseParams);
    expect(shukla.tithi.paksha).toBe('Shukla');

    const krishna = generateDailyProtocol({
      ...baseParams,
      tithi: { number: 18, name: 'Tritiya' },
    });
    expect(krishna.tithi.paksha).toBe('Krishna');
  });

  it('computes energy phases covering sunrise to evening', () => {
    const protocol = generateDailyProtocol(baseParams);
    // First phase starts at sunrise
    expect(protocol.energyPhases[0].startTime).toBe('06:15');
    // Last phase ends at sunset+4h
    const lastPhase = protocol.energyPhases[protocol.energyPhases.length - 1];
    expect(lastPhase).toBeDefined();
  });

  it('populates hora schedule with planet names and activities', () => {
    const protocol = generateDailyProtocol(baseParams);
    const sunHora = protocol.horaSchedule[0];
    expect(sunHora.planetName).toBe('Sun');
    expect(sunHora.activity.traditional).toContain('Leadership');
    expect(sunHora.activity.modern).toContain('decisions');

    const venusHora = protocol.horaSchedule[1];
    expect(venusHora.planetName).toBe('Venus');
    expect(venusHora.activity.traditional).toContain('Arts');
  });

  it('creates dead zones from all inauspicious periods', () => {
    const protocol = generateDailyProtocol(baseParams);
    const names = protocol.deadZones.map((dz) => dz.name);
    expect(names).toContain('Rahu Kaal');
    expect(names).toContain('Yamaganda');
    expect(names).toContain('Varjyam');
  });

  it('handles missing optional inauspicious periods', () => {
    const protocol = generateDailyProtocol({
      ...baseParams,
      rahuKaal: undefined,
      yamaganda: undefined,
      varjyam: undefined,
    });
    expect(protocol.deadZones.length).toBe(0);
  });

  it('handles multiple varjyam windows', () => {
    const protocol = generateDailyProtocol({
      ...baseParams,
      varjyam: [
        { start: '03:12', end: '04:48' },
        { start: '15:12', end: '16:48' },
      ],
    });
    const varjyamZones = protocol.deadZones.filter((dz) => dz.name === 'Varjyam');
    expect(varjyamZones.length).toBe(2);
  });

  it('computes nutrition eating window relative to sunrise/sunset', () => {
    const protocol = generateDailyProtocol(baseParams);
    // Eating window: sunrise+1h to sunset-1h
    expect(protocol.nutrition.eatingWindow.start).toBe('07:15');
    expect(protocol.nutrition.eatingWindow.end).toBe('19:30');
    // Best meal time: sunrise+5h
    expect(protocol.nutrition.bestMealTime).toBe('11:15');
  });
});
