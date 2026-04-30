'use client';

import ModuleContainer, { type ModuleMeta, type ModuleQuestion, useModuleLocale } from '@/components/learn/ModuleContainer';
import { isDevanagariLocale } from '@/lib/utils/locale-fonts';
import { lt } from '@/lib/learn/translations';
import type { LocaleText } from '@/lib/learn/translations';
import L from '@/messages/learn/modules/16-1.json';

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
          BPHS is organized in a logical progression. Chapters 1-2 introduce the purpose of Jyotish. Chapter 3 defines Graha (planetary) properties. Chapter 4 describes Rashi (sign) nature. Chapters 5-11 cover subsidiary charts (Shadvarga, Saptavarga). Chapters 12-25 give house-by-house results. Chapters 26-33 handle special lagnas and strengths.
        </p>
        <p className="text-text-secondary text-sm leading-relaxed">
          Chapters 34-41 contain the yoga encyclopedia — Raja Yogas, Dhana Yogas, Arishta Yogas. Chapters 42-50 describe dasha systems (including the Vimshottari in Chapter 46). Chapters 51-86 cover advanced topics like Ashtakavarga, Longevity, and Female Horoscopy. The final chapters (87-97) prescribe remedial measures for every planetary affliction.
        </p>
      </section>
      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-emerald-500/15">
        <h4 className="text-emerald-400 text-xs uppercase tracking-widest font-bold mb-2">The Dialogue Format</h4>
        <p className="text-text-secondary text-sm leading-relaxed">
          Maitreya asks: &ldquo;O great sage, please describe the nature of the nine grahas.&rdquo; Parashara responds with systematic descriptions. This call-and-response structure is not merely literary — it signals topic transitions and marks when the text moves from one domain to another. When Maitreya says &ldquo;Please elaborate further,&rdquo; it indicates that the next section deepens the preceding topic. Understanding this structure helps modern readers navigate the text efficiently.
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
          Key BPHS Concepts and Our App
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          Every major calculation in this app traces back to a BPHS chapter. Our Graha (planet) definitions follow Chapter 3 — natural benefic/malefic status, exaltation/debilitation degrees, moolatrikona signs. Rashi properties from Chapter 4 determine sign lordship and elemental classification. House results from Chapters 12-25 power our tippanni (interpretive commentary).
        </p>
        <p className="text-text-secondary text-sm leading-relaxed">
          The Vimshottari Dasha engine (Chapter 46) calculates planetary periods from the birth nakshatra. Our yoga detection (Chapters 34-41) identifies combinations like Gajakesari, Budhaditya, Viparita Raja Yoga. The Ashtakavarga module (Chapter 66) computes bindu scores for transit assessment. In each case, we implement the classical algorithm with modern astronomical precision.
        </p>
      </section>
      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5">
        <h4 className="text-gold-dark text-xs uppercase tracking-widest font-bold mb-3">Chapter Quick Reference</h4>
        <p className="text-text-secondary text-xs leading-relaxed mb-1"><span className="text-gold-light font-medium">Ch. 3 — Graha Gunadhyaya:</span> Planetary nature, caste, element, direction, deity, relationships. The DNA of each planet.</p>
        <p className="text-text-secondary text-xs leading-relaxed mb-1"><span className="text-gold-light font-medium">Ch. 4 — Rashi Swarupadhyaya:</span> Sign characteristics, odd/even, movable/fixed/dual, body parts, directions.</p>
        <p className="text-text-secondary text-xs leading-relaxed mb-1"><span className="text-gold-light font-medium">Ch. 12-25 — Bhavaphaladhyaya:</span> Results for each house — the most consulted section for predictions.</p>
        <p className="text-text-secondary text-xs leading-relaxed mb-1"><span className="text-gold-light font-medium">Ch. 34-41 — Yogadhyaya:</span> Raja Yoga, Dhana Yoga, Arishta Yoga — combination analysis.</p>
        <p className="text-text-secondary text-xs leading-relaxed"><span className="text-gold-light font-medium">Ch. 46 — Dashadhyaya:</span> Vimshottari and other timing systems — the predictive backbone.</p>
      </section>
      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-red-500/15">
        <h4 className="text-red-400 text-xs uppercase tracking-widest font-bold mb-3">Common Pitfalls</h4>
        <p className="text-text-secondary text-xs leading-relaxed">
          BPHS verses are terse and sometimes ambiguous in Sanskrit. Different commentators interpret the same verse differently. For example, the definition of &ldquo;Yoga Karaka&rdquo; planet has subtle variations across translations. Always cross-reference multiple translations (Santhanam, Girish Chand Sharma, Ernst Wilhelm) before concluding a verse means a specific thing.
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
          Reading BPHS Today
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          For English readers, the R. Santhanam two-volume translation (Ranjan Publications) remains the standard reference. It provides verse-by-verse Sanskrit, transliteration, and commentary. Girish Chand Sharma&rsquo;s Hindi edition is authoritative for Hindi readers. Ernst Wilhelm&rsquo;s translation takes a more interpretive approach, connecting verses to practical chart reading.
        </p>
        <p className="text-text-secondary text-sm leading-relaxed">
          The verse citation format is Chapter.Verse — so &ldquo;BPHS 3.14&rdquo; means Chapter 3, Verse 14. This notation is used throughout Jyotish literature when referencing specific rules. When you encounter a claim in any astrology text, checking the BPHS reference verse often clarifies the original intent.
        </p>
      </section>
      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-emerald-500/15">
        <h4 className="text-emerald-400 text-xs uppercase tracking-widest font-bold mb-3">Which Chapters to Start With</h4>
        <p className="text-text-secondary text-xs leading-relaxed mb-2">
          <span className="text-gold-light font-medium">Beginners:</span> Start with Chapter 3 (planets) and Chapter 4 (signs). Then read Chapters 12-13 (1st and 2nd house results). This gives you enough to begin reading charts.
        </p>
        <p className="text-text-secondary text-xs leading-relaxed mb-2">
          <span className="text-gold-light font-medium">Intermediate:</span> Add Chapters 34-41 (yogas) and Chapter 46 (Vimshottari Dasha). These unlock predictive capability and timing.
        </p>
        <p className="text-text-secondary text-xs leading-relaxed">
          <span className="text-gold-light font-medium">Advanced:</span> Study Chapters 66 (Ashtakavarga), the conditional dashas (47-50), and the remedial chapters (87-97). These refine accuracy and provide actionable guidance.
        </p>
      </section>
      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-blue-500/15">
        <h4 className="text-blue-300 text-xs uppercase tracking-widest font-bold mb-3">Text vs. Practice</h4>
        <p className="text-text-secondary text-xs leading-relaxed">
          There is always a gap between textual rules and practical interpretation. BPHS gives categorical statements — &ldquo;Sun in the 7th house causes late marriage&rdquo; — but experienced astrologers know these are tendencies modified by aspects, conjunctions, sign placement, and dasha timing. The text provides the grammar; chart reading provides the poetry. Our app bridges this gap by implementing the precise rules computationally while the tippanni module adds nuanced, context-aware interpretation.
        </p>
      </section>
      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-amber-500/15">
        <h4 className="text-amber-400 text-xs uppercase tracking-widest font-bold mb-3">Worked Example — BPHS Verse in Action</h4>
        <p className="text-text-secondary text-xs leading-relaxed mb-2">
          <span className="text-gold-light font-medium">BPHS 3.14:</span> &ldquo;The Sun is the soul of all beings (Atmakaraka). The Moon is the mind. Mars is strength. Mercury is speech. Jupiter is knowledge and happiness. Venus is desire and beauty. Saturn is sorrow.&rdquo; This single verse defines how we read every planet in a chart. Sun in the 10th house = the soul directed toward public life. Moon in the 4th = the mind at peace (home). Saturn in the 7th = sorrow in partnerships.
        </p>
        <p className="text-text-secondary text-xs leading-relaxed">
          These terse definitions power every interpretation. When our tippanni describes &ldquo;Jupiter in the 5th gives learning and children,&rdquo; it traces directly to BPHS — Jupiter (knowledge/happiness) in the 5th house (children/intellect). The classical verse is the DNA; the interpretation is its phenotypic expression.
        </p>
      </section>
      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-red-500/15">
        <h4 className="text-red-400 text-xs uppercase tracking-widest font-bold mb-3">Common Misconceptions</h4>
        <p className="text-text-secondary text-xs leading-relaxed mb-2"><span className="text-gold-light font-medium">Myth:</span> &ldquo;BPHS is a single, unified text.&rdquo; Reality: BPHS exists in multiple recensions with varying chapter counts (70 to 100+). Some chapters are clearly later additions. Critical scholarship is essential.</p>
        <p className="text-text-secondary text-xs leading-relaxed mb-2"><span className="text-gold-light font-medium">Myth:</span> &ldquo;You must read BPHS in Sanskrit to understand it.&rdquo; Reality: quality English/Hindi translations with commentary (Santhanam, Girish Chand Sharma) are sufficient for practical study. Sanskrit helps for edge cases.</p>
        <p className="text-text-secondary text-xs leading-relaxed"><span className="text-gold-light font-medium">Myth:</span> &ldquo;BPHS covers everything in Jyotish.&rdquo; Reality: BPHS is focused on natal astrology. Muhurta (electional), Prashna (horary), and Mundane astrology have their own foundational texts. See Module 16.2 for Phaladeepika and Module 16.3 for Surya Siddhanta.</p>
      </section>
    </div>
  );
}

export default function Module16_1Page() {
  return <ModuleContainer meta={META} pages={[<Page1 key="p1" />, <Page2 key="p2" />, <Page3 key="p3" />]} questions={QUESTIONS} />;
}
