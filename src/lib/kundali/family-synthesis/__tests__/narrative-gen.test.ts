import { describe, it, expect } from 'vitest';
import {
  generateMarriageActionItems,
  generateChildActionItems,
  generateFamilySummary,
  generateMonthlyForecast,
} from '../narrative-gen';
import type { TransitRelationshipImpact, DashaSyncAnalysis, SynastryHighlight } from '../types';

const mockTransitImpact: TransitRelationshipImpact = {
  overallTone: 'supportive',
  yourTransits: [{ planet: 'Jupiter', house: 7, sign: 'Libra', effect: { en: 'Jupiter supports partnership.', hi: 'गुरु साझेदारी का समर्थन करता है।' } }],
  theirTransits: [],
  narrative: { en: 'Supportive transits.', hi: 'सहायक गोचर।' },
};

const mockDashaSync: DashaSyncAnalysis = {
  inSync: true,
  yourDasha: 'Venus-Jupiter',
  theirDasha: 'Moon-Venus',
  yourActivation: ['7th'],
  theirActivation: ['7th'],
  narrative: { en: 'Both activating 7th.', hi: 'दोनों 7वें भाव सक्रिय।' },
};

const mockSynastry: SynastryHighlight[] = [
  { yourPlanet: 'Venus', theirPlanet: 'Jupiter', aspect: 'conjunction', orb: 2, nature: 'harmonious', interpretation: { en: 'Deep emotional bond.', hi: 'गहरा भावनात्मक बंधन।' } },
];

describe('narrative-gen', () => {
  it('generates marriage action items', () => {
    const items = generateMarriageActionItems(mockTransitImpact, mockDashaSync, mockSynastry, 28);
    expect(items.length).toBeGreaterThan(0);
    expect(items.length).toBeLessThanOrEqual(5);
    expect(items[0].type).toMatch(/do|avoid|watch/);
    expect(items[0].text.en).toBeTruthy();
    expect(items[0].relevance).toBeGreaterThanOrEqual(0);
  });

  it('generates challenging marriage items', () => {
    const challengingTransit: TransitRelationshipImpact = {
      ...mockTransitImpact,
      overallTone: 'challenging',
      yourTransits: [{ planet: 'Saturn', house: 7, sign: 'Libra', effect: { en: 'Saturn tests.', hi: 'शनि परीक्षा।' } }],
    };
    const items = generateMarriageActionItems(challengingTransit, mockDashaSync, mockSynastry);
    const avoidItems = items.filter(i => i.type === 'avoid');
    expect(avoidItems.length).toBeGreaterThan(0);
  });

  it('generates child action items', () => {
    const items = generateChildActionItems(mockTransitImpact, mockDashaSync, 'Arjun');
    expect(items.length).toBeGreaterThan(0);
    expect(items[0].text.en).toBeTruthy();
    // Child name should appear in at least one item
    const hasChildName = items.some(i => i.text.en.includes('Arjun'));
    expect(hasChildName).toBe(true);
  });

  it('generates family summary', () => {
    const summary = generateFamilySummary(true, 1, 'supportive', true);
    expect(summary.en).toBeTruthy();
    expect(summary.en.length).toBeGreaterThan(20);
    expect(summary.hi).toBeTruthy();
  });

  it('generates family summary without spouse', () => {
    const summary = generateFamilySummary(false, 2);
    expect(summary.en).toContain('2 children');
  });

  it('generates monthly forecast', () => {
    const forecast = generateMonthlyForecast(mockTransitImpact, mockDashaSync, 'marriage');
    expect(forecast.en).toBeTruthy();
    expect(forecast.hi).toBeTruthy();
    // Should contain the month name
    const monthName = new Date().toLocaleDateString('en', { month: 'long' });
    expect(forecast.en).toContain(monthName);
  });
});
