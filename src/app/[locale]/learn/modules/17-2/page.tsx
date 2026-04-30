'use client';

import ModuleContainer, { type ModuleMeta, type ModuleQuestion, useModuleLocale } from '@/components/learn/ModuleContainer';
import { isDevanagariLocale } from '@/lib/utils/locale-fonts';
import { lt } from '@/lib/learn/translations';
import type { LocaleText } from '@/lib/learn/translations';
import L from '@/messages/learn/modules/17-2.json';

const META: ModuleMeta = {
  id: 'mod_17_2', phase: 5, topic: 'Muhurta', moduleNumber: '17.2',
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
          Marriage Muhurta — The Most Complex Selection
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          Marriage (Vivah) Muhurta is considered the most complex Muhurta to select because it must satisfy the maximum number of conditions simultaneously. Unlike a business Muhurta (where a few good factors suffice), a marriage Muhurta must check nakshatra suitability, tithi quality, karana, yoga, lagna strength, planetary positions (especially Venus and Jupiter), and seasonal restrictions — all at once.
        </p>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          The preferred nakshatras for marriage are those classified as Dhruva (fixed, stable) or Mridu (soft, gentle): Rohini, Mrigashira, Uttara Phalguni, Hasta, Swati, Anuradha, Uttara Ashadha, Uttarabhadrapada, and Revati. These nakshatras confer stability, gentleness, and growth — qualities essential for a lasting marriage.
        </p>
        <p className="text-text-secondary text-sm leading-relaxed">
          Absolutely avoided: Vishti (Bhadra) karana, Rikta tithis (4th, 9th, 14th), Vyatipata/Vaidhriti yoga, Rahu Kaal during the ceremony. The wedding ceremony (particularly the Saptapadi/seven steps) should ideally occur during the auspicious window, not just the reception or formal registration.
        </p>
      </section>
      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5">
        <h4 className="text-gold-dark text-xs uppercase tracking-widest font-bold mb-2">The Nine Marriage Nakshatras</h4>
        <p className="text-text-secondary text-sm leading-relaxed">
          Rohini (stability, beauty), Mrigashira (gentleness, seeking), Uttara Phalguni (patronage, lasting bonds), Hasta (skill, craftsmanship in relationships), Swati (independence with harmony), Anuradha (devotion, friendship), Uttara Ashadha (final victory, commitment), Uttarabhadrapada (depth, wisdom), Revati (nourishment, completion). Each carries a specific energy that blesses the marriage in its own way.
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
          Lagna and Planetary Requirements
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          The lagna (ascendant) of the marriage Muhurta chart is its backbone. The 2nd, 7th, or 11th house lagnas are ideal: 2nd for family and wealth, 7th for the partnership itself, 11th for the fulfilment of desires. The 7th lord in the Muhurta chart should be strong — not debilitated, combust, or in a dusthana (6th, 8th, 12th).
        </p>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          Venus is the karaka (significator) of marriage and must NOT be combust — meaning it should not be within approximately 10 degrees of the Sun. Combust Venus signifies weakened love, harmony, and attraction. Jupiter aspecting the lagna or 7th house is highly beneficial, bringing blessings, wisdom, and dharmic conduct to the marriage. Benefic planets in kendras (1st, 4th, 7th, 10th) strengthen the overall chart.
        </p>
        <p className="text-text-secondary text-sm leading-relaxed">
          The Moon should be waxing (Shukla Paksha preferred) for emotional growth and happiness. No malefic in the 8th house — Saturn, Mars, Rahu, or Ketu there indicates hidden challenges, secrets, or threats to the marriage&rsquo;s longevity. Eclipses should not have occurred within the preceding 7 days.
        </p>
      </section>
      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-emerald-500/15">
        <h4 className="text-emerald-400 text-xs uppercase tracking-widest font-bold mb-3">Planetary Checklist</h4>
        <p className="text-text-secondary text-xs leading-relaxed mb-1"><span className="text-gold-light font-medium">Venus:</span> Not combust. Not debilitated. Ideally in own/exaltation sign or in kendra.</p>
        <p className="text-text-secondary text-xs leading-relaxed mb-1"><span className="text-gold-light font-medium">Jupiter:</span> Aspecting lagna or 7th house. Not debilitated. In kendra or trikona.</p>
        <p className="text-text-secondary text-xs leading-relaxed mb-1"><span className="text-gold-light font-medium">Moon:</span> Waxing (Shukla Paksha). Not in 8th or 12th house. Good Paksha Bala.</p>
        <p className="text-text-secondary text-xs leading-relaxed mb-1"><span className="text-gold-light font-medium">7th Lord:</span> Strong, not combust, not in dusthana. Well-aspected.</p>
        <p className="text-text-secondary text-xs leading-relaxed"><span className="text-gold-light font-medium">8th House:</span> Free from malefics (Saturn, Mars, Rahu, Ketu).</p>
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
          Seasonal Restrictions and Regional Variations
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          Several periods are universally prohibited for marriage: Pitru Paksha (the fortnight of ancestor worship in Bhadrapada/Ashwin), during or within 7 days of a solar or lunar eclipse, and generally during Amavasya (new moon). Chaturmas — the four months of Vishnu&rsquo;s cosmic sleep from Devshayani Ekadashi to Prabodhini Ekadashi (roughly July-November) — restricts marriages in many traditions, though this varies regionally.
        </p>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          The most significant regional difference concerns Adhika Masa (the intercalary month occurring about every 32-33 months). North Indian traditions generally prohibit marriages during Adhika Masa, while some South Indian traditions, particularly in Tamil Nadu and Karnataka, may permit them. The Kshaya Masa (rare dropped month) is universally prohibited for all auspicious activities.
        </p>
        <p className="text-text-secondary text-sm leading-relaxed">
          The pandit&rsquo;s role in finalizing the exact lagna is crucial. Even after the family identifies a suitable date based on Panchang elements and seasonal restrictions, the pandit selects the precise 2-hour lagna window within that day. This fine-tuning — considering the lagna chart, hora, and the couple&rsquo;s individual charts — is the final and most personalized step of Muhurta selection.
        </p>
      </section>
      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-red-500/15">
        <h4 className="text-red-400 text-xs uppercase tracking-widest font-bold mb-3">Restricted Periods</h4>
        <p className="text-text-secondary text-xs leading-relaxed mb-1"><span className="text-gold-light font-medium">Pitru Paksha:</span> Krishna Paksha of Bhadrapada — devoted to ancestors. No auspicious work.</p>
        <p className="text-text-secondary text-xs leading-relaxed mb-1"><span className="text-gold-light font-medium">Eclipses:</span> Avoid marriage within 7 days before or after any eclipse.</p>
        <p className="text-text-secondary text-xs leading-relaxed mb-1"><span className="text-gold-light font-medium">Chaturmas:</span> July-November (varies by tradition). Some regions strictly prohibit, others are flexible.</p>
        <p className="text-text-secondary text-xs leading-relaxed"><span className="text-gold-light font-medium">Adhika Masa:</span> North India generally prohibits; South India varies. Consult family pandit.</p>
      </section>
      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-blue-500/15">
        <h4 className="text-blue-300 text-xs uppercase tracking-widest font-bold mb-3">The Pandit&rsquo;s Final Step</h4>
        <p className="text-text-secondary text-xs leading-relaxed">
          Our Muhurta AI tool identifies candidate dates and time windows that satisfy the Panchang, planetary, and seasonal requirements. But the final selection — especially for marriage — traditionally involves a pandit who considers the specific couple&rsquo;s charts, family traditions, and regional customs. The tool narrows hundreds of potential times to a shortlist; the pandit makes the final human judgment.
        </p>
      </section>
      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-amber-500/15">
        <h4 className="text-amber-400 text-xs uppercase tracking-widest font-bold mb-3">Worked Example — Evaluating a Date</h4>
        <p className="text-text-secondary text-xs leading-relaxed mb-2">
          <span className="text-gold-light font-medium">Scenario:</span> A family proposes February 15, 2027 for a wedding. Step 1: Check the nakshatra — Uttara Phalguni (excellent for marriage, Dhruva type). Step 2: Check the tithi — Shukla Dashami (good, not Rikta). Step 3: Check the karana — not Vishti. Step 4: Check Chaturmas — February is outside Chaturmas. Step 5: Check Venus combustion — Venus is 30 degrees from Sun (safe). Step 6: Check the Muhurta chart lagna — if the ceremony is at 10 AM, the lagna is in the 7th sign from the bride&rsquo;s Moon (ideal). Score: 78/100.
        </p>
      </section>
      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-red-500/15">
        <h4 className="text-red-400 text-xs uppercase tracking-widest font-bold mb-3">Common Misconceptions</h4>
        <p className="text-text-secondary text-xs leading-relaxed mb-2"><span className="text-gold-light font-medium">Myth:</span> &ldquo;Only the wedding date matters, not the time.&rdquo; Reality: the lagna (ascendant) at the moment of Saptapadi (seven steps) creates the marriage&rsquo;s birth chart. The exact time within the day is as important as the date itself.</p>
        <p className="text-text-secondary text-xs leading-relaxed mb-2"><span className="text-gold-light font-medium">Myth:</span> &ldquo;Venus retrograde ruins any marriage Muhurta.&rdquo; Reality: Venus retrograde is not ideal, but it is not an absolute prohibition. Combustion (Venus too close to Sun) is far worse. Our scoring penalizes retrograde Venus but does not disqualify dates entirely.</p>
        <p className="text-text-secondary text-xs leading-relaxed"><span className="text-gold-light font-medium">Myth:</span> &ldquo;Manglik dosha must be resolved before selecting Muhurta.&rdquo; Reality: Manglik dosha is a natal chart factor (Mars in 1st, 4th, 7th, 8th, or 12th house). It affects compatibility, not Muhurta. These are separate analyses. See Module 17.1 for general Muhurta principles and Module 17.3 for activity-specific Muhurtas.</p>
      </section>
    </div>
  );
}

export default function Module17_2Page() {
  return <ModuleContainer meta={META} pages={[<Page1 key="p1" />, <Page2 key="p2" />, <Page3 key="p3" />]} questions={QUESTIONS} />;
}
