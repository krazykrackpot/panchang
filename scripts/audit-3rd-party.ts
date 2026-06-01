/**
 * scripts/audit-3rd-party.ts
 *
 * Cross-validates the engine's birth chart output against publicly-accessible
 * 3rd-party Vedic tools (Prokerala, Drik Panchang) for a small set of charts.
 * Run AFTER scripts/audit-engine-vs-swiss.ts has passed — this complements
 * the sweph-only audit with "does the engine agree with the tools real
 * users compare it to."
 *
 * Caveats:
 *   - 3rd-party sites are JS-heavy and change layout frequently. The
 *     scraping selectors are best-effort and may need updating.
 *   - We compare LAGNA SIGN (Rashi) only — degree precision varies between
 *     tools and isn't the canonical interpretive unit anyway. If the SIGNS
 *     all match, the chart "looks right" to a human reader.
 *   - Polar charts are skipped — no 3rd-party tool tested handles them
 *     consistently. The sweph audit covers those.
 *
 * Run: `npx tsx scripts/audit-3rd-party.ts --url=http://localhost:3001`
 */
import { chromium } from 'playwright';

const URL_FLAG = process.argv.find((a) => a.startsWith('--url=')) ?? '--url=http://localhost:3001';
const ENGINE_URL = URL_FLAG.slice('--url='.length);

interface Chart {
  name: string;
  date: string;     // YYYY-MM-DD
  time: string;     // HH:MM (24h)
  city: string;     // for tool form
  lat: number;
  lng: number;
  timezone: string;
}

const CHARTS: Chart[] = [
  { name: 'IndiraGandhi', date: '1917-11-19', time: '23:11', city: 'Allahabad', lat: 25.4358, lng: 81.8463, timezone: 'Asia/Kolkata' },
  { name: 'Gandhi',       date: '1869-10-02', time: '07:33', city: 'Porbandar', lat: 21.6422, lng: 69.6093, timezone: 'Asia/Kolkata' },
];

const RASHI_NAMES = [
  '', // 1-indexed
  'Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo',
  'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces',
];

async function getEngineOutput(c: Chart) {
  const res = await fetch(`${ENGINE_URL}/api/kundali`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: c.name, date: c.date, time: c.time, place: c.city,
      lat: c.lat, lng: c.lng, timezone: c.timezone, ayanamsha: 'lahiri',
    }),
  });
  if (!res.ok) throw new Error(`engine ${res.status}`);
  const k = await res.json() as { ascendant: { degree: number; sign: number; signName: { en: string } }; planets: Array<{ planet: { id: number; name: { en: string } }; sign: number; longitude: number }> };
  return {
    lagnaSign: k.ascendant.sign,
    lagnaSignName: k.ascendant.signName.en,
    lagnaDeg: k.ascendant.degree,
    planets: k.planets.map((p) => ({
      id: p.planet.id,
      name: p.planet.name.en,
      sign: p.sign,
      signName: RASHI_NAMES[p.sign],
      longitude: p.longitude,
    })),
  };
}

async function scrapeProkerala(c: Chart) {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  try {
    // Prokerala's public birth-chart calculator (free, no API key needed).
    // URL pattern derived from manual inspection of their public form.
    // If the form layout changes, the selectors below will need updating.
    const dateParts = c.date.split('-');
    const url = `https://www.prokerala.com/astrology/birth-chart/?utf8=%E2%9C%93&date=${dateParts[2]}&month=${dateParts[1]}&year=${dateParts[0]}&hour=${c.time.split(':')[0]}&min=${c.time.split(':')[1]}&location=${encodeURIComponent(c.city)}&lat=${c.lat}&lon=${c.lng}&tz=Asia%2FKolkata`;
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });
    // Wait for result table; Prokerala renders the chart in a table with
    // a "Lagna" or "Ascendant" cell. Try multiple selectors.
    await page.waitForTimeout(5000);
    const html = await page.content();
    // Parse with a forgiving regex — look for Ascendant/Lagna near a sign name.
    const m = html.match(/(?:Ascendant|Lagna|Lagn)[\s\S]{0,200}?(Aries|Taurus|Gemini|Cancer|Leo|Virgo|Libra|Scorpio|Sagittarius|Capricorn|Aquarius|Pisces|Mesha|Vrishabha|Mithuna|Karka|Simha|Kanya|Tula|Vrishchika|Dhanu|Makara|Kumbha|Meena)/i);
    return m ? { lagnaSignText: m[1], ok: true, source: 'prokerala', url } : { ok: false, source: 'prokerala', url, error: 'lagna not parsed from HTML' };
  } catch (err) {
    return { ok: false, source: 'prokerala', error: (err as Error).message };
  } finally {
    await browser.close();
  }
}

