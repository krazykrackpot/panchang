'use client';

import { useState } from 'react';
import { useLocale } from 'next-intl';
import { authedFetch } from '@/lib/api/authed-fetch';
import { motion, AnimatePresence } from 'framer-motion';
import GoldDivider from '@/components/ui/GoldDivider';
import { GrahaIconById } from '@/components/icons/GrahaIcons';
import type { Locale, LocaleText } from '@/types/panchang';
import type { KundaliData } from '@/types/kundali';
import { analyzeMangalDosha as engineAnalyze, type MangalDoshaResult } from '@/lib/kundali/mangal-dosha-engine';
import { tl } from '@/lib/utils/trilingual';
import { isDevanagariLocale } from '@/lib/utils/locale-fonts';
import LocationSearch from '@/components/ui/LocationSearch';
import { getUTCOffsetForDate } from '@/lib/utils/timezone';
import InfoBlock from '@/components/ui/InfoBlock';
import RelatedLinks from '@/components/ui/RelatedLinks';
import { getLearnLinksForTool } from '@/lib/seo/cross-links';
import Link from 'next/link';

// ---------------------------------------------------------------------------
// Trilingual labels
// ---------------------------------------------------------------------------

const L = (en: string, hi: string, sa?: string) => ({ en, hi, sa: sa ?? hi });

const LABELS = {
  title: L('Mangal Dosha Calculator', 'मंगल दोष गणक', 'मङ्गलदोषगणकम्'),
  subtitle: L(
    'Check if Mars (Mangal) creates Kuja Dosha in your birth chart',
    'जानें कि क्या मंगल ग्रह आपकी कुण्डली में कुज दोष बनाता है',
    'कुजः स्वजन्मकुण्डल्यां कुजदोषं रचयति किं वेति जानीयात्',
  ),
  date: L('Date of Birth', 'जन्म तिथि', 'जन्मतिथिः'),
  time: L('Time of Birth', 'जन्म समय', 'जन्मसमयः'),
  place: L('Birth Place', 'जन्म स्थान', 'जन्मस्थानम्'),
  analyze: L('Check Mangal Dosha', 'मंगल दोष जाँचें', 'मङ्गलदोषं परीक्षतु'),
  loading: L('Generating chart...', 'कुण्डली बना रहे हैं...', 'कुण्डलीं रचयति...'),
  doshaPresent: L('MANGAL DOSHA PRESENT', 'मंगल दोष है', 'मङ्गलदोषः विद्यते'),
  doshaAbsent: L('NO MANGAL DOSHA', 'मंगल दोष नहीं है', 'मङ्गलदोषः नास्ति'),
  severity: L('Severity', 'गम्भीरता', 'गम्भीरता'),
  mild: L('Mild', 'सौम्य', 'सौम्यम्'),
  moderate: L('Moderate', 'मध्यम', 'मध्यमम्'),
  severe: L('Severe', 'गम्भीर', 'गम्भीरम्'),
  marsIn: L('Mars in House', 'मंगल भाव में', 'कुजः भावे'),
  fromLagna: L('from Lagna', 'लग्न से', 'लग्नात्'),
  fromMoon: L('from Moon', 'चन्द्र से', 'चन्द्रात्'),
  fromVenus: L('from Venus', 'शुक्र से', 'शुक्रात्'),
  affectedAreas: L('Affected Life Areas', 'प्रभावित जीवन क्षेत्र', 'प्रभावितजीवनक्षेत्राणि'),
  cancellations: L('Cancellation Conditions', 'निवारण शर्तें', 'निवारणस्थितयः'),
  remedies: L('Remedies', 'उपाय', 'उपायाः'),
  fullKundali: L('Generate Full Kundali', 'पूर्ण कुण्डली बनाएं', 'सम्पूर्णां कुण्डलीं रचयतु'),
  error: L('Error generating chart. Please try again.', 'कुण्डली बनाने में त्रुटि। पुनः प्रयास करें।', 'कुण्डलीरचनायां दोषः। पुनः प्रयतताम्।'),
};

