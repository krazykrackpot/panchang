'use client';

import ModuleContainer, { type ModuleMeta, type ModuleQuestion, useModuleLocale } from '@/components/learn/ModuleContainer';
import ExampleChart from '@/components/learn/ExampleChart';
import { isDevanagariLocale } from '@/lib/utils/locale-fonts';
import { lt } from '@/lib/learn/translations';
import type { LocaleText } from '@/lib/learn/translations';
import L from '@/messages/learn/modules/7-3.json';

const META: ModuleMeta = {
  id: 'mod_7_3', phase: 2, topic: 'Yoga Karana', moduleNumber: '7.3',
  title: L.title as unknown as ModuleMeta['title'],
  subtitle: L.subtitle as unknown as ModuleMeta['subtitle'],
  estimatedMinutes: 13,
  crossRefs: L.crossRefs as unknown as ModuleMeta['crossRefs'],
};

const QUESTIONS: ModuleQuestion[] = L.questions as unknown as ModuleQuestion[];

function Page1() {
  const locale = useModuleLocale();
  const isHi = isDevanagariLocale(locale);
  return (
    <div className="space-y-6">
      <section>
        <h3 className="text-gold-light font-bold text-lg mb-3" style={{ fontFamily: 'var(--font-heading)' }}>Vara — The Weekday and the Hora System</h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">The seven weekdays (varas) are the most familiar time-division in both Eastern and Western cultures, yet few people know why the days follow the order Sun, Moon, Mars, Mercury, Jupiter, Venus, Saturn rather than the orbital speed sequence. The answer lies in the Hora system — an ancient planetary-hour framework shared between Vedic and Hellenistic astronomy.</p>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">The Chaldean order ranks the seven classical planets by decreasing orbital period: Saturn (slowest), Jupiter, Mars, Sun, Venus, Mercury, Moon (fastest). Each of the 24 hours of a day is assigned to the next planet in this Chaldean sequence. The ruler of the first hora becomes the ruler of the entire day. After 24 horas, we have cycled through 3 complete rounds of 7 (= 21) plus 3 extra steps — so the next day&apos;s ruler is 3 positions forward in the Chaldean order. Starting from Saturn: skip 3 forward gives Sun; from Sun skip 3 gives Moon; from Moon skip 3 gives Mars — producing the familiar weekday order.</p>
        <p className="text-text-secondary text-sm leading-relaxed">The Sanskrit names directly reflect planetary rulership: Ravivara (Ravi = Sun), Somavara (Soma = Moon), Mangalavara (Mangal = Mars), Budhavara (Budha = Mercury), Guruvara (Guru = Jupiter), Shukravara (Shukra = Venus), Shanivara (Shani = Saturn). Every European language encodes the same planetary assignments (e.g., Saturday = Saturn&apos;s day, Sunday = Sun&apos;s day).</p>
      </section>
      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5">
        <h4 className="text-gold-dark text-xs uppercase tracking-widest font-bold mb-2">Classical Origin</h4>
        <p className="text-text-secondary text-sm leading-relaxed">The Hora system is described in Varahamihira&apos;s Brihat Jataka (6th century CE) and in the Surya Siddhanta. The word &quot;hora&quot; itself derives from the Greek &quot;hora&quot; (hour), pointing to the shared Greco-Indian astronomical heritage. BPHS discusses vara as one of the five essential Panchang limbs. The Muhurta Chintamani provides extensive tables of Vara-Nakshatra and Vara-Tithi combinations that create special yogas like Sarvartha Siddhi and Amrita Siddhi.</p>
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
        <h3 className="text-gold-light font-bold text-lg mb-3" style={{ fontFamily: 'var(--font-heading)' }}>Auspiciousness by Vara and Planetary Hora</h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">Each vara carries the energy of its ruling planet. Thursday (Guruvara), ruled by Jupiter, is considered the most universally auspicious — suited for education, marriage, religious ceremonies, and business initiation. Monday (Somavara, Moon) is good for domestic affairs, travel, and meeting people. Wednesday (Budhavara, Mercury) favours communication, learning, and trade. Friday (Shukravara, Venus) is ideal for arts, romance, and luxury purchases.</p>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">Tuesday (Mangalavara, Mars) and Saturday (Shanivara, Saturn) are generally avoided for new beginnings because Mars and Saturn are natural malefics. However, they are powerful for activities aligned with their energy: Tuesday suits courage-demanding actions, surgery, and property disputes; Saturday suits discipline, penance, removal of obstacles, and Shani-related remedies. Sunday (Ravivara, Sun) carries authority energy — good for government matters and leadership roles but considered too fierce for gentle ceremonies.</p>
        <p className="text-text-secondary text-sm leading-relaxed">Beyond the day-level vara, each hour within the day has its own hora ruler. The 24 horas cycle through the Chaldean sequence starting from the day&apos;s ruler. For fine-grained muhurta selection, practitioners check both the vara and the prevailing hora. A Jupiter hora on a Thursday is doubly auspicious; a Saturn hora on a Saturday intensifies Shani energy for better or worse.</p>
      </section>
      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-emerald-500/15">
        <h4 className="text-emerald-400 text-xs uppercase tracking-widest font-bold mb-3">Worked Examples</h4>
        <ExampleChart
          ascendant={1}
          planets={{ 10: [0], 4: [1], 9: [4] }}
          title="Aries Lagna — Sun in 10th, Moon in 4th, Jupiter in 9th"
        />
        <p className="text-text-secondary text-xs leading-relaxed mb-2"><span className="text-gold-light font-medium">Example 1 (Vara from JD):</span> JD = 2460400.5 (a specific date). floor(2460400.5 + 1.5) mod 7 = floor(2460402) mod 7 = 2460402 mod 7 = 0 (Monday). So this date is Somavara — a good day for travel and domestic matters.</p>
        <p className="text-text-secondary text-xs leading-relaxed mb-2"><span className="text-gold-light font-medium">Example 2 (Sarvartha Siddhi):</span> Date: Thursday, Nakshatra: Anuradha. Muhurta Chintamani lists Thursday + Anuradha as a Sarvartha Siddhi Yoga combination. This window is auspicious for virtually all activities — an &quot;all-purpose success&quot; window.</p>
        <p className="text-text-secondary text-xs leading-relaxed"><span className="text-gold-light font-medium">Example 3 (Hora selection):</span> It is Wednesday, and you need to sign a contract at 3 PM. Wednesday starts with Mercury hora at sunrise (~6 AM). Counting 9 horas forward (9 hours later = 3 PM) through the Chaldean sequence: Mercury → Moon → Saturn → Jupiter → Mars → Sun → Venus → Mercury → Moon. The 10th hour (3 PM) is Moon hora — favourable for agreements involving public-facing matters.</p>
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
        <h3 className="text-gold-light font-bold text-lg mb-3" style={{ fontFamily: 'var(--font-heading)' }}>Vara Combinations, Computation, and Modern Use</h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">The true power of Vara emerges when combined with other Panchang elements. Two important compound yogas arise from Vara combinations. Sarvartha Siddhi Yoga is formed when specific Vara + Nakshatra pairs align — for example, Sunday + Pushya, Monday + Hasta, Tuesday + Ashwini, Wednesday + Anuradha, Thursday + Revati, Friday + Anuradha, Saturday + Pushya. These create universally auspicious windows.</p>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">Amrita Siddhi Yoga is formed by specific Vara + Tithi combinations — for instance, Sunday + Dvadashi, Monday + Ekadashi, Wednesday + Dashami. Amrita means &quot;nectar&quot; — these windows are considered potent enough to neutralize many other negative factors in the Panchang.</p>
        <p className="text-text-secondary text-sm leading-relaxed">Computing the vara is trivially simple: floor(JD + 1.5) mod 7, where 0 = Monday, 1 = Tuesday, and so on. This makes vara the easiest of the five Panchang elements to compute — no planetary position calculations needed, just modular arithmetic on the Julian Day Number. Despite its computational simplicity, vara carries significant weight in muhurta decisions and is never omitted from any Panchang listing.</p>
      </section>
      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-red-500/15">
        <h4 className="text-red-400 text-xs uppercase tracking-widest font-bold mb-3">Common Misconceptions</h4>
        <p className="text-text-secondary text-xs leading-relaxed mb-2"><span className="text-gold-light font-medium">Myth:</span> &quot;Tuesday and Saturday are always bad.&quot; These days are inauspicious for gentle beginnings, but they are powerful for Mars-type and Saturn-type activities respectively. Surgery on Tuesday, discipline on Saturday — matching the day&apos;s energy to the action&apos;s nature is the correct approach.</p>
        <p className="text-text-secondary text-xs leading-relaxed mb-2"><span className="text-gold-light font-medium">Myth:</span> &quot;Vara alone determines whether a day is good or bad.&quot; Vara is just one of five Panchang limbs. A Thursday with Vyatipata yoga and Vishti karana is not automatically auspicious. The five elements must be evaluated together.</p>
        <p className="text-text-secondary text-xs leading-relaxed"><span className="text-gold-light font-medium">Myth:</span> &quot;The weekday order is arbitrary or culturally imposed.&quot; The sequence follows rigorously from the Hora system: 24 mod 7 = 3, producing the skip-two pattern in the Chaldean sequence. This mathematical derivation is shared across civilizations.</p>
      </section>
      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-blue-500/15">
        <h4 className="text-blue-300 text-xs uppercase tracking-widest font-bold mb-3">Modern Relevance</h4>
        <p className="text-text-secondary text-xs leading-relaxed">Vara is universally present in every Panchang, calendar, and almanac. In our app, the vara is displayed prominently on the daily Panchang page, and the Muhurta AI engine uses Vara-Nakshatra and Vara-Tithi lookup tables to detect Sarvartha Siddhi and Amrita Siddhi windows. The planetary hora calculator provides hour-by-hour planetary rulership for any given day. Even people who do not follow Jyotish actively tend to respect vara traditions — avoiding travel on Tuesday, worshipping Shani on Saturday, and fasting on Thursday (for Jupiter blessings).</p>
      </section>
    </div>
  );
}

export default function Module7_3Page() {
  return <ModuleContainer meta={META} pages={[<Page1 key="p1" />, <Page2 key="p2" />, <Page3 key="p3" />]} questions={QUESTIONS} />;
}
