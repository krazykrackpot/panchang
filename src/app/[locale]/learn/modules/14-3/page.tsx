'use client';

import ModuleContainer, { type ModuleMeta, type ModuleQuestion, useModuleLocale } from '@/components/learn/ModuleContainer';
import { isDevanagariLocale } from '@/lib/utils/locale-fonts';
import { lt } from '@/lib/learn/translations';
import type { LocaleText } from '@/lib/learn/translations';
import L from '@/messages/learn/modules/14-3.json';

const META: ModuleMeta = {
  id: 'mod_14_3', phase: 4, topic: 'Compatibility', moduleNumber: '14.3',
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
          Marriage Timing Indicators
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          One of the most frequently asked questions in Jyotish is &ldquo;When will I get married?&rdquo; The answer lies in the convergence of two systems: <strong className="text-gold-light">Dashas</strong> (planetary periods that unfold the karma) and <strong className="text-gold-light">Transits</strong> (current planetary positions that trigger events). Marriage occurs when both the dasha and transit simultaneously activate the 7th house or its lord.
        </p>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          The primary dasha indicators for marriage are: the Mahadasha or Antardasha of the <strong className="text-gold-light">7th house lord</strong>, <strong className="text-gold-light">Venus</strong> (natural karaka of marriage and love), or the <strong className="text-gold-light">Navamsha Lagna lord</strong> (ruler of the D-9 marriage chart). When any of these dasha periods are running, the native&apos;s life is karmically primed for partnership events.
        </p>
        <p className="text-text-secondary text-sm leading-relaxed">
          On the transit side, the most powerful trigger is the <strong className="text-gold-light">double transit</strong> — Jupiter AND Saturn both influencing the 7th house (by conjunction, aspect, or transit through the sign) simultaneously. Jupiter brings the opportunity and blessing; Saturn provides the commitment, formalization, and societal recognition. When dasha alignment meets double transit on the 7th, marriage becomes highly probable within that window.
        </p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5">
        <h4 className="text-gold-dark text-xs uppercase tracking-widest font-bold mb-3">Key Timing Combinations</h4>
        <div className="space-y-2 text-xs text-text-secondary">
          <p><span className="text-gold-light font-semibold">Jupiter Transit 7th from Moon/Lagna:</span> Creates a 12-month window of opportunity. Jupiter expands whatever it touches — in the 7th, it expands partnership possibilities, brings proposals, and creates auspiciousness around marriage.</p>
          <p><span className="text-gold-light font-semibold">Saturn Transit 7th or Aspecting 7th:</span> Saturn&apos;s involvement brings seriousness, commitment, and formalization. While Jupiter might bring a joyful meeting, Saturn makes it official — the engagement, the ceremony, the legal registration.</p>
          <p><span className="text-gold-light font-semibold">Venus Return/Transit:</span> Venus transiting over the natal 7th house cusp or its own natal position can trigger the precise date within a broader dasha+transit window. Venus moves quickly (about 1 sign/month), so it acts as the fine-tuning trigger.</p>
          <p><span className="text-gold-light font-semibold">Dasha-Antardasha Precision:</span> The Mahadasha sets the theme (e.g., Venus Mahadasha = relationship focus), and the Antardasha provides the specific timing. Venus-Jupiter, Jupiter-Venus, or 7th lord-Venus antardasha are classic marriage combinations.</p>
        </div>
      </section>
    </div>
  );
}