const t = (label: LocaleText, locale: Locale): string => tl(label, locale);

// ---------------------------------------------------------------------------
// Mangal Dosha analysis logic (client-side)
// ---------------------------------------------------------------------------

const HOUSE_EFFECTS: Record<number, LocaleText> = {
  1: L('Self, personality, health — aggressive temperament, frequent conflicts', 'आत्मा, व्यक्तित्व, स्वास्थ्य — आक्रामक स्वभाव, बार-बार संघर्ष', 'आत्मा, व्यक्तित्वम्, स्वास्थ्यम् — आक्रामकस्वभावः'),
  2: L('Family, wealth, speech — harsh speech, family disputes, financial instability', 'परिवार, धन, वाणी — कठोर वाणी, पारिवारिक विवाद, आर्थिक अस्थिरता', 'कुटुम्बम्, धनम्, वाक् — कठोरवाणी, कुटुम्बकलहः'),
  4: L('Home, domestic peace, mother — disturbance in domestic life, property issues', 'घर, गृह शान्ति, माता — गृह जीवन में अशान्ति, सम्पत्ति समस्या', 'गृहम्, गृहशान्तिः, माता — गृहजीवने अशान्तिः'),
  7: L('Marriage, spouse, partnerships — most critical placement, delays or conflicts in marriage', 'विवाह, जीवनसाथी, साझेदारी — सबसे गम्भीर स्थान, विवाह में विलम्ब या संघर्ष', 'विवाहः, पत्नी/पतिः — सर्वाधिकगम्भीरस्थानम्, विवाहे विलम्बः कलहः वा'),
  8: L('Longevity, in-laws, sudden events — health issues, troubled relationship with in-laws', 'आयु, ससुराल, अचानक घटनाएं — स्वास्थ्य समस्या, ससुराल से कठिन सम्बन्ध', 'आयुः, श्वशुरकुलम् — स्वास्थ्यसमस्या, श्वशुरकुलेन कठिनसम्बन्धः'),
  12: L('Expenditure, bed pleasures, foreign lands — excessive spending, marital dissatisfaction', 'व्यय, शयन सुख, विदेश — अत्यधिक खर्च, वैवाहिक असन्तोष', 'व्ययः, शयनसुखम् — अत्यधिकव्ययः, वैवाहिकासन्तोषः'),
};

/** Delegate to shared engine — fixes the critical planet.id===3 (Mercury) bug */
function analyzeChart(kundali: KundaliData): MangalDoshaResult {
  return engineAnalyze(kundali.planets, kundali.ascendant.sign);
}

// ---------------------------------------------------------------------------
// Remedies
// ---------------------------------------------------------------------------

