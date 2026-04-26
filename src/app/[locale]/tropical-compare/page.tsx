'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import { useLocale } from 'next-intl';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

import { dateToJD } from '@/lib/ephem/astronomical';
import { computeComparison, type PlanetComparison, type ComparisonResult } from '@/lib/ephem/comparison-engine';
import { resolveTimezoneFromCoords } from '@/lib/utils/timezone';
import { tl } from '@/lib/utils/trilingual';
import { isDevanagariLocale } from '@/lib/utils/locale-fonts';
import JyotishTerm from '@/components/ui/JyotishTerm';
import LocationSearch from '@/components/ui/LocationSearch';
import GoldDivider from '@/components/ui/GoldDivider';
import PrecessionSlider from '@/components/comparison/PrecessionSlider';
import { ShareCardButton } from '@/components/shareable/ShareCardButton';
import type { Locale, LocaleText } from '@/types/panchang';

// ── Planet symbols ──────────────────────────────────────────
const PLANET_SYMBOLS: Record<number, string> = {
  0: '\u2609', // Sun ☉
  1: '\u263D', // Moon ☽
  2: '\u2642', // Mars ♂
  3: '\u263F', // Mercury ☿
  4: '\u2643', // Jupiter ♃
  5: '\u2640', // Venus ♀
  6: '\u2644', // Saturn ♄
  7: '\u260A', // Rahu ☊
  8: '\u260B', // Ketu ☋
};

// ── Sign meaning for interpretive cards ─────────────────────
const SIGN_INTERPRETATION: Record<number, LocaleText> = {
  1:  { en: 'Bold, pioneering, competitive. Natural leaders who act on instinct.', hi: 'साहसी, अग्रणी, प्रतिस्पर्धी। सहज ज्ञान से कार्य करने वाले नेता।', sa: 'साहसिनः, अग्रगामिनः। सहजज्ञानेन कर्म कुर्वन्तः नेतारः।' },
  2:  { en: 'Steady, sensual, loyal. Values stability, beauty, and material comfort.', hi: 'स्थिर, संवेदनशील, वफादार। स्थिरता और सुख को महत्व।', sa: 'स्थिराः, संवेदनशीलाः, विश्वासिनः। स्थैर्यं सौन्दर्यं च मन्यन्ते।' },
  3:  { en: 'Curious, communicative, adaptable. Quick thinkers who thrive on variety.', hi: 'जिज्ञासु, संवादी, अनुकूलनशील। विविधता में पनपने वाले।', sa: 'जिज्ञासवः, संवादशीलाः। विविधतायां वर्धमानाः शीघ्रचिन्तकाः।' },
  4:  { en: 'Nurturing, intuitive, protective. Deeply emotional with strong family bonds.', hi: 'पोषक, सहज ज्ञानी, रक्षात्मक। गहरे भावनात्मक।', sa: 'पोषकाः, सहजज्ञानिनः, रक्षाकर्तारः। गहनभावुकाः।' },
  5:  { en: 'Charismatic, creative, generous. Born to lead, perform, and inspire.', hi: 'करिश्माई, रचनात्मक, उदार। नेतृत्व के लिए जन्मे।', sa: 'आकर्षकाः, सृजनशीलाः, उदाराः। नेतृत्वाय जाताः।' },
  6:  { en: 'Analytical, detail-oriented, service-minded. Seeks perfection in all things.', hi: 'विश्लेषणात्मक, सेवाभावी। पूर्णता चाहते हैं।', sa: 'विश्लेषणात्मकाः, सेवापराः। सर्वत्र पूर्णतां इच्छन्ति।' },
  7:  { en: 'Diplomatic, charming, balance-seeking. Thrives in partnerships and art.', hi: 'कूटनीतिक, आकर्षक, संतुलन-प्रेमी।', sa: 'कूटनीतिज्ञाः, चारुचित्ताः, सन्तुलनप्रियाः।' },
  8:  { en: 'Intense, transformative, perceptive. Drawn to depth, mystery, and power.', hi: 'तीव्र, रूपान्तरकारी। गहराई और रहस्य की ओर।', sa: 'तीव्राः, रूपान्तरकारिणः। गभीरतायां रहस्ये च आकृष्टाः।' },
  9:  { en: 'Optimistic, philosophical, adventurous. Eternal seeker of wisdom and truth.', hi: 'आशावादी, दार्शनिक, साहसी। ज्ञान के शाश्वत खोजी।', sa: 'आशावादिनः, दार्शनिकाः। ज्ञानस्य शाश्वताः अन्वेषकाः।' },
  10: { en: 'Ambitious, disciplined, pragmatic. Builds lasting achievements through patience.', hi: 'महत्वाकांक्षी, अनुशासित। धैर्य से स्थायी उपलब्धियाँ।', sa: 'महत्त्वाकाङ्क्षिणः, अनुशासिताः। धैर्येण स्थायिनीः उपलब्धीः।' },
  11: { en: 'Innovative, independent, humanitarian. Thinks ahead of their time.', hi: 'नवोन्मेषी, स्वतन्त्र, मानवतावादी।', sa: 'नवोन्मेषिणः, स्वतन्त्राः, मानवतावादिनः।' },
  12: { en: 'Intuitive, compassionate, spiritual. The mystic and healer of the zodiac.', hi: 'सहज ज्ञानी, करुणामय, आध्यात्मिक।', sa: 'सहजज्ञानिनः, करुणामयाः, आध्यात्मिकाः।' },
};

