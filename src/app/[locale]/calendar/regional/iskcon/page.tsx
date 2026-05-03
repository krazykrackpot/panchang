'use client';

import { useState, useEffect, useMemo } from 'react';
import { useLocale } from 'next-intl';
import { motion } from 'framer-motion';
import { Calendar, ArrowLeft, Star, Moon, Sun, Loader2, ChevronLeft, ChevronRight } from 'lucide-react';
import GoldDivider from '@/components/ui/GoldDivider';
import { Link } from '@/lib/i18n/navigation';
import { generateBreadcrumbLD } from '@/lib/seo/structured-data';
import type { Locale, LocaleText } from '@/types/panchang';
import { isDevanagariLocale } from '@/lib/utils/locale-fonts';
import { safeJsonLd } from '@/lib/seo/safe-jsonld';
import { useLocationStore } from '@/stores/location-store';
import AuthorByline from '@/components/ui/AuthorByline';
import { tl } from '@/lib/utils/trilingual';

// ─── ISKCON-specific events ─────────────────────────────────────
// These are appearance/disappearance days of Gaudiya Vaishnava acharyas
// and ISKCON-specific observances not in the standard Smarta calendar.
interface ISKCONEvent {
  name: { en: string; hi: string };
  date: string; // YYYY-MM-DD for 2026
  type: 'appearance' | 'disappearance' | 'festival' | 'ekadashi' | 'fast';
  description: { en: string; hi: string };
}

// Gaurabda year: 2026 CE = Gaurabda 540 (1486 CE + 540 = 2026)
const GAURABDA_YEAR = 540;

