'use client';

import ModuleContainer, { type ModuleMeta, type ModuleQuestion, useModuleLocale } from '@/components/learn/ModuleContainer';
import { isDevanagariLocale } from '@/lib/utils/locale-fonts';
import { lt } from '@/lib/learn/translations';
import type { LocaleText } from '@/lib/learn/translations';
import L from '@/messages/learn/modules/17-4.json';
import QuickCheck from '@/components/learn/QuickCheck';
import WhyItMatters from '@/components/learn/WhyItMatters';
import KeyTakeaway from '@/components/learn/KeyTakeaway';

const META: ModuleMeta = {
  id: 'mod_17_4', phase: 5, topic: 'Muhurta', moduleNumber: '17.4',
  title: L.title as unknown as ModuleMeta['title'],
  subtitle: L.subtitle as unknown as ModuleMeta['subtitle'],
  estimatedMinutes: 15,
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
          'Vidyarambha (beginning education) favours Wednesday (Mercury) and Thursday (Jupiter) — the planets of intellect and wisdom.',
          'Auspicious nakshatras for education: Ashwini, Pushya, Hasta, Chitra, Shravana, Dhanishtha, Shatabhisha, Revati.',
          'Vasanta Panchami and Akshaya Tritiya are self-auspicious days requiring no additional muhurta calculation.',
        ]}
        locale={locale}
      />
      <section>
        <h3 className="text-gold-light font-bold text-lg mb-3" style={{ fontFamily: 'var(--font-heading)' }}>
          Vidyarambha — Beginning Education
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          Vidyarambha (&ldquo;beginning of knowledge&rdquo;) is the ceremony marking a child&rsquo;s formal introduction to learning. Traditionally, the child writes their first letters — often &ldquo;Om&rdquo; or the name of Saraswati — on a plate of rice or a slate. The Muhurta for this event shapes the child&rsquo;s relationship with education throughout their life.
        </p>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          Wednesday (Mercury&rsquo;s day — intellect, communication, analytical ability) and Thursday (Jupiter&rsquo;s day — wisdom, higher knowledge, the guru principle) are the ideal weekdays. Mercury or Jupiter should be strong in the Muhurta chart — not debilitated, combust, or placed in dusthana houses (6th, 8th, 12th).
        </p>
        <p className="text-text-secondary text-sm leading-relaxed">
          The 2nd house (speech, early learning) and 5th house (intelligence, creativity, higher learning) should be emphasised — with benefic planets or aspects. The recommended nakshatras are: Ashwini (quick learning), Pushya (nourishment of knowledge), Hasta (manual skill, writing), Shravana (listening, the Vedic learning method), Dhanishtha (mastery), Punarvasu (renewal, returning to knowledge), and Revati (completion of learning).
        </p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5">
        <h4 className="text-gold-dark text-xs uppercase tracking-widest font-bold mb-2">Complete Nakshatra Suitability for Education</h4>
        <div className="space-y-2">
          <p className="text-text-secondary text-xs leading-relaxed"><span className="text-emerald-400 font-medium">Excellent:</span> Pushya (Saturn — disciplined learning), Hasta (Moon — dexterous, writing), Shravana (Moon — listening/Vedic study), Revati (Mercury — completeness).</p>
          <p className="text-text-secondary text-xs leading-relaxed"><span className="text-emerald-400 font-medium">Good:</span> Ashwini (Ketu — quick grasp), Chitra (Mars — creative brilliance), Dhanishtha (Mars — mastery), Shatabhisha (Rahu — scientific mind), Punarvasu (Jupiter — renewal).</p>
          <p className="text-text-secondary text-xs leading-relaxed"><span className="text-amber-400 font-medium">Acceptable:</span> Rohini (Moon — steady), Mrigashira (Mars — curious), Swati (Rahu — independent thinking), Anuradha (Saturn — devoted study).</p>
          <p className="text-text-secondary text-xs leading-relaxed"><span className="text-red-400 font-medium">Avoid:</span> Bharani (death/transformation), Ashlesha (deception), Magha (ancestral, not learning-focused), Jyeshtha (conflict), Mula (uprooting).</p>
        </div>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-emerald-500/15">
        <h4 className="text-emerald-400 text-xs uppercase tracking-widest font-bold mb-2">Vasanta Panchami — The Supreme Day</h4>
        <p className="text-text-secondary text-sm leading-relaxed">
          Vasanta Panchami (Shukla Panchami of Magha month, usually in late January or February) is the festival of Saraswati and the most auspicious day for Vidyarambha. It is considered a swayam-siddha muhurta — self-auspicious, requiring no additional Muhurta calculation. Similarly, Akshaya Tritiya (Shukla Tritiya of Vaishakha) is another self-auspicious day where any activity started yields lasting results. Many families specifically wait for one of these days.
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
          The Role of Mercury and Jupiter in Education Muhurta
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          Mercury (Budha) governs analytical intelligence, communication, writing, and mathematical ability. Jupiter (Guru) governs wisdom, higher knowledge, philosophy, and the teacher-student relationship. For education muhurta, these two planets are the primary significators. Their condition in the muhurta chart determines the quality of the educational beginning.
        </p>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          <strong className="text-gold-light">Mercury requirements:</strong> Mercury should not be combust (within 14° of the Sun, or 12° if retrograde). Mercury should ideally be in a friendly or own sign (Gemini, Virgo). Mercury in the 1st, 2nd, 4th, 5th, 9th, or 10th house of the muhurta chart is favourable. Mercury conjunct or aspected by Jupiter is the ideal combination — intellect illuminated by wisdom.
        </p>
        <p className="text-text-secondary text-sm leading-relaxed">
          <strong className="text-gold-light">Jupiter requirements:</strong> Jupiter should not be combust or retrograde (though some texts accept retrograde Jupiter for educational purposes). Jupiter in the 1st, 5th, or 9th house is excellent. Jupiter aspecting the 2nd house (speech) or 5th house (intelligence) strengthens the educational potential. The Jupiter-Mercury conjunction or mutual aspect is the single most auspicious combination for education muhurta.
        </p>
        <WhyItMatters locale={locale}>
          Mercury without Jupiter produces cleverness without wisdom. Jupiter without Mercury produces knowledge without the ability to communicate it. The ideal education muhurta has both planets strong and connected — creating the conditions for a child who is both intelligent and wise.
        </WhyItMatters>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5">
        <h4 className="text-gold-dark text-xs uppercase tracking-widest font-bold mb-3">Vidyarambha Timing Rules Summary</h4>
        <p className="text-text-secondary text-xs leading-relaxed mb-1"><span className="text-gold-light font-medium">Best days:</span> Wednesday (Mercury) or Thursday (Jupiter). Monday acceptable.</p>
        <p className="text-text-secondary text-xs leading-relaxed mb-1"><span className="text-gold-light font-medium">Avoid:</span> Tuesday (Mars — aggression), Saturday (Saturn — obstruction for beginnings).</p>
        <p className="text-text-secondary text-xs leading-relaxed mb-1"><span className="text-gold-light font-medium">Tithi:</span> Shukla Paksha preferred. Nanda (1, 6, 11) and Bhadra (2, 7, 12) tithis ideal. Avoid Rikta (4, 9, 14).</p>
        <p className="text-text-secondary text-xs leading-relaxed mb-1"><span className="text-gold-light font-medium">Yoga:</span> Avoid Vyatipata, Vaidhriti, Vishkambha, Parigha. Siddhi and Shubha yogas are excellent.</p>
        <p className="text-text-secondary text-xs leading-relaxed mb-1"><span className="text-gold-light font-medium">Karana:</span> Avoid Vishti (Bhadra). Bava, Balava, and Taitila are preferred.</p>
        <p className="text-text-secondary text-xs leading-relaxed"><span className="text-gold-light font-medium">Time:</span> Morning hours preferred. Mercury hora or Jupiter hora ideal. Avoid Rahu Kaal and Yamaganda.</p>
      </section>

      <QuickCheck
        question="Which two planets are the primary significators for education muhurta?"
        options={['Sun and Moon', 'Mars and Saturn', 'Mercury and Jupiter', 'Venus and Rahu']}
        correctIndex={2}
        explanation="Mercury governs analytical intelligence and communication; Jupiter governs wisdom and the guru principle. Their combined strength in the muhurta chart determines the quality of the educational beginning."
      />
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
          Namakarana and Upanayana — Related Education Samskaras
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          <strong className="text-gold-light">Namakarana</strong> (naming ceremony) is performed on the 11th or 12th day after birth. The name&rsquo;s first syllable is determined by the birth nakshatra&rsquo;s pada — each nakshatra has 4 padas, each assigned a specific syllable. This creates 108 unique syllables (27 x 4), mirroring the sacred number 108. Our <span className="text-gold-light">baby-names tool</span> implements this syllable mapping.
        </p>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          <strong className="text-gold-light">Upanayana</strong> (sacred thread ceremony) marks the beginning of formal Vedic study. Requirements: Sun in Uttarayana (January-June), Shukla Paksha, suitable nakshatra (Hasta, Chitra, Swati, Pushya, Dhanishtha, Shravana), strong Jupiter and Sun. The ceremony initiates the child into the Gayatri mantra and the guru-shishya tradition.
        </p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-emerald-500/15">
        <h4 className="text-emerald-400 text-xs uppercase tracking-widest font-bold mb-3">Nakshatra Syllable Examples</h4>
        <p className="text-text-secondary text-xs leading-relaxed mb-1"><span className="text-gold-light font-medium">Ashwini:</span> Chu, Che, Cho, La</p>
        <p className="text-text-secondary text-xs leading-relaxed mb-1"><span className="text-gold-light font-medium">Bharani:</span> Li, Lu, Le, Lo</p>
        <p className="text-text-secondary text-xs leading-relaxed mb-1"><span className="text-gold-light font-medium">Krittika:</span> A, I, U, E</p>
        <p className="text-text-secondary text-xs leading-relaxed mb-1"><span className="text-gold-light font-medium">Rohini:</span> O, Va, Vi, Vu</p>
        <p className="text-text-secondary text-xs leading-relaxed"><span className="text-gold-light font-medium">Mrigashira:</span> Ve, Vo, Ka, Ki</p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-red-500/15">
        <h4 className="text-red-400 text-xs uppercase tracking-widest font-bold mb-3">Common Misconceptions</h4>
        <p className="text-text-secondary text-xs leading-relaxed mb-2">
          <span className="text-gold-light font-medium">Myth:</span> &quot;Any Thursday is automatically good for starting education.&quot; Thursday provides the vara benefit, but if Vishti karana or Vyatipata yoga is active, or Rahu Kaal falls during the ceremony, the overall muhurta is unfavourable. All five Panchang elements must be checked.
        </p>
        <p className="text-text-secondary text-xs leading-relaxed">
          <span className="text-gold-light font-medium">Myth:</span> &quot;Vidyarambha is only for young children.&quot; While traditionally performed at age 3-5, the muhurta principles apply to any significant educational beginning — starting university, beginning a professional course, or initiating self-study of a new subject. Adults can apply the same timing rules.
        </p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-blue-500/15">
        <h4 className="text-blue-300 text-xs uppercase tracking-widest font-bold mb-3">Modern Relevance</h4>
        <p className="text-text-secondary text-xs leading-relaxed">
          In contemporary practice, Vidyarambha is widely observed across India, especially in South India (where it is called Vijayadashami Ezhuthiniruthu in Kerala). The core muhurta requirements — strong Mercury and Jupiter, favourable nakshatra, absence of Vishti and Rahu Kaal — remain universally followed. Our <span className="text-gold-light">Muhurta AI tool</span> includes &quot;Education&quot; as a selectable activity, automatically applying all these classical rules to find the best window. See also <span className="text-gold-light">Module 8.1 (Muhurta Basics)</span> for how all Panchang elements integrate into muhurta selection.
        </p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5">
        <h4 className="text-gold-dark text-xs uppercase tracking-widest font-bold mb-3">Upanayana Requirements Summary</h4>
        <p className="text-text-secondary text-xs leading-relaxed mb-1"><span className="text-gold-light font-medium">Season:</span> Uttarayana (January-June). Avoid Dakshinayana.</p>
        <p className="text-text-secondary text-xs leading-relaxed mb-1"><span className="text-gold-light font-medium">Paksha:</span> Shukla Paksha preferred. Avoid Amavasya and Rikta tithis (4th, 9th, 14th).</p>
        <p className="text-text-secondary text-xs leading-relaxed mb-1"><span className="text-gold-light font-medium">Nakshatras:</span> Hasta, Chitra, Swati, Pushya, Dhanishtha, Shravana.</p>
        <p className="text-text-secondary text-xs leading-relaxed mb-1"><span className="text-gold-light font-medium">Avoid:</span> Rahu Kaal, Vishti karana, Vyatipata/Vaidhriti yoga, Panchaka.</p>
        <p className="text-text-secondary text-xs leading-relaxed mb-1"><span className="text-gold-light font-medium">Planets:</span> Jupiter and Sun strong. Mercury well-placed for intellectual growth.</p>
        <p className="text-text-secondary text-xs leading-relaxed"><span className="text-gold-light font-medium">Age:</span> Traditionally 8-12 years. Modern practice: any age before marriage. Some perform it just before the wedding as a combined samskara.</p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-emerald-500/15">
        <h4 className="text-emerald-400 text-xs uppercase tracking-widest font-bold mb-3">Worked Example — Finding a Vidyarambha Date</h4>
        <p className="text-text-secondary text-xs leading-relaxed mb-2"><span className="text-gold-light font-medium">Task:</span> Find a Vidyarambha date in February 2026 for Vevey, Switzerland.</p>
        <p className="text-text-secondary text-xs leading-relaxed mb-1"><span className="text-gold-light font-medium">Step 1:</span> Vasanta Panchami falls around 4 February 2026. This is a self-auspicious day — no further muhurta calculation needed. If the family can use this date, it is ideal.</p>
        <p className="text-text-secondary text-xs leading-relaxed mb-1"><span className="text-gold-light font-medium">Step 2:</span> If another date is needed, scan February for Wednesday/Thursday when Moon is in Pushya, Hasta, or Shravana.</p>
        <p className="text-text-secondary text-xs leading-relaxed mb-1"><span className="text-gold-light font-medium">Step 3:</span> Verify: Shukla Paksha, no Vishti karana, no Vyatipata yoga, Mercury/Jupiter not combust.</p>
        <p className="text-text-secondary text-xs leading-relaxed"><span className="text-gold-light font-medium">Step 4:</span> Select Jupiter hora or Mercury hora within the chosen day. Avoid Rahu Kaal (which varies by weekday and location).</p>
      </section>

      <QuickCheck
        question="What makes Vasanta Panchami special for educational beginnings?"
        options={['It is Mercury\'s birthday', 'It is a self-auspicious (swayam-siddha) muhurta for Saraswati', 'It falls during a solar eclipse', 'Mercury is always exalted on this date']}
        correctIndex={1}
        explanation="Vasanta Panchami is the festival of Saraswati (goddess of knowledge) and is considered a swayam-siddha muhurta — self-auspicious, requiring no additional muhurta calculation for educational activities."
      />
    </div>
  );
}

export default function Module17_4Page() {
  return <ModuleContainer meta={META} pages={[<Page1 key="p1" />, <Page2 key="p2" />, <Page3 key="p3" />]} questions={QUESTIONS} />;
}
