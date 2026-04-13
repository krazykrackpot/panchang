'use client';

import ModuleContainer, { type ModuleMeta, type ModuleQuestion, useModuleLocale } from '@/components/learn/ModuleContainer';
import ExampleChart from '@/components/learn/ExampleChart';
import { isDevanagariLocale } from '@/lib/utils/locale-fonts';
import { lt } from '@/lib/learn/translations';
import type { LocaleText } from '@/lib/learn/translations';
import L from '@/messages/learn/modules/14-1.json';

const META: ModuleMeta = {
  id: 'mod_14_1', phase: 4, topic: 'Compatibility', moduleNumber: '14.1',
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
          Kundali Milan: Matching Two Birth Charts
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          Kundali Milan is the Vedic practice of comparing two birth charts to evaluate marriage compatibility. Unlike Western compatibility which often focuses on Sun sign elements, Kundali Milan is built entirely on the Moon — specifically the Moon nakshatra of each person. The Moon represents the mind (manas), emotions, and daily temperament, making it the most relevant graha for intimacy and cohabitation.
        </p>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          There are two major classical systems. The <strong className="text-gold-light">Ashta Kuta</strong> (8-factor) system, dominant in North India, evaluates 8 compatibility dimensions and assigns a maximum of 36 points (1+2+3+4+5+6+7+8). The <strong className="text-gold-light">Dashakuta</strong> (10-factor) system, followed in South India, adds Mahendra and Vedha kutas with different weighting, and places special emphasis on Rajju (longevity of spouse) which is considered non-negotiable.
        </p>
        <p className="text-text-secondary text-sm leading-relaxed">
          The conventional minimum is <strong className="text-gold-light">18 out of 36</strong> (50%). Below this, the match is traditionally discouraged. Scores of 24+ are considered good, and 32+ excellent. However — and this is critical — the total score alone never tells the whole story. A match with 30 points but Nadi Dosha (0/8 on the most critical kuta) is often rejected, while 20 points with full Nadi and Bhakoot can be perfectly viable.
        </p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5">
        <h4 className="text-gold-dark text-xs uppercase tracking-widest font-bold mb-3">The 8 Kutas at a Glance</h4>
        <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs text-text-secondary">
          <p><span className="text-gold-light font-semibold">1. Varna (1 pt)</span> — Spiritual/ego compatibility. Brahmin, Kshatriya, Vaishya, Shudra classification by nakshatra.</p>
          <p><span className="text-gold-light font-semibold">2. Vashya (2 pts)</span> — Dominance/attraction. Which sign "controls" the other. Mutual vashya is ideal.</p>
          <p><span className="text-gold-light font-semibold">3. Tara (3 pts)</span> — Destiny compatibility. Count from bride to groom nakshatra, mod 9. Certain remainders are auspicious.</p>
          <p><span className="text-gold-light font-semibold">4. Yoni (4 pts)</span> — Physical/sexual compatibility. Each nakshatra has an animal symbol; matching checks natural affinity.</p>
          <p><span className="text-gold-light font-semibold">5. Graha Maitri (5 pts)</span> — Planetary friendship between Moon sign lords. Friends score full, enemies score zero.</p>
          <p><span className="text-gold-light font-semibold">6. Gana (6 pts)</span> — Temperament: Deva (gentle), Manushya (moderate), Rakshasa (intense). Same gana is best.</p>
          <p><span className="text-gold-light font-semibold">7. Bhakoot (7 pts)</span> — Moon sign relationship (2/12, 6/8 = dosha). Affects finances and emotional bond.</p>
          <p><span className="text-gold-light font-semibold">8. Nadi (8 pts)</span> — Constitutional type: Aadi (Vata), Madhya (Pitta), Antya (Kapha). Same = 0 = Nadi Dosha.</p>
        </div>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-red-500/15">
        <h4 className="text-red-400 text-xs uppercase tracking-widest font-bold mb-3">Why Matching Alone Does Not Guarantee Success</h4>
        <p className="text-text-secondary text-xs leading-relaxed">
          Ashta Kuta uses only the Moon nakshatra — it knows nothing about the 7th house, Venus strength, dasha alignment, or Navamsha compatibility. Think of it as checking blood group compatibility before surgery — necessary but not sufficient. Two people can score 34/36 yet have Mars afflicting each other&apos;s 7th houses, Venus debilitated in both charts, and misaligned Mahadasha periods. The Kuta score opens the door; the full chart analysis determines whether to walk through it.
        </p>
      </section>
    </div>
  );
}

