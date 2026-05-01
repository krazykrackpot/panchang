import { NextResponse } from 'next/server';
import { z } from 'zod';
import { generateKundali } from '@/lib/ephem/kundali-calc';
import { generateTippanni } from '@/lib/kundali/tippanni-engine';
import { calculateNadiAmsha } from '@/lib/kundali/nadi-amsha';
import type { KundaliData, PlanetPosition, DashaEntry } from '@/types/kundali';
import type { TippanniContent } from '@/lib/kundali/tippanni-types';
import type { NadiAmshaChart } from '@/lib/kundali/nadi-amsha';
import type { Locale } from '@/types/panchang';
import { GRAHA_ABBREVIATIONS } from '@/lib/constants/grahas';

// ── Input validation ──────────────────────────────────────────────
const reportSchema = z.object({
  name: z.string().min(1).max(200),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be YYYY-MM-DD'),
  time: z.string().regex(/^\d{2}:\d{2}$/, 'Time must be HH:MM'),
  lat: z.coerce.number().min(-90).max(90),
  lng: z.coerce.number().min(-180).max(180),
  timezone: z.string().min(1).max(100),
  locale: z.enum(['en', 'hi', 'ta', 'te', 'bn', 'gu', 'kn']).default('en'),
  place: z.string().max(200).optional(),
});

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const parsed = reportSchema.safeParse({
    name: searchParams.get('name') ?? '',
    date: searchParams.get('date') ?? '',
    time: searchParams.get('time') ?? '',
    lat: searchParams.get('lat') ?? '',
    lng: searchParams.get('lng') ?? '',
    timezone: searchParams.get('timezone') ?? '',
    locale: searchParams.get('locale') ?? 'en',
    place: searchParams.get('place') ?? undefined,
  });

  if (!parsed.success) {
    console.error('[kundali-report] Invalid params:', parsed.error.flatten());
    return NextResponse.json(
      { error: 'Invalid parameters', details: parsed.error.flatten().fieldErrors },
      { status: 400 },
    );
  }

  const { name, date, time, lat, lng, timezone, locale, place } = parsed.data;

  // ── Generate kundali ──────────────────────────────────────────
  let kundali: KundaliData;
  try {
    kundali = generateKundali({
      name,
      date,
      time,
      place: place || `${lat.toFixed(4)}, ${lng.toFixed(4)}`,
      lat,
      lng,
      timezone,
      ayanamsha: 'lahiri',
    });
  } catch (err) {
    console.error('[kundali-report] Kundali generation failed:', err);
    return NextResponse.json(
      { error: 'Failed to generate birth chart. Please check your input parameters.' },
      { status: 500 },
    );
  }

  // ── Generate tippanni ─────────────────────────────────────────
  let tip: TippanniContent;
  try {
    tip = generateTippanni(kundali, locale as Locale);
  } catch (err) {
    console.error('[kundali-report] Tippanni generation failed:', err);
    return NextResponse.json(
      { error: 'Failed to generate interpretations.' },
      { status: 500 },
    );
  }

  // ── Generate Nadi Amsha ───────────────────────────────────────
  let nadi: NadiAmshaChart | null = null;
  try {
    nadi = calculateNadiAmsha(kundali);
  } catch (err) {
    console.error('[kundali-report] Nadi Amsha calculation failed:', err);
    // Non-critical — continue without nadi
  }

  // ── Build HTML ────────────────────────────────────────────────
  const generatedDate = new Date().toISOString().split('T')[0];
  const html = buildReportHtml(kundali, tip, nadi, {
    name, date, time, lat, lng, timezone, locale, place, generatedDate,
  });

  return new NextResponse(html, {
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  });
}

// ── Helpers ───────────────────────────────────────────────────────

function esc(str: string | undefined | null): string {
  if (!str) return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function tl(obj: Record<string, string> | undefined, locale: string): string {
  if (!obj) return '-';
  return obj[locale] || obj.en || '-';
}

function dignityLabel(p: PlanetPosition): string {
  if (p.isExalted) return 'Exalted';
  if (p.isDebilitated) return 'Debilitated';
  if (p.isOwnSign) return 'Own Sign';
  return '';
}

function dignityClass(p: PlanetPosition): string {
  if (p.isExalted) return 'dignity-exalted';
  if (p.isDebilitated) return 'dignity-debilitated';
  if (p.isOwnSign) return 'dignity-own';
  return '';
}

function ratingStars(rating: number): string {
  const full = Math.floor(rating);
  const half = rating - full >= 0.5;
  let s = '';
  for (let i = 0; i < full; i++) s += '&#9733;';
  if (half) s += '&#9734;';
  for (let i = full + (half ? 1 : 0); i < 5; i++) s += '&#9734;';
  return s;
}

// ── North Indian diamond chart rendered as HTML/CSS table ─────
// House layout for North Indian chart (house numbers 1-12 mapped to grid cells)
// The North Indian diamond is a 4x4 grid where the central 2x2 is for the title.
// Houses are arranged clockwise starting from top-center.
function renderNorthChart(kundali: KundaliData): string {
  // Map each house to its planets
  const housePlanets: Record<number, string[]> = {};
  for (let i = 1; i <= 12; i++) housePlanets[i] = [];
  for (const p of kundali.planets) {
    const abbr = GRAHA_ABBREVIATIONS[p.planet.id] || tl(p.planet.name as Record<string, string>, 'en').slice(0, 2);
    const retro = p.isRetrograde ? '(R)' : '';
    housePlanets[p.house].push(`${abbr}${retro}`);
  }

  // North Indian chart: fixed house positions in a 4x4 grid
  // Grid layout (house number):
  //     12   1   2   3
  //     11  [center]  4
  //     10  [center]  5
  //      9   8   7   6
  const cells: { row: number; col: number; house: number }[] = [
    // Top row
    { row: 0, col: 0, house: 12 },
    { row: 0, col: 1, house: 1 },
    { row: 0, col: 2, house: 2 },
    { row: 0, col: 3, house: 3 },
    // Middle rows
    { row: 1, col: 0, house: 11 },
    { row: 1, col: 3, house: 4 },
    { row: 2, col: 0, house: 10 },
    { row: 2, col: 3, house: 5 },
    // Bottom row
    { row: 3, col: 0, house: 9 },
    { row: 3, col: 1, house: 8 },
    { row: 3, col: 2, house: 7 },
    { row: 3, col: 3, house: 6 },
  ];

  const grid: string[][] = Array.from({ length: 4 }, () => Array(4).fill(''));

  for (const c of cells) {
    const h = c.house;
    const houseData = kundali.houses[h - 1];
    const signNum = houseData?.sign ?? h;
    const planets = housePlanets[h].join(' ');
    const isAsc = h === 1;
    grid[c.row][c.col] = `<td class="chart-cell${isAsc ? ' asc-cell' : ''}">
      <div class="house-num">${signNum}</div>
      <div class="house-planets">${esc(planets)}</div>
    </td>`;
  }

  // Center cells
  grid[1][1] = '';
  grid[1][2] = '';
  grid[2][1] = '';
  grid[2][2] = '';

  let tableHtml = '<table class="ni-chart"><tbody>';
  for (let r = 0; r < 4; r++) {
    tableHtml += '<tr>';
    for (let c = 0; c < 4; c++) {
      if (r >= 1 && r <= 2 && c >= 1 && c <= 2) {
        if (r === 1 && c === 1) {
          tableHtml += '<td colspan="2" rowspan="2" class="chart-center"><div class="chart-title">Rashi<br/>Chart</div></td>';
        }
        // skip other center cells
      } else {
        tableHtml += grid[r][c];
      }
    }
    tableHtml += '</tr>';
  }
  tableHtml += '</tbody></table>';
  return tableHtml;
}

// ── Dasha timeline ────────────────────────────────────────────
function renderDashaTimeline(dashas: DashaEntry[], locale: string): string {
  const now = new Date();
  let rows = '';
  for (const d of dashas) {
    const start = new Date(d.startDate);
    const end = new Date(d.endDate);
    const isCurrent = now >= start && now <= end;
    const cls = isCurrent ? ' class="current-dasha"' : '';
    const planetName = tl(d.planetName as Record<string, string>, locale);
    const fmtDate = (dt: Date) => dt.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });

    rows += `<tr${cls}>
      <td class="planet-name">${esc(planetName)}</td>
      <td>${fmtDate(start)}</td>
      <td>${fmtDate(end)}</td>
      <td>${isCurrent ? '<span class="active-badge">ACTIVE</span>' : ''}</td>
    </tr>`;

    // Show antardasha for current mahadasha
    if (isCurrent && d.subPeriods) {
      for (const sub of d.subPeriods) {
        const subStart = new Date(sub.startDate);
        const subEnd = new Date(sub.endDate);
        const isSubCurrent = now >= subStart && now <= subEnd;
        const subCls = isSubCurrent ? ' class="current-antar"' : ' class="antar-row"';
        const subName = tl(sub.planetName as Record<string, string>, locale);
        rows += `<tr${subCls}>
          <td class="antar-indent">&nbsp;&nbsp;&nbsp;&#8627; ${esc(subName)}</td>
          <td>${fmtDate(subStart)}</td>
          <td>${fmtDate(subEnd)}</td>
          <td>${isSubCurrent ? '<span class="active-badge sub">NOW</span>' : ''}</td>
        </tr>`;
      }
    }
  }
  return rows;
}