/* ─── Page 2: Delay Indicators ─── */
function Page2() {
  const locale = useModuleLocale();
  const isHi = isDevanagariLocale(locale);
  return (
    <div className="space-y-6">
      <section>
        <h3 className="text-gold-light font-bold text-lg mb-3" style={{ fontFamily: 'var(--font-heading)' }}>
          Delay Indicators — Why Marriage Waits
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          Delayed marriage is not a defect — it is a timing pattern. Several chart factors consistently correlate with marriage occurring later than the social norm. Understanding these factors helps manage expectations and identify when the window will eventually open.
        </p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-emerald-500/15">
        <h4 className="text-emerald-400 text-xs uppercase tracking-widest font-bold mb-3">Common Delay Factors</h4>
        <div className="space-y-3 text-xs text-text-secondary">
          <p><span className="text-gold-light font-semibold">Saturn Aspect on 7th House or Venus:</span> Saturn is the planet of delay, discipline, and maturation. Its 3rd, 7th, or 10th aspect falling on the 7th house or on Venus pushes marriage into the late 20s or early 30s. The upside: Saturn-delayed marriages tend to be more mature and stable once they happen.</p>
          <p><span className="text-gold-light font-semibold">7th Lord in Dusthana (6/8/12):</span> The 7th lord in the 6th house brings conflicts around partnerships, in the 8th creates hidden obstacles and transformative experiences before marriage, in the 12th may indicate a spouse from a distant place or losses through partnerships. Each has its own timing window — the 7th lord&apos;s dasha often opens the door.</p>
          <p><span className="text-gold-light font-semibold">Rahu in the 7th House:</span> Rahu here creates unconventional desires — the person may be attracted to foreigners, people from different backgrounds, or may resist the traditional marriage framework. Marriage typically happens after the Rahu dasha/antardasha completes, or during it if the partner is unconventional enough to satisfy Rahu&apos;s craving for the unusual.</p>
          <p><span className="text-gold-light font-semibold">Venus Combust or Debilitated:</span> Venus within 6 degrees of the Sun (combust) has its relationship significations burned away temporarily. Venus in Virgo (debilitated) creates excessive analysis and perfectionism in choosing a partner. Both delay marriage but through different mechanisms — combustion through lack of opportunity, debilitation through excessive selectivity.</p>
        </div>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-red-500/15">
        <h4 className="text-red-400 text-xs uppercase tracking-widest font-bold mb-3">Timing Windows for Each Delay Factor</h4>
        <div className="space-y-2 text-xs text-text-secondary">
          <p><span className="text-gold-light font-semibold">Saturn Delays:</span> Usually resolve by early 30s, when Saturn has completed its first return (age ~29.5). After the Saturn return, the native has matured enough to handle the commitment Saturn demands.</p>
          <p><span className="text-gold-light font-semibold">Rahu Delays:</span> Clear when the Rahu dasha ends or when Rahu transit moves away from the 7th house. If Rahu Mahadasha runs in the 20s, marriage often occurs in the subsequent Jupiter or Saturn dasha.</p>
          <p><span className="text-gold-light font-semibold">7th Lord in Dusthana:</span> The 7th lord&apos;s own Mahadasha or Antardasha creates the window — even from a dusthana, the 7th lord activating itself brings marriage events. The nature may be unconventional, but the event occurs.</p>
          <p><span className="text-gold-light font-semibold">Debilitated Venus:</span> Neecha Bhanga (cancellation of debilitation) conditions or Venus dasha period can override the debilitation. Also, when Venus transits its exaltation sign (Pisces) annually, it creates a temporary activation window.</p>
        </div>
      </section>
    </div>
  );
}