// ── Labels ──────────────────────────────────────────────────
const LABELS = {
  pageTitle: { en: 'Sidereal vs Tropical', hi: 'सायन बनाम निरयन', sa: 'सायनं निरयनं च' } as LocaleText,
  pageSubtitle: { en: 'Your Real Star Signs', hi: 'आपकी असली राशि', sa: 'वास्तविकराशिः' } as LocaleText,
  pageDesc: { en: 'Enter your birth data to see how every planet shifts between the Western (Tropical) and Vedic (Sidereal) zodiac.', hi: 'अपना जन्म विवरण दर्ज करें और देखें कि प्रत्येक ग्रह पश्चिमी और वैदिक राशि चक्र में कैसे बदलता है।', sa: 'स्वजन्मविवरणं दत्त्वा सर्वेषां ग्रहाणां पाश्चात्यवैदिकराशिचक्रयोः भेदं पश्यतु।' } as LocaleText,
  name: { en: 'Name (optional)', hi: 'नाम (वैकल्पिक)', sa: 'नाम (वैकल्पिकम्)' } as LocaleText,
  dob: { en: 'Date of Birth', hi: 'जन्म तिथि', sa: 'जन्मतिथिः' } as LocaleText,
  tob: { en: 'Time of Birth', hi: 'जन्म समय', sa: 'जन्मसमयः' } as LocaleText,
  location: { en: 'Birth Location', hi: 'जन्म स्थान', sa: 'जन्मस्थानम्' } as LocaleText,
  latitude: { en: 'Latitude', hi: 'अक्षांश', sa: 'अक्षांशः' } as LocaleText,
  longitude: { en: 'Longitude', hi: 'देशान्तर', sa: 'देशान्तरः' } as LocaleText,
  compute: { en: 'Reveal My Real Signs', hi: 'मेरी असली राशि दिखाएं', sa: 'मम वास्तविकराशिं दर्शयतु' } as LocaleText,
  planet: { en: 'Planet', hi: 'ग्रह', sa: 'ग्रहः' } as LocaleText,
  western: { en: 'Western (Tropical)', hi: 'पश्चिमी (सायन)', sa: 'पाश्चात्यम् (सायनम्)' } as LocaleText,
  vedic: { en: 'Vedic (Sidereal)', hi: 'वैदिक (निरयन)', sa: 'वैदिकम् (निरयनम्)' } as LocaleText,
  nakshatra: { en: 'Nakshatra', hi: 'नक्षत्र', sa: 'नक्षत्रम्' } as LocaleText,
  shifted: { en: 'Shifted', hi: 'परिवर्तित', sa: 'परिवर्तितम्' } as LocaleText,
  shiftedCount: { en: '{count} of 9 planets shifted sign', hi: '9 में से {count} ग्रहों की राशि बदली', sa: '९ ग्रहेषु {count} राशिपरिवर्तनम्' } as LocaleText,
  precessionTitle: { en: 'The Precession of the Equinoxes', hi: 'विषुव अयन गति', sa: 'विषुवायनगतिः' } as LocaleText,
  whatThisMeans: { en: 'What This Means For You', hi: 'आपके लिए इसका अर्थ', sa: 'भवतः कृते अस्य अर्थः' } as LocaleText,
  generateChart: { en: 'Generate Full Birth Chart', hi: 'पूर्ण जन्म कुण्डली बनाएं', sa: 'पूर्णजन्मकुण्डलीं रचयतु' } as LocaleText,
  enterDifferent: { en: 'Enter different birth data', hi: 'अन्य जन्म विवरण दर्ज करें', sa: 'अन्यजन्मविवरणं ददातु' } as LocaleText,
  yes: { en: 'Yes', hi: 'हाँ', sa: 'आम्' } as LocaleText,
  no: { en: 'No', hi: 'नहीं', sa: 'न' } as LocaleText,
  comingSoon: { en: 'Interactive precession slider coming soon', hi: 'इंटरैक्टिव अयन गति स्लाइडर जल्द आ रहा है', sa: 'अन्तरक्रियात्मकम् अयनगतिस्लाइडरं शीघ्रम् आगच्छति' } as LocaleText,
};

