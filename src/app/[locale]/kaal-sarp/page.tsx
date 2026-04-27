'use client';

import { useState } from 'react';
import { useLocale } from 'next-intl';
import { authedFetch } from '@/lib/api/authed-fetch';
import { motion, AnimatePresence } from 'framer-motion';
import GoldDivider from '@/components/ui/GoldDivider';
import { GrahaIconById } from '@/components/icons/GrahaIcons';
import type { Locale, LocaleText } from '@/types/panchang';
import type { KundaliData } from '@/types/kundali';
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
  title: L('Kaal Sarp Dosha Calculator', 'काल सर्प दोष गणक', 'कालसर्पदोषगणकम्'),
  subtitle: L(
    'Check if all planets are hemmed between the Rahu-Ketu axis in your chart',
    'जानें कि क्या सभी ग्रह राहु-केतु अक्ष के एक ओर हैं',
    'सर्वे ग्रहाः राहुकेत्वक्षस्य एकत्र स्थिताः किं वेति जानीयात्',
  ),
  date: L('Date of Birth', 'जन्म तिथि', 'जन्मतिथिः'),
  time: L('Time of Birth', 'जन्म समय', 'जन्मसमयः'),
  place: L('Birth Place', 'जन्म स्थान', 'जन्मस्थानम्'),
  analyze: L('Check Kaal Sarp Dosha', 'काल सर्प दोष जाँचें', 'कालसर्पदोषं परीक्षतु'),
  loading: L('Generating chart...', 'कुण्डली बना रहे हैं...', 'कुण्डलीं रचयति...'),
  doshaPresent: L('KAAL SARP DOSHA PRESENT', 'काल सर्प दोष है', 'कालसर्पदोषः विद्यते'),
  doshaAbsent: L('NO KAAL SARP DOSHA', 'काल सर्प दोष नहीं है', 'कालसर्पदोषः नास्ति'),
  partial: L('PARTIAL KAAL SARP', 'आंशिक काल सर्प', 'आंशिककालसर्पः'),
  type: L('Type', 'प्रकार', 'प्रकारः'),
  rahuIn: L('Rahu in House', 'राहु भाव में', 'राहुः भावे'),
  ketuIn: L('Ketu in House', 'केतु भाव में', 'केतुः भावे'),
  effects: L('Effects of This Type', 'इस प्रकार के प्रभाव', 'अस्य प्रकारस्य प्रभावाः'),
  severity: L('Severity', 'गम्भीरता', 'गम्भीरता'),
  mild: L('Mild', 'सौम्य', 'सौम्यम्'),
  moderate: L('Moderate', 'मध्यम', 'मध्यमम्'),
  severe: L('Severe', 'गम्भीर', 'गम्भीरम्'),
  remedies: L('Remedies', 'उपाय', 'उपायाः'),
  fullKundali: L('Generate Full Kundali', 'पूर्ण कुण्डली बनाएं', 'सम्पूर्णां कुण्डलीं रचयतु'),
  error: L('Error generating chart. Please try again.', 'कुण्डली बनाने में त्रुटि। पुनः प्रयास करें।', 'कुण्डलीरचनायां दोषः। पुनः प्रयतताम्।'),
};

const t = (label: LocaleText, locale: Locale): string => tl(label, locale);

// ---------------------------------------------------------------------------
// 12 types of Kaal Sarp Dosha
// ---------------------------------------------------------------------------

interface KaalSarpType {
  name: LocaleText;
  rahuHouse: number;
  ketuHouse: number;
  effects: LocaleText;
}

