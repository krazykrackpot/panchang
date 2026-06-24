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
import type { KundaliData } from '@/types/kundali';
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

  // Day of week (Sunday = 0; Sanskrit names below)
  const weekdayJD = jdBirth + 0.5; // shift so that integer floor = 0..6 with 0 = Monday in Meeus → adjust
  const weekday = (Math.floor(jdBirth + 1.5) % 7); // 0=Sun, 1=Mon, ..., 6=Sat (matches Date.getUTCDay)
  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const dayName = dayNames[weekday] ?? '—';
  void weekdayJD; // silence unused-var

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

  // ─── Ashtakavarga ───
  const av = kundali.ashtakavarga;
  const bpiPlanetLabels = ['Sun', 'Mon', 'Mar', 'Mer', 'Jup', 'Ven', 'Sat']; // 7 contributors (Rahu/Ketu excluded by classical rule)

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

  return (
    <section className={cardCls + ' my-8'}>
      {/* ─── Section title strip ─── */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-2 mb-4 pb-3 border-b border-gold-primary/20">
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
        <button
          type="button"
          onClick={() => typeof window !== 'undefined' && window.print()}
          className="self-start sm:self-end inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-gold-primary/30 text-gold-light hover:bg-gold-primary/10 text-xs transition-colors"
        >
          {L('Print / Save as PDF', 'प्रिंट / PDF के रूप में सहेजें')}
        </button>
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
        <DataPair label={L('Rashi Lord', 'राशि स्वामी')} value={PLANET_ABBR_EN[rasiLordId] ?? '—'} />
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

      {/* ─── Footer hint ─── */}
      <p className="text-text-secondary text-[10px] mt-5 text-center">
        {L(
          'Engine: Meeus 1998 (Solar/Lunar), Drik panchang. Ayanamsha applied to sidereal positions. Times are local at birth location.',
          'इंजन: मीस 1998 (सौर/चंद्र), दृक् पंचांग। अयनांश सायन स्थितियों पर लागू। समय जन्म स्थान का स्थानीय है।',
        )}
      </p>

      {/* Print stylesheet — force black-on-white when printing the snapshot. */}
      <style jsx>{`
        @media print {
          section { background: white !important; color: black !important; border: 1px solid #ccc; }
        }
      `}</style>
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
  // Strip the day from "YYYY-MM-DD" — pandits usually want month/year resolution
  const compactDate = (iso: string) => {
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return iso;
    return `${String(d.getUTCDate()).padStart(2, '0')}/${String(d.getUTCMonth() + 1).padStart(2, '0')}/${d.getUTCFullYear() % 100}`;
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
