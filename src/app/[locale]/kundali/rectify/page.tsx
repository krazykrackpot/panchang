'use client';

import { useState, useMemo } from 'react';
import { useLocale } from 'next-intl';
import { authedFetch } from '@/lib/api/authed-fetch';
import { motion } from 'framer-motion';
import { Link } from '@/lib/i18n/navigation';
import { Clock, ChevronDown, ChevronUp } from 'lucide-react';
import LocationSearch from '@/components/ui/LocationSearch';
import { getUTCOffsetForDate } from '@/lib/utils/timezone';
import { RASHIS } from '@/lib/constants/rashis';
import type { Locale } from '@/types/panchang';

/**
 * Birth Time Rectification — Tattva-based method
 * Uses known life events to narrow down the correct birth time.
 * Adjusts lagna placement by matching event types to house significations.
 */

const LIFE_EVENTS = [
  { key: 'marriage', label: { en: 'Marriage', hi: 'विवाह' }, houses: [7, 2], weight: 3 },
  { key: 'first_child', label: { en: 'First Child Born', hi: 'प्रथम संतान' }, houses: [5, 9], weight: 3 },
  { key: 'job', label: { en: 'First Job/Career Start', hi: 'प्रथम नौकरी' }, houses: [10, 6], weight: 2 },
  { key: 'education', label: { en: 'Major Education Milestone', hi: 'शिक्षा उपलब्धि' }, houses: [4, 5], weight: 2 },
  { key: 'travel', label: { en: 'Foreign Travel/Relocation', hi: 'विदेश यात्रा' }, houses: [9, 12], weight: 2 },
  { key: 'health', label: { en: 'Major Health Event', hi: 'स्वास्थ्य घटना' }, houses: [6, 8], weight: 2 },
  { key: 'property', label: { en: 'Property Purchase/Vehicle', hi: 'संपत्ति/वाहन' }, houses: [4], weight: 1 },
  { key: 'father_event', label: { en: "Father's Major Event", hi: 'पिता की घटना' }, houses: [9, 10], weight: 1 },
  { key: 'mother_event', label: { en: "Mother's Major Event", hi: 'माता की घटना' }, houses: [4], weight: 1 },
  { key: 'sibling_event', label: { en: 'Sibling Major Event', hi: 'भाई-बहन घटना' }, houses: [3, 11], weight: 1 },
];

interface EventEntry {
  eventKey: string;
  year: number;
  month: number;
}