const REMEDIES: { title: LocaleText; description: LocaleText }[] = [
  { title: L('Mangal Shanti Puja', 'मंगल शान्ति पूजा', 'मङ्गलशान्तिपूजा'), description: L('Perform Mangal Graha Shanti Puja on Tuesday to pacify Mars energy', 'मंगलवार को मंगल ग्रह शान्ति पूजा करें', 'मङ्गलवासरे मङ्गलग्रहशान्तिपूजां कुर्यात्') },
  { title: L('Hanuman Worship', 'हनुमान पूजा', 'हनुमत्पूजा'), description: L('Recite Hanuman Chalisa on Tuesdays and Saturdays', 'मंगलवार और शनिवार को हनुमान चालीसा पढ़ें', 'मङ्गलशनिवासरयोः हनुमत्चालीसां पठेत्') },
  { title: L('Red Coral (Moonga)', 'लाल मूंगा', 'प्रवालः'), description: L('Wear Red Coral in gold ring on ring finger on Tuesday (consult Jyotishi first)', 'मंगलवार को सोने की अंगूठी में लाल मूंगा पहनें (पहले ज्योतिषी से परामर्श करें)', 'मङ्गलवासरे स्वर्णाङ्गुलीयके प्रवालं धारयेत् (प्रथमं ज्योतिषिणं परामृशेत्)') },
  { title: L('Tuesday Donations', 'मंगलवार दान', 'मङ्गलवासरदानम्'), description: L('Donate red lentils (masoor dal), red cloth, copper, or jaggery on Tuesdays', 'मंगलवार को मसूर दाल, लाल कपड़ा, ताम्बा या गुड़ दान करें', 'मङ्गलवासरे मसूरदालं रक्तवस्त्रं ताम्रं गुडं वा ददातु') },
  { title: L('Kumbh Vivah', 'कुम्भ विवाह', 'कुम्भविवाहः'), description: L('Symbolic marriage to a clay pot or Peepal/Banana tree before actual marriage (traditional remedy for severe cases)', 'वास्तविक विवाह से पहले मिट्टी के बर्तन या पीपल/केले के पेड़ से प्रतीकात्मक विवाह (गम्भीर मामलों के लिए पारम्परिक उपाय)', 'वास्तविकविवाहात् पूर्वं मृत्पात्रेण पीपलवृक्षेण वा प्रतीकात्मकविवाहः') },
];

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function MangalDoshaPage() {
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
  const [result, setResult] = useState<MangalDoshaResult | null>(null);

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
      const analysis = analyzeChart(kundali);
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
        <div className="flex justify-center mb-6"><GrahaIconById id={3} size={80} /></div>
        <h1 className="text-5xl sm:text-6xl font-bold mb-4" style={headingFont}>
          <span className="text-gold-gradient">{t(LABELS.title, locale)}</span>
        </h1>
        <p className="text-text-secondary text-lg max-w-2xl mx-auto" style={bodyFont}>{t(LABELS.subtitle, locale)}</p>
      </motion.div>

      <InfoBlock id="mangal-dosha-intro" title={locale === 'en' ? 'What is Mangal Dosha?' : 'मंगल दोष क्या है?'} defaultOpen>
        {locale === 'en' ? (
          <div className="space-y-3">
            <p><strong>Mangal Dosha</strong> (also called Kuja Dosha or Chevvai Dosham) occurs when Mars occupies the 1st, 2nd, 4th, 7th, 8th, or 12th house from the Lagna (Ascendant), Moon, or Venus in a birth chart. A person with this combination is called a <strong>Manglik</strong>.</p>
            <p>Mars is a fiery, aggressive planet representing energy, courage, and conflict. When placed in houses related to marriage (7th), family (2nd, 4th), or intimacy (8th, 12th), its intense energy can cause friction in relationships. However, <strong>many cancellation conditions exist</strong> — and not all Mangliks experience difficulties.</p>
            <p>This tool checks Mars from all three reference points (Lagna, Moon, Venus) and evaluates cancellation conditions to give you a complete picture.</p>
          </div>
        ) : (
          <div className="space-y-3">
            <p><strong>मंगल दोष</strong> (कुज दोष) तब होता है जब मंगल जन्म कुण्डली में लग्न, चन्द्र या शुक्र से 1, 2, 4, 7, 8 या 12वें भाव में हो। ऐसे व्यक्ति को <strong>मांगलिक</strong> कहते हैं।</p>
            <p>मंगल एक अग्नि तत्व का आक्रामक ग्रह है। विवाह (7), परिवार (2, 4) या निकटता (8, 12) से सम्बन्धित भावों में इसकी तीव्र ऊर्जा सम्बन्धों में घर्षण उत्पन्न कर सकती है। किन्तु <strong>अनेक निवारण शर्तें</strong> मौजूद हैं।</p>
            <p>यह उपकरण तीनों सन्दर्भ बिन्दुओं (लग्न, चन्द्र, शुक्र) से मंगल की जाँच और निवारण शर्तों का मूल्यांकन करता है।</p>
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
                  <span className={`px-3 py-1 rounded-full text-sm font-bold border ${severityBg(result.effectiveSeverity)} ${severityColor(result.effectiveSeverity)} ${severityBorder(result.effectiveSeverity)}`} style={bodyFont}>
                    {result.effectiveSeverity === 'severe' ? t(LABELS.severe, locale) : result.effectiveSeverity === 'moderate' ? t(LABELS.moderate, locale) : t(LABELS.mild, locale)}
                  </span>
                </div>
              )}
            </div>

            {result.present && (
              <>
                {/* Mars Placement Details */}
                <div className="bg-bg-secondary/60 rounded-2xl border border-gold-dark/20 p-6 mb-6">
                  <h2 className="text-xl font-bold text-gold-light mb-4" style={headingFont}>{t(L('Mars Placement', 'मंगल स्थिति', 'कुजस्थितिः'), locale)}</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {result.fromLagna && (
                      <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 text-center">
                        <div className="text-2xl font-bold text-red-400">{result.marsHouse}</div>
                        <div className="text-text-secondary text-sm" style={bodyFont}>{t(LABELS.marsIn, locale)} {result.marsHouse} {t(LABELS.fromLagna, locale)}</div>
                      </div>
                    )}
                    {result.fromMoon && (
                      <div className="bg-orange-500/10 border border-orange-500/20 rounded-xl p-4 text-center">
                        <div className="text-2xl font-bold text-orange-400">{result.marsHouse}</div>
                        <div className="text-text-secondary text-sm" style={bodyFont}>{t(LABELS.marsIn, locale)} {result.marsHouse} {t(LABELS.fromMoon, locale)}</div>
                      </div>
                    )}
                    {result.fromVenus && (
                      <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4 text-center">
                        <div className="text-2xl font-bold text-amber-400">{result.marsHouse}</div>
                        <div className="text-text-secondary text-sm" style={bodyFont}>{t(LABELS.marsIn, locale)} {result.marsHouse} {t(LABELS.fromVenus, locale)}</div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Affected Life Areas */}
                <div className="bg-bg-secondary/60 rounded-2xl border border-gold-dark/20 p-6 mb-6">
                  <h2 className="text-xl font-bold text-gold-light mb-4" style={headingFont}>{t(LABELS.affectedAreas, locale)}</h2>
                  <div className="space-y-3">
                    {result.affectedHouses.map(h => HOUSE_EFFECTS[h] && (
                      <div key={h} className="bg-red-500/5 border border-red-500/15 rounded-xl p-4">
                        <div className="text-gold-light font-bold mb-1" style={bodyFont}>{t(L(`House ${h}`, `भाव ${h}`, `भावः ${h}`), locale)}</div>
                        <div className="text-text-secondary text-sm" style={bodyFont}>{t(HOUSE_EFFECTS[h], locale)}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Cancellation Conditions */}
                {result.cancellations.length > 0 && (
                  <div className="bg-emerald-500/5 rounded-2xl border border-emerald-500/20 p-6 mb-6">
                    <h2 className="text-xl font-bold text-emerald-400 mb-4" style={headingFont}>{t(LABELS.cancellations, locale)}</h2>
                    <ul className="space-y-2">
                      {result.cancellations.map((c, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <span className="text-emerald-400 mt-0.5">&#10003;</span>
                          <span className="text-text-primary text-sm" style={bodyFont}>{c.description}</span>
                        </li>
                      ))}
                    </ul>
                    <p className="mt-4 text-emerald-400/80 text-xs" style={bodyFont}>
                      {t(L('These conditions reduce or cancel the Dosha\'s negative effects.', 'ये शर्तें दोष के नकारात्मक प्रभाव को कम या निरस्त करती हैं।', 'एताः स्थितयः दोषस्य नकारात्मकप्रभावं न्यूनीकुर्वन्ति निरस्यन्ति वा।'), locale)}
                    </p>
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

      <RelatedLinks type="learn" links={getLearnLinksForTool('/mangal-dosha')} locale={locale} className="mt-8" />
    </div>
  );
}
