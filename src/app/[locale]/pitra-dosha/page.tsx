'use client';

import { useState } from 'react';
import { useLocale } from 'next-intl';
import { authedFetch } from '@/lib/api/authed-fetch';
import { motion, AnimatePresence } from 'framer-motion';
import GoldDivider from '@/components/ui/GoldDivider';
import { GrahaIconById } from '@/components/icons/GrahaIcons';
import type { Locale, LocaleText } from '@/types/panchang';
import type { KundaliData, PlanetPosition } from '@/types/kundali';
import { tl } from '@/lib/utils/trilingual';
import { isDevanagariLocale } from '@/lib/utils/locale-fonts';
import LocationSearch from '@/components/ui/LocationSearch';
import { getUTCOffsetForDate } from '@/lib/utils/timezone';
import InfoBlock from '@/components/ui/InfoBlock';
import Link from 'next/link';

// ---------------------------------------------------------------------------
// Trilingual labels
// ---------------------------------------------------------------------------

const L = (en: string, hi: string, sa?: string) => ({ en, hi, sa: sa ?? hi });

const LABELS = {
  title: L('Pitra Dosha Checker', 'पितृ दोष जाँच', 'पितृदोषपरीक्षा'),
  subtitle: L(
    'Analyze ancestral karma indicators in your Vedic birth chart',
    'अपनी वैदिक जन्म कुण्डली में पैतृक कर्म संकेतों का विश्लेषण करें',
    'स्वकीयवैदिकजन्मकुण्डल्यां पैतृककर्मसङ्केतान् विश्लेषयतु',
  ),
  date: L('Date of Birth', 'जन्म तिथि', 'जन्मतिथिः'),
  time: L('Time of Birth', 'जन्म समय', 'जन्मसमयः'),
  place: L('Birth Place', 'जन्म स्थान', 'जन्मस्थानम्'),
  analyze: L('Check Pitra Dosha', 'पितृ दोष जाँचें', 'पितृदोषं परीक्षतु'),
  loading: L('Generating chart...', 'कुण्डली बना रहे हैं...', 'कुण्डलीं रचयति...'),
  doshaPresent: L('PITRA DOSHA INDICATORS FOUND', 'पितृ दोष संकेत मिले', 'पितृदोषसङ्केताः प्राप्ताः'),
  doshaAbsent: L('NO PITRA DOSHA INDICATORS', 'पितृ दोष संकेत नहीं मिले', 'पितृदोषसङ्केताः न प्राप्ताः'),
  severity: L('Severity', 'गम्भीरता', 'गम्भीरता'),
  mild: L('Mild', 'सौम्य', 'सौम्यम्'),
  moderate: L('Moderate', 'मध्यम', 'मध्यमम्'),
  severe: L('Severe', 'गम्भीर', 'गम्भीरम्'),
  indicators: L('Dosha Indicators Found', 'पाये गये दोष संकेत', 'प्राप्ताः दोषसङ्केताः'),
  ancestralKarma: L('Ancestral Karma Indications', 'पैतृक कर्म संकेत', 'पैतृककर्मसङ्केताः'),
  remedies: L('Shraddha & Remedies', 'श्राद्ध और उपाय', 'श्राद्धम् उपायाश्च'),
  fullKundali: L('Generate Full Kundali', 'पूर्ण कुण्डली बनाएं', 'सम्पूर्णां कुण्डलीं रचयतु'),
  error: L('Error generating chart. Please try again.', 'कुण्डली बनाने में त्रुटि। पुनः प्रयास करें।', 'कुण्डलीरचनायां दोषः। पुनः प्रयतताम्।'),
};

const t = (label: LocaleText, locale: Locale): string => tl(label, locale);

// ---------------------------------------------------------------------------
// Analysis logic (client-side)
// ---------------------------------------------------------------------------

interface PitraDoshaIndicator {
  label: string;
  severity: 'mild' | 'moderate' | 'severe';
}

interface PitraDoshaResult {
  present: boolean;
  indicators: PitraDoshaIndicator[];
  severity: 'mild' | 'moderate' | 'severe';
  ancestralNotes: string[];
}

