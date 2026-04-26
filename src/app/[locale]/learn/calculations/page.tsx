'use client';


import { lt } from '@/lib/learn/translations';
import type { LocaleText } from '@/lib/learn/translations';
import L from '@/messages/learn/calculations.json';
import { useLocale } from 'next-intl';
import { motion } from 'framer-motion';
import LessonSection from '@/components/learn/LessonSection';
import SanskritTermCard from '@/components/learn/SanskritTermCard';
import KeyTakeaway from '@/components/learn/KeyTakeaway';
import WhyItMatters from '@/components/learn/WhyItMatters';
import ClassicalReference from '@/components/learn/ClassicalReference';
import BeginnerNote from '@/components/learn/BeginnerNote';
import { Link } from '@/lib/i18n/navigation';
import type { Locale } from '@/types/panchang';
import { isDevanagariLocale } from '@/lib/utils/locale-fonts';


const ACCURACY_TABLE = [
  { item: { en: 'Sun longitude', hi: 'सूर्य देशान्तर', sa: 'सूर्यदेशान्तरम्' }, accuracy: '~0.01° (36 arcsec)', impact: { en: '~30 sec timing error', hi: '~30 सेकंड समय त्रुटि', sa: '~30 क्षणत्रुटिः' } },
  { item: { en: 'Moon longitude', hi: 'चन्द्र देशान्तर', sa: 'चन्द्रदेशान्तरम्' }, accuracy: '~0.003° (10 arcsec)', impact: { en: '~1-2 min tithi error', hi: '~1-2 मिनट तिथि त्रुटि', sa: '~1-2 निमेषतिथित्रुटिः' } },
  { item: { en: 'Lahiri Ayanamsha', hi: 'लहिरी अयनांश', sa: 'लहिरीअयनांशः' }, accuracy: '~1 arcsecond', impact: { en: 'Negligible', hi: 'नगण्य', sa: 'नगण्यम्' } },
  { item: { en: 'Sunrise/Sunset', hi: 'सूर्योदय/सूर्यास्त', sa: 'सूर्योदयः/सूर्यास्तः' }, accuracy: '~1-2 minutes', impact: { en: 'Affects Muhurta boundaries', hi: 'मुहूर्त सीमाओं को प्रभावित', sa: 'मुहूर्तसीमाः प्रभावयति' } },
  { item: { en: 'Transition times', hi: 'परिवर्तन समय', sa: 'परिवर्तनसमयः' }, accuracy: '~1-3 minutes', impact: { en: 'Tithi/Nakshatra change times', hi: 'तिथि/नक्षत्र परिवर्तन समय', sa: 'तिथि/नक्षत्रपरिवर्तनसमयः' } },
];

