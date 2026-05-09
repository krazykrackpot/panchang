'use client';

import ModuleContainer, { type ModuleMeta, type ModuleQuestion, useModuleLocale } from '@/components/learn/ModuleContainer';
import { isDevanagariLocale } from '@/lib/utils/locale-fonts';
import { lt } from '@/lib/learn/translations';
import type { LocaleText } from '@/lib/learn/translations';
import L from '@/messages/learn/modules/16-1.json';
import QuickCheck from '@/components/learn/QuickCheck';
import WhyItMatters from '@/components/learn/WhyItMatters';
import KeyTakeaway from '@/components/learn/KeyTakeaway';

const META: ModuleMeta = {
  id: 'mod_16_1', phase: 5, topic: 'Classical', moduleNumber: '16.1',
  title: L.title as unknown as ModuleMeta['title'],
  subtitle: L.subtitle as unknown as ModuleMeta['subtitle'],
  estimatedMinutes: 16,
  crossRefs: (L.crossRefs as unknown as Array<{ label: ModuleMeta['title']; href: string }>).map(cr => ({ label: cr.label, href: cr.href })),
};

const QUESTIONS: ModuleQuestion[] = (L.questions as unknown as ModuleQuestion[]);

function Page1() {
  const locale = useModuleLocale();
  const isHi = isDevanagariLocale(locale);
  return (
    <div className="space-y-6">
      <KeyTakeaway
        points={[
          'BPHS (Brihat Parashara Hora Shastra) is the foundational text of Parashari Jyotish — 97 chapters, ~4,000 verses.',
          'Surya Siddhanta (c. 400 CE) calculated the sidereal year to within 1.4 seconds of the modern value.',
          'Aryabhata (476 CE) described Earth\'s rotation and developed the sine table that influenced Arab and European mathematics.',
        ]}
        locale={locale}
      />
      <section>
        <h3 className="text-gold-light font-bold text-lg mb-3" style={{ fontFamily: 'var(--font-heading)' }}>
          BPHS — The Foundational Text of Vedic Astrology
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          The Brihat Parashara Hora Shastra (BPHS) is the single most important text in Parashari Jyotish. Attributed to Maharishi Parashara — the father of Vyasa, who composed the Mahabharata — it is a comprehensive encyclopedia of predictive astrology spanning 97 chapters and roughly 4,000 verses in its most complete recensions.
        </p>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          The text is structured as a dialogue: the sage Parashara teaches his disciple Maitreya, who asks progressively deeper questions. This guru-shishya format mirrors the Upanishadic tradition and allows the text to build from foundational concepts (planetary nature, sign properties) to advanced techniques (conditional dashas, nabhasa yogas, remedial prescriptions).
        </p>
        <p className="text-text-secondary text-sm leading-relaxed">
          Dating BPHS precisely is difficult. The core astronomical content may originate from 1500-1200 BCE, while later chapters on remedies and certain yoga combinations were likely added over centuries. What matters for practitioners is that the system works — and its internal consistency is remarkable for a text of such scope.
        </p>
      </section>
      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5">
        <h4 className="text-gold-dark text-xs uppercase tracking-widest font-bold mb-2">The 97-Chapter Architecture</h4>
        <p className="text-text-secondary text-sm leading-relaxed mb-2">
          BPHS is organised in a logical progression. Chapters 1-2 introduce the purpose of Jyotish. Chapter 3 defines Graha (planetary) properties. Chapter 4 describes Rashi (sign) nature. Chapters 5-11 cover subsidiary charts (Shadvarga, Saptavarga). Chapters 12-25 give house-by-house results.
        </p>
        <p className="text-text-secondary text-sm leading-relaxed">
          Chapters 34-41 contain the yoga encyclopaedia — Raja Yogas, Dhana Yogas, Arishta Yogas. Chapter 46 describes the Vimshottari dasha. Chapters 51-86 cover advanced topics. The final chapters (87-97) prescribe remedial measures for every planetary affliction.
        </p>
      </section>
    </div>
  );
}

