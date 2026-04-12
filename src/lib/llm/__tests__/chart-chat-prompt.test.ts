/**
 * Chart Chat Prompt Builder Tests
 */

import { describe, it, expect } from 'vitest';
import { buildChartChatSystemPrompt, sanitizeChatMessage, buildFallbackResponse } from '../chart-chat-prompt';
import { generateKundali } from '../../ephem/kundali-calc';

const kundali = generateKundali({
  name: 'Test', date: '1990-06-15', time: '10:30',
  place: 'Delhi', lat: 28.6139, lng: 77.209,
  timezone: 'Asia/Kolkata', ayanamsha: 'lahiri',
});

describe('buildChartChatSystemPrompt', () => {
  const prompt = buildChartChatSystemPrompt(kundali, 'en');

  it('is a non-empty string', () => {
    expect(typeof prompt).toBe('string');
    expect(prompt.length).toBeGreaterThan(100);
  });

  it('contains Ascendant', () => {
    expect(prompt).toContain('Ascendant');
  });

  it('contains Planet Positions section', () => {
    expect(prompt).toContain('## Planet Positions');
  });

  it('contains House Occupancies', () => {
    expect(prompt).toContain('## House Occupancies');
  });

  it('contains Dasha Periods', () => {
    expect(prompt).toContain('## Dasha Periods');
  });

  it('contains D9 Navamsha', () => {
    expect(prompt).toContain('## D9 Navamsha');
  });

  it('contains IMPORTANT RULES', () => {
    expect(prompt).toContain('IMPORTANT RULES');
  });

  it('contains all 9 planets', () => {
    expect(prompt).toContain('Sun');
    expect(prompt).toContain('Moon');
    expect(prompt).toContain('Mars');
    expect(prompt).toContain('Mercury');
    expect(prompt).toContain('Jupiter');
    expect(prompt).toContain('Venus');
    expect(prompt).toContain('Saturn');
    expect(prompt).toContain('Rahu');
    expect(prompt).toContain('Ketu');
  });

  it('contains house numbers', () => {
    const hasHouseNum = /House \d+|(\d+)(st|nd|rd|th) house/.test(prompt);
    expect(hasHouseNum).toBe(true);
  });

  it('contains sign names', () => {
    const hasSign = prompt.includes('Aries') || prompt.includes('Taurus') || prompt.includes('Gemini') || prompt.includes('Cancer') || prompt.includes('Leo');
    expect(hasSign).toBe(true);
  });
});

describe('buildChartChatSystemPrompt - Hindi', () => {
  it('Hindi prompt includes Hindi instruction', () => {
    const promptHi = buildChartChatSystemPrompt(kundali, 'hi');
    const hasHindiRef = promptHi.includes('Hindi') || promptHi.includes('Devanagari');
    expect(hasHindiRef).toBe(true);
  });
});

describe('Jaimini data inclusion', () => {
  it('contains Jaimini section if kundali has jaimini data', () => {
    if (kundali.jaimini) {
      const prompt = buildChartChatSystemPrompt(kundali, 'en');
      expect(prompt).toContain('## Jaimini Karakas');
      expect(prompt).toContain('AK:');
    }
  });
});

describe('sanitizeChatMessage', () => {
  it('trims whitespace', () => {
    expect(sanitizeChatMessage('  Hello  ')).toBe('Hello');
  });

  it('truncates long messages to 500 chars', () => {
    expect(sanitizeChatMessage('x'.repeat(600))).toHaveLength(500);
  });

  it('returns empty string for whitespace-only input', () => {
    expect(sanitizeChatMessage('   ')).toBe('');
  });
});

describe('buildFallbackResponse', () => {
  it('English fallback is non-empty and mentions ascendant', () => {
    const fallback = buildFallbackResponse(kundali, 'en');
    expect(fallback.length).toBeGreaterThan(20);
    expect(fallback).toContain('ascendant');
  });

  it('Hindi fallback is non-empty with Devanagari', () => {
    const fallbackHi = buildFallbackResponse(kundali, 'hi');
    expect(fallbackHi.length).toBeGreaterThan(20);
    expect(fallbackHi).toMatch(/[\u0900-\u097F]/);
  });
});
