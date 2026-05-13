import { describe, it, expect } from 'vitest';
import { scanNarrative, verifyScannedClaims } from '../validation/narrative-scanner';
import { EXPECTED_SAC } from './fixtures/sample-sac';

describe('scanNarrative', () => {
  // English planet-house extraction
  it('extracts "Saturn in the 7th house"', () => {
    const claims = scanNarrative('Saturn is in your 7th house, affecting partnerships.');
    expect(claims).toContainEqual(expect.objectContaining({ type: 'planet_house', planet: 6, house: 7 }));
  });

  it('extracts "Jupiter in the 4th house"', () => {
    const claims = scanNarrative('Jupiter in the 4th house brings domestic comfort.');
    expect(claims).toContainEqual(expect.objectContaining({ type: 'planet_house', planet: 4, house: 4 }));
  });

  // Hindi planet-house extraction
  it('extracts "शनि सप्तम भाव में"', () => {
    const claims = scanNarrative('शनि की आपके सप्तम भाव में स्थिति कर्म संबंधों को दर्शाती है।');
    expect(claims).toContainEqual(expect.objectContaining({ type: 'planet_house', planet: 6, house: 7 }));
  });

  it('extracts "बृहस्पति चतुर्थ भाव में"', () => {
    const claims = scanNarrative('बृहस्पति चतुर्थ भाव में गृह सुख प्रदान करते हैं।');
    expect(claims).toContainEqual(expect.objectContaining({ type: 'planet_house', planet: 4, house: 4 }));
  });

  it('extracts reverse Hindi pattern "सप्तम भाव में शनि"', () => {
    const claims = scanNarrative('सप्तम भाव में शनि की उपस्थिति विवाह में विलम्ब करती है।');
    expect(claims).toContainEqual(expect.objectContaining({ type: 'planet_house', planet: 6, house: 7 }));
  });

  it('extracts Hindi numeric "शनि 7वें भाव में"', () => {
    const claims = scanNarrative('शनि 7वें भाव में स्थित हैं।');
    expect(claims).toContainEqual(expect.objectContaining({ type: 'planet_house', planet: 6, house: 7 }));
  });

  // English dignity extraction
  it('extracts "exalted Saturn"', () => {
    const claims = scanNarrative('The exalted Saturn in Libra gives strength.');
    expect(claims).toContainEqual(expect.objectContaining({ type: 'planet_dignity', planet: 6, dignity: 'exalted' }));
  });

  it('extracts "Jupiter is exalted"', () => {
    const claims = scanNarrative('Jupiter is exalted in Cancer.');
    expect(claims).toContainEqual(expect.objectContaining({ type: 'planet_dignity', planet: 4, dignity: 'exalted' }));
  });

  // Hindi dignity extraction
  it('extracts "उच्च शनि"', () => {
    const claims = scanNarrative('उच्च शनि तुला राशि में बल प्रदान करते हैं।');
    expect(claims).toContainEqual(expect.objectContaining({ type: 'planet_dignity', planet: 6, dignity: 'exalted' }));
  });

  // Yoga extraction
  it('extracts Gajakesari yoga (EN)', () => {
    const claims = scanNarrative('The Gajakesari yoga in your chart grants wisdom.');
    expect(claims).toContainEqual(expect.objectContaining({ type: 'yoga_mentioned', yogaName: 'gajakesari' }));
  });

  it('extracts गजकेसरी yoga (HI)', () => {
    const claims = scanNarrative('आपकी कुण्डली में गजकेसरी योग विद्यमान है।');
    expect(claims).toContainEqual(expect.objectContaining({ type: 'yoga_mentioned', yogaName: 'गजकेसरी' }));
  });

  // Deduplication
  it('deduplicates same claim from multiple patterns', () => {
    const claims = scanNarrative('शनि सप्तम भाव में हैं। Saturn in the 7th house.');
    const saturnHouse = claims.filter(c => c.type === 'planet_house' && c.planet === 6 && c.house === 7);
    expect(saturnHouse).toHaveLength(1); // Deduplicated
  });

  // No false positives
  it('returns empty for non-astrological text', () => {
    const claims = scanNarrative('The weather is nice today. Have a great weekend.');
    expect(claims).toHaveLength(0);
  });
});

describe('verifyScannedClaims', () => {
  it('passes when narrative claims match SAC', () => {
    const result = verifyScannedClaims(
      'Saturn in the 7th house during the Saturn-Mercury period.',
      EXPECTED_SAC,
      [] // No structured claims — L2b is the primary gate
    );
    expect(result.passed).toBe(true);
  });

  it('fails when narrative claims contradict SAC', () => {
    // Venus is in house 2, not house 7
    const result = verifyScannedClaims(
      'Venus in the 7th house brings charm to partnerships.',
      EXPECTED_SAC,
      []
    );
    expect(result.passed).toBe(false);
    expect(result.failures[0].message).toContain('Venus');
    expect(result.failures[0].message).toContain('house 2');
  });

  it('skips claims already verified by L2 structured claims', () => {
    // Saturn in 7th is correct — but already in structured claims
    const result = verifyScannedClaims(
      'Saturn in the 7th house. Venus in the 7th house.',
      EXPECTED_SAC,
      [{ type: 'planet_house', data: { planet: 6, house: 7 } }] // Saturn already verified
    );
    // Saturn claim skipped. Venus claim should FAIL (Venus is in house 2).
    expect(result.passed).toBe(false);
    expect(result.failures).toHaveLength(1);
    expect(result.failures[0].message).toContain('Venus');
  });

  it('detects hallucinated yoga in narrative', () => {
    // Hamsa yoga is NOT in the SAC
    const result = verifyScannedClaims(
      'The Hamsa yoga grants spiritual wisdom.',
      EXPECTED_SAC,
      []
    );
    expect(result.passed).toBe(false);
    expect(result.failures[0].message).toContain('hamsa');
  });
});