const ISKCON_EVENTS_2026: ISKCONEvent[] = [
  // Major Festivals
  { name: { en: 'Nityananda Trayodashi', hi: 'नित्यानन्द त्रयोदशी' }, date: '2026-02-01', type: 'appearance', description: { en: 'Appearance day of Lord Nityananda, the merciful incarnation of Balarama and Chaitanya Mahaprabhu\'s closest associate.', hi: 'भगवान नित्यानन्द का प्रकट दिवस, बलराम के करुणामय अवतार और चैतन्य महाप्रभु के निकटतम सहयोगी।' } },
  { name: { en: 'Gaura Purnima', hi: 'गौर पूर्णिमा' }, date: '2026-03-03', type: 'appearance', description: { en: 'Appearance day of Sri Chaitanya Mahaprabhu (1486 CE) — the golden avatar who inaugurated the Sankirtan movement. The most important festival in the Gaudiya Vaishnava calendar.', hi: 'श्री चैतन्य महाप्रभु (1486 ई.) का प्रकट दिवस — स्वर्ण अवतार जिन्होंने संकीर्तन आन्दोलन का आरम्भ किया। गौड़ीय वैष्णव पंचांग का सर्वाधिक महत्वपूर्ण पर्व।' } },
  { name: { en: 'Jagannath Rath Yatra', hi: 'जगन्नाथ रथ यात्रा' }, date: '2026-06-25', type: 'festival', description: { en: 'The great chariot festival of Lord Jagannath, Baladeva, and Subhadra. ISKCON celebrates this worldwide following the Puri tradition.', hi: 'भगवान जगन्नाथ, बलदेव और सुभद्रा का महान रथ उत्सव। इस्कॉन पुरी परम्परा का पालन करते हुए विश्वभर में मनाता है।' } },
  { name: { en: 'Guru Purnima (Vyasa Puja)', hi: 'गुरु पूर्णिमा (व्यास पूजा)' }, date: '2026-07-31', type: 'festival', description: { en: 'Honoring Srila Vyasadeva and the guru parampara (disciplic succession).', hi: 'श्रील व्यासदेव और गुरु परम्परा का सम्मान।' } },
  { name: { en: 'Balarama Jayanti', hi: 'बलराम जयन्ती' }, date: '2026-08-08', type: 'appearance', description: { en: 'Appearance day of Lord Balarama, the first expansion of Krishna and source of all spiritual strength.', hi: 'भगवान बलराम का प्रकट दिवस, कृष्ण का प्रथम विस्तार और समस्त आध्यात्मिक बल का स्रोत।' } },
  { name: { en: 'Sri Krishna Janmashtami', hi: 'श्री कृष्ण जन्माष्टमी' }, date: '2026-08-14', type: 'appearance', description: { en: 'Appearance day of Lord Sri Krishna, the Supreme Personality of Godhead. Fasting until midnight, then grand abhishek and feast.', hi: 'भगवान श्री कृष्ण का प्रकट दिवस, परम भगवान। मध्यरात्रि तक उपवास, फिर भव्य अभिषेक और भोज।' } },
  { name: { en: 'Nandotsav', hi: 'नन्दोत्सव' }, date: '2026-08-15', type: 'festival', description: { en: 'Celebration of Nanda Maharaja\'s joy at Krishna\'s birth. Feasting day after Janmashtami fast.', hi: 'कृष्ण जन्म पर नन्द महाराज के आनन्द का उत्सव। जन्माष्टमी व्रत के बाद भोज का दिन।' } },
  { name: { en: 'Radhastami', hi: 'राधाष्टमी' }, date: '2026-08-28', type: 'appearance', description: { en: 'Appearance day of Srimati Radharani, the supreme devotee and pleasure potency of Lord Krishna.', hi: 'श्रीमती राधारानी का प्रकट दिवस, परम भक्त और भगवान कृष्ण की आह्लादिनी शक्ति।' } },
  { name: { en: 'Govardhan Puja', hi: 'गोवर्धन पूजा' }, date: '2026-10-21', type: 'festival', description: { en: 'Celebration of Krishna lifting Govardhan Hill to protect Vrindavan from Indra\'s wrath. A mountain of prasadam (Annakut) is offered.', hi: 'इन्द्र के कोप से वृन्दावन की रक्षा हेतु कृष्ण द्वारा गोवर्धन पर्वत उठाने का उत्सव। प्रसाद का पर्वत (अन्नकूट) अर्पित किया जाता है।' } },

  // Prabhupada Commemorations
  { name: { en: 'Srila Prabhupada Appearance (Vyasa Puja)', hi: 'श्रील प्रभुपाद प्रकट दिवस (व्यास पूजा)' }, date: '2026-09-01', type: 'appearance', description: { en: 'Appearance day of His Divine Grace A.C. Bhaktivedanta Swami Prabhupada (1896), founder-acharya of ISKCON. Grand Vyasa Puja celebrations worldwide.', hi: 'इस्कॉन के संस्थापक-आचार्य श्रील प्रभुपाद (1896) का प्रकट दिवस। विश्वभर में भव्य व्यास पूजा।' } },
  { name: { en: 'Srila Prabhupada Disappearance', hi: 'श्रील प्रभुपाद तिरोभाव' }, date: '2026-11-14', type: 'disappearance', description: { en: 'Disappearance day of Srila Prabhupada (1977). Devotees fast until noon and hold memorial programs.', hi: 'श्रील प्रभुपाद का तिरोभाव दिवस (1977)। भक्त दोपहर तक उपवास करते हैं और स्मारक कार्यक्रम आयोजित करते हैं।' } },

  // Acharya Appearances/Disappearances
  { name: { en: 'Srila Bhaktisiddhanta Saraswati Appearance', hi: 'श्रील भक्तिसिद्धान्त सरस्वती प्रकट दिवस' }, date: '2026-02-17', type: 'appearance', description: { en: 'Appearance day of Srila Bhaktisiddhanta Saraswati Thakura (1874), Prabhupada\'s spiritual master and great preacher of Gaudiya Vaishnavism.', hi: 'श्रील भक्तिसिद्धान्त सरस्वती ठाकुर (1874) का प्रकट दिवस, प्रभुपाद के गुरु।' } },
  { name: { en: 'Srila Bhaktivinoda Thakura Appearance', hi: 'श्रील भक्तिविनोद ठाकुर प्रकट दिवस' }, date: '2026-09-13', type: 'appearance', description: { en: 'Appearance day of Srila Bhaktivinoda Thakura (1838), the pioneer who revived Gaudiya Vaishnavism in the modern era.', hi: 'श्रील भक्तिविनोद ठाकुर (1838) का प्रकट दिवस, आधुनिक युग में गौड़ीय वैष्णवधर्म के पुनरुद्धारक।' } },

  // Monthly Ekadashis (with Maha Dvadashi rule note)
  { name: { en: 'Putrada Ekadashi', hi: 'पुत्रदा एकादशी' }, date: '2026-01-06', type: 'ekadashi', description: { en: 'Shukla Paksha Ekadashi of Pausha. Grants the boon of worthy progeny.', hi: 'पौष शुक्ल एकादशी। सुयोग्य सन्तान का वरदान।' } },
  { name: { en: 'Sat-tila Ekadashi', hi: 'षट्तिला एकादशी' }, date: '2026-01-20', type: 'ekadashi', description: { en: 'Krishna Paksha Ekadashi of Magha. Six types of sesame are used in the observance.', hi: 'माघ कृष्ण एकादशी। छह प्रकार के तिल का प्रयोग।' } },
  { name: { en: 'Pandava Nirjala Ekadashi', hi: 'पाण्डव निर्जला एकादशी' }, date: '2026-06-06', type: 'ekadashi', description: { en: 'The strictest Ekadashi — complete fast without food or water for 24 hours. Equivalent merit of all 24 Ekadashis. Also known as Bhimseni Ekadashi.', hi: 'सर्वाधिक कठोर एकादशी — 24 घंटे बिना अन्न-जल पूर्ण उपवास। सभी 24 एकादशियों के समान पुण्य। भीमसेनी एकादशी भी कहते हैं।' } },
];