export default function RectifyPage() {
  const locale = useLocale() as Locale;
  const isHi = locale !== 'en' && String(locale) !== 'ta';
  const headingFont = isHi ? { fontFamily: 'var(--font-devanagari-heading)' } : { fontFamily: 'var(--font-heading)' };

  const [birthYear, setBirthYear] = useState(1990);
  const [birthMonth, setBirthMonth] = useState(1);
  const [birthDay, setBirthDay] = useState(1);
  const [approxHour, setApproxHour] = useState(6);
  const [approxMin, setApproxMin] = useState(0);
  const [uncertainty, setUncertainty] = useState(2); // hours +/-
  const [events, setEvents] = useState<EventEntry[]>([]);
  const [result, setResult] = useState<{ suggestedTime: string; confidence: number; lagna: string } | null>(null);
  const [showEvents, setShowEvents] = useState(false);
  const [placeName, setPlaceName] = useState('');
  const [placeLat, setPlaceLat] = useState<number | null>(null);
  const [placeLng, setPlaceLng] = useState<number | null>(null);
  const [placeTimezone, setPlaceTimezone] = useState<string | null>(null);

  const addEvent = (eventKey: string) => {
    setEvents([...events, { eventKey, year: 2020, month: 1 }]);
  };
  const removeEvent = (idx: number) => {
    setEvents(events.filter((_, i) => i !== idx));
  };

  const rectify = async () => {
    if (placeLat === null || placeLng === null) {
      alert(isHi ? 'कृपया जन्म स्थान चुनें' : 'Please select a birth place');
      return;
    }
    if (events.length < 2) {
      alert(isHi ? 'कम से कम 2 जीवन घटनाएँ दर्ज करें' : 'Please enter at least 2 life events');
      return;
    }
    const [y, m, d] = [birthYear, birthMonth, birthDay];
    if (!placeTimezone) return;
    const tz = getUTCOffsetForDate(y, m, d, placeTimezone);

    // Try different times within uncertainty window and score each
    const results: { time: string; score: number; lagna: number }[] = [];
    const step = 10; // 10-minute steps
    const totalSteps = (uncertainty * 2 * 60) / step;
    const startMin = (approxHour * 60 + approxMin) - uncertainty * 60;

    for (let i = 0; i <= totalSteps; i++) {
      const mins = startMin + i * step;
      const h = Math.floor(((mins % (24 * 60)) + 24 * 60) % (24 * 60) / 60);
      const m = ((mins % 60) + 60) % 60;
      const timeStr = `${h.toString().padStart(2, '0')}:${Math.round(m).toString().padStart(2, '0')}`;

      try {
        const res = await authedFetch('/api/kundali', {
          method: 'POST',
          body: JSON.stringify({
            year: birthYear, month: birthMonth, day: birthDay,
            hour: h, minute: Math.round(m),
            lat: placeLat, lng: placeLng, tz,
            name: 'Rectification', place: placeName,
          }),
        });
        const data = await res.json();
        if (!data.ascendant) continue;

        // Score: check if dashas align with life events
        let score = 0;
        for (const evt of events) {
          const eventDef = LIFE_EVENTS.find(e => e.key === evt.eventKey);
          if (!eventDef) continue;

          // Check if any dasha lord rules an event-related house
          const evtDate = new Date(evt.year, evt.month - 1);
          for (const dasha of data.dashas || []) {
            const dStart = new Date(dasha.startDate);
            const dEnd = new Date(dasha.endDate);
            if (evtDate >= dStart && evtDate <= dEnd) {
              // Find which house the dasha planet rules
              const planet = data.planets?.find((p: { planet: { id: number }; house: number }) =>
                p.planet.id === [0, 1, 2, 3, 4, 5, 6, 7, 8].find(
                  id => data.planets?.[id]?.planet?.name?.en === dasha.planet
                )
              );
              if (planet && eventDef.houses.includes(planet.house)) {
                score += eventDef.weight * 2;
              }
              score += eventDef.weight; // Base score for timing match
              break;
            }
          }
        }

        results.push({ time: timeStr, score, lagna: data.ascendant.sign });
      } catch { /* skip */ }
    }

    if (results.length === 0) {
      alert(isHi ? 'गणना में त्रुटि' : 'Calculation error');
      return;
    }

    results.sort((a, b) => b.score - a.score);
    const best = results[0];
    const maxScore = events.length * 6; // theoretical max
    const confidence = Math.min(95, Math.round((best.score / maxScore) * 100));
    const lagnaName = RASHIS[best.lagna - 1]?.name[locale] || '';

    setResult({
      suggestedTime: best.time,
      confidence,
      lagna: lagnaName,
    });
  };

  return (
    <div className="min-h-screen bg-bg-primary text-text-primary">
      <section className="py-16 px-4">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <div className="p-3 rounded-xl bg-gold-primary/10 border border-gold-primary/20">
                <Clock className="w-8 h-8 text-gold-primary" />
              </div>
            </div>
            <h1 className="text-3xl font-bold text-gold-gradient mb-2" style={headingFont}>
              {isHi ? 'जन्म समय शोधन' : 'Birth Time Rectification'}
            </h1>
            <p className="text-text-secondary text-sm max-w-lg mx-auto">
              {isHi ? 'जीवन की प्रमुख घटनाओं के आधार पर सही जन्म समय का अनुमान लगाएं' : 'Estimate correct birth time based on major life events and dasha alignment'}
            </p>
            <Link href="/kundali" className="text-xs text-gold-primary/60 hover:text-gold-primary mt-2 inline-block">
              {isHi ? '← कुण्डली' : '← Kundali'}
            </Link>
          </div>

          <div className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-2xl p-6 space-y-6">
            {/* Approximate birth details */}
            <div>
              <label className="text-gold-dark text-xs uppercase tracking-wider font-bold block mb-2">{isHi ? 'अनुमानित जन्म तिथि' : 'Approximate Birth Date'}</label>
              <div className="grid grid-cols-3 gap-3">
                <input type="number" value={birthYear} onChange={e => setBirthYear(+e.target.value)} placeholder="Year" className="px-3 py-2 rounded-lg bg-bg-secondary border border-gold-primary/15 text-text-primary text-sm" />
                <input type="number" min={1} max={12} value={birthMonth} onChange={e => setBirthMonth(+e.target.value)} placeholder="Month" className="px-3 py-2 rounded-lg bg-bg-secondary border border-gold-primary/15 text-text-primary text-sm" />
                <input type="number" min={1} max={31} value={birthDay} onChange={e => setBirthDay(+e.target.value)} placeholder="Day" className="px-3 py-2 rounded-lg bg-bg-secondary border border-gold-primary/15 text-text-primary text-sm" />
              </div>
            </div>

            <div>
              <label className="text-gold-dark text-xs uppercase tracking-wider font-bold block mb-2">{isHi ? 'अनुमानित जन्म समय' : 'Approximate Birth Time'}</label>
              <div className="grid grid-cols-3 gap-3">
                <input type="number" min={0} max={23} value={approxHour} onChange={e => setApproxHour(+e.target.value)} className="px-3 py-2 rounded-lg bg-bg-secondary border border-gold-primary/15 text-text-primary text-sm" />
                <input type="number" min={0} max={59} value={approxMin} onChange={e => setApproxMin(+e.target.value)} className="px-3 py-2 rounded-lg bg-bg-secondary border border-gold-primary/15 text-text-primary text-sm" />
                <div>
                  <label className="text-text-tertiary text-xs">{isHi ? 'अनिश्चितता (घंटे)' : 'Uncertainty (hrs)'}</label>
                  <input type="number" min={1} max={6} value={uncertainty} onChange={e => setUncertainty(+e.target.value)} className="w-full px-3 py-2 rounded-lg bg-bg-secondary border border-gold-primary/15 text-text-primary text-sm" />
                </div>
              </div>
            </div>

            {/* Birth place */}
            <div>
              <label className="text-gold-dark text-xs uppercase tracking-wider font-bold block mb-2">{isHi ? 'जन्म स्थान' : 'Birth Place'}</label>
              <LocationSearch value={placeName} onSelect={(loc) => { setPlaceName(loc.name); setPlaceLat(loc.lat); setPlaceLng(loc.lng); setPlaceTimezone(loc.timezone || null); }} placeholder={isHi ? 'जन्म स्थान खोजें...' : 'Search birth place...'} />
            </div>

            {/* Life events */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-gold-dark text-xs uppercase tracking-wider font-bold">{isHi ? 'जीवन घटनाएँ' : 'Life Events'} ({events.length})</label>
                <button onClick={() => setShowEvents(!showEvents)} className="text-gold-primary text-xs">
                  {showEvents ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>
              </div>

              {showEvents && (
                <div className="grid grid-cols-2 gap-2 mb-3">
                  {LIFE_EVENTS.map(evt => (
                    <button key={evt.key} onClick={() => addEvent(evt.key)}
                      className="text-left px-3 py-2 rounded-lg bg-bg-secondary/50 border border-gold-primary/10 text-text-secondary text-xs hover:border-gold-primary/30 hover:text-text-primary transition-all">
                      + {isHi ? evt.label.hi : evt.label.en}
                    </button>
                  ))}
                </div>
              )}

              {events.map((evt, i) => {
                const def = LIFE_EVENTS.find(e => e.key === evt.eventKey);
                return (
                  <div key={i} className="flex items-center gap-2 mb-2 p-2 rounded-lg bg-bg-secondary/30">
                    <span className="text-gold-light text-xs flex-1">{isHi ? def?.label.hi : def?.label.en}</span>
                    <input type="number" value={evt.year} onChange={e => { const ne = [...events]; ne[i].year = +e.target.value; setEvents(ne); }}
                      className="w-20 px-2 py-1 rounded bg-bg-secondary border border-gold-primary/10 text-text-primary text-xs" placeholder="Year" />
                    <input type="number" min={1} max={12} value={evt.month} onChange={e => { const ne = [...events]; ne[i].month = +e.target.value; setEvents(ne); }}
                      className="w-16 px-2 py-1 rounded bg-bg-secondary border border-gold-primary/10 text-text-primary text-xs" placeholder="Month" />
                    <button onClick={() => removeEvent(i)} className="text-red-400 text-xs px-1">×</button>
                  </div>
                );
              })}
            </div>

            <button onClick={rectify}
              className="w-full py-3 rounded-xl bg-gold-primary text-bg-primary font-bold hover:bg-gold-light transition-colors">
              {isHi ? 'जन्म समय शोधन करें' : 'Rectify Birth Time'}
            </button>

            {/* Result */}
            {result && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                className="p-6 rounded-2xl bg-emerald-500/5 border border-emerald-500/20 text-center">
                <div className="text-emerald-400 text-xs uppercase tracking-wider font-bold mb-2">{isHi ? 'सुझाया गया जन्म समय' : 'Suggested Birth Time'}</div>
                <div className="text-gold-light text-4xl font-bold font-mono mb-2">{result.suggestedTime}</div>
                <div className="text-text-secondary text-sm mb-1">{isHi ? 'लग्न' : 'Lagna'}: <span className="text-gold-light font-bold">{result.lagna}</span></div>
                <div className="text-emerald-300 text-xs">{isHi ? 'विश्वसनीयता' : 'Confidence'}: {result.confidence}%</div>
              </motion.div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
