'use client';

import ModuleContainer, { type ModuleMeta, type ModuleQuestion, useModuleLocale } from '@/components/learn/ModuleContainer';
import { isDevanagariLocale } from '@/lib/utils/locale-fonts';
import { lt } from '@/lib/learn/translations';
import type { LocaleText } from '@/lib/learn/translations';
import L from '@/messages/learn/modules/17-3.json';

const META: ModuleMeta = {
  id: 'mod_17_3', phase: 5, topic: 'Muhurta', moduleNumber: '17.3',
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
          Griha Pravesh — Entering a New Home
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          Griha Pravesh (house entry) is one of the 16 Samskaras (life ceremonies) in Hindu tradition. The moment you first enter your new home creates an inception chart for your life in that dwelling — affecting health, wealth, relationships, and overall prosperity for as long as you live there.
        </p>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          The strongest 4th house in the Muhurta chart is essential — this is the house of property, home, and material comforts. The Moon should be in the 2nd, 4th, 6th, 7th, 9th, 10th, or 11th from the natal Moon (Chandrabala). The recommended nakshatras are the Dhruva (fixed) group: Dhanishtha, Uttara Phalguni, Uttarabhadrapada, and Rohini — all conferring stability and permanence.
        </p>
        <p className="text-text-secondary text-sm leading-relaxed">
          Monday, Wednesday, Thursday, and Friday are the preferred weekdays. A unique factor for Griha Pravesh is Bhoomi Dosha — a directional defect based on the month and the direction of the house entrance. If the current month&rsquo;s inauspicious direction matches your entrance direction, the Griha Pravesh should be deferred. This factor does not apply to other types of Muhurta.
        </p>
      </section>
      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5">
        <h4 className="text-gold-dark text-xs uppercase tracking-widest font-bold mb-2">Bhoomi Dosha — The Directional Defect</h4>
        <p className="text-text-secondary text-sm leading-relaxed">
          Bhoomi Dosha divides the year into directional periods. During certain months, entering from certain directions is considered inauspicious — it is believed to bring illness, financial loss, or domestic discord. The remedy is either to wait for the direction to clear (usually a month) or to perform a specific Vastu Shanti puja before entry. Our Muhurta tool automatically flags Bhoomi Dosha when evaluating Griha Pravesh candidates.
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
          Vehicle Purchase Muhurta
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          A vehicle is a significant purchase with safety implications, making the Muhurta important. The 4th house should be strong in the lagna chart — benefic planets in or aspecting the 4th house. The lagna lord should not be debilitated, combust, or in the 8th house (which represents accidents and sudden problems).
        </p>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          Tuesday holds special significance because Mars (ruler of Tuesday) is the karaka for vehicles, machinery, and engineering. When Mars is well-placed (in own sign, exalted, or in a kendra), Tuesday becomes a strong day for vehicle purchase. However, Mars debilitated or in the 8th house makes Tuesday unfavourable.
        </p>
        <p className="text-text-secondary text-sm leading-relaxed">
          The ideal nakshatras for vehicle purchase are: Ashwini (the divine horsemen — connected to transport), Rohini (stability and beauty), Pushya (the most auspicious nakshatra for any purchase — nourishment and growth), Hasta (skillful hands, craftsmanship), and Chitra (beauty, artistry). Avoid Vishti karana, Moon in the 8th or 12th house, and debilitated lagna lord.
        </p>
      </section>
      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-emerald-500/15">
        <h4 className="text-emerald-400 text-xs uppercase tracking-widest font-bold mb-3">Vehicle Purchase Checklist</h4>
        <p className="text-text-secondary text-xs leading-relaxed mb-1"><span className="text-gold-light font-medium">4th House:</span> Strong, with benefic influence. No malefics in the 4th or 8th.</p>
        <p className="text-text-secondary text-xs leading-relaxed mb-1"><span className="text-gold-light font-medium">Nakshatra:</span> Ashwini, Rohini, Pushya, Hasta, or Chitra preferred.</p>
        <p className="text-text-secondary text-xs leading-relaxed mb-1"><span className="text-gold-light font-medium">Day:</span> Tuesday (Mars strong), Thursday (Jupiter), or Friday (Venus for luxury).</p>
        <p className="text-text-secondary text-xs leading-relaxed mb-1"><span className="text-gold-light font-medium">Avoid:</span> Vishti karana, Moon in 8th/12th, debilitated lagna lord.</p>
        <p className="text-text-secondary text-xs leading-relaxed"><span className="text-gold-light font-medium">Mars:</span> Should be well-placed — own sign, exalted, or in kendra. Not in 8th house.</p>
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
          Travel Muhurta — Disha Shool, Tara Bala, Chandrabala
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          Travel Muhurta involves three unique factors not used in other Muhurta types. The most critical is Disha Shool — a directional defect that assigns an inauspicious direction to each weekday. Sunday: West. Monday: East. Tuesday: North. Wednesday: safe in all directions. Thursday: South. Friday: West. Saturday: East. Travelling in the Shool direction is believed to bring obstacles, delays, or harm.
        </p>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          Tara Bala (star strength) is calculated from the traveller&rsquo;s birth nakshatra. Count from birth nakshatra to the current transit nakshatra, divide by 9. The remainder indicates the tara: 1 (Janma — avoid), 2 (Sampat — wealth), 3 (Vipat — danger), 4 (Kshema — well-being), 5 (Pratyari — obstacle), 6 (Sadhaka — achievement), 7 (Vadha — death — avoid), 8 (Mitra — friend), 9 (Ati-Mitra — best friend). Taras 1, 3, 5, 7 are unfavourable; 2, 4, 6, 8, 9 are favourable.
        </p>
        <p className="text-text-secondary text-sm leading-relaxed">
          Chandrabala checks the transit Moon&rsquo;s position relative to the natal Moon. For travel, Moon in the 3rd, 6th, 10th, or 11th from natal Moon is excellent. Moon in the 8th is the worst (danger, accidents). For short trips, only Disha Shool avoidance is necessary. For long journeys — interstate, international, or by air — all three factors (Disha Shool, Tara Bala, Chandrabala) should be favourable.
        </p>
      </section>
      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-red-500/15">
        <h4 className="text-red-400 text-xs uppercase tracking-widest font-bold mb-3">Disha Shool Quick Reference</h4>
        <p className="text-text-secondary text-xs leading-relaxed mb-1"><span className="text-gold-light font-medium">Sunday:</span> West inauspicious</p>
        <p className="text-text-secondary text-xs leading-relaxed mb-1"><span className="text-gold-light font-medium">Monday:</span> East inauspicious</p>
        <p className="text-text-secondary text-xs leading-relaxed mb-1"><span className="text-gold-light font-medium">Tuesday:</span> North inauspicious</p>
        <p className="text-text-secondary text-xs leading-relaxed mb-1"><span className="text-gold-light font-medium">Wednesday:</span> All directions safe</p>
        <p className="text-text-secondary text-xs leading-relaxed mb-1"><span className="text-gold-light font-medium">Thursday:</span> South inauspicious</p>
        <p className="text-text-secondary text-xs leading-relaxed mb-1"><span className="text-gold-light font-medium">Friday:</span> West inauspicious</p>
        <p className="text-text-secondary text-xs leading-relaxed"><span className="text-gold-light font-medium">Saturday:</span> East inauspicious</p>
      </section>
      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-blue-500/15">
        <h4 className="text-blue-300 text-xs uppercase tracking-widest font-bold mb-3">Remedial Detour</h4>
        <p className="text-text-secondary text-xs leading-relaxed">
          If travel in the Disha Shool direction is unavoidable, the traditional remedy is a detour: first travel a short distance in a non-Shool direction (even a few kilometres), pause briefly (offering a prayer), then redirect toward the destination. This symbolically &ldquo;breaks&rdquo; the initial directional defect. Wednesday is the safest day for travel in any direction as it has no Disha Shool.
        </p>
      </section>
      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-amber-500/15">
        <h4 className="text-amber-400 text-xs uppercase tracking-widest font-bold mb-3">Practical Application — Modern Context</h4>
        <p className="text-text-secondary text-xs leading-relaxed mb-2">
          In modern life, the traditional Muhurta categories map to contemporary activities. <span className="text-gold-light font-medium">Griha Pravesh</span> applies to moving into a rented apartment as well as a purchased home. <span className="text-gold-light font-medium">Vehicle Purchase</span> includes cars, motorcycles, and even leased vehicles — the key event is first possession/use. <span className="text-gold-light font-medium">Travel Muhurta</span> applies to flights and long-distance road trips; for daily commutes, only Disha Shool avoidance is practical.
        </p>
        <p className="text-text-secondary text-xs leading-relaxed">
          Our Muhurta AI tool supports all three activity types discussed in this module. Enter your birth details for personalized Tara Bala and Chandrabala, specify the activity type, and the engine generates ranked time windows with scores. For Griha Pravesh, it automatically checks Bhoomi Dosha based on the entrance direction you specify.
        </p>
      </section>
      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-red-500/15">
        <h4 className="text-red-400 text-xs uppercase tracking-widest font-bold mb-3">Common Misconceptions</h4>
        <p className="text-text-secondary text-xs leading-relaxed mb-2"><span className="text-gold-light font-medium">Myth:</span> &ldquo;Disha Shool applies to all travel, including short errands.&rdquo; Reality: classical texts mention Disha Shool primarily for long journeys. Short local errands are generally exempt. Apply it for interstate/international travel.</p>
        <p className="text-text-secondary text-xs leading-relaxed mb-2"><span className="text-gold-light font-medium">Myth:</span> &ldquo;Griha Pravesh must be done before any family member enters.&rdquo; Reality: construction workers, painters, and maintenance staff entering during renovation do not constitute Griha Pravesh. The ceremony applies to the family&rsquo;s FIRST formal entry with the intent to reside.</p>
        <p className="text-text-secondary text-xs leading-relaxed"><span className="text-gold-light font-medium">Myth:</span> &ldquo;Tuesday is always bad for vehicle purchase.&rdquo; Reality: Tuesday is Mars&rsquo;s day. When Mars is well-placed (own sign, exalted, in Kendra), Tuesday is actually ideal — Mars is the karaka for vehicles and machinery. See Module 17.1 for the general Muhurta scoring framework and Module 17.2 for marriage-specific rules.</p>
      </section>
    </div>
  );
}

export default function Module17_3Page() {
  return <ModuleContainer meta={META} pages={[<Page1 key="p1" />, <Page2 key="p2" />, <Page3 key="p3" />]} questions={QUESTIONS} />;
}