// ── Western sign names (English only, for display) ──────────
const WESTERN_NAMES: Record<number, string> = {
  1: 'Aries', 2: 'Taurus', 3: 'Gemini', 4: 'Cancer', 5: 'Leo', 6: 'Virgo',
  7: 'Libra', 8: 'Scorpio', 9: 'Sagittarius', 10: 'Capricorn', 11: 'Aquarius', 12: 'Pisces',
};

export default function TropicalComparePage() {
  const locale = useLocale() as Locale;
  const searchParams = useSearchParams();
  const isDevanagari = isDevanagariLocale(locale);
  const headingFont = isDevanagari ? { fontFamily: 'var(--font-devanagari-heading)' } : { fontFamily: 'var(--font-heading)' };
  const bodyFont = isDevanagari ? { fontFamily: 'var(--font-devanagari-body)' } : {};

  // ── Form state ────────────────────────────────────────────
  const [name, setName] = useState('');
  const [dateStr, setDateStr] = useState('');
  const [timeStr, setTimeStr] = useState('12:00');
  const [locName, setLocName] = useState('');
  const [lat, setLat] = useState<number | null>(null);
  const [lng, setLng] = useState<number | null>(null);
  const [showForm, setShowForm] = useState(true);
  const [computing, setComputing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ── Result state ──────────────────────────────────────────
  const [result, setResult] = useState<ComparisonResult | null>(null);

  // ── Pre-fill from URL search params ───────────────────────
  // Params: n (name), d (date YYYY-MM-DD), t (time HH:MM), lat, lng, loc
  useEffect(() => {
    const pN = searchParams.get('n');
    const pD = searchParams.get('d');
    const pT = searchParams.get('t');
    const pLat = searchParams.get('lat');
    const pLng = searchParams.get('lng');
    const pLoc = searchParams.get('loc');

    if (pN) setName(pN);
    if (pD) setDateStr(pD);
    if (pT) setTimeStr(pT);
    if (pLat && !isNaN(Number(pLat))) setLat(Number(pLat));
    if (pLng && !isNaN(Number(pLng))) setLng(Number(pLng));
    if (pLoc) setLocName(pLoc);
  }, [searchParams]);

  // ── Compute comparison ────────────────────────────────────
  const handleCompute = useCallback(async () => {
    if (!dateStr) {
      setError(locale === 'en' ? 'Please enter a date of birth.' : 'कृपया जन्म तिथि दर्ज करें।');
      return;
    }
    if (lat === null || lng === null) {
      setError(locale === 'en' ? 'Please select a birth location.' : 'कृपया जन्म स्थान चुनें।');
      return;
    }

    setError(null);
    setComputing(true);

    try {
      // Resolve timezone from coordinates — never trust browser timezone (CLAUDE.md rule)
      const tz = await resolveTimezoneFromCoords(lat, lng);

      const [year, month, day] = dateStr.split('-').map(Number);
      const [hour, minute] = timeStr.split(':').map(Number);

      // Convert local birth time to UT using timezone offset for the birth date
      // Create a date in the birth timezone to get UTC offset
      const localDateStr = `${dateStr}T${timeStr}:00`;
      const formatter = new Intl.DateTimeFormat('en-US', {
        timeZone: tz,
        year: 'numeric', month: '2-digit', day: '2-digit',
        hour: '2-digit', minute: '2-digit', second: '2-digit',
        hour12: false,
      });
      // Get the UTC offset by comparing local vs UTC interpretation
      const birthDate = new Date(localDateStr);
      const utcParts = formatter.formatToParts(birthDate);
      void utcParts; // offset calculation below uses a different approach

      // Simple approach: compute JD from local time, then adjust by timezone offset
      // The comparison engine uses tropical longitudes which don't depend on location,
      // only on the moment in time (JD). So we need the correct UT.
      const tempDate = new Date(`${dateStr}T${timeStr}:00`);
      // Resolve offset using Intl
      const utcStr = tempDate.toLocaleString('en-US', { timeZone: 'UTC' });
      const tzStr = tempDate.toLocaleString('en-US', { timeZone: tz });
      const utcMs = new Date(utcStr).getTime();
      const tzMs = new Date(tzStr).getTime();
      const offsetHours = (tzMs - utcMs) / 3600000;

      const hourDecimal = hour + minute / 60 - offsetHours;
      const jd = dateToJD(year, month, day, hourDecimal);

      const comp = computeComparison(jd);
      setResult(comp);
      setShowForm(false);
    } catch (err) {
      console.error('[tropical-compare] computation failed:', err);
      setError(locale === 'en' ? 'Computation failed. Please check your inputs.' : 'गणना विफल। कृपया इनपुट जाँचें।');
    } finally {
      setComputing(false);
    }
  }, [dateStr, timeStr, lat, lng, locale]);

  // ── Reset to form ─────────────────────────────────────────
  const handleReset = useCallback(() => {
    setResult(null);
    setShowForm(true);
    setError(null);
  }, []);

  // ── Build kundali link with birth data ────────────────────
  const kundaliHref = `/kundali?n=${encodeURIComponent(name)}&d=${encodeURIComponent(dateStr)}&t=${encodeURIComponent(timeStr)}&lat=${lat ?? ''}&lng=${lng ?? ''}&loc=${encodeURIComponent(locName)}`;

  // ── Top 3 shifted planets for interpretive cards ──────────
  const shiftedPlanets = result?.planets.filter(p => p.isShifted).slice(0, 3) ?? [];

  // ── Discovery share card URL ───────────────────────────────
  // Uses Sun (id=0) for the "I thought I was X / stars say Y" narrative.
  // Falls back to first shifted planet if Sun didn't shift.
  const cardFocalPlanet =
    result?.planets.find(p => p.id === 0) ??       // Sun always exists
    result?.planets[0] ?? null;
  const discoveryCardUrl = result && cardFocalPlanet
    ? `/api/card/discovery?format=story` +
      `&tropicalSign=${encodeURIComponent(WESTERN_NAMES[cardFocalPlanet.tropicalSign] ?? '')}` +
      `&siderealSign=${encodeURIComponent(WESTERN_NAMES[cardFocalPlanet.siderealSign] ?? '')}` +
      `&shiftedCount=${result.shiftedCount}` +
      `&totalPlanets=${result.planets.length}` +
      `&hookLine=${encodeURIComponent(result.hookLine ?? '')}` +
      `&ayanamsha=${encodeURIComponent(result.precessionData.currentAyanamsha.toFixed(1) + '\u00b0')}`
    : null;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* ── Page Header ──────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-10"
      >
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3" style={headingFont}>
          <span className="text-gold-gradient">{tl(LABELS.pageTitle, locale)}</span>
        </h1>
        <p className="text-xl sm:text-2xl text-text-primary mb-4" style={headingFont}>
          {tl(LABELS.pageSubtitle, locale)}
        </p>
        <p className="text-text-secondary text-base max-w-2xl mx-auto" style={bodyFont}>
          {tl(LABELS.pageDesc, locale)}
        </p>
      </motion.div>

      <AnimatePresence mode="wait">
        {/* ── Form Section ─────────────────────────────────── */}
        {showForm && (
          <motion.div
            key="form"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <div className="rounded-2xl bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/15 p-6 sm:p-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                {/* Name */}
                <div>
                  <label className="block text-text-secondary text-sm mb-1" style={bodyFont}>{tl(LABELS.name, locale)}</label>
                  <input
                    type="text"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    className="w-full bg-bg-primary/60 border border-gold-primary/20 rounded-lg px-3 py-2 text-text-primary focus:outline-none focus:border-gold-primary/50 transition-colors"
                    placeholder="..."
                  />
                </div>

                {/* Date */}
                <div>
                  <label className="block text-text-secondary text-sm mb-1" style={bodyFont}>{tl(LABELS.dob, locale)} *</label>
                  <input
                    type="date"
                    value={dateStr}
                    onChange={e => setDateStr(e.target.value)}
                    className="w-full bg-bg-primary/60 border border-gold-primary/20 rounded-lg px-3 py-2 text-text-primary focus:outline-none focus:border-gold-primary/50 transition-colors"
                    required
                  />
                </div>

                {/* Time */}
                <div>
                  <label className="block text-text-secondary text-sm mb-1" style={bodyFont}>{tl(LABELS.tob, locale)}</label>
                  <input
                    type="time"
                    value={timeStr}
                    onChange={e => setTimeStr(e.target.value)}
                    className="w-full bg-bg-primary/60 border border-gold-primary/20 rounded-lg px-3 py-2 text-text-primary focus:outline-none focus:border-gold-primary/50 transition-colors"
                  />
                </div>

                {/* Location search */}
                <div>
                  <label className="block text-text-secondary text-sm mb-1" style={bodyFont}>{tl(LABELS.location, locale)} *</label>
                  <LocationSearch
                    value={locName}
                    onSelect={(loc) => {
                      setLocName(loc.name);
                      setLat(loc.lat);
                      setLng(loc.lng);
                    }}
                    placeholder={locale === 'en' ? 'Search city...' : 'शहर खोजें...'}
                    className="w-full"
                  />
                </div>

                {/* Lat */}
                <div>
                  <label className="block text-text-secondary text-sm mb-1" style={bodyFont}>{tl(LABELS.latitude, locale)}</label>
                  <input
                    type="number"
                    step="any"
                    value={lat ?? ''}
                    onChange={e => setLat(e.target.value ? Number(e.target.value) : null)}
                    className="w-full bg-bg-primary/60 border border-gold-primary/20 rounded-lg px-3 py-2 text-text-primary focus:outline-none focus:border-gold-primary/50 transition-colors"
                    placeholder="46.47"
                  />
                </div>

                {/* Lng */}
                <div>
                  <label className="block text-text-secondary text-sm mb-1" style={bodyFont}>{tl(LABELS.longitude, locale)}</label>
                  <input
                    type="number"
                    step="any"
                    value={lng ?? ''}
                    onChange={e => setLng(e.target.value ? Number(e.target.value) : null)}
                    className="w-full bg-bg-primary/60 border border-gold-primary/20 rounded-lg px-3 py-2 text-text-primary focus:outline-none focus:border-gold-primary/50 transition-colors"
                    placeholder="6.84"
                  />
                </div>
              </div>

              {/* Error */}
              {error && (
                <p className="text-red-400 text-sm mb-4">{error}</p>
              )}

              {/* Submit */}
              <button
                onClick={handleCompute}
                disabled={computing}
                className="w-full sm:w-auto px-8 py-3 bg-gradient-to-r from-gold-dark via-gold-primary to-gold-light text-bg-primary font-semibold rounded-lg hover:brightness-110 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {computing ? '...' : tl(LABELS.compute, locale)}
              </button>
            </div>
          </motion.div>
        )}

        {/* ── Results Section ─────────────────────────────── */}
        {result && !showForm && (
          <motion.div
            key="results"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
            className="space-y-10"
          >
            {/* Reset button */}
            <button
              onClick={handleReset}
              className="text-gold-primary hover:text-gold-light text-sm transition-colors underline underline-offset-4"
            >
              {tl(LABELS.enterDifferent, locale)}
            </button>

            {/* ── Section 1: Identity Reveal ──────────────── */}
            <section>
              {name && (
                <h2 className="text-2xl font-bold text-gold-light mb-4" style={headingFont}>
                  {name}
                </h2>
              )}

              {/* Comparison Table */}
              <div className="overflow-x-auto rounded-xl border border-gold-primary/15">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gold-primary/8 border-b border-gold-primary/15">
                      <th className="text-left px-3 py-3 text-text-secondary font-medium" style={bodyFont}>{tl(LABELS.planet, locale)}</th>
                      <th className="text-left px-3 py-3 text-text-secondary font-medium" style={bodyFont}>{tl(LABELS.western, locale)}</th>
                      <th className="text-left px-3 py-3 text-text-secondary font-medium" style={bodyFont}>{tl(LABELS.vedic, locale)}</th>
                      <th className="text-left px-3 py-3 text-text-secondary font-medium" style={bodyFont}>
                        <JyotishTerm term="nakshatra">{tl(LABELS.nakshatra, locale)}</JyotishTerm>
                      </th>
                      <th className="text-center px-3 py-3 text-text-secondary font-medium" style={bodyFont}>{tl(LABELS.shifted, locale)}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {result.planets.map((p) => (
                      <tr
                        key={p.id}
                        className={`border-b border-gold-primary/8 transition-colors ${p.isShifted ? 'bg-gold-primary/5' : ''}`}
                      >
                        {/* Planet */}
                        <td className="px-3 py-2.5 whitespace-nowrap">
                          <span className="text-gold-primary mr-1.5 text-base">{PLANET_SYMBOLS[p.id]}</span>
                          <span className="text-text-primary" style={bodyFont}>{tl(p.name, locale)}</span>
                        </td>

                        {/* Tropical sign */}
                        <td className="px-3 py-2.5">
                          {p.isShifted ? (
                            <span className="line-through text-text-secondary">{WESTERN_NAMES[p.tropicalSign]}</span>
                          ) : (
                            <span className="text-text-primary">{WESTERN_NAMES[p.tropicalSign]}</span>
                          )}
                        </td>

                        {/* Sidereal sign */}
                        <td className="px-3 py-2.5">
                          {p.isShifted ? (
                            <span className="text-gold-light font-semibold" style={bodyFont}>{tl(p.siderealSignName, locale)}</span>
                          ) : (
                            <span className="text-text-primary" style={bodyFont}>{tl(p.siderealSignName, locale)}</span>
                          )}
                        </td>

                        {/* Nakshatra — only for Sun and Moon */}
                        <td className="px-3 py-2.5">
                          {p.nakshatra ? (
                            <JyotishTerm term="nakshatra">
                              <span style={bodyFont}>{tl(p.nakshatra.name, locale)}</span>
                            </JyotishTerm>
                          ) : (
                            <span className="text-text-secondary/40">&mdash;</span>
                          )}
                        </td>

                        {/* Shifted indicator */}
                        <td className="px-3 py-2.5 text-center">
                          {p.isShifted ? (
                            <span className="text-gold-primary font-semibold">{tl(LABELS.yes, locale)}</span>
                          ) : (
                            <span className="text-text-secondary/50">{tl(LABELS.no, locale)}</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Shifted count + ayanamsha info */}
              <div className="mt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <p className="text-text-primary text-sm" style={bodyFont}>
                  {tl(LABELS.shiftedCount, locale).replace('{count}', String(result.shiftedCount))}
                </p>
                <p className="text-text-secondary text-xs">
                  <JyotishTerm term="ayanamsha">
                    {locale === 'en' ? 'Ayanamsha' : 'अयनांश'}
                  </JyotishTerm>
                  {' '}(Lahiri): {result.precessionData.currentAyanamsha.toFixed(2)}&deg;
                </p>
              </div>

              {/* Hook line */}
              <div className="mt-6 rounded-xl bg-gradient-to-r from-[#2d1b69]/30 to-[#1a1040]/30 border-l-4 border-gold-primary/60 px-5 py-4">
                <p className="text-text-primary text-base italic leading-relaxed">
                  &ldquo;{result.hookLine}&rdquo;
                </p>
              </div>
            </section>

            <GoldDivider />

            {/* ── Section 2: Precession Info ──────────────── */}
            <section>
              <h2 className="text-2xl font-bold text-gold-light mb-4" style={headingFont}>
                {tl(LABELS.precessionTitle, locale)}
              </h2>

              <div className="space-y-4 text-text-secondary leading-relaxed" style={bodyFont}>
                {locale === 'en' ? (
                  <>
                    <p>
                      Around <strong className="text-text-primary">285 AD</strong>, the Western (tropical) zodiac and the Vedic (sidereal) zodiac were perfectly aligned.
                      Since then, Earth&apos;s axis has slowly wobbled &mdash; a phenomenon called{' '}
                      <strong className="text-text-primary">precession</strong> &mdash; shifting the tropical zodiac by about{' '}
                      <strong className="text-gold-light">{result.precessionData.currentAyanamsha.toFixed(1)}&deg;</strong> relative to the fixed stars.
                    </p>
                    <p>
                      This drift of ~50.3 arcseconds per year (roughly 1&deg; every 72 years) means that the constellation Aries in the night sky
                      no longer lines up with what Western astrology calls &ldquo;Aries season.&rdquo; Vedic astrology corrects for this drift
                      using a value called <JyotishTerm term="ayanamsha">Ayanamsha</JyotishTerm>, keeping the zodiac anchored to the actual stars.
                    </p>
                    <p>
                      In a full <strong className="text-text-primary">precession cycle (~25,772 years)</strong>, the vernal equinox completes one full circuit
                      through all 12 constellations. We are currently in the transition from the Age of Pisces to the Age of Aquarius.
                    </p>
                  </>
                ) : (
                  <>
                    <p>
                      लगभग <strong className="text-text-primary">285 ई.</strong> में पश्चिमी (सायन) और वैदिक (निरयन) राशिचक्र पूर्णतः संरेखित थे।
                      तब से पृथ्वी की धुरी धीरे-धीरे डोलती रही है &mdash; इसे{' '}
                      <strong className="text-text-primary">अयन गति</strong> कहते हैं &mdash; जिससे सायन राशिचक्र स्थिर तारों के सापेक्ष लगभग{' '}
                      <strong className="text-gold-light">{result.precessionData.currentAyanamsha.toFixed(1)}&deg;</strong> खिसक गया है।
                    </p>
                    <p>
                      प्रति वर्ष ~50.3 कला-सेकंड (लगभग हर 72 वर्ष में 1&deg;) का यह विचलन अर्थात आकाश में मेष तारामंडल
                      अब उस समय से मेल नहीं खाता जिसे पश्चिमी ज्योतिष &ldquo;मेष ऋतु&rdquo; कहता है। वैदिक ज्योतिष{' '}
                      <JyotishTerm term="ayanamsha">अयनांश</JyotishTerm> का उपयोग करके इस विचलन को ठीक करता है।
                    </p>
                    <p>
                      एक पूर्ण अयन चक्र (<strong className="text-text-primary">~25,772 वर्ष</strong>) में वसंत विषुव सभी 12 तारामंडलों से गुज़रता है।
                    </p>
                  </>
                )}
              </div>

              {/* Interactive precession slider */}
              <PrecessionSlider
                precessionData={result.precessionData}
                planets={result.planets}
              />
            </section>

            <GoldDivider />

            {/* ── Section 3: What This Means ──────────────── */}
            {shiftedPlanets.length > 0 && (
              <section>
                <h2 className="text-2xl font-bold text-gold-light mb-6" style={headingFont}>
                  {tl(LABELS.whatThisMeans, locale)}
                </h2>

                <div className="space-y-4">
                  {shiftedPlanets.map((p) => (
                    <InterpretiveCard key={p.id} planet={p} locale={locale} headingFont={headingFont} bodyFont={bodyFont} />
                  ))}
                </div>

                {/* CTAs */}
                <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
                  <Link
                    href={kundaliHref}
                    className="inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-gold-dark via-gold-primary to-gold-light text-bg-primary font-semibold rounded-lg hover:brightness-110 transition-all"
                  >
                    {tl(LABELS.generateChart, locale)} &rarr;
                  </Link>

                  {/* Share Discovery Card — uses Sun sign shift for the narrative */}
                  {discoveryCardUrl && (
                    <ShareCardButton
                      cardUrl={discoveryCardUrl}
                      title="My Real Star Signs — Sidereal vs Tropical"
                      text={result?.hookLine ?? 'Discover your real star signs with Vedic astrology'}
                    />
                  )}
                </div>
              </section>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ── Interpretive Card Component ─────────────────────────────
function InterpretiveCard({
  planet,
  locale,
  headingFont,
  bodyFont,
}: {
  planet: PlanetComparison;
  locale: Locale;
  headingFont: React.CSSProperties;
  bodyFont: React.CSSProperties;
}) {
  const symbol = PLANET_SYMBOLS[planet.id] ?? '';
  const meaning = SIGN_INTERPRETATION[planet.siderealSign];

  return (
    <div className="rounded-xl bg-gradient-to-br from-[#2d1b69]/30 via-[#1a1040]/30 to-[#0a0e27] border border-gold-primary/12 p-5">
      <div className="flex items-center gap-3 mb-3">
        <span className="text-2xl text-gold-primary">{symbol}</span>
        <h3 className="text-lg font-semibold text-gold-light" style={headingFont}>
          {tl(planet.name, locale)}
        </h3>
      </div>

      <p className="text-text-secondary text-sm mb-2" style={bodyFont}>
        {locale === 'en'
          ? `Western astrology places your ${planet.name.en} in ${WESTERN_NAMES[planet.tropicalSign]}, but the Vedic sky reveals it in ${tl(planet.siderealSignName, locale)}.`
          : `पश्चिमी ज्योतिष आपके ${tl(planet.name, locale)} को ${WESTERN_NAMES[planet.tropicalSign]} में रखता है, लेकिन वैदिक आकाश इसे ${tl(planet.siderealSignName, locale)} में दर्शाता है।`
        }
      </p>

      {meaning && (
        <p className="text-text-primary text-sm leading-relaxed" style={bodyFont}>
          <span className="text-gold-primary font-medium">{tl(planet.siderealSignName, locale)}:</span>{' '}
          {tl(meaning, locale)}
        </p>
      )}

      {/* Nakshatra note for Sun and Moon */}
      {planet.nakshatra && (
        <p className="text-text-secondary text-xs mt-2 italic" style={bodyFont}>
          {locale === 'en'
            ? `Your ${planet.name.en} is in `
            : `आपका ${tl(planet.name, locale)} `
          }
          <JyotishTerm term="nakshatra">
            {tl(planet.nakshatra.name, locale)}
          </JyotishTerm>
          {locale === 'en'
            ? ` nakshatra — a level of precision Western astrology cannot provide.`
            : ` नक्षत्र में है — यह सूक्ष्मता पश्चिमी ज्योतिष में सम्भव नहीं।`
          }
        </p>
      )}
    </div>
  );
}
