'use client';

import ModuleContainer, { type ModuleMeta, type ModuleQuestion, useModuleLocale } from '@/components/learn/ModuleContainer';
import { isDevanagariLocale } from '@/lib/utils/locale-fonts';
import { lt } from '@/lib/learn/translations';
import type { LocaleText } from '@/lib/learn/translations';
import L from '@/messages/learn/modules/17-4.json';

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
          The 2nd house (speech, early learning) and 5th house (intelligence, creativity, higher learning) should be emphasized — with benefic planets or aspects. The recommended nakshatras are: Ashwini (quick learning), Pushya (nourishment of knowledge), Hasta (manual skill, writing), Shravana (listening, the Vedic learning method), Dhanishtha (mastery), Punarvasu (renewal, returning to knowledge), and Revati (completion of learning).
        </p>
      </section>
      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5">
        <h4 className="text-gold-dark text-xs uppercase tracking-widest font-bold mb-2">Vasanta Panchami — The Supreme Day</h4>
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
          Namakarana — The Naming Ceremony
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          Namakarana is performed on the 11th or 12th day after birth. The name&rsquo;s first syllable is determined by the birth nakshatra&rsquo;s pada — each nakshatra has 4 padas, each assigned a specific syllable. This creates a deep vibrational link between the child&rsquo;s name, their birth nakshatra, and the cosmic energy present at their birth.
        </p>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          The system is precise: Ashwini pada 1 = &ldquo;Chu&rdquo;, pada 2 = &ldquo;Che&rdquo;, pada 3 = &ldquo;Cho&rdquo;, pada 4 = &ldquo;La&rdquo;. Bharani pada 1 = &ldquo;Li&rdquo;, pada 2 = &ldquo;Lu&rdquo;, pada 3 = &ldquo;Le&rdquo;, pada 4 = &ldquo;Lo&rdquo;. This continues through all 27 nakshatras, giving 108 syllables (27 nakshatras x 4 padas) — mirroring the sacred number 108. Our baby-names tool implements this entire syllable mapping.
        </p>
        <p className="text-text-secondary text-sm leading-relaxed">
          For the ceremony itself: the Moon should be strong (waxing preferred), Rahu Kaal must be avoided, and a shubha nakshatra should be running at the ceremony time (not necessarily the birth nakshatra — the ceremony&rsquo;s own nakshatra matters). The father traditionally whispers the chosen name into the child&rsquo;s right ear.
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
        <h4 className="text-red-400 text-xs uppercase tracking-widest font-bold mb-3">Common Misconception</h4>
        <p className="text-text-secondary text-xs leading-relaxed">
          Many families use the Rashi (zodiac sign) syllable instead of the Nakshatra pada syllable. While the Rashi syllable is acceptable in some traditions, the Nakshatra-pada method is more precise (108 unique syllables vs. 12 sign-based syllables) and is the method recommended by BPHS. Our baby-names tool supports both approaches.
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
          Upanayana — The Sacred Thread Ceremony
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          Upanayana (&ldquo;bringing near&rdquo;) is the initiation ceremony where the boy receives the sacred thread (yajnopavita) and begins formal Vedic study. It is one of the most important Samskaras, marking the spiritual &ldquo;second birth&rdquo; — hence the term &ldquo;Dwija&rdquo; (twice-born). The Muhurta for this event sets the tone for the boy&rsquo;s entire spiritual and intellectual development.
        </p>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          The Sun must be in Uttarayana (northward journey, roughly January to June). Shukla Paksha is preferred — the waxing Moon symbolizing growth of knowledge and spiritual light. The recommended nakshatras are: Hasta (devotional skill), Chitra (brilliance, creativity), Swati (spiritual independence), Pushya (nourishment), Dhanishtha (wealth of knowledge), and Shravana (hearing — most fitting, as Upanayana initiates the period of learning through listening to the guru).
        </p>
        <p className="text-text-secondary text-sm leading-relaxed">
          The traditional age varies by varna: Brahmin at 8 years, Kshatriya at 11, Vaishya at 12. In modern practice, Upanayana is performed between ages 7-12 regardless of background, often timed to coincide with the start of higher education. Some families who missed the traditional window perform it just before the wedding ceremony as a combined samskara.
        </p>
      </section>
      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5">
        <h4 className="text-gold-dark text-xs uppercase tracking-widest font-bold mb-3">Upanayana Requirements</h4>
        <p className="text-text-secondary text-xs leading-relaxed mb-1"><span className="text-gold-light font-medium">Season:</span> Uttarayana (January-June). Avoid Dakshinayana.</p>
        <p className="text-text-secondary text-xs leading-relaxed mb-1"><span className="text-gold-light font-medium">Paksha:</span> Shukla Paksha preferred. Avoid Amavasya and Rikta tithis.</p>
        <p className="text-text-secondary text-xs leading-relaxed mb-1"><span className="text-gold-light font-medium">Nakshatras:</span> Hasta, Chitra, Swati, Pushya, Dhanishtha, Shravana.</p>
        <p className="text-text-secondary text-xs leading-relaxed mb-1"><span className="text-gold-light font-medium">Avoid:</span> Rahu Kaal, Vishti karana, Vyatipata/Vaidhriti yoga.</p>
        <p className="text-text-secondary text-xs leading-relaxed"><span className="text-gold-light font-medium">Planets:</span> Jupiter and Sun strong. Mercury well-placed for intellectual growth.</p>
      </section>
      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-blue-500/15">
        <h4 className="text-blue-300 text-xs uppercase tracking-widest font-bold mb-3">Modern Adaptations</h4>
        <p className="text-text-secondary text-xs leading-relaxed">
          Contemporary practice has adapted Upanayana in several ways. The strict age-by-varna rule is rarely followed. Some reformist traditions perform Upanayana for girls as well (historically it was reserved for boys). The ceremony may be shortened from the traditional multi-day format to a single morning. However, the core Muhurta requirements — Uttarayana, Shukla Paksha, suitable nakshatra, strong Jupiter — remain universally observed. The spiritual significance of the ceremony has not changed, even as its social context has evolved.
        </p>
      </section>
    </div>
  );
}

export default function Module17_4Page() {
  return <ModuleContainer meta={META} pages={[<Page1 key="p1" />, <Page2 key="p2" />, <Page3 key="p3" />]} questions={QUESTIONS} />;
}