function Page2() {
  const locale = useModuleLocale();
  const isHi = isDevanagariLocale(locale);
  return (
    <div className="space-y-6">
      <section>
        <h3 className="text-gold-light font-bold text-lg mb-3" style={{ fontFamily: 'var(--font-heading)' }}>
          Surya Siddhanta — The Astronomical Masterwork
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          The Surya Siddhanta (c. 400 CE, though it may contain earlier material) is the most important astronomical text of ancient India. It calculates the sidereal year as 365 days, 6 hours, 12 minutes, and 36.56 seconds — just 1.4 seconds longer than the modern value of 365.25636 days. This astonishing accuracy was achieved without telescopes, using only naked-eye observations and mathematical models.
        </p>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          The text covers: planetary mean motions, equation of centre corrections, ecliptic and celestial coordinate systems, eclipse calculations (both solar and lunar), and the concept of precession (ayanachala). It uses a sophisticated sine table (jya) for trigonometric calculations — predating the European adoption of sine by nearly a millennium.
        </p>
        <p className="text-text-secondary text-sm leading-relaxed">
          <strong className="text-gold-light">Aryabhatiya (499 CE):</strong> Aryabhata&apos;s masterwork stated that Earth rotates on its axis (not the sky rotating around Earth) — a revolutionary idea that preceded Copernicus by over 1,000 years. He developed half-chord (ardha-jya) tables that became the sine function through Arabic transmission. His calculation of pi as 3.1416 was correct to 4 decimal places.
        </p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-emerald-500/15">
        <h4 className="text-emerald-400 text-xs uppercase tracking-widest font-bold mb-3">Pancha Siddhantika — The Five Schools Compared</h4>
        <p className="text-text-secondary text-xs leading-relaxed mb-2">
          Varahamihira (505 CE) wrote the Pancha Siddhantika, comparing five astronomical schools current in his time:
        </p>
        <p className="text-text-secondary text-xs leading-relaxed mb-1"><span className="text-gold-light font-medium">1. Surya Siddhanta:</span> Solar astronomy — planetary positions, eclipses. The most influential.</p>
        <p className="text-text-secondary text-xs leading-relaxed mb-1"><span className="text-gold-light font-medium">2. Pitamaha Siddhanta:</span> Attributed to Brahma. Earliest, least accurate.</p>
        <p className="text-text-secondary text-xs leading-relaxed mb-1"><span className="text-gold-light font-medium">3. Vasishtha Siddhanta:</span> Lunar calculations. Influenced by Babylonian methods.</p>
        <p className="text-text-secondary text-xs leading-relaxed mb-1"><span className="text-gold-light font-medium">4. Romaka Siddhanta:</span> Shows Greco-Roman influence (Romaka = Roman).</p>
        <p className="text-text-secondary text-xs leading-relaxed"><span className="text-gold-light font-medium">5. Paulisha Siddhanta:</span> Named after Paul of Alexandria. Hellenistic transmission.</p>
        <p className="text-text-secondary text-xs leading-relaxed mt-2">This comparative work demonstrates that ancient Indian astronomers were aware of and evaluated multiple traditions — they did not work in isolation.</p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5">
        <h4 className="text-gold-dark text-xs uppercase tracking-widest font-bold mb-3">Influence on Arab and European Astronomy</h4>
        <p className="text-text-secondary text-sm leading-relaxed">
          Indian astronomical texts were translated into Arabic from the 8th century CE. The word &quot;sine&quot; derives from the Arabic &quot;jayb&quot; (pocket), itself a mistranslation of the Sanskrit &quot;jya&quot; (bowstring/chord). Brahmagupta&apos;s rules for zero and negative numbers reached Europe via Arabic translations. The Kerala school of mathematics (14th-16th century) developed infinite series for trigonometric functions that preceded Newton and Leibniz by over 200 years.
        </p>
      </section>
    </div>
  );
}

function Page3() {
  const locale = useModuleLocale();
  const isHi = isDevanagariLocale(locale);
  return (
    <div className="space-y-6">
      <section>
        <h3 className="text-gold-light font-bold text-lg mb-3" style={{ fontFamily: 'var(--font-heading)' }}>
          Key BPHS Concepts and Our App
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          Every major calculation in this app traces back to a BPHS chapter. Our Graha definitions follow Chapter 3. Rashi properties from Chapter 4 determine sign lordship. House results from Chapters 12-25 power our tippanni. The Vimshottari Dasha engine (Chapter 46) calculates planetary periods. Our yoga detection (Chapters 34-41) identifies combinations like Gajakesari and Budhaditya.
        </p>
      </section>
      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5">
        <h4 className="text-gold-dark text-xs uppercase tracking-widest font-bold mb-3">Chapter Quick Reference</h4>
        <p className="text-text-secondary text-xs leading-relaxed mb-1"><span className="text-gold-light font-medium">Ch. 3 — Graha Gunadhyaya:</span> Planetary nature, caste, element, direction, deity, relationships.</p>
        <p className="text-text-secondary text-xs leading-relaxed mb-1"><span className="text-gold-light font-medium">Ch. 4 — Rashi Swarupadhyaya:</span> Sign characteristics, odd/even, movable/fixed/dual, body parts.</p>
        <p className="text-text-secondary text-xs leading-relaxed mb-1"><span className="text-gold-light font-medium">Ch. 12-25 — Bhavaphaladhyaya:</span> Results for each house — the most consulted section.</p>
        <p className="text-text-secondary text-xs leading-relaxed mb-1"><span className="text-gold-light font-medium">Ch. 34-41 — Yogadhyaya:</span> Raja Yoga, Dhana Yoga, Arishta Yoga combinations.</p>
        <p className="text-text-secondary text-xs leading-relaxed"><span className="text-gold-light font-medium">Ch. 46 — Dashadhyaya:</span> Vimshottari and other timing systems.</p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-amber-500/15">
        <h4 className="text-amber-400 text-xs uppercase tracking-widest font-bold mb-3">Worked Example — BPHS Verse in Action</h4>
        <p className="text-text-secondary text-xs leading-relaxed mb-2">
          <span className="text-gold-light font-medium">BPHS 3.14:</span> &ldquo;The Sun is the soul of all beings (Atmakaraka). The Moon is the mind. Mars is strength. Mercury is speech. Jupiter is knowledge and happiness. Venus is desire and beauty. Saturn is sorrow.&rdquo;
        </p>
        <p className="text-text-secondary text-xs leading-relaxed">
          This single verse defines how every planet is read in a chart. Sun in the 10th = the soul directed toward public life. Moon in the 4th = the mind at peace. When our tippanni describes &ldquo;Jupiter in the 5th gives learning and children,&rdquo; it traces directly to BPHS.
        </p>
      </section>
      <WhyItMatters locale={locale}>
        Understanding the source texts transforms astrology from blind rule-following into informed practice. When you know BPHS 3.14 defines planetary nature, you can evaluate conflicting interpretations by returning to the original verse. The texts are not just historical curiosities — they are the active DNA of every computation in our app.
      </WhyItMatters>
    </div>
  );
}

