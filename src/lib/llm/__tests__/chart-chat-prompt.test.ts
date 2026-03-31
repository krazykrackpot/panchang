/**
 * Chart Chat Prompt Builder Tests
 * Run with: npx tsx src/lib/llm/__tests__/chart-chat-prompt.test.ts
 */

import { buildChartChatSystemPrompt, sanitizeChatMessage, buildFallbackResponse } from '../chart-chat-prompt';
import { generateKundali } from '../../ephem/kundali-calc';

let pass = 0;
let fail = 0;
function assert(name: string, condition: boolean, detail?: string) {
  if (condition) { pass++; console.log(`  ✓ ${name}${detail ? ` — ${detail}` : ''}`); }
  else { fail++; console.log(`  ✗ ${name}${detail ? ` — ${detail}` : ''}`); }
}

console.log('\n═══ Chart Chat Prompt Tests ═══');

// Generate a test kundali
const kundali = generateKundali({
  name: 'Test', date: '1990-06-15', time: '10:30',
  place: 'Delhi', lat: 28.6139, lng: 77.209,
  timezone: 'Asia/Kolkata', ayanamsha: 'lahiri',
});

// Test system prompt generation
const prompt = buildChartChatSystemPrompt(kundali, 'en');

assert('Prompt is non-empty string', typeof prompt === 'string' && prompt.length > 100, `${prompt.length} chars`);
assert('Contains Ascendant', prompt.includes('Ascendant'));
assert('Contains Planet Positions section', prompt.includes('## Planet Positions'));
assert('Contains House Occupancies', prompt.includes('## House Occupancies'));
assert('Contains Dasha Periods', prompt.includes('## Dasha Periods'));
assert('Contains D9 Navamsha', prompt.includes('## D9 Navamsha'));
assert('Contains IMPORTANT RULES', prompt.includes('IMPORTANT RULES'));
assert('Contains all 9 planets', prompt.includes('Sun') && prompt.includes('Moon') && prompt.includes('Mars') && prompt.includes('Mercury') && prompt.includes('Jupiter') && prompt.includes('Venus') && prompt.includes('Saturn') && prompt.includes('Rahu') && prompt.includes('Ketu'));
assert('Contains house numbers', prompt.includes('1st') || prompt.includes('2nd') || prompt.includes('3rd'));
assert('Contains sign names', prompt.includes('Aries') || prompt.includes('Taurus') || prompt.includes('Gemini') || prompt.includes('Cancer') || prompt.includes('Leo'));

// Test Hindi prompt
const promptHi = buildChartChatSystemPrompt(kundali, 'hi');
assert('Hindi prompt includes Hindi instruction', promptHi.includes('Hindi') || promptHi.includes('Devanagari'));

// Test Jaimini data inclusion
if (kundali.jaimini) {
  assert('Contains Jaimini section', prompt.includes('## Jaimini Karakas'));
  assert('Contains Atmakaraka', prompt.includes('AK:'));
}

// Test message sanitization
assert('Sanitize normal message', sanitizeChatMessage('  Hello  ') === 'Hello');
assert('Sanitize long message', sanitizeChatMessage('x'.repeat(600)).length === 500);
assert('Sanitize empty', sanitizeChatMessage('   ') === '');

// Test fallback response
const fallback = buildFallbackResponse(kundali, 'en');
assert('Fallback is non-empty', fallback.length > 20, fallback.substring(0, 50));
assert('Fallback mentions ascendant', fallback.includes('ascendant'));

const fallbackHi = buildFallbackResponse(kundali, 'hi');
assert('Hindi fallback is non-empty', fallbackHi.length > 20);
assert('Hindi fallback has Devanagari', /[\u0900-\u097F]/.test(fallbackHi));

console.log(`\n═══ RESULTS: ${pass} passed, ${fail} failed ═══\n`);
if (fail > 0) process.exit(1);
