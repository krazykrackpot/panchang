'use client';

import ModuleContainer, { type ModuleMeta, type ModuleQuestion, useModuleLocale } from '@/components/learn/ModuleContainer';
import { isDevanagariLocale } from '@/lib/utils/locale-fonts';
import { lt } from '@/lib/learn/translations';
import type { LocaleText } from '@/lib/learn/translations';
import L from '@/messages/learn/modules/14-2.json';

const META: ModuleMeta = {
  id: 'mod_14_2', phase: 4, topic: 'Compatibility', moduleNumber: '14.2',
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
      <section>
        <h3 className="text-gold-light font-bold text-lg mb-3" style={{ fontFamily: 'var(--font-heading)' }}>
          Mangal Dosha — Mars in Marriage Houses
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          Mangal Dosha (also called Kuja Dosha or being &ldquo;Manglik&rdquo;) occurs when Mars occupies the <strong className="text-gold-light">1st, 2nd, 4th, 7th, 8th, or 12th house</strong> from the Lagna (Ascendant), Moon, or Venus. Each placement affects marriage differently: Mars in 7th directly impacts the spouse relationship, Mars in 8th threatens longevity/transformation, Mars in 4th disrupts domestic peace, Mars in 1st creates an aggressive temperament, Mars in 2nd affects family harmony, and Mars in 12th impacts bedroom compatibility and expenses.
        </p>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          Traditionally, Mangal Dosha has been one of the most feared factors in Indian marriage matching. Families would reject otherwise excellent proposals if one chart showed Mars in these positions. The fear centers on an ancient belief that a Manglik person&apos;s Mars energy could endanger the spouse&apos;s health or life span, particularly when Mars occupies the 7th or 8th house.
        </p>
        <p className="text-text-secondary text-sm leading-relaxed">
          <strong className="text-gold-light">The reality is far more nuanced.</strong> When checking from all three reference points (Lagna, Moon, Venus) across 6 houses, roughly 40% of all charts show some form of Mangal Dosha. If 40% of the population were truly &ldquo;cursed,&rdquo; the institution of marriage would barely function. What Mars actually indicates is <em>passion, assertiveness, and conflict energy</em> — qualities that need channeling, not suppression.
        </p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5">
        <h4 className="text-gold-dark text-xs uppercase tracking-widest font-bold mb-3">Why These 6 Houses?</h4>
        <div className="space-y-2 text-xs text-text-secondary">
          <p><span className="text-gold-light font-semibold">1st House (Lagna):</span> Self/personality — Mars here creates an aggressive, domineering temperament that can overwhelm a partner.</p>
          <p><span className="text-gold-light font-semibold">2nd House (Dhana):</span> Family/speech — Mars here causes harsh speech, family conflicts, and financial impulsiveness.</p>
          <p><span className="text-gold-light font-semibold">4th House (Sukha):</span> Home/peace — Mars here disrupts domestic harmony, causes frequent relocations, and property disputes.</p>
          <p><span className="text-gold-light font-semibold">7th House (Kalatra):</span> Spouse/marriage — Mars here directly impacts the marriage partner, causing arguments and power struggles.</p>
          <p><span className="text-gold-light font-semibold">8th House (Ayur):</span> Longevity/secrets — Mars here is the most feared placement, traditionally linked to danger to the spouse&apos;s life span.</p>
          <p><span className="text-gold-light font-semibold">12th House (Vyaya):</span> Losses/bedroom — Mars here causes sexual incompatibility, excessive expenses, and emotional distance.</p>
        </div>
      </section>
    </div>
  );
}