/* ─── Page 2: Beyond Guna Milan — Chart Override Factors ─── */
function Page2() {
  const locale = useModuleLocale();
  const isHi = isDevanagariLocale(locale);
  return (
    <div className="space-y-6">
      <section>
        <h3 className="text-gold-light font-bold text-lg mb-3" style={{ fontFamily: 'var(--font-heading)' }}>
          Beyond Guna Milan — Chart Factors That Override Points
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          Experienced jyotishis never stop at the Kuta score. After computing the 8 kutas, they examine the full birth charts of both individuals for factors that can elevate a mediocre score or undermine an excellent one. The most important override factors involve the <strong className="text-gold-light">7th house</strong> (marriage), <strong className="text-gold-light">Venus</strong> (love, harmony), <strong className="text-gold-light">Navamsha</strong> (D-9, the marriage divisional chart), and <strong className="text-gold-light">Dasha alignment</strong>.
        </p>
        <p className="text-text-secondary text-sm leading-relaxed">
          A couple with only 18 points but both having their 7th lord in a kendra (1, 4, 7, 10) in its own sign or exalted, with Venus well-placed in both charts and harmonious Navamsha lagnas, can be far happier than a 32-point couple where both have Saturn aspecting the 7th house, debilitated Venus, and mismatched dashas running during the early marriage years.
        </p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-emerald-500/15">
        <h4 className="text-emerald-400 text-xs uppercase tracking-widest font-bold mb-3">Key Override Factors</h4>
        <p className="text-text-secondary text-xs leading-relaxed mb-2">
          <span className="text-gold-light font-medium">7th House Lord Strength:</span> The 7th lord in a kendra or trikona in good dignity (own sign, exalted, or in a friendly sign) is the single strongest indicator of marital happiness. If both partners have strong 7th lords, the marriage has a solid foundation regardless of the Kuta score.
        </p>
        <p className="text-text-secondary text-xs leading-relaxed mb-2">
          <span className="text-gold-light font-medium">Venus Dignity:</span> Venus is the natural karaka (significator) of marriage, love, and harmony. Venus in own sign (Taurus/Libra), exalted (Pisces), or well-aspected by Jupiter gives the native an innate capacity for partnership. Debilitated Venus (Virgo) or Venus conjunct malefics weakens relationship capacity.
        </p>
        <p className="text-text-secondary text-xs leading-relaxed mb-2">
          <span className="text-gold-light font-medium">Navamsha (D-9) Compatibility:</span> The D-9 chart is specifically the "marriage and dharma" chart. Compare the Navamsha lagnas — if they are in friendly signs, or if the Navamsha lagna lords are in mutual kendras, the partnership runs deep. Also check Venus placement in both D-9 charts.
        </p>
        <p className="text-text-secondary text-xs leading-relaxed">
          <span className="text-gold-light font-medium">Dasha Sandhi Alignment:</span> If one partner is running Rahu Mahadasha (restlessness, unconventional desires) while the other runs Saturn Mahadasha (restriction, discipline), the energetic mismatch creates friction. Ideally, both should be in dashas that support partnership — Venus, Jupiter, or the 7th lord dasha periods.
        </p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-blue-500/15">
        <h4 className="text-blue-300 text-xs uppercase tracking-widest font-bold mb-3">Worked Example</h4>
        <ExampleChart
          ascendant={1}
          planets={{ 10: [0], 4: [1], 9: [4] }}
          title="Aries Lagna — Sun in 10th, Moon in 4th, Jupiter in 9th"
        />
        <p className="text-text-secondary text-xs leading-relaxed mb-2">
          <span className="text-gold-light font-medium">Case A — High Score, Troubled Marriage:</span> Groom&apos;s Moon in Rohini, Bride&apos;s Moon in Hasta. Kuta score: 30/36 (excellent). But: Groom has Saturn in 7th aspecting Venus, Mars in 8th (severe Mangal Dosha). Bride has 7th lord debilitated in 12th, Rahu-Ketu across 1-7 axis. Despite the stellar Kuta score, both charts independently show marital difficulty.
        </p>
        <p className="text-text-secondary text-xs leading-relaxed">
          <span className="text-gold-light font-medium">Case B — Modest Score, Happy Marriage:</span> Kuta score: 20/36 (just acceptable). But: Both have Jupiter aspecting their 7th houses, Venus in own sign, 7th lords in kendras, and both running Jupiter Mahadasha during early marriage. The chart-level strengths compensate handsomely for the lower Kuta alignment.
        </p>
      </section>
    </div>
  );
}