function Page4() {
  const locale = useModuleLocale();
  const isHi = isDevanagariLocale(locale);
  return (
    <div className="space-y-6">
      <section>
        <h3 className="text-gold-light font-bold text-lg mb-3" style={{ fontFamily: 'var(--font-heading)' }}>
          Reading the Classical Texts Today
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          For English readers, the R. Santhanam two-volume translation (Ranjan Publications) remains the standard BPHS reference. Girish Chand Sharma&rsquo;s Hindi edition is authoritative for Hindi readers. Ernst Wilhelm&rsquo;s translation takes a more interpretive approach. The verse citation format is Chapter.Verse — &ldquo;BPHS 3.14&rdquo; means Chapter 3, Verse 14.
        </p>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          <span className="text-gold-light font-medium">Beginners:</span> Start with Chapter 3 (planets) and Chapter 4 (signs). Then read Chapters 12-13 (1st and 2nd house results). This gives you enough to begin reading charts.
        </p>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          <span className="text-gold-light font-medium">Intermediate:</span> Add Chapters 34-41 (yogas) and Chapter 46 (Vimshottari Dasha). These unlock predictive capability and timing.
        </p>
        <p className="text-text-secondary text-sm leading-relaxed">
          <span className="text-gold-light font-medium">Advanced:</span> Study Chapters 66 (Ashtakavarga), the conditional dashas (47-50), and the remedial chapters (87-97).
        </p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-red-500/15">
        <h4 className="text-red-400 text-xs uppercase tracking-widest font-bold mb-3">Common Misconceptions</h4>
        <p className="text-text-secondary text-xs leading-relaxed mb-2"><span className="text-gold-light font-medium">Myth:</span> &ldquo;BPHS is a single, unified text.&rdquo; BPHS exists in multiple recensions with varying chapter counts (70 to 100+). Some chapters are clearly later additions.</p>
        <p className="text-text-secondary text-xs leading-relaxed mb-2"><span className="text-gold-light font-medium">Myth:</span> &ldquo;Indian astronomy was copied from the Greeks.&rdquo; The Rig Veda (c. 1500 BCE) contains astronomical references predating Greek astronomy. While cross-pollination occurred (as Pancha Siddhantika shows), the core nakshatra and dasha systems are indigenous.</p>
        <p className="text-text-secondary text-xs leading-relaxed"><span className="text-gold-light font-medium">Myth:</span> &ldquo;BPHS covers everything in Jyotish.&rdquo; BPHS focuses on natal astrology. Muhurta, Prashna, and Mundane astrology have their own foundational texts (Muhurta Chintamani, Prashna Marga, Brihat Samhita respectively).</p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-blue-500/15">
        <h4 className="text-blue-300 text-xs uppercase tracking-widest font-bold mb-3">Modern Relevance</h4>
        <p className="text-text-secondary text-xs leading-relaxed">
          Our app implements the precise rules from these classical texts computationally while the tippanni module adds nuanced, context-aware interpretation. See <span className="text-gold-light">Module 22.2 (Finding the Sun)</span> for how Surya Siddhanta&apos;s astronomical methods are implemented in our code, and the <span className="text-gold-light">Kundali tool</span> to see BPHS principles in action across all chart computations.
        </p>
      </section>

      <QuickCheck
        question="To within how many seconds did the Surya Siddhanta calculate the length of the sidereal year?"
        options={['About 1 minute', 'About 1.4 seconds', 'About 1 hour', 'About 10 seconds']}
        correctIndex={1}
        explanation="The Surya Siddhanta calculated the sidereal year as 365d 6h 12m 36.56s — just 1.4 seconds longer than the modern value. This was achieved without telescopes, purely through mathematical modelling."
      />
    </div>
  );
}

export default function Module16_1Page() {
  return <ModuleContainer meta={META} pages={[<Page1 key="p1" />, <Page2 key="p2" />, <Page3 key="p3" />, <Page4 key="p4" />]} questions={QUESTIONS} />;
}