const LABELS = {
  title: { en: 'ISKCON Vaishnava Calendar', hi: 'इस्कॉन वैष्णव पंचांग' },
  subtitle: { en: 'Gaudiya Vaishnava festivals, Ekadashis, and Acharya appearance/disappearance days', hi: 'गौड़ीय वैष्णव पर्व, एकादशी, और आचार्य प्रकट/तिरोभाव दिवस' },
  back: { en: 'Regional Calendars', hi: 'क्षेत्रीय कैलेंडर' },
  gaurabda: { en: 'Gaurabda', hi: 'गौराब्द' },
  about: { en: 'About the ISKCON Calendar', hi: 'इस्कॉन पंचांग के बारे में' },
  aboutText: {
    en: 'The International Society for Krishna Consciousness (ISKCON), founded by His Divine Grace A.C. Bhaktivedanta Swami Prabhupada in 1966, follows the Gaudiya Vaishnava calendar system. This calendar is rooted in the teachings of Sri Chaitanya Mahaprabhu (1486-1534 CE), who is revered as the combined incarnation of Radha and Krishna. The calendar uses the Gaurabda era, counting years from Chaitanya Mahaprabhu\'s appearance in 1486 CE.',
    hi: 'इस्कॉन (International Society for Krishna Consciousness), 1966 में श्रील प्रभुपाद द्वारा स्थापित, गौड़ीय वैष्णव पंचांग प्रणाली का पालन करता है। यह पंचांग श्री चैतन्य महाप्रभु (1486-1534 ई.) की शिक्षाओं पर आधारित है, जिन्हें राधा और कृष्ण का संयुक्त अवतार माना जाता है। पंचांग गौराब्द संवत् का प्रयोग करता है, 1486 ई. में चैतन्य महाप्रभु के प्रकट होने से वर्ष गिनता है।',
  },
  ekadashiRule: { en: 'Ekadashi Rules (Vaishnava)', hi: 'एकादशी नियम (वैष्णव)' },
  ekadashiRuleText: {
    en: 'ISKCON follows stricter Ekadashi rules than Smarta tradition. If the Ekadashi tithi is present for less than 50% of the period between sunrise on Ekadashi day and sunrise on Dvadashi day, the fast is postponed to Dvadashi — called "Maha Dvadashi." This ensures devotees fast on a day when the Ekadashi tithi is astronomically dominant. Additionally, ISKCON devotees avoid all grains and beans on Ekadashi (not just rice), including wheat, corn, mustard, and sesame. The parana (fast-breaking) window is strictly observed between sunrise and one-third of the daytime on Dvadashi.',
    hi: 'इस्कॉन स्मार्त परम्परा से कठोर एकादशी नियमों का पालन करता है। यदि एकादशी तिथि एकादशी दिन के सूर्योदय और द्वादशी दिन के सूर्योदय के बीच 50% से कम समय तक रहती है, तो व्रत द्वादशी पर स्थगित किया जाता है — जिसे "महा द्वादशी" कहते हैं। इसके अतिरिक्त, इस्कॉन भक्त एकादशी पर सभी अनाज और दालों से परहेज करते हैं (केवल चावल नहीं), गेहूं, मक्का, सरसों, तिल सहित।',
  },
  festivals: { en: 'Festivals & Holy Days', hi: 'पर्व एवं पवित्र दिवस' },
  appearance: { en: 'Appearance', hi: 'प्रकट' },
  disappearance: { en: 'Disappearance', hi: 'तिरोभाव' },
  festival: { en: 'Festival', hi: 'पर्व' },
  ekadashi: { en: 'Ekadashi', hi: 'एकादशी' },
  fast: { en: 'Fast', hi: 'उपवास' },
};

const TYPE_COLORS: Record<string, string> = {
  appearance: 'bg-emerald-500/20 text-emerald-400',
  disappearance: 'bg-purple-500/20 text-purple-400',
  festival: 'bg-amber-500/20 text-amber-400',
  ekadashi: 'bg-cyan-500/20 text-cyan-400',
  fast: 'bg-orange-500/20 text-orange-400',
};

