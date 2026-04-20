/**
 * Domain Narrator — Unit Tests
 *
 * Verifies all 9 narrative functions + the composition helper.
 */

import { describe, it, expect } from 'vitest';
import {
  narrateHouseLord,
  narrateOccupants,
  narrateAspects,
  narrateYogas,
  narrateDoshas,
  narrateVargaConfirmation,
  narrateDashaActivation,
  narrateTransitOverlay,
  narrateForwardTriggers,
  composeDomainNarrative,
} from '../kundali/domain-synthesis/narrator';
import type { LocaleText } from '@/types/panchang';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function assertBilingual(result: LocaleText) {
  expect(result.en).toBeTruthy();
  expect(result.en.length).toBeGreaterThan(0);
  expect(result.hi).toBeTruthy();
  expect((result.hi as string).length).toBeGreaterThan(0);
}

// ---------------------------------------------------------------------------
// 1. narrateHouseLord
// ---------------------------------------------------------------------------

describe('narrateHouseLord', () => {
  const base = {
    lordPlanetId: 2,
    lordPlanetName: { en: 'Mars', hi: 'मंगल' } as LocaleText,
    lordHouse: 12,
    lordSign: 12,
    lordSignName: { en: 'Pisces', hi: 'मीन' } as LocaleText,
    dignity: 'debilitated',
    isRetrograde: false,
    primaryHouse: 7,
  };

  it('returns non-empty en + hi text', () => {
    assertBilingual(narrateHouseLord(base));
  });

  it('includes planet name and house number', () => {
    const result = narrateHouseLord(base);
    expect(result.en).toContain('Mars');
    expect(result.en).toContain('7th');
    expect(result.en).toContain('12th');
  });

  it('mentions retrograde when true', () => {
    const result = narrateHouseLord({ ...base, isRetrograde: true });
    expect(result.en).toContain('Retrograde');
    expect(result.hi).toContain('वक्री');
  });

  it('does not mention retrograde when false', () => {
    const result = narrateHouseLord(base);
    expect(result.en).not.toContain('Retrograde');
  });

  it('includes dignity label', () => {
    const result = narrateHouseLord(base);
    expect(result.en).toContain('debilitated');
  });

  it('adjusts vocabulary by age', () => {
    const young = narrateHouseLord({ ...base, nativeAge: 25 });
    const senior = narrateHouseLord({ ...base, nativeAge: 70 });
    expect(young.en).toContain('building');
    expect(senior.en).toContain('legacy');
  });
});

// ---------------------------------------------------------------------------
// 2. narrateOccupants
// ---------------------------------------------------------------------------

describe('narrateOccupants', () => {
  it('handles empty array gracefully', () => {
    const result = narrateOccupants({ house: 7, occupants: [] });
    assertBilingual(result);
    expect(result.en).toContain('No planets');
    expect(result.en).toContain('house lord');
  });

  it('describes benefic occupants', () => {
    const result = narrateOccupants({
      house: 7,
      occupants: [
        { planetId: 4, name: { en: 'Jupiter', hi: 'बृहस्पति' }, isBenefic: true },
      ],
    });
    assertBilingual(result);
    expect(result.en).toContain('Jupiter');
    expect(result.en).toContain('Benefic');
  });

  it('describes malefic occupants', () => {
    const result = narrateOccupants({
      house: 5,
      occupants: [
        { planetId: 6, name: { en: 'Saturn', hi: 'शनि' }, isBenefic: false },
      ],
    });
    assertBilingual(result);
    expect(result.en).toContain('Saturn');
    expect(result.en).toContain('challenging');
  });

  it('handles mixed benefic/malefic', () => {
    const result = narrateOccupants({
      house: 10,
      occupants: [
        { planetId: 4, name: { en: 'Jupiter', hi: 'बृहस्पति' }, isBenefic: true },
        { planetId: 6, name: { en: 'Saturn', hi: 'शनि' }, isBenefic: false },
      ],
    });
    assertBilingual(result);
    expect(result.en).toContain('Jupiter');
    expect(result.en).toContain('Saturn');
  });
});

// ---------------------------------------------------------------------------
// 3. narrateAspects
// ---------------------------------------------------------------------------

