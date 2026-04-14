'use client';

import { useState, useEffect, useMemo } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Filter } from 'lucide-react';
import GoldDivider from '@/components/ui/GoldDivider';
import InfoBlock from '@/components/ui/InfoBlock';
import { GrahaIconById } from '@/components/icons/GrahaIcons';
import { RashiIconById } from '@/components/icons/RashiIcons';
import type { Locale,  LocaleText} from '@/types/panchang';
import { useBirthDataStore } from '@/stores/birth-data-store';
import { sunLongitude, toSidereal, dateToJD, jdToDate, normalizeDeg } from '@/lib/ephem/astronomical';
import { tl } from '@/lib/utils/trilingual';
import { lt } from '@/lib/learn/translations';
import MSG from '@/messages/pages/transits.json';
import { isDevanagariLocale } from '@/lib/utils/locale-fonts';

const msg = (key: string, locale: string) => lt((MSG as unknown as Record<string, LocaleText>)[key], locale);

interface TransitEvent {
  planetId: number;
  planetName: LocaleText;
  planetColor: string;
  fromSign: number;
  fromSignName: LocaleText;
  toSign: number;
  toSignName: LocaleText;
  date: string;
  significance: 'major' | 'moderate' | 'minor';
}

const MONTH_NAMES_EN = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const MONTH_NAMES_HI = ['जनवरी', 'फरवरी', 'मार्च', 'अप्रैल', 'मई', 'जून', 'जुलाई', 'अगस्त', 'सितम्बर', 'अक्तूबर', 'नवम्बर', 'दिसम्बर'];

const PLANET_NAMES_EN = ['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn', 'Rahu', 'Ketu'];
const PLANET_NAMES_HI = ['सूर्य', 'चन्द्र', 'मंगल', 'बुध', 'गुरु', 'शुक्र', 'शनि', 'राहु', 'केतु'];

