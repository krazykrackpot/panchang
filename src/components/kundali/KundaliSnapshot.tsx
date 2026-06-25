'use client';

/**
 * KundaliSnapshot — "Info to share with your pandit/jyotish".
 *
 * One-page dense data card matching the fidelity of a professional
 * pandit's printout: panchang-at-birth, D1 + D9 chart visuals, the full
 * planetary-positions table (sign + longitude DMS + nakshatra + pada +
 * retrograde flag), all 9 Vimshottari mahadashas with antardashas,
 * the 8 × 12 ashtakavarga grid, and the chalit (bhava cusp) table.
 *
 * No interpretation, no domain commentary — just the canonical
 * numerical surfaces a human astrologer needs to do their own reading.
 * Lives in Simple mode (free) so any visitor can share the data with
 * a pandit without paying for the interpretation layer.
 *
 * Reads only from KundaliData; computes panchang-at-birth inline so we
 * don't have to thread another prop through Client.tsx.
 */

import dynamic from 'next/dynamic';
import { useRef, useState } from 'react';
import { Download, FileImage, Loader2, Printer } from 'lucide-react';
import type { KundaliData } from '@/types/kundali';
import type { Locale, LocaleText } from '@/types/panchang';
import { tl } from '@/lib/utils/trilingual';
import { isDevanagariLocale } from '@/lib/utils/locale-fonts';
import {
  calculateTithi,
  calculateYoga,
  calculateKarana,
  dateToJD,
  SAMVATSARA_NAMES,
} from '@/lib/ephem/astronomical';
import { TITHI_NAMES, KARANA_NAMES } from '@/lib/panchang/types';
import { SIGN_LORDS } from '@/lib/constants/dignities';
import { NAKSHATRAS } from '@/lib/constants/nakshatras';
import { getUTCOffsetForDate } from '@/lib/utils/timezone';
import { getSunTimes, formatMinutesHHMM } from '@/lib/astronomy/sunrise';

const ChartNorth = dynamic(() => import('./ChartNorth'), { ssr: false });

// 27 Yogas (the 27 Nityayogas, not yogas-as-combinations)
const NITYA_YOGAS = [
  'Vishkambha', 'Priti', 'Ayushman', 'Saubhagya', 'Shobhana',
  'Atiganda', 'Sukarma', 'Dhriti', 'Shoola', 'Ganda',
  'Vriddhi', 'Dhruva', 'Vyaghata', 'Harshana', 'Vajra',
  'Siddhi', 'Vyatipata', 'Variyan', 'Parigha', 'Shiva',
  'Siddha', 'Sadhya', 'Shubha', 'Shukla', 'Brahma',
  'Indra', 'Vaidhriti',
];

// 12 sign abbreviations (compact, fit the chart cells)
const SIGN_ABBR = ['Ari', 'Tau', 'Gem', 'Can', 'Leo', 'Vir', 'Lib', 'Sco', 'Sag', 'Cap', 'Aqu', 'Pis'];

// 9-planet abbreviations matching the engine's planet.id (0..8)
const PLANET_ABBR_EN = ['Sun', 'Moon', 'Mar', 'Mer', 'Jup', 'Ven', 'Sat', 'Rah', 'Ket'];
const PLANET_ABBR_HI = ['सूर्य', 'चंद्र', 'मंगल', 'बुध', 'गुरु', 'शुक्र', 'शनि', 'राहु', 'केतु'];

/** Sidereal longitude → "DD°MM'SS\"" string (used for ASC and the planet-table fallback). */
function longToDMS(deg: number): string {
  const d = Math.floor(deg);
  const mFrac = (deg - d) * 60;
  const m = Math.floor(mFrac);
  const s = Math.round((mFrac - m) * 60);
  return `${String(d).padStart(2, '0')}°${String(m).padStart(2, '0')}'${String(s).padStart(2, '0')}"`;
}

interface Props {
  kundali: KundaliData;
  locale: string;
}

