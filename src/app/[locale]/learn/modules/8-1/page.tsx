'use client';

import ModuleContainer, { type ModuleMeta, type ModuleQuestion, useModuleLocale } from '@/components/learn/ModuleContainer';
import ExampleChart from '@/components/learn/ExampleChart';
import { isDevanagariLocale } from '@/lib/utils/locale-fonts';
import { lt } from '@/lib/learn/translations';
import type { LocaleText } from '@/lib/learn/translations';
import L from '@/messages/learn/modules/8-1.json';

const META: ModuleMeta = {
  id: 'mod_8_1', phase: 2, topic: 'Muhurta', moduleNumber: '8.1',
  title: L.title as unknown as Record<string, string>,
  subtitle: L.subtitle as unknown as Record<string, string>,
  estimatedMinutes: 15,
  crossRefs: L.crossRefs.map(cr => ({ label: cr.label as unknown as Record<string, string>, href: cr.href })),
};

const QUESTIONS = (L.questions as unknown) as ModuleQuestion[];

function Page1() {
  const locale = useModuleLocale();
  const isHi = isDevanagariLocale(locale);
  return (
    <div className="space-y-6">
      <section>
        <h3 className="text-gold-light font-bold text-lg mb-3" style={{ fontFamily: 'var(--font-heading)' }}>Panchang — The Five Limbs Working Together</h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">The word &quot;Panchang&quot; comes from Pancha (five) + Anga (limb). These five elements together form a multi-dimensional framework for assessing the quality of any given moment. Each limb captures a distinct astronomical reality: Tithi measures the Moon-Sun angular separation (the lunar phase), Vara identifies the weekday and its ruling planet, Nakshatra locates the Moon among the 27 stellar mansions, Yoga sums the Sun and Moon sidereal longitudes, and Karana divides the tithi into two halves for finer temporal resolution.</p>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">The genius of the Panchang system is that no single element tells the whole story. Tithi reveals the relationship between the two luminaries (waxing/waning energy). Vara colours the day with planetary flavour (Jupiter&apos;s wisdom on Thursday, Mars&apos;s aggression on Tuesday). Nakshatra indicates the Moon&apos;s stellar backdrop — which of 27 cosmic archetypes is active. Yoga captures the combined radiance of both luminaries. Karana adds the final layer of precision.</p>
        <p className="text-text-secondary text-sm leading-relaxed">Together, these five elements create what modern systems would call a &quot;feature vector&quot; for time quality. A complete Panchang entry for any moment includes all five limbs plus supplementary data: Rahu Kaal (inauspicious Rahu period), Yamaganda (death-lord period), Gulika Kaal (Saturn&apos;s toxic period), and Choghadiya (alternating good/bad time blocks). Sunrise and sunset anchor the calculations, as the Vedic day begins at sunrise rather than midnight.</p>
      </section>
      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5">
        <h4 className="text-gold-dark text-xs uppercase tracking-widest font-bold mb-2">Classical Origin</h4>
        <p className="text-text-secondary text-sm leading-relaxed">The five-limb Panchang system is described in the Surya Siddhanta (one of the oldest astronomical texts), codified in BPHS, and practically elaborated in Muhurta Chintamani, Dharmasindhu, and Nirnaya Sindhu. The Arthashastra of Kautilya (4th century BCE) references Panchang consultation for state decisions. Every Dharmashastra mandates that auspicious rituals (samskaras) must be performed only after verifying all five Panchang elements. This five-factor framework has remained unchanged for at least 2000 years — a testament to its coherence and practical utility.</p>
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
        <h3 className="text-gold-light font-bold text-lg mb-3" style={{ fontFamily: 'var(--font-heading)' }}>Reading a Panchang Entry — A Complete Walkthrough</h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">Consider a real Panchang entry: Thursday, Shukla Navami, Uttara Phalguni Nakshatra, Shubha Yoga, Taitila Karana. Let us evaluate each element. Vara: Thursday (Guruvara) — ruled by Jupiter, highly auspicious for ceremonies. Tithi: Shukla Navami (9th of bright half) — Navami is a Rikta tithi, somewhat unfavourable for new beginnings but acceptable for religious worship. Nakshatra: Uttara Phalguni — classified as &quot;Dhruva&quot; (fixed), excellent for marriages and permanent structures. Yoga: Shubha — the name means &quot;auspicious,&quot; one of the best yogas. Karana: Taitila — a Chara karana associated with worldly success, auspicious.</p>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">Assessment: four of five elements are positive (Vara, Nakshatra, Yoga, Karana), while Tithi (Navami/Rikta) is the weak link. For a marriage, this is borderline — the astrologer might approve if the bride and groom&apos;s charts specifically benefit from Navami. For a business launch, the strong Jupiter energy (Thursday) and Shubha yoga make it favourable despite the Rikta tithi. Context matters.</p>
        <p className="text-text-secondary text-sm leading-relaxed">The supplementary elements add further nuance. If the chosen hour falls during Rahu Kaal, the astrologer shifts the time. Yamaganda and Gulika Kaal are similarly avoided. Choghadiya provides a quick-reference grid of good and bad periods through the day. The hierarchy of importance is generally: Nakshatra &gt; Tithi &gt; Yoga &gt; Vara &gt; Karana, but a strong negative in any element demands attention.</p>
      </section>
      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-emerald-500/15">
        <h4 className="text-emerald-400 text-xs uppercase tracking-widest font-bold mb-3">Worked Examples</h4>
        <ExampleChart
          ascendant={1}
          planets={{ 10: [0], 4: [1], 9: [4] }}
          title="Aries Lagna — Sun in 10th, Moon in 4th, Jupiter in 9th"
        />
        <p className="text-text-secondary text-xs leading-relaxed mb-2"><span className="text-gold-light font-medium">Example 1 (Perfect window):</span> Thursday + Shukla Panchami (Nanda tithi, auspicious) + Pushya Nakshatra + Siddhi Yoga + Bava Karana. All five elements are favourable. Additionally, Thursday + Pushya = Sarvartha Siddhi Yoga. This is an exceptional muhurta for almost any positive activity — marriage, business, travel, education.</p>
        <p className="text-text-secondary text-xs leading-relaxed mb-2"><span className="text-gold-light font-medium">Example 2 (Vetoed window):</span> Wednesday + Shukla Saptami + Rohini Nakshatra + Dhruva Yoga + Vishti Karana. Four elements are excellent, but Vishti (Bhadra) karana is active. Despite the stellar combination, classical texts advise postponing the ceremony until Bhadra passes — typically 6 hours — and rechecking the Panchang at the new time.</p>
        <p className="text-text-secondary text-xs leading-relaxed"><span className="text-gold-light font-medium">Example 3 (Mixed assessment):</span> Tuesday + Krishna Ekadashi + Ashlesha Nakshatra + Parigha Yoga + Balava Karana. Tuesday is a malefic vara, Ashlesha is a Tikshna (sharp) nakshatra, and Parigha is an inauspicious yoga. However, Ekadashi is sacred (fasting day), and Balava karana is auspicious. This window is unsuitable for material ceremonies but excellent for spiritual practices, fasting, and meditation.</p>
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
        <h3 className="text-gold-light font-bold text-lg mb-3" style={{ fontFamily: 'var(--font-heading)' }}>The Muhurta Selection Algorithm</h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">Muhurta selection integrates all five Panchang limbs into a decision framework. For a major ceremony like marriage, the classical requirements are: (1) Nakshatra must be a Shubha type — Rohini, Mrigashira, Magha, Uttara Phalguni, Hasta, Swati, Anuradha, Mula, Uttara Ashadha, Uttara Bhadrapada, or Revati. (2) Tithi must not be Rikta (4th, 9th, 14th) or Amavasya/Purnima for some ceremonies. Nanda (1st, 6th, 11th), Bhadra (2nd, 7th, 12th), and Jaya (3rd, 8th, 13th) tithis are preferred. (3) Yoga must be auspicious — avoid Vyatipata, Vaidhriti, Vishkambha, Atiganda, Shula, Ganda, Vyaghata, Vajra, and Parigha. (4) Vara should be Monday, Wednesday, Thursday, or Friday. (5) Karana must not be Vishti (Bhadra).</p>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">The balancing principle states: mild negatives can be compensated by strong positives. A slightly unfavourable yoga can be overridden by an excellent nakshatra and vara combination. However, certain elements act as absolute vetoes — Vishti karana on earth and Vyatipata/Vaidhriti yoga are &quot;hard stops&quot; that no amount of positivity in other elements can compensate. This dual principle — general balancing plus critical vetoes — is the heart of muhurta wisdom.</p>
        <p className="text-text-secondary text-sm leading-relaxed">Our Muhurta AI engine implements this logic computationally: it scans a time range, evaluates each moment on all five Panchang dimensions, applies bonuses for special combinations (Sarvartha Siddhi, Amrita Siddhi), applies penalties for inauspicious elements (Rahu Kaal, Vishti, Vyatipata), and ranks candidate windows by composite score. The algorithm respects the classical hierarchy while providing a transparent breakdown so users can understand exactly why a window was selected or rejected.</p>
      </section>
      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-red-500/15">
        <h4 className="text-red-400 text-xs uppercase tracking-widest font-bold mb-3">Common Misconceptions</h4>
        <p className="text-text-secondary text-xs leading-relaxed mb-2"><span className="text-gold-light font-medium">Myth:</span> &quot;Only Nakshatra and Tithi matter — the other three elements are filler.&quot; While Nakshatra and Tithi are the most weighted, Yoga and Karana carry real veto power. Vishti karana has ruined many otherwise perfect windows. Vara contributes both directly (day energy) and through compound yogas (Sarvartha Siddhi, Amrita Siddhi).</p>
        <p className="text-text-secondary text-xs leading-relaxed mb-2"><span className="text-gold-light font-medium">Myth:</span> &quot;A Panchang is just a calendar.&quot; A calendar tells you the date. A Panchang tells you the cosmic quality of that date across five independent dimensions plus supplementary periods. Two adjacent days can have radically different Panchang profiles.</p>
        <p className="text-text-secondary text-xs leading-relaxed"><span className="text-gold-light font-medium">Myth:</span> &quot;Modern software has replaced traditional Panchang reading.&quot; Software computes the data, but interpretation requires understanding the classical weighting, activity-specific rules, and the interplay between elements. The algorithm encodes tradition, not replaces it.</p>
      </section>
      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-blue-500/15">
        <h4 className="text-blue-300 text-xs uppercase tracking-widest font-bold mb-3">Modern Relevance</h4>
        <p className="text-text-secondary text-xs leading-relaxed">The Panchang remains the single most consulted astrological document in India. Over 80% of Hindu weddings are timed using Panchang-based muhurta selection. Businesses consult Panchang for launch dates, farmers for planting schedules, and temples for festival timing. Our app provides a fully computed Panchang with all five limbs, supplementary periods, and an AI-powered muhurta recommender — making this ancient five-dimensional time-quality system accessible to anyone, anywhere in the world.</p>
      </section>
    </div>
  );
}

export default function Module8_1Page() {
  return <ModuleContainer meta={META} pages={[<Page1 key="p1" />, <Page2 key="p2" />, <Page3 key="p3" />]} questions={QUESTIONS} />;
}