const KAAL_SARP_TYPES: KaalSarpType[] = [
  { name: L('Anant Kaal Sarp', 'अनन्त काल सर्प', 'अनन्तकालसर्पः'), rahuHouse: 1, ketuHouse: 7, effects: L('Obstacles in personal life and partnerships. Health issues but strong willpower. Can achieve great things after overcoming initial struggles.', 'व्यक्तिगत जीवन और साझेदारी में बाधाएं। स्वास्थ्य समस्या किन्तु दृढ़ इच्छाशक्ति।', 'व्यक्तिगतजीवने साझेदार्यां च बाधाः।') },
  { name: L('Kulik Kaal Sarp', 'कुलिक काल सर्प', 'कुलिककालसर्पः'), rahuHouse: 2, ketuHouse: 8, effects: L('Financial instability and speech-related issues. Sudden events affect wealth. Family tensions possible but occult knowledge may develop.', 'आर्थिक अस्थिरता और वाणी सम्बन्धी समस्या। अचानक घटनाएं धन प्रभावित करें।', 'आर्थिकास्थिरता वाक्सम्बन्धिसमस्या च।') },
  { name: L('Vasuki Kaal Sarp', 'वासुकि काल सर्प', 'वासुकिकालसर्पः'), rahuHouse: 3, ketuHouse: 9, effects: L('Challenges with siblings and short travels. Luck may come late. Spiritual growth through hardships.', 'भाई-बहन और छोटी यात्राओं में चुनौतियाँ। भाग्य देर से आ सकता है।', 'भ्रातृषु लघुयात्रासु च आव्हानानि।') },
  { name: L('Shankhpal Kaal Sarp', 'शंखपाल काल सर्प', 'शंखपालकालसर्पः'), rahuHouse: 4, ketuHouse: 10, effects: L('Domestic unrest and career fluctuations. Mother\'s health may be affected. Property disputes possible but eventual professional recognition.', 'गृह अशान्ति और कैरियर उतार-चढ़ाव। माता के स्वास्थ्य पर प्रभाव।', 'गृहाशान्तिः वृत्तिविचलनं च।') },
  { name: L('Padma Kaal Sarp', 'पद्म काल सर्प', 'पद्मकालसर्पः'), rahuHouse: 5, ketuHouse: 11, effects: L('Difficulties with children and speculative investments. Delayed gains. Creative talents emerge through struggle.', 'सन्तान और सट्टा निवेश में कठिनाई। लाभ में विलम्ब। संघर्ष से रचनात्मक प्रतिभा।', 'सन्ततिषु सट्टानिवेशे च कठिनता।') },
  { name: L('Mahapadma Kaal Sarp', 'महापद्म काल सर्प', 'महापद्मकालसर्पः'), rahuHouse: 6, ketuHouse: 12, effects: L('Hidden enemies and health challenges. Legal troubles possible. But strong ability to overcome adversaries. Spiritual inclination.', 'छिपे शत्रु और स्वास्थ्य चुनौतियाँ। कानूनी परेशानी सम्भव। शत्रुओं पर विजय की क्षमता।', 'गुप्तशत्रवः स्वास्थ्यसमस्याश्च।') },
  { name: L('Takshak Kaal Sarp', 'तक्षक काल सर्प', 'तक्षककालसर्पः'), rahuHouse: 7, ketuHouse: 1, effects: L('Marital discord and partnership troubles. Spouse may have health issues. Strong personality but relationship challenges.', 'वैवाहिक कलह और साझेदारी समस्या। जीवनसाथी को स्वास्थ्य समस्या। दृढ़ व्यक्तित्व किन्तु सम्बन्ध चुनौतियाँ।', 'वैवाहिककलहः साझेदारीसमस्या च।') },
  { name: L('Karkotak Kaal Sarp', 'कर्कोटक काल सर्प', 'कर्कोटककालसर्पः'), rahuHouse: 8, ketuHouse: 2, effects: L('Sudden transformations and family wealth disruptions. Accidents possible. But deep occult knowledge and transformation ability.', 'अचानक परिवर्तन और पारिवारिक धन बाधा। दुर्घटना सम्भव। किन्तु गहन तान्त्रिक ज्ञान।', 'आकस्मिकपरिवर्तनानि कुटुम्बधनबाधा च।') },
  { name: L('Shankhachud Kaal Sarp', 'शंखचूड काल सर्प', 'शंखचूडकालसर्पः'), rahuHouse: 9, ketuHouse: 3, effects: L('Luck comes with effort. Father\'s health may be affected. Foreign connections beneficial. Spiritual wisdom develops late.', 'भाग्य प्रयास से आता है। पिता का स्वास्थ्य प्रभावित। विदेशी सम्पर्क लाभदायक।', 'भाग्यं प्रयत्नेन आगच्छति।') },
  { name: L('Ghatak Kaal Sarp', 'घातक काल सर्प', 'घातककालसर्पः'), rahuHouse: 10, ketuHouse: 4, effects: L('Career obstacles and domestic instability. Political or professional enemies. But eventual rise to power through perseverance.', 'कैरियर बाधाएं और गृह अस्थिरता। राजनीतिक शत्रु। किन्तु दृढ़ता से अन्ततः सत्ता प्राप्ति।', 'वृत्तिबाधाः गृहास्थिरता च।') },
  { name: L('Vishdhar Kaal Sarp', 'विषधर काल सर्प', 'विषधरकालसर्पः'), rahuHouse: 11, ketuHouse: 5, effects: L('Gains come with strings attached. Children may cause anxiety. Elder siblings may be troublesome. But network and social success.', 'लाभ शर्तों के साथ। सन्तान चिन्ता दे सकती है। किन्तु सामाजिक सफलता।', 'लाभाः शर्तैः सह आगच्छन्ति।') },
  { name: L('Sheshnaag Kaal Sarp', 'शेषनाग काल सर्प', 'शेषनागकालसर्पः'), rahuHouse: 12, ketuHouse: 6, effects: L('Expenditure exceeds income. Sleep disturbances and hidden fears. But strong spiritual potential and liberation tendencies.', 'व्यय आय से अधिक। नींद बाधा और छिपे भय। किन्तु प्रबल आध्यात्मिक सम्भावना।', 'व्ययः आयात् अधिकः।') },
];