/* ─── Page 3: The Matching Process Step by Step ─── */
function Page3() {
  const locale = useModuleLocale();
  const isHi = isDevanagariLocale(locale);
  return (
    <div className="space-y-6">
      <section>
        <h3 className="text-gold-light font-bold text-lg mb-3" style={{ fontFamily: 'var(--font-heading)' }}>
          The Matching Process — Step by Step
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          A thorough Kundali Milan follows a structured sequence. Skipping steps or relying only on the numerical score is the most common mistake in modern matching. Here is the classical process as practiced by experienced jyotishis:
        </p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5">
        <h4 className="text-gold-dark text-xs uppercase tracking-widest font-bold mb-3">The 5-Step Process</h4>
        <div className="space-y-3 text-xs text-text-secondary">
          <p><span className="text-gold-light font-semibold">Step 1 — Moon Nakshatra Identification:</span> From each person&apos;s birth chart, identify the exact Moon nakshatra and pada. This requires accurate birth time (at least within 2 hours for nakshatra accuracy, within 15 minutes for pada accuracy). The nakshatra pada also determines the Navamsha lagna, so precision matters.</p>
          <p><span className="text-gold-light font-semibold">Step 2 — Compute All 8 Kutas:</span> Systematically calculate each kuta from the two Moon nakshatras. Record each sub-score individually — the breakdown matters as much as the total. Pay special attention to Nadi (8 pts), Bhakoot (7 pts), and Gana (6 pts) which together account for 21 of 36 possible points.</p>
          <p><span className="text-gold-light font-semibold">Step 3 — Specific Dosha Check:</span> Even if the total is above 18, check specifically for Nadi Dosha (0/8) and Bhakoot Dosha (0/7). These two doshas have specific exceptions and cancellations. Nadi Dosha is cancelled if both Moon signs are the same. Bhakoot Dosha is cancelled by the lords of both Moon signs being friends or the same planet.</p>
          <p><span className="text-gold-light font-semibold">Step 4 — Mars Dosha (Manglik) Check:</span> Independently check both charts for Mars in 1st, 2nd, 4th, 7th, 8th, or 12th house from Lagna, Moon, and Venus. If one partner has Mangal Dosha and the other does not, this is traditionally a serious concern — covered in detail in Module 14-2.</p>
          <p><span className="text-gold-light font-semibold">Step 5 — Full Chart Assessment:</span> Evaluate 7th house lord strength, Venus placement, Navamsha compatibility, and current/upcoming dasha periods for both charts. This is where a human jyotishi adds the most value — no automated system can fully replicate the holistic judgment of an experienced practitioner.</p>
        </div>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-emerald-500/15">
        <h4 className="text-emerald-400 text-xs uppercase tracking-widest font-bold mb-3">When to Consult a Jyotishi vs. Relying on Automated Scoring</h4>
        <p className="text-text-secondary text-xs leading-relaxed mb-2">
          <span className="text-gold-light font-medium">Automated tools are sufficient when:</span> The score is clearly high (28+) with no Nadi or Bhakoot dosha, no Mangal Dosha mismatch, and both charts appear generally well-placed. In this case, the match is likely favorable and detailed analysis is confirmatory rather than diagnostic.
        </p>
        <p className="text-text-secondary text-xs leading-relaxed">
          <span className="text-gold-light font-medium">Consult a jyotishi when:</span> The score is borderline (18-24), or when specific doshas appear (Nadi 0, Bhakoot 0, Manglik mismatch), or when one partner has challenging placements (7th lord in dusthana, Saturn/Rahu in 7th). A skilled practitioner can assess cancellation conditions, dasha timing, and remedial options that no algorithm can fully evaluate.
        </p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-red-500/15">
        <h4 className="text-red-400 text-xs uppercase tracking-widest font-bold mb-3">Common Pitfalls</h4>
        <p className="text-text-secondary text-xs leading-relaxed">
          The biggest modern pitfall is treating the Kuta score like a credit score — reducing a complex multi-dimensional assessment to a single number. Families sometimes reject excellent matches because the score is 22 instead of 28, while accepting problematic ones that happen to score 30. Remember: the 8 kutas use only the Moon nakshatra. They say nothing about the ascendant, planetary yogas, dasha periods, or the hundreds of other factors that shape a life. Use the Kuta score as a screening tool, not a verdict.
        </p>
      </section>
    </div>
  );
}

export default function Module14_1Page() {
  return <ModuleContainer meta={META} pages={[<Page1 key="p1" />, <Page2 key="p2" />, <Page3 key="p3" />]} questions={QUESTIONS} />;
}