function analyzePitraDosha(kundali: KundaliData, locale: Locale): PitraDoshaResult {
  const sun = kundali.planets.find(p => p.planet.id === 0);
  const moon = kundali.planets.find(p => p.planet.id === 1);
  const rahu = kundali.planets.find(p => p.planet.id === 7);
  const saturn = kundali.planets.find(p => p.planet.id === 6);
  const jupiter = kundali.planets.find(p => p.planet.id === 5);

  if (!sun || !rahu || !saturn) {
    return { present: false, indicators: [], severity: 'mild', ancestralNotes: [] };
  }

  const indicators: PitraDoshaIndicator[] = [];
  const ancestralNotes: string[] = [];

  // Check: Sun conjunct Rahu (within same sign/house)
  if (sun.house === rahu.house) {
    indicators.push({
      label: t(L(
        `Sun conjunct Rahu in House ${sun.house} — primary Pitra Dosha indicator. Father's lineage carries unresolved karma.`,
        `सूर्य और राहु भाव ${sun.house} में युत — प्रमुख पितृ दोष संकेत। पिता की वंशावली में अनसुलझा कर्म।`,
        `सूर्यराहू भावे ${sun.house} युतौ — प्रमुखः पितृदोषसङ्केतः।`,
      ), locale),
      severity: 'severe',
    });
    ancestralNotes.push(t(L(
      'Paternal ancestors may have unfinished dharmic obligations. Shraddha rituals for the paternal lineage are strongly indicated.',
      'पैतृक पूर्वजों के अधूरे धार्मिक दायित्व हो सकते हैं। पैतृक वंश के लिए श्राद्ध अनुष्ठान अत्यन्त आवश्यक।',
      'पैतृकपूर्वजानां अपूर्णानि धार्मिकदायित्वानि स्युः। पैतृकवंशाय श्राद्धानुष्ठानम् अत्यावश्यकम्।',
    ), locale));
  }

  // Check: Sun aspected by Rahu (Rahu aspects 5th, 7th, 9th from its position)
  if (sun.house !== rahu.house) {
    const diff = ((sun.house - rahu.house + 12) % 12);
    if (diff === 4 || diff === 6 || diff === 8) { // 5th, 7th, 9th aspect
      indicators.push({
        label: t(L(
          `Sun aspected by Rahu — Rahu's shadow falls on the soul indicator. Ancestral karma influencing this life.`,
          `सूर्य पर राहु की दृष्टि — आत्मा पर राहु की छाया। पैतृक कर्म इस जीवन को प्रभावित कर रहा है।`,
          `सूर्ये राहोः दृष्टिः — आत्मसूचके राहोः छाया। पैतृककर्म एतत्जीवनं प्रभावयति।`,
        ), locale),
        severity: 'moderate',
      });
    }
  }

  // Check: 9th house affliction (malefics in 9th)
  const ninthHouseNum = 9;
  const planetsIn9th = kundali.planets.filter(p => p.house === ninthHouseNum);
  const maleficsIn9th = planetsIn9th.filter(p => [0, 3, 6, 7, 8].includes(p.planet.id)); // Sun, Mars, Saturn, Rahu, Ketu
  if (maleficsIn9th.length >= 2) {
    const names = maleficsIn9th.map(p => tl(p.planet.name, locale)).join(', ');
    indicators.push({
      label: t(L(
        `Multiple malefics (${names}) in 9th house (house of father/dharma) — strong affliction to ancestral karma house.`,
        `9वें भाव (पिता/धर्म का भाव) में एकाधिक पापग्रह (${names}) — पैतृक कर्म भाव पर तीव्र पीड़ा।`,
        `नवमभावे (पितृधर्मभावे) बहवः पापग्रहाः (${names}) — पैतृककर्मभावे तीव्रपीडा।`,
      ), locale),
      severity: 'severe',
    });
    ancestralNotes.push(t(L(
      'The 9th house represents your father, guru, and accumulated dharma from past lives. Its affliction suggests ancestors seeking peace through proper rituals.',
      '9वाँ भाव पिता, गुरु और पूर्वजन्मों के संचित धर्म का प्रतिनिधि है। इसकी पीड़ा पूर्वजों द्वारा उचित अनुष्ठानों से शान्ति चाहने का संकेत है।',
      'नवमभावः पितरं गुरुं पूर्वजन्मसञ्चितधर्मं च दर्शयति।',
    ), locale));
  } else if (maleficsIn9th.length === 1) {
    const name = tl(maleficsIn9th[0].planet.name, locale);
    indicators.push({
      label: t(L(
        `${name} in 9th house — mild affliction to the house of father and dharma.`,
        `${name} 9वें भाव में — पिता और धर्म के भाव पर हल्की पीड़ा।`,
        `${name} नवमभावे — पितृधर्मभावे सौम्यपीडा।`,
      ), locale),
      severity: 'mild',
    });
  }

  // Check: Sun-Saturn conjunction
  if (sun.house === saturn.house) {
    indicators.push({
      label: t(L(
        `Sun conjunct Saturn in House ${sun.house} — father-son karmic tension. Saturn (karma) restricts Sun (father/soul).`,
        `सूर्य और शनि भाव ${sun.house} में युत — पिता-पुत्र कर्म तनाव। शनि (कर्म) सूर्य (पिता/आत्मा) को प्रतिबन्धित करता है।`,
        `सूर्यशनी भावे ${sun.house} युतौ — पितृपुत्रकर्मतनावः।`,
      ), locale),
      severity: 'moderate',
    });
    ancestralNotes.push(t(L(
      'This conjunction often indicates that the father faced hardships, or there is karmic debt related to paternal authority figures. Regular Surya and Shani Puja helps.',
      'यह युति प्रायः दर्शाती है कि पिता ने कठिनाइयों का सामना किया, या पैतृक अधिकार व्यक्तियों से कर्मऋण है। नियमित सूर्य और शनि पूजा सहायक है।',
      'एषा युतिः प्रायः दर्शयति पिता कष्टान् अनुभवत् इति।',
    ), locale));
  }

  // Check: 9th lord debilitated or combust
  if (jupiter) {
    // Simplified: if Jupiter (natural karaka for 9th) is debilitated or combust
    if (jupiter.isDebilitated) {
      indicators.push({
        label: t(L(
          'Jupiter (karaka for father/dharma) debilitated — weakened protection from ancestral blessings.',
          'गुरु (पिता/धर्म का कारक) नीच — पैतृक आशीर्वाद का कमजोर संरक्षण।',
          'गुरुः (पितृधर्मकारकः) नीचस्थः — पैतृकाशीर्वादस्य दुर्बलसंरक्षणम्।',
        ), locale),
        severity: 'moderate',
      });
    }
    if (jupiter.isCombust) {
      indicators.push({
        label: t(L(
          'Jupiter combust (too close to Sun) — the guru/father principle is overshadowed.',
          'गुरु अस्त (सूर्य के अत्यन्त निकट) — गुरु/पिता तत्व छाया में।',
          'गुरुः अस्तः (सूर्यस्य अत्यन्तसमीपे) — गुरुपितृतत्त्वं छायायाम्।',
        ), locale),
        severity: 'mild',
      });
    }
  }

  // Rahu in 9th house specifically
  if (rahu.house === 9) {
    indicators.push({
      label: t(L(
        'Rahu directly in the 9th house — strongest single indicator of Pitra Dosha. Ancestral karma is the dominant theme of this life.',
        'राहु सीधे 9वें भाव में — पितृ दोष का सबसे प्रबल एकल संकेत। पैतृक कर्म इस जीवन का प्रमुख विषय है।',
        'राहुः साक्षात् नवमभावे — पितृदोषस्य सर्वप्रबलः एकसङ्केतः।',
      ), locale),
      severity: 'severe',
    });
    ancestralNotes.push(t(L(
      'Rahu in 9th demands that you actively resolve ancestral obligations. Pilgrimage to Gaya for Pind Daan is traditionally the most powerful remedy for this placement.',
      'राहु 9वें भाव में होने पर पैतृक दायित्वों को सक्रिय रूप से निभाने की माँग करता है। गया में पिण्ड दान इस स्थिति का सबसे शक्तिशाली पारम्परिक उपाय है।',
      'नवमभावस्थः राहुः पैतृकदायित्वानि सक्रियतया निर्वर्तयितुं माँदयति। गयायां पिण्डदानम् अस्य स्थानस्य सर्वशक्तिमान् उपायः।',
    ), locale));
  }

  const present = indicators.length > 0;
  const maxSeverity = indicators.reduce<'mild' | 'moderate' | 'severe'>((acc, ind) => {
    if (ind.severity === 'severe') return 'severe';
    if (ind.severity === 'moderate' && acc !== 'severe') return 'moderate';
    return acc;
  }, 'mild');

  return {
    present,
    indicators,
    severity: maxSeverity,
    ancestralNotes,
  };
}