/* ─── Page 2: Cancellation Conditions ─── */
function Page2() {
  const locale = useModuleLocale();
  const isHi = isDevanagariLocale(locale);
  return (
    <div className="space-y-6">
      <section>
        <h3 className="text-gold-light font-bold text-lg mb-3" style={{ fontFamily: 'var(--font-heading)' }}>
          The 6 Classical Cancellation Conditions
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          Not every Mars placement in these houses creates an active dosha. Classical texts describe specific conditions under which Mangal Dosha is cancelled (neutralized). Understanding these cancellations is essential — many charts that appear &ldquo;Manglik&rdquo; on surface scanning are actually free of active dosha when evaluated properly.
        </p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-emerald-500/15">
        <h4 className="text-emerald-400 text-xs uppercase tracking-widest font-bold mb-3">Cancellation Conditions</h4>
        <div className="space-y-3 text-xs text-text-secondary">
          <p><span className="text-gold-light font-semibold">1. Mars in Own Sign (Aries/Scorpio):</span> A planet in its own sign is dignified and behaves constructively. Mars in Aries (1st or 8th for certain lagnas) or Scorpio gives courage, leadership, and focused energy rather than destructive aggression. The &ldquo;fire&rdquo; is controlled.</p>
          <p><span className="text-gold-light font-semibold">2. Mars in Capricorn (Exalted):</span> Exalted Mars is disciplined, strategic Mars. In Capricorn, Mars&apos;s energy is channeled into ambition and achievement. This is a powerful cancellation — exalted Mars actually strengthens the chart considerably.</p>
          <p><span className="text-gold-light font-semibold">3. Jupiter Aspect on Dosha House:</span> Jupiter&apos;s aspect (5th, 7th, or 9th from Jupiter) on the house where Mars creates dosha neutralizes the malefic effect. Jupiter is the great benefic — its gaze calms Mars&apos;s aggression and brings wisdom to the marriage dynamics.</p>
          <p><span className="text-gold-light font-semibold">4. Mutual Cancellation (Both Partners Manglik):</span> When both partners have Mangal Dosha, the energies balance. Two assertive, passionate people in a relationship often find equilibrium. This is the most commonly cited and universally accepted cancellation.</p>
          <p><span className="text-gold-light font-semibold">5. Mars in Specific Nakshatras:</span> Certain nakshatras modify Mars&apos;s behaviour even in dosha houses. Mars in Jupiter-ruled nakshatras (Punarvasu, Vishakha, Purva Bhadrapada) or in the nakshatras of benefic planets is considered mitigated.</p>
          <p><span className="text-gold-light font-semibold">6. Venus/Jupiter in 7th House:</span> A strong benefic (Venus or Jupiter) occupying the 7th house in either chart provides natural protection to the marriage. The benefic presence counterbalances Mars&apos;s martial energy with grace and wisdom.</p>
        </div>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-blue-500/15">
        <h4 className="text-blue-300 text-xs uppercase tracking-widest font-bold mb-3">South Indian vs North Indian Approach</h4>
        <p className="text-text-secondary text-xs leading-relaxed">
          The South Indian tradition is considerably more conservative — it checks Mangal Dosha <strong className="text-blue-300">only from Lagna</strong>, not from Moon or Venus. This dramatically reduces the detection rate. A chart that is &ldquo;double Manglik&rdquo; by North Indian standards (Mars dosha from both Lagna and Moon) might be completely clear by South Indian assessment. Neither tradition is &ldquo;wrong&rdquo; — they represent different interpretive frameworks, and the practitioner should specify which system they follow.
        </p>
      </section>
    </div>
  );
}

