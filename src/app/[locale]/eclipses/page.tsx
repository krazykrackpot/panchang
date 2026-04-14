'use client';

import { useState, useEffect } from 'react';
import { useLocale } from 'next-intl';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, ChevronDown, MapPin, Clock, Shield, Eye, EyeOff, Sun, Moon, X } from 'lucide-react';
import GoldDivider from '@/components/ui/GoldDivider';
import InfoBlock from '@/components/ui/InfoBlock';
import LocationSearch from '@/components/ui/LocationSearch';
import { ShareRow } from '@/components/ui/ShareButton';
import { useLocationStore } from '@/stores/location-store';
import type { Locale , LocaleText} from '@/types/panchang';
import type { LocalEclipseResult } from '@/lib/calendar/eclipse-compute';
import PersonalEclipseInsight from '@/components/eclipses/PersonalEclipseInsight';
import { tl } from '@/lib/utils/trilingual';
import AdUnit from '@/components/ads/AdUnit';
import { isDevanagariLocale } from '@/lib/utils/locale-fonts';

interface EclipseEvent {
  type: 'solar' | 'lunar';
  typeName: LocaleText;
  date: string;
  magnitude: string;
  magnitudeName: LocaleText;
  description: LocaleText;
  node?: 'rahu' | 'ketu';
  nodeName?: LocaleText;
  eclipseLongitude?: number;
  local?: LocalEclipseResult;
}

// ─── Labels ────────────────────────────────────────────────────────
const ECLIPSE_LABELS: Record<string, Record<string, string>> = {
  en: { title: 'Eclipse Calendar', subtitle: 'Solar and Lunar eclipses with local timings, Sutak periods, and visibility', change: 'Change', detecting: 'Detecting location...', resetLoc: 'Reset to my location', searchCity: 'Search any city...', learnMore: 'Learn how eclipses work →' },
  hi: { title: 'ग्रहण पञ्चाङ्ग', subtitle: 'सूर्य एवं चन्द्र ग्रहण — स्थानीय समय, सूतक काल और दृश्यता सहित', change: 'बदलें', detecting: 'स्थान का पता लगा रहे हैं...', resetLoc: 'अपना स्थान पुनः उपयोग करें', searchCity: 'शहर खोजें...', learnMore: 'ग्रहण के बारे में विस्तार से जानें →' },
  sa: { title: 'ग्रहणपञ्चाङ्गम्', subtitle: 'सूर्यचन्द्रग्रहणानि — स्थानीयसमयः, सूतककालः दृश्यता च', change: 'परिवर्तयतु', detecting: 'स्थानम् अन्विष्यते...', resetLoc: 'स्वस्थानं पुनः उपयुज्यताम्', searchCity: 'नगरम् अन्विष्यतु...', learnMore: 'ग्रहणविषये विस्तरेण जानातु →' },
  ta: { title: 'கிரகண நாள்காட்டி', subtitle: 'சூரிய & சந்திர கிரகணங்கள் — உள்ளூர் நேரங்கள், சூதக காலம் மற்றும் பார்வைத்தன்மை', change: 'மாற்று', detecting: 'இருப்பிடம் கண்டறியப்படுகிறது...', resetLoc: 'எனது இருப்பிடத்திற்கு மீட்டமை', searchCity: 'நகரத்தைத் தேடு...', learnMore: 'கிரகணங்கள் எவ்வாறு செயல்படுகின்றன என்று அறிக →' },
  te: { title: 'గ్రహణ పంచాంగం', subtitle: 'సూర్య & చంద్ర గ్రహణాలు — స్థానిక సమయాలు, సూతక కాలం మరియు దృశ్యత', change: 'మార్చు', detecting: 'స్థానం గుర్తించబడుతోంది...', resetLoc: 'నా స్థానానికి రీసెట్ చేయి', searchCity: 'నగరాన్ని వెతుకు...', learnMore: 'గ్రహణాలు ఎలా పనిచేస్తాయో తెలుసుకోండి →' },
  bn: { title: 'গ্রহণ পঞ্চাঙ্গ', subtitle: 'সূর্য ও চন্দ্র গ্রহণ — স্থানীয় সময়, সূতক কাল এবং দৃশ্যমানতা', change: 'বদলান', detecting: 'অবস্থান সনাক্ত করা হচ্ছে...', resetLoc: 'আমার অবস্থানে রিসেট করুন', searchCity: 'শহর খুঁজুন...', learnMore: 'গ্রহণ কীভাবে কাজ করে জানুন →' },
  kn: { title: 'ಗ್ರಹಣ ಪಂಚಾಂಗ', subtitle: 'ಸೂರ್ಯ ಮತ್ತು ಚಂದ್ರ ಗ್ರಹಣಗಳು — ಸ್ಥಳೀಯ ಸಮಯ, ಸೂತಕ ಕಾಲ ಮತ್ತು ಗೋಚರತೆ', change: 'ಬದಲಿಸಿ', detecting: 'ಸ್ಥಳ ಪತ್ತೆಯಾಗುತ್ತಿದೆ...', resetLoc: 'ನನ್ನ ಸ್ಥಳಕ್ಕೆ ಮರುಹೊಂದಿಸಿ', searchCity: 'ನಗರ ಹುಡುಕಿ...', learnMore: 'ಗ್ರಹಣಗಳು ಹೇಗೆ ಕೆಲಸ ಮಾಡುತ್ತವೆ ತಿಳಿಯಿರಿ →' },
  mr: { title: 'ग्रहण पंचांग', subtitle: 'सूर्य आणि चंद्र ग्रहण — स्थानिक वेळा, सूतक काळ आणि दृश्यता', change: 'बदला', detecting: 'स्थान शोधत आहे...', resetLoc: 'माझ्या स्थानावर रीसेट करा', searchCity: 'शहर शोधा...', learnMore: 'ग्रहण कसे कार्य करतात जाणून घ्या →' },
  gu: { title: 'ગ્રહણ પંચાંગ', subtitle: 'સૂર્ય અને ચંદ્ર ગ્રહણ — સ્થાનિક સમય, સૂતક કાળ અને દૃશ્યતા', change: 'બદલો', detecting: 'સ્થાન શોધી રહ્યા છે...', resetLoc: 'મારા સ્થાન પર રીસેટ કરો', searchCity: 'શહેર શોધો...', learnMore: 'ગ્રહણ કેવી રીતે કામ કરે છે જાણો →' },
  mai: { title: 'ग्रहण पंचांग', subtitle: 'सूर्य आ चंद्र ग्रहण — स्थानीय समय, सूतक काल आ दृश्यता', change: 'बदलू', detecting: 'स्थानक पता लगा रहल अछि...', resetLoc: 'अपन स्थान पुनः उपयोग करू', searchCity: 'शहर खोजू...', learnMore: 'ग्रहणक बारेमे विस्तारसँ जानू →' },
};