// ---------------------------------------------------------------------------
// Remedies
// ---------------------------------------------------------------------------

const REMEDIES: { title: LocaleText; description: LocaleText }[] = [
  { title: L('Pitru Paksha Shraddha', 'पितृ पक्ष श्राद्ध', 'पितृपक्षश्राद्धम्'), description: L('Perform Shraddha rituals during the 16-day Pitru Paksha period (Bhadrapada/Ashwin Krishna Paksha). This is the most important annual ancestral offering.', 'पितृ पक्ष (भाद्रपद/आश्विन कृष्ण पक्ष) की 16 दिन की अवधि में श्राद्ध करें। यह सबसे महत्वपूर्ण वार्षिक पैतृक अर्पण है।', 'पितृपक्षस्य षोडशदिनावधौ श्राद्धं कुर्यात्।') },
  { title: L('Pind Daan at Gaya', 'गया में पिण्ड दान', 'गयायां पिण्डदानम्'), description: L('Offer Pind Daan at Gaya (Bihar) or Varanasi — the most sacred sites for ancestral liberation. Tripindi Shraddha for forgotten ancestors is especially powerful.', 'गया (बिहार) या वाराणसी में पिण्ड दान करें — पैतृक मोक्ष के लिए सबसे पवित्र स्थल। भूले हुए पूर्वजों के लिए त्रिपिण्डी श्राद्ध विशेष शक्तिशाली है।', 'गयायां (बिहारप्रदेशे) काश्यां वा पिण्डदानं कुर्यात्।') },
  { title: L('Narayan Nagbali Puja', 'नारायण नागबलि पूजा', 'नारायणनागबलिपूजा'), description: L('Perform at Trimbakeshwar, Nashik — a three-day ritual specifically for resolving Pitra Dosha and unnatural death karma in the family.', 'त्र्यम्बकेश्वर, नासिक में करें — पितृ दोष और परिवार में अकाल मृत्यु कर्म के लिए तीन दिवसीय विशेष अनुष्ठान।', 'त्र्यम्बकेश्वरे करणीयम् — पितृदोषनिवारणाय त्रिदिवसीयम् अनुष्ठानम्।') },
  { title: L('Amavasya Tarpan', 'अमावस्या तर्पण', 'अमावास्यातर्पणम्'), description: L('Offer water (Tarpan) with black sesame seeds to ancestors on every Amavasya (new moon day), facing south. This regular practice maintains ancestral peace.', 'प्रत्येक अमावस्या को दक्षिण दिशा की ओर मुख कर काले तिल के साथ पूर्वजों को जल (तर्पण) अर्पित करें।', 'प्रत्येकाम् अमावास्यायां दक्षिणाभिमुखं कृष्णतिलसहितं पूर्वजेभ्यः जलं (तर्पणम्) अर्पयेत्।') },
  { title: L('Feed Brahmins and Crows', 'ब्राह्मण और कौओं को भोजन', 'ब्राह्मणकाकभोजनम्'), description: L('Feed Brahmins during Shraddha ceremonies. Also feed crows (considered messengers of ancestors) with cooked rice before your own meal, especially during Pitru Paksha.', 'श्राद्ध के समय ब्राह्मणों को भोजन कराएं। कौओं (पूर्वजों के दूत माने जाते हैं) को पकी चावल विशेषकर पितृ पक्ष में खिलाएं।', 'श्राद्धकाले ब्राह्मणान् भोजयेत्। काकान् (पितृदूतान्) पक्वतण्डुलैः पोषयेत्।') },
  { title: L('Surya and Rahu Mantras', 'सूर्य और राहु मन्त्र', 'सूर्यराहुमन्त्राः'), description: L('Chant "Om Suryaya Namah" (7,000 times) and "Om Rahave Namah" (18,000 times). Offer water to the Sun at sunrise daily (Surya Arghya).', '"ॐ सूर्याय नमः" (7,000 बार) और "ॐ राहवे नमः" (18,000 बार) जप करें। प्रतिदिन सूर्योदय पर सूर्य को अर्घ्य दें।', '"ॐ सूर्याय नमः" (७,००० वारम्) "ॐ राहवे नमः" (१८,००० वारम्) च जपेत्। प्रतिदिनं सूर्योदये सूर्याय अर्घ्यं ददातु।') },
];

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function PitraDoshaPage() {
  const locale = useLocale() as Locale;
  const isDevanagari = isDevanagariLocale(locale);
  const headingFont = isDevanagari ? { fontFamily: 'var(--font-devanagari-heading)' } : { fontFamily: 'var(--font-heading)' };
  const bodyFont = isDevanagari ? { fontFamily: 'var(--font-devanagari-body)' } : undefined;

  const [birthDate, setBirthDate] = useState('');
  const [birthTime, setBirthTime] = useState('');
  const [birthPlace, setBirthPlace] = useState('');
  const [birthLat, setBirthLat] = useState<number | null>(null);
  const [birthLng, setBirthLng] = useState<number | null>(null);
  const [birthTimezone, setBirthTimezone] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState<PitraDoshaResult | null>(null);

  const handleAnalyze = async () => {
    if (!birthDate || !birthTime || !birthLat || !birthLng || !birthTimezone) return;
    setLoading(true);
    setError('');
    setResult(null);
    try {
      const [y, m, d] = birthDate.split('-').map(Number);
      const tzOffset = getUTCOffsetForDate(y, m, d, birthTimezone);
      const res = await authedFetch('/api/kundali', {
        method: 'POST',
        body: JSON.stringify({
          name: '',
          date: birthDate,
          time: birthTime,
          place: birthPlace,
          lat: birthLat,
          lng: birthLng,
          timezone: String(tzOffset),
          ayanamsha: 'lahiri',
        }),
      });
      if (!res.ok) throw new Error('API error');
      const kundali: KundaliData = await res.json();
      const analysis = analyzePitraDosha(kundali, locale);
      setResult(analysis);
    } catch {
      setError(t(LABELS.error, locale));
    } finally {
      setLoading(false);
    }
  };

  const fadeUp = { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.5 } };
  const canSubmit = birthDate && birthTime && birthLat && birthLng && birthTimezone && !loading;

  const severityColor = (s: string) => s === 'severe' ? 'text-red-400' : s === 'moderate' ? 'text-orange-400' : 'text-emerald-400';
  const severityBg = (s: string) => s === 'severe' ? 'bg-red-500/15' : s === 'moderate' ? 'bg-orange-500/15' : 'bg-emerald-500/15';
  const severityBorder = (s: string) => s === 'severe' ? 'border-red-500/30' : s === 'moderate' ? 'border-orange-500/30' : 'border-emerald-500/30';

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <motion.div {...fadeUp} className="text-center mb-12">
        <div className="flex justify-center gap-3 mb-6">
          <GrahaIconById id={0} size={64} />
          <GrahaIconById id={7} size={64} />
        </div>
        <h1 className="text-5xl sm:text-6xl font-bold mb-4" style={headingFont}>
          <span className="text-gold-gradient">{t(LABELS.title, locale)}</span>
        </h1>
        <p className="text-text-secondary text-lg max-w-2xl mx-auto" style={bodyFont}>{t(LABELS.subtitle, locale)}</p>
      </motion.div>

      <InfoBlock id="pitra-dosha-intro" title={locale === 'en' ? 'What is Pitra Dosha?' : 'पितृ दोष क्या है?'} defaultOpen>
        {locale === 'en' ? (
          <div className="space-y-3">
            <p><strong>Pitra Dosha</strong> is a karmic condition in Vedic astrology indicating unresolved obligations from one&apos;s ancestors. It is <strong>not a curse</strong> — it is a reflection of ancestral karma that needs to be addressed through proper rituals and awareness.</p>
            <p><strong>Primary indicator:</strong> Sun conjunct or aspected by Rahu, especially involving the 9th house (house of father, dharma, and past-life merit). The Sun represents the father and soul; Rahu represents karmic debt and shadow. Their combination in key houses indicates ancestral obligations.</p>
            <p><strong>Other indicators:</strong> Malefics in the 9th house, Sun-Saturn conjunction, debilitated Jupiter, and Rahu in the 9th house are also examined.</p>
            <p>Effects can include: career obstacles, progeny difficulties, recurring family problems, and a feeling of being held back despite effort. Shraddha rituals are the primary remedy.</p>
          </div>
        ) : (
          <div className="space-y-3">
            <p><strong>पितृ दोष</strong> वैदिक ज्योतिष में पूर्वजों से जुड़े अनसुलझे दायित्वों का कर्म संकेत है। यह <strong>श्राप नहीं</strong> है — यह पैतृक कर्म का प्रतिबिम्ब है जिसे उचित अनुष्ठानों से सम्बोधित करने की आवश्यकता है।</p>
            <p><strong>प्रमुख संकेतक:</strong> सूर्य पर राहु की युति या दृष्टि, विशेषकर 9वें भाव (पिता, धर्म और पूर्वजन्म पुण्य का भाव) से सम्बन्धित।</p>
            <p><strong>अन्य संकेतक:</strong> 9वें भाव में पापग्रह, सूर्य-शनि युति, नीच गुरु और 9वें भाव में राहु।</p>
            <p>प्रभाव: कैरियर बाधाएं, सन्तान कठिनाई, आवर्ती पारिवारिक समस्याएं। श्राद्ध अनुष्ठान प्रमुख उपाय है।</p>
          </div>
        )}
      </InfoBlock>

      <GoldDivider className="my-10" />

      {/* Birth Input Form */}
      <motion.div {...fadeUp} className="bg-bg-secondary/60 rounded-2xl border border-gold-dark/20 p-6 sm:p-8 mb-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label className="block text-text-secondary text-sm mb-1.5" style={bodyFont}>{t(LABELS.date, locale)}</label>
            <input type="date" value={birthDate} onChange={e => setBirthDate(e.target.value)}
              className="w-full bg-bg-primary border border-gold-dark/30 rounded-lg px-4 py-2.5 text-text-primary focus:border-gold-primary focus:outline-none" />
          </div>
          <div>
            <label className="block text-text-secondary text-sm mb-1.5" style={bodyFont}>{t(LABELS.time, locale)}</label>
            <input type="time" value={birthTime} onChange={e => setBirthTime(e.target.value)}
              className="w-full bg-bg-primary border border-gold-dark/30 rounded-lg px-4 py-2.5 text-text-primary focus:border-gold-primary focus:outline-none" />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-text-secondary text-sm mb-1.5" style={bodyFont}>{t(LABELS.place, locale)}</label>
            <LocationSearch
              value={birthPlace}
              onSelect={(place) => {
                setBirthPlace(place.name);
                setBirthLat(place.lat);
                setBirthLng(place.lng);
                setBirthTimezone(place.timezone ?? null);
              }}
            />
          </div>
        </div>
        <button
          onClick={handleAnalyze}
          disabled={!canSubmit}
          className="mt-6 w-full py-3 rounded-xl font-bold text-lg transition-all duration-200 bg-gold-primary/20 text-gold-light border border-gold-primary/30 hover:bg-gold-primary/30 disabled:opacity-40 disabled:cursor-not-allowed"
          style={bodyFont}
        >
          {loading ? t(LABELS.loading, locale) : t(LABELS.analyze, locale)}
        </button>
        {error && <p className="mt-3 text-red-400 text-sm text-center">{error}</p>}
      </motion.div>

      {/* Results */}
      <AnimatePresence mode="wait">
        {result && (
          <motion.div key="result" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.5 }}>
            {/* Status Banner */}
            <div className={`rounded-2xl border p-6 mb-8 text-center ${result.present ? 'bg-red-500/10 border-red-500/30' : 'bg-emerald-500/10 border-emerald-500/30'}`}>
              <div className={`text-3xl font-bold mb-2 ${result.present ? 'text-red-400' : 'text-emerald-400'}`} style={headingFont}>
                {result.present ? t(LABELS.doshaPresent, locale) : t(LABELS.doshaAbsent, locale)}
              </div>
              {result.present && (
                <div className="flex items-center justify-center gap-3 mt-3">
                  <span className="text-text-secondary text-sm" style={bodyFont}>{t(LABELS.severity, locale)}:</span>
                  <span className={`px-3 py-1 rounded-full text-sm font-bold border ${severityBg(result.severity)} ${severityColor(result.severity)} ${severityBorder(result.severity)}`} style={bodyFont}>
                    {result.severity === 'severe' ? t(LABELS.severe, locale) : result.severity === 'moderate' ? t(LABELS.moderate, locale) : t(LABELS.mild, locale)}
                  </span>
                </div>
              )}
            </div>

            {result.present && (
              <>
                {/* Indicators */}
                <div className="bg-bg-secondary/60 rounded-2xl border border-gold-dark/20 p-6 mb-6">
                  <h2 className="text-xl font-bold text-gold-light mb-4" style={headingFont}>{t(LABELS.indicators, locale)}</h2>
                  <div className="space-y-3">
                    {result.indicators.map((ind, i) => (
                      <div key={i} className={`border rounded-xl p-4 ${severityBg(ind.severity)} ${severityBorder(ind.severity)}`}>
                        <div className="flex items-start gap-2">
                          <span className={`mt-0.5 font-bold ${severityColor(ind.severity)}`}>
                            {ind.severity === 'severe' ? '!!!' : ind.severity === 'moderate' ? '!!' : '!'}
                          </span>
                          <span className="text-text-primary text-sm" style={bodyFont}>{ind.label}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Ancestral Karma Notes */}
                {result.ancestralNotes.length > 0 && (
                  <div className="bg-purple-500/5 rounded-2xl border border-purple-500/20 p-6 mb-6">
                    <h2 className="text-xl font-bold text-purple-400 mb-4" style={headingFont}>{t(LABELS.ancestralKarma, locale)}</h2>
                    <div className="space-y-3">
                      {result.ancestralNotes.map((note, i) => (
                        <p key={i} className="text-text-primary text-sm leading-relaxed" style={bodyFont}>{note}</p>
                      ))}
                    </div>
                  </div>
                )}

                {/* Remedies */}
                <div className="bg-bg-secondary/60 rounded-2xl border border-gold-dark/20 p-6 mb-6">
                  <h2 className="text-xl font-bold text-gold-light mb-4" style={headingFont}>{t(LABELS.remedies, locale)}</h2>
                  <div className="space-y-4">
                    {REMEDIES.map((r, i) => (
                      <div key={i} className="bg-gold-primary/5 border border-gold-primary/15 rounded-xl p-4">
                        <div className="text-gold-light font-bold mb-1" style={bodyFont}>{t(r.title, locale)}</div>
                        <div className="text-text-secondary text-sm" style={bodyFont}>{t(r.description, locale)}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}

            {/* CTA */}
            <div className="text-center mt-10">
              <Link href={`/${locale}/kundali`}
                className="inline-block px-8 py-3 rounded-xl font-bold text-lg bg-gold-primary/20 text-gold-light border border-gold-primary/30 hover:bg-gold-primary/30 transition-all"
                style={bodyFont}
              >
                {t(LABELS.fullKundali, locale)}
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
