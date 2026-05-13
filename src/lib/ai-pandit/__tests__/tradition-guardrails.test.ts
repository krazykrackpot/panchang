import { describe, it, expect } from 'vitest';
import { checkTraditionGuardrails } from '../validation/tradition-guardrails';

describe('checkTraditionGuardrails', () => {
  // ── Benefic/Malefic violations ──

  describe('benefic/malefic rules', () => {
    it('FAIL: Jupiter called malefic (EN)', () => {
      const r = checkTraditionGuardrails('Jupiter, being a natural malefic, creates obstacles.', 'en');
      expect(r.passed).toBe(false);
      expect(r.failures[0].message).toContain('Jupiter');
      expect(r.failures[0].message).toContain('benefic');
    });

    it('FAIL: बृहस्पति called पाप ग्रह (HI)', () => {
      const r = checkTraditionGuardrails('बृहस्पति एक प्राकृतिक पाप ग्रह होने के कारण बाधाएँ उत्पन्न करते हैं।', 'hi');
      expect(r.passed).toBe(false);
    });

    it('FAIL: Venus called malefic', () => {
      const r = checkTraditionGuardrails('Venus as a cruel planet harms relationships.', 'en');
      expect(r.passed).toBe(false);
    });

    it('FAIL: Saturn called natural benefic', () => {
      const r = checkTraditionGuardrails('Saturn, a natural benefic, brings ease.', 'en');
      expect(r.passed).toBe(false);
    });

    it('PASS: Jupiter called benefic (correct)', () => {
      const r = checkTraditionGuardrails('Jupiter, a natural benefic, blesses the house.', 'en');
      expect(r.passed).toBe(true);
    });

    it('PASS: Saturn called malefic (correct)', () => {
      const r = checkTraditionGuardrails('Saturn, a natural malefic, tests your patience.', 'en');
      expect(r.passed).toBe(true);
    });

    it('benefic/malefic violations are NOT auto-fixable in v1', () => {
      const r = checkTraditionGuardrails('Jupiter, being a natural malefic, blocks progress.', 'en');
      expect(r.failures[0].fixable).toBe(false);
    });
  });

  // ── Wrong aspect rules ──

  describe('aspect rules', () => {
    it('FAIL: Mars aspects 5th (EN)', () => {
      const r = checkTraditionGuardrails('Mars aspects the 5th house from its position.', 'en');
      expect(r.passed).toBe(false);
      expect(r.failures[0].message).toContain('Mars aspects 4th/7th/8th');
    });

    it('FAIL: Mars aspects 9th (EN)', () => {
      const r = checkTraditionGuardrails('Mars aspects the 9th house powerfully.', 'en');
      expect(r.passed).toBe(false);
    });

    it('FAIL: Jupiter aspects 4th (EN)', () => {
      const r = checkTraditionGuardrails('Jupiter aspects the 4th house.', 'en');
      expect(r.passed).toBe(false);
      expect(r.failures[0].message).toContain('Jupiter aspects 5th/7th/9th');
    });

    it('FAIL: Saturn aspects 5th (EN)', () => {
      const r = checkTraditionGuardrails('Saturn aspects the 5th house with severity.', 'en');
      expect(r.passed).toBe(false);
    });

    it('PASS: Mars aspects 4th (correct)', () => {
      const r = checkTraditionGuardrails('Mars aspects the 4th house from lagna.', 'en');
      expect(r.passed).toBe(true);
    });

    it('PASS: Jupiter aspects 5th (correct)', () => {
      const r = checkTraditionGuardrails('Jupiter aspects the 5th house with grace.', 'en');
      expect(r.passed).toBe(true);
    });

    it('aspect violations are NOT fixable', () => {
      const r = checkTraditionGuardrails('Mars aspects the 5th and 9th houses.', 'en');
      expect(r.failures[0].fixable).toBe(false);
    });

    // Hindi aspect rules
    it('FAIL: मंगल पंचम दृष्टि (HI)', () => {
      const r = checkTraditionGuardrails('मंगल की पंचम भाव पर दृष्टि है।', 'hi');
      expect(r.passed).toBe(false);
    });
  });

  // ── Exaltation rules ──

  describe('exaltation rules', () => {
    it('FAIL: Sun exalted in Libra (wrong — should be Aries)', () => {
      const r = checkTraditionGuardrails('The Sun is exalted in Libra.', 'en');
      expect(r.passed).toBe(false);
      expect(r.failures[0].message).toContain('Sun is exalted in Aries');
    });

    it('PASS: Sun exalted in Aries (correct)', () => {
      const r = checkTraditionGuardrails('The Sun is exalted in Aries.', 'en');
      expect(r.passed).toBe(true);
    });

    it('FAIL: Jupiter exalted in Capricorn (wrong — should be Cancer)', () => {
      const r = checkTraditionGuardrails('Jupiter is exalted in Capricorn.', 'en');
      expect(r.passed).toBe(false);
    });
  });

  // ── Hinglish detection ──

  describe('Hinglish detection', () => {
    it('detects English planet names in Hindi context', () => {
      const r = checkTraditionGuardrails('Saturn ka transit aapke 7th house mein hai.', 'hi');
      expect(r.warnings.length).toBeGreaterThan(0);
      expect(r.warnings[0].isWarning).toBe(true);
      expect(r.warnings[0].message).toContain('Hinglish');
    });

    it('detects English terms with Hindi postpositions', () => {
      const r = checkTraditionGuardrails('transit ho raha hai aur retrograde mein hai.', 'hi');
      expect(r.warnings.length).toBeGreaterThan(0);
    });

    it('no Hinglish warnings for proper Hindi', () => {
      const r = checkTraditionGuardrails('शनि का गोचर आपके सप्तम भाव में है।', 'hi');
      expect(r.warnings).toHaveLength(0);
    });

    it('no Hinglish check for English locale', () => {
      const r = checkTraditionGuardrails('Saturn ka transit in 7th house.', 'en');
      expect(r.warnings).toHaveLength(0); // Only checked for hi locale
    });

    it('Hinglish warnings do NOT block delivery (passed=true)', () => {
      const r = checkTraditionGuardrails('Saturn ka transit aapke 7th house mein hai.', 'hi');
      // No tradition RULE violations — only Hinglish warnings
      expect(r.passed).toBe(true);
      expect(r.warnings.length).toBeGreaterThan(0);
    });
  });

  // ── Clean narratives ──

  describe('clean narratives pass', () => {
    it('English — correct usage', () => {
      const r = checkTraditionGuardrails(
        'Saturn, a natural malefic, tests your relationships from the 7th house. Jupiter aspects the 5th and 9th houses, bringing wisdom. Mars in own sign gives courage.',
        'en'
      );
      expect(r.passed).toBe(true);
      expect(r.failures).toHaveLength(0);
    });

    it('Hindi — proper Jyotish register', () => {
      const r = checkTraditionGuardrails(
        'शनि पाप ग्रह होने के कारण सप्तम भाव में कठिनाई लाते हैं। बृहस्पति शुभ ग्रह हैं और पंचम तथा नवम भाव पर दृष्टि डालते हैं।',
        'hi'
      );
      expect(r.passed).toBe(true);
      expect(r.warnings).toHaveLength(0);
    });
  });
});