export default function KundaliSnapshot({ kundali, locale }: Props) {
  const isHi = isDevanagariLocale(locale);
  const L = (en: string, hi: string) => (isHi ? hi : en);
  const PLANET_ABBR = isHi ? PLANET_ABBR_HI : PLANET_ABBR_EN;

  // Export state — exposed via the toolbar buttons in the header strip.
  // PDF reuses the same multi-page exportKundaliPDF helper Patrika uses,
  // so fidelity is identical (cover / planet positions / houses / yogas
  // / shadbala / dasha / ashtakavarga, all branded). JPEG is an
  // html-to-image snapshot of the card element — useful for sharing
  // via WhatsApp/Telegram where PDF attachments are awkward.
  const cardRef = useRef<HTMLDivElement | null>(null);
  const [exportBusy, setExportBusy] = useState<'pdf' | 'jpeg' | null>(null);

  async function handleExportPDF() {
    setExportBusy('pdf');
    try {
      const { exportKundaliPDF } = await import('@/lib/export/pdf-kundali');
      exportKundaliPDF(kundali, locale as Locale);
    } catch (err) {
      console.error('[KundaliSnapshot] PDF export failed:', err);
      alert(L('PDF export failed — please retry.', 'PDF एक्सपोर्ट विफल — पुनः प्रयास करें।'));
    } finally {
      setExportBusy(null);
    }
  }

  async function handleExportJPEG() {
    if (!cardRef.current) return;
    setExportBusy('jpeg');
    try {
      const { toJpeg } = await import('html-to-image');
      const dataUrl = await toJpeg(cardRef.current, {
        // Higher pixelRatio → sharper on retina displays + WhatsApp's
        // re-encoding pass survives better.
        pixelRatio: 2,
        backgroundColor: '#0a0e27',
        // Some chart cells reference /_next/image — without query params
        // the html-to-image cache collapses all images to one key.
        includeQueryParams: true,
        quality: 0.95,
      });
      // Trigger a download as 'kundali-<name>-<date>.jpg'
      const safeName = (kundali.birthData.name || 'kundali').replace(/[^\w\-]+/g, '_').slice(0, 40);
      const fname = `kundali-${safeName}-${kundali.birthData.date}.jpg`;
      const a = document.createElement('a');
      a.href = dataUrl;
      a.download = fname;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } catch (err) {
      console.error('[KundaliSnapshot] JPEG export failed:', err);
      alert(L('Image export failed — please retry.', 'इमेज एक्सपोर्ट विफल — पुनः प्रयास करें।'));
    } finally {
      setExportBusy(null);
    }
  }

  const bd = kundali.birthData;

  // ─── Panchang at birth (compute inline; not stored on KundaliData) ───
  const [bY, bM, bD] = bd.date.split('-').map(Number);
  const [bH, bMin] = bd.time.split(':').map(Number);
  const tzOffsetHours = getUTCOffsetForDate(bY, bM, bD, bd.timezone || 'UTC');
  // Birth instant in UT, expressed as a fractional hour suitable for dateToJD.
  const utHour = bH + bMin / 60 - tzOffsetHours;
  const jdBirth = dateToJD(bY, bM, bD, utHour);

  const tithiResult = calculateTithi(jdBirth);
  const tithiNum = tithiResult.number; // 1..30
  const tithiName = TITHI_NAMES[tithiNum - 1] ?? '—';
  const paksha = tithiNum <= 15 ? L('Shukla', 'शुक्ल') : L('Krishna', 'कृष्ण');

  const yogaNum = calculateYoga(jdBirth, kundali.ayanamshaValue);
  const yogaName = NITYA_YOGAS[yogaNum - 1] ?? '—';

  const karanaNum = calculateKarana(jdBirth);
  const karanaName = KARANA_NAMES[karanaNum - 1] ?? '—';

  // Sunrise / sunset on birth date at birth location.
  const sun = getSunTimes(bY, bM, bD, bd.lat, bd.lng, tzOffsetHours);
  const sunriseStr = formatMinutesHHMM(sun.sunriseMinutes);
  const sunsetStr = formatMinutesHHMM(sun.sunsetMinutes);

  // Moon Rashi + Rashi Lord (from Moon's sign).
  const moon = kundali.planets.find((p) => p.planet.id === 1);
  const moonSign = moon?.sign ?? 1;
  const rasiLordId = SIGN_LORDS[moonSign] ?? 0;
  const rasiName = SIGN_ABBR[moonSign - 1] ?? '—';

  // Star + Pada (Moon nakshatra) and its lord.
  const moonNak = moon?.nakshatra;
  const moonNakName = moonNak?.name ? (typeof moonNak.name === 'string' ? moonNak.name : tl(moonNak.name as { en: string; hi: string }, locale)) : '—';
  const moonNakPada = moon?.pada ?? 0;
  const moonNakLord = moonNak?.id ? (NAKSHATRAS[moonNak.id - 1]?.ruler ?? '—') : '—';

  // Day of week (Sunday = 0). Compute from the LOCAL birth date,
  // not from jdBirth (which is UTC). For e.g. an India birth at
  // 02:00 IST on 15-Aug, jdBirth is 14-Aug UTC and would yield the
  // wrong weekday. Date.UTC(...) + getUTCDay() reads the local
  // calendar day without server-tz contamination (lesson L).
  const weekday = new Date(Date.UTC(bY, bM - 1, bD)).getUTCDay();
  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const dayName = dayNames[weekday] ?? '—';

  // ASC longitude DMS
  const ascSignName = SIGN_ABBR[(kundali.ascendant.sign - 1)] ?? '—';
  const ascDMS = longToDMS(kundali.ascendant.degree);

  // ─── Planetary positions table (ASC + 9 planets, in engine order) ───
  // Each row: planet | sign | longitude DMS (within sign) | nakshatra + pada
  const planetRows = kundali.planets.map((p) => ({
    name: PLANET_ABBR[p.planet.id] ?? p.planet.id.toString(),
    sign: SIGN_ABBR[(p.sign - 1)] ?? '—',
    deg: p.degree, // already pre-formatted DD°MM'SS"
    nak: typeof p.nakshatra.name === 'string' ? p.nakshatra.name : tl(p.nakshatra.name as { en: string; hi: string }, locale),
    pada: p.pada,
    retro: p.isRetrograde,
  }));

  // ─── Ashtakavarga (7 contributors — Rahu/Ketu excluded by classical rule) ───
  // Pull from the same locale-aware PLANET_ABBR (indices 0..6 = Sun..Saturn).
  const av = kundali.ashtakavarga;
  const bpiPlanetLabels = PLANET_ABBR.slice(0, 7);

  // ─── Chalit (bhav chalit) cusps ───
  const chalitRows = kundali.houses.map((h) => ({
    bhav: h.house,
    sign: SIGN_ABBR[h.sign - 1] ?? '—',
    deg: longToDMS(h.degree),
  }));

  // ─── Vimshottari mahadasha + antardasha cells (3 columns × 3 rows for the 9 mahadashas) ───
  const mahadashas = kundali.dashas.slice(0, 9);

  // Card style (matches the project convention; do NOT use bg-bg-secondary for new cards)
  const cardCls =
    'bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-2xl p-4 sm:p-5';
  // Print modifiers — Tailwind's `print:` variants, applied globally
  // via the `[&_*]:print:...` arbitrary descendant selector so the
  // gold/text-secondary children flip to black on white too. Without
  // the descendant selector, child class colours (text-gold-light,
  // etc.) outrank the parent `print:text-black` and stay illegible.
  const printOverrides =
    'print:!bg-none print:!bg-white print:!text-black print:!border print:!border-gray-300 ' +
    '[&_*]:print:!bg-transparent [&_*]:print:!text-black [&_*]:print:!border-gray-300';

  return (
    <section ref={cardRef} className={`${cardCls} my-8 ${printOverrides}`}>
      {/* ─── Section title strip ─── */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mb-4 pb-3 border-b border-gold-primary/20">
        <div>
          <h2 className="text-gold-light text-lg sm:text-xl font-bold">
            {L('Info to share with your pandit / jyotish', 'पंडित / ज्योतिषी के साथ साझा करने योग्य जानकारी')}
          </h2>
          <p className="text-text-secondary text-xs mt-1">
            {L(
              'Full canonical data sheet — birth details, panchang, planetary positions, dashas, ashtakavarga, and the bhav-chalit cusps. Hand this to any astrologer.',
              'पूर्ण मानक डेटा शीट — जन्म विवरण, पंचांग, ग्रह स्थिति, दशा, अष्टकवर्ग, और भाव-चलित कुस्प। किसी भी ज्योतिषी को साझा करें।',
            )}
          </p>
        </div>
        {/* Export toolbar — PDF (multi-page branded; same fidelity as
            the Patrika tab), JPEG (single-shot image for WhatsApp), and
            Print (browser dialog with a black-on-white @media print). */}
        <div className="flex flex-wrap gap-2 shrink-0">
          <button
            type="button"
            onClick={handleExportPDF}
            disabled={!!exportBusy}
            data-html2canvas-ignore="true"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gold-primary/40 bg-gold-primary/10 text-gold-light hover:bg-gold-primary/20 text-xs transition-colors disabled:opacity-50"
          >
            {exportBusy === 'pdf' ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Download className="w-3.5 h-3.5" />}
            {L('PDF', 'PDF')}
          </button>
          <button
            type="button"
            onClick={handleExportJPEG}
            disabled={!!exportBusy}
            data-html2canvas-ignore="true"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gold-primary/40 bg-gold-primary/10 text-gold-light hover:bg-gold-primary/20 text-xs transition-colors disabled:opacity-50"
          >
            {exportBusy === 'jpeg' ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <FileImage className="w-3.5 h-3.5" />}
            {L('JPEG', 'JPEG')}
          </button>
          <button
            type="button"
            onClick={() => typeof window !== 'undefined' && window.print()}
            data-html2canvas-ignore="true"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gold-primary/30 text-gold-light hover:bg-gold-primary/10 text-xs transition-colors"
          >
            <Printer className="w-3.5 h-3.5" />
            {L('Print', 'प्रिंट')}
          </button>
        </div>
      </div>

      {/* ─── Header strip: birth + panchang grid ─── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-1.5 text-xs font-mono">
        <DataPair label={L('Name', 'नाम')} value={bd.name || '—'} />
        <DataPair label={L('Date', 'तिथि')} value={bd.date} />
        <DataPair label={L('Day', 'वार')} value={dayName} />
        <DataPair label={L('Time', 'समय')} value={bd.time} />
        <DataPair label={L('Place', 'स्थान')} value={bd.place || '—'} className="col-span-2" />
        <DataPair label={L('Lat', 'अक्षांश')} value={bd.lat.toFixed(4) + '°'} />
        <DataPair label={L('Lng', 'देशांतर')} value={bd.lng.toFixed(4) + '°'} />
        <DataPair label={L('Timezone', 'समय क्षेत्र')} value={`${bd.timezone} (UTC${tzOffsetHours >= 0 ? '+' : ''}${tzOffsetHours})`} className="col-span-2" />
        <DataPair label={L('Ayanamsha', 'अयनांश')} value={`${bd.ayanamsha} ${kundali.ayanamshaValue.toFixed(4)}°`} className="col-span-2" />
        <DataPair label={L('Sunrise', 'सूर्योदय')} value={sunriseStr} />
        <DataPair label={L('Sunset', 'सूर्यास्त')} value={sunsetStr} />
        <DataPair label={L('Tithi', 'तिथि')} value={`${tithiName} (${paksha})`} className="col-span-2" />
        <DataPair label={L('Yoga', 'योग')} value={yogaName} />
        <DataPair label={L('Karana', 'करण')} value={karanaName} />
        <DataPair label={L('Star (Nakshatra)', 'नक्षत्र')} value={`${moonNakName}-${moonNakPada}`} />
        <DataPair label={L('Star Lord', 'नक्षत्र स्वामी')} value={moonNakLord} />
        <DataPair label={L('Rashi (Moon)', 'राशि (चंद्र)')} value={rasiName} />
        <DataPair label={L('Rashi Lord', 'राशि स्वामी')} value={PLANET_ABBR[rasiLordId] ?? '—'} />
        <DataPair label={L('Ascendant', 'लग्न')} value={`${ascSignName} ${ascDMS}`} className="col-span-2" />
      </div>

      {/* ─── D1 + D9 charts side-by-side ─── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-5">
        <ChartPanel
          title={L('Lagna Chart (D1)', 'लग्न कुण्डली (D1)')}
          data={kundali.chart}
          planets={kundali.planets}
        />
        <ChartPanel
          title={L('Navamasa Chart (D9)', 'नवांश कुण्डली (D9)')}
          data={kundali.navamshaChart}
          planets={kundali.planets}
        />
      </div>

      {/* ─── Planetary Positions table ─── */}
      <h3 className="text-gold-light text-sm font-semibold mt-6 mb-2">
        {L('Planetary Positions', 'ग्रह स्थिति')}
      </h3>
      <div className="overflow-x-auto">
        <table className="w-full text-xs font-mono">
          <thead className="text-gold-dark border-b border-gold-primary/20">
            <tr>
              <th className="text-left py-1.5 pr-3">{L('Planet', 'ग्रह')}</th>
              <th className="text-left py-1.5 pr-3">{L('Sign', 'राशि')}</th>
              <th className="text-left py-1.5 pr-3">{L('Longitude', 'देशांतर')}</th>
              <th className="text-left py-1.5 pr-3">{L('Nakshatra', 'नक्षत्र')}</th>
              <th className="text-left py-1.5 pr-3">{L('Pada', 'पाद')}</th>
              <th className="text-left py-1.5">R</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-gold-primary/8">
              <td className="py-1 pr-3 text-gold-light font-semibold">{L('ASC', 'लग्न')}</td>
              <td className="py-1 pr-3">{ascSignName}</td>
              <td className="py-1 pr-3">{ascDMS}</td>
              <td className="py-1 pr-3">—</td>
              <td className="py-1 pr-3">—</td>
              <td className="py-1">—</td>
            </tr>
            {planetRows.map((r, i) => (
              <tr key={i} className="border-b border-gold-primary/8 last:border-0">
                <td className="py-1 pr-3 text-gold-light font-semibold">{r.name}</td>
                <td className="py-1 pr-3">{r.sign}</td>
                <td className="py-1 pr-3">{r.deg}</td>
                <td className="py-1 pr-3">{r.nak}</td>
                <td className="py-1 pr-3">{r.pada}</td>
                <td className="py-1 text-amber-400">{r.retro ? 'R' : ''}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ─── Vimshottari Dasha — 9 mahadashas in 3 columns × 3 rows ─── */}
      <h3 className="text-gold-light text-sm font-semibold mt-6 mb-2">
        {L('Vimshottari Dasha — Mahadashas + Antardashas', 'विंशोत्तरी दशा — महादशा + अंतर्दशा')}
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {mahadashas.map((maha) => (
          <DashaCell key={maha.planet} maha={maha} locale={locale} />
        ))}
      </div>

      {/* ─── Ashtakavarga table — 7 contributors × 12 signs + total ─── */}
      {av && (
        <>
          <h3 className="text-gold-light text-sm font-semibold mt-6 mb-2">
            {L('Ashtakavarga Table', 'अष्टकवर्ग सारणी')}
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-xs font-mono text-center">
              <thead className="text-gold-dark border-b border-gold-primary/20">
                <tr>
                  <th className="text-left py-1 pr-3">{L('Sign', 'राशि')}</th>
                  {Array.from({ length: 12 }).map((_, i) => (
                    <th key={i} className="py-1 px-1">{i + 1}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {bpiPlanetLabels.map((pName, planetIdx) => (
                  <tr key={pName} className="border-b border-gold-primary/8">
                    <td className="text-left py-1 pr-3 text-gold-light font-semibold">{pName}</td>
                    {av.bpiTable[planetIdx]?.map((v, i) => (
                      <td key={i} className="py-1 px-1">{v}</td>
                    ))}
                  </tr>
                ))}
                <tr className="border-t-2 border-gold-primary/40 font-semibold text-gold-light">
                  <td className="text-left py-1 pr-3">{L('Total (SAV)', 'योग')}</td>
                  {av.savTable.map((v, i) => (
                    <td key={i} className="py-1 px-1">{v}</td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* ─── Chalit (Bhav cusp) table — compact 2-column layout ─── */}
      <h3 className="text-gold-light text-sm font-semibold mt-6 mb-2">
        {L('Bhav Chalit (Cusp) Table', 'भाव चलित सारणी')}
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1 text-xs font-mono">
        {chalitRows.map((r) => (
          <div key={r.bhav} className="flex items-baseline justify-between border-b border-gold-primary/8 pb-1">
            <span className="text-gold-dark w-8">{r.bhav}</span>
            <span className="text-text-primary flex-1 text-center">{r.sign}</span>
            <span className="text-text-secondary text-right">{r.deg}</span>
          </div>
        ))}
      </div>

      {/* ─── Key Doshas — Manglik / Kaal Sarp / Ganda Mula / Sade Sati.
              Merged in from the prior PatrikaTab so this single card is
              now the canonical pandit data view (one element, used in
              both Simple-mode and Expert-mode patrika tab). ─── */}
      <KeyDoshasSection kundali={kundali} locale={locale} isHi={isHi} />

      {/* ─── Footer hint ─── */}
      <p className="text-text-secondary text-[10px] mt-5 text-center">
        {L(
          'Engine: Meeus 1998 (Solar/Lunar), Drik panchang. Ayanamsha applied to sidereal positions. Times are local at birth location.',
          'इंजन: मीस 1998 (सौर/चंद्र), दृक् पंचांग। अयनांश सायन स्थितियों पर लागू। समय जन्म स्थान का स्थानीय है।',
        )}
      </p>
    </section>
  );
}

// ──────────────────────────────────────────────────────────────────────
// Sub-components
// ──────────────────────────────────────────────────────────────────────

function DataPair({ label, value, className = '' }: { label: string; value: string; className?: string }) {
  return (
    <div className={`flex items-baseline gap-2 ${className}`}>
      <span className="text-gold-dark min-w-[80px]">{label}</span>
      <span className="text-text-primary">{value}</span>
    </div>
  );
}

function ChartPanel({
  title,
  data,
  planets,
}: {
  title: string;
  data: KundaliData['chart'];
  planets: KundaliData['planets'];
}) {
  return (
    <div className="rounded-xl border border-gold-primary/10 p-2">
      <h4 className="text-gold-dark text-xs uppercase tracking-wider text-center mb-2">{title}</h4>
      <ChartNorth data={data} planets={planets} size={260} title="" />
    </div>
  );
}

function DashaCell({
  maha,
  locale,
}: {
  maha: KundaliData['dashas'][number];
  locale: string;
}) {
  // Format "YYYY-MM-DD[Thh:mm:ssZ]" → "DD/MM/YY" via string split. Avoids
  // `new Date(iso)` (CLAUDE.md lesson L — browser parser quirks + tz drift
  // when iso lacks a Z suffix, which engine output sometimes does).
  const compactDate = (iso: string) => {
    if (!iso) return '—';
    const datePart = iso.split('T')[0];
    const parts = datePart.split('-');
    if (parts.length !== 3) return iso;
    const [yyyy, mm, dd] = parts;
    return `${dd}/${mm}/${yyyy.slice(-2)}`;
  };

  const planetLabel = tl(maha.planetName, locale) || maha.planet;
  const antars = maha.subPeriods ?? [];

  return (
    <div className="rounded-lg border border-gold-primary/15 bg-bg-primary/30 p-2 text-xs font-mono">
      <div className="flex items-baseline justify-between mb-1 pb-1 border-b border-gold-primary/15">
        <span className="text-gold-light font-semibold">{planetLabel}</span>
        <span className="text-text-secondary text-[10px]">
          {compactDate(maha.startDate)} → {compactDate(maha.endDate)}
        </span>
      </div>
      <div className="space-y-0.5">
        {antars.length === 0 && <span className="text-text-secondary text-[10px]">—</span>}
        {antars.map((sub) => (
          <div key={sub.planet + sub.startDate} className="flex items-baseline justify-between text-[10px]">
            <span className="text-text-primary">{tl(sub.planetName, locale) || sub.planet}</span>
            <span className="text-text-secondary tabular-nums">{compactDate(sub.endDate)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ──────────────────────────────────────────────────────────────────────
// KeyDoshasSection — Manglik / Kaal Sarp / Ganda Mula / Sade Sati.
// Merged in from the prior PatrikaTab so the snapshot card is the
// single canonical pandit data view (used in Simple mode + Expert mode
// patrika tab). Detection rules match PatrikaTab's classical logic
// 1:1; copying the data structure rather than importing keeps the
// snapshot self-contained.
// ──────────────────────────────────────────────────────────────────────
function KeyDoshasSection({
  kundali,
  locale,
  isHi,
}: {
  kundali: KundaliData;
  locale: string;
  isHi: boolean;
}) {
  const L = (en: string, hi: string) => (isHi ? hi : en);

  const doshas: { key: string; name: LocaleText; present: boolean; detail: LocaleText }[] = [];

  // ── Manglik: Mars in house 1, 2, 4, 7, 8, or 12 (with classical cancellations) ──
  const mars = kundali.planets.find((p) => p.planet.id === 2);
  const jupiter = kundali.planets.find((p) => p.planet.id === 4);
  const venus = kundali.planets.find((p) => p.planet.id === 5);
  const saturn = kundali.planets.find((p) => p.planet.id === 6);
  const isManglik = mars ? [1, 2, 4, 7, 8, 12].includes(mars.house) : false;
  const cancellations: string[] = [];
  if (isManglik && mars) {
    if (jupiter && jupiter.house === 7) cancellations.push('Jupiter occupies 7th');
    if (venus && venus.house === 1) cancellations.push('Venus in 1st');
    if (mars.sign === 1 || mars.sign === 4 || mars.sign === 8) cancellations.push('Mars in own/exalted sign');
    if (saturn && saturn.house === mars.house) cancellations.push('Saturn conjunct Mars');
  }
  const isManglikCancelled = cancellations.length > 0;
  const severity = mars ? ([7, 8].includes(mars.house) ? 'severe' : [1, 4].includes(mars.house) ? 'moderate' : 'mild') : 'none';
  doshas.push({
    key: 'manglik',
    name: { en: 'Manglik Dosha', hi: 'मांगलिक दोष' },
    present: isManglik && !isManglikCancelled,
    detail: {
      en: !isManglik
        ? 'Mars not in 1/2/4/7/8/12 — no Manglik Dosha.'
        : isManglikCancelled
          ? `Mars in House ${mars!.house} (${severity}). Cancelled: ${cancellations.join('; ')}.`
          : `Mars in House ${mars!.house} (${severity}).`,
      hi: !isManglik
        ? 'मंगल 1/2/4/7/8/12 में नहीं — मांगलिक दोष नहीं।'
        : isManglikCancelled
          ? `मंगल भाव ${mars!.house} में (${severity === 'severe' ? 'गम्भीर' : severity === 'moderate' ? 'मध्यम' : 'हल्का'})। रद्द: ${cancellations.join('; ')}।`
          : `मंगल भाव ${mars!.house} में (${severity === 'severe' ? 'गम्भीर' : severity === 'moderate' ? 'मध्यम' : 'हल्का'})।`,
    },
  });

  // ── Kaal Sarp: all 7 non-nodal planets hemmed between Rahu-Ketu ──
  const rahu = kundali.planets.find((p) => p.planet.id === 7);
  const ketu = kundali.planets.find((p) => p.planet.id === 8);
  let isKaalSarp = false;
  if (rahu && ketu) {
    const rahuLon = rahu.longitude;
    const ketuLon = ketu.longitude;
    const others = kundali.planets.filter((p) => p.planet.id !== 7 && p.planet.id !== 8);
    const allOnOneSide = others.every((p) => (rahuLon < ketuLon ? p.longitude >= rahuLon && p.longitude <= ketuLon : p.longitude >= rahuLon || p.longitude <= ketuLon));
    const allOnOtherSide = others.every((p) => (ketuLon < rahuLon ? p.longitude >= ketuLon && p.longitude <= rahuLon : p.longitude >= ketuLon || p.longitude <= rahuLon));
    isKaalSarp = allOnOneSide || allOnOtherSide;
  }
  doshas.push({
    key: 'kaalsarp',
    name: { en: 'Kaal Sarp Dosha', hi: 'काल सर्प दोष' },
    present: isKaalSarp,
    detail: isKaalSarp
      ? { en: 'All planets hemmed between Rahu–Ketu axis.', hi: 'सभी ग्रह राहु–केतु अक्ष के बीच।' }
      : { en: 'Not present.', hi: 'उपस्थित नहीं।' },
  });

  // ── Ganda Mula: Moon in junctional nakshatra (1/9/10/18/19/27) ──
  const moonP = kundali.planets.find((p) => p.planet.id === 1);
  const gandaIds = [1, 9, 10, 18, 19, 27];
  const isGanda = moonP ? gandaIds.includes(moonP.nakshatra.id) : false;
  const moonNakName = moonP?.nakshatra?.name
    ? typeof moonP.nakshatra.name === 'string'
      ? moonP.nakshatra.name
      : tl(moonP.nakshatra.name as LocaleText, locale)
    : '—';
  doshas.push({
    key: 'gandamula',
    name: { en: 'Ganda Mula', hi: 'गण्ड मूल' },
    present: isGanda,
    detail: isGanda
      ? { en: `Moon in ${moonNakName}.`, hi: `चन्द्र ${moonNakName} में।` }
      : { en: 'Moon not in a junctional nakshatra.', hi: 'चन्द्र गण्ड मूल नक्षत्र में नहीं।' },
  });

  // ── Sade Sati: from engine ──
  const sadeSatiActive = !!kundali.sadeSati?.isActive;
  const sadeSatiPhase = kundali.sadeSati?.currentPhase;
  doshas.push({
    key: 'sadesati',
    name: { en: 'Sade Sati', hi: 'साढ़े साती' },
    present: sadeSatiActive,
    detail: sadeSatiActive
      ? { en: `Currently active${sadeSatiPhase ? ` — ${sadeSatiPhase}` : ''}.`, hi: `वर्तमान में सक्रिय${sadeSatiPhase ? ` — ${sadeSatiPhase}` : ''}।` }
      : { en: 'Not currently active.', hi: 'वर्तमान में सक्रिय नहीं।' },
  });

  const present = doshas.filter((d) => d.present);

  return (
    <>
      <h3 className="text-gold-light text-sm font-semibold mt-6 mb-2">
        {L('Key Doshas', 'मुख्य दोष')}
      </h3>
      {present.length === 0 ? (
        <p className="text-emerald-400/80 text-xs">
          {L('None of the four classical doshas (Manglik / Kaal Sarp / Ganda Mula / Sade Sati) are currently active.',
             'चार मुख्य दोष (मांगलिक / काल सर्प / गण्ड मूल / साढ़े साती) में से कोई वर्तमान में सक्रिय नहीं।')}
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
          {present.map((d) => (
            <div key={d.key} className="rounded-lg border border-red-500/25 bg-red-500/5 p-2">
              <div className="flex items-baseline gap-2 mb-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-red-400 shrink-0" />
                <span className="text-gold-light font-semibold">{tl(d.name, locale)}</span>
              </div>
              <p className="text-text-secondary/80 ml-3.5 leading-snug">{tl(d.detail, locale)}</p>
            </div>
          ))}
        </div>
      )}
      <p className="text-text-secondary/60 text-[10px] mt-2 italic">
        {L('Showing only the four most-asked-about doshas. A full pandit reading covers additional yoga/dosha layers.',
           'केवल चार सबसे अधिक पूछे जाने वाले दोष दिखाए गए हैं। पूर्ण पंडित विश्लेषण में अतिरिक्त योग/दोष परतें होती हैं।')}
      </p>
    </>
  );
}