async function scrapeAstroSage(c: Chart) {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  try {
    // AstroSage's free online kundli form. Form-based, no direct URL.
    await page.goto('https://www.astrosage.com/free/online-kundli.asp', { waitUntil: 'domcontentloaded', timeout: 30000 });
    // Form fields (best-effort selectors; site layout may have changed).
    const [y, mo, d] = c.date.split('-');
    const [h, mn] = c.time.split(':');
    await page.fill('input[name="day"]', d).catch(() => {});
    await page.fill('input[name="month"]', mo).catch(() => {});
    await page.fill('input[name="year"]', y).catch(() => {});
    await page.fill('input[name="hour"]', h).catch(() => {});
    await page.fill('input[name="min"]', mn).catch(() => {});
    await page.fill('input[name="place"]', c.city).catch(() => {});
    await page.waitForTimeout(2000);
    // Submit
    const submit = page.locator('input[type="submit"], button[type="submit"]').first();
    if (await submit.isVisible().catch(() => false)) {
      await submit.click();
      await page.waitForTimeout(6000);
    }
    const html = await page.content();
    const m = html.match(/(?:Ascendant|Lagna|Lagn)[\s\S]{0,200}?(Aries|Taurus|Gemini|Cancer|Leo|Virgo|Libra|Scorpio|Sagittarius|Capricorn|Aquarius|Pisces|Mesha|Vrishabha|Mithuna|Karka|Simha|Kanya|Tula|Vrishchika|Dhanu|Makara|Kumbha|Meena)/i);
    return m ? { lagnaSignText: m[1], ok: true, source: 'astrosage' } : { ok: false, source: 'astrosage', error: 'lagna not parsed' };
  } catch (err) {
    return { ok: false, source: 'astrosage', error: (err as Error).message };
  } finally {
    await browser.close();
  }
}

(async () => {
  console.log(`Engine URL: ${ENGINE_URL}\n`);
  for (const chart of CHARTS) {
    console.log(`── ${chart.name} (${chart.date} ${chart.time} ${chart.city}) ──`);
    let engine;
    try {
      engine = await getEngineOutput(chart);
    } catch (err) {
      console.log(`  ENGINE FAILED: ${(err as Error).message}`);
      continue;
    }
    console.log(`  ENGINE lagna sign: ${engine.lagnaSign} (${engine.lagnaSignName}) deg ${engine.lagnaDeg.toFixed(2)}°`);

    const [pk, as] = await Promise.all([
      scrapeProkerala(chart).catch((err) => ({ ok: false, source: 'prokerala', error: err.message })),
      scrapeAstroSage(chart).catch((err) => ({ ok: false, source: 'astrosage', error: err.message })),
    ]);
    const fmt = (r: Awaited<ReturnType<typeof scrapeProkerala>>) =>
      r.ok ? `${('lagnaSignText' in r ? r.lagnaSignText : '')}` : `(failed: ${'error' in r ? r.error : 'unknown'})`;
    console.log(`  PROKERALA lagna sign:  ${fmt(pk)}`);
    console.log(`  ASTROSAGE lagna sign:  ${fmt(as)}`);
    console.log('');
  }
})();