export default function EclipsesPage() {
  const locale = useLocale() as Locale;
  const isHi = isDevanagariLocale(locale);
  const headingFont = isHi ? { fontFamily: 'var(--font-devanagari-heading)' } : { fontFamily: 'var(--font-heading)' };
  const bodyFont = isHi ? { fontFamily: 'var(--font-devanagari-body)' } : undefined;
  const EL = ECLIPSE_LABELS[locale] || ECLIPSE_LABELS.en;

  const locationStore = useLocationStore();
  const [year, setYear] = useState(new Date().getFullYear());
  const [eclipses, setEclipses] = useState<EclipseEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [showLocationSearch, setShowLocationSearch] = useState(false);
  const [nextSignificant, setNextSignificant] = useState<{
    date: string; year: number; type: 'solar' | 'lunar'; subtype: string; magnitude: number; visibilityNote: string;
  } | null>(null);

  // Override location — when set, overrides the auto-detected location
  const [overrideLoc, setOverrideLoc] = useState<{ name: string; lat: number; lng: number; timezone: string } | null>(null);

  // Effective location: override > auto-detected
  const effectiveLat = overrideLoc?.lat ?? locationStore.lat;
  const effectiveLng = overrideLoc?.lng ?? locationStore.lng;
  const effectiveTz = overrideLoc?.timezone ?? locationStore.timezone;
  const effectiveName = overrideLoc?.name ?? locationStore.name;

  // Auto-detect location
  useEffect(() => {
    if (!locationStore.confirmed && !locationStore.detecting) {
      locationStore.detect();
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Fetch eclipses with location params
  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams({ year: String(year) });
    if (effectiveLat != null && effectiveLng != null && effectiveTz) {
      params.set('lat', String(effectiveLat));
      params.set('lng', String(effectiveLng));
      params.set('tz', effectiveTz);
    }
    fetch(`/api/eclipses?${params}`)
      .then(r => r.json())
      .then(data => {
        setEclipses(data.eclipses || []);
        setNextSignificant(data.nextSignificant || null);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [year, effectiveLat, effectiveLng, effectiveTz]);

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr + 'T00:00:00');
    return d.toLocaleDateString(tl({ en: 'en-IN', hi: 'hi-IN', sa: 'sa-IN' }, locale), { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
  };

  const toggleExpand = (key: string) => setExpanded(prev => prev === key ? null : key);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
        <h1 className="text-5xl sm:text-6xl font-bold mb-4" style={headingFont}>
          <span className="text-gold-gradient">
            {tl({ en: 'Eclipse Calendar', hi: 'ग्रहण पञ्चाङ्ग', sa: 'ग्रहण-पञ्चाङ्गम्' }, locale)}
          </span>
        </h1>
        <p className="text-text-secondary text-lg max-w-2xl mx-auto" style={bodyFont}>
          {tl({ en: 'Solar and Lunar eclipses with local timings, Sutak periods, and visibility', hi: 'सूर्य एवं चन्द्र ग्रहण — स्थानीय समय, सूतक काल और दृश्यता सहित', sa: 'सौर-चान्द्र-ग्रहणानि — स्थानीय-काल-सूतक-काल-दृश्यता-सहितम्' }, locale)}
        </p>
        {/* Location selector */}
        <div className="mt-4 flex flex-col items-center gap-2">
          <div className="flex items-center gap-2">
            <MapPin className="w-3.5 h-3.5 text-gold-primary" />
            <span className="text-text-secondary text-sm">{effectiveName || tl({ en: 'Detecting location...', hi: 'स्थान का पता लगा रहे हैं...', sa: 'स्थानं निर्धारयति...' }, locale)}</span>
            {overrideLoc && (
              <button
                onClick={() => { setOverrideLoc(null); setShowLocationSearch(false); }}
                className="p-0.5 rounded-full hover:bg-gold-primary/10 text-text-secondary/50 hover:text-gold-light transition-colors"
                title={tl({ en: 'Reset to my location', hi: 'अपना स्थान पुनः उपयोग करें', sa: 'मम स्थानं पुनः उपयुज्यताम्' }, locale)}
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
            <button
              onClick={() => setShowLocationSearch(!showLocationSearch)}
              className="text-gold-primary hover:text-gold-light text-xs border border-gold-primary/15 px-2 py-0.5 rounded hover:bg-gold-primary/10 transition-all"
            >
              {tl({ en: 'Change', hi: 'बदलें', sa: 'परिवर्तयतु' }, locale)}
            </button>
          </div>
          {showLocationSearch && (
            <motion.div initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-sm">
              <LocationSearch
                value=""
                onSelect={(loc) => {
                  setOverrideLoc({ name: loc.name, lat: loc.lat, lng: loc.lng, timezone: loc.timezone });
                  setShowLocationSearch(false);
                }}
                placeholder={tl({ en: 'Search any city...', hi: 'शहर खोजें...', sa: 'यत्किञ्चित् नगरं मृगयतु...' }, locale)}
              />
            </motion.div>
          )}
        </div>
        {/* Learn more link */}
        <a href={`/${locale}/learn/eclipses`} className="text-gold-primary/60 text-xs hover:text-gold-light transition-colors inline-flex items-center gap-1 mt-2">
          {tl({ en: 'Learn how eclipses work →', hi: 'ग्रहण के बारे में विस्तार से जानें →', sa: 'ग्रहणं कथं भवति इति जानतु →' }, locale)}
        </a>
        <div className="flex justify-center mt-4">
          <ShareRow
            pageTitle={tl({ en: 'Eclipse Calendar', hi: 'ग्रहण पञ्चाङ्ग', sa: 'ग्रहण-पञ्चाङ्गम्' }, locale)}
            shareText={tl({ en: 'Eclipse Calendar with local timings, Sutak & visibility — Dekho Panchang', hi: 'ग्रहण पंचांग — स्थानीय समय, सूतक काल और दृश्यता सहित — Dekho Panchang', sa: 'ग्रहण-पञ्चाङ्गम् — स्थानीय-काल-सूतक-दृश्यता-सहितम् — Dekho Panchang' }, locale)}
            locale={locale}
          />
        </div>
      </motion.div>

      {/* Year selector */}
      <div className="flex items-center justify-center gap-6 mb-10">
        <button onClick={() => setYear(y => y - 1)} className="p-2 rounded-xl border border-gold-primary/20 hover:bg-gold-primary/10 transition-all">
          <ChevronLeft className="w-5 h-5 text-gold-primary" />
        </button>
        <span className="text-4xl font-bold text-gold-gradient" style={headingFont}>{year}</span>
        <button onClick={() => setYear(y => y + 1)} className="p-2 rounded-xl border border-gold-primary/20 hover:bg-gold-primary/10 transition-all">
          <ChevronRight className="w-5 h-5 text-gold-primary" />
        </button>
      </div>

      {/* InfoBlock */}
      <InfoBlock
        id="eclipse-grahan-kaal"
        title={tl({ en: 'What is Grahan Kaal & Sutak? What should you do during an eclipse?', hi: 'ग्रहण काल और सूतक क्या है? ग्रहण में क्या करें?', sa: 'ग्रहण-कालः सूतकश्च किम्? ग्रहणे किं करणीयम्?' }, locale)}
        defaultOpen={false}
      >
        {!isHi ? (
          <div className="space-y-3">
            <p><strong>Grahan Kaal</strong> is the duration of the eclipse itself. During this period, the luminaries are considered weakened.</p>
            <p><strong>Sutak Period</strong> is the restriction period <em>before</em> the eclipse:</p>
            <ul className="list-disc ml-4 space-y-1 text-xs">
              <li><strong className="text-amber-300">Solar Eclipse</strong> — Sutak begins <strong>12 hours</strong> before first contact.</li>
              <li><strong className="text-indigo-300">Lunar Eclipse</strong> — Sutak begins <strong>9 hours</strong> before first contact.</li>
            </ul>
            <p><strong>Do:</strong> Chant mantras, meditate, bathe after eclipse, donate food/clothes.</p>
            <p><strong>Avoid:</strong> Eating during Sutak, new ventures, pregnant women avoid sharp objects, don&apos;t look directly at solar eclipses.</p>
            <p><strong>What does Magnitude mean?</strong> For solar eclipses, magnitude is the fraction of the Sun&apos;s diameter covered by the Moon (0.91 = 91% covered). For lunar eclipses, it&apos;s the fraction of the Moon inside Earth&apos;s umbral shadow (&gt;1.0 = fully inside = total &quot;Blood Moon&quot;, 0.5 = half covered). Higher magnitude = more dramatic and astrologically significant eclipse.</p>
            <p className="text-text-secondary/60 text-xs">Sutak applies only when the eclipse is visible from your location.</p>
          </div>
        ) : (
          <div className="space-y-3">
            <p><strong>ग्रहण काल</strong> ग्रहण की अवधि है। <strong>सूतक काल</strong> ग्रहण से पहले की प्रतिबन्ध अवधि:</p>
            <ul className="list-disc ml-4 space-y-1 text-xs">
              <li><strong className="text-amber-300">सूर्य ग्रहण</strong> — सूतक <strong>12 घंटे</strong> पहले।</li>
              <li><strong className="text-indigo-300">चन्द्र ग्रहण</strong> — सूतक <strong>9 घंटे</strong> पहले।</li>
            </ul>
            <p><strong>करें:</strong> मन्त्र जाप, ध्यान, स्नान, दान। <strong>न करें:</strong> भोजन, नए कार्य।</p>
            <p><strong>परिमाण (Magnitude) का अर्थ:</strong> सूर्य ग्रहण में — सूर्य का कितना भाग चन्द्रमा ने ढका (0.91 = 91%)। चन्द्र ग्रहण में — चन्द्रमा का कितना भाग पृथ्वी की छाया में (&gt;1.0 = पूर्ण &quot;रक्त चन्द्र&quot;)। अधिक परिमाण = अधिक प्रभावशाली ग्रहण।</p>
            <p className="text-text-secondary/60 text-xs">सूतक केवल तभी लागू जब ग्रहण दृश्य हो।</p>
          </div>
        )}
      </InfoBlock>

      <GoldDivider />

      <AdUnit placement="rectangle" className="max-w-xl mx-auto" />

      {/* Eclipse list */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-2 border-gold-primary border-t-transparent" />
        </div>
      ) : eclipses.length === 0 ? (
        <div className="text-center py-16 text-text-secondary">
          <div className="text-6xl mb-4 opacity-30">
            <svg viewBox="0 0 100 100" className="w-20 h-20 mx-auto">
              <circle cx="50" cy="50" r="40" fill="none" stroke="#d4a853" strokeWidth="2" strokeOpacity="0.3" />
              <circle cx="50" cy="50" r="38" fill="#0a0e27" />
              <circle cx="50" cy="50" r="40" fill="none" stroke="#d4a853" strokeWidth="1" strokeDasharray="4 4" />
            </svg>
          </div>
          <p className="text-lg" style={bodyFont}>
            {tl({ en: 'No eclipses this year.', hi: 'इस वर्ष कोई ग्रहण नहीं।', sa: 'अस्मिन् वर्षे किमपि ग्रहणं नास्ति।' }, locale)}
          </p>
          <NextSignificantCard next={nextSignificant} locale={locale} headingFont={headingFont} bodyFont={bodyFont} onNavigate={(y, date, type) => { setYear(y); setExpanded(`${date}-${type}`); }} />
        </div>
      ) : (
        <div className="space-y-6 my-10">
          {eclipses.map((eclipse, i) => {
            const isSolar = eclipse.type === 'solar';
            const local = eclipse.local;
            const isVisible = local?.visible !== false;
            const key = `${eclipse.date}-${eclipse.type}`;
            const isExpanded = expanded === key;

            const accentColor = isSolar ? 'text-amber-400' : 'text-indigo-400';
            const borderAccent = isSolar ? 'border-amber-500/25' : 'border-indigo-500/25';
            const badgeBg = isSolar ? 'bg-amber-500/15 text-amber-300 border-amber-500/25' : 'bg-indigo-500/15 text-indigo-300 border-indigo-500/25';

            return (
              <motion.div
                key={key}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className={`bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] rounded-2xl border-2 ${borderAccent} overflow-hidden ${!isVisible ? 'opacity-60' : ''}`}
              >
                {/* Header row — always visible, clickable to expand */}
                <button
                  onClick={() => toggleExpand(key)}
                  className="w-full text-left p-6 sm:p-8 flex items-start gap-5 hover:bg-gold-primary/3 transition-colors"
                >
                  {/* Eclipse icon */}
                  <div className="flex-shrink-0">
                    <svg viewBox="0 0 64 64" className="w-16 h-16">
                      {isSolar ? (
                        <>
                          <circle cx="32" cy="32" r="24" fill="#f59e0b" opacity="0.15" />
                          <circle cx="32" cy="32" r="20" fill="#0a0e27" />
                          <circle cx="32" cy="32" r="24" fill="none" stroke="#f59e0b" strokeWidth="1.5" />
                          {Array.from({ length: 8 }).map((_, j) => {
                            const angle = (j * 45 * Math.PI) / 180;
                            return (
                              <line key={j} x1={32 + 26 * Math.cos(angle)} y1={32 + 26 * Math.sin(angle)}
                                x2={32 + 30 * Math.cos(angle)} y2={32 + 30 * Math.sin(angle)}
                                stroke="#f59e0b" strokeWidth="1.5" strokeOpacity="0.4" />
                            );
                          })}
                        </>
                      ) : (
                        <>
                          <circle cx="32" cy="32" r="22" fill="#818cf8" opacity="0.15" />
                          <circle cx="32" cy="32" r="22" fill="none" stroke="#818cf8" strokeWidth="1.5" />
                          <path d="M 32 10 A 22 22 0 0 1 32 54" fill="#0a0e27" />
                        </>
                      )}
                    </svg>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 flex-wrap mb-1">
                      <h3 className={`text-xl sm:text-2xl font-bold ${accentColor}`} style={headingFont}>
                        {tl(eclipse.typeName, locale)}
                      </h3>
                      <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold border ${badgeBg}`}>
                        {tl(eclipse.magnitudeName, locale)}
                      </span>
                      {/* Node badge */}
                      {eclipse.node && (
                        <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold border ${
                          eclipse.node === 'rahu'
                            ? 'bg-gold-primary/10 text-gold-light border-gold-primary/25'
                            : 'bg-purple-500/10 text-purple-300 border-purple-500/25'
                        }`}>
                          {eclipse.node === 'rahu' ? '☊' : '☋'} {eclipse.nodeName?.[locale]}
                        </span>
                      )}
                      {/* Visibility badge */}
                      {local && (
                        isVisible ? (
                          <span className="text-[10px] px-2.5 py-0.5 rounded-full font-bold bg-emerald-500/15 text-emerald-300 border border-emerald-500/25 flex items-center gap-1">
                            <Eye className="w-3 h-3" /> {tl({ en: 'Visible', hi: 'दृश्य', sa: 'दृश्यम्' }, locale)}
                          </span>
                        ) : (
                          <span className="text-[10px] px-2.5 py-0.5 rounded-full font-bold bg-red-500/10 text-red-400 border border-red-500/20 flex items-center gap-1">
                            <EyeOff className="w-3 h-3" /> {tl({ en: 'Not Visible', hi: 'अदृश्य', sa: 'अदृश्यम्' }, locale)}
                          </span>
                        )
                      )}
                    </div>
                    <div className="text-gold-light text-base font-mono mb-2">{formatDate(eclipse.date)}</div>

                    {/* Quick stats row */}
                    {local && isVisible && (
                      <div className="flex flex-wrap gap-x-5 gap-y-1 text-xs text-text-secondary/70">
                        {local.maximum && (
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3 text-gold-dark" />
                            {tl({ en: 'Max', hi: 'अधिकतम', sa: 'अधिकतमम्' }, locale)}: <span className="text-gold-light font-mono">{local.maximum}</span>
                          </span>
                        )}
                        {local.maxMagnitude > 0 && (
                          <span>
                            {tl({ en: 'Mag', hi: 'परिमाण', sa: 'परिमाणम्' }, locale)}: <span className="text-gold-light font-mono">{local.maxMagnitude.toFixed(2)}</span>
                          </span>
                        )}
                        {local.durationFormatted && (
                          <span>
                            {tl({ en: 'Duration', hi: 'अवधि', sa: 'अवधिः' }, locale)}: <span className="text-gold-light font-mono">{local.durationFormatted}</span>
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  <ChevronDown className={`w-5 h-5 text-text-secondary/40 shrink-0 mt-2 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                </button>

                {/* Expanded detail section */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 sm:px-8 pb-6 sm:pb-8 space-y-5 border-t border-gold-primary/10 pt-5">
                        {/* Description + Sutak applicability note */}
                        <div className="text-text-secondary text-sm leading-relaxed space-y-2" style={bodyFont}>
                          <p>{tl(eclipse.description, locale)}</p>
                          {local && !isVisible && (
                            <p className="text-amber-400/80 text-xs font-medium">
                              {tl({ en: '⚠ This eclipse is not visible from your location. Sutak does not apply. However, chanting mantras and meditation during the eclipse period is still recommended.', hi: '⚠ यह ग्रहण आपके स्थान से दृश्य नहीं है। सूतक काल लागू नहीं होता। मन्त्र जाप और ध्यान करना शुभ रहता है।', sa: '⚠ इदं ग्रहणं भवतः स्थानात् न दृश्यते। सूतककालः न प्रवर्तते। तथापि ग्रहण-काले मन्त्र-जपः ध्यानञ्च प्रशस्तम्।' }, locale)}
                            </p>
                          )}
                          {local && isVisible && local.sutakApplicable && (
                            <p className="text-emerald-400/70 text-xs font-medium">
                              {tl({ en: '✓ This eclipse is visible from your location. Sutak period applies — see timings below.', hi: '✓ यह ग्रहण आपके स्थान से दृश्य है। सूतक काल लागू होता है — नीचे समय देखें।', sa: '✓ इदं ग्रहणं भवतः स्थानात् दृश्यते। सूतककालः प्रवर्तते — अधः समयं पश्यतु।' }, locale)}
                            </p>
                          )}
                        </div>

                        {local && isVisible && (
                          <>
                            {/* Personalized analysis from user's kundali — shown first, only for visible eclipses */}
                            {eclipse.node && eclipse.eclipseLongitude != null && (
                              <PersonalEclipseInsight
                                eclipseDate={eclipse.date}
                                eclipseType={eclipse.type}
                                eclipseNode={eclipse.node}
                                eclipseLongitude={eclipse.eclipseLongitude}
                                locale={locale}
                              />
                            )}

                            {/* Node implications from classical texts — only for visible eclipses */}
                            {eclipse.node && (
                              <NodeImplications node={eclipse.node} eclipseType={eclipse.type} locale={locale} bodyFont={bodyFont} headingFont={headingFont} />
                            )}
                          </>
                        )}

                        {local && isVisible && (
                          <>
                            {/* ── Contact Times ── */}
                            <div className="rounded-xl bg-gradient-to-br from-[#2d1b69]/30 via-[#1a1040]/35 to-[#0a0e27] border border-gold-primary/10 p-5">
                              <div className="flex items-center gap-2 mb-4">
                                <Clock className={`w-4 h-4 ${accentColor}`} />
                                <h4 className="text-sm font-bold text-gold-light uppercase tracking-wider" style={headingFont}>
                                  {tl({ en: 'Eclipse Timings (Local)', hi: 'ग्रहण समय (स्थानीय)', sa: 'ग्रहण-समयः (स्थानीयः)' }, locale)}
                                </h4>
                              </div>
                              {/* Phase progress diagram */}
                              <EclipsePhaseDiagram local={local} isSolar={isSolar} locale={locale} />

                              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                                {isSolar ? (
                                  <>
                                    {/* Solar eclipse phases: C1 (partial start) → Max → C4 (partial end) */}
                                    {local.eclipseStart && (
                                      <TimeCell label={tl({ en: 'Partial Begins (C1)', hi: 'आंशिक आरम्भ (C1)', sa: 'आंशिकारम्भः (C1)' }, locale)} time={local.eclipseStart} accent={accentColor} subtitle={tl({ en: 'Moon first touches Sun', hi: 'चन्द्र सूर्य को स्पर्श करता है', sa: 'चन्द्रः सूर्यं प्रथमतः स्पृशति' }, locale)} />
                                    )}
                                    {local.maximum && (
                                      <TimeCell label={tl({ en: 'Maximum Eclipse', hi: 'अधिकतम ग्रहण', sa: 'अधिकतमं ग्रहणम्' }, locale)} time={local.maximum} accent="text-gold-light" highlight subtitle={tl({ en: 'Peak coverage', hi: 'अधिकतम आच्छादन', sa: 'अधिकतमाच्छादनम्' }, locale)} />
                                    )}
                                    <TimeCell
                                      label={
                                        local.endsAtSunset
                                          ? tl({ en: 'Ends at Sunset', hi: 'सूर्यास्त पर समाप्त', sa: 'सूर्यास्ते समाप्यते' }, locale)
                                          : tl({ en: 'Partial Ends (C4)', hi: 'आंशिक समाप्त (C4)', sa: 'आंशिकसमाप्तिः (C4)' }, locale)
                                      }
                                      time={local.eclipseEnd || '--:--'}
                                      accent={accentColor}
                                      subtitle={local.endsAtSunset ? tl({ en: 'Eclipse still in progress at sunset', hi: 'ग्रहण सूर्यास्त तक जारी', sa: 'ग्रहणं सूर्यास्तपर्यन्तं प्रचलति' }, locale) : tl({ en: 'Moon fully separates from Sun', hi: 'चन्द्र सूर्य से अलग', sa: 'चन्द्रः सूर्यात् पूर्णतः पृथग् भवति' }, locale)}
                                    />
                                  </>
                                ) : (
                                  <>
                                    {/* Lunar eclipse phases: P1 (penumbral) → U1 (umbral) → Max → U2 → P4 */}
                                    {local.eclipseStart && (
                                      <TimeCell label={tl({ en: 'Penumbral Begins (P1)', hi: 'उपच्छाया आरम्भ (P1)', sa: 'उपच्छायारम्भः (P1)' }, locale)} time={local.eclipseStart} accent="text-text-secondary/60" subtitle={tl({ en: 'Subtle dimming starts', hi: 'सूक्ष्म मलिनता आरम्भ', sa: 'सूक्ष्मं मलिनत्वमारभते' }, locale)} />
                                    )}
                                    {local.partialStart && (
                                      <TimeCell label={tl({ en: 'Umbral Begins (U1)', hi: 'प्रच्छाया आरम्भ (U1)', sa: 'प्रच्छायारम्भः (U1)' }, locale)} time={local.partialStart} accent={accentColor} subtitle={tl({ en: 'Dark shadow visibly enters Moon', hi: 'स्पष्ट छाया दिखती है', sa: 'तमसी छाया चन्द्रं प्रविशति' }, locale)} />
                                    )}
                                    {local.maximum && (
                                      <TimeCell label={tl({ en: 'Maximum Eclipse', hi: 'अधिकतम ग्रहण', sa: 'अधिकतमं ग्रहणम्' }, locale)} time={local.maximum} accent="text-gold-light" highlight subtitle={tl({ en: 'Peak shadow coverage', hi: 'अधिकतम आच्छादन', sa: 'छायाच्छादनस्य शिखरम्' }, locale)} />
                                    )}
                                    {local.partialEnd && (
                                      <TimeCell label={tl({ en: 'Umbral Ends (U2)', hi: 'प्रच्छाया समाप्त (U2)', sa: 'प्रच्छायासमाप्तिः (U2)' }, locale)} time={local.partialEnd} accent={accentColor} subtitle={tl({ en: 'Dark shadow starts to leave', hi: 'अन्धकार हटना आरम्भ', sa: 'तमसी छाया निवर्तितुमारभते' }, locale)} />
                                    )}
                                    <TimeCell
                                      label={
                                        local.endsAtMoonset
                                          ? tl({ en: 'Ends at Moonset', hi: 'चन्द्रास्त पर समाप्त', sa: 'चन्द्रास्ते समाप्यते' }, locale)
                                          : tl({ en: 'Penumbral Ends (P4)', hi: 'उपच्छाया समाप्त (P4)', sa: 'उपच्छायासमाप्तिः (P4)' }, locale)
                                      }
                                      time={local.eclipseEnd || '--:--'}
                                      accent="text-text-secondary/60"
                                      subtitle={local.endsAtMoonset ? tl({ en: 'Eclipse in progress at moonset', hi: 'ग्रहण चन्द्रास्त तक जारी', sa: 'चन्द्रास्तपर्यन्तं ग्रहणं प्रचलति' }, locale) : tl({ en: 'Moon fully bright again', hi: 'चन्द्रमा पूर्ण प्रकाशित', sa: 'चन्द्रमाः पुनः पूर्णप्रकाशितः' }, locale)}
                                    />
                                  </>
                                )}
                              </div>

                              {/* Duration + Magnitude row */}
                              <div className="flex flex-wrap gap-4 mt-4 pt-4 border-t border-gold-primary/8">
                                {local.durationFormatted && (
                                  <div>
                                    <div className="text-[10px] text-text-secondary/50 uppercase tracking-wider">{tl({ en: 'Total Duration', hi: 'कुल अवधि', sa: 'कुलावधिः' }, locale)}</div>
                                    <div className="text-sm text-gold-light font-mono font-bold">{local.durationFormatted}</div>
                                  </div>
                                )}
                                <div>
                                  <div className="text-[10px] text-text-secondary/50 uppercase tracking-wider">{tl({ en: 'Max Magnitude', hi: 'अधिकतम परिमाण', sa: 'अधिकतमपरिमाणम्' }, locale)}</div>
                                  <div className="text-sm text-gold-light font-mono font-bold">{local.maxMagnitude.toFixed(2)}</div>
                                  <div className="text-[10px] text-text-secondary/40 mt-0.5">{getMagnitudeLabel(local.maxMagnitude, isSolar, locale)}</div>
                                </div>
                                {local.magnitudeAtSunset !== null && local.magnitudeAtSunset !== undefined && (
                                  <div>
                                    <div className="text-[10px] text-text-secondary/50 uppercase tracking-wider">{tl({ en: 'Magnitude at Sunset', hi: 'सूर्यास्त पर परिमाण', sa: 'सूर्यास्ते परिमाणम्' }, locale)}</div>
                                    <div className="text-sm text-gold-light font-mono font-bold">{local.magnitudeAtSunset.toFixed(2)}</div>
                                  </div>
                                )}
                                {local.sunrise && (
                                  <div>
                                    <div className="text-[10px] text-text-secondary/50 uppercase tracking-wider">{tl({ en: 'Sunrise', hi: 'सूर्योदय', sa: 'सूर्योदयः' }, locale)}</div>
                                    <div className="text-sm text-text-secondary font-mono">{local.sunrise}</div>
                                  </div>
                                )}
                                {local.sunset && (
                                  <div>
                                    <div className="text-[10px] text-text-secondary/50 uppercase tracking-wider">{tl({ en: 'Sunset', hi: 'सूर्यास्त', sa: 'सूर्यास्तः' }, locale)}</div>
                                    <div className="text-sm text-text-secondary font-mono">{local.sunset}</div>
                                  </div>
                                )}
                              </div>
                            </div>

                            {/* ── Sutak Period ── */}
                            {local.sutakApplicable && (
                              <div className="rounded-xl bg-gradient-to-br from-[#2d1b69]/30 via-[#1a1040]/35 to-[#0a0e27] border border-amber-500/15 p-5">
                                <div className="flex items-center gap-2 mb-4">
                                  <Shield className="w-4 h-4 text-amber-400" />
                                  <h4 className="text-sm font-bold text-amber-300 uppercase tracking-wider" style={headingFont}>
                                    {tl({ en: 'Sutak Period', hi: 'सूतक काल', sa: 'सूतककालः' }, locale)}
                                  </h4>
                                </div>

                                {/* Recommended (most conservative) */}
                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-5">
                                  {local.sutakStart && (
                                    <TimeCell label={tl({ en: 'Sutak Begins (Recommended)', hi: 'सूतक आरम्भ (अनुशंसित)', sa: 'सूतकारम्भः (अनुशंसितः)' }, locale)} time={local.sutakStart} accent="text-amber-400" highlight />
                                  )}
                                  {local.sutakEnd && (
                                    <TimeCell label={tl({ en: 'Sutak Ends', hi: 'सूतक समाप्त', sa: 'सूतकसमाप्तिः' }, locale)} time={local.sutakEnd} accent="text-amber-400" />
                                  )}
                                  {local.sutakVulnerableStart && (
                                    <TimeCell
                                      label={tl({ en: 'Kids/Old/Sick', hi: 'बच्चे/वृद्ध/रोगी', sa: 'बालाः/वृद्धाः/रोगिणः' }, locale)}
                                      time={local.sutakVulnerableStart}
                                      accent="text-amber-400/70"
                                      subtitle={tl({ en: 'Sutak Begins', hi: 'सूतक आरम्भ', sa: 'सूतकारम्भः' }, locale)}
                                    />
                                  )}
                                </div>

                                {/* 3 Classical Traditions */}
                                <div className="border-t border-amber-500/10 pt-4">
                                  <p className="text-[10px] text-text-secondary/40 uppercase tracking-wider font-bold mb-3">
                                    {tl({ en: 'Sutak per Classical Texts', hi: 'शास्त्रीय ग्रन्थों के अनुसार सूतक', sa: 'शास्त्रीयग्रन्थानुसारं सूतकम्' }, locale)}
                                  </p>
                                  <div className="space-y-2">
                                    {local.sutakTraditions.muhurtaChintamani && (
                                      <div className="flex items-center justify-between gap-3 px-3 py-2 rounded-lg bg-amber-500/5">
                                        <div className="min-w-0">
                                          <span className="text-xs text-amber-300 font-semibold">{tl({ en: 'Muhurta Chintamani', hi: 'मुहूर्त चिन्तामणि', sa: 'मुहूर्तचिन्तामणिः' }, locale)}</span>
                                          <span className="text-[10px] text-text-secondary/40 ml-2">{local.sutakTraditions.muhurtaChintamani.label}</span>
                                        </div>
                                        <span className="text-sm font-mono font-bold text-amber-400 shrink-0">{local.sutakTraditions.muhurtaChintamani.start}</span>
                                      </div>
                                    )}
                                    {local.sutakTraditions.dharmaSindhu && (
                                      <div className="flex items-center justify-between gap-3 px-3 py-2 rounded-lg bg-amber-500/5">
                                        <div className="min-w-0">
                                          <span className="text-xs text-amber-300 font-semibold">{tl({ en: 'Dharmasindhu', hi: 'धर्मसिन्धु', sa: 'धर्मसिन्धुः' }, locale)}</span>
                                          <span className="text-[10px] text-text-secondary/40 ml-2">{local.sutakTraditions.dharmaSindhu.label}</span>
                                        </div>
                                        <span className="text-sm font-mono font-bold text-amber-400 shrink-0">{local.sutakTraditions.dharmaSindhu.start}</span>
                                      </div>
                                    )}
                                    {local.sutakTraditions.nirnyaSindhu && (
                                      <div className="flex items-center justify-between gap-3 px-3 py-2 rounded-lg bg-amber-500/5">
                                        <div className="min-w-0">
                                          <span className="text-xs text-amber-300 font-semibold">{tl({ en: 'Nirnaya Sindhu', hi: 'निर्णय सिन्धु', sa: 'निर्णयसिन्धुः' }, locale)}</span>
                                          <span className="text-[10px] text-text-secondary/40 ml-2">{local.sutakTraditions.nirnyaSindhu.label}</span>
                                        </div>
                                        <span className="text-sm font-mono font-bold text-amber-400 shrink-0">{local.sutakTraditions.nirnyaSindhu.start}</span>
                                      </div>
                                    )}
                                  </div>
                                  <p className="text-[10px] text-text-secondary/30 mt-2 italic">
                                    {tl({ en: 'Recommended time is based on the most conservative (earliest) tradition.', hi: 'अनुशंसित समय सबसे रूढ़िवादी (सबसे पहले) ग्रन्थ पर आधारित है।', sa: 'अनुशंसितः समयः सर्वाधिकरूढिवादिनः (प्राचीनतमस्य) परम्परायाः आधारितः अस्ति।' }, locale)}
                                  </p>
                                </div>
                              </div>
                            )}

                            {/* Visibility note */}
                            {local.visibilityNote && (
                              <div className="flex items-center gap-2 text-xs text-text-secondary/60">
                                {isSolar ? <Sun className="w-3.5 h-3.5 text-amber-400/50" /> : <Moon className="w-3.5 h-3.5 text-indigo-400/50" />}
                                <span style={bodyFont}>{local.visibilityNote}</span>
                                {local.saros > 0 && <span className="ml-auto text-text-secondary/30 font-mono">Saros {local.saros}</span>}
                              </div>
                            )}
                          </>
                        )}

                        {/* Not visible message */}
                        {local && !isVisible && (
                          <div className="text-center py-4">
                            <EyeOff className="w-8 h-8 text-text-secondary/20 mx-auto mb-2" />
                            <p className="text-text-secondary/50 text-sm" style={bodyFont}>
                              {tl({ en: 'This eclipse is not visible from your location. Sutak does not apply.', hi: 'यह ग्रहण आपके स्थान से दृश्य नहीं है। सूतक लागू नहीं।', sa: 'एतद् ग्रहणं भवतः स्थानात् दृश्यं नास्ति। सूतकं न प्रवर्तते।' }, locale)}
                            </p>
                          </div>
                        )}

                        {/* No location */}
                        {!local && (
                          <div className="text-center py-4 text-text-secondary/50 text-sm">
                            <MapPin className="w-5 h-5 mx-auto mb-2 opacity-30" />
                            <p style={bodyFont}>
                              {tl({ en: 'Allow location access for local timings.', hi: 'स्थानीय समय के लिए स्थान की अनुमति दें।', sa: 'स्थानीयसमयार्थं स्थानानुमतिं ददातु।' }, locale)}
                            </p>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
          <div className="text-center text-text-secondary/50 text-sm mt-6">
            {eclipses.length} {tl({ en: `eclipse${eclipses.length !== 1 ? 's' : ''} this year`, hi: `ग्रहण इस वर्ष`, sa: `ग्रहण इस वर्ष` }, locale)}
          </div>
          {/* Show next significant if none visible this year */}
          {!eclipses.some(e => e.local?.visible && (e.local?.sutakApplicable || (e.local?.maxMagnitude ?? 0) > 0.3)) && (
            <NextSignificantCard next={nextSignificant} locale={locale} headingFont={headingFont} bodyFont={bodyFont} onNavigate={(y, date, type) => { setYear(y); setExpanded(`${date}-${type}`); }} />
          )}
        </div>
      )}
    </div>
  );
}

// ─── Sub-components ──────────────────────────────────────────────────────────

/** Card showing the next significant visible eclipse when current year has none */
function NextSignificantCard({
  next,
  locale,
  headingFont,
  bodyFont,
  onNavigate,
}: {
  next: { date: string; year: number; type: 'solar' | 'lunar'; subtype: string; magnitude: number; visibilityNote: string } | null;
  locale: string;
  headingFont: React.CSSProperties;
  bodyFont: React.CSSProperties | undefined;
  onNavigate: (year: number, date: string, type: string) => void;
}) {
  if (!next) return null;

  const isSolar = next.type === 'solar';
  const accentColor = isSolar ? 'text-amber-400' : 'text-indigo-400';
  const borderAccent = isSolar ? 'border-amber-500/30' : 'border-indigo-500/30';

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr + 'T00:00:00');
    return d.toLocaleDateString(tl({ en: 'en-IN', hi: 'hi-IN', sa: 'sa-IN' }, locale), { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
  };

  const subtypeLabel = {
    total: tl({ en: 'Total', hi: 'पूर्ण', sa: 'पूर्णम्' }, locale),
    annular: tl({ en: 'Annular', hi: 'वलयाकार', sa: 'वलयाकारम्' }, locale),
    partial: tl({ en: 'Partial', hi: 'आंशिक', sa: 'आंशिकम्' }, locale),
    hybrid: tl({ en: 'Hybrid', hi: 'संकर', sa: 'संकरम्' }, locale),
    penumbral: tl({ en: 'Penumbral', hi: 'उपच्छाया', sa: 'उपच्छायम्' }, locale),
  }[next.subtype] || next.subtype;

  const typeLabel = isSolar
    ? tl({ en: 'Solar Eclipse', hi: 'सूर्य ग्रहण', sa: 'सूर्यग्रहणम्' }, locale)
    : tl({ en: 'Lunar Eclipse', hi: 'चन्द्र ग्रहण', sa: 'चन्द्रग्रहणम्' }, locale);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="mt-8"
    >
      <p className="text-text-secondary/50 text-xs uppercase tracking-wider font-bold mb-3">
        {tl({ en: 'Next Significant Visible Eclipse', hi: 'अगला महत्वपूर्ण दृश्य ग्रहण', sa: 'अग्रिमं महत्त्वपूर्णं दृश्यग्रहणम्' }, locale)}
      </p>
      <button
        onClick={() => onNavigate(next.year, next.date, next.type)}
        className={`w-full text-left bg-gradient-to-br from-[#2d1b69]/50 via-[#1a1040]/60 to-[#0a0e27] rounded-2xl border-2 ${borderAccent} p-6 hover:border-gold-primary/40 hover:scale-[1.01] transition-all group`}
      >
        <div className="flex items-center gap-4">
          {/* Icon */}
          <div className="flex-shrink-0">
            <svg viewBox="0 0 48 48" className="w-12 h-12">
              {isSolar ? (
                <>
                  <circle cx="24" cy="24" r="18" fill="#f59e0b" opacity="0.15" />
                  <circle cx="24" cy="24" r="14" fill="#0a0e27" />
                  <circle cx="24" cy="24" r="18" fill="none" stroke="#f59e0b" strokeWidth="1.5" />
                </>
              ) : (
                <>
                  <circle cx="24" cy="24" r="16" fill="#818cf8" opacity="0.15" />
                  <circle cx="24" cy="24" r="16" fill="none" stroke="#818cf8" strokeWidth="1.5" />
                  <path d="M 24 8 A 16 16 0 0 1 24 40" fill="#0a0e27" />
                </>
              )}
            </svg>
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <span className={`text-lg font-bold ${accentColor} group-hover:text-gold-light transition-colors`} style={headingFont}>
                {subtypeLabel} {typeLabel}
              </span>
              <span className="text-xs font-mono text-gold-light/70">
                {tl({ en: 'Mag', hi: 'परिमाण', sa: 'परिमाणम्' }, locale)} {next.magnitude.toFixed(2)}
              </span>
            </div>
            <div className="text-gold-light text-sm font-mono mb-1">{formatDate(next.date)}</div>
            <div className="text-text-secondary/60 text-xs" style={bodyFont}>{next.visibilityNote}</div>
          </div>

          <div className="shrink-0 flex flex-col items-center">
            <ChevronRight className="w-5 h-5 text-gold-primary/50 group-hover:text-gold-light group-hover:translate-x-1 transition-all" />
            <span className="text-[9px] text-gold-primary/40 mt-1">{tl({ en: 'View details', hi: 'विवरण देखें', sa: 'विवरणं पश्यतु' }, locale)}</span>
          </div>
        </div>
      </button>
    </motion.div>
  );
}

/** Visual phase diagram showing eclipse progression */
function EclipsePhaseDiagram({ local, isSolar, locale }: { local: LocalEclipseResult; isSolar: boolean; locale: string }) {
  if (isSolar) {
    // Solar: C1 → Max → C4 (or sunset)
    const phases = [
      { time: local.eclipseStart, label: 'C1', color: '#f59e0b' },
      { time: local.maximum, label: tl({ en: 'Max', hi: 'अधिकतम', sa: 'अधिकतमम्' }, locale), color: '#f0d48a' },
      { time: local.eclipseEnd, label: local.endsAtSunset ? '☀↓' : 'C4', color: '#f59e0b' },
    ].filter(p => p.time);

    return (
      <div className="mb-4">
        {/* Progress bar */}
        <div className="relative h-3 rounded-full overflow-hidden bg-white/5">
          {/* Partial phase — full bar */}
          <div className="absolute inset-0 bg-gradient-to-r from-amber-500/20 via-amber-500/40 to-amber-500/20 rounded-full" />
          {/* Max point indicator */}
          <div className="absolute top-0 bottom-0 w-1 bg-amber-400 rounded-full" style={{ left: '50%', transform: 'translateX(-50%)' }} />
        </div>
        {/* Labels */}
        <div className="flex justify-between mt-1.5">
          {phases.map((p, i) => (
            <div key={i} className={`text-center ${i === 1 ? 'flex-1' : ''}`}>
              <div className="text-[9px] font-bold" style={{ color: p.color }}>{p.label}</div>
              <div className="text-[10px] text-text-secondary/50 font-mono">{p.time}</div>
            </div>
          ))}
        </div>
        {/* Phase label */}
        <div className="text-center text-[9px] text-amber-400/40 mt-1">
          {tl({ en: '← Partial Phase →', hi: '← आंशिक चरण →', sa: '← आंशिकचरणम् →' }, locale)}
        </div>
      </div>
    );
  }

  // Lunar: P1 → U1 → Max → U2 → P4
  const hasUmbral = local.partialStart && local.partialEnd;
  const phases = [
    { time: local.eclipseStart, label: 'P1', desc: tl({ en: 'Penumbral', hi: 'उपच्छाया', sa: 'उपच्छायम्' }, locale) },
    ...(hasUmbral ? [{ time: local.partialStart!, label: 'U1', desc: tl({ en: 'Umbral', hi: 'प्रच्छाया', sa: 'प्रच्छायम्' }, locale) }] : []),
    { time: local.maximum, label: tl({ en: 'Max', hi: 'अधिकतम', sa: 'अधिकतमम्' }, locale), desc: '' },
    ...(hasUmbral ? [{ time: local.partialEnd!, label: 'U2', desc: '' }] : []),
    { time: local.eclipseEnd, label: local.endsAtMoonset ? '☽↓' : 'P4', desc: '' },
  ].filter(p => p.time);

  return (
    <div className="mb-4">
      {/* Multi-phase bar */}
      <div className="relative h-3 rounded-full overflow-hidden bg-white/5">
        {hasUmbral ? (
          <>
            {/* Penumbral phase — lighter */}
            <div className="absolute inset-0 bg-indigo-500/15 rounded-full" />
            {/* Umbral phase — darker, centered */}
            <div className="absolute top-0 bottom-0 bg-indigo-500/40 rounded-full" style={{ left: '25%', right: '25%' }} />
            {/* Totality point if applicable */}
            {local.maxMagnitude >= 1.0 && (
              <div className="absolute top-0 bottom-0 bg-red-500/50 rounded-full" style={{ left: '40%', right: '40%' }} />
            )}
          </>
        ) : (
          /* Penumbral only */
          <div className="absolute inset-0 bg-indigo-500/15 rounded-full" />
        )}
        {/* Max indicator */}
        <div className="absolute top-0 bottom-0 w-1 bg-indigo-400 rounded-full" style={{ left: '50%', transform: 'translateX(-50%)' }} />
      </div>
      {/* Labels */}
      <div className="flex justify-between mt-1.5">
        {phases.map((p, i) => (
          <div key={i} className="text-center">
            <div className="text-[9px] font-bold text-indigo-300">{p.label}</div>
            <div className="text-[10px] text-text-secondary/50 font-mono">{p.time}</div>
          </div>
        ))}
      </div>
      {/* Phase labels */}
      {hasUmbral && (
        <div className="flex justify-center gap-4 mt-1 text-[9px]">
          <span className="text-indigo-400/30">{tl({ en: 'Penumbral', hi: 'उपच्छाया', sa: 'उपच्छायम्' }, locale)}</span>
          <span className="text-indigo-400/60">{tl({ en: 'Umbral (Shadow)', hi: 'प्रच्छाया (छाया)', sa: 'प्रच्छायम् (छाया)' }, locale)}</span>
          {local.maxMagnitude >= 1.0 && <span className="text-red-400/50">{tl({ en: 'Total (Blood Moon)', hi: 'पूर्ण (रक्त चन्द्र)', sa: 'पूर्णम् (रक्तचन्द्रः)' }, locale)}</span>}
        </div>
      )}
    </div>
  );
}

/** Classical implications based on which node the eclipse occurs at */
function NodeImplications({ node, eclipseType, locale, bodyFont, headingFont }: {
  node: 'rahu' | 'ketu'; eclipseType: 'solar' | 'lunar'; locale: string;
  bodyFont: React.CSSProperties | undefined; headingFont: React.CSSProperties;
}) {
  const implications: Record<string, { title: LocaleText; mundane: LocaleText; personal: LocaleText; remedy: LocaleText }> = {
    'rahu-solar': {
      title: { en: '☊ Rahu Solar Eclipse — Ambition Eclipses Authority', hi: '☊ राहु सूर्य ग्रहण — महत्वाकांक्षा अधिकार को ग्रसती है', sa: '☊ राहु सूर्यग्रहणम् — महत्त्वाकाङ्क्षा अधिकारं ग्रसते', mai: '☊ राहु सूर्य ग्रहण — महत्वाकांक्षा अधिकार केँ ग्रसैत अछि', mr: '☊ राहू सूर्यग्रहण — महत्त्वाकांक्षा सत्तेला ग्रासते', ta: '☊ ராகு சூரிய கிரகணம் — பேராசை அதிகாரத்தை கிரகிக்கிறது', te: '☊ రాహు సూర్యగ్రహణం — మహత్వాకాంక్ష అధికారాన్ని గ్రహిస్తుంది', bn: '☊ রাহু সূর্যগ্রহণ — উচ্চাকাঙ্ক্ষা কর্তৃত্বকে গ্রাস করে', kn: '☊ ರಾಹು ಸೂರ್ಯಗ್ರಹಣ — ಮಹತ್ವಾಕಾಂಕ್ಷೆ ಅಧಿಕಾರವನ್ನು ಗ್ರಹಿಸುತ್ತದೆ', gu: '☊ રાહુ સૂર્યગ્રહણ — મહત્વાકાંક્ષા સત્તાને ગ્રહણ કરે છે' },
      mundane: { en: 'Disruption to ruling powers, political deception, foreign influence on governance, technology-driven upheaval. Leaders face challenges from unconventional forces.', hi: 'शासन शक्ति में व्यवधान, राजनीतिक छल, शासन पर विदेशी प्रभाव, तकनीक-प्रेरित उथल-पुथल। नेताओं को अपरम्परागत शक्तियों से चुनौती।', sa: 'शासनशक्तौ व्यवधानम्, राजनैतिकं छलम्, शासनस्य उपरि वैदेशिकः प्रभावः, तान्त्रिकी-प्रेरितः उत्पातः। नेतारः अपरम्परागतशक्तिभ्यः आह्वानं प्राप्नुवन्ति।', mai: 'शासन शक्ति मे व्यवधान, राजनीतिक छल, शासन पर विदेशी प्रभाव, तकनीक-प्रेरित उथल-पुथल। नेता सभ केँ अपरम्परागत शक्ति सँ चुनौती।', mr: 'शासन शक्तीमध्ये व्यत्यय, राजकीय कपट, शासनावर विदेशी प्रभाव, तंत्रज्ञान-प्रेरित उलथापालथ. नेत्यांना अपारंपरिक शक्तींकडून आव्हान.', ta: 'ஆளும் சக்திகளில் சீர்குலைவு, அரசியல் ஏமாற்றம், ஆட்சியில் வெளிநாட்டு செல்வாக்கு, தொழில்நுட்ப உந்துதல் கொந்தளிப்பு. தலைவர்கள் வழக்கத்திற்கு மாறான சக்திகளிடமிருந்து சவால்களை எதிர்கொள்கிறார்கள்.', te: 'పాలక శక్తులలో అంతరాయం, రాజకీయ మోసం, పాలనపై విదేశీ ప్రభావం, సాంకేతిక ఆధారిత తిరుగుబాటు. నాయకులు అసాంప్రదాయ శక్తుల నుండి సవాళ్లను ఎదుర్కొంటారు.', bn: 'শাসক শক্তিতে বিঘ্ন, রাজনৈতিক প্রতারণা, শাসনে বিদেশী প্রভাব, প্রযুক্তি-চালিত উত্থান। নেতারা অপ্রচলিত শক্তির চ্যালেঞ্জ মোকাবেলা করেন।', kn: 'ಆಡಳಿತ ಶಕ್ತಿಗಳಲ್ಲಿ ಅಡ್ಡಿ, ರಾಜಕೀಯ ವಂಚನೆ, ಆಡಳಿತದ ಮೇಲೆ ವಿದೇಶಿ ಪ್ರಭಾವ, ತಂತ್ರಜ್ಞಾನ ಚಾಲಿತ ಪಲ್ಲಟ. ನಾಯಕರು ಅಸಾಂಪ್ರದಾಯಿಕ ಶಕ್ತಿಗಳಿಂದ ಸವಾಲುಗಳನ್ನು ಎದುರಿಸುತ್ತಾರೆ.', gu: 'શાસક શક્તિઓમાં વિક્ષેપ, રાજકીય છેતરપિંડી, શાસન પર વિદેશી પ્રભાવ, ટેકનોલોજી-સંચાલિત ઉથલપાથલ. નેતાઓ અપરંપરાગત શક્તિઓના પડકારોનો સામનો કરે છે.' },
      personal: {
        en: 'Ego crises, identity confusion, father\'s health issues. But also breakthroughs in foreign lands, technology, and unconventional career paths.\n\n' +
          '• Strongest for: Those in Sun or Rahu Mahadasha/Antardasha. Also potent if eclipse falls in your 1st, 10th, or 9th house (self, career, fortune).\n\n' +
          '• Natal contact: If within 3° of your natal Sun → authority/career disruption. Near natal Rahu → obsessive new direction. Near Ascendant → health + identity shift.\n\n' +
          '• Transit amplifiers: Saturn aspecting the eclipse = long-lasting structural change. Mars aspecting = sudden confrontation with authority figures.\n\n' +
          '• Effect window: Seeds planted at eclipse manifest over 6 months, typically triggered when a fast-moving planet (Mars, Sun) later transits the eclipse degree.',
        hi: 'अहंकार संकट, पहचान भ्रम, पिता का स्वास्थ्य। पर विदेश, तकनीक और अपरम्परागत कैरियर में सफलता भी।\n\n' +
          '• सर्वाधिक तीव्र: सूर्य या राहु महादशा/अन्तर्दशा में। 1, 10 या 9वें भाव में ग्रहण हो तो भी प्रबल।\n\n' +
          '• जन्म सम्पर्क: जन्म सूर्य के 3° भीतर → अधिकार/कैरियर व्यवधान। जन्म राहु के निकट → जुनूनी नई दिशा।\n\n' +
          '• गोचर प्रवर्धक: शनि की दृष्टि = दीर्घकालिक ढाँचागत परिवर्तन। मंगल की दृष्टि = अचानक टकराव।\n\n' +
          '• प्रभाव अवधि: 6 माह तक प्रभाव, जब तीव्र गोचर ग्रह ग्रहण अंश को स्पर्श करे तब फलित।',
      },
      remedy: { en: 'Surya Namaskar, Aditya Hridayam, donate wheat on Sunday. Rahu pacification: sesame oil + mustard donation on Saturday.', hi: 'सूर्य नमस्कार, आदित्य हृदयम, रविवार को गेहूँ दान। राहु शान्ति: शनिवार को तिल तेल + सरसों दान।', sa: 'सूर्यनमस्कारः, आदित्यहृदयम्, रविवासरे गोधूमदानम्। राहुशान्तिः: शनिवासरे तिलतैलम् + सर्षपदानम्।', mai: 'सूर्य नमस्कार, आदित्य हृदयम, रविदिन केँ गेहूँ दान। राहु शान्ति: शनिदिन केँ तिल तेल + सरसों दान।', mr: 'सूर्य नमस्कार, आदित्य हृदयम, रविवारी गहू दान. राहू शांती: शनिवारी तीळ तेल + मोहरी दान.', ta: 'சூரிய நமஸ்காரம், ஆதித்ய ஹிருதயம், ஞாயிறு கோதுமை தானம். ராகு சாந்தி: சனிக்கிழமை எள் எண்ணெய் + கடுகு தானம்.', te: 'సూర్య నమస్కారం, ఆదిత్య హృదయం, ఆదివారం గోధుమ దానం. రాహు శాంతి: శనివారం నువ్వుల నూనె + ఆవాల దానం.', bn: 'সূর্য নমস্কার, আদিত্য হৃদয়ম্, রবিবার গম দান। রাহু শান্তি: শনিবার তিল তেল + সরষে দান।', kn: 'ಸೂರ್ಯ ನಮಸ್ಕಾರ, ಆದಿತ್ಯ ಹೃದಯಂ, ಭಾನುವಾರ ಗೋಧಿ ದಾನ. ರಾಹು ಶಾಂತಿ: ಶನಿವಾರ ಎಳ್ಳೆಣ್ಣೆ + ಸಾಸಿವೆ ದಾನ.', gu: 'સૂર્ય નમસ્કાર, આદિત્ય હૃદયમ્, રવિવારે ઘઉં દાન. રાહુ શાંતિ: શનિવારે તલ તેલ + સરસવ દાન.' },
    },
    'ketu-solar': {
      title: { en: '☋ Ketu Solar Eclipse — Karma Strips Away Ego', hi: '☋ केतु सूर्य ग्रहण — कर्म अहंकार छीनता है', sa: '☋ केतु सूर्यग्रहणम् — कर्म अहङ्कारं हरति', mai: '☋ केतु सूर्य ग्रहण — कर्म अहंकार छीनैत अछि', mr: '☋ केतू सूर्यग्रहण — कर्म अहंकार हिरावून घेतो', ta: '☋ கேது சூரிய கிரகணம் — வினை அகங்காரத்தை அகற்றுகிறது', te: '☋ కేతు సూర్యగ్రహణం — కర్మ అహంకారాన్ని తొలగిస్తుంది', bn: '☋ কেতু সূর্যগ্রহণ — কর্ম অহংকার দূর করে', kn: '☋ ಕೇತು ಸೂರ್ಯಗ್ರಹಣ — ಕರ್ಮ ಅಹಂಕಾರವನ್ನು ಕಳಚುತ್ತದೆ', gu: '☋ કેતુ સૂર્યગ્રહણ — કર્મ અહંકારને દૂર કરે છે' },
      mundane: { en: 'Fall of arrogant leaders, exposure of hidden truths, spiritual movements gaining strength. Established structures crumble to make way for renewal.', hi: 'अहंकारी नेताओं का पतन, छिपे सत्यों का उद्घाटन, आध्यात्मिक आन्दोलनों को बल। स्थापित ढाँचे नवीनीकरण के लिए ढहते हैं।', sa: 'अहङ्कारिणां नेतॄणां पतनम्, गूढसत्यानाम् उद्घाटनम्, आध्यात्मिकान्दोलनानां बलम्। स्थापितानि ढाञ्चानि नवीनीकरणार्थं विनश्यन्ति।', mai: 'अहंकारी नेता सभक पतन, छिपल सत्य सभक उद्घाटन, आध्यात्मिक आन्दोलन सभ केँ बल। स्थापित ढाँचा नवीनीकरण लेल ढहैत अछि।', mr: 'अहंकारी नेत्यांचे पतन, लपलेल्या सत्यांचा उलगडा, आध्यात्मिक चळवळींना बळ. स्थापित ढाचे नूतनीकरणासाठी कोसळतात.', ta: 'அகங்கார தலைவர்களின் வீழ்ச்சி, மறைந்த உண்மைகள் வெளிப்படுதல், ஆன்மிக இயக்கங்கள் வலுப்பெறுகின்றன. நிலைநாட்டப்பட்ட கட்டமைப்புகள் புதுப்பித்தலுக்கு வழிவிடுகின்றன.', te: 'అహంకారపు నాయకుల పతనం, దాగిన సత్యాల బట్టబయలు, ఆధ్యాత్మిక ఉద్యమాలు బలం పుంజుకుంటున్నాయి. స్థిరపడిన నిర్మాణాలు పునరుద్ధరణకు మార్గం ఇస్తాయి.', bn: 'অহংকারী নেতাদের পতন, গোপন সত্যের উন্মোচন, আধ্যাত্মিক আন্দোলন শক্তি অর্জন করছে। প্রতিষ্ঠিত কাঠামো পুনর্নবীকরণের পথ করে দিতে ভেঙে পড়ে।', kn: 'ಅಹಂಕಾರಿ ನಾಯಕರ ಪತನ, ಗುಪ್ತ ಸತ್ಯಗಳ ಬಹಿರಂಗ, ಆಧ್ಯಾತ್ಮಿಕ ಚಳವಳಿಗಳು ಬಲ ಪಡೆಯುತ್ತಿವೆ. ಸ್ಥಾಪಿತ ರಚನೆಗಳು ನವೀಕರಣಕ್ಕೆ ದಾರಿ ಮಾಡಿಕೊಡುತ್ತವೆ.', gu: 'અહંકારી નેતાઓનું પતન, છુપાયેલા સત્યોનો ભાંડો ફૂટવો, આધ્યાત્મિક ચળવળો મજબૂત થઈ રહી છે. સ્થાપિત માળખાં નવીનીકરણ માટે માર્ગ બનાવે છે.' },
      personal: {
        en: 'Sudden detachment from career or status, health scares redirecting life purpose, deep spiritual experiences, liberation from old patterns. The more transformative of the two solar eclipse types.\n\nWhy some people feel it intensely while others barely notice:\n\n' +
          '• Mahadasha/Antardasha — Those running Sun, Ketu, or the lord of the house where the eclipse falls experience the strongest effects. A Sun Mahadasha during a Ketu solar eclipse can trigger a complete identity transformation. Ketu Mahadasha amplifies the detachment and spiritual intensity further.\n\n' +
          '• Natal chart contact — If the eclipse degree is within 3° of your natal Sun, Moon, Ascendant, or any planet, that planet\'s significations are activated powerfully. Eclipse conjunct natal Sun = career/authority crisis. Conjunct natal Moon = emotional upheaval. Conjunct natal Saturn = structural collapse that forces rebuilding.\n\n' +
          '• House placement — The house where the eclipse falls (from your Ascendant) determines WHICH life area is affected: 1st = self/health, 7th = marriage/partnerships, 10th = career/reputation, 4th = home/mother, etc. Check which house the eclipse sign occupies in your birth chart.\n\n' +
          '• Nakshatra lord — The nakshatra where the eclipse occurs connects it to a specific planetary energy. If that nakshatra lord is also your dasha lord, the effect is magnified enormously.\n\n' +
          '• Transit interactions — If transiting Saturn, Jupiter, or Mars are also aspecting the eclipse degree, the intensity compounds. Saturn + Ketu eclipse = maximum karmic pressure. Jupiter + Ketu eclipse = spiritual breakthrough with teacher/guru.\n\n' +
          '• Effect window — Eclipse effects are not instant. They unfold over 6 months (solar) to 3 months (lunar). The eclipse "seeds" an event that manifests when a transit planet later activates the eclipse degree.',
        hi: 'कैरियर/प्रतिष्ठा से अचानक वैराग्य, स्वास्थ्य भय जो जीवन उद्देश्य बदले, गहन आध्यात्मिक अनुभव, पुराने प्रतिमानों से मुक्ति। दो सूर्य ग्रहण प्रकारों में अधिक परिवर्तनकारी।\n\n' +
          'कुछ लोग क्यों तीव्रता से अनुभव करते हैं, कुछ नहीं:\n\n' +
          '• महादशा/अन्तर्दशा — जो सूर्य, केतु या ग्रहण वाले भाव के स्वामी की दशा में हैं, वे सबसे तीव्र प्रभाव अनुभव करते हैं। केतु सूर्य ग्रहण में सूर्य महादशा = पूर्ण पहचान परिवर्तन। केतु महादशा वैराग्य और आध्यात्मिक तीव्रता और बढ़ाती है।\n\n' +
          '• जन्म कुण्डली सम्पर्क — यदि ग्रहण अंश आपके जन्म सूर्य, चन्द्र, लग्न या किसी ग्रह के 3° के भीतर है, तो उस ग्रह के कारकत्व शक्तिशाली रूप से सक्रिय होते हैं। जन्म सूर्य पर ग्रहण = कैरियर संकट। जन्म चन्द्र पर = भावनात्मक उथल-पुथल। जन्म शनि पर = ढाँचागत पतन।\n\n' +
          '• भाव स्थान — ग्रहण जिस भाव में पड़ता है (लग्न से) वह निर्धारित करता है कि कौन सा जीवन क्षेत्र प्रभावित होगा: 1 = स्व/स्वास्थ्य, 7 = विवाह, 10 = कैरियर, 4 = गृह/माता आदि।\n\n' +
          '• नक्षत्र स्वामी — ग्रहण जिस नक्षत्र में होता है वह एक विशिष्ट ग्रह ऊर्जा से जुड़ता है। यदि वह नक्षत्र स्वामी आपका दशा स्वामी भी है, तो प्रभाव अत्यन्त बढ़ जाता है।\n\n' +
          '• गोचर अन्तर्क्रिया — यदि गोचरी शनि, बृहस्पति या मंगल भी ग्रहण अंश को दृष्टि दे रहे हैं, तो तीव्रता और बढ़ती है। शनि + केतु ग्रहण = अधिकतम कार्मिक दबाव। बृहस्पति + केतु = गुरु/शिक्षक से आध्यात्मिक सफलता।\n\n' +
          '• प्रभाव अवधि — ग्रहण प्रभाव तुरन्त नहीं होते। ये 6 माह (सूर्य) से 3 माह (चन्द्र) तक प्रकट होते हैं। ग्रहण एक घटना का "बीज" बोता है जो बाद में गोचर ग्रह उस अंश को सक्रिय करने पर फलित होती है।',
      },
      remedy: { en: 'Maha Mrityunjaya mantra, Ketu pacification: donate blankets, flag to temple. Cat\'s eye gemstone (with astrologer guidance).', hi: 'महामृत्युंजय मन्त्र, केतु शान्ति: कम्बल दान, मन्दिर में ध्वज। लहसुनिया रत्न (ज्योतिषी मार्गदर्शन से)।' },
    },
    'rahu-lunar': {
      title: { en: '☊ Rahu Lunar Eclipse — Desires Cloud the Mind', hi: '☊ राहु चन्द्र ग्रहण — इच्छाएँ मन को ग्रसती हैं', sa: '☊ राहु चन्द्रग्रहणम् — इच्छाः मनः ग्रसन्ति', mai: '☊ राहु चन्द्र ग्रहण — इच्छा सभ मन केँ ग्रसैत अछि', mr: '☊ राहू चंद्रग्रहण — इच्छा मनाला ग्रासतात', ta: '☊ ராகு சந்திர கிரகணம் — ஆசைகள் மனதை மூடுகின்றன', te: '☊ రాహు చంద్రగ్రహణం — కోరికలు మనసును కప్పివేస్తాయి', bn: '☊ রাহু চন্দ্রগ্রহণ — কামনা মনকে আচ্ছন্ন করে', kn: '☊ ರಾಹು ಚಂದ್ರಗ್ರಹಣ — ಆಸೆಗಳು ಮನಸ್ಸನ್ನು ಮುಸುಕಿಸುತ್ತವೆ', gu: '☊ રાહુ ચંદ્રગ્રહણ — ઇચ્છાઓ મનને ઢાંકી દે છે' },
      mundane: { en: 'Mass emotional manipulation, public panic, deceptive media narratives, collective anxiety about the future. Water-related calamities possible.', hi: 'सामूहिक भावनात्मक हेरफेर, जन उन्माद, भ्रामक मीडिया, भविष्य के बारे में सामूहिक चिन्ता। जल सम्बन्धी आपदाएँ सम्भव।', sa: 'सामूहिकं भावनात्मकं हेरफेरम्, जनोन्मादः, भ्रामकं माध्यमम्, भविष्यस्य विषये सामूहिकी चिन्ता। जलसम्बन्धिन्यः आपदाः सम्भवाः।', mai: 'सामूहिक भावनात्मक हेरफेर, जन उन्माद, भ्रामक मीडिया, भविष्य बारे मे सामूहिक चिन्ता। जल सम्बन्धी आपदा सभ सम्भव।', mr: 'सामूहिक भावनिक हेरगिरी, जनतेचा उन्माद, भ्रामक माध्यमे, भविष्याबद्दल सामूहिक चिंता. जलसंबंधित आपत्ती शक्य.', ta: 'வெகுஜன உணர்ச்சிப்பூர்வ சீர்குலைவு, பொது பீதி, ஏமாற்று ஊடக கதைகள், எதிர்காலம் குறித்த கூட்டு கவலை. நீர் சார்ந்த பேரழிவுகள் சாத்தியம்.', te: 'సామూహిక భావోద్వేగ మార్పిడి, ప్రజా భయాందోళన, మోసపూరిత మీడియా కథనాలు, భవిష్యత్తు గురించి సామూహిక ఆందోళన. నీటి సంబంధిత విపత్తులు సాధ్యం.', bn: 'গণ আবেগ কারসাজি, জনতার আতঙ্ক, প্রতারণামূলক মিডিয়া বর্ণনা, ভবিষ্যৎ নিয়ে সম্মিলিত উদ্বেগ। জল-সম্পর্কিত বিপর্যয় সম্ভব।', kn: 'ಸಾಮೂಹಿಕ ಭಾವನಾತ್ಮಕ ಕುಶಲತೆ, ಸಾರ್ವಜನಿಕ ಭಯ, ಮೋಸಗಾರಿಕೆಯ ಮಾಧ್ಯಮ ನಿರೂಪಣೆಗಳು, ಭವಿಷ್ಯದ ಬಗ್ಗೆ ಸಾಮೂಹಿಕ ಆತಂಕ. ನೀರಿಗೆ ಸಂಬಂಧಿಸಿದ ವಿಪತ್ತುಗಳು ಸಾಧ್ಯ.', gu: 'સામૂહિક ભાવનાત્મક ચાલાકી, જનતામાં ગભરાટ, છેતરામણી મીડિયા કથાનકો, ભવિષ્ય વિશે સામૂહિક ચિંતા. પાણી સંબંધિત આફતો શક્ય.' },
      personal: {
        en: 'Emotional turbulence, mother\'s health issues, mental fog, irrational fears. But also sudden intuitive breakthroughs and psychic awakening.\n\n' +
          '• Strongest for: Moon or Rahu Mahadasha/Antardasha. Cancer Ascendant (Moon-ruled) feels this eclipse type most deeply.\n\n' +
          '• Natal contact: Eclipse near natal Moon → emotional crisis but also deepened intuition. Near natal Venus → relationship confusion driven by desire. Near natal Mercury → communication breakdown, media deception.\n\n' +
          '• House placement: In 4th house = home/mother upheaval. In 7th = relationship illusion exposed. In 12th = foreign connection or spiritual retreat.\n\n' +
          '• Effect window: Lunar eclipse effects unfold faster — within 3 months. Emotional processing happens in waves, often during subsequent Full Moons.',
        hi: 'भावनात्मक उथल-पुथल, माता का स्वास्थ्य, मानसिक धुंध, अतार्किक भय। पर अचानक सहज ज्ञान और मानसिक जागृति भी।\n\n' +
          '• सर्वाधिक तीव्र: चन्द्र या राहु महादशा में। कर्क लग्न (चन्द्र-शासित) सबसे गहराई से अनुभव करता है।\n\n' +
          '• जन्म सम्पर्क: जन्म चन्द्र के निकट → भावनात्मक संकट पर गहन अन्तर्ज्ञान भी। जन्म शुक्र के निकट → इच्छा-प्रेरित सम्बन्ध भ्रम।\n\n' +
          '• भाव स्थान: 4वें भाव में = गृह/माता उथल-पुथल। 7वें में = सम्बन्ध भ्रम उजागर। 12वें में = विदेश या आध्यात्मिक एकान्त।\n\n' +
          '• प्रभाव अवधि: चन्द्र ग्रहण प्रभाव तेज़ — 3 माह में। बाद की पूर्णिमाओं में लहरों में भावनात्मक प्रसंस्करण।',
      },
      remedy: { en: 'Chandra mantras, wear Pearl, donate milk and white items on Monday. Rahu pacification: coconut + camphor offering.', hi: 'चन्द्र मन्त्र, मोती धारण, सोमवार को दूध और श्वेत वस्तुएं दान। राहु शान्ति: नारियल + कपूर अर्पण।', sa: 'चन्द्रमन्त्रः, मुक्ताधारणम्, सोमवासरे दुग्धम् श्वेतवस्तूनि च दानम्। राहुशान्तिः: नारिकेलम् + कर्पूरम् अर्पणम्।', mai: 'चन्द्र मन्त्र, मोती धारण, सोमदिन केँ दूध आ उज्जर वस्तु सभ दान। राहु शान्ति: नारियल + कपूर अर्पण।', mr: 'चंद्र मंत्र, मोती धारण, सोमवारी दूध आणि पांढऱ्या वस्तू दान. राहू शांती: नारळ + कापूर अर्पण.', ta: 'சந்திர மந்திரங்கள், முத்து அணியுங்கள், திங்கள் பால் மற்றும் வெள்ளை பொருட்கள் தானம். ராகு சாந்தி: தேங்காய் + கற்பூர நைவேத்தியம்.', te: 'చంద్ర మంత్రాలు, ముత్యం ధరించండి, సోమవారం పాలు మరియు తెల్ల వస్తువులు దానం. రాహు శాంతి: కొబ్బరి + కర్పూరం అర్పణ.', bn: 'চন্দ্র মন্ত্র, মুক্তা ধারণ, সোমবার দুধ ও সাদা দ্রব্য দান। রাহু শান্তি: নারকেল + কর্পূর অর্পণ।', kn: 'ಚಂದ್ರ ಮಂತ್ರಗಳು, ಮುತ್ತು ಧರಿಸಿ, ಸೋಮವಾರ ಹಾಲು ಮತ್ತು ಬಿಳಿ ವಸ್ತುಗಳ ದಾನ. ರಾಹು ಶಾಂತಿ: ತೆಂಗಿನಕಾಯಿ + ಕರ್ಪೂರ ಅರ್ಪಣೆ.', gu: 'ચંદ્ર મંત્રો, મોતી ધારણ કરો, સોમવારે દૂધ અને સફેદ વસ્તુઓ દાન. રાહુ શાંતિ: નારિયેળ + કપૂર અર્પણ.' },
    },
    'ketu-lunar': {
      title: { en: '☋ Ketu Lunar Eclipse — Ancestral Karma Surfaces (Blood Moon)', hi: '☋ केतु चन्द्र ग्रहण — पूर्वज कर्म सतह पर (रक्त चन्द्र)', sa: '☋ केतु चन्द्रग्रहणम् — पूर्वजकर्म उपरिष्ठे (रक्तचन्द्रः)', mai: '☋ केतु चन्द्र ग्रहण — पूर्वज कर्म सतह पर (रक्त चन्द्र)', mr: '☋ केतू चंद्रग्रहण — पूर्वजांचे कर्म पृष्ठभागावर (रक्त चंद्र)', ta: '☋ கேது சந்திர கிரகணம் — முன்னோர் வினை வெளிப்படுகிறது (இரத்த நிலா)', te: '☋ కేతు చంద్రగ్రహణం — పూర్వీకుల కర్మ ఉపరితలానికి వస్తుంది (రక్త చంద్రుడు)', bn: '☋ কেতু চন্দ্রগ্রহণ — পূর্বপুরুষ কর্ম ভেসে ওঠে (রক্ত চাঁদ)', kn: '☋ ಕೇತು ಚಂದ್ರಗ್ರಹಣ — ಪೂರ್ವಜರ ಕರ್ಮ ಮೇಲ್ಮೈಗೆ ಬರುತ್ತದೆ (ರಕ್ತ ಚಂದ್ರ)', gu: '☋ કેતુ ચંદ્રગ્રહણ — પૂર્વજોનું કર્મ સપાટી પર આવે છે (લોહી ચંદ્ર)' },
      mundane: { en: 'Collective grief, revelations about the past, ancestral and cultural reckoning, spiritual purification movements. The Blood Moon symbolises the burning of past-life samskaras.', hi: 'सामूहिक शोक, अतीत के रहस्योद्घाटन, पूर्वज और सांस्कृतिक लेखा-जोखा, आध्यात्मिक शुद्धि आन्दोलन। रक्त चन्द्र पूर्वजन्म संस्कारों के दहन का प्रतीक।', sa: 'सामूहिकः शोकः, अतीतस्य रहस्योद्घाटनम्, पूर्वजानां साङ्स्कृतिकं लेखनम्, आध्यात्मिकशुद्ध्यान्दोलनम्। रक्तचन्द्रः पूर्वजन्मसंस्काराणां दहनस्य प्रतीकः।', mai: 'सामूहिक शोक, अतीतक रहस्योद्घाटन, पूर्वज आ सांस्कृतिक लेखा-जोखा, आध्यात्मिक शुद्धि आन्दोलन। रक्त चन्द्र पूर्वजन्म संस्कार सभक दहनक प्रतीक।', mr: 'सामूहिक शोक, भूतकाळाचे रहस्योद्घाटन, पूर्वज आणि सांस्कृतिक हिशेब, आध्यात्मिक शुद्धी चळवळ. रक्त चंद्र पूर्वजन्म संस्कारांच्या दहनाचे प्रतीक.', ta: 'கூட்டு துக்கம், கடந்த காலம் பற்றிய வெளிப்பாடுகள், முன்னோர் மற்றும் கலாசார கணக்கெடுப்பு, ஆன்மிக தூய்மைப்படுத்தும் இயக்கங்கள். இரத்த நிலா முற்பிறவி சம்ஸ்காரங்களின் எரிதலைக் குறிக்கிறது.', te: 'సామూహిక దుఃఖం, గతం గురించి వెల్లడింపులు, పూర్వీకుల మరియు సాంస్కృతిక లెక్కింపు, ఆధ్యాత్మిక శుద్ధి ఉద్యమాలు. రక్త చంద్రుడు పూర్వజన్మ సంస్కారాల దహనాన్ని సూచిస్తుంది.', bn: 'সম্মিলিত শোক, অতীত সম্পর্কে উদ্ঘাটন, পূর্বপুরুষ ও সাংস্কৃতিক হিসাবনিকাশ, আধ্যাত্মিক শুদ্ধি আন্দোলন। রক্ত চাঁদ পূর্বজন্ম সংস্কারের দহনের প্রতীক।', kn: 'ಸಾಮೂಹಿಕ ದುಃಖ, ಹಿಂದಿನ ಬಗ್ಗೆ ಬಹಿರಂಗಪಡಿಸುವಿಕೆಗಳು, ಪೂರ್ವಜ ಮತ್ತು ಸಾಂಸ್ಕೃತಿಕ ಲೆಕ್ಕಾಚಾರ, ಆಧ್ಯಾತ್ಮಿಕ ಶುದ್ಧಿ ಚಳವಳಿಗಳು. ರಕ್ತ ಚಂದ್ರ ಹಿಂದಿನ ಜನ್ಮ ಸಂಸ್ಕಾರಗಳ ದಹನವನ್ನು ಸಂಕೇತಿಸುತ್ತದೆ.', gu: 'સામૂહિક શોક, ભૂતકાળ વિશેના ખુલાસા, પૂર્વજ અને સાંસ્કૃતિક હિસાબ, આધ્યાત્મિક શુદ્ધિ ચળવળો. લોહી ચંદ્ર પૂર્વજન્મના સંસ્કારોના દહનનું પ્રતીક છે.' },
      personal: {
        en: 'Deep introspection, release of emotional baggage, past relationships resurface for closure, heightened psychic sensitivity. The most spiritually potent of all four eclipse types.\n\n' +
          '• Strongest for: Ketu or Moon Mahadasha/Antardasha. Those with natal Moon-Ketu conjunction or opposition are especially sensitive. Scorpio and Pisces Moon signs feel the spiritual dimension most acutely.\n\n' +
          '• Natal contact: Eclipse near natal Ketu → past-life memories or déjà vu experiences. Near natal Moon → involuntary emotional purging, crying without reason, dreams about deceased relatives. Near natal 8th house lord → transformation through crisis.\n\n' +
          '• Ancestral dimension: Ketu represents Pitri (ancestors). This eclipse often coincides with family deaths, inheritance matters, or sudden urge to perform Shraddha/Pitri Tarpan. Old family secrets may surface.\n\n' +
          '• Spiritual acceleration: If you are on a meditation/sadhana path, this eclipse type can catalyse breakthroughs. Many spiritual teachers report their deepest experiences during Ketu lunar eclipses.\n\n' +
          '• Effect window: 3 months, but the spiritual effects can last years. The "Blood Moon" energy is a portal — what you release during this eclipse stays released.',
        hi: 'गहन आत्मनिरीक्षण, भावनात्मक बोझ से मुक्ति, पिछले सम्बन्ध समापन हेतु पुनः प्रकट, मानसिक संवेदनशीलता बढ़ी। चारों ग्रहण प्रकारों में सर्वाधिक आध्यात्मिक।\n\n' +
          '• सर्वाधिक तीव्र: केतु या चन्द्र महादशा में। जन्म चन्द्र-केतु युति या प्रतिद्वन्द्विता वाले विशेष रूप से संवेदनशील। वृश्चिक और मीन चन्द्र राशि आध्यात्मिक आयाम सबसे तीव्रता से अनुभव करती है।\n\n' +
          '• जन्म सम्पर्क: जन्म केतु के निकट → पूर्वजन्म स्मृतियाँ। जन्म चन्द्र के निकट → अनैच्छिक भावनात्मक शुद्धि, बिना कारण रोना, मृत सम्बन्धियों के स्वप्न।\n\n' +
          '• पूर्वज आयाम: केतु पितृों का प्रतिनिधि है। यह ग्रहण प्रायः पारिवारिक मृत्यु, विरासत मामलों, या श्राद्ध/तर्पण की तीव्र इच्छा के साथ मेल खाता है।\n\n' +
          '• आध्यात्मिक त्वरण: ध्यान/साधना मार्ग पर हैं तो यह ग्रहण सफलता उत्प्रेरित कर सकता है। अनेक आध्यात्मिक गुरु केतु चन्द्र ग्रहण में गहनतम अनुभव बताते हैं।\n\n' +
          '• प्रभाव अवधि: 3 माह, पर आध्यात्मिक प्रभाव वर्षों तक। "रक्त चन्द्र" ऊर्जा एक द्वार है — इस ग्रहण में जो त्यागा वह त्यक्त रहता है।',
      },
      remedy: { en: 'Pitri Tarpan (ancestral offerings), Ketu pacification, meditation, seven-grain donation. Maha Mrityunjaya for protection.', hi: 'पितृ तर्पण, केतु शान्ति, ध्यान, सप्तधान्य दान। सुरक्षा हेतु महामृत्युंजय।', sa: 'पितृतर्पणम्, केतुशान्तिः, ध्यानम्, सप्तधान्यदानम्। रक्षार्थं महामृत्युञ्जयः।', mai: 'पितृ तर्पण, केतु शान्ति, ध्यान, सप्तधान्य दान। सुरक्षा हेतु महामृत्युंजय।', mr: 'पितृ तर्पण, केतू शांती, ध्यान, सप्तधान्य दान. सुरक्षेसाठी महामृत्युंजय.', ta: 'பித்ரு தர்ப்பணம் (முன்னோர் நைவேத்தியம்), கேது சாந்தி, தியானம், சப்ததான்யம் தானம். பாதுகாப்பிற்கு மகா மிருத்யுஞ்ஜயம்.', te: 'పితృ తర్పణం (పూర్వీకుల అర్పణలు), కేతు శాంతి, ధ్యానం, సప్తధాన్య దానం. రక్షణ కోసం మహా మృత్యుంజయ.', bn: 'পিতৃ তর্পণ (পূর্বপুরুষ অর্ঘ্য), কেতু শান্তি, ধ্যান, সপ্তশস্য দান। সুরক্ষার জন্য মহামৃত্যুঞ্জয়।', kn: 'ಪಿತೃ ತರ್ಪಣ (ಪೂರ್ವಜರ ಅರ್ಪಣೆಗಳು), ಕೇತು ಶಾಂತಿ, ಧ್ಯಾನ, ಸಪ್ತಧಾನ್ಯ ದಾನ. ರಕ್ಷಣೆಗಾಗಿ ಮಹಾ ಮೃತ್ಯುಂಜಯ.', gu: 'પિતૃ તર્પણ (પૂર્વજોને અર્પણ), કેતુ શાંતિ, ધ્યાન, સપ્તધાન્ય દાન. રક્ષણ માટે મહા મૃત્યુંજય.' },
    },
  };

  const key = `${node}-${eclipseType}` as keyof typeof implications;
  const imp = implications[key];
  if (!imp) return null;

  const borderColor = node === 'rahu' ? 'border-gold-primary/15' : 'border-purple-500/15';
  const accentText = node === 'rahu' ? 'text-gold-light' : 'text-purple-300';

  return (
    <div className={`rounded-xl bg-gradient-to-br from-[#2d1b69]/30 via-[#1a1040]/35 to-[#0a0e27] border ${borderColor} p-5`}>
      <h4 className={`text-sm font-bold ${accentText} uppercase tracking-wider mb-3`} style={headingFont}>
        {tl(imp.title, locale)}
      </h4>
      <div className="space-y-3 text-xs leading-relaxed" style={bodyFont}>
        <div>
          <span className="text-gold-dark text-[10px] uppercase tracking-wider font-bold">{tl({ en: 'Mundane (World) Effects', hi: 'मुण्डन (विश्व) प्रभाव', sa: 'मुण्डनानि (जागतिकानि) प्रभावाः' }, locale)}</span>
          <p className="text-text-secondary/80 mt-0.5">{tl(imp.mundane, locale)}</p>
        </div>
        <div>
          <span className="text-gold-dark text-[10px] uppercase tracking-wider font-bold">{tl({ en: 'Personal Effects', hi: 'व्यक्तिगत प्रभाव', sa: 'वैयक्तिकप्रभावाः' }, locale)}</span>
          <div className="text-text-secondary/80 mt-0.5 space-y-2">
            {(tl(imp.personal, locale) || '').split('\n\n').map((para, i) => (
              <p key={i} className={para.startsWith('•') ? 'pl-2' : ''}>{para}</p>
            ))}
          </div>
        </div>
        <div>
          <span className="text-gold-dark text-[10px] uppercase tracking-wider font-bold">{tl({ en: 'Recommended Remedies', hi: 'अनुशंसित उपाय', sa: 'अनुशंसितोपायाः' }, locale)}</span>
          <p className="text-gold-primary/60 mt-0.5">{tl(imp.remedy, locale)}</p>
        </div>
      </div>
    </div>
  );
}

/** Explain magnitude in plain language */
function getMagnitudeLabel(mag: number, isSolar: boolean, locale: string): string {
  if (isSolar) {
    // Solar: magnitude = fraction of Sun's diameter covered by Moon
    // 0.0 = no eclipse, 1.0 = total, >1.0 = total with longer duration
    if (mag >= 1.0) return tl({ en: 'Total — Sun fully covered', hi: 'पूर्ण — सूर्य पूरी तरह ढका', sa: 'पूर्णम् — सूर्यः पूर्णतः आच्छादितः' }, locale);
    if (mag >= 0.9) return tl({ en: `${Math.round(mag * 100)}% of Sun covered — nearly total`, hi: `सूर्य का ${Math.round(mag * 100)}% ढका — लगभग पूर्ण`, sa: `सूर्य का ${Math.round(mag * 100)}% ढका — लगभग पूर्ण` }, locale);
    if (mag >= 0.7) return tl({ en: `${Math.round(mag * 100)}% covered — noticeable dimming`, hi: `सूर्य का ${Math.round(mag * 100)}% ढका — स्पष्ट अंधकार`, sa: `सूर्य का ${Math.round(mag * 100)}% ढका — स्पष्ट अंधकार` }, locale);
    if (mag >= 0.5) return tl({ en: `${Math.round(mag * 100)}% covered — moderate`, hi: `सूर्य का ${Math.round(mag * 100)}% ढका — मध्यम`, sa: `सूर्य का ${Math.round(mag * 100)}% ढका — मध्यम` }, locale);
    if (mag >= 0.2) return tl({ en: `${Math.round(mag * 100)}% covered — slight`, hi: `सूर्य का ${Math.round(mag * 100)}% ढका — हल्का`, sa: `सूर्य का ${Math.round(mag * 100)}% ढका — हल्का` }, locale);
    return tl({ en: `${Math.round(mag * 100)}% covered — barely perceptible`, hi: `सूर्य का ${Math.round(mag * 100)}% ढका — मामूली`, sa: `सूर्य का ${Math.round(mag * 100)}% ढका — मामूली` }, locale);
  }
  // Lunar: magnitude = fraction of Moon's diameter inside Earth's umbral shadow
  // 0.0 = penumbral only, 1.0 = just total, >1.0 = deeply total
  if (mag >= 1.5) return tl({ en: 'Deep total — Moon turns deep red', hi: 'गहन पूर्ण — चन्द्रमा गहरे लाल', sa: 'गहनपूर्णम् — चन्द्रमाः गाढरक्तवर्णो भवति' }, locale);
  if (mag >= 1.0) return tl({ en: 'Total — Moon turns red/copper (Blood Moon)', hi: 'पूर्ण — चन्द्रमा लाल/ताम्र रंग', sa: 'पूर्णम् — चन्द्रमाः रक्त/ताम्रवर्णो भवति (रक्तचन्द्रः)' }, locale);
  if (mag >= 0.5) return tl({ en: `${Math.round(mag * 100)}% in shadow — obvious darkening`, hi: `${Math.round(mag * 100)}% छाया में — स्पष्ट अंधकार`, sa: `${Math.round(mag * 100)}% छाया में — स्पष्ट अंधकार` }, locale);
  if (mag > 0) return tl({ en: `${Math.round(mag * 100)}% in shadow — slight`, hi: `${Math.round(mag * 100)}% छाया में — हल्का`, sa: `${Math.round(mag * 100)}% छाया में — हल्का` }, locale);
  return tl({ en: 'Penumbral only — subtle dimming, hard to see', hi: 'उपच्छाया — सूक्ष्म मलिनता', sa: 'केवलमुपच्छायम् — सूक्ष्ममलिनता, दुर्दृश्यम्' }, locale);
}

function TimeCell({
  label,
  time,
  accent,
  highlight = false,
  subtitle,
}: {
  label: string;
  time: string;
  accent: string;
  highlight?: boolean;
  subtitle?: string;
}) {
  return (
    <div className={`${highlight ? 'bg-gold-primary/5 border border-gold-primary/15 rounded-lg p-2.5' : ''}`}>
      <div className="text-[10px] text-text-secondary/50 uppercase tracking-wider leading-tight">{label}</div>
      {subtitle && <div className="text-[9px] text-text-secondary/30">{subtitle}</div>}
      <div className={`text-lg font-mono font-bold ${highlight ? 'text-gold-light' : accent}`}>{time}</div>
    </div>
  );
}