/* ─── Page 3: Post-Marriage Predictions ─── */
function Page3() {
  const locale = useModuleLocale();
  const isHi = isDevanagariLocale(locale);
  return (
    <div className="space-y-6">
      <section>
        <h3 className="text-gold-light font-bold text-lg mb-3" style={{ fontFamily: 'var(--font-heading)' }}>
          Post-Marriage Predictions — Life After the Wedding
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          Vedic astrology does not stop at predicting <em>when</em> marriage happens — it also maps the quality, challenges, and evolution of the marriage over time. The <strong className="text-gold-light">Navamsha (D-9)</strong> chart becomes the primary reference for post-marriage life, supplemented by ongoing dasha and transit analysis.
        </p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5">
        <h4 className="text-gold-dark text-xs uppercase tracking-widest font-bold mb-3">Navamsha — The Marriage Chart</h4>
        <div className="space-y-2 text-xs text-text-secondary">
          <p><span className="text-gold-light font-semibold">Spouse Personality:</span> The 7th house of the Navamsha, its lord, and planets occupying it describe the spouse&apos;s character. Jupiter in Navamsha 7th indicates a wise, dharmic spouse. Venus there indicates a beautiful, artistic partner. Mars indicates a passionate, assertive one.</p>
          <p><span className="text-gold-light font-semibold">Navamsha Lagna Lord:</span> This planet&apos;s strength and placement reveals the overall quality of the marriage. Strong Navamsha lagna lord in a kendra/trikona = the marriage is a source of strength. Weak or afflicted = the marriage requires more effort and conscious work.</p>
          <p><span className="text-gold-light font-semibold">Vargottama Planets:</span> Planets that occupy the same sign in both Rashi (D-1) and Navamsha (D-9) are called Vargottama and are strengthened. A Vargottama Venus or 7th lord is an exceptionally positive sign for marriage quality.</p>
        </div>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-emerald-500/15">
        <h4 className="text-emerald-400 text-xs uppercase tracking-widest font-bold mb-3">Family Expansion and Children</h4>
        <div className="space-y-2 text-xs text-text-secondary">
          <p><span className="text-gold-light font-semibold">2nd House — Family Growth:</span> The 2nd house governs family expansion after marriage. Its lord&apos;s dasha and Jupiter transit over the 2nd indicate periods when the family grows — through children, in-laws moving in, or other additions to the household.</p>
          <p><span className="text-gold-light font-semibold">5th House — Children Timing:</span> The 5th house (Putra Bhava) is the primary indicator. The 5th lord&apos;s dasha, Jupiter transiting over the 5th, and the Saptamsha (D-7) chart together indicate when children are likely. Jupiter-5th lord connections in dasha and transit are the strongest conception indicators.</p>
          <p><span className="text-gold-light font-semibold">Saptamsha (D-7):</span> This divisional chart specifically governs progeny. The condition of the 5th house and its lord in the D-7 reveals the ease or difficulty of having children, and the overall relationship with offspring.</p>
        </div>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-red-500/15">
        <h4 className="text-red-400 text-xs uppercase tracking-widest font-bold mb-3">Challenging Periods in Marriage</h4>
        <div className="space-y-2 text-xs text-text-secondary">
          <p><span className="text-gold-light font-semibold">7th Lord Dasha in Dusthana:</span> When the 7th lord&apos;s dasha runs and it is placed in the 6th (conflicts), 8th (crises/transformation), or 12th (separation/distance), the marriage undergoes testing. This does not mean divorce — it means the marriage faces its growth edges.</p>
          <p><span className="text-gold-light font-semibold">Saturn Transit Over Venus:</span> This 2.5-year transit creates emotional coolness, practical pressures, and a &ldquo;reality check&rdquo; on the romance. Couples who communicate through this period emerge stronger; those who avoid difficult conversations may drift apart.</p>
          <p><span className="text-gold-light font-semibold">Rahu-Ketu Axis on 1-7:</span> When Rahu-Ketu transit the 1st-7th house axis (occurs every ~18 years), it creates 18 months of relationship intensity — obsessive patterns, external temptations, or fundamental questioning of the partnership. This is a transformation trigger, not necessarily a destruction signal.</p>
        </div>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-blue-500/15">
        <h4 className="text-blue-300 text-xs uppercase tracking-widest font-bold mb-3">Remedies for Marital Harmony</h4>
        <p className="text-text-secondary text-xs leading-relaxed mb-2">
          <span className="text-gold-light font-medium">Venus Strengthening:</span> Wearing white/cream on Fridays, offering white flowers to Lakshmi, reciting Shukra mantras. If Venus is a functional benefic for the lagna, wearing a diamond or white sapphire (after chart analysis) strengthens the love and harmony signification.
        </p>
        <p className="text-text-secondary text-xs leading-relaxed mb-2">
          <span className="text-gold-light font-medium">7th House Remedies:</span> Worship of the deity associated with the 7th lord. If the 7th lord is Jupiter, Brihaspati puja on Thursdays. If it is Venus, Lakshmi puja on Fridays. If it is Saturn, Shani puja on Saturdays with black sesame donations.
        </p>
        <p className="text-text-secondary text-xs leading-relaxed">
          <span className="text-gold-light font-medium">Couple Remedies:</span> Joint worship, visiting temples together on auspicious days, observing specific vrats (fasts) together. The act of shared spiritual practice itself strengthens the partnership bond — the remedy works on both karmic and psychological levels simultaneously.
        </p>
      </section>
    </div>
  );
}

export default function Module14_3Page() {
  return <ModuleContainer meta={META} pages={[<Page1 key="p1" />, <Page2 key="p2" />, <Page3 key="p3" />]} questions={QUESTIONS} />;
}
