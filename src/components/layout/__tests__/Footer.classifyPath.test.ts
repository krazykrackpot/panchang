import { describe, it, expect } from 'vitest';
import { classifyPath, sectionsForVariant, type FooterVariant } from '../Footer.routes';

describe('classifyPath', () => {
  it.each([
    // Hub variant — full 4-column footer
    ['/',                                  'all'],
    ['/en',                                'all'],
    ['/about',                             'all'],
    ['/hi/about',                          'all'],
    ['/about/methodology',                 'all'],
    ['/en/about/methodology',              'all'],
    ['/vs/drik-panchang',                  'all'],
    ['/mai/vs/prokerala',                  'all'],
    ['/panchang',                          'all'],
    ['/kundali',                           'all'],
    ['/matching',                          'all'],
    ['/learn',                             'all'],

    // Calendars + Deep Dives — date / calendar / festival surfaces
    ['/choghadiya/2026-06-08',             'cals-deep'],
    ['/en/choghadiya/2026-06-08',          'cals-deep'],
    ['/gauri-panchang/2026-06-08',         'cals-deep'],
    ['/panchang/date/2026-06-08',          'cals-deep'],
    ['/festivals/diwali/2026',             'cals-deep'],
    ['/calendar/diwali',                   'cals-deep'],
    ['/calendars',                         'cals-deep'],
    ['/ekadashi',                          'cals-deep'],
    ['/transits',                          'cals-deep'],
    ['/vrat-katha/karva-chauth',           'cals-deep'],
    ['/puja/diwali',                       'cals-deep'],
    ['/dates/ekadashi',                    'cals-deep'],

    // Calendars + Learn — city + horoscope
    ['/panchang/delhi',                    'cals-learn'],
    ['/hi/panchang/delhi',                 'cals-learn'],
    ['/horoscope/mesh',                    'cals-learn'],
    ['/horoscope/mesh/2026-06-08',         'cals-learn'],
    ['/horoscope/mesh/weekly',             'cals-learn'],

    // Tools + Learn
    ['/sign-calculator',                   'tools-learn'],
    ['/sade-sati',                         'tools-learn'],
    ['/varshaphal',                        'tools-learn'],
    ['/kp-system',                         'tools-learn'],
    ['/kp/prashna',                        'tools-learn'],
    ['/baby-names/ashwini',                'tools-learn'],
    ['/devotional/chalisa/hanuman',        'tools-learn'],
    ['/rahu-kaal',                         'tools-learn'],
    ['/kundali/lagna/aries',               'tools-learn'],
    ['/matching/mesh-and-simha',           'tools-learn'],

    // Learn + Deep Dives
    ['/learn/grahas',                      'learn-deep'],
    ['/learn/yoga/gajakesari-yoga',        'learn-deep'],
    ['/learn/modules/0-1',                 'learn-deep'],
    ['/learn/nakshatra-pada/ashwini-pada-1', 'learn-deep'],

    // Default fallback — tools + deep dives
    ['/privacy',                           'tools-deep'],
    ['/terms',                             'tools-deep'],
    ['/refunds',                           'tools-deep'],
    ['/pricing',                           'tools-deep'],
    ['/widget',                            'tools-deep'],
  ])('classifies %s → %s', (path, expected) => {
    expect(classifyPath(path)).toBe(expected as FooterVariant);
  });

  it('strips multi-character locale prefixes (mai, sa)', () => {
    expect(classifyPath('/mai/panchang/delhi')).toBe('cals-learn');
    expect(classifyPath('/sa/learn/grahas')).toBe('learn-deep');
  });
});

describe('sectionsForVariant', () => {
  it('returns 4 sections for hub variant', () => {
    expect(sectionsForVariant('all')).toEqual([0, 1, 2, 3]);
  });
  it('returns 2 sections for every non-hub variant', () => {
    for (const v of ['tools-learn', 'cals-deep', 'cals-learn', 'tools-deep', 'learn-deep'] as const) {
      expect(sectionsForVariant(v)).toHaveLength(2);
    }
  });
  it('each non-hub variant returns indices that are subset of [0..3]', () => {
    for (const v of ['tools-learn', 'cals-deep', 'cals-learn', 'tools-deep', 'learn-deep'] as const) {
      for (const idx of sectionsForVariant(v)) {
        expect(idx).toBeGreaterThanOrEqual(0);
        expect(idx).toBeLessThanOrEqual(3);
      }
    }
  });
});
