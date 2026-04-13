'use client';

import ModuleContainer, { type ModuleMeta, type ModuleQuestion, useModuleLocale } from '@/components/learn/ModuleContainer';
import { isDevanagariLocale } from '@/lib/utils/locale-fonts';
import { lt } from '@/lib/learn/translations';
import type { LocaleText } from '@/lib/learn/translations';
import L from '@/messages/learn/modules/10-1.json';

const META: ModuleMeta = {
  id: 'mod_10_1', phase: 3, topic: 'Vargas', moduleNumber: '10.1',
  title: L.title as unknown as Record<string, string>,
  subtitle: L.subtitle as unknown as Record<string, string>,
  estimatedMinutes: 16,
  crossRefs: L.crossRefs.map(cr => ({ label: cr.label as unknown as Record<string, string>, href: cr.href })),
};

const QUESTIONS = (L.questions as unknown) as ModuleQuestion[];

function Page1() {
  const locale = useModuleLocale();
  const isHi = isDevanagariLocale(locale);
  return (
    <div className="space-y-6">
      <section>
        <h3 className="text-gold-light font-bold text-lg mb-3" style={{ fontFamily: 'var(--font-heading)' }}>
          What Are Divisional Charts?
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          The rashi chart (D1) is the complete sky map at birth — it shows where every planet sits in the zodiac. But trying to read every life question from one chart is like trying to diagnose every illness with a single blood test. Vedic Jyotish solves this by creating <span className="text-gold-light font-medium">varga charts</span> (divisional charts), each a mathematically derived sub-chart that zooms into a specific life domain.
        </p>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          Think of the rashi chart as the trunk of a great tree. The vargas are its branches — each one growing from the same trunk but reaching into different territory. The <span className="text-gold-light font-medium">Navamsha (D9)</span> branch reveals marriage and dharma. The <span className="text-gold-light font-medium">Dasamsha (D10)</span> branch shows career. The <span className="text-gold-light font-medium">Saptamsha (D7)</span> branch governs children. The <span className="text-gold-light font-medium">Dwadashamsha (D12)</span> branch illuminates parents and lineage.
        </p>
        <p className="text-text-secondary text-sm leading-relaxed">
          Each varga is created by dividing every 30-degree sign into equal parts and mapping those parts to new signs following specific rules laid down by Parashara. A planet at 15 degrees Aries occupies one sign in D1, potentially a different sign in D9, yet another in D10 — each placement revealing a different facet of the same planet's influence.
        </p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5">
        <h4 className="text-gold-dark text-xs uppercase tracking-widest font-bold mb-3">The Core Divisional Charts</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[
            { code: 'D1', name: 'Rashi', nameHi: 'राशि', domain: 'Overall life, physical body', domainHi: 'सम्पूर्ण जीवन, शारीरिक देह' },
            { code: 'D2', name: 'Hora', nameHi: 'होरा', domain: 'Wealth and financial resources', domainHi: 'धन और वित्तीय संसाधन' },
            { code: 'D3', name: 'Drekkana', nameHi: 'द्रेक्काण', domain: 'Siblings and courage', domainHi: 'भाई-बहन और साहस' },
            { code: 'D7', name: 'Saptamsha', nameHi: 'सप्तांश', domain: 'Children and progeny', domainHi: 'सन्तान और वंश' },
            { code: 'D9', name: 'Navamsha', nameHi: 'नवांश', domain: 'Marriage, dharma, inner self', domainHi: 'विवाह, धर्म, आन्तरिक स्वरूप' },
            { code: 'D10', name: 'Dasamsha', nameHi: 'दशांश', domain: 'Career and profession', domainHi: 'व्यवसाय और पेशा' },
            { code: 'D12', name: 'Dwadashamsha', nameHi: 'द्वादशांश', domain: 'Parents and ancestry', domainHi: 'माता-पिता और पूर्वज' },
            { code: 'D60', name: 'Shashtiamsha', nameHi: 'षष्ट्यंश', domain: 'Past-life karma (subtle)', domainHi: 'पूर्वजन्म कर्म (सूक्ष्म)' },
          ].map(v => (
            <div key={v.code} className="bg-bg-primary/40 rounded-lg p-3 border border-white/5">
              <span className="text-gold-light font-mono font-bold text-xs">{v.code}</span>
              <span className="text-text-secondary text-xs ml-2">{isHi ? v.nameHi : v.name}</span>
              <p className="text-text-secondary/70 text-xs mt-1">{isHi ? v.domainHi : v.domain}</p>
            </div>
          ))}
        </div>
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
          The Shodasvarga — 16 Charts and Their Weights
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          Parashara prescribes the <span className="text-gold-light font-medium">Shodasvarga</span> system — a set of 16 divisional charts that together give a comprehensive portrait of any horoscope. Each chart divides signs into progressively finer portions: D1 uses the full 30 degrees, D9 uses 3°20' divisions, and D60 uses razor-thin 0.5° slices. The finer the division, the more precise the birth time must be — even a few minutes' error can shift a D60 placement entirely.
        </p>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          The <span className="text-gold-light font-medium">Vimshopaka Bala</span> (20-point strength) system assigns specific weights to each varga. In the Shodasvarga scheme: D1 gets 3.5 points, D2 gets 1, D3 gets 1, D4 gets 0.5, D7 gets 0.5, D9 gets 3, D10 gets 0.5, D12 gets 0.5, D16 gets 2, D20 gets 0.5, D24 gets 0.5, D27 gets 0.5, D30 gets 1, D40 gets 0.5, D45 gets 0.5, and D60 gets 4 — totaling 20 points. Notice that D60 has the highest weight, reflecting its karmic significance.
        </p>
        <p className="text-text-secondary text-sm leading-relaxed">
          A planet is evaluated in each varga for its dignity — is it in its own sign, exalted, in a friendly sign, neutral, enemy, or debilitated? Each status yields a fraction of that varga's maximum points. A planet scoring 15+ out of 20 in Vimshopaka is exceptionally strong; below 5 is severely compromised regardless of its D1 placement.
        </p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-emerald-500/15">
        <h4 className="text-emerald-400 text-xs uppercase tracking-widest font-bold mb-3">Practical Example: Strong in D1, Weak in D9</h4>
        <p className="text-text-secondary text-xs leading-relaxed mb-2">
          <span className="text-gold-light font-medium">Scenario:</span> Jupiter is exalted in Cancer in D1 (rashi chart) — this looks magnificent. The native appears wise, generous, and spiritually inclined. But in D9, Jupiter falls in Capricorn (its debilitation sign).
        </p>
        <p className="text-text-secondary text-xs leading-relaxed mb-2">
          <span className="text-gold-light font-medium">Result:</span> The outer display of wisdom is impressive, but the inner dharmic conviction is weak. The person may preach values they don't truly follow. In marriage (D9's primary domain), Jupiter's debilitation suggests challenges with faith, trust, and the quality of guidance from the spouse or guru.
        </p>
        <p className="text-text-secondary text-xs leading-relaxed">
          <span className="text-gold-light font-medium">Key Lesson:</span> Never judge a planet by D1 alone. The rashi chart shows the surface — the Navamsha reveals what lies beneath.
        </p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-blue-500/15">
        <h4 className="text-blue-300 text-xs uppercase tracking-widest font-bold mb-3">The Navamsha — "The Chart Behind the Chart"</h4>
        <p className="text-text-secondary text-xs leading-relaxed mb-2">
          Among all 16 vargas, the Navamsha (D9) holds a special status. No serious Jyotish reading is complete without it. While D1 shows your outer circumstances — the life you live in the world — D9 reveals your inner reality: your true strength, your dharmic path, and the quality of your closest partnerships.
        </p>
        <p className="text-text-secondary text-xs leading-relaxed">
          Classical texts state that the D9 is so important that if D1 and D9 give contradictory results, the D9 should be given more weight for matters of marriage and dharma. Many astrologers read D1 and D9 side by side as a standard practice, only consulting other vargas for specific questions (D10 for career, D7 for children, etc.).
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
          Reading the Navamsha — Vargottama and Pushkara
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          A planet's <span className="text-gold-light font-medium">Navamsha sign</span> reveals its inner nature, while the rashi sign shows the outer expression. Mars in Aries (D1) appears bold and assertive outwardly; if Mars is in Cancer in D9, the inner nature is actually emotional, protective, and home-oriented. The outer warrior, the inner nurturer — this is the depth vargas provide.
        </p>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          <span className="text-gold-light font-medium">Vargottama</span> — when a planet occupies the same sign in both D1 and D9 — is considered exceptionally powerful. The outer expression and inner nature are perfectly aligned: what you see is what you get. Vargottama planets act with the strength of being in their own sign. A Vargottama Lagna (ascendant) is especially auspicious, giving the native a strong, coherent personality.
        </p>
        <p className="text-text-secondary text-sm leading-relaxed">
          <span className="text-gold-light font-medium">Pushkara Navamsha</span> refers to specific Navamsha positions that are inherently nourishing and auspicious. These occur at particular degrees within each sign and always fall in signs ruled by benefics (Jupiter, Venus, Moon, Mercury). A planet in Pushkara Navamsha receives a boost of natural beneficence — like a tree planted in fertile soil.
        </p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-amber-500/15">
        <h4 className="text-amber-400 text-xs uppercase tracking-widest font-bold mb-3">When Does Vargottama Occur?</h4>
        <p className="text-text-secondary text-xs leading-relaxed mb-2">
          Vargottama occurs in the first 3°20' of cardinal signs (Aries, Cancer, Libra, Capricorn), the middle 3°20' of fixed signs (Taurus, Leo, Scorpio, Aquarius), and the last 3°20' of dual signs (Gemini, Virgo, Sagittarius, Pisces). Any planet or the Lagna falling in these specific degree ranges will be in the same sign in both D1 and D9.
        </p>
        <p className="text-text-secondary text-xs leading-relaxed">
          <span className="text-gold-light font-medium">Marriage Timing with D9:</span> The Dasha of the Navamsha Lagna lord, the 7th lord of D9, or planets in the 7th house of D9 frequently trigger marriage. When the same planet is activated in both D1 dasha and D9 signification, the event becomes highly likely. This is why D9 is indispensable for relationship predictions.
        </p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5">
        <h4 className="text-gold-dark text-xs uppercase tracking-widest font-bold mb-2">Classical Reference</h4>
        <p className="text-text-secondary text-xs leading-relaxed">
          Parashara in BPHS (Chapter 6-7) provides the complete rules for all 16 vargas. He states: "The wise should examine the Shodasvarga positions of all planets to determine their true strength." Varahamihira in Brihat Jataka and Mantreshwara in Phaladeepika further elaborate the interpretation of divisional charts, especially the Navamsha, calling it the "fruit-giving chart" (phala-suchaka).
        </p>
      </section>
    </div>
  );
}

export default function Module10_1Page() {
  return <ModuleContainer meta={META} pages={[<Page1 key="p1" />, <Page2 key="p2" />, <Page3 key="p3" />]} questions={QUESTIONS} />;
}