/* ─── Page 3: Modern Perspective & Remedies ─── */
function Page3() {
  const locale = useModuleLocale();
  const isHi = isDevanagariLocale(locale);
  return (
    <div className="space-y-6">
      <section>
        <h3 className="text-gold-light font-bold text-lg mb-3" style={{ fontFamily: 'var(--font-heading)' }}>
          Modern Perspective and Remedies
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          Modern jyotish practitioners view Mangal Dosha through a psychological lens rather than a fatalistic one. Mars in marriage houses indicates an <strong className="text-gold-light">assertive, passionate personality</strong> with a higher-than-average potential for arguments, dominance struggles, and impulsive decisions in relationships. This energy is not inherently destructive — many highly successful marriages involve one or both Manglik partners who channel that Mars energy into shared goals, physical activity, and passionate partnership.
        </p>
        <p className="text-text-secondary text-sm leading-relaxed">
          The key insight is this: Mars dosha describes an energy pattern, not a destiny. A Manglik person who is self-aware, communicative, and willing to manage conflict constructively can have an excellent marriage. The dosha becomes problematic primarily when the person is unaware of their own assertive tendencies and when the partner is particularly passive or conflict-averse.
        </p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5">
        <h4 className="text-gold-dark text-xs uppercase tracking-widest font-bold mb-3">Traditional Remedies</h4>
        <div className="space-y-2 text-xs text-text-secondary">
          <p><span className="text-gold-light font-semibold">Kumbha Vivah:</span> A symbolic marriage to a clay pot (kumbha), peepal tree, or Vishnu idol performed before the actual wedding. The first &ldquo;marriage&rdquo; absorbs the Mars energy, and the pot is then immersed in water. This is the most well-known remedy and is considered highly effective in traditional practice.</p>
          <p><span className="text-gold-light font-semibold">Mangal Puja on Tuesdays:</span> Regular worship of Mars (Mangal) on Tuesdays, including recitation of Mangal mantras, offering red items (kumkum, red flowers, red lentils) at a Hanuman temple. The discipline of weekly observance channels Mars energy into devotion.</p>
          <p><span className="text-gold-light font-semibold">Red Coral (Moonga):</span> Wearing red coral on the ring finger in gold or copper — but ONLY after complete chart analysis. If Mars is a functional malefic for the lagna (e.g., for Virgo or Gemini ascendant), strengthening Mars can be counterproductive. Always consult a qualified jyotishi before wearing any planetary gemstone.</p>
          <p><span className="text-gold-light font-semibold">Charity and Fasting:</span> Donating red items on Tuesdays (red lentils, jaggery, copper vessels). Fasting on Tuesdays (Mangalvar Vrat) is also traditional. These practices sublimate Mars energy into spiritual discipline and compassion.</p>
        </div>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-red-500/15">
        <h4 className="text-red-400 text-xs uppercase tracking-widest font-bold mb-3">When Both Partners Have Dosha</h4>
        <p className="text-text-secondary text-xs leading-relaxed mb-2">
          The principle of mutual cancellation is beautifully logical: two equally assertive people in a relationship create balance through equal footing. Neither partner overwhelms the other. The Mars energy, instead of being one-sided (one person always pushing, the other always retreating), becomes a shared dynamic of passion, healthy competition, and mutual respect for boundaries.
        </p>
        <p className="text-text-secondary text-xs leading-relaxed">
          In practice, couples where both partners are Manglik often report high passion, intense but quickly-resolved arguments, and a deep physical connection. The relationship is rarely boring — which is Mars&apos;s gift. The traditional wisdom of &ldquo;two negatives making a positive&rdquo; is, in this case, psychologically sound.
        </p>
      </section>
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
          Severity Grading &mdash; Not All Mangal Doshas Are Equal
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          Traditional practice treats Mangal Dosha as binary &mdash; present or absent. Modern practitioners grade severity from mild to severe based on the specific house and reference point. Mars in the 1st house from Lagna (aggressive personality) is milder than Mars in the 7th (direct spouse impact) or 8th (longevity concern). Mars detected only from Moon but not from Lagna is weaker than Mars detected from both. The most severe form: Mars in the 8th house from Lagna AND Moon, without any cancellation condition.
        </p>
        <p className="text-text-secondary text-sm leading-relaxed">
          Our matching engine implements a 3-tier severity model: <strong className="text-gold-light">Mild</strong> (Mars in 1st or 2nd from one reference point, with cancellation), <strong className="text-gold-light">Moderate</strong> (Mars in 4th, 7th, or 12th without full cancellation), and <strong className="text-gold-light">Severe</strong> (Mars in 7th or 8th from multiple reference points without cancellation). Mild dosha is noted but does not reduce the Ashta Kuta score. Moderate reduces by 2-3 points. Severe triggers a special advisory.
        </p>
      </section>
      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-amber-500/15">
        <h4 className="text-amber-400 text-xs uppercase tracking-widest font-bold mb-3">Worked Example &mdash; Matching Two Charts</h4>
        <p className="text-text-secondary text-xs leading-relaxed mb-2">
          <span className="text-gold-light font-medium">Person A (Scorpio Lagna):</span> Mars in 4th house (Aquarius) from Lagna. Mars is the Lagna lord (Scorpio) &mdash; own-sign cancellation does not apply here since Mars is in Aquarius (Saturn&apos;s sign). Jupiter aspects Mars from the 10th house. Result: Mangal Dosha present from Lagna, but <strong className="text-gold-light">cancelled</strong> by Jupiter&apos;s aspect. Severity: Nil after cancellation.
        </p>
        <p className="text-text-secondary text-xs leading-relaxed mb-2">
          <span className="text-gold-light font-medium">Person B (Gemini Lagna):</span> Mars in 7th house (Sagittarius) from Lagna. No Jupiter aspect on Mars. Mars also in 7th from Moon (Moon in Gemini). No cancellation conditions met. Severity: <strong className="text-red-400">Severe</strong> (7th from both Lagna and Moon, no cancellation).
        </p>
        <p className="text-text-secondary text-xs leading-relaxed">
          <span className="text-gold-light font-medium">Matching verdict:</span> Person A has no active dosha. Person B has severe dosha. The &ldquo;both partners Manglik&rdquo; cancellation does NOT apply because A&apos;s dosha is already cancelled. Traditional advice: proceed with caution, consider Kumbha Vivah for Person B, and prioritize communication skills in the relationship.
        </p>
      </section>
      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-red-500/15">
        <h4 className="text-red-400 text-xs uppercase tracking-widest font-bold mb-3">Additional Misconceptions</h4>
        <p className="text-text-secondary text-xs leading-relaxed mb-2"><span className="text-gold-light font-medium">Myth:</span> &ldquo;Mangal Dosha disappears after age 28.&rdquo; Some traditions claim this, but it has no basis in classical texts. Mars&rsquo;s placement in the chart does not change with age. What does change is the native&rsquo;s maturity and self-awareness, which can mitigate the behavioural expressions of Mars energy.</p>
        <p className="text-text-secondary text-xs leading-relaxed"><span className="text-gold-light font-medium">Myth:</span> &ldquo;A Manglik person must only marry another Manglik.&rdquo; Mutual cancellation is ONE of six conditions. Jupiter&rsquo;s aspect, Mars in own/exalted sign, or benefic conjunction can each independently cancel the dosha. Insisting on Manglik-only matching unnecessarily restricts the partner pool. See Module 14.1 for Ashta Kuta scoring and Module 14.3 for Nadi and Gana compatibility.</p>
      </section>
      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-emerald-500/15">
        <h4 className="text-emerald-400 text-xs uppercase tracking-widest font-bold mb-3">Practical Application &mdash; What to Do If You Have Mangal Dosha</h4>
        <p className="text-text-secondary text-xs leading-relaxed mb-2"><span className="text-gold-light font-medium">Step 1:</span> Verify with our Kundali tool. Check from all three reference points (Lagna, Moon, Venus). Note which cancellation conditions, if any, apply.</p>
        <p className="text-text-secondary text-xs leading-relaxed mb-2"><span className="text-gold-light font-medium">Step 2:</span> If active (no cancellation), assess severity. Mars in 1st or 2nd is milder than 7th or 8th. Mars aspected by benefics is milder than unaspected.</p>
        <p className="text-text-secondary text-xs leading-relaxed"><span className="text-gold-light font-medium">Step 3:</span> For severe cases, traditional remedies (Kumbha Vivah, Mangal Puja) provide psychological comfort and spiritual discipline. Modern remedies: channel Mars energy through physical activity, competitive careers, and developing conscious communication skills in relationships.</p>
      </section>
    </div>
  );
}

export default function Module14_2Page() {
  return <ModuleContainer meta={META} pages={[<Page1 key="p1" />, <Page2 key="p2" />, <Page3 key="p3" />, <Page4 key="p4" />]} questions={QUESTIONS} />;
}