const MONTH_NAMES = [
  '', 'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

export default function ISKCONCalendarPage() {
  const locale = useLocale() as Locale;
  const isDev = isDevanagariLocale(locale);
  const L = (key: string) => (LABELS as Record<string, Record<string, string>>)[key]?.[locale] || (LABELS as Record<string, Record<string, string>>)[key]?.en || key;

  // Group events by month
  const byMonth = useMemo(() => {
    const map = new Map<number, ISKCONEvent[]>();
    const sorted = [...ISKCON_EVENTS_2026].sort((a, b) => a.date.localeCompare(b.date));
    for (const evt of sorted) {
      const m = parseInt(evt.date.split('-')[1], 10);
      const arr = map.get(m) || [];
      arr.push(evt);
      map.set(m, arr);
    }
    return map;
  }, []);

  return (
    <main className="min-h-screen bg-bg-primary pt-24 pb-16">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(generateBreadcrumbLD(`/${locale}/calendar/regional/iskcon`, locale)) }} />

      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        {/* Back */}
        <Link href="/regional" className="inline-flex items-center gap-2 text-text-secondary hover:text-gold-light transition-colors mb-6">
          <ArrowLeft className="w-4 h-4" />
          <span>{L('back')}</span>
        </Link>

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
          <div className="inline-flex items-center gap-3 mb-4">
            <Star className="w-8 h-8 text-gold-primary" />
            <h1 className={`text-3xl sm:text-4xl font-bold text-gold-light ${isDev ? 'font-devanagari-heading' : ''}`}>
              {L('title')} 2026
            </h1>
          </div>
          <p className="text-text-secondary max-w-2xl mx-auto">{L('subtitle')}</p>
          <p className="text-gold-primary font-medium mt-2">{L('gaurabda')} {GAURABDA_YEAR}</p>
        </motion.div>

        <GoldDivider className="mb-10" />

        {/* About section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-10 max-w-3xl mx-auto"
        >
          <h2 className={`text-2xl font-bold text-gold-light mb-4 ${isDev ? 'font-devanagari-heading' : ''}`}>
            {L('about')}
          </h2>
          <div className="rounded-2xl border border-gold-primary/12 bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] p-6">
            <p className="text-text-primary leading-relaxed">{L('aboutText')}</p>
          </div>
        </motion.section>

        {/* Ekadashi rule */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="mb-10 max-w-3xl mx-auto"
        >
          <h2 className={`text-2xl font-bold text-gold-light mb-4 ${isDev ? 'font-devanagari-heading' : ''}`}>
            {L('ekadashiRule')}
          </h2>
          <div className="rounded-2xl border border-gold-primary/12 bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] p-6">
            <p className="text-text-primary leading-relaxed">{L('ekadashiRuleText')}</p>
          </div>
        </motion.section>

        <GoldDivider className="mb-10" />

        {/* Events by month */}
        <h2 className={`text-2xl font-bold text-gold-light mb-6 ${isDev ? 'font-devanagari-heading' : ''}`}>
          {L('festivals')} — 2026
        </h2>

        <div className="space-y-8">
          {Array.from(byMonth.entries()).sort(([a], [b]) => a - b).map(([month, events]) => (
            <motion.div
              key={month}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: month * 0.02 }}
            >
              <h3 className="text-lg font-bold text-gold-light mb-3">{MONTH_NAMES[month]} 2026</h3>
              <div className="space-y-3">
                {events.map((evt, i) => {
                  const dateObj = new Date(evt.date + 'T12:00:00');
                  const dayStr = dateObj.toLocaleDateString('en-US', { weekday: 'short', day: 'numeric', month: 'short' });
                  const typeLabel = L(evt.type);
                  const typeColor = TYPE_COLORS[evt.type] || 'bg-gold-primary/20 text-gold-light';

                  return (
                    <div
                      key={i}
                      className="rounded-xl border border-gold-primary/12 bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] p-4 hover:border-gold-primary/30 transition-colors"
                    >
                      <div className="flex flex-wrap items-start justify-between gap-2 mb-2">
                        <div className="flex items-center gap-3">
                          <span className="text-text-secondary text-sm font-mono min-w-[90px]">{dayStr}</span>
                          <h4 className={`text-gold-light font-semibold ${isDev ? 'font-devanagari-heading' : ''}`}>
                            {(evt.name as Record<string, string>)[locale] || evt.name.en}
                          </h4>
                        </div>
                        <span className={`text-xs px-2 py-1 rounded-full font-medium ${typeColor}`}>
                          {typeLabel}
                        </span>
                      </div>
                      <p className="text-text-secondary text-sm leading-relaxed">
                        {(evt.description as Record<string, string>)[locale] || evt.description.en}
                      </p>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          ))}
        </div>

        <GoldDivider className="my-12" />
        <AuthorByline />
      </div>
    </main>
  );
}