export default function LearnCalculationsPage() {
  const locale = useLocale() as Locale;
  const t = (key: string) => lt((L as unknown as Record<string, LocaleText>)[key], locale);

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-gold-gradient mb-2" style={{ fontFamily: 'var(--font-heading)' }}>
          {t('title')}
        </h2>
        <p className="text-text-secondary">{t('subtitle')}</p>
      </div>

      {/* Key Takeaway — top-level orientation */}
      <KeyTakeaway
        points={[
          'This page explains how we compute astronomical positions from scratch — no external APIs, pure mathematics.',
          'Every formula here runs in your browser to produce the Panchang you see on this site.',
          'You do not need a math degree to follow along — we explain every step in plain language first, then show the formula.',
        ]}
        locale={locale}
      />

      {/* Beginner-friendly intro: What are we computing and why? */}
      <div className="rounded-xl bg-bg-secondary/60 border border-gold-primary/15 p-5 sm:p-6 mb-8">
        <h3 className="text-lg font-semibold text-gold-light mb-3" style={{ fontFamily: 'var(--font-heading)' }}>
          What are we computing, and why?
        </h3>
        <p className="text-sm text-text-primary/85 leading-relaxed mb-3">
          A Panchang needs to know <strong className="text-gold-light">exactly</strong> where the Sun and Moon are in the sky at any given moment.
          From their positions, we derive the five elements of the Panchang: Tithi, Nakshatra, Yoga, Karana, and Vara.
          We also need precise sunrise and sunset times, because the Vedic day begins at sunrise, not midnight.
        </p>
        <p className="text-sm text-text-primary/85 leading-relaxed mb-3">
          Most apps call an external API for this data. We do it differently: every position is computed
          from first principles using well-tested mathematical formulas. This means the app works offline,
          has no API rate limits, and we can verify every result against reference sources.
        </p>
        <p className="text-sm text-text-primary/85 leading-relaxed">
          The pipeline is: <strong className="text-gold-light/90">Date → Julian Day → Sun/Moon positions → Sidereal correction → Panchang elements → Transition times</strong>.
          Each section below walks through one step of this pipeline.
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
        <SanskritTermCard term="Ganita" devanagari="गणित" transliteration="Gaṇita" meaning="Calculation / Mathematics" />
        <SanskritTermCard term="Siddhanta" devanagari="सिद्धान्त" transliteration="Siddhānta" meaning="Established conclusion / Treatise" />
        <SanskritTermCard term="Khagola" devanagari="खगोल" transliteration="Khagola" meaning="Celestial sphere" />
        <SanskritTermCard term="Spashta" devanagari="स्पष्ट" transliteration="Spaṣṭa" meaning="True / Corrected (position)" />
      </div>

      {/* --- Step 1: Julian Day --- */}
      <LessonSection number={1} title={t('jdTitle')}>
        <p className="text-sm text-text-primary/85 leading-relaxed mb-3">
          <strong className="text-gold-light">What we are computing:</strong> Converting a calendar date (like &quot;April 22, 2026&quot;)
          into a single continuous number that astronomers can do math with.
        </p>
        <p>{t('jdContent')}</p>

        <BeginnerNote
          term="Julian Day"
          explanation="A continuous count of days since January 1, 4713 BCE. Astronomers use it to avoid calendar complications — no leap years, no month lengths, just one clean number."
        />

        <div className="mt-4 p-4 bg-bg-primary/50 rounded-lg border border-gold-primary/10">
          <p className="text-gold-light font-mono text-sm mb-2">
            {t('jdConvLabel')}
          </p>
          <p className="text-gold-light/80 font-mono text-xs">A = floor(Y / 100)</p>
          <p className="text-gold-light/80 font-mono text-xs">B = 2 - A + floor(A / 4)</p>
          <p className="text-gold-light/80 font-mono text-xs">JD = floor(365.25 × (Y + 4716)) + floor(30.6001 × (M + 1)) + D + H/24 + B - 1524.5</p>
          <p className="text-gold-light/60 font-mono text-xs mt-2">
            {t('jdThenLabel')}
          </p>
        </div>

        <ClassicalReference shortName="Meeus" chapter="Ch. 7" topic="Julian Day conversion from calendar dates" />

        <WhyItMatters locale={locale}>
          Calendars are messy — different month lengths, leap years, calendar reforms (Julian vs. Gregorian),
          time zones. Julian Day gives us one clean number to work with. Want to know how many days between
          two dates? Just subtract their JD values. Need to add 6 hours? Add 0.25. It is the universal
          &quot;language of time&quot; for astronomers.
        </WhyItMatters>
      </LessonSection>

      {/* --- Step 2: Sun's Longitude --- */}
      <LessonSection number={2} title={t('sunTitle')}>
        <p className="text-sm text-text-primary/85 leading-relaxed mb-3">
          <strong className="text-gold-light">What we are computing:</strong> The Sun&apos;s position along the{' '}
          <BeginnerNote
            term="ecliptic"
            explanation="The apparent path the Sun traces across the sky over a year. It is the plane of Earth's orbit projected onto the sky — a great circle tilted ~23.44° from the celestial equator."
          />{' '}
          — measured in degrees from 0° to 360°.
        </p>
        <p>{t('sunContent')}</p>

        <div className="mt-4 mb-2 rounded-lg bg-blue-500/5 border border-blue-500/15 p-4">
          <p className="text-sm text-text-primary/80 leading-relaxed">
            <strong className="text-blue-400">Analogy:</strong> Imagine the Sun travelling on a slightly oval racetrack (its elliptical orbit).
            It does not move at a constant speed — it goes faster when closer to one end and slower at the other.
            The &quot;mean longitude&quot; (L0) pretends the Sun moves at a steady average speed.
            The &quot;<BeginnerNote term="equation of center" explanation="The angular difference between where a body actually is in its elliptical orbit and where it would be if it moved at a constant speed. It corrects for the fact that orbits are ellipses, not circles." />&quot; (C)
            is the correction that accounts for the actual speeding up and slowing down.
          </p>
        </div>

        <div className="mt-4 p-4 bg-bg-primary/50 rounded-lg border border-gold-primary/10">
          <p className="text-gold-light font-mono text-sm mb-2">
            {t('sunAlgoLabel')}
          </p>
          <p className="text-gold-light/80 font-mono text-xs">L0 = 280.46646 + 36000.76983 × T    <span className="text-gold-light/40">// mean longitude</span></p>
          <p className="text-gold-light/80 font-mono text-xs">M  = 357.52911 + 35999.05029 × T    <span className="text-gold-light/40">// mean anomaly</span></p>
          <p className="text-gold-light/80 font-mono text-xs">C  = 1.9146 × sin(M) + 0.02 × sin(2M)  <span className="text-gold-light/40">// equation of center</span></p>
          <p className="text-gold-light/80 font-mono text-xs">Sun_true = L0 + C</p>
          <p className="text-gold-light/80 font-mono text-xs">Sun_apparent = Sun_true - 0.00569 - 0.00478 × sin(Ω)  <span className="text-gold-light/40">// nutation</span></p>
        </div>

        <div className="mt-3 text-xs text-text-secondary/70 space-y-1">
          <p>
            <strong className="text-text-secondary">Line by line:</strong>
          </p>
          <ul className="list-disc list-inside space-y-1 ml-2">
            <li><strong>L0</strong> — Where the Sun <em>would</em> be if it moved at a perfectly constant speed</li>
            <li><strong>M</strong> — How far the Sun is from perihelion (its closest point to Earth) in its orbit</li>
            <li><strong>C</strong> — Correction for the elliptical orbit (up to ~1.9° difference)</li>
            <li><strong>Sun_true</strong> — The Sun&apos;s actual geometric position</li>
            <li><strong>Sun_apparent</strong> — Final position after correcting for{' '}
              <BeginnerNote term="nutation" explanation="A small periodic wobble in Earth's axis caused by the Moon's gravitational pull. It shifts apparent positions by up to ~17 arcseconds — tiny but measurable." /> and{' '}
              <BeginnerNote term="aberration" explanation="A tiny shift in a star's apparent position caused by Earth's orbital velocity. Light from the Sun takes ~8 minutes to reach us, and Earth moves during that time." />
            </li>
          </ul>
        </div>

        <ClassicalReference shortName="Meeus" chapter="Ch. 25" topic="Solar coordinates — low-accuracy algorithm sufficient for Panchang" />

        <WhyItMatters locale={locale}>
          The Sun&apos;s position determines which Rashi (zodiac sign) it occupies — this defines the solar month (Masa)
          and is half the input for computing Tithi. Getting the Sun wrong by even 1° could shift a Tithi boundary
          by several hours. Our accuracy of ~0.01° keeps timing errors under 30 seconds.
        </WhyItMatters>
      </LessonSection>

      {/* --- Step 3: Moon's Longitude --- */}
      <LessonSection number={3} title={t('moonTitle')}>
        <p className="text-sm text-text-primary/85 leading-relaxed mb-3">
          <strong className="text-gold-light">What we are computing:</strong> The Moon&apos;s position along the ecliptic.
          This is the single most important calculation in the entire Panchang — the Moon determines Tithi, Nakshatra, Yoga, and Karana.
        </p>
        <p>{t('moonContent')}</p>

        <div className="mt-4 mb-2 rounded-lg bg-blue-500/5 border border-blue-500/15 p-4">
          <p className="text-sm text-text-primary/80 leading-relaxed">
            <strong className="text-blue-400">Why is the Moon so hard?</strong> Unlike the Sun (which mostly follows a smooth ellipse),
            the Moon is pulled by both the Earth and the Sun simultaneously. These competing gravitational tugs create a complex
            &quot;wobbling&quot; path — like a ball rolling on a surface that itself is tilting. To capture this complexity,
            we need 60 separate correction terms, each accounting for a different wobble pattern. The largest term alone
            shifts the Moon by over 6° — that is about 12 hours of Tithi time.
          </p>
        </div>

        <div className="mt-4 p-4 bg-bg-primary/50 rounded-lg border border-gold-primary/10">
          <p className="text-gold-light font-mono text-sm mb-2">
            {t('moonAlgoLabel')}
          </p>
          <p className="text-gold-light/80 font-mono text-xs">L&apos; = 218.316 + 481267.881 × T  <span className="text-gold-light/40">// Moon mean longitude</span></p>
          <p className="text-gold-light/80 font-mono text-xs">D  = 297.850 + 445267.111 × T  <span className="text-gold-light/40">// mean elongation</span></p>
          <p className="text-gold-light/80 font-mono text-xs">M  = 357.529 + 35999.050 × T   <span className="text-gold-light/40">// Sun mean anomaly</span></p>
          <p className="text-gold-light/80 font-mono text-xs">M&apos; = 134.963 + 477198.868 × T  <span className="text-gold-light/40">// Moon mean anomaly</span></p>
          <p className="text-gold-light/80 font-mono text-xs">F  = 93.272 + 483202.018 × T   <span className="text-gold-light/40">// argument of latitude</span></p>
          <p className="text-gold-light/80 font-mono text-xs mt-2">Σl = Σ [coeff × sin(D×d + M×m + M&apos;×m&apos; + F×f)] × E^|m|</p>
          <p className="text-gold-light/80 font-mono text-xs">Moon_long = L&apos; + Σl/1000000 + A1 + A2 + A3 corrections</p>
          <p className="text-gold-light/60 font-mono text-xs mt-2">
            {t('moonTop4')}
          </p>
          <p className="text-gold-light/60 font-mono text-xs">
            {t('moonEcorr')}
          </p>
        </div>

        <div className="mt-3 text-xs text-text-secondary/70 space-y-1">
          <p><strong className="text-text-secondary">The five fundamental arguments, decoded:</strong></p>
          <ul className="list-disc list-inside space-y-1 ml-2">
            <li><strong>L&apos;</strong> — Moon&apos;s average position (if it moved at constant speed)</li>
            <li><strong>D</strong> — Angular distance between Moon and Sun (drives the lunar phases)</li>
            <li><strong>M</strong> — Sun&apos;s position in its own orbit (because the Sun&apos;s pull varies)</li>
            <li><strong>M&apos;</strong> — Moon&apos;s position in its orbit around Earth</li>
            <li><strong>F</strong> — Moon&apos;s distance above/below the ecliptic plane (related to eclipses)</li>
          </ul>
        </div>

        <ClassicalReference shortName="Meeus" chapter="Ch. 47" topic="Periodic terms for the Moon's longitude — the full 60-term series" />

        <WhyItMatters locale={locale}>
          The Moon moves about 13° per day — roughly one Nakshatra. A 0.5° error in Moon position translates
          to a 1-2 minute error in Tithi transition time. Using all 60 terms (instead of a simplified formula)
          is what makes our Panchang match professional references like Prokerala to within 1-2 minutes.
        </WhyItMatters>
      </LessonSection>

      {/* --- Step 4: Ayanamsha --- */}
      <LessonSection number={4} title={t('ayanamshaTitle')}>
        <p className="text-sm text-text-primary/85 leading-relaxed mb-3">
          <strong className="text-gold-light">What we are computing:</strong> The correction needed to convert
          Western (tropical) positions to Vedic (sidereal) positions.
        </p>
        <p>{t('ayanamshaContent')}</p>

        <div className="mt-4 mb-2 rounded-lg bg-blue-500/5 border border-blue-500/15 p-4">
          <p className="text-sm text-text-primary/80 leading-relaxed">
            <strong className="text-blue-400">Analogy:</strong> Imagine two rulers measuring the same stick, but one ruler&apos;s zero mark
            has shifted 24° to the left. The stick has not moved — the rulers just disagree on where &quot;zero&quot; is.{' '}
            <BeginnerNote
              term="Tropical"
              explanation="The Western zodiac system, anchored to the spring equinox point. This point shifts slowly against the stars due to Earth's axial wobble (precession), so tropical signs drift away from their namesake constellations over millennia."
            /> positions use the spring equinox as zero.{' '}
            <BeginnerNote
              term="Sidereal"
              explanation="The Vedic zodiac system, anchored to fixed stars. The star Spica (Chitra) defines 0° Libra in the Lahiri system. Because it is star-fixed, it does not drift with precession."
            /> positions use fixed stars as zero.
            The <BeginnerNote
              term="Ayanamsha"
              explanation="The angular difference between the tropical and sidereal zodiac starting points. Currently about 24°, it increases by ~50 arcseconds per year due to precession of the equinoxes."
            /> is the gap between them — currently about 24° and growing by ~50 arcseconds each year.
          </p>
        </div>

        <div className="mt-4 p-4 bg-bg-primary/50 rounded-lg border border-gold-primary/10">
          <p className="text-gold-light font-mono text-sm mb-2">
            {t('ayanPolyLabel')}
          </p>
          <p className="text-gold-light/80 font-mono text-xs">Ayanamsha = 23.85306° + 1.39722° × T + 0.00018° × T²</p>
          <p className="text-gold-light/60 font-mono text-xs mt-1">
            {t('ayanWhereT')}
          </p>
          <p className="text-gold-light/80 font-mono text-xs mt-2">Sidereal_longitude = Tropical_longitude - Ayanamsha</p>
          <p className="text-gold-light/60 font-mono text-xs mt-1">
            {t('ayanExample')}
          </p>
        </div>

        <ClassicalReference shortName="SS" chapter="Ch. 3" topic="Precession of the equinoxes (Ayana Chalana) — the original Indian treatment" />

        <WhyItMatters locale={locale}>
          Getting the Ayanamsha wrong by even 1° would shift every planet into the wrong Nakshatra pada — changing
          Dasha calculations, baby name syllables, and compatibility scores. The Lahiri value is officially adopted
          by the Indian government&apos;s Positional Astronomy Centre and is the most widely used Ayanamsha system.
        </WhyItMatters>
      </LessonSection>

      {/* --- Step 5: Panchang Elements --- */}
      <LessonSection number={5} title={t('tithiCalcTitle')}>
        <p className="text-sm text-text-primary/85 leading-relaxed mb-3">
          <strong className="text-gold-light">What we are computing:</strong> The five daily elements of the Panchang —
          each derived from simple arithmetic on the Sun and Moon positions we computed above.
        </p>
        <p>{t('tithiCalcContent')}</p>
        <div className="mt-4 space-y-2">
          {[
            { name: 'Tithi', formula: 'floor((Moon_sid - Sun_sid) / 12°) + 1', range: '1-30', note: 'Moon gains ~12° on Sun per day' },
            { name: 'Nakshatra', formula: 'floor(Moon_sid / 13°20\') + 1', range: '1-27', note: 'Moon\'s position in 27 star divisions' },
            { name: 'Yoga', formula: 'floor((Sun_sid + Moon_sid) / 13°20\') + 1', range: '1-27', note: 'Sum of Sun and Moon longitudes' },
            { name: 'Karana', formula: 'floor((Moon_sid - Sun_sid) / 6°)', range: '1-60', note: 'Half of a Tithi — 60 in a lunar month' },
            { name: 'Vara', formula: 'floor(JD + 1.5) mod 7', range: '0-6', note: 'Weekday from Julian Day Number' },
          ].map((calc, i) => (
            <motion.div
              key={calc.name}
              initial={{ opacity: 0, x: -10 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="p-3 bg-bg-primary/50 rounded-lg border border-gold-primary/10"
            >
              <div className="flex items-center gap-3">
                <span className="text-gold-primary font-semibold text-sm w-20">{calc.name}</span>
                <span className="text-gold-light/80 font-mono text-xs flex-1">{calc.formula}</span>
              </div>
              <p className="text-text-secondary/75 text-xs mt-1 ml-20">{!isDevanagariLocale(locale) ? calc.note : calc.note}</p>
            </motion.div>
          ))}
        </div>

        <div className="mt-4 rounded-lg bg-blue-500/5 border border-blue-500/15 p-4">
          <p className="text-sm text-text-primary/80 leading-relaxed">
            <strong className="text-blue-400">The key insight:</strong> Tithi and Karana depend on the <em>difference</em> between
            Moon and Sun (the Moon-Sun angle). Nakshatra depends on the Moon&apos;s position alone. Yoga depends on
            the <em>sum</em> of Moon and Sun. Vara (weekday) is purely calendar-based. This is why Tithi changes
            are linked to lunar phases — a full cycle of 30 Tithis = one full Moon orbit relative to the Sun.
          </p>
        </div>

        <WhyItMatters locale={locale}>
          These five simple formulas are the heart of the Panchang. Every festival date, every muhurta
          recommendation, every &quot;auspicious or inauspicious&quot; determination flows from these five numbers.
          The hard work was getting accurate Sun and Moon positions — once you have those, the Panchang
          elements are just division and modular arithmetic.
        </WhyItMatters>
      </LessonSection>

      {/* --- Step 6: Transition Times --- */}
      <LessonSection number={6} title={t('transitionTitle')}>
        <p className="text-sm text-text-primary/85 leading-relaxed mb-3">
          <strong className="text-gold-light">What we are computing:</strong> The exact moment when one Tithi (or Nakshatra, Yoga, Karana)
          ends and the next one begins.
        </p>
        <p>{t('transitionContent')}</p>

        <div className="mt-4 mb-2 rounded-lg bg-blue-500/5 border border-blue-500/15 p-4">
          <p className="text-sm text-text-primary/80 leading-relaxed">
            <strong className="text-blue-400">Analogy:</strong> Imagine you know a traffic light changed from green to red
            sometime in the last hour, but you did not see when. You could check the midpoint (30 minutes ago).
            If it was still green then, you know it changed in the second half-hour. Check 45 minutes — still green?
            Then it changed between 45 and 60 minutes. Each check halves the remaining window. After about 20 checks,
            you have pinpointed the exact second of the change. That is binary search.
          </p>
        </div>

        <div className="mt-4 p-4 bg-bg-primary/50 rounded-lg border border-gold-primary/10">
          <p className="text-gold-light font-mono text-sm mb-2">
            {t('binaryLabel')}
          </p>
          <p className="text-gold-light/80 font-mono text-xs">jd_low = sunrise_JD</p>
          <p className="text-gold-light/80 font-mono text-xs">jd_high = sunrise_JD + 1.5  <span className="text-gold-light/40">// 36 hours window</span></p>
          <p className="text-gold-light/80 font-mono text-xs">while (jd_high - jd_low &gt; 0.0001):  <span className="text-gold-light/40">// ~8.6 sec precision</span></p>
          <p className="text-gold-light/80 font-mono text-xs">  mid = (jd_low + jd_high) / 2</p>
          <p className="text-gold-light/80 font-mono text-xs">  if tithi(mid) == current_tithi:</p>
          <p className="text-gold-light/80 font-mono text-xs">    jd_low = mid   <span className="text-gold-light/40">// transition is after mid</span></p>
          <p className="text-gold-light/80 font-mono text-xs">  else:</p>
          <p className="text-gold-light/80 font-mono text-xs">    jd_high = mid  <span className="text-gold-light/40">// transition is before mid</span></p>
          <p className="text-gold-light/60 font-mono text-xs mt-2">
            {t('binaryConverge')}
          </p>
        </div>

        <div className="mt-3 text-xs text-text-secondary/70">
          <p><strong className="text-text-secondary">Step by step:</strong></p>
          <ol className="list-decimal list-inside space-y-1 ml-2 mt-1">
            <li>Start with a wide window: sunrise to 36 hours later (covers any transition in the Panchang day)</li>
            <li>Check the midpoint — compute Sun and Moon positions, derive the Tithi number</li>
            <li>If the Tithi at the midpoint is still the current one, the transition is later — move the lower bound up</li>
            <li>If the Tithi has changed, the transition is earlier — move the upper bound down</li>
            <li>Repeat until the window is less than ~8.6 seconds wide (0.0001 JD)</li>
          </ol>
        </div>

        <WhyItMatters locale={locale}>
          Knowing the Tithi is not enough — you need to know <em>when</em> it changes, down to the minute.
          Festival dates, Ekadashi fasting times, and Muhurta windows all depend on exact transition times.
          A 2-minute error is acceptable; a 30-minute error could mean observing a fast on the wrong day.
          Binary search gives us ~10-second precision at the cost of only 20 iterations.
        </WhyItMatters>
      </LessonSection>

      {/* --- Step 7: Sunrise/Sunset --- */}
      <LessonSection number={7} title={t('sunriseTitle')}>
        <p className="text-sm text-text-primary/85 leading-relaxed mb-3">
          <strong className="text-gold-light">What we are computing:</strong> The exact time the Sun appears above and disappears
          below the horizon at the observer&apos;s specific location.
        </p>
        <p>{t('sunriseContent')}</p>

        <div className="mt-4 mb-2 rounded-lg bg-blue-500/5 border border-blue-500/15 p-4">
          <p className="text-sm text-text-primary/80 leading-relaxed">
            <strong className="text-blue-400">Why -0.833°?</strong> The Sun is not a point — it is a disc about 0.53° wide.
            We want the moment the <em>top edge</em> (not the center) clears the horizon, so we subtract half the disc (0.267°).
            On top of that, Earth&apos;s atmosphere bends light like a lens, lifting the Sun&apos;s image by about 0.567°.
            Combined: 0.267° + 0.567° = 0.833°. This means you can see the Sun when it is geometrically <em>below</em> the
            horizon — atmospheric refraction gives us a few extra minutes of daylight.
          </p>
        </div>

        <div className="mt-4 p-4 bg-bg-primary/50 rounded-lg border border-gold-primary/10">
          <p className="text-gold-light font-mono text-sm mb-2">
            {t('sunriseCalcLabel')}
          </p>
          <p className="text-gold-light/80 font-mono text-xs">decl = asin(sin(23.44°) × sin(Sun_long))</p>
          <p className="text-gold-light/80 font-mono text-xs">cos(H) = (sin(-0.833°) - sin(lat) × sin(decl)) / (cos(lat) × cos(decl))</p>
          <p className="text-gold-light/80 font-mono text-xs">sunrise_UT = 12h - H/15 - longitude/15</p>
          <p className="text-gold-light/60 font-mono text-xs mt-1">
            {t('sunriseRefraction')}
          </p>
        </div>

        <div className="mt-3 text-xs text-text-secondary/70 space-y-1">
          <p><strong className="text-text-secondary">What each line does:</strong></p>
          <ul className="list-disc list-inside space-y-1 ml-2">
            <li><strong>decl</strong> — Sun&apos;s declination: how far north or south of the celestial equator it is (drives seasons)</li>
            <li><strong>H</strong> — The hour angle: how many hours before/after solar noon the Sun crosses the horizon</li>
            <li><strong>sunrise_UT</strong> — Convert hour angle to clock time (Universal Time), adjusted for the observer&apos;s longitude</li>
          </ul>
        </div>

        <ClassicalReference shortName="Meeus" chapter="Ch. 15" topic="Rising and setting of celestial bodies, with atmospheric refraction correction" />

        <WhyItMatters locale={locale}>
          In the Vedic system, the day begins at sunrise — not midnight. Every Panchang element is
          anchored to sunrise. If your sunrise time is off by 5 minutes, every Muhurta window, Choghadiya,
          and Hora boundary shifts by 5 minutes too. Location matters enormously: sunrise in Zurich and
          sunrise in Mumbai differ by hours, and even neighboring cities can differ by minutes.
        </WhyItMatters>
      </LessonSection>

      {/* --- Accuracy Table --- */}
      <LessonSection title={t('accuracyTitle')} variant="highlight">
        <p className="text-sm text-text-primary/85 leading-relaxed mb-4">
          How do we know these formulas are accurate? We compare our results against established reference
          sources (Prokerala, Shubh Panchang) for the same location and date. Here is how our engine performs:
        </p>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gold-primary/20">
                <th className="text-left py-2 text-gold-primary font-semibold">{t('thCalculation')}</th>
                <th className="text-left py-2 text-gold-primary font-semibold">{t('thAccuracy')}</th>
                <th className="text-left py-2 text-gold-primary font-semibold">{t('thImpact')}</th>
              </tr>
            </thead>
            <tbody>
              {ACCURACY_TABLE.map((row) => (
                <tr key={row.item.en} className="border-b border-gold-primary/5">
                  <td className="py-2 text-gold-light text-xs">{lt(row.item as LocaleText, locale)}</td>
                  <td className="py-2 text-gold-light/80 font-mono text-xs">{row.accuracy}</td>
                  <td className="py-2 text-text-secondary text-xs">{lt(row.impact as LocaleText, locale)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-4 text-text-secondary/70 text-xs italic">
          {t('engineNote')}
        </p>
      </LessonSection>

      {/* --- About Jean Meeus --- */}
      <div className="rounded-xl bg-bg-secondary/60 border border-gold-primary/15 p-5 sm:p-6 mb-6 mt-6">
        <h3 className="text-lg font-semibold text-gold-light mb-3" style={{ fontFamily: 'var(--font-heading)' }}>
          About Jean Meeus
        </h3>
        <p className="text-sm text-text-primary/85 leading-relaxed mb-3">
          Jean Meeus is a Belgian astronomer whose book <em>Astronomical Algorithms</em> (1991) is the standard
          reference used by observatories, planetarium software, and navigation systems worldwide. His algorithms
          distil centuries of astronomical theory into practical, computable formulas.
        </p>
        <p className="text-sm text-text-primary/85 leading-relaxed">
          We use Meeus for Sun (Ch. 25), Moon (Ch. 47), sunrise/sunset (Ch. 15), and Julian Day (Ch. 7).
          The Surya Siddhanta provides the conceptual foundation for Indian astronomical computation, and
          Meeus provides the modern numerical precision we need for sub-minute accuracy.
        </p>
        <ClassicalReference shortName="Meeus" topic="The modern computational backbone of this Panchang engine" />
        <ClassicalReference shortName="SS" topic="The classical Indian astronomical treatise that established the mathematical framework" />
      </div>

      {/* --- Summary: What We've Built --- */}
      <div className="rounded-2xl bg-emerald-500/5 border border-emerald-500/20 p-5 sm:p-6 mb-6">
        <h3 className="text-lg font-semibold text-emerald-400 mb-3" style={{ fontFamily: 'var(--font-heading)' }}>
          What we have built
        </h3>
        <p className="text-sm text-text-primary/85 leading-relaxed mb-3">
          From just a <strong className="text-gold-light">date</strong> and a <strong className="text-gold-light">location</strong>, this engine computes:
        </p>
        <ul className="space-y-2 text-sm text-text-primary/85">
          <li className="flex items-start gap-2">
            <span className="text-emerald-500 mt-0.5 flex-shrink-0">1.</span>
            <span>Sun and Moon positions to <strong className="text-gold-light">0.01°</strong> accuracy — using 60+ periodic terms</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-emerald-500 mt-0.5 flex-shrink-0">2.</span>
            <span>All five Panchang elements: Tithi, Nakshatra, Yoga, Karana, Vara</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-emerald-500 mt-0.5 flex-shrink-0">3.</span>
            <span>Exact transition times to <strong className="text-gold-light">~10 second</strong> precision</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-emerald-500 mt-0.5 flex-shrink-0">4.</span>
            <span>Sunrise and sunset for any location on Earth, accounting for atmospheric refraction</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-emerald-500 mt-0.5 flex-shrink-0">5.</span>
            <span>Sidereal positions via Lahiri Ayanamsha — the bridge between modern astronomy and Vedic tradition</span>
          </li>
        </ul>
        <p className="text-sm text-text-primary/85 leading-relaxed mt-3">
          All of this runs in pure JavaScript — no external APIs, no ephemeris files, no internet connection required.
          The same engine powers the Panchang page, Kundali charts, Muhurta recommendations, and festival calendars across this site.
        </p>
      </div>

      <div className="mt-6 text-center">
        <Link
          href="/panchang"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-gold-primary/10 border border-gold-primary/30 text-gold-light hover:bg-gold-primary/20 transition-colors text-sm font-medium"
        >
          {t('tryIt')}
        </Link>
      </div>
    </div>
  );
}