export default function TransitsPage() {
  const t = useTranslations('transits');
  const locale = useLocale() as Locale;
  const isDevanagari = isDevanagariLocale(locale);
  const headingFont = isDevanagari ? { fontFamily: 'var(--font-devanagari-heading)' } : { fontFamily: 'var(--font-heading)' };
  const bodyFont = isDevanagari ? { fontFamily: 'var(--font-devanagari-body)' } : undefined;

  const [year, setYear] = useState(new Date().getFullYear());
  const [events, setEvents] = useState<TransitEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [sigFilter, setSigFilter] = useState<'all' | 'major' | 'moderate'>('all');
  const [planetFilter, setPlanetFilter] = useState<number | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const { birthRashi, isSet: hasBirthData, loadFromStorage } = useBirthDataStore();
  useEffect(() => { loadFromStorage(); }, [loadFromStorage]);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/transits?year=${year}`)
      .then(res => res.json())
      .then(data => {
        setEvents(data.events || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [year]);

  // Filtered events
  const filteredEvents = useMemo(() => {
    let result = events;
    if (sigFilter === 'major') result = result.filter(e => e.significance === 'major');
    else if (sigFilter === 'moderate') result = result.filter(e => e.significance !== 'minor');
    if (planetFilter !== null) result = result.filter(e => e.planetId === planetFilter);
    return result;
  }, [events, sigFilter, planetFilter]);

  // Group by month
  const eventsByMonth = useMemo(() => {
    const grouped: Record<number, TransitEvent[]> = {};
    for (const e of filteredEvents) {
      const month = parseInt(e.date.split('-')[1]) - 1; // 0-indexed
      if (!grouped[month]) grouped[month] = [];
      grouped[month].push(e);
    }
    return grouped;
  }, [filteredEvents]);

  // Current transits summary — find the most recent transit for each slow planet (Mars-Ketu)
  const currentTransits = useMemo(() => {
    const today = new Date().toISOString().split('T')[0];
    const slowPlanets = [2, 3, 4, 5, 6, 7, 8]; // Mars through Ketu
    return slowPlanets.map(pid => {
      const planetEvents = events.filter(e => e.planetId === pid && e.date <= today);
      const latest = planetEvents[planetEvents.length - 1];
      if (!latest) {
        // Planet hasn't changed sign this year — find from ALL events
        const allForPlanet = events.filter(e => e.planetId === pid);
        if (allForPlanet.length > 0) {
          return { planetId: pid, sign: allForPlanet[0].fromSign, signName: allForPlanet[0].fromSignName, planetName: allForPlanet[0].planetName };
        }
        return null;
      }
      return { planetId: pid, sign: latest.toSign, signName: latest.toSignName, planetName: latest.planetName };
    }).filter(Boolean) as { planetId: number; sign: number; signName: LocaleText; planetName: LocaleText }[];
  }, [events]);

  // Stats
  const stats = useMemo(() => {
    const majorCount = events.filter(e => e.significance === 'major').length;
    const uniquePlanets = new Set(events.map(e => e.planetId)).size;
    return { total: events.length, major: majorCount, planets: uniquePlanets };
  }, [events]);

  // Jupiter Vedha — 12 classical blocking pairs: Jupiter sign → Saturn sign that blocks
  // Source: Gochar classics; when Saturn is in the listed sign, Jupiter's transit is Vedha-blocked
  const JUPITER_VEDHA: Record<number, number> = {
    1: 11, 2: 9, 3: 10, 4: 8, 5: 7, 6: 5,
    7: 6, 8: 4, 9: 3, 10: 2, 11: 1, 12: 12,
  };
  const jupiterVedha = useMemo(() => {
    const jup = currentTransits.find(c => c.planetId === 4);
    const sat = currentTransits.find(c => c.planetId === 6);
    if (!jup || !sat) return null;
    const blockerSign = JUPITER_VEDHA[jup.sign];
    if (blockerSign === sat.sign) {
      return {
        jupiterSign: jup.signName,
        saturnSign: sat.signName,
      };
    }
    return null;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentTransits]);

  // JYOTISH-15: Mesha Sankranti — exact moment Sun enters 0° sidereal Aries (binary search)
  const meshaSankranti = useMemo(() => {
    // Approximate date: around April 14 each year (Lahiri)
    const approxJD = dateToJD(year, 4, 13);
    const getSidSunLon = (jd: number) => {
      const trop = sunLongitude(jd);
      return normalizeDeg(toSidereal(trop, jd));
    };
    // Binary search: find JD where sidereal Sun longitude = 0 (crossing Aries)
    let lo = approxJD - 5;
    let hi = approxJD + 5;
    // Ensure we're bracketing the 0° crossing (handle wrap-around)
    for (let i = 0; i < 60; i++) {
      const mid = (lo + hi) / 2;
      const lonMid = getSidSunLon(mid);
      // lonMid near 0 or 360 = target; use diff to 360 if > 180
      const diff = lonMid > 180 ? lonMid - 360 : lonMid;
      if (Math.abs(hi - lo) < 0.0001) break; // ~8 sec precision
      if (diff < 0) lo = mid; else hi = mid;
    }
    const jdResult = (lo + hi) / 2;
    const dateResult = jdToDate(jdResult);
    // House themes for mundane astrology
    const SANKRANTI_HOUSES = [
      { en: '1H — World — Global identity, new world-era theme for the solar year', hi: '1H — विश्व — वार्षिक सौर-काल का वैश्विक विषय', sa: '1H — विश्वम् — वार्षिकसौरकालस्य वैश्विकविषयः', mai: '1H — विश्व — वार्षिक सौर-कालक वैश्विक विषय', mr: '1H — विश्व — वार्षिक सौर-कालाचा जागतिक विषय', ta: '1H — உலகம் — சூரிய ஆண்டின் உலகளாவிய அடையாளம்', te: '1H — ప్రపంచం — సౌర సంవత్సర ప్రపంచ గుర్తింపు', bn: '1H — বিশ্ব — সৌর বর্ষের বৈশ্বিক পরিচয়', kn: '1H — ವಿಶ್ವ — ಸೌರ ವರ್ಷದ ಜಾಗತಿಕ ಗುರುತು', gu: '1H — વિશ્વ — સૌર વર્ષનો વૈશ્વિક વિષય' },
      { en: '2H — Wealth — Global economy, food production, financial trends', hi: '2H — धन — वैश्विक अर्थव्यवस्था, खाद्य उत्पादन', sa: '2H — धनम् — वैश्विकार्थव्यवस्था, अन्नोत्पादनम्', mai: '2H — धन — वैश्विक अर्थव्यवस्था, खाद्य उत्पादन', mr: '2H — धन — जागतिक अर्थव्यवस्था, अन्न उत्पादन', ta: '2H — செல்வம் — உலகப் பொருளாதாரம், உணவு உற்பத்தி', te: '2H — ధనం — ప్రపంచ ఆర్థిక వ్యవస్థ, ఆహార ఉత్పత్తి', bn: '2H — ধন — বিশ্ব অর্থনীতি, খাদ্য উৎপাদন', kn: '2H — ಸಂಪತ್ತು — ಜಾಗತಿಕ ಆರ್ಥಿಕತೆ, ಆಹಾರ ಉತ್ಪಾದನೆ', gu: '2H — ધન — વૈશ્વિક અર્થતંત્ર, ખાદ્ય ઉત્પાદન' },
      { en: '3H — Communication — Media, transport, trade, neighbouring nations', hi: '3H — संचार — मीडिया, परिवहन, व्यापार', sa: '3H — सञ्चारः — माध्यमानि, परिवहनम्, वाणिज्यम्', mai: '3H — संचार — मीडिया, परिवहन, व्यापार', mr: '3H — संचार — माध्यमे, वाहतूक, व्यापार', ta: '3H — தொடர்பு — ஊடகம், போக்குவரத்து, வர்த்தகம்', te: '3H — సంవహనం — మీడియా, రవాణా, వాణిజ్యం', bn: '3H — যোগাযোগ — গণমাধ্যম, পরিবহন, বাণিজ্য', kn: '3H — ಸಂವಹನ — ಮಾಧ್ಯಮ, ಸಾರಿಗೆ, ವ್ಯಾಪಾರ', gu: '3H — સંચાર — મીડિયા, પરિવહન, વ્યાપાર' },
      { en: '4H — Land — Agriculture, crops, weather, masses, and real estate', hi: '4H — भूमि — कृषि, फसल, मौसम, जनता', sa: '4H — भूमिः — कृषिः, सस्यानि, ऋतुः, जनताः', mai: '4H — भूमि — कृषि, फसल, मौसम, जनता', mr: '4H — भूमी — शेती, पिके, हवामान, जनता', ta: '4H — நிலம் — விவசாயம், பயிர்கள், வானிலை, மக்கள்', te: '4H — భూమి — వ్యవసాయం, పంటలు, వాతావరణం, ప్రజలు', bn: '4H — ভূমি — কৃষি, ফসল, আবহাওয়া, জনতা', kn: '4H — ಭೂಮಿ — ಕೃಷಿ, ಬೆಳೆಗಳು, ಹವಾಮಾನ, ಜನಸಾಮಾನ್ಯರು', gu: '4H — ભૂમિ — ખેતી, પાક, હવામાન, જનતા' },
      { en: '5H — Creativity — Children, arts, entertainment, stock markets', hi: '5H — रचना — बच्चे, कला, मनोरंजन, शेयर बाज़ार', sa: '5H — सृजनम् — बालाः, कलाः, विनोदः, अंशविपणिः', mai: '5H — रचना — बच्चा, कला, मनोरंजन, शेयर बाजार', mr: '5H — सर्जनशीलता — मुले, कला, मनोरंजन, शेअर बाजार', ta: '5H — படைப்பு — குழந்தைகள், கலைகள், பொழுதுபோக்கு, பங்கு சந்தை', te: '5H — సృజనాత్మకత — పిల్లలు, కళలు, వినోదం, స్టాక్ మార్కెట్', bn: '5H — সৃজনশীলতা — সন্তান, শিল্পকলা, বিনোদন, শেয়ার বাজার', kn: '5H — ಸೃಜನಶೀಲತೆ — ಮಕ್ಕಳು, ಕಲೆಗಳು, ಮನರಂಜನೆ, ಷೇರು ಮಾರುಕಟ್ಟೆ', gu: '5H — સર્જનાત્મકતા — બાળકો, કલા, મનોરંજન, શેર બજાર' },
      { en: '6H — Health — Epidemics, public health, labour disputes, military', hi: '6H — स्वास्थ्य — महामारी, सार्वजनिक स्वास्थ्य, सेना', sa: '6H — स्वास्थ्यम् — महामारी, सार्वजनिकस्वास्थ्यम्, सैन्यम्', mai: '6H — स्वास्थ्य — महामारी, सार्वजनिक स्वास्थ्य, सेना', mr: '6H — आरोग्य — महामारी, सार्वजनिक आरोग्य, सैन्य', ta: '6H — ஆரோக்கியம் — தொற்றுநோய்கள், பொது சுகாதாரம், இராணுவம்', te: '6H — ఆరోగ్యం — మహమ్మారి, ప్రజారోగ్యం, సైన్యం', bn: '6H — স্বাস্থ্য — মহামারী, জনস্বাস্থ্য, সেনাবাহিনী', kn: '6H — ಆರೋಗ್ಯ — ಸಾಂಕ್ರಾಮಿಕ, ಸಾರ್ವಜನಿಕ ಆರೋಗ್ಯ, ಸೈನ್ಯ', gu: '6H — આરોગ્ય — મહામારી, જાહેર આરોગ્ય, સેના' },
      { en: '7H — Alliances — Wars, treaties, international relations', hi: '7H — संधि — युद्ध, सन्धियाँ, अन्तर्राष्ट्रीय सम्बन्ध', sa: '7H — सन्धिः — युद्धम्, सन्धयः, अन्तर्राष्ट्रीयसम्बन्धाः', mai: '7H — संधि — युद्ध, सन्धियाँ, अन्तर्राष्ट्रीय सम्बन्ध', mr: '7H — संधी — युद्ध, करार, आंतरराष्ट्रीय संबंध', ta: '7H — கூட்டணிகள் — போர்கள், ஒப்பந்தங்கள், சர்வதேச உறவுகள்', te: '7H — కూటమిలు — యుద్ధాలు, ఒప్పందాలు, అంతర్జాతీయ సంబంధాలు', bn: '7H — জোট — যুদ্ধ, চুক্তি, আন্তর্জাতিক সম্পর্ক', kn: '7H — ಮೈತ್ರಿ — ಯುದ್ಧ, ಒಪ್ಪಂದ, ಅಂತರರಾಷ್ಟ್ರೀಯ ಸಂಬಂಧ', gu: '7H — જોડાણ — યુદ્ધ, સંધિ, આંતરરાષ્ટ્રીય સંબંધ' },
      { en: '8H — Transformation — Deaths, natural disasters, hidden powers', hi: '8H — रूपांतरण — मृत्यु, प्राकृतिक आपदाएँ, गुप्त शक्तियाँ', sa: '8H — रूपान्तरणम् — मृत्युः, प्राकृतिकविपत्तयः, गुप्तशक्तयः', mai: '8H — रूपांतरण — मृत्यु, प्राकृतिक आपदा, गुप्त शक्ति', mr: '8H — रूपांतरण — मृत्यू, नैसर्गिक आपत्ती, गुप्त शक्ती', ta: '8H — மாற்றம் — மரணம், இயற்கை பேரழிவுகள், மறைந்த சக்திகள்', te: '8H — పరివర్తన — మరణాలు, ప్రకృతి విపత్తులు, గుప్త శక్తులు', bn: '8H — রূপান্তর — মৃত্যু, প্রাকৃতিক দুর্যোগ, গুপ্ত শক্তি', kn: '8H — ಪರಿವರ್ತನೆ — ಮರಣ, ನೈಸರ್ಗಿಕ ವಿಪತ್ತು, ಗುಪ್ತ ಶಕ್ತಿ', gu: '8H — પરિવર્તન — મૃત્યુ, કુદરતી આપત્તિ, ગુપ્ત શક્તિ' },
      { en: '9H — Dharma — Religion, law, higher education, long journeys', hi: '9H — धर्म — धर्म, कानून, उच्च शिक्षा', sa: '9H — धर्मः — धर्मः, विधिः, उच्चशिक्षा', mai: '9H — धर्म — धर्म, कानून, उच्च शिक्षा', mr: '9H — धर्म — धर्म, कायदा, उच्च शिक्षण', ta: '9H — தர்மம் — மதம், சட்டம், உயர் கல்வி', te: '9H — ధర్మం — మతం, చట్టం, ఉన్నత విద్య', bn: '9H — ধর্ম — ধর্ম, আইন, উচ্চশিক্ষা', kn: '9H — ಧರ್ಮ — ಧರ್ಮ, ಕಾನೂನು, ಉನ್ನತ ಶಿಕ್ಷಣ', gu: '9H — ધર્મ — ધર્મ, કાયદો, ઉચ્ચ શિક્ષણ' },
      { en: '10H — Governments — Rulers, leadership, national authority', hi: '10H — सरकार — शासक, नेतृत्व, राष्ट्रीय अधिकार', sa: '10H — शासनम् — शासकाः, नेतृत्वम्, राष्ट्रीयाधिकारः', mai: '10H — सरकार — शासक, नेतृत्व, राष्ट्रीय अधिकार', mr: '10H — सरकार — शासक, नेतृत्व, राष्ट्रीय अधिकार', ta: '10H — அரசாங்கம் — ஆட்சியாளர்கள், தலைமை, தேசிய அதிகாரம்', te: '10H — ప్రభుత్వం — పాలకులు, నాయకత్వం, జాతీయ అధికారం', bn: '10H — সরকার — শাসক, নেতৃত্ব, জাতীয় কর্তৃত্ব', kn: '10H — ಸರ್ಕಾರ — ಆಡಳಿತಗಾರರು, ನಾಯಕತ್ವ, ರಾಷ್ಟ್ರೀಯ ಅಧಿಕಾರ', gu: '10H — સરકાર — શાસક, નેતૃત્વ, રાષ્ટ્રીય સત્તા' },
      { en: '11H — Gains — Profits for nations, social movements, aspirations', hi: '11H — लाभ — राष्ट्रीय लाभ, सामाजिक आन्दोलन', sa: '11H — लाभः — राष्ट्रीयलाभः, सामाजिकान्दोलनम्', mai: '11H — लाभ — राष्ट्रीय लाभ, सामाजिक आंदोलन', mr: '11H — लाभ — राष्ट्रीय नफा, सामाजिक चळवळी', ta: '11H — லாபம் — தேசிய இலாபங்கள், சமூக இயக்கங்கள்', te: '11H — లాభం — జాతీయ లాభాలు, సామాజిక ఉద్యమాలు', bn: '11H — লাভ — জাতীয় মুনাফা, সামাজিক আন্দোলন', kn: '11H — ಲಾಭ — ರಾಷ್ಟ್ರೀಯ ಲಾಭ, ಸಾಮಾಜಿಕ ಚಳವಳಿ', gu: '11H — લાભ — રાષ્ટ્રીય લાભ, સામાજિક આંદોલન' },
      { en: '12H — Liberation — Foreign influence, losses, spirituality, hidden enemies', hi: '12H — मोक्ष — विदेशी प्रभाव, हानि, आध्यात्मिकता', sa: '12H — मोक्षः — विदेशप्रभावः, हानिः, आध्यात्मिकता', mai: '12H — मोक्ष — विदेशी प्रभाव, हानि, आध्यात्मिकता', mr: '12H — मोक्ष — परदेशी प्रभाव, हानी, अध्यात्म', ta: '12H — விடுதலை — வெளிநாட்டு செல்வாக்கு, இழப்புகள், ஆன்மீகம்', te: '12H — మోక్షం — విదేశీ ప్రభావం, నష్టాలు, ఆధ్యాత్మికత', bn: '12H — মোক্ষ — বিদেশি প্রভাব, ক্ষতি, আধ্যাত্মিকতা', kn: '12H — ಮೋಕ್ಷ — ವಿದೇಶಿ ಪ್ರಭಾವ, ನಷ್ಟ, ಆಧ್ಯಾತ್ಮಿಕತೆ', gu: '12H — મોક્ષ — વિદેશી પ્રભાવ, હાનિ, આધ્યાત્મિકતા' },
    ];
    // Planets in each house at Sankranti (approximate — use current transits)
    return { date: dateResult, jd: jdResult, houseThemes: SANKRANTI_HOUSES };
  }, [year]);

  // QW-12: Ashtama Shani — Saturn in 8th from natal Moon = 2.5yr of extreme difficulty
  const ashtamaShani = useMemo(() => {
    if (!hasBirthData || birthRashi <= 0) return null;
    const sat = currentTransits.find(c => c.planetId === 6);
    if (!sat) return null;
    const satHouseFromMoon = ((sat.sign - birthRashi + 12) % 12) + 1;
    if (satHouseFromMoon === 8) return { saturnSign: sat.signName, moonSign: birthRashi };
    return null;
  }, [currentTransits, birthRashi, hasBirthData]);

  const sigColors: Record<string, string> = {
    major: 'border-gold-primary/30 bg-gold-primary/5',
    moderate: 'border-amber-500/20 bg-amber-500/5',
    minor: 'border-gold-primary/5 bg-bg-primary/20',
  };

  const sigBadge: Record<string, string> = {
    major: 'text-gold-light bg-gold-primary/20',
    moderate: 'text-amber-400 bg-amber-500/10',
    minor: 'text-text-tertiary bg-bg-tertiary/30',
  };

  const sigLabel: Record<string, LocaleText> = {
    major: { en: 'MAJOR', hi: 'प्रमुख', sa: 'प्रमुखम्', mai: 'प्रमुख', mr: 'प्रमुख', ta: 'முக்கியம்', te: 'ప్రముఖం', bn: 'প্রধান', kn: 'ಪ್ರಮುಖ', gu: 'મુખ્ય' },
    moderate: { en: 'MODERATE', hi: 'मध्यम', sa: 'मध्यमम्', mai: 'मध्यम', mr: 'मध्यम', ta: 'மிதமான', te: 'మధ్యస్థం', bn: 'মাঝারি', kn: 'ಮಧ್ಯಮ', gu: 'મધ્યમ' },
    minor: { en: 'MINOR', hi: 'गौण', sa: 'गौणम्', mai: 'गौण', mr: 'गौण', ta: 'சிறிய', te: 'చిన్న', bn: 'গৌণ', kn: 'ಕಿರಿದು', gu: 'ગૌણ' },
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
        <h1 className="text-5xl sm:text-6xl font-bold mb-4" style={headingFont}>
          <span className="text-gold-gradient">{t('title')}</span>
        </h1>
        <p className="text-text-secondary text-lg max-w-2xl mx-auto" style={bodyFont}>{t('subtitle')}</p>
      </motion.div>

      {/* What are Transits? */}
      <InfoBlock
        id="transits-intro"
        title={msg('infoBlockTitle', locale)}
        defaultOpen={false}
      >
        {!isDevanagariLocale(locale) ? (
          <div className="space-y-3">
            <p>A <strong>transit</strong> (Gochara) is the <em>current</em> movement of a planet through the zodiac. While your birth chart is fixed, transiting planets keep moving and activate different areas of your life as they pass through different signs.</p>
            <p><strong>How transits affect you:</strong></p>
            <ul className="list-disc ml-4 space-y-1 text-xs">
              <li><strong className="text-amber-300">Jupiter transits</strong> (12 months per sign) — expansion, opportunities, and wisdom in the life area ruled by that sign. Jupiter in your 7th house from Moon = new relationships or marriage.</li>
              <li><strong className="text-indigo-300">Saturn transits</strong> (2.5 years per sign) — discipline, hard work, and restructuring. Saturn in your 10th house from Moon = career pressure but also career-defining achievements.</li>
              <li><strong className="text-slate-300">Rahu/Ketu transits</strong> (18 months per sign) — obsessions, unconventional paths, and karmic lessons. Rahu in your 1st house = identity transformation.</li>
              <li><strong className="text-red-400">Mars transits</strong> (45 days per sign) — energy, conflict, and initiative. Mars in your 2nd house = financial drive but watch for impulsive spending.</li>
            </ul>
            <p><strong>Key rule:</strong> Transits are read from your <em>Moon sign</em> (Chandra Rashi), not your ascendant. The house a transiting planet occupies from your Moon determines which life area is activated.</p>
          </div>
        ) : (
          <div className="space-y-3">
            <p><strong>गोचर</strong> राशिचक्र में ग्रहों की <em>वर्तमान</em> गति है। आपकी जन्म कुण्डली स्थिर है, लेकिन गोचर ग्रह चलते रहते हैं और विभिन्न राशियों से गुजरते हुए जीवन के अलग-अलग क्षेत्रों को सक्रिय करते हैं।</p>
            <ul className="list-disc ml-4 space-y-1 text-xs">
              <li><strong className="text-amber-300">बृहस्पति गोचर</strong> (प्रति राशि 12 माह) — विस्तार, अवसर और ज्ञान।</li>
              <li><strong className="text-indigo-300">शनि गोचर</strong> (प्रति राशि 2.5 वर्ष) — अनुशासन, कठोर परिश्रम और पुनर्गठन।</li>
              <li><strong className="text-slate-300">राहु/केतु गोचर</strong> (प्रति राशि 18 माह) — जुनून, अपरम्परागत मार्ग और कर्म पाठ।</li>
              <li><strong className="text-red-400">मंगल गोचर</strong> (प्रति राशि 45 दिन) — ऊर्जा, संघर्ष और पहल।</li>
            </ul>
            <p><strong>मुख्य नियम:</strong> गोचर आपकी <em>चन्द्र राशि</em> से पढ़ा जाता है, लग्न से नहीं।</p>
          </div>
        )}
      </InfoBlock>

      {/* Year selector */}
      <div className="flex items-center justify-center gap-3 sm:gap-4 md:gap-6 mb-8">
        <button onClick={() => setYear(y => y - 1)} className="p-2 rounded-lg border border-gold-primary/20 hover:bg-gold-primary/10 transition-all" aria-label="Previous year">
          <ChevronLeft className="w-5 h-5 text-gold-primary" />
        </button>
        <span className="text-4xl font-bold text-gold-gradient" style={headingFont}>{year}</span>
        <button onClick={() => setYear(y => y + 1)} className="p-2 rounded-lg border border-gold-primary/20 hover:bg-gold-primary/10 transition-all" aria-label="Next year">
          <ChevronRight className="w-5 h-5 text-gold-primary" />
        </button>
      </div>

      {/* Current transits summary */}
      {year === new Date().getFullYear() && currentTransits.length > 0 && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-2xl p-3 sm:p-4 md:p-6 mb-8">
          <h2 className="text-lg text-gold-gradient font-bold mb-4 text-center" style={headingFont}>
            {msg('currentPlanetaryPositions', locale)}
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-3">
            {currentTransits.map(ct => (
              <div key={ct.planetId} className="flex flex-col items-center p-3 bg-bg-primary/30 rounded-xl border border-gold-primary/10">
                <GrahaIconById id={ct.planetId} size={32} />
                <span className="text-gold-light text-xs font-semibold mt-1.5" style={headingFont}>{tl(ct.planetName, locale)}</span>
                <div className="flex items-center gap-1 mt-1">
                  <RashiIconById id={ct.sign} size={14} />
                  <span className="text-text-secondary text-xs" style={bodyFont}>{tl(ct.signName, locale)}</span>
                </div>
              </div>
            ))}
          </div>
          {/* Jupiter Vedha warning */}
          {jupiterVedha && (
            <div className="mt-4 rounded-xl bg-amber-500/8 border border-amber-500/25 p-3 flex items-start gap-3">
              <span className="text-amber-400 text-lg mt-0.5">⚠</span>
              <div>
                <div className="text-amber-400 font-bold text-sm mb-1" style={headingFont}>
                  {msg('jupiterVedhaActive', locale)}
                </div>
                <p className="text-text-secondary/80 text-xs leading-relaxed" style={bodyFont}>
                  {locale === 'en'
                    ? `Jupiter transiting ${jupiterVedha.jupiterSign.en} is Vedha-blocked by Saturn in ${jupiterVedha.saturnSign.en} — Jupiter's transit benefits are reduced or negated this period. Classical Gochar texts state that Vedha negates the positive results of the transiting planet.`
                    : `${jupiterVedha.jupiterSign.hi} में गोचर करते गुरु को ${jupiterVedha.saturnSign.hi} में शनि का वेध है — गुरु गोचर के शुभ फल इस काल में घटित अथवा निष्फल होते हैं।`}
                </p>
              </div>
            </div>
          )}
          {/* QW-12: Ashtama Shani warning */}
          {ashtamaShani && (
            <div className="mt-4 rounded-xl bg-red-500/8 border border-red-500/30 p-3 flex items-start gap-3">
              <span className="text-red-400 text-lg mt-0.5">⚠</span>
              <div>
                <div className="text-red-400 font-bold text-sm mb-1" style={headingFont}>
                  {msg('ashtamaShaniActive', locale)}
                </div>
                <p className="text-text-secondary/80 text-xs leading-relaxed" style={bodyFont}>
                  {locale === 'en'
                    ? `Saturn is currently in ${ashtamaShani.saturnSign.en}, which is the 8th house from your natal Moon sign. This is Ashtama Shani — a 2.5-year period of intense karmic pressure. Often more taxing than individual Sade Sati phases. Focus on health, avoid risky financial decisions, and strengthen spiritual practice.`
                    : `शनि अभी ${ashtamaShani.saturnSign.hi} में है, जो आपके जन्म चन्द्र से 8वाँ भाव है। यह अष्टम शनि है — 2.5 वर्ष का गहन कार्मिक दबाव। स्वास्थ्य पर ध्यान दें, जोखिम भरे वित्तीय निर्णयों से बचें, और आध्यात्मिक साधना को मजबूत करें।`}
                </p>
              </div>
            </div>
          )}
        </motion.div>
      )}

      {/* Stats bar */}
      {!loading && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}
          className="flex items-center justify-center gap-3 sm:gap-4 md:gap-6 mb-6 text-sm">
          <span className="text-text-secondary">
            <span className="text-gold-light font-bold">{stats.total}</span> {msg('transits', locale)}
          </span>
          <span className="text-text-tertiary">|</span>
          <span className="text-text-secondary">
            <span className="text-gold-light font-bold">{stats.major}</span> {msg('major', locale)}
          </span>
          <span className="text-text-tertiary">|</span>
          <span className="text-text-secondary">
            <span className="text-gold-light font-bold">{stats.planets}</span> {msg('planets', locale)}
          </span>
        </motion.div>
      )}

      {/* Filters */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-8">
        {/* Significance filter */}
        <div className="flex gap-2">
          {(['all', 'major', 'moderate'] as const).map(f => (
            <button key={f} onClick={() => setSigFilter(f)}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                sigFilter === f ? 'bg-gold-primary/20 text-gold-light border border-gold-primary/40' : 'text-text-secondary border border-gold-primary/10 hover:bg-gold-primary/10'
              }`}>
              {f === 'all' ? (msg('filterAll', locale)) : f === 'major' ? (msg('filterMajor', locale)) : (msg('filterMajorModerate', locale))}
            </button>
          ))}
        </div>

        {/* Planet filter toggle */}
        <button onClick={() => setShowFilters(!showFilters)}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold transition-all border ${showFilters || planetFilter !== null ? 'bg-gold-primary/20 text-gold-light border-gold-primary/40' : 'text-text-secondary border-gold-primary/10 hover:bg-gold-primary/10'}`}>
          <Filter className="w-3.5 h-3.5" />
          {msg('planet', locale)}
          {planetFilter !== null && `: ${(!isDevanagariLocale(locale) ? PLANET_NAMES_EN : PLANET_NAMES_HI)[planetFilter]}`}
        </button>
      </div>

      {/* Planet filter chips */}
      <AnimatePresence>
        {showFilters && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
            className="flex flex-wrap justify-center gap-2 mb-8 overflow-hidden">
            <button onClick={() => setPlanetFilter(null)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-full text-xs transition-all ${planetFilter === null ? 'bg-gold-primary/20 text-gold-light border border-gold-primary/30' : 'text-text-secondary border border-gold-primary/10 hover:bg-gold-primary/5'}`}>
              {msg('allPlanets', locale)}
            </button>
            {[0, 1, 2, 3, 4, 5, 6, 7, 8].map(pid => {
              const hasEvents = events.some(e => e.planetId === pid);
              if (!hasEvents) return null;
              return (
                <button key={pid} onClick={() => setPlanetFilter(planetFilter === pid ? null : pid)}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-full text-xs transition-all ${planetFilter === pid ? 'bg-gold-primary/20 text-gold-light border border-gold-primary/30' : 'text-text-secondary border border-gold-primary/10 hover:bg-gold-primary/5'}`}>
                  <GrahaIconById id={pid} size={14} />
                  {(!isDevanagariLocale(locale) ? PLANET_NAMES_EN : PLANET_NAMES_HI)[pid]}
                </button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>

      <GoldDivider />

      {/* Content */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-2 border-gold-primary border-t-transparent" />
        </div>
      ) : filteredEvents.length === 0 ? (
        <div className="text-center py-16 text-text-secondary" style={bodyFont}>
          {msg('noTransitEvents', locale)}
        </div>
      ) : (
        <div className="mt-8 space-y-10">
          {Array.from({ length: 12 }, (_, monthIdx) => {
            const monthEvents = eventsByMonth[monthIdx];
            if (!monthEvents || monthEvents.length === 0) return null;
            const monthName = (!isDevanagariLocale(locale) ? MONTH_NAMES_EN : MONTH_NAMES_HI)[monthIdx];
            const isCurrentMonth = year === new Date().getFullYear() && monthIdx === new Date().getMonth();

            return (
              <motion.div key={monthIdx}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.3 }}>
                {/* Month header */}
                <div className={`flex items-center gap-3 mb-4 ${isCurrentMonth ? '' : ''}`}>
                  <h3 className={`text-xl font-bold ${isCurrentMonth ? 'text-gold-gradient' : 'text-text-primary'}`} style={headingFont}>
                    {monthName}
                  </h3>
                  <span className="text-text-tertiary text-xs">{monthEvents.length} {msg('events', locale)}</span>
                  {isCurrentMonth && (
                    <span className="px-2 py-0.5 bg-gold-primary/20 text-gold-light text-xs rounded-full font-bold">
                      {msg('now', locale)}
                    </span>
                  )}
                  <div className="flex-1 h-px bg-gradient-to-r from-gold-primary/20 to-transparent" />
                </div>

                {/* Events */}
                <div className="space-y-2">
                  {monthEvents.map((e, i) => {
                    const dateObj = new Date(e.date + 'T00:00:00');
                    const dayNum = dateObj.getDate();
                    const dayName = dateObj.toLocaleDateString(msg('dayNameLocale', locale), { weekday: 'short' });
                    const isPast = new Date(e.date) < new Date(new Date().toISOString().split('T')[0]);

                    return (
                      <div
                        key={`${e.date}-${e.planetId}`}
                        className={`flex items-center gap-3 sm:gap-4 rounded-xl p-3 sm:p-4 border transition-all ${sigColors[e.significance]} ${isPast ? 'opacity-50' : ''}`}>
                        {/* Date column */}
                        <div className="flex-shrink-0 w-12 text-center">
                          <div className="text-2xl font-bold text-gold-light leading-none">{dayNum}</div>
                          <div className="text-xs text-text-tertiary uppercase">{dayName}</div>
                        </div>

                        {/* Separator */}
                        <div className="w-px h-10 bg-gold-primary/15 flex-shrink-0" />

                        {/* Planet icon */}
                        <div className="flex-shrink-0">
                          <GrahaIconById id={e.planetId} size={36} />
                        </div>

                        {/* Details */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-gold-light font-bold" style={headingFont}>
                              {tl(e.planetName, locale)}
                            </span>
                            <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${sigBadge[e.significance]}`}>
                              {(!isDevanagariLocale(locale) ? sigLabel[e.significance].en : sigLabel[e.significance].hi)}
                            </span>
                          </div>
                          <div className="flex items-center gap-1.5 mt-1 text-sm">
                            <RashiIconById id={e.fromSign} size={14} />
                            <span className="text-text-tertiary" style={bodyFont}>{tl(e.fromSignName, locale)}</span>
                            <span className="text-gold-dark mx-0.5">→</span>
                            <RashiIconById id={e.toSign} size={14} />
                            <span className="text-text-primary font-medium" style={bodyFont}>{tl(e.toSignName, locale)}</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* JYOTISH-15: Mesha Sankranti */}
      {meshaSankranti && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/20 rounded-2xl p-6 mt-10">
          <h2 className="text-gold-gradient text-xl font-bold mb-1 text-center" style={headingFont}>
            {tl({ en: 'Mesha Sankranti ${year}', hi: 'मेष संक्रान्ति ${year}', sa: 'मेष संक्रान्ति ${year}', ta: 'Mesha Sankranti ${year}', te: 'Mesha Sankranti ${year}', bn: 'Mesha Sankranti ${year}', kn: 'Mesha Sankranti ${year}', gu: 'Mesha Sankranti ${year}', mai: 'मेष संक्रान्ति ${year}', mr: 'मेष संक्रान्ति ${year}' }, locale)}
          </h2>
          <p className="text-text-secondary/70 text-xs text-center mb-5" style={bodyFont}>
            {locale === 'en'
              ? 'Sun enters 0° sidereal Aries — the astrological new year. This chart governs mundane affairs for the entire solar year. Source: Brihat Samhita.'
              : 'सूर्य 0° सायन मेष में प्रवेश करता है — ज्योतिषीय नव वर्ष। यह चार्ट वर्षभर के सांसारिक विषयों का संकेत देता है।'}
          </p>
          <div className="rounded-xl bg-gold-primary/8 border border-gold-primary/20 p-4 text-center mb-5">
            <div className="text-gold-light font-bold text-2xl font-mono" style={headingFont}>
              {meshaSankranti.date.toLocaleDateString(msg('meshaSankrantiDateLocale', locale), { day: 'numeric', month: 'long', year: 'numeric' })}
            </div>
            <div className="text-gold-primary/70 text-sm mt-1">
              {meshaSankranti.date.toLocaleTimeString(msg('meshaSankrantiDateLocale', locale), { hour: '2-digit', minute: '2-digit', timeZoneName: 'short' })}
            </div>
            <div className="text-text-secondary/70 text-xs mt-2" style={bodyFont}>
              {msg('meshaSankrantiDesc', locale)}
            </div>
          </div>
          <h3 className="text-gold-primary text-xs uppercase tracking-wider font-bold mb-3 text-center">
            {msg('meshaSankrantiTitle', locale)}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
            {meshaSankranti.houseThemes.map((theme, i) => (
              <div key={i} className="rounded-lg bg-bg-primary/30 border border-gold-primary/8 p-3">
                <div className="text-gold-primary/60 text-xs font-mono font-bold mb-0.5">{i + 1}</div>
                <div className="text-text-secondary/70 text-xs leading-relaxed" style={bodyFont}>
                  {!isDevanagariLocale(locale) ? theme.en : theme.hi}
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Footer count */}
      {!loading && filteredEvents.length > 0 && (
        <div className="text-center text-text-tertiary text-sm mt-10">
          {locale === 'en'
            ? `Showing ${filteredEvents.length} of ${events.length} transit events for ${year}`
            : `${year} के ${events.length} गोचर में से ${filteredEvents.length} दिखाए जा रहे हैं`}
        </div>
      )}
    </div>
  );
}