describe('narrateAspects', () => {
  it('returns non-empty en + hi', () => {
    const result = narrateAspects({
      house: 7,
      aspects: [
        { planetId: 6, name: { en: 'Saturn', hi: 'शनि' }, isBenefic: false, aspectType: 'full' },
      ],
    });
    assertBilingual(result);
    expect(result.en).toContain('Saturn');
  });

  it('handles empty aspects', () => {
    const result = narrateAspects({ house: 3, aspects: [] });
    assertBilingual(result);
    expect(result.en).toContain('No significant');
  });
});

// ---------------------------------------------------------------------------
// 4. narrateYogas
// ---------------------------------------------------------------------------

describe('narrateYogas', () => {
  it('returns non-empty en + hi', () => {
    const result = narrateYogas({
      yogas: [
        { name: 'Gajakesari Yoga', isAuspicious: true, strength: 'strong', impact: { en: 'wisdom and prosperity are indicated', hi: 'ज्ञान और समृद्धि संकेतित है' } },
      ],
    });
    assertBilingual(result);
    expect(result.en).toContain('Gajakesari Yoga');
    expect(result.en).toContain('strengthens');
  });

  it('handles empty yogas', () => {
    const result = narrateYogas({ yogas: [] });
    assertBilingual(result);
    expect(result.en).toContain('No significant yogas');
  });
});

// ---------------------------------------------------------------------------
// 5. narrateDoshas
// ---------------------------------------------------------------------------

describe('narrateDoshas', () => {
  it('returns non-empty en + hi', () => {
    const result = narrateDoshas({
      doshas: [
        { name: 'Mangal Dosha', severity: 'moderate', cancelled: false, impact: { en: 'affects marriage prospects', hi: 'विवाह की संभावनाओं को प्रभावित करता है' } },
      ],
    });
    assertBilingual(result);
    expect(result.en).toContain('Mangal Dosha');
  });

  it('handles cancelled doshas', () => {
    const result = narrateDoshas({
      doshas: [
        { name: 'Kaal Sarpa', severity: 'mild', cancelled: true, impact: { en: 'minor restriction', hi: 'मामूली प्रतिबंध' } },
      ],
    });
    expect(result.en).toContain('cancelled');
  });

  it('handles empty doshas', () => {
    const result = narrateDoshas({ doshas: [] });
    assertBilingual(result);
    expect(result.en).toContain('No significant doshas');
  });
});

// ---------------------------------------------------------------------------
// 6. narrateVargaConfirmation
// ---------------------------------------------------------------------------

describe('narrateVargaConfirmation', () => {
  it('returns non-empty en + hi', () => {
    const result = narrateVargaConfirmation({
      chartId: 'D9',
      promiseScore: 72,
      deliveryScore: 78,
      verdict: { en: 'Venus is exalted here — marriage stability is affirmed.', hi: 'शुक्र यहां उच्च है — विवाह स्थिरता की पुष्टि है।' },
      keyFindings: ['Venus exalted in D9', '7th lord well-placed'],
    });
    assertBilingual(result);
    expect(result.en).toContain('Navamsha');
    expect(result.en).toContain('78/100');
  });

  it('shows weak result for low score', () => {
    const result = narrateVargaConfirmation({
      chartId: 'D10',
      promiseScore: 40,
      deliveryScore: 35,
      verdict: { en: 'Career chart is weak.' },
      keyFindings: [],
    });
    expect(result.en).toContain('weaker manifestation');
  });
});

// ---------------------------------------------------------------------------
// 7. narrateDashaActivation
// ---------------------------------------------------------------------------

describe('narrateDashaActivation', () => {
  it('returns non-empty en + hi', () => {
    const result = narrateDashaActivation({
      mahaLordId: 6,
      mahaLordName: { en: 'Saturn', hi: 'शनि' },
      antarLordId: 3,
      antarLordName: { en: 'Mercury', hi: 'बुध' },
      activatesDomain: true,
      relationship: 'Saturn is your 7th lord.',
    });
    assertBilingual(result);
    expect(result.en).toContain('Saturn Mahadasha');
    expect(result.en).toContain('Mercury Antardasha');
    expect(result.en).toContain('directly activates');
  });

  it('shows background when domain is not activated', () => {
    const result = narrateDashaActivation({
      mahaLordId: 4,
      mahaLordName: { en: 'Jupiter', hi: 'बृहस्पति' },
      antarLordId: 5,
      antarLordName: { en: 'Venus', hi: 'शुक्र' },
      activatesDomain: false,
      relationship: '',
    });
    expect(result.en).toContain('background-level');
  });
});

