import { describe, it, expect } from 'vitest';
import { detectRelativeMention } from './relative-detector';

describe('detectRelativeMention — relationship classifier', () => {
  describe('English', () => {
    it('catches daughter → 5H', () => {
      const r = detectRelativeMention("Tell me about my daughter's career");
      expect(r?.relative).toBe('daughter');
      expect(r?.bhava).toBe(5);
    });

    it('catches son → 5H', () => {
      const r = detectRelativeMention('What does my son\'s chart show?');
      expect(r?.relative).toBe('son');
      expect(r?.bhava).toBe(5);
    });

    it('catches wife → 7H', () => {
      const r = detectRelativeMention('Will my wife and I have a long marriage?');
      expect(r?.relative).toBe('spouse');
      expect(r?.bhava).toBe(7);
    });

    it('catches husband → 7H', () => {
      const r = detectRelativeMention('Tell me about my husband');
      expect(r?.relative).toBe('spouse');
      expect(r?.bhava).toBe(7);
    });

    it('catches mother → 4H', () => {
      const r = detectRelativeMention('How is my mother\'s health?');
      expect(r?.relative).toBe('mother');
      expect(r?.bhava).toBe(4);
    });

    it('catches father → 9H', () => {
      const r = detectRelativeMention('My father\'s prospects');
      expect(r?.relative).toBe('father');
      expect(r?.bhava).toBe(9);
    });

    it('catches sibling → 3H', () => {
      const r = detectRelativeMention('My brother is unwell');
      expect(r?.relative).toBe('sibling');
      expect(r?.bhava).toBe(3);
    });

    it('does NOT false-match within longer words (sonata, daughterly)', () => {
      expect(detectRelativeMention('I love the piano sonata')).toBeNull();
    });

    it('returns null when no relative is mentioned', () => {
      expect(detectRelativeMention('Will I get a promotion this year?')).toBeNull();
    });

    it('catches plural forms (children, daughters, sons)', () => {
      expect(detectRelativeMention('My children')?.relative).toBe('child');
      expect(detectRelativeMention('Both my daughters')?.relative).toBe('daughter');
    });
  });

  describe('Devanagari (Hindi / Maithili / Marathi)', () => {
    it('catches बेटी → daughter', () => {
      const r = detectRelativeMention('मेरी बेटी का करियर कैसा होगा?');
      expect(r?.relative).toBe('daughter');
      expect(r?.bhava).toBe(5);
    });

    it('catches पत्नी → spouse', () => {
      const r = detectRelativeMention('मेरी पत्नी की सेहत');
      expect(r?.relative).toBe('spouse');
      expect(r?.bhava).toBe(7);
    });

    it('catches माँ → mother', () => {
      const r = detectRelativeMention('मेरी माँ की कुण्डली');
      expect(r?.relative).toBe('mother');
      expect(r?.bhava).toBe(4);
    });
  });

  describe('Bengali', () => {
    it('catches মেয়ে → daughter', () => {
      const r = detectRelativeMention('আমার মেয়ের ক্যারিয়ার');
      expect(r?.relative).toBe('daughter');
      expect(r?.bhava).toBe(5);
    });
  });

  describe('Tamil', () => {
    it('catches மகள் → daughter', () => {
      const r = detectRelativeMention('என் மகள் கல்வி');
      expect(r?.relative).toBe('daughter');
      expect(r?.bhava).toBe(5);
    });
  });

  describe('Bhava labels', () => {
    it('returns trilingual Bhava labels for daughter (Putra Bhava)', () => {
      const r = detectRelativeMention('my daughter');
      expect(r?.bhavaLabel.en).toMatch(/Putra Bhava/);
      expect(r?.bhavaLabel.hi).toMatch(/पुत्र भाव/);
    });

    it('returns Kalatra label for spouse', () => {
      const r = detectRelativeMention('my wife');
      expect(r?.bhavaLabel.en).toMatch(/Kalatra Bhava/);
    });
  });
});