// ---------------------------------------------------------------------------
// Analysis logic (client-side)
// ---------------------------------------------------------------------------

interface KaalSarpResult {
  present: boolean;
  partial: boolean; // one planet outside axis
  typeName: string;
  typeEffects: string;
  rahuHouse: number;
  ketuHouse: number;
  severity: 'mild' | 'moderate' | 'severe';
  planetsOutside: string[];
}

function analyzeKaalSarp(kundali: KundaliData, locale: Locale): KaalSarpResult {
  const rahu = kundali.planets.find(p => p.planet.id === 7);
  const ketu = kundali.planets.find(p => p.planet.id === 8);

  if (!rahu || !ketu) {
    return { present: false, partial: false, typeName: '', typeEffects: '', rahuHouse: 0, ketuHouse: 0, severity: 'mild', planetsOutside: [] };
  }

  const rahuHouse = rahu.house;
  const ketuHouse = ketu.house;
  const rahuLong = rahu.longitude;
  const ketuLong = ketu.longitude;

  // Get the 7 main planets (Sun=0 through Saturn=6)
  const mainPlanets = kundali.planets.filter(p => p.planet.id >= 0 && p.planet.id <= 6);

  // Check if all planets are on one side of Rahu-Ketu axis
  // We check angular distance: planets should all be within the 180-degree arc from Rahu to Ketu (going one direction)
  const rahuToKetu = ((ketuLong - rahuLong + 360) % 360); // arc from Rahu to Ketu going forward

  let allOneSide = true;
  let outsideCount = 0;
  const planetsOutside: string[] = [];

  for (const planet of mainPlanets) {
    const fromRahu = ((planet.longitude - rahuLong + 360) % 360);
    // Planet should be between Rahu and Ketu in one direction (0 to rahuToKetu)
    // or between Ketu and Rahu (rahuToKetu to 360)
    // We check both arcs and see if all fall in one
    if (fromRahu > rahuToKetu && fromRahu < 360) {
      // This planet is outside the Rahu-to-Ketu arc
      outsideCount++;
      planetsOutside.push(tl(planet.planet.name, locale));
    }
  }

  // If no planets outside, they're all between Rahu and Ketu (one direction)
  // If all outside, they're all between Ketu and Rahu (other direction) — still Kaal Sarp
  if (outsideCount === mainPlanets.length) {
    // All on the other side — still valid Kaal Sarp
    allOneSide = true;
    planetsOutside.length = 0;
    outsideCount = 0;
  }

  const present = outsideCount === 0;
  const partial = outsideCount === 1;

  // Find the type based on Rahu's house
  const matchedType = KAAL_SARP_TYPES.find(ks => ks.rahuHouse === rahuHouse);
  const typeName = matchedType ? t(matchedType.name, locale) : `Rahu H${rahuHouse} / Ketu H${ketuHouse}`;
  const typeEffects = matchedType ? t(matchedType.effects, locale) : '';

  // Severity: Rahu in angles (1,4,7,10) = severe, trines (5,9) = moderate, else mild
  const angularHouses = [1, 4, 7, 10];
  const trineHouses = [5, 9];
  const severity: 'mild' | 'moderate' | 'severe' = angularHouses.includes(rahuHouse) ? 'severe'
    : trineHouses.includes(rahuHouse) ? 'moderate' : 'mild';

  return {
    present: present || partial,
    partial,
    typeName,
    typeEffects,
    rahuHouse,
    ketuHouse,
    severity: partial ? 'mild' : severity,
    planetsOutside,
  };
}

