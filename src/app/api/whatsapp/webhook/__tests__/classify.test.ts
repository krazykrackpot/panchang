import { describe, it, expect } from 'vitest';
import { classifyInbound } from '../route';

describe('classifyInbound', () => {
  describe('STOP keywords', () => {
    it('matches exact "stop"', () => {
      expect(classifyInbound('stop')).toBe('stop');
      expect(classifyInbound('STOP')).toBe('stop');
    });
    it('tolerates trailing punctuation (Gemini PR #706 round-3)', () => {
      expect(classifyInbound('STOP!')).toBe('stop');
      expect(classifyInbound('stop.')).toBe('stop');
      expect(classifyInbound('STOP!!!')).toBe('stop');
      expect(classifyInbound('  stop  ')).toBe('stop');
    });
    it('matches multi-word "opt out"', () => {
      expect(classifyInbound('opt out')).toBe('stop');
      expect(classifyInbound('OPT OUT')).toBe('stop');
      expect(classifyInbound('opt  out')).toBe('stop');
    });
    it('matches keyword in a sentence via word boundary', () => {
      expect(classifyInbound('please stop sending')).toBe('stop');
      expect(classifyInbound('i want to unsubscribe')).toBe('stop');
    });
    it('does NOT match partial-word false positives', () => {
      expect(classifyInbound('stopwatch')).toBe('other');
      expect(classifyInbound('endorsement')).toBe('other');
      expect(classifyInbound('cancellation')).toBe('other');
    });
    it('matches non-ASCII script tokens exactly', () => {
      expect(classifyInbound('रोको')).toBe('stop');
      expect(classifyInbound('বন্ধ')).toBe('stop');
      expect(classifyInbound('நிறுத்து')).toBe('stop');
    });
  });

  describe('HELP keywords', () => {
    it('matches exact "help" and "info"', () => {
      expect(classifyInbound('help')).toBe('help');
      expect(classifyInbound('info')).toBe('help');
    });
    it('tolerates trailing punctuation', () => {
      expect(classifyInbound('help?')).toBe('help');
      expect(classifyInbound('HELP!!')).toBe('help');
    });
    it('does NOT match "helpful"', () => {
      expect(classifyInbound('this is helpful')).toBe('other');
      expect(classifyInbound('helpdesk')).toBe('other');
    });
    it('matches non-ASCII script tokens exactly', () => {
      expect(classifyInbound('मदद')).toBe('help');
      expect(classifyInbound('সাহায্য')).toBe('help');
      expect(classifyInbound('உதவி')).toBe('help');
    });
  });

  describe('other', () => {
    it('returns "other" for unrelated text', () => {
      expect(classifyInbound('hi')).toBe('other');
      expect(classifyInbound('thanks')).toBe('other');
      expect(classifyInbound('when is diwali')).toBe('other');
    });
    it('returns "other" for empty / whitespace-only', () => {
      expect(classifyInbound('')).toBe('other');
      expect(classifyInbound('   ')).toBe('other');
      expect(classifyInbound('!!!')).toBe('other');
    });
  });
});