// ---------------------------------------------------------------------------
// 8. narrateTransitOverlay
// ---------------------------------------------------------------------------

describe('narrateTransitOverlay', () => {
  it('returns non-empty en + hi', () => {
    const result = narrateTransitOverlay({
      transits: [
        { planetId: 4, planetName: { en: 'Jupiter', hi: 'बृहस्पति' }, house: 5, bindus: 5 },
      ],
    });
    assertBilingual(result);
    expect(result.en).toContain('Jupiter');
    expect(result.en).toContain('5th');
    expect(result.en).toContain('excellent');
  });

  it('handles empty transits', () => {
    const result = narrateTransitOverlay({ transits: [] });
    assertBilingual(result);
    expect(result.en).toContain('No major transits');
  });
});

// ---------------------------------------------------------------------------
// 9. narrateForwardTriggers
// ---------------------------------------------------------------------------

describe('narrateForwardTriggers', () => {
  it('returns non-empty en + hi', () => {
    const result = narrateForwardTriggers({
      triggers: [
        { date: 'June 2027', event: 'Jupiter enters your 7th', impact: 'positive' },
      ],
    });
    assertBilingual(result);
    expect(result.en).toContain('Watch for');
    expect(result.en).toContain('June 2027');
    expect(result.en).toContain('positive window');
  });

  it('respects count parameter', () => {
    const result = narrateForwardTriggers({
      triggers: [
        { date: 'June 2027', event: 'Event A', impact: 'positive' },
        { date: 'July 2027', event: 'Event B', impact: 'negative' },
        { date: 'Aug 2027', event: 'Event C', impact: 'neutral' },
      ],
      count: 1,
    });
    expect(result.en).toContain('Event A');
    expect(result.en).not.toContain('Event B');
  });

  it('handles empty triggers', () => {
    const result = narrateForwardTriggers({ triggers: [] });
    assertBilingual(result);
    expect(result.en).toContain('No significant upcoming');
  });
});

// ---------------------------------------------------------------------------
// composeDomainNarrative
// ---------------------------------------------------------------------------

describe('composeDomainNarrative', () => {
  it('joins 3+ blocks into coherent paragraph', () => {
    const blocks: LocaleText[] = [
      { en: 'Your 7th lord is strong.', hi: 'आपका 7वां स्वामी मजबूत है।' },
      { en: 'Jupiter blesses partnerships.', hi: 'बृहस्पति साझेदारी को आशीर्वाद देता है।' },
      { en: 'Saturn adds discipline.', hi: 'शनि अनुशासन जोड़ता है।' },
    ];
    const result = composeDomainNarrative(blocks);
    assertBilingual(result);
    // First block kept as-is, subsequent get connectors
    expect(result.en).toContain('Your 7th lord is strong.');
    expect(result.en).toContain('Additionally,');
    expect(result.en).toContain('Furthermore,');
  });

  it('returns single block unchanged', () => {
    const block: LocaleText = { en: 'Only one.', hi: 'केवल एक।' };
    const result = composeDomainNarrative([block]);
    expect(result.en).toBe('Only one.');
    expect(result.hi).toBe('केवल एक।');
  });

  it('handles empty array', () => {
    const result = composeDomainNarrative([]);
    expect(result.en).toBe('');
    expect(result.hi).toBe('');
  });

  it('skips empty blocks', () => {
    const blocks: LocaleText[] = [
      { en: 'First.', hi: 'पहला।' },
      { en: '', hi: '' },
      { en: 'Third.', hi: 'तीसरा।' },
    ];
    const result = composeDomainNarrative(blocks);
    expect(result.en).toContain('First.');
    expect(result.en).toContain('third.');
  });
});