// ── Severity badge ────────────────────────────────────────────
function severityBadge(severity: string): string {
  const colors: Record<string, string> = {
    none: '#22c55e',
    mild: '#eab308',
    moderate: '#f97316',
    severe: '#ef4444',
  };
  const color = colors[severity] || '#888';
  return `<span class="severity-badge" style="background:${color}">${severity.toUpperCase()}</span>`;
}

// ── Main HTML builder ─────────────────────────────────────────
function buildReportHtml(
  kundali: KundaliData,
  tip: TippanniContent,
  nadi: NadiAmshaChart | null,
  meta: {
    name: string; date: string; time: string;
    lat: number; lng: number; timezone: string;
    locale: string; place?: string; generatedDate: string;
  },
): string {
  const { name, date, time, lat, lng, timezone, locale, generatedDate } = meta;
  const place = meta.place || `${lat.toFixed(4)}, ${lng.toFixed(4)}`;

  // Format birth date nicely
  const [yr, mo, dy] = date.split('-').map(Number);
  const birthDate = new Date(Date.UTC(yr, mo - 1, dy));
  const fmtBirth = birthDate.toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric', timeZone: 'UTC' });

  // Ascendant info
  const ascSign = tl(kundali.ascendant.signName as Record<string, string>, locale);
  const moonPlanet = kundali.planets.find(p => p.planet.id === 1);
  const moonSign = moonPlanet ? tl(moonPlanet.signName as Record<string, string>, locale) : '-';
  const sunPlanet = kundali.planets.find(p => p.planet.id === 0);
  const sunSign = sunPlanet ? tl(sunPlanet.signName as Record<string, string>, locale) : '-';

  // Planet positions table
  const planetRows = kundali.planets.map(p => {
    const pName = tl(p.planet.name as Record<string, string>, locale);
    const sign = tl(p.signName as Record<string, string>, locale);
    const nak = tl(p.nakshatra?.name as Record<string, string>, locale);
    const dignity = dignityLabel(p);
    const dCls = dignityClass(p);
    const retro = p.isRetrograde ? '<span class="retro-badge">R</span>' : '';
    const combust = p.isCombust ? '<span class="combust-badge">C</span>' : '';
    return `<tr>
      <td class="planet-name">${esc(pName)} ${retro} ${combust}</td>
      <td>${esc(sign)}</td>
      <td class="degree-cell">${esc(p.degree)}</td>
      <td>${esc(nak)}</td>
      <td class="pada-cell">${p.pada}</td>
      <td class="house-cell">${p.house}</td>
      <td class="${dCls}">${esc(dignity)}</td>
    </tr>`;
  }).join('\n');

  // Ascendant row for planet table
  const ascNak = kundali.planets.length > 0 ? '' : '-'; // Asc nakshatra not stored separately
  const ascRow = `<tr class="asc-row">
    <td class="planet-name">Ascendant (Lagna)</td>
    <td>${esc(ascSign)}</td>
    <td class="degree-cell">${kundali.ascendant.degree.toFixed(2)}&deg;</td>
    <td>${ascNak}</td>
    <td class="pada-cell">-</td>
    <td class="house-cell">1</td>
    <td></td>
  </tr>`;

  // House analysis
  const houseRows = kundali.houses.map((h, i) => {
    const num = i + 1;
    const sign = tl(h.signName as Record<string, string>, locale);
    const lord = tl(h.lordName as Record<string, string>, locale);
    const planetsInHouse = kundali.planets.filter(p => p.house === num)
      .map(p => tl(p.planet.name as Record<string, string>, locale)).join(', ');
    return `<tr>
      <td class="house-cell">${num}</td>
      <td>${esc(sign)}</td>
      <td>${esc(lord)}</td>
      <td>${esc(planetsInHouse) || '<span class="empty-text">Empty</span>'}</td>
    </tr>`;
  }).join('\n');

  // Yogas section
  const activeYogas = tip.yogas.filter(y => y.present);
  const yogasByType: Record<string, typeof activeYogas> = {};
  for (const y of activeYogas) {
    const type = y.type || 'Other';
    if (!yogasByType[type]) yogasByType[type] = [];
    yogasByType[type].push(y);
  }
  let yogasHtml = '';
  for (const [type, yogas] of Object.entries(yogasByType)) {
    yogasHtml += `<div class="yoga-group">
      <h4 class="yoga-type">${esc(type)} Yogas</h4>`;
    for (const y of yogas) {
      yogasHtml += `<div class="yoga-card">
        <div class="yoga-header">
          <span class="yoga-name">${esc(y.name)}</span>
          <span class="yoga-strength strength-${y.strength.toLowerCase()}">${y.strength}</span>
        </div>
        <p class="yoga-desc">${esc(y.description)}</p>
        <p class="yoga-effect"><strong>Effect:</strong> ${esc(y.implications)}</p>
      </div>`;
    }
    yogasHtml += '</div>';
  }
  if (!yogasHtml) {
    yogasHtml = '<p class="empty-text">No significant yogas detected in this chart.</p>';
  }

  // Doshas section
  const doshasHtml = tip.doshas.map(d => {
    const statusIcon = d.present ? '&#9888;' : '&#10003;';
    const statusClass = d.present ? 'dosha-present' : 'dosha-absent';
    const badge = severityBadge(d.severity);
    const cancellations = d.cancellationConditions
      ? d.cancellationConditions.map(c =>
        `<li class="${c.met ? 'cancel-met' : 'cancel-not'}">${c.met ? '&#10003;' : '&#10007;'} ${esc(c.condition)}</li>`
      ).join('')
      : '';
    return `<div class="dosha-card ${statusClass}">
      <div class="dosha-header">
        <span class="dosha-icon">${statusIcon}</span>
        <span class="dosha-name">${esc(d.name)}</span>
        ${badge}
      </div>
      <p class="dosha-desc">${esc(d.description)}</p>
      ${cancellations ? `<div class="cancellations"><strong>Cancellation Conditions:</strong><ul>${cancellations}</ul></div>` : ''}
      ${d.present && d.remedies ? `<p class="dosha-remedy"><strong>Remedies:</strong> ${esc(d.remedies)}</p>` : ''}
    </div>`;
  }).join('\n');

  // Dasha timeline
  const dashaRows = renderDashaTimeline(kundali.dashas, locale);

  // Strength overview
  const strengthRows = tip.strengthOverview.map(s => {
    const barWidth = Math.min(100, Math.max(5, s.strength));
    const barColor = s.strength >= 70 ? '#22c55e' : s.strength >= 40 ? '#eab308' : '#ef4444';
    return `<tr>
      <td class="planet-name" style="color:${esc(s.planetColor)}">${esc(s.planetName)}</td>
      <td><div class="strength-bar"><div class="strength-fill" style="width:${barWidth}%;background:${barColor}"></div></div></td>
      <td class="strength-val">${s.strength.toFixed(0)}%</td>
      <td class="strength-status">${esc(s.status)}</td>
    </tr>`;
  }).join('\n');

  // Nadi Amsha section
  let nadiHtml = '';
  if (nadi) {
    const nadiRows = [nadi.ascendantNadi, ...nadi.positions].map(p => {
      const pName = tl(p.planetName as Record<string, string>, locale);
      const nadiSignName = tl(p.nadiSignName as Record<string, string>, locale);
      return `<tr>
        <td class="planet-name">${esc(pName)}</td>
        <td>${p.nadiAmshaNumber}/150</td>
        <td>${esc(nadiSignName)}</td>
        <td class="karmic-text">${esc(p.karmicTheme)}</td>
      </tr>`;
    }).join('\n');
    nadiHtml = `<table class="data-table">
      <thead><tr><th>Planet</th><th>D-150 Amsha</th><th>Nadi Sign</th><th>Karmic Theme</th></tr></thead>
      <tbody>${nadiRows}</tbody>
    </table>`;
  }

  // Remedies section
  const gemstonesHtml = tip.remedies.gemstones.map(g =>
    `<div class="remedy-item">
      <div class="remedy-header"><span class="remedy-name">${esc(g.name)}</span><span class="remedy-planet">For ${esc(g.planet)}</span></div>
      <p>${esc(g.description)}</p>
    </div>`
  ).join('');
  const mantrasHtml = tip.remedies.mantras.map(m =>
    `<div class="remedy-item">
      <div class="remedy-header"><span class="remedy-name">${esc(m.name)}</span><span class="remedy-planet">For ${esc(m.planet)}</span></div>
      <p>${esc(m.description)}</p>
    </div>`
  ).join('');
  const practicesHtml = tip.remedies.practices.map(p =>
    `<div class="remedy-item">
      <div class="remedy-header"><span class="remedy-name">${esc(p.name)}</span><span class="remedy-planet">For ${esc(p.planet)}</span></div>
      <p>${esc(p.description)}</p>
    </div>`
  ).join('');

  // Year predictions
  let yearHtml = '';
  if (tip.yearPredictions) {
    const yp = tip.yearPredictions;
    const eventsHtml = yp.events.map(e => {
      const impactColor = e.impact === 'favorable' ? '#22c55e' : e.impact === 'challenging' ? '#ef4444' : '#eab308';
      return `<div class="year-event">
        <div class="event-header">
          <span class="event-title">${esc(e.title)}</span>
          <span class="event-impact" style="color:${impactColor}">${e.impact.toUpperCase()}</span>
        </div>
        <p class="event-period">${esc(e.period)}</p>
        <p>${esc(e.description)}</p>
        ${e.remedies ? `<p class="event-remedy"><em>Remedy: ${esc(e.remedies)}</em></p>` : ''}
      </div>`;
    }).join('');
    const quartersHtml = yp.quarters.map(q => {
      const color = q.outlook === 'favorable' ? '#22c55e' : q.outlook === 'challenging' ? '#ef4444' : '#eab308';
      return `<div class="quarter-card">
        <div class="quarter-name">${esc(q.quarter)}</div>
        <div class="quarter-outlook" style="color:${color}">${q.outlook.toUpperCase()}</div>
        <p>${esc(q.summary)}</p>
      </div>`;
    }).join('');
    yearHtml = `
      <p class="year-overview">${esc(yp.overview)}</p>
      <h4 class="subsection">Key Events</h4>
      ${eventsHtml}
      <h4 class="subsection">Quarterly Outlook</h4>
      <div class="quarters-grid">${quartersHtml}</div>
      <div class="key-advice"><strong>Key Advice:</strong> ${esc(yp.keyAdvice)}</div>
    `;
  }

  // Life area cards
  const lifeAreaKeys = ['career', 'wealth', 'marriage', 'health', 'education'] as const;
  const lifeAreasHtml = lifeAreaKeys.map(key => {
    const area = tip.lifeAreas[key];
    if (!area) return '';
    return `<div class="life-area-card">
      <div class="area-header">
        <span class="area-icon">${esc(area.icon)}</span>
        <span class="area-label">${esc(area.label)}</span>
        <span class="area-rating">${ratingStars(area.rating)}</span>
      </div>
      <p class="area-summary">${esc(area.summary)}</p>
      <p class="area-details">${esc(area.details)}</p>
    </div>`;
  }).join('');

  return `<!DOCTYPE html>
<html lang="${locale}">
<head>
  <meta charset="utf-8" />
  <title>Vedic Birth Chart Report &mdash; ${esc(name)} | Dekho Panchang</title>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@400;500;600;700;800&family=Inter:wght@300;400;500;600;700&family=Noto+Sans+Devanagari:wght@400;600&display=swap" rel="stylesheet" />
  <style>
    /* ── Reset ── */
    *, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }

    body {
      font-family: 'Inter', 'Noto Sans Devanagari', sans-serif;
      color: #2d2a24;
      background: #fff;
      font-size: 11px;
      line-height: 1.6;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }

    /* ── Page setup ── */
    @page {
      size: A4 portrait;
      margin: 15mm;
    }
    @media print {
      .no-print { display: none !important; }
      .page-break { break-before: page; }
      body { padding: 0; }
    }
    @media screen {
      body { max-width: 210mm; margin: 0 auto; padding: 20px 24px; }
    }

    /* ── Typography ── */
    h1, h2, h3, h4 { font-family: 'Cinzel', serif; color: #8B6914; }
    h2 { font-size: 18px; margin: 0 0 12px 0; padding-bottom: 6px; border-bottom: 2px solid #d4a853; }
    h3 { font-size: 14px; margin: 12px 0 8px 0; color: #6b5a1e; }
    h4 { font-size: 12px; margin: 10px 0 6px 0; color: #8B6914; }
    p { margin: 4px 0; }

    /* ── Print action bar ── */
    .print-bar {
      text-align: center;
      margin-bottom: 20px;
    }
    .print-btn {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 10px 28px;
      border: 2px solid #d4a853;
      border-radius: 8px;
      background: #faf5e8;
      color: #8B6914;
      font-family: 'Cinzel', serif;
      font-size: 14px;
      font-weight: 600;
      cursor: pointer;
      transition: background 0.2s;
    }
    .print-btn:hover { background: #f0e8d0; }

    /* ── Cover page ── */
    .cover {
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      text-align: center;
      border: 3px solid #d4a853;
      padding: 60px 40px;
      position: relative;
    }
    .cover::before, .cover::after {
      content: '';
      position: absolute;
      border: 1px solid #d4a85340;
    }
    .cover::before { top: 8px; left: 8px; right: 8px; bottom: 8px; }
    .cover::after { top: 16px; left: 16px; right: 16px; bottom: 16px; }
    .cover-brand {
      font-family: 'Cinzel', serif;
      font-size: 13px;
      letter-spacing: 6px;
      text-transform: uppercase;
      color: #b89a3e;
      margin-bottom: 10px;
    }
    .cover h1 {
      font-size: 32px;
      color: #8B6914;
      letter-spacing: 2px;
      margin: 16px 0;
      line-height: 1.3;
    }
    .cover-subtitle {
      font-size: 14px;
      color: #6b5a1e;
      font-weight: 500;
      letter-spacing: 1px;
      margin-bottom: 40px;
    }
    .cover-name {
      font-family: 'Cinzel', serif;
      font-size: 28px;
      color: #2d2a24;
      font-weight: 700;
      margin-bottom: 12px;
    }
    .cover-details {
      font-size: 12px;
      color: #666;
      line-height: 2;
    }
    .cover-details strong { color: #444; }
    .cover-signs {
      margin-top: 30px;
      display: flex;
      gap: 28px;
      justify-content: center;
    }
    .cover-sign {
      text-align: center;
    }
    .cover-sign-label {
      font-size: 9px;
      text-transform: uppercase;
      letter-spacing: 2px;
      color: #999;
      margin-bottom: 2px;
    }
    .cover-sign-value {
      font-family: 'Cinzel', serif;
      font-size: 16px;
      color: #8B6914;
      font-weight: 600;
    }
    .cover-ornament {
      margin: 24px 0;
      font-size: 18px;
      color: #d4a853;
      letter-spacing: 8px;
    }
    .cover-footer {
      position: absolute;
      bottom: 30px;
      font-size: 10px;
      color: #aaa;
    }

    /* ── Section wrapper ── */
    .section {
      margin-bottom: 24px;
    }
    .section-intro {
      font-size: 11.5px;
      color: #555;
      margin-bottom: 10px;
      line-height: 1.7;
    }

    /* ── Tables ── */
    .data-table {
      width: 100%;
      border-collapse: collapse;
      margin: 8px 0 16px 0;
      font-size: 10.5px;
    }
    .data-table th, .data-table td {
      border: 1px solid #e0dbd0;
      padding: 5px 8px;
      text-align: left;
      vertical-align: top;
    }
    .data-table th {
      background: #f8f5eb;
      font-weight: 600;
      color: #8B6914;
      font-size: 10px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      white-space: nowrap;
    }
    .data-table tr:nth-child(even) { background: #fdfcf9; }
    .planet-name { font-weight: 600; color: #333; white-space: nowrap; }
    .degree-cell { font-variant-numeric: tabular-nums; font-size: 10px; }
    .pada-cell, .house-cell { text-align: center; }
    .dignity-exalted { color: #16a34a; font-weight: 700; }
    .dignity-debilitated { color: #dc2626; font-weight: 700; }
    .dignity-own { color: #d97706; font-weight: 600; }
    .asc-row { background: #f8f5eb !important; }
    .empty-text { color: #bbb; font-style: italic; }

    /* ── Retrograde & Combust badges ── */
    .retro-badge, .combust-badge {
      display: inline-block;
      font-size: 8px;
      font-weight: 700;
      width: 14px;
      height: 14px;
      line-height: 14px;
      text-align: center;
      border-radius: 50%;
      margin-left: 3px;
      vertical-align: middle;
    }
    .retro-badge { background: #6366f1; color: #fff; }
    .combust-badge { background: #f59e0b; color: #fff; }

    /* ── North Indian chart ── */
    .chart-wrapper {
      display: flex;
      gap: 24px;
      align-items: flex-start;
      flex-wrap: wrap;
    }
    .ni-chart {
      border-collapse: collapse;
      width: 280px;
      margin: 8px auto;
    }
    .ni-chart td {
      border: 1.5px solid #d4a853;
      width: 70px;
      height: 60px;
      text-align: center;
      vertical-align: middle;
      padding: 3px;
      font-size: 9px;
    }
    .chart-cell { background: #fdfcf9; }
    .asc-cell { background: #f8f0d8; }
    .chart-center {
      background: #f8f5eb;
      font-family: 'Cinzel', serif;
      color: #8B6914;
    }
    .chart-title { font-size: 12px; font-weight: 600; }
    .house-num {
      font-size: 8px;
      color: #8B6914;
      font-weight: 700;
      margin-bottom: 2px;
    }
    .house-planets {
      font-size: 9.5px;
      font-weight: 600;
      color: #333;
      line-height: 1.3;
    }

    /* ── Chart key info ── */
    .chart-key {
      flex: 1;
      min-width: 200px;
    }
    .chart-key-item {
      display: flex;
      justify-content: space-between;
      padding: 4px 0;
      border-bottom: 1px solid #f0ece0;
      font-size: 11px;
    }
    .chart-key-label { color: #888; }
    .chart-key-value { font-weight: 600; color: #333; }

    /* ── Personality ── */
    .personality-block {
      background: #fdfcf9;
      border: 1px solid #e8e3d8;
      border-radius: 6px;
      padding: 12px 16px;
      margin: 8px 0;
    }
    .personality-block h4 { margin-top: 0; }
    .personality-block p { font-size: 11px; color: #444; }

    /* ── Yoga cards ── */
    .yoga-group { margin: 10px 0; }
    .yoga-type { font-size: 13px; color: #8B6914; border-bottom: 1px solid #e8e3d8; padding-bottom: 3px; margin-bottom: 8px; }
    .yoga-card {
      background: #fdfcf9;
      border: 1px solid #e8e3d8;
      border-radius: 6px;
      padding: 10px 14px;
      margin: 6px 0;
    }
    .yoga-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px; }
    .yoga-name { font-weight: 700; font-size: 12px; color: #333; }
    .yoga-strength {
      font-size: 9px;
      font-weight: 700;
      padding: 2px 8px;
      border-radius: 4px;
      text-transform: uppercase;
    }
    .strength-strong { background: #dcfce7; color: #166534; }
    .strength-moderate { background: #fef9c3; color: #854d0e; }
    .strength-weak { background: #fee2e2; color: #991b1b; }
    .yoga-desc { font-size: 10.5px; color: #555; }
    .yoga-effect { font-size: 10.5px; color: #444; margin-top: 4px; }

    /* ── Dosha cards ── */
    .dosha-card {
      border: 1px solid #e8e3d8;
      border-radius: 6px;
      padding: 12px 16px;
      margin: 8px 0;
    }
    .dosha-present { border-left: 4px solid #ef4444; background: #fef2f2; }
    .dosha-absent { border-left: 4px solid #22c55e; background: #f0fdf4; }
    .dosha-header { display: flex; align-items: center; gap: 8px; margin-bottom: 6px; }
    .dosha-icon { font-size: 16px; }
    .dosha-name { font-weight: 700; font-size: 13px; color: #333; }
    .severity-badge {
      display: inline-block;
      font-size: 8px;
      font-weight: 700;
      color: #fff;
      padding: 2px 7px;
      border-radius: 4px;
      letter-spacing: 0.5px;
    }
    .dosha-desc { font-size: 10.5px; color: #555; }
    .dosha-remedy { font-size: 10.5px; color: #444; margin-top: 6px; }
    .cancellations { margin-top: 6px; font-size: 10px; }
    .cancellations ul { list-style: none; margin-top: 4px; }
    .cancellations li { padding: 2px 0; }
    .cancel-met { color: #16a34a; }
    .cancel-not { color: #dc2626; }

    /* ── Dasha timeline ── */
    .current-dasha { background: #f8f0d8 !important; font-weight: 600; }
    .current-antar { background: #fef9c3 !important; }
    .antar-row { color: #666; }
    .antar-indent { padding-left: 20px !important; }
    .active-badge {
      display: inline-block;
      background: #8B6914;
      color: #fff;
      font-size: 8px;
      font-weight: 700;
      padding: 2px 8px;
      border-radius: 4px;
      letter-spacing: 0.5px;
    }
    .active-badge.sub { background: #d97706; }

    /* ── Strength bars ── */
    .strength-bar {
      width: 100%;
      height: 10px;
      background: #f0ece0;
      border-radius: 5px;
      overflow: hidden;
    }
    .strength-fill {
      height: 100%;
      border-radius: 5px;
      transition: width 0.3s;
    }
    .strength-val { text-align: right; font-weight: 600; font-variant-numeric: tabular-nums; }
    .strength-status { font-size: 10px; color: #666; }

    /* ── Remedies ── */
    .remedy-group { margin: 10px 0; }
    .remedy-item {
      background: #fdfcf9;
      border: 1px solid #e8e3d8;
      border-radius: 6px;
      padding: 8px 14px;
      margin: 6px 0;
    }
    .remedy-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 3px; }
    .remedy-name { font-weight: 700; font-size: 11px; color: #333; }
    .remedy-planet { font-size: 9px; color: #8B6914; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; }

    /* ── Year predictions ── */
    .year-overview { font-size: 11.5px; color: #444; line-height: 1.7; margin-bottom: 12px; }
    .subsection { font-size: 13px; margin: 14px 0 8px 0; }
    .year-event {
      background: #fdfcf9;
      border: 1px solid #e8e3d8;
      border-radius: 6px;
      padding: 10px 14px;
      margin: 6px 0;
    }
    .event-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 3px; }
    .event-title { font-weight: 700; font-size: 11px; }
    .event-impact { font-size: 9px; font-weight: 700; letter-spacing: 0.5px; }
    .event-period { font-size: 10px; color: #8B6914; font-weight: 500; margin-bottom: 4px; }
    .event-remedy { font-size: 10px; color: #6b5a1e; margin-top: 4px; }
    .quarters-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin: 8px 0; }
    .quarter-card {
      background: #fdfcf9;
      border: 1px solid #e8e3d8;
      border-radius: 6px;
      padding: 8px 12px;
    }
    .quarter-name { font-weight: 700; font-size: 11px; color: #333; }
    .quarter-outlook { font-size: 9px; font-weight: 700; margin-bottom: 3px; }
    .key-advice {
      background: #f8f5eb;
      border: 1px solid #d4a853;
      border-radius: 6px;
      padding: 10px 14px;
      margin-top: 10px;
      font-size: 11px;
      color: #6b5a1e;
    }

    /* ── Life areas ── */
    .life-areas-grid { display: grid; grid-template-columns: 1fr; gap: 8px; }
    .life-area-card {
      background: #fdfcf9;
      border: 1px solid #e8e3d8;
      border-radius: 6px;
      padding: 10px 14px;
    }
    .area-header { display: flex; align-items: center; gap: 8px; margin-bottom: 4px; }
    .area-icon { font-size: 16px; }
    .area-label { font-weight: 700; font-size: 12px; color: #333; flex: 1; }
    .area-rating { color: #d4a853; font-size: 13px; white-space: nowrap; }
    .area-summary { font-size: 11px; color: #444; font-weight: 500; }
    .area-details { font-size: 10.5px; color: #666; margin-top: 4px; }

    /* ── Karmic text ── */
    .karmic-text { font-size: 10px; color: #555; max-width: 220px; }

    /* ── Page footer ── */
    .page-footer {
      text-align: center;
      padding-top: 10px;
      margin-top: 20px;
      border-top: 1px solid #d4a853;
      font-size: 9px;
      color: #999;
    }
    .page-footer a { color: #8B6914; text-decoration: none; }

    /* ── Table of contents ── */
    .toc { margin: 20px 0; }
    .toc-item {
      display: flex;
      justify-content: space-between;
      align-items: baseline;
      padding: 5px 0;
      border-bottom: 1px dotted #d4a85340;
      font-size: 12px;
    }
    .toc-num { font-weight: 700; color: #8B6914; margin-right: 8px; font-size: 11px; }
    .toc-title { color: #333; font-weight: 500; }
  </style>
</head>
<body>
  <!-- Print action bar -->
  <div class="print-bar no-print">
    <button class="print-btn" id="print-btn" disabled>
      &#128424; Loading fonts...
    </button>
  </div>
  <script>
    /* Use document.fonts.ready — never setTimeout for font loading (Lesson E) */
    document.fonts.ready.then(function() {
      var btn = document.getElementById('print-btn');
      if (btn) {
        btn.disabled = false;
        btn.innerHTML = '&#128424; Save as PDF / Print';
        btn.onclick = function() { window.print(); };
      }
    });
  </script>

  <!-- ════════════════════════════════════════════════════════════ -->
  <!-- COVER PAGE -->
  <!-- ════════════════════════════════════════════════════════════ -->
  <div class="cover">
    <!-- Swastika (red) — sacred Hindu symbol of auspiciousness -->
    <div style="text-align:center; margin-bottom:12px;">
      <svg width="48" height="48" viewBox="0 0 100 100" style="display:inline-block;">
        <g fill="#C41E3A" stroke="#C41E3A" stroke-width="2">
          <!-- Central cross -->
          <rect x="42" y="10" width="16" height="80" rx="2"/>
          <rect x="10" y="42" width="80" height="16" rx="2"/>
          <!-- Four arms (clockwise) -->
          <rect x="58" y="10" width="28" height="12" rx="2"/>
          <rect x="78" y="42" width="12" height="28" rx="2"/>
          <rect x="14" y="78" width="28" height="12" rx="2"/>
          <rect x="10" y="30" width="12" height="28" rx="2"/>
          <!-- Four dots in quadrants -->
          <circle cx="30" cy="30" r="4"/>
          <circle cx="70" cy="30" r="4"/>
          <circle cx="30" cy="70" r="4"/>
          <circle cx="70" cy="70" r="4"/>
        </g>
      </svg>
    </div>

    <!-- Shree Ganesh invocation -->
    <div style="text-align:center; margin-bottom:8px;">
      <svg width="64" height="64" viewBox="0 0 100 100" style="display:inline-block;">
        <!-- Stylized Ganesh silhouette -->
        <g fill="#C41E3A" opacity="0.85">
          <!-- Head (round) -->
          <circle cx="50" cy="30" r="18"/>
          <!-- Crown -->
          <polygon points="35,16 50,4 65,16" fill="#C41E3A"/>
          <!-- Large ears -->
          <ellipse cx="28" cy="28" rx="10" ry="14" fill="#C41E3A"/>
          <ellipse cx="72" cy="28" rx="10" ry="14" fill="#C41E3A"/>
          <!-- Trunk (curved to left) -->
          <path d="M50,48 Q45,56 38,62 Q34,66 38,68 Q42,70 46,64 Q50,58 50,48" fill="#C41E3A" stroke="#C41E3A" stroke-width="1"/>
          <!-- Body -->
          <ellipse cx="50" cy="65" rx="20" ry="18" fill="#C41E3A"/>
          <!-- Belly -->
          <ellipse cx="50" cy="68" rx="14" ry="12" fill="#fff" opacity="0.15"/>
          <!-- Arms -->
          <path d="M30,55 Q22,50 18,42" stroke="#C41E3A" stroke-width="6" fill="none" stroke-linecap="round"/>
          <path d="M70,55 Q78,50 82,42" stroke="#C41E3A" stroke-width="6" fill="none" stroke-linecap="round"/>
          <!-- Modak in right hand -->
          <circle cx="82" cy="40" r="5" fill="#C41E3A"/>
          <!-- Feet -->
          <ellipse cx="38" cy="84" rx="8" ry="4" fill="#C41E3A"/>
          <ellipse cx="62" cy="84" rx="8" ry="4" fill="#C41E3A"/>
        </g>
        <!-- Eyes -->
        <circle cx="43" cy="28" r="2" fill="#fff"/>
        <circle cx="57" cy="28" r="2" fill="#fff"/>
        <!-- Tusk -->
        <path d="M54,36 Q56,42 58,38" stroke="#fff" stroke-width="1.5" fill="none"/>
      </svg>
    </div>

    <!-- Ganesh Mantra in Devanagari -->
    <div style="font-family: 'Tiro Devanagari Sanskrit', 'Noto Sans Devanagari', serif; color: #C41E3A; font-size: 18px; font-weight: 700; text-align: center; letter-spacing: 2px; margin-bottom: 16px;">
      ॥ श्री गणेशाय नमः ॥
    </div>

    <div class="cover-brand">Dekho Panchang</div>
    <div class="cover-ornament">&#10022; &#10022; &#10022;</div>
    <h1>Vedic Birth Chart<br/>Report</h1>
    <div class="cover-subtitle">Comprehensive Kundali Analysis</div>
    <div class="cover-ornament">&#9672; &#9672; &#9672;</div>
    <div class="cover-name">${esc(name)}</div>
    <div class="cover-details">
      <strong>Date of Birth:</strong> ${esc(fmtBirth)}<br/>
      <strong>Time of Birth:</strong> ${esc(time)}<br/>
      <strong>Place:</strong> ${esc(place)}<br/>
      <strong>Coordinates:</strong> ${Math.abs(lat).toFixed(4)}&deg; ${lat >= 0 ? 'N' : 'S'}, ${Math.abs(lng).toFixed(4)}&deg; ${lng >= 0 ? 'E' : 'W'}<br/>
      <strong>Timezone:</strong> ${esc(timezone)}
    </div>
    <div class="cover-signs">
      <div class="cover-sign">
        <div class="cover-sign-label">Ascendant</div>
        <div class="cover-sign-value">${esc(ascSign)}</div>
      </div>
      <div class="cover-sign">
        <div class="cover-sign-label">Moon Sign</div>
        <div class="cover-sign-value">${esc(moonSign)}</div>
      </div>
      <div class="cover-sign">
        <div class="cover-sign-label">Sun Sign</div>
        <div class="cover-sign-value">${esc(sunSign)}</div>
      </div>
    </div>
    <div class="cover-footer">
      Generated on ${esc(generatedDate)} &bull; dekhopanchang.com
    </div>
  </div>

  <!-- ════════════════════════════════════════════════════════════ -->
  <!-- TABLE OF CONTENTS -->
  <!-- ════════════════════════════════════════════════════════════ -->
  <div class="page-break"></div>
  <div class="section">
    <h2>Table of Contents</h2>
    <div class="toc">
      <div class="toc-item"><span><span class="toc-num">1.</span><span class="toc-title">Birth Chart (Kundali)</span></span></div>
      <div class="toc-item"><span><span class="toc-num">2.</span><span class="toc-title">Personality Profile</span></span></div>
      <div class="toc-item"><span><span class="toc-num">3.</span><span class="toc-title">Planet Positions</span></span></div>
      <div class="toc-item"><span><span class="toc-num">4.</span><span class="toc-title">House Analysis</span></span></div>
      <div class="toc-item"><span><span class="toc-num">5.</span><span class="toc-title">Yogas (Planetary Combinations)</span></span></div>
      <div class="toc-item"><span><span class="toc-num">6.</span><span class="toc-title">Doshas (Afflictions)</span></span></div>
      <div class="toc-item"><span><span class="toc-num">7.</span><span class="toc-title">Vimshottari Dasha Timeline</span></span></div>
      <div class="toc-item"><span><span class="toc-num">8.</span><span class="toc-title">Current Period Analysis</span></span></div>
      <div class="toc-item"><span><span class="toc-num">9.</span><span class="toc-title">Planetary Strength (Shadbala)</span></span></div>
      <div class="toc-item"><span><span class="toc-num">10.</span><span class="toc-title">Nadi Amsha (D-150)</span></span></div>
      <div class="toc-item"><span><span class="toc-num">11.</span><span class="toc-title">Remedies</span></span></div>
      <div class="toc-item"><span><span class="toc-num">12.</span><span class="toc-title">Year Ahead &amp; Life Areas</span></span></div>
    </div>
  </div>

  <!-- ════════════════════════════════════════════════════════════ -->
  <!-- SECTION 1: BIRTH CHART -->
  <!-- ════════════════════════════════════════════════════════════ -->
  <div class="page-break"></div>
  <div class="section">
    <h2>1. Birth Chart (Kundali)</h2>
    <div class="chart-wrapper">
      ${renderNorthChart(kundali)}
      <div class="chart-key">
        <h4>Key Details</h4>
        <div class="chart-key-item"><span class="chart-key-label">Ascendant (Lagna)</span><span class="chart-key-value">${esc(ascSign)} ${kundali.ascendant.degree.toFixed(2)}&deg;</span></div>
        <div class="chart-key-item"><span class="chart-key-label">Moon Sign</span><span class="chart-key-value">${esc(moonSign)}${moonPlanet ? ' ' + esc(moonPlanet.degree) : ''}</span></div>
        <div class="chart-key-item"><span class="chart-key-label">Sun Sign</span><span class="chart-key-value">${esc(sunSign)}${sunPlanet ? ' ' + esc(sunPlanet.degree) : ''}</span></div>
        <div class="chart-key-item"><span class="chart-key-label">Moon Nakshatra</span><span class="chart-key-value">${moonPlanet ? esc(tl(moonPlanet.nakshatra?.name as Record<string, string>, locale)) : '-'} (Pada ${moonPlanet?.pada || '-'})</span></div>
        <div class="chart-key-item"><span class="chart-key-label">Ayanamsha</span><span class="chart-key-value">Lahiri (${kundali.ayanamshaValue.toFixed(4)}&deg;)</span></div>
        <div class="chart-key-item"><span class="chart-key-label">Julian Day</span><span class="chart-key-value">${kundali.julianDay.toFixed(4)}</span></div>
        <h4 style="margin-top:12px">Planet Abbreviations</h4>
        <div style="font-size:9px;color:#888;line-height:1.8">
          Su=Sun, Mo=Moon, Ma=Mars, Me=Mercury, Ju=Jupiter,<br/>
          Ve=Venus, Sa=Saturn, Ra=Rahu, Ke=Ketu<br/>
          <span class="retro-badge" style="vertical-align:middle">R</span> = Retrograde &nbsp;
          <span class="combust-badge" style="vertical-align:middle">C</span> = Combust
        </div>
      </div>
    </div>
  </div>

  <!-- ════════════════════════════════════════════════════════════ -->
  <!-- SECTION 2: PERSONALITY PROFILE -->
  <!-- ════════════════════════════════════════════════════════════ -->
  <div class="page-break"></div>
  <div class="section">
    <h2>2. Personality Profile</h2>
    <p class="section-intro">${esc(tip.personality.summary)}</p>

    <div class="personality-block">
      <h4>${esc(tip.personality.lagna.title)}</h4>
      <p>${esc(tip.personality.lagna.content)}</p>
      <p><strong>Implications:</strong> ${esc(tip.personality.lagna.implications)}</p>
    </div>
    <div class="personality-block">
      <h4>${esc(tip.personality.moonSign.title)}</h4>
      <p>${esc(tip.personality.moonSign.content)}</p>
      <p><strong>Implications:</strong> ${esc(tip.personality.moonSign.implications)}</p>
    </div>
    <div class="personality-block">
      <h4>${esc(tip.personality.sunSign.title)}</h4>
      <p>${esc(tip.personality.sunSign.content)}</p>
      <p><strong>Implications:</strong> ${esc(tip.personality.sunSign.implications)}</p>
    </div>
  </div>

  <!-- ════════════════════════════════════════════════════════════ -->
  <!-- SECTION 3: PLANET POSITIONS -->
  <!-- ════════════════════════════════════════════════════════════ -->
  <div class="page-break"></div>
  <div class="section">
    <h2>3. Planet Positions</h2>
    <table class="data-table">
      <thead>
        <tr>
          <th>Planet</th>
          <th>Sign</th>
          <th>Degree</th>
          <th>Nakshatra</th>
          <th>Pada</th>
          <th>House</th>
          <th>Dignity</th>
        </tr>
      </thead>
      <tbody>
        ${ascRow}
        ${planetRows}
      </tbody>
    </table>
  </div>

  <!-- ════════════════════════════════════════════════════════════ -->
  <!-- SECTION 4: HOUSE ANALYSIS -->
  <!-- ════════════════════════════════════════════════════════════ -->
  <div class="section">
    <h2>4. House Analysis</h2>
    <table class="data-table">
      <thead>
        <tr>
          <th>House</th>
          <th>Sign</th>
          <th>Lord</th>
          <th>Planets</th>
        </tr>
      </thead>
      <tbody>${houseRows}</tbody>
    </table>
    ${tip.lifeAreas ? `
    <h3>Life Areas Overview</h3>
    <div class="life-areas-grid">${lifeAreasHtml}</div>
    ` : ''}
  </div>

  <!-- ════════════════════════════════════════════════════════════ -->
  <!-- SECTION 5: YOGAS -->
  <!-- ════════════════════════════════════════════════════════════ -->
  <div class="page-break"></div>
  <div class="section">
    <h2>5. Yogas (Planetary Combinations)</h2>
    <p class="section-intro">Yogas are special planetary combinations that indicate strengths, talents, and life events in the birth chart. Active yogas found: <strong>${activeYogas.length}</strong></p>
    ${yogasHtml}
  </div>

  <!-- ════════════════════════════════════════════════════════════ -->
  <!-- SECTION 6: DOSHAS -->
  <!-- ════════════════════════════════════════════════════════════ -->
  <div class="page-break"></div>
  <div class="section">
    <h2>6. Doshas (Afflictions)</h2>
    <p class="section-intro">Doshas are planetary afflictions that may influence certain areas of life. Their effects can be mitigated through specific remedies and awareness.</p>
    ${doshasHtml}
  </div>

  <!-- ════════════════════════════════════════════════════════════ -->
  <!-- SECTION 7: DASHA TIMELINE -->
  <!-- ════════════════════════════════════════════════════════════ -->
  <div class="page-break"></div>
  <div class="section">
    <h2>7. Vimshottari Dasha Timeline</h2>
    <p class="section-intro">The Vimshottari Dasha system divides life into planetary periods. Each Mahadasha (major period) lasts several years and is ruled by a specific planet that colors the experiences of that phase.</p>
    <table class="data-table">
      <thead>
        <tr>
          <th>Period</th>
          <th>Start</th>
          <th>End</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody>${dashaRows}</tbody>
    </table>
  </div>

  <!-- ════════════════════════════════════════════════════════════ -->
  <!-- SECTION 8: CURRENT PERIOD ANALYSIS -->
  <!-- ════════════════════════════════════════════════════════════ -->
  <div class="page-break"></div>
  <div class="section">
    <h2>8. Current Period Analysis</h2>
    <div class="personality-block">
      <h4>Current Mahadasha: ${esc(tip.dashaInsight.currentMaha)}</h4>
      <p>${esc(tip.dashaInsight.currentMahaAnalysis)}</p>
    </div>
    <div class="personality-block">
      <h4>Current Antardasha: ${esc(tip.dashaInsight.currentAntar)}</h4>
      <p>${esc(tip.dashaInsight.currentAntarAnalysis)}</p>
    </div>
    <div class="personality-block">
      <h4>Looking Ahead</h4>
      <p>${esc(tip.dashaInsight.upcoming)}</p>
    </div>
  </div>

  <!-- ════════════════════════════════════════════════════════════ -->
  <!-- SECTION 9: STRENGTH ANALYSIS -->
  <!-- ════════════════════════════════════════════════════════════ -->
  <div class="section">
    <h2>9. Planetary Strength (Shadbala)</h2>
    <p class="section-intro">Shadbala measures the strength of each planet across six dimensions. Higher strength indicates a more powerful planetary influence in the chart.</p>
    <table class="data-table">
      <thead>
        <tr>
          <th>Planet</th>
          <th style="width:40%">Strength</th>
          <th>Score</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody>${strengthRows}</tbody>
    </table>
  </div>

  <!-- ════════════════════════════════════════════════════════════ -->
  <!-- SECTION 10: NADI AMSHA -->
  <!-- ════════════════════════════════════════════════════════════ -->
  <div class="page-break"></div>
  <div class="section">
    <h2>10. Nadi Amsha (D-150)</h2>
    <p class="section-intro">Nadi Amsha divides each sign into 150 parts (0.2&deg; each), revealing deep karmic patterns. This chart requires precise birth time &mdash; even a 2-minute error can shift positions.</p>
    ${nadiHtml || '<p class="empty-text">Nadi Amsha data could not be computed for this chart.</p>'}
  </div>

  <!-- ════════════════════════════════════════════════════════════ -->
  <!-- SECTION 11: REMEDIES -->
  <!-- ════════════════════════════════════════════════════════════ -->
  <div class="page-break"></div>
  <div class="section">
    <h2>11. Remedies</h2>
    <p class="section-intro">Based on your chart analysis, the following remedial measures are recommended to strengthen weak planets and mitigate afflictions.</p>

    ${tip.remedies.gemstones.length > 0 ? `
    <h3>&#128142; Gemstones</h3>
    <div class="remedy-group">${gemstonesHtml}</div>
    ` : ''}

    ${tip.remedies.mantras.length > 0 ? `
    <h3>&#128255; Mantras</h3>
    <div class="remedy-group">${mantrasHtml}</div>
    ` : ''}

    ${tip.remedies.practices.length > 0 ? `
    <h3>&#9758; Practices</h3>
    <div class="remedy-group">${practicesHtml}</div>
    ` : ''}
  </div>

  <!-- ════════════════════════════════════════════════════════════ -->
  <!-- SECTION 12: YEAR AHEAD -->
  <!-- ════════════════════════════════════════════════════════════ -->
  <div class="page-break"></div>
  <div class="section">
    <h2>12. Year Ahead &amp; Life Areas</h2>
    ${yearHtml || '<p class="empty-text">Year predictions are not available for this chart.</p>'}
  </div>

  <!-- ════════════════════════════════════════════════════════════ -->
  <!-- FINAL FOOTER -->
  <!-- ════════════════════════════════════════════════════════════ -->
  <div class="page-footer">
    <p>Generated by <a href="https://dekhopanchang.com" target="_blank" rel="noopener">Dekho Panchang</a> on ${esc(generatedDate)}</p>
    <p>For a personalized consultation, visit <a href="https://dekhopanchang.com/kundali" target="_blank" rel="noopener">dekhopanchang.com/kundali</a></p>
    <p style="margin-top:8px;font-size:8px;color:#bbb;">Calculations use Lahiri Ayanamsha with Meeus astronomical algorithms. This report is for educational and entertainment purposes.</p>
  </div>
</body>
</html>`;
}