// ---------------------------------------------------------------------------
// Remedies
// ---------------------------------------------------------------------------

const REMEDIES: { title: LocaleText; description: LocaleText }[] = [
  { title: L('Kaal Sarp Dosha Nivaran Puja', 'काल सर्प दोष निवारण पूजा', 'कालसर्पदोषनिवारणपूजा'), description: L('Perform at Trimbakeshwar (Nashik) or Mahakaleshwar (Ujjain) — the most powerful traditional remedy', 'त्र्यम्बकेश्वर (नासिक) या महाकालेश्वर (उज्जैन) में करें — सबसे शक्तिशाली पारम्परिक उपाय', 'त्र्यम्बकेश्वरे महाकालेश्वरे वा कुर्यात्') },
  { title: L('Rahu-Ketu Mantras', 'राहु-केतु मन्त्र', 'राहुकेतुमन्त्राः'), description: L('Chant "Om Rahave Namah" (18,000 times) and "Om Ketave Namah" (17,000 times) during the Dosha period', '"ॐ राहवे नमः" (18,000 बार) और "ॐ केतवे नमः" (17,000 बार) जप करें', '"ॐ राहवे नमः" (१८,००० वारम्) "ॐ केतवे नमः" (१७,००० वारम्) च जपेत्') },
  { title: L('Nag Panchami Worship', 'नाग पंचमी पूजा', 'नागपञ्चमीपूजा'), description: L('Offer milk, rice, and flowers to snake idols or ant hills on Nag Panchami. Worship Nag Devta regularly.', 'नाग पंचमी पर नाग मूर्ति या वल्मीक पर दूध, चावल और फूल अर्पित करें। नियमित नाग देवता पूजा करें।', 'नागपञ्चम्यां नागमूर्तये वल्मीकाय वा दुग्धतण्डुलपुष्पाणि अर्पयेत्') },
  { title: L('Sarpa Suktam Recitation', 'सर्प सूक्तम् पाठ', 'सर्पसूक्तपठनम्'), description: L('Regular recitation of Sarpa Suktam from the Yajurveda helps pacify the serpent energy in the chart', 'यजुर्वेद से सर्प सूक्तम् का नियमित पाठ कुण्डली में सर्प ऊर्जा को शान्त करता है', 'यजुर्वेदात् सर्पसूक्तस्य नियमितपठनं कुण्डल्यां सर्पशक्तिं शमयति') },
  { title: L('Shiva Abhishek', 'शिव अभिषेक', 'शिवाभिषेकः'), description: L('Perform Rudra Abhishek with milk on Mondays. Lord Shiva wears serpents and can neutralize Kaal Sarp effects.', 'सोमवार को दूध से रुद्र अभिषेक करें। भगवान शिव सर्प धारण करते हैं और काल सर्प प्रभाव निष्प्रभ कर सकते हैं।', 'सोमवासरे दुग्धेन रुद्राभिषेकं कुर्यात्') },
];

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function KaalSarpPage() {
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
  const [result, setResult] = useState<KaalSarpResult | null>(null);

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
      const analysis = analyzeKaalSarp(kundali, locale);
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
          <GrahaIconById id={7} size={64} />
          <GrahaIconById id={8} size={64} />
        </div>
        <h1 className="text-5xl sm:text-6xl font-bold mb-4" style={headingFont}>
          <span className="text-gold-gradient">{t(LABELS.title, locale)}</span>
        </h1>
        <p className="text-text-secondary text-lg max-w-2xl mx-auto" style={bodyFont}>{t(LABELS.subtitle, locale)}</p>
      </motion.div>

      <InfoBlock id="kaal-sarp-intro" title={locale === 'en' ? 'What is Kaal Sarp Dosha?' : 'काल सर्प दोष क्या है?'} defaultOpen>
        {locale === 'en' ? (
          <div className="space-y-3">
            <p><strong>Kaal Sarp Dosha</strong> occurs when all seven planets (Sun through Saturn) are positioned on one side of the Rahu-Ketu axis in the birth chart. Since Rahu and Ketu are always exactly opposite each other, they create an axis that divides the chart into two halves.</p>
            <p>When all other planets fall on one side, the native&apos;s karma is heavily influenced by the Rahu-Ketu axis — creating patterns of <strong>sudden upheavals, delays, and karmic debts</strong> from past lives. However, this Dosha also gives the potential for extraordinary achievements once its lessons are learned.</p>
            <p>There are <strong>12 types</strong> named after mythological serpents, each defined by which houses Rahu and Ketu occupy. The effects vary dramatically based on the type.</p>
          </div>
        ) : (
          <div className="space-y-3">
            <p><strong>काल सर्प दोष</strong> तब होता है जब सभी सात ग्रह (सूर्य से शनि तक) जन्म कुण्डली में राहु-केतु अक्ष के एक ओर स्थित होते हैं। राहु और केतु सदैव एक-दूसरे के ठीक विपरीत होते हैं, वे कुण्डली को दो भागों में बाँटने वाला अक्ष बनाते हैं।</p>
            <p>जब सभी अन्य ग्रह एक ओर हों, तो <strong>अचानक उथल-पुथल, विलम्ब और पूर्वजन्म कर्मऋण</strong> के प्रतिरूप बनते हैं। किन्तु इसमें पाठ सीखने के बाद असाधारण उपलब्धियों की सम्भावना भी होती है।</p>
            <p><strong>12 प्रकार</strong> हैं, प्रत्येक पौराणिक सर्पों के नाम पर — राहु और केतु किस भाव में हैं, इससे निर्धारित।</p>
          </div>
        )}
      </InfoBlock>

      <GoldDivider className="my-10" />

      {/* Birth Input Form */}
      <motion.div {...fadeUp} className="bg-gradient-to-br from-[#2d1b69]/35 via-[#1a1040]/45 to-[#0a0e27] rounded-2xl border border-gold-dark/20 p-6 sm:p-8 mb-10">
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
            <div className={`rounded-2xl border p-6 mb-8 text-center ${result.present ? (result.partial ? 'bg-orange-500/10 border-orange-500/30' : 'bg-red-500/10 border-red-500/30') : 'bg-emerald-500/10 border-emerald-500/30'}`}>
              <div className={`text-3xl font-bold mb-2 ${result.present ? (result.partial ? 'text-orange-400' : 'text-red-400') : 'text-emerald-400'}`} style={headingFont}>
                {!result.present ? t(LABELS.doshaAbsent, locale) : result.partial ? t(LABELS.partial, locale) : t(LABELS.doshaPresent, locale)}
              </div>
              {result.present && (
                <>
                  <div className="text-gold-light text-xl font-bold mt-3" style={headingFont}>{result.typeName}</div>
                  <div className="flex items-center justify-center gap-3 mt-3">
                    <span className="text-text-secondary text-sm" style={bodyFont}>{t(LABELS.severity, locale)}:</span>
                    <span className={`px-3 py-1 rounded-full text-sm font-bold border ${severityBg(result.severity)} ${severityColor(result.severity)} ${severityBorder(result.severity)}`} style={bodyFont}>
                      {result.severity === 'severe' ? t(LABELS.severe, locale) : result.severity === 'moderate' ? t(LABELS.moderate, locale) : t(LABELS.mild, locale)}
                    </span>
                  </div>
                </>
              )}
            </div>

            {result.present && (
              <>
                {/* Rahu-Ketu Placement */}
                <div className="bg-gradient-to-br from-[#2d1b69]/35 via-[#1a1040]/45 to-[#0a0e27] rounded-2xl border border-gold-dark/20 p-6 mb-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-purple-500/10 border border-purple-500/20 rounded-xl p-4 text-center">
                      <GrahaIconById id={7} size={40} />
                      <div className="text-2xl font-bold text-purple-400 mt-2">{result.rahuHouse}</div>
                      <div className="text-text-secondary text-sm" style={bodyFont}>{t(LABELS.rahuIn, locale)} {result.rahuHouse}</div>
                    </div>
                    <div className="bg-indigo-500/10 border border-indigo-500/20 rounded-xl p-4 text-center">
                      <GrahaIconById id={8} size={40} />
                      <div className="text-2xl font-bold text-indigo-400 mt-2">{result.ketuHouse}</div>
                      <div className="text-text-secondary text-sm" style={bodyFont}>{t(LABELS.ketuIn, locale)} {result.ketuHouse}</div>
                    </div>
                  </div>
                </div>

                {/* Effects */}
                {result.typeEffects && (
                  <div className="bg-gradient-to-br from-[#2d1b69]/35 via-[#1a1040]/45 to-[#0a0e27] rounded-2xl border border-gold-dark/20 p-6 mb-6">
                    <h2 className="text-xl font-bold text-gold-light mb-3" style={headingFont}>{t(LABELS.effects, locale)}</h2>
                    <p className="text-text-primary text-sm leading-relaxed" style={bodyFont}>{result.typeEffects}</p>
                  </div>
                )}

                {/* Partial note */}
                {result.partial && result.planetsOutside.length > 0 && (
                  <div className="bg-orange-500/10 border border-orange-500/20 rounded-xl p-4 mb-6">
                    <p className="text-orange-400 text-sm" style={bodyFont}>
                      {t(L(
                        `Partial Kaal Sarp: ${result.planetsOutside.join(', ')} is outside the Rahu-Ketu axis, reducing severity.`,
                        `आंशिक काल सर्प: ${result.planetsOutside.join(', ')} राहु-केतु अक्ष के बाहर है, गम्भीरता कम करता है।`,
                        `आंशिककालसर्पः: ${result.planetsOutside.join(', ')} राहुकेत्वक्षात् बहिः अस्ति।`,
                      ), locale)}
                    </p>
                  </div>
                )}

                {/* Remedies */}
                <div className="bg-gradient-to-br from-[#2d1b69]/35 via-[#1a1040]/45 to-[#0a0e27] rounded-2xl border border-gold-dark/20 p-6 mb-6">
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
