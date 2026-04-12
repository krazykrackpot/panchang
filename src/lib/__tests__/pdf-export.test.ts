import { describe, it, expect, vi } from 'vitest';

// Mock jsPDF since it needs DOM — must be a constructor (called with `new`)
const mockSave = vi.fn();
vi.mock('jspdf', () => {
  class MockJsPDF {
    save = mockSave;
    setFillColor = vi.fn();
    setTextColor = vi.fn();
    setDrawColor = vi.fn();
    setLineWidth = vi.fn();
    setFontSize = vi.fn();
    setFont = vi.fn();
    rect = vi.fn();
    roundedRect = vi.fn();
    line = vi.fn();
    text = vi.fn();
    circle = vi.fn();
    addPage = vi.fn();
    getTextWidth = vi.fn().mockReturnValue(20);
    internal = { pageSize: { getWidth: () => 210, getHeight: () => 297 } };
  }
  return { default: MockJsPDF };
});

// Mock the transit module since it may have complex dependencies
vi.mock('@/lib/transit/personal-transits', () => ({
  computePersonalTransits: vi.fn().mockReturnValue([]),
  computeUpcomingTransitions: vi.fn().mockReturnValue([]),
}));

import { exportKundaliPDF } from '@/lib/export/pdf-kundali';
import type { KundaliData } from '@/types/kundali';

const minimalKundali: KundaliData = {
  birthData: {
    name: 'Test User',
    date: '2000-01-01',
    time: '12:00',
    place: 'Delhi',
    lat: 28.6,
    lng: 77.2,
    timezone: 'Asia/Kolkata',
    ayanamsha: 'lahiri',
  },
  ascendant: {
    degree: 45.5,
    sign: 2,
    signName: { en: 'Taurus', hi: 'वृष', sa: 'वृषभम्' },
  },
  planets: Array.from({ length: 9 }, (_, i) => ({
    planet: { id: i, name: { en: `Planet${i}`, hi: `ग्रह${i}`, sa: `ग्रह${i}` } },
    longitude: i * 40,
    latitude: 0,
    speed: i === 6 ? -0.05 : 0.5,
    sign: (i % 12) + 1,
    signName: { en: 'Aries', hi: 'मेष', sa: 'मेषम्' },
    house: (i % 12) + 1,
    nakshatra: {
      id: (i % 27) + 1,
      name: { en: 'Ashwini', hi: 'अश्विनी', sa: 'अश्विनी' },
      lord: { en: 'Ketu', hi: 'केतु', sa: 'केतुः' },
    },
    pada: 1,
    degree: `${(i * 40 % 30).toFixed(2)}°`,
    isRetrograde: i === 6,
    isCombust: false,
    isExalted: i === 0,
    isDebilitated: false,
    isOwnSign: i === 2,
  })),
  houses: Array.from({ length: 12 }, (_, i) => ({
    house: i + 1,
    degree: i * 30,
    sign: i + 1,
    signName: { en: 'Sign', hi: 'राशि', sa: 'राशिः' },
    lord: i,
    lordName: { en: 'Lord', hi: 'स्वामी', sa: 'स्वामी' },
  })),
  chart: {
    houses: Array.from({ length: 12 }, () => []),
    ascendantDeg: 45,
    ascendantSign: 2,
  },
  navamshaChart: {
    houses: Array.from({ length: 12 }, () => []),
    ascendantDeg: 100,
    ascendantSign: 4,
  },
  dashas: [
    {
      planet: 'Jupiter',
      planetName: { en: 'Jupiter', hi: 'बृहस्पति', sa: 'बृहस्पतिः' },
      startDate: '2020-01-01T00:00:00.000Z',
      endDate: '2036-01-01T00:00:00.000Z',
      level: 'maha' as const,
      subPeriods: [
        {
          planet: 'Saturn',
          planetName: { en: 'Saturn', hi: 'शनि', sa: 'शनिः' },
          startDate: '2025-01-01T00:00:00.000Z',
          endDate: '2027-06-01T00:00:00.000Z',
          level: 'antar' as const,
        },
      ],
    },
  ],
  shadbala: [],
  ayanamshaValue: 24.15,
  julianDay: 2451545,
} as unknown as KundaliData;

describe('exportKundaliPDF', () => {
  it('does not throw with minimal kundali data', () => {
    expect(() => exportKundaliPDF(minimalKundali, 'en')).not.toThrow();
  });

  it('does not throw with Hindi locale', () => {
    expect(() => exportKundaliPDF(minimalKundali, 'hi')).not.toThrow();
  });

  it('does not throw with tippanni data', () => {
    const tippanni = {
      personality: {
        lagna: { title: 'Lagna', content: 'Test content', implications: ['Impl 1'] },
        summary: 'Test summary',
      },
      planetInsights: [
        {
          planetName: 'Sun',
          signName: 'Aries',
          house: 1,
          description: 'Test description',
          implications: 'Test implications',
        },
      ],
      yogas: [],
      doshas: [],
      lifeAreas: {},
      dashaInsight: {
        currentMaha: 'Jupiter',
        currentMahaAnalysis: 'Jupiter analysis',
        currentAntar: 'Saturn',
        currentAntarAnalysis: 'Saturn analysis',
      },
      remedies: {
        gemstones: [{ name: 'Ruby', planet: 'Sun', description: 'Wear ruby' }],
        mantras: [],
        practices: [],
      },
      strengthOverview: [],
      yearPredictions: {
        year: 2026,
        overview: 'Year overview',
        events: [],
        quarters: [],
        keyAdvice: 'Key advice text',
      },
    };
    expect(() =>
      exportKundaliPDF(minimalKundali, 'en', tippanni as any)
    ).not.toThrow();
  });

  it('calls doc.save with correct filename', () => {
    mockSave.mockClear();
    exportKundaliPDF(minimalKundali, 'en');
    expect(mockSave).toHaveBeenCalled();
    const savedFilename = mockSave.mock.calls[0][0] as string;
    expect(savedFilename).toContain('Test');
    expect(savedFilename).toContain('.pdf');
  });

  it('does not throw with Sanskrit locale', () => {
    expect(() => exportKundaliPDF(minimalKundali, 'sa')).not.toThrow();
  });
});
