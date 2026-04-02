import jsPDF from 'jspdf';
import type { KundaliData, PlanetPosition } from '@/types/kundali';
import type { Locale } from '@/types/panchang';
import { RASHIS } from '@/lib/constants/rashis';
import { GRAHAS } from '@/lib/constants/grahas';

const GOLD = '#d4a853';
const GOLD_LIGHT = '#f0d48a';
const NAVY = '#0a0e27';
const TEXT = '#e8e6e3';
const TEXT_DIM = '#9b97a0';

function addHeader(doc: jsPDF, kundali: KundaliData, locale: Locale) {
  // Background
  doc.setFillColor(10, 14, 39);
  doc.rect(0, 0, 210, 297, 'F');

  // Gold border
  doc.setDrawColor(212, 168, 83);
  doc.setLineWidth(0.5);
  doc.rect(8, 8, 194, 281);

  // Title
  doc.setTextColor(212, 168, 83);
  doc.setFontSize(24);
  doc.text('Dekho Panchang', 105, 25, { align: 'center' });

  // Subtitle
  doc.setFontSize(14);
  doc.setTextColor(240, 212, 138);
  doc.text('Kundali Report', 105, 33, { align: 'center' });

  // Divider
  doc.setDrawColor(212, 168, 83);
  doc.setLineWidth(0.3);
  doc.line(30, 38, 180, 38);

  // Birth details
  doc.setFontSize(10);
  doc.setTextColor(232, 230, 227);
  const bd = kundali.birthData;
  const details = [
    `Name: ${bd.name}`,
    `Date: ${bd.date}  |  Time: ${bd.time}`,
    `Place: ${bd.place} (${bd.lat.toFixed(4)}, ${bd.lng.toFixed(4)})`,
    `Ayanamsha: ${bd.ayanamsha} (${kundali.ayanamshaValue.toFixed(4)})`,
  ];
  details.forEach((line, i) => {
    doc.text(line, 105, 47 + i * 6, { align: 'center' });
  });
}

function addPlanetTable(doc: jsPDF, planets: PlanetPosition[], locale: Locale, startY: number): number {
  doc.setFontSize(12);
  doc.setTextColor(212, 168, 83);
  doc.text('Planetary Positions', 14, startY);

  const headers = ['Planet', 'Sign', 'Degree', 'Nakshatra', 'Pada', 'House', 'Status'];
  const colWidths = [24, 24, 24, 30, 14, 14, 52];
  let x = 14;
  const headerY = startY + 7;

  // Header row
  doc.setFillColor(17, 22, 56);
  doc.rect(14, headerY - 4, 182, 7, 'F');
  doc.setFontSize(8);
  doc.setTextColor(212, 168, 83);
  headers.forEach((h, i) => {
    doc.text(h, x + 1, headerY);
    x += colWidths[i];
  });

  // Data rows
  doc.setFontSize(7.5);
  let y = headerY + 8;
  planets.forEach((p, idx) => {
    if (idx % 2 === 0) {
      doc.setFillColor(14, 18, 45);
      doc.rect(14, y - 4, 182, 6.5, 'F');
    }

    doc.setTextColor(232, 230, 227);
    x = 14;
    const status = [
      p.isRetrograde ? 'R' : '',
      p.isCombust ? 'Comb' : '',
      p.isExalted ? 'Exalted' : '',
      p.isDebilitated ? 'Debil' : '',
      p.isOwnSign ? 'Own' : '',
    ].filter(Boolean).join(', ') || '-';

    const row = [
      p.planet.name[locale] || p.planet.name.en,
      p.signName[locale] || p.signName.en,
      p.degree,
      p.nakshatra.name[locale] || p.nakshatra.name.en,
      `${p.pada}`,
      `${p.house}`,
      status,
    ];

    row.forEach((cell, i) => {
      doc.text(cell, x + 1, y);
      x += colWidths[i];
    });
    y += 6.5;
  });

  return y + 4;
}

function addDashaTable(doc: jsPDF, kundali: KundaliData, locale: Locale, startY: number): number {
  doc.setFontSize(12);
  doc.setTextColor(212, 168, 83);
  doc.text('Vimshottari Dasha', 14, startY);

  doc.setFontSize(8);
  let y = startY + 8;
  const mahadashas = kundali.dashas.filter(d => d.level === 'maha');

  mahadashas.forEach((md, idx) => {
    if (idx % 2 === 0) {
      doc.setFillColor(14, 18, 45);
      doc.rect(14, y - 4, 182, 6.5, 'F');
    }
    doc.setTextColor(240, 212, 138);
    doc.text(md.planetName[locale] || md.planetName.en, 16, y);
    doc.setTextColor(155, 151, 160);
    doc.text(`${md.startDate} — ${md.endDate}`, 60, y);
    y += 6.5;
  });

  return y + 4;
}

function addShadbalaTable(doc: jsPDF, kundali: KundaliData, locale: Locale, startY: number): number {
  if (startY > 250) {
    // We'd need a new page — skip for now
    return startY;
  }

  doc.setFontSize(12);
  doc.setTextColor(212, 168, 83);
  doc.text('Shadbala Strength', 14, startY);

  const headers = ['Planet', 'Sthana', 'Dig', 'Kala', 'Cheshta', 'Naisargika', 'Drik', 'Total'];
  const colWidths = [28, 22, 22, 22, 22, 26, 22, 22];
  let x = 14;
  const headerY = startY + 7;

  doc.setFillColor(17, 22, 56);
  doc.rect(14, headerY - 4, 182, 7, 'F');
  doc.setFontSize(7.5);
  doc.setTextColor(212, 168, 83);
  headers.forEach((h, i) => {
    doc.text(h, x + 1, headerY);
    x += colWidths[i];
  });

  let y = headerY + 8;
  doc.setTextColor(232, 230, 227);
  kundali.shadbala.forEach((sb, idx) => {
    if (idx % 2 === 0) {
      doc.setFillColor(14, 18, 45);
      doc.rect(14, y - 4, 182, 6.5, 'F');
    }
    x = 14;
    const row = [
      sb.planetName[locale] || sb.planetName.en,
      sb.sthanaBala.toFixed(1),
      sb.digBala.toFixed(1),
      sb.kalaBala.toFixed(1),
      sb.cheshtaBala.toFixed(1),
      sb.naisargikaBala.toFixed(1),
      sb.drikBala.toFixed(1),
      sb.totalStrength.toFixed(1),
    ];
    row.forEach((cell, i) => {
      doc.text(cell, x + 1, y);
      x += colWidths[i];
    });
    y += 6.5;
  });

  return y + 4;
}

function addFooter(doc: jsPDF) {
  doc.setFontSize(7);
  doc.setTextColor(155, 151, 160);
  doc.text('Generated by Dekho Panchang — dekhopanchang.com', 105, 285, { align: 'center' });
  doc.text('Calculations use Lahiri Ayanamsha with Meeus astronomical algorithms', 105, 289, { align: 'center' });
}

export function exportKundaliPDF(kundali: KundaliData, locale: Locale = 'en') {
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });

  addHeader(doc, kundali, locale);

  // Planet table starts after birth details
  let y = addPlanetTable(doc, kundali.planets, locale, 78);

  // Dasha
  y = addDashaTable(doc, kundali, locale, y + 4);

  // Shadbala
  y = addShadbalaTable(doc, kundali, locale, y + 4);

  addFooter(doc);

  // Save
  const name = kundali.birthData.name.replace(/[^a-zA-Z0-9]/g, '_') || 'kundali';
  doc.save(`${name}_kundali_report.pdf`);
}
