import { describe, it, expect } from 'vitest';
import { checkVerdictAlignment, scoreSentiment } from '../validation/verdict-alignment';

describe('scoreSentiment', () => {
  it('counts English positive markers', () => {
    const s = scoreSentiment('Excellent period. Very auspicious and promising.');
    expect(s.positiveCount).toBe(3); // excellent, auspicious, promising
  });

  it('counts Hindi positive markers', () => {
    const s = scoreSentiment('यह बहुत शुभ समय है। उत्तम परिणाम अपेक्षित हैं।');
    expect(s.positiveCount).toBeGreaterThanOrEqual(2); // शुभ, उत्तम
  });

  it('counts negative markers', () => {
    const s = scoreSentiment('Challenging period with many obstacles. Difficult time ahead.');
    expect(s.negativeCount).toBeGreaterThanOrEqual(3); // challenging, obstacles, difficult
  });

  it('counts Hindi negative markers', () => {
    const s = scoreSentiment('यह कठिन समय है। बाधाएँ और संघर्ष रहेगा।');
    expect(s.negativeCount).toBeGreaterThanOrEqual(3); // कठिन, बाधा, संघर्ष
  });

  it('handles negation — "not favourable" counts as negative', () => {
    const s = scoreSentiment('This is not favourable and not auspicious at all.');
    expect(s.negativeCount).toBeGreaterThanOrEqual(2); // "not favourable", "not auspicious"
    // The bare "favourable" and "auspicious" should NOT count as positive
    // because they were removed after negation detection
    expect(s.positiveCount).toBe(0);
  });

  it('handles Hindi negation — "शुभ नहीं" counts as negative', () => {
    const s = scoreSentiment('यह समय शुभ नहीं है।');
    expect(s.negativeCount).toBeGreaterThanOrEqual(1);
    expect(s.positiveCount).toBe(0);
  });
});

describe('checkVerdictAlignment', () => {
  it('FAVOURABLE verdict + positive narrative → PASS', () => {
    const result = checkVerdictAlignment(
      'Excellent period. शुभ results. Very prosperous and beneficial time.',
      'FAVOURABLE'
    );
    expect(result.passed).toBe(true);
  });

  it('FAVOURABLE verdict + negative narrative → FAIL', () => {
    const result = checkVerdictAlignment(
      'Challenging period with obstacles. कठिन time. Difficult and stressful.',
      'FAVOURABLE'
    );
    expect(result.passed).toBe(false);
    expect(result.failures[0].layer).toBe('verdict_alignment');
  });

  it('CAUTION verdict + positive narrative → FAIL', () => {
    const result = checkVerdictAlignment(
      'Excellent! Highly auspicious! शुभ and मंगलकारी! Best period! Golden phase! Wonderful!',
      'CAUTION'
    );
    expect(result.passed).toBe(false);
  });

  it('CAUTION verdict + cautious narrative → PASS', () => {
    const result = checkVerdictAlignment(
      'This is a challenging phase. Some obstacles may arise. कठिन but with effort and remedies, the difficulties can be managed. Some delay is possible.',
      'CAUTION'
    );
    expect(result.passed).toBe(true);
  });

  it('MIXED verdict + balanced narrative → PASS', () => {
    const result = checkVerdictAlignment(
      'Mixed signals in career. शुभ influence from Jupiter but सावधानी due to Sade Sati. Balanced period with both promising and challenging aspects.',
      'MIXED'
    );
    expect(result.passed).toBe(true);
  });

  it('CHALLENGING verdict + serious narrative → PASS', () => {
    const result = checkVerdictAlignment(
      'This is a difficult and challenging period. कठिन obstacles and hardship ahead. Crisis may arise. Adversity tests your resolve. Caution is essential. Danger and setback possible.',
      'CHALLENGING'
    );
    expect(result.passed).toBe(true);
  });

  it('CHALLENGING verdict + overly positive → FAIL', () => {
    const result = checkVerdictAlignment(
      'Excellent period! Wonderful time! Everything is prosperous and blessed! शुभ!',
      'CHALLENGING'
    );
    expect(result.passed).toBe(false);
  });
});
