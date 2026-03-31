/**
 * Horoscope Prompt Builder Tests
 * Run with: npx tsx src/lib/llm/__tests__/horoscope-prompt.test.ts
 */

import { buildTransitDataForSign, buildHoroscopePrompt, buildAllHoroscopePrompts, buildFallbackHoroscope } from '../horoscope-prompt';
import { computePanchang } from '../../ephem/panchang-calc';

let pass = 0;
let fail = 0;
function assert(name: string, condition: boolean, detail?: string) {
  if (condition) { pass++; console.log(`  ✓ ${name}${detail ? ` — ${detail}` : ''}`); }
  else { fail++; console.log(`  ✗ ${name}${detail ? ` — ${detail}` : ''}`); }
}

console.log('\n═══ Horoscope Prompt Tests ═══');

// Compute a panchang for testing
const panchang = computePanchang({
  year: 2025, month: 6, day: 15, lat: 28.6139, lng: 77.209, tzOffset: 5.5, locationName: 'Delhi',
});

// Test single sign transit data
const ariesData = buildTransitDataForSign(panchang, 1);

assert('Aries sign = 1', ariesData.sign === 1);
assert('Aries signName = Aries', ariesData.signName === 'Aries');
assert('Has 9 transit entries', ariesData.transits.length === 9, `Got ${ariesData.transits.length}`);
assert('Each transit has planet name', ariesData.transits.every(t => typeof t.planet === 'string' && t.planet.length > 0));
assert('Each transit has house 1-12', ariesData.transits.every(t => t.houseFromSign >= 1 && t.houseFromSign <= 12));
assert('Has tithi', ariesData.tithi.length > 0, ariesData.tithi);
assert('Has nakshatra', ariesData.nakshatra.length > 0, ariesData.nakshatra);
assert('Has yoga', ariesData.yoga.length > 0, ariesData.yoga);

// Test all 12 signs
const allPrompts = buildAllHoroscopePrompts(panchang);
assert('12 prompts generated', allPrompts.length === 12);
assert('Sign 1 = Aries', allPrompts[0].signName === 'Aries');
assert('Sign 12 = Pisces', allPrompts[11].signName === 'Pisces');
assert('All signs unique', new Set(allPrompts.map(p => p.sign)).size === 12);

// Test prompt text generation
const promptText = buildHoroscopePrompt(ariesData);
assert('Prompt mentions Aries', promptText.includes('Aries'));
assert('Prompt mentions transit data', promptText.includes('house'));
assert('Prompt mentions tithi', promptText.includes('Tithi'));
assert('Prompt has instructions', promptText.includes('Generate a'));
assert('Prompt asks for 120-150 words', promptText.includes('120-150 word'));

// Test house distribution — Moon transiting through 12 signs
// should yield 12 different houses for Moon relative to each sign
const moonHouses = allPrompts.map(p => p.transits.find(t => t.planet === 'Moon')?.houseFromSign || 0);
assert('Moon has valid houses for all signs', moonHouses.every(h => h >= 1 && h <= 12));

// Test fallback horoscope (no LLM)
const fallbackEn = buildFallbackHoroscope(ariesData, 'en');
assert('English fallback is non-empty', fallbackEn.length > 20, fallbackEn.substring(0, 50));
assert('Fallback mentions Moon', fallbackEn.includes('Moon'));

const fallbackHi = buildFallbackHoroscope(ariesData, 'hi');
assert('Hindi fallback has Devanagari', /[\u0900-\u097F]/.test(fallbackHi));

// Test edge case: Pisces (sign 12) house calculations
const piscesData = buildTransitDataForSign(panchang, 12);
assert('Pisces transits valid', piscesData.transits.every(t => t.houseFromSign >= 1 && t.houseFromSign <= 12));

console.log(`\n═══ RESULTS: ${pass} passed, ${fail} failed ═══\n`);
if (fail > 0) process.exit(1);
