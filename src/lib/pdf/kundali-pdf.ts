import type { KundaliData } from '@/types/kundali';
import { GRAHAS } from '@/lib/constants/grahas';
import { RASHIS } from '@/lib/constants/rashis';
import { computePersonalTransits, computeUpcomingTransitions } from '@/lib/transit/personal-transits';

type Locale = 'en' | 'hi' | 'sa';

function t(obj: { en: string; hi?: string; sa?: string } | undefined, locale: Locale): string {
  if (!obj) return '-';
  return (obj as Record<string, string>)[locale] || obj.en || '-';
}

export function generateKundaliPrintHtml(kundali: KundaliData, locale: Locale): string {
  const name = kundali.birthData.name || 'Native';
  const isDevanagari = locale !== 'en' && String(locale) !== 'ta';
  const devaClass = isDevanagari ? ' class="devanagari"' : '';

  // Birth details
  const birthRows = [
    [locale === 'en' ? 'Date' : 'तिथि', kundali.birthData.date],
    [locale === 'en' ? 'Time' : 'समय', kundali.birthData.time],
    [locale === 'en' ? 'Place' : 'स्थान', kundali.birthData.place || '-'],
    [locale === 'en' ? 'Latitude' : 'अक्षांश', kundali.birthData.lat?.toFixed(4) || '-'],
    [locale === 'en' ? 'Longitude' : 'देशान्तर', kundali.birthData.lng?.toFixed(4) || '-'],
    [locale === 'en' ? 'Ayanamsha' : 'अयनांश', `${kundali.birthData.ayanamsha} (${kundali.ayanamshaValue?.toFixed(4) || '-'})`],
  ];

  const birthTable = `
    <div class="section">
      <h2${devaClass}>${locale === 'en' ? 'Birth Details' : 'जन्म विवरण'}</h2>
      <table>
        ${birthRows.map(([label, val]) => `<tr><th${devaClass}>${label}</th><td>${val}</td></tr>`).join('')}
      </table>
    </div>`;

  // Ascendant
  const ascSign = RASHIS[kundali.ascendant.sign - 1];
  const ascInfo = `
    <div class="section">
      <h2${devaClass}>${locale === 'en' ? 'Ascendant (Lagna)' : 'लग्न'}</h2>
      <p><strong class="gold"${devaClass}>${ascSign ? t(ascSign.name, locale) : '-'}</strong> at ${kundali.ascendant.degree?.toFixed(2) || '-'}&deg;</p>
    </div>`;

  // Planet positions
  const planetHeaders = locale === 'en'
    ? ['Planet', 'Sign', 'Degree', 'Nakshatra', 'Pada', 'House', 'R']
    : ['ग्रह', 'राशि', 'अंश', 'नक्षत्र', 'पाद', 'भाव', 'व'];

  const planetRows = kundali.planets.map(p => {
    const grahaName = t(p.planet?.name, locale);
    const signName = t(p.signName, locale);
    const nakName = t(p.nakshatra?.name, locale);
    return `<tr>
      <td${devaClass}><strong>${grahaName}</strong></td>
      <td${devaClass}>${signName}</td>
      <td>${p.degree || '-'}</td>
      <td${devaClass}>${nakName}</td>
      <td>${p.pada || '-'}</td>
      <td>${p.house || '-'}</td>
      <td>${p.isRetrograde ? 'R' : ''}</td>
    </tr>`;
  });

  const planetTable = `
    <div class="section">
      <h2${devaClass}>${locale === 'en' ? 'Planet Positions' : 'ग्रह स्थिति'}</h2>
      <table>
        <thead><tr>${planetHeaders.map(h => `<th${devaClass}>${h}</th>`).join('')}</tr></thead>
        <tbody>${planetRows.join('')}</tbody>
      </table>
    </div>`;

  // Navamsha summary
  let navamshaHtml = '';
  if (kundali.navamshaChart) {
    const navPlanets = kundali.navamshaChart.houses.map((planetIds, hIdx) => {
      if (!planetIds || planetIds.length === 0) return null;
      const houseNum = hIdx + 1;
      const signNum = ((kundali.navamshaChart.ascendantSign - 1 + hIdx) % 12) + 1;
      const rashi = RASHIS[signNum - 1];
      const names = planetIds.map(pid => {
        const g = GRAHAS[pid];
        return g ? t(g.name, locale) : `P${pid}`;
      }).join(', ');
      return `<tr><td>${houseNum}</td><td${devaClass}>${rashi ? t(rashi.name, locale) : '-'}</td><td${devaClass}>${names}</td></tr>`;
    }).filter(Boolean).join('');

    if (navPlanets) {
      navamshaHtml = `
        <div class="section">
          <h2${devaClass}>${locale === 'en' ? 'Navamsha (D9) Summary' : 'नवांश (D9) सारांश'}</h2>
          <table>
            <thead><tr><th>${locale === 'en' ? 'House' : 'भाव'}</th><th${devaClass}>${locale === 'en' ? 'Sign' : 'राशि'}</th><th${devaClass}>${locale === 'en' ? 'Planets' : 'ग्रह'}</th></tr></thead>
            <tbody>${navPlanets}</tbody>
          </table>
        </div>`;
    }
  }

  // Dasha periods (maha only)
  const mahaDashas = kundali.dashas.filter(d => d.level === 'maha').slice(0, 12);
  let dashaHtml = '';
  if (mahaDashas.length > 0) {
    const dashaRows = mahaDashas.map(d => {
      return `<tr>
        <td${devaClass}><strong>${t(d.planetName, locale)}</strong></td>
        <td>${d.startDate || '-'}</td>
        <td>${d.endDate || '-'}</td>
      </tr>`;
    }).join('');
    dashaHtml = `
      <div class="section">
        <h2${devaClass}>${locale === 'en' ? 'Vimshottari Dasha Periods' : 'विंशोत्तरी दशा काल'}</h2>
        <table>
          <thead><tr><th${devaClass}>${locale === 'en' ? 'Planet' : 'ग्रह'}</th><th>${locale === 'en' ? 'Start' : 'आरंभ'}</th><th>${locale === 'en' ? 'End' : 'समाप्ति'}</th></tr></thead>
          <tbody>${dashaRows}</tbody>
        </table>
      </div>`;
  }

  // Yogas
  let yogaHtml = '';
  if (kundali.yogasComplete && kundali.yogasComplete.length > 0) {
    const topYogas = kundali.yogasComplete.slice(0, 10);
    const yogaRows = topYogas.map(y => {
      return `<tr>
        <td${devaClass}><strong>${t(y.name, locale)}</strong></td>
        <td>${y.category || '-'}</td>
        <td>${y.strength || '-'}</td>
        <td>${t(y.description, locale) || '-'}</td>
      </tr>`;
    }).join('');
    yogaHtml = `
      <div class="section">
        <h2${devaClass}>${locale === 'en' ? 'Yogas Detected' : 'योग'}</h2>
        <table>
          <thead><tr><th${devaClass}>${locale === 'en' ? 'Yoga' : 'योग'}</th><th>${locale === 'en' ? 'Category' : 'श्रेणी'}</th><th>${locale === 'en' ? 'Strength' : 'बल'}</th><th>${locale === 'en' ? 'Description' : 'विवरण'}</th></tr></thead>
          <tbody>${yogaRows}</tbody>
        </table>
      </div>`;
  }

  // Shadbala
  let shadbalaHtml = '';
  if (kundali.shadbala && kundali.shadbala.length > 0) {
    const sbRows = kundali.shadbala.map(sb => {
      return `<tr>
        <td${devaClass}><strong>${t(sb.planetName, locale)}</strong></td>
        <td>${sb.totalStrength?.toFixed(2) || '-'}</td>
        <td>${sb.sthanaBala?.toFixed(2) || '-'}</td>
        <td>${sb.digBala?.toFixed(2) || '-'}</td>
        <td>${sb.kalaBala?.toFixed(2) || '-'}</td>
      </tr>`;
    }).join('');
    shadbalaHtml = `
      <div class="section">
        <h2${devaClass}>${locale === 'en' ? 'Shadbala Summary' : 'षड्बल सारांश'}</h2>
        <table>
          <thead><tr>
            <th${devaClass}>${locale === 'en' ? 'Planet' : 'ग्रह'}</th>
            <th>${locale === 'en' ? 'Total' : 'कुल'}</th>
            <th>${locale === 'en' ? 'Sthana' : 'स्थान'}</th>
            <th>${locale === 'en' ? 'Dig' : 'दिक्'}</th>
            <th>${locale === 'en' ? 'Kala' : 'काल'}</th>
          </tr></thead>
          <tbody>${sbRows}</tbody>
        </table>
      </div>`;
  }

  // Transit Radar
  let transitHtml = '';
  const ascSignId = kundali.ascendant?.sign;
  const savTable = kundali.ashtakavarga?.savTable;
  if (ascSignId && savTable) {
    const transits = computePersonalTransits(ascSignId, savTable);
    if (transits.length > 0) {
      const transitHeaders = locale === 'en'
        ? ['Planet', 'Sign', 'House', 'SAV Bindus', 'Quality']
        : ['ग्रह', 'राशि', 'भाव', 'बिन्दु', 'गुणवत्ता'];

      const qualityColor = (q: string) =>
        q === 'strong' ? '#64c878' : q === 'weak' ? '#dc6464' : '#d4a853';
      const qualityLabel = (q: string) =>
        q === 'strong' ? (locale === 'en' ? 'Favorable' : 'शुभ')
          : q === 'weak' ? (locale === 'en' ? 'Challenging' : 'चुनौतीपूर्ण')
          : (locale === 'en' ? 'Moderate' : 'मध्यम');

      const transitRows = transits.map(tr => `<tr>
        <td${devaClass}><strong>${t(tr.planetName, locale)}</strong></td>
        <td${devaClass}>${t(tr.signName, locale)}</td>
        <td>${tr.house}</td>
        <td>${tr.savBindu}</td>
        <td style="color:${qualityColor(tr.quality)};font-weight:bold">${qualityLabel(tr.quality)}</td>
      </tr>`).join('');

      let upcomingHtml = '';
      const upcoming = computeUpcomingTransitions();
      if (upcoming.length > 0) {
        const uHeaders = locale === 'en'
          ? ['Planet', 'From', 'To', 'Approx. Date']
          : ['ग्रह', 'से', 'को', 'अनुमानित तिथि'];
        const uRows = upcoming.map(u => `<tr>
          <td${devaClass}>${t(u.planetName, locale)}</td>
          <td${devaClass}>${t(u.fromSign, locale)}</td>
          <td${devaClass}>${t(u.toSign, locale)}</td>
          <td>${u.approximateDate}</td>
        </tr>`).join('');
        upcomingHtml = `
          <h3${devaClass} style="color:#f0d48a;margin-top:12px">${locale === 'en' ? 'Upcoming Sign Changes' : 'आगामी राशि परिवर्तन'}</h3>
          <table>
            <thead><tr>${uHeaders.map(h => `<th${devaClass}>${h}</th>`).join('')}</tr></thead>
            <tbody>${uRows}</tbody>
          </table>`;
      }

      transitHtml = `
        <div class="section">
          <h2${devaClass}>${locale === 'en' ? 'Current Transit Analysis' : 'वर्तमान गोचर विश्लेषण'}</h2>
          <table>
            <thead><tr>${transitHeaders.map(h => `<th${devaClass}>${h}</th>`).join('')}</tr></thead>
            <tbody>${transitRows}</tbody>
          </table>
          ${upcomingHtml}
        </div>`;
    }
  }

  return `
    <h1${devaClass}>${locale === 'en' ? 'Vedic Birth Chart' : 'वैदिक जन्मकुण्डली'} — ${name}</h1>
    ${birthTable}
    ${ascInfo}
    ${planetTable}
    ${navamshaHtml}
    ${dashaHtml}
    ${yogaHtml}
    ${shadbalaHtml}
    ${transitHtml}
  `;
}
