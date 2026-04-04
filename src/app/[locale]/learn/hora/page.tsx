'use client';

import { useState } from 'react';
import { useLocale } from 'next-intl';
import { motion } from 'framer-motion';
import { Clock, Sun, Moon, BookOpen, ChevronRight } from 'lucide-react';
import LessonSection from '@/components/learn/LessonSection';
import { Link } from '@/lib/i18n/navigation';
import type { Locale } from '@/types/panchang';

/* ── Trilingual labels ────────────────────────────────────────────── */
const L = {
  title: { en: 'Hora (Planetary Hours)', hi: 'होरा (ग्रह घण्टे)', sa: 'होरा (ग्रहघण्टाः)' },
  subtitle: {
    en: 'The ancient Chaldean system of planetary hours divides each day and night into 12 segments, each ruled by a planet. This is why the days of the week are named after planets — and how to use hora for timing your activities.',
    hi: 'ग्रह घण्टों की प्राचीन कैल्डियन पद्धति प्रत्येक दिन और रात को 12 खण्डों में विभाजित करती है, प्रत्येक पर एक ग्रह का शासन। इसीलिए सप्ताह के दिनों के नाम ग्रहों पर हैं — और होरा से गतिविधियों का समय कैसे निर्धारित करें।',
    sa: 'ग्रहघण्टानां प्राचीनकैल्डियनपद्धतिः प्रत्येकं दिनं रात्रिं च 12 खण्डेषु विभजति। एतत्कारणात् सप्ताहवासराणां नामानि ग्रहेषु आधारितानि।'
  },
  s1Title: { en: 'What is a Hora?', hi: 'होरा क्या है?', sa: 'होरा का?' },
  s1p1: {
    en: 'The day (sunrise to sunset) is divided into 12 equal parts — these are the 12 day horas. The night (sunset to next sunrise) is similarly divided into 12 night horas. Each hora is ruled by a planet following the Chaldean order: Saturn, Jupiter, Mars, Sun, Venus, Mercury, Moon.',
    hi: 'दिन (सूर्योदय से सूर्यास्त) 12 बराबर भागों में विभाजित — ये 12 दिन होराएँ हैं। रात (सूर्यास्त से अगले सूर्योदय) भी 12 रात्रि होराओं में। प्रत्येक होरा पर एक ग्रह का शासन कैल्डियन क्रम में: शनि, गुरु, मंगल, सूर्य, शुक्र, बुध, चन्द्र।',
    sa: 'दिनम् (सूर्योदयात् सूर्यास्तपर्यन्तम्) 12 समभागेषु विभक्तम् — एताः 12 दिनहोराः। रात्रिः अपि 12 रात्रिहोरासु। कैल्डियनक्रमेण: शनिः, गुरुः, मङ्गलः, सूर्यः, शुक्रः, बुधः, चन्द्रः।'
  },
  s1p2: {
    en: 'The FIRST hora of each day belongs to that day\'s ruling planet: Sunday starts with Sun hora, Monday with Moon hora, Tuesday with Mars hora, and so on. This is exactly WHY the days are named the way they are — every 24th hora cycles back to the same planet, creating the 7-day week.',
    hi: 'प्रत्येक दिन की पहली होरा उस दिन के शासक ग्रह की है: रविवार सूर्य होरा, सोमवार चन्द्र होरा, मंगलवार मंगल होरा। इसीलिए दिनों के ये नाम हैं — प्रत्येक 24वीं होरा उसी ग्रह पर लौटती है, सप्ताह का चक्र बनाते हुए।',
    sa: 'प्रत्येकदिनस्य प्रथमा होरा तद्दिनस्य शासकग्रहस्य: रविवासरे सूर्यहोरा, सोमवासरे चन्द्रहोरा। एतत्कारणात् वासराणां एतानि नामानि — प्रत्येका 24तमी होरा तस्मिन्नेव ग्रहे प्रत्यागच्छति।'
  },
  s2Title: { en: 'The Hora Sequence', hi: 'होरा अनुक्रम', sa: 'होराक्रमः' },
  s2p1: {
    en: 'The sequence starts from the day lord at sunrise and cycles through: Saturn → Jupiter → Mars → Sun → Venus → Mercury → Moon (Chaldean order — reverse of geocentric planetary distance). After Moon, it loops back to Saturn.',
    hi: 'अनुक्रम सूर्योदय पर दिन-स्वामी से शुरू होता है और चक्रित: शनि → गुरु → मंगल → सूर्य → शुक्र → बुध → चन्द्र (कैल्डियन क्रम — भूकेन्द्रीय ग्रह दूरी का उलटा)। चन्द्र के बाद, शनि पर वापस।',
    sa: 'क्रमः सूर्योदये दिनस्वामिनः आरभ्यते चक्रेण: शनिः → गुरुः → मङ्गलः → सूर्यः → शुक्रः → बुधः → चन्द्रः। चन्द्रात् पश्चात् शनिं प्रति पुनः।'
  },
  s2p2: {
    en: 'KEY INSIGHT: count every 24th hora starting from each planet: Sun → Moon → Mars → Mercury → Jupiter → Venus → Saturn. This is the weekday order! The 7-day week was literally derived from the hora system — an ancient mathematical consequence of dividing 24 hours among 7 planets.',
    hi: 'मुख्य अन्तर्दृष्टि: प्रत्येक 24वीं होरा गिनें: सूर्य → चन्द्र → मंगल → बुध → गुरु → शुक्र → शनि — यह सप्ताह का क्रम है! 7 दिन का सप्ताह होरा पद्धति से व्युत्पन्न है — 24 घण्टों को 7 ग्रहों में बाँटने का गणितीय परिणाम।',
    sa: 'मुख्या अन्तर्दृष्टिः: प्रत्येकां 24तमीं होरां गणयत: सूर्यः → चन्द्रः → मङ्गलः → बुधः → गुरुः → शुक्रः → शनिः — एषः सप्ताहक्रमः! 7 दिनानां सप्ताहः होरापद्धतेः व्युत्पन्नः।'
  },
  s3Title: { en: 'Which Hora for Which Activity?', hi: 'किस होरा में कौन सी गतिविधि?', sa: 'कस्यां होरायां का क्रिया?' },
  s4Title: { en: 'How Our App Computes Horas', hi: 'हमारा ऐप होरा कैसे गणना करता है', sa: 'अस्माकम् अनुप्रयोगः होरां कथं गणयति' },
  s4p1: {
    en: 'Day duration = sunset - sunrise (varies by location and season). Each day hora = day duration / 12. Night hora = night duration / 12. Day horas are LONGER in summer (more daylight) and shorter in winter. This means hora duration is NOT a fixed 60 minutes — it varies throughout the year.',
    hi: 'दिन अवधि = सूर्यास्त - सूर्योदय (स्थान और ऋतु अनुसार भिन्न)। प्रत्येक दिन होरा = दिन अवधि / 12। रात्रि होरा = रात्रि अवधि / 12। ग्रीष्म में दिन होराएँ लम्बी (अधिक दिन प्रकाश) और शीत में छोटी। होरा अवधि 60 मिनट निश्चित नहीं — वर्षभर बदलती है।',
    sa: 'दिनावधिः = सूर्यास्तः - सूर्योदयः। प्रत्येका दिनहोरा = दिनावधिः / 12। रात्रिहोरा = रात्र्यवधिः / 12। ग्रीष्मे दिनहोराः दीर्घतराः, शीते ह्रस्वतराः।'
  },
  s5Title: { en: 'Hora and Muhurta — How They Work Together', hi: 'होरा और मुहूर्त — एक साथ कैसे काम करते हैं', sa: 'होरामुहूर्तौ — कथं सह कार्यं कुरुतः' },
  s5p1: {
    en: 'Hora gives the planetary HOUR quality. Muhurta gives the 30-division (48-minute) quality. Choghadiya gives the 8-division quality. For best timing: choose a good muhurta + the correct hora for your activity + avoid Rahu Kaal. When all three align, the moment is astrologically optimal.',
    hi: 'होरा ग्रह घण्टे की गुणवत्ता देती है। मुहूर्त 30-विभाजन (48 मिनट) गुणवत्ता। चौघड़िया 8-विभाजन गुणवत्ता। सर्वोत्तम समय: अच्छा मुहूर्त + सही होरा + राहु काल से बचाव। तीनों मेल खाएँ तो क्षण ज्योतिषीय रूप से सर्वोत्तम।',
    sa: 'होरा ग्रहघण्टगुणवत्तां ददाति। मुहूर्तः 30-विभाजनगुणवत्ताम्। चौघड़िया 8-विभाजनगुणवत्ताम्। सर्वोत्तमसमयः: शुभमुहूर्तः + सम्यक्होरा + राहुकालपरिहारः।'
  },
  related: { en: 'Explore Further', hi: 'और जानें', sa: 'अधिकं जानीत' },
};

/* ── Hora planet data ─────────────────────────────────────────────── */
const HORA_PLANETS = [
  { id: 'sun', name: { en: 'Sun Hora', hi: 'सूर्य होरा', sa: 'सूर्यहोरा' }, color: '#f59e0b', bg: 'bg-amber-500/10', border: 'border-amber-500/30',
    activities: {
      en: 'Government work, meetings with authority figures, father-related matters, applying for jobs, leadership tasks, power and status matters. Ideal for anything requiring confidence and command.',
      hi: 'सरकारी कार्य, अधिकारियों से मिलना, पिता सम्बन्धित, नौकरी आवेदन, नेतृत्व कार्य, शक्ति-प्रतिष्ठा मामले। आत्मविश्वास और आदेश वाले कार्यों के लिए आदर्श।',
      sa: 'शासनकार्यम्, अधिकारिभिः सह मेलनम्, पितृसम्बन्धितविषयाः, नेतृत्वकार्याणि।'
    } },
  { id: 'moon', name: { en: 'Moon Hora', hi: 'चन्द्र होरा', sa: 'चन्द्रहोरा' }, color: '#94a3b8', bg: 'bg-slate-400/10', border: 'border-slate-400/30',
    activities: {
      en: 'Travel initiation, emotional conversations, mother-related matters, buying/selling vehicles, starting creative projects, public dealings, water-related work. Nurturing and receptive activities.',
      hi: 'यात्रा आरम्भ, भावनात्मक बातचीत, माता सम्बन्धित, वाहन क्रय-विक्रय, रचनात्मक परियोजना आरम्भ, सार्वजनिक व्यवहार, जल सम्बन्धित कार्य।',
      sa: 'यात्रारम्भः, भावनात्मकसंवादः, मातृसम्बन्धितविषयाः, वाहनक्रयविक्रयः, सृजनात्मकारम्भः।'
    } },
  { id: 'mars', name: { en: 'Mars Hora', hi: 'मंगल होरा', sa: 'मङ्गलहोरा' }, color: '#ef4444', bg: 'bg-red-500/10', border: 'border-red-500/30',
    activities: {
      en: 'Surgery (if medically needed), property-related work, sports and athletics, unavoidable confrontation, machinery and engineering work, military/police matters, cooking with fire.',
      hi: 'शल्यक्रिया (चिकित्सकीय आवश्यकता पर), सम्पत्ति कार्य, खेल-कूद, अपरिहार्य टकराव, मशीनरी और इंजीनियरिंग, सेना/पुलिस मामले।',
      sa: 'शल्यक्रिया (आवश्यकतायां), सम्पत्तिकार्यम्, क्रीडा, अपरिहार्यसंघर्षः, यन्त्रकार्यम्।'
    } },
  { id: 'mercury', name: { en: 'Mercury Hora', hi: 'बुध होरा', sa: 'बुधहोरा' }, color: '#4ade80', bg: 'bg-emerald-500/10', border: 'border-emerald-500/30',
    activities: {
      en: 'Business deals, signing contracts, communication tasks, education and study, writing, accounting, banking, technology work, short journeys, starting new courses.',
      hi: 'व्यापारिक सौदे, अनुबन्ध हस्ताक्षर, संवाद कार्य, शिक्षा-अध्ययन, लेखन, लेखा-जोखा, बैंकिंग, प्रौद्योगिकी कार्य, छोटी यात्राएँ।',
      sa: 'वाणिज्यसौदाः, अनुबन्धहस्ताक्षरम्, संवादकार्याणि, शिक्षाध्ययनम्, लेखनम्, लेखाकर्म।'
    } },
  { id: 'jupiter', name: { en: 'Jupiter Hora', hi: 'गुरु होरा', sa: 'गुरुहोरा' }, color: '#facc15', bg: 'bg-yellow-500/10', border: 'border-yellow-500/30',
    activities: {
      en: 'Spiritual practices, starting education or teaching, consulting a guru or advisor, charity and donations, legal proceedings, religious ceremonies, marriage-related rituals.',
      hi: 'आध्यात्मिक साधना, शिक्षा या अध्यापन आरम्भ, गुरु या सलाहकार से परामर्श, दान-पुण्य, कानूनी कार्यवाही, धार्मिक अनुष्ठान, विवाह संस्कार।',
      sa: 'आध्यात्मिकसाधना, शिक्षारम्भः, गुरुपरामर्शः, दानपुण्यम्, विधिकार्यवाही, धार्मिकानुष्ठानम्।'
    } },
  { id: 'venus', name: { en: 'Venus Hora', hi: 'शुक्र होरा', sa: 'शुक्रहोरा' }, color: '#f472b6', bg: 'bg-pink-500/10', border: 'border-pink-500/30',
    activities: {
      en: 'Marriage-related activities, romance and courtship, buying luxury items, artistic and creative work, beauty treatments, music and entertainment, fashion, buying jewelry.',
      hi: 'विवाह सम्बन्धित गतिविधियाँ, प्रेम-प्रणय, विलासिता वस्तुएँ खरीदना, कलात्मक-रचनात्मक कार्य, सौन्दर्य उपचार, संगीत-मनोरंजन, आभूषण खरीदना।',
      sa: 'विवाहसम्बन्धिताः क्रियाः, प्रणयः, विलासवस्तूनां क्रयः, कलात्मककार्यम्, सौन्दर्यचिकित्सा।'
    } },
  { id: 'saturn', name: { en: 'Saturn Hora', hi: 'शनि होरा', sa: 'शनिहोरा' }, color: '#60a5fa', bg: 'bg-blue-500/10', border: 'border-blue-500/30',
    activities: {
      en: 'AVOID starting new things. Good for: completing old unfinished work, agriculture and farming, iron and steel work, deep meditation, dealing with servants, mining, oil work, leather work. Saturn hora rewards finishing, not beginning.',
      hi: 'नई चीजें शुरू करने से बचें। अच्छा: पुराना अधूरा कार्य पूरा करना, कृषि, लोहा-इस्पात कार्य, गहन ध्यान, सेवकों से व्यवहार। शनि होरा समाप्ति का पुरस्कार देती है, आरम्भ का नहीं।',
      sa: 'नवारम्भं वर्जयेत्। शोभनम्: पुरातनकार्यसमापनम्, कृषिः, लोहकार्यम्, गहनध्यानम्।'
    } },
];

/* ── Chaldean order for timeline ──────────────────────────────────── */
const CHALDEAN = ['saturn', 'jupiter', 'mars', 'sun', 'venus', 'mercury', 'moon'] as const;
const DAY_LORDS: { day: Record<string, string>; startPlanet: string }[] = [
  { day: { en: 'Sunday', hi: 'रविवार', sa: 'रविवासरः' }, startPlanet: 'sun' },
  { day: { en: 'Monday', hi: 'सोमवार', sa: 'सोमवासरः' }, startPlanet: 'moon' },
  { day: { en: 'Tuesday', hi: 'मंगलवार', sa: 'मङ्गलवासरः' }, startPlanet: 'mars' },
  { day: { en: 'Wednesday', hi: 'बुधवार', sa: 'बुधवासरः' }, startPlanet: 'mercury' },
  { day: { en: 'Thursday', hi: 'गुरुवार', sa: 'गुरुवासरः' }, startPlanet: 'jupiter' },
  { day: { en: 'Friday', hi: 'शुक्रवार', sa: 'शुक्रवासरः' }, startPlanet: 'venus' },
  { day: { en: 'Saturday', hi: 'शनिवार', sa: 'शनिवासरः' }, startPlanet: 'saturn' },
];

function getHoraSequence(startPlanet: string): string[] {
  const startIdx = CHALDEAN.indexOf(startPlanet as typeof CHALDEAN[number]);
  const seq: string[] = [];
  for (let i = 0; i < 24; i++) {
    seq.push(CHALDEAN[(startIdx + i) % 7]);
  }
  return seq;
}

/* ── 24-hour timeline SVG ─────────────────────────────────────────── */
function HoraTimeline({ dayIdx, locale }: { dayIdx: number; locale: Locale }) {
  const dl = DAY_LORDS[dayIdx];
  const seq = getHoraSequence(dl.startPlanet);
  const colorMap: Record<string, string> = { sun: '#f59e0b', moon: '#94a3b8', mars: '#ef4444', mercury: '#4ade80', jupiter: '#facc15', venus: '#f472b6', saturn: '#60a5fa' };
  const nameMap: Record<string, Record<string, string>> = { sun: { en: 'Su', hi: 'सू', sa: 'सू' }, moon: { en: 'Mo', hi: 'च', sa: 'च' }, mars: { en: 'Ma', hi: 'मं', sa: 'मं' }, mercury: { en: 'Me', hi: 'बु', sa: 'बु' }, jupiter: { en: 'Ju', hi: 'गु', sa: 'गु' }, venus: { en: 'Ve', hi: 'शु', sa: 'शु' }, saturn: { en: 'Sa', hi: 'श', sa: 'श' } };
  const barW = 28, barH = 32, gap = 2;
  const totalW = seq.length * (barW + gap);

  return (
    <div className="overflow-x-auto">
      <svg viewBox={`0 0 ${totalW + 20} 85`} className="min-w-[700px] w-full" style={{ maxHeight: 100 }}>
        {/* Day / Night labels */}
        <text x={10 + 6 * (barW + gap)} y={12} fontSize="9" fill="#d4a853" fontWeight="bold" textAnchor="middle">
          {locale === 'hi' ? '☀ दिन (1-12)' : '☀ Day (1-12)'}
        </text>
        <text x={10 + 18 * (barW + gap)} y={12} fontSize="9" fill="#6366f1" fontWeight="bold" textAnchor="middle">
          {locale === 'hi' ? '☽ रात्रि (13-24)' : '☽ Night (13-24)'}
        </text>

        {seq.map((p, i) => {
          const x = 10 + i * (barW + gap);
          const isDayHora = i < 12;
          return (
            <g key={i}>
              <rect x={x} y={18} width={barW} height={barH} rx={4} fill={colorMap[p]} opacity={isDayHora ? 0.7 : 0.4} />
              <text x={x + barW / 2} y={38} fontSize="9" fontWeight="bold" fill="#0a0e27" textAnchor="middle" dominantBaseline="middle">
                {nameMap[p][locale]}
              </text>
              <text x={x + barW / 2} y={62} fontSize="8" fill="#94a3b8" textAnchor="middle">{i + 1}</text>
            </g>
          );
        })}

        {/* Divider */}
        <line x1={10 + 12 * (barW + gap) - gap / 2} y1={16} x2={10 + 12 * (barW + gap) - gap / 2} y2={55} stroke="#6366f1" strokeWidth="1.5" strokeDasharray="3 2" />

        {/* Day name */}
        <text x={totalW / 2 + 10} y={78} fontSize="10" fill="#d4a853" fontWeight="bold" textAnchor="middle">
          {dl.day[locale]}
        </text>
      </svg>
    </div>
  );
}

/* ── Main Page ────────────────────────────────────────────────────── */
export default function HoraPage() {
  const locale = useLocale() as Locale;
  const [dayIdx, setDayIdx] = useState(new Date().getDay()); // 0=Sun
  const t = (obj: Record<string, string>) => obj[locale] || obj.en;

  return (
    <main className="min-h-screen px-4 py-12 max-w-4xl mx-auto">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
        <div className="inline-flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/20 rounded-full px-4 py-1.5 mb-4">
          <Clock className="w-4 h-4 text-indigo-400" />
          <span className="text-indigo-300 text-sm font-medium">{locale === 'hi' ? 'सन्दर्भ' : locale === 'sa' ? 'सन्दर्भः' : 'Reference'}</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold text-gold-gradient mb-3" style={{ fontFamily: 'var(--font-heading)' }}>
          {t(L.title)}
        </h1>
        <p className="text-text-secondary max-w-2xl mx-auto text-base leading-relaxed">{t(L.subtitle)}</p>
      </motion.div>

      {/* Section 1: What is a Hora */}
      <LessonSection number={1} title={t(L.s1Title)}>
        <p>{t(L.s1p1)}</p>
        <p>{t(L.s1p2)}</p>
      </LessonSection>

      {/* Interactive Timeline */}
      <motion.div initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
        className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 mb-6"
      >
        <div className="flex justify-center gap-2 flex-wrap mb-4">
          {DAY_LORDS.map((dl, i) => (
            <button key={i} onClick={() => setDayIdx(i)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                dayIdx === i
                  ? 'bg-gold-primary/20 border border-gold-primary/40 text-gold-light'
                  : 'bg-white/5 border border-white/10 text-text-tertiary hover:bg-white/10'
              }`}
            >
              {t(dl.day)}
            </button>
          ))}
        </div>
        <HoraTimeline dayIdx={dayIdx} locale={locale} />
        <p className="text-center text-[10px] text-text-tertiary mt-2">
          {locale === 'hi' ? 'क्रम सूर्योदय पर दिन-स्वामी से शुरू, 24 होराएँ' : 'Sequence starts at sunrise with day lord, 24 horas total'}
        </p>
      </motion.div>

      {/* Section 2: The Hora Sequence */}
      <LessonSection number={2} title={t(L.s2Title)}>
        <p>{t(L.s2p1)}</p>
        <p>{t(L.s2p2)}</p>
        {/* Weekday derivation visual */}
        <div className="mt-4 p-4 rounded-lg bg-bg-primary/50 border border-gold-primary/10">
          <p className="text-xs text-gold-light/70 mb-2">{locale === 'hi' ? 'प्रत्येक 24वीं होरा → सप्ताह क्रम:' : 'Every 24th hora → weekday order:'}</p>
          <div className="flex flex-wrap gap-2 items-center">
            {['sun', 'moon', 'mars', 'mercury', 'jupiter', 'venus', 'saturn'].map((p, i) => {
              const colorMap: Record<string, string> = { sun: '#f59e0b', moon: '#94a3b8', mars: '#ef4444', mercury: '#4ade80', jupiter: '#facc15', venus: '#f472b6', saturn: '#60a5fa' };
              const nameMap: Record<string, Record<string, string>> = { sun: { en: 'Sun', hi: 'रवि', sa: 'रविः' }, moon: { en: 'Moon', hi: 'सोम', sa: 'सोमः' }, mars: { en: 'Mars', hi: 'मंगल', sa: 'मङ्गलः' }, mercury: { en: 'Merc', hi: 'बुध', sa: 'बुधः' }, jupiter: { en: 'Jup', hi: 'गुरु', sa: 'गुरुः' }, venus: { en: 'Ven', hi: 'शुक्र', sa: 'शुक्रः' }, saturn: { en: 'Sat', hi: 'शनि', sa: 'शनिः' } };
              return (
                <span key={p} className="inline-flex items-center gap-1">
                  <span className="w-5 h-5 rounded-full flex items-center justify-center text-[8px] font-bold" style={{ backgroundColor: colorMap[p] + '30', color: colorMap[p] }}>{i + 1}</span>
                  <span className="text-xs font-medium" style={{ color: colorMap[p] }}>{nameMap[p][locale]}</span>
                  {i < 6 && <span className="text-text-tertiary mx-0.5">→</span>}
                </span>
              );
            })}
          </div>
        </div>
      </LessonSection>

      {/* Section 3: Activities per Hora */}
      <LessonSection number={3} title={t(L.s3Title)}>
        <div className="grid gap-3 sm:grid-cols-2">
          {HORA_PLANETS.map(hp => (
            <motion.div key={hp.id} whileHover={{ scale: 1.015 }}
              className={`rounded-xl p-4 border ${hp.border} ${hp.bg} transition-colors`}
            >
              <div className="flex items-center gap-2 mb-2">
                {hp.id === 'sun' && <Sun className="w-4 h-4" style={{ color: hp.color }} />}
                {hp.id === 'moon' && <Moon className="w-4 h-4" style={{ color: hp.color }} />}
                {hp.id !== 'sun' && hp.id !== 'moon' && <Clock className="w-4 h-4" style={{ color: hp.color }} />}
                <h4 className="font-bold text-sm" style={{ color: hp.color }}>{t(hp.name)}</h4>
              </div>
              <p className="text-xs text-text-secondary leading-relaxed">{t(hp.activities)}</p>
            </motion.div>
          ))}
        </div>
      </LessonSection>

      {/* Section 4: How our app computes */}
      <LessonSection number={4} title={t(L.s4Title)} variant="formula">
        <p>{t(L.s4p1)}</p>
        <div className="mt-3 p-3 rounded-lg bg-bg-primary/80 font-mono text-sm text-gold-light">
          <code>day_hora_duration = (sunset - sunrise) / 12</code><br />
          <code>night_hora_duration = (next_sunrise - sunset) / 12</code>
        </div>
      </LessonSection>

      {/* Section 5: Hora + Muhurta */}
      <LessonSection number={5} title={t(L.s5Title)} variant="highlight">
        <p>{t(L.s5p1)}</p>
        <div className="mt-4 grid grid-cols-3 gap-3 text-center">
          {[
            { label: { en: 'Hora', hi: 'होरा', sa: 'होरा' }, desc: { en: '24 divisions', hi: '24 विभाजन', sa: '24 विभाजनानि' }, num: '24' },
            { label: { en: 'Muhurta', hi: 'मुहूर्त', sa: 'मुहूर्तः' }, desc: { en: '30 divisions', hi: '30 विभाजन', sa: '30 विभाजनानि' }, num: '30' },
            { label: { en: 'Choghadiya', hi: 'चौघड़िया', sa: 'चतुर्घटिका' }, desc: { en: '8 divisions', hi: '8 विभाजन', sa: '8 विभाजनानि' }, num: '8' },
          ].map(d => (
            <div key={d.num} className="p-3 rounded-lg bg-bg-primary/50 border border-gold-primary/10">
              <div className="text-2xl font-bold text-gold-light">{d.num}</div>
              <p className="text-sm font-semibold text-gold-light mt-1">{t(d.label)}</p>
              <p className="text-[10px] text-text-tertiary">{t(d.desc)}</p>
            </div>
          ))}
        </div>
      </LessonSection>

      {/* Related Links */}
      <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="mt-10 bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-6">
        <h3 className="text-lg font-bold text-gold-gradient mb-4 flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-gold-light" />
          {t(L.related)}
        </h3>
        <div className="flex flex-wrap gap-3">
          {[
            { href: '/panchang', label: { en: 'Today\'s Panchang', hi: 'आज का पंचांग', sa: 'अद्यपञ्चाङ्गम्' } },
            { href: '/learn/muhurtas', label: { en: 'Learn: Muhurtas', hi: 'सीखें: मुहूर्त', sa: 'अध्ययनम्: मुहूर्ताः' } },
            { href: '/muhurta-ai', label: { en: 'Muhurta AI', hi: 'मुहूर्त AI', sa: 'मुहूर्तयन्त्रम्' } },
          ].map((link) => (
            <Link key={link.href} href={link.href as '/'} className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-gold-primary/10 border border-gold-primary/20 text-gold-light text-sm hover:bg-gold-primary/20 transition-colors">
              <ChevronRight className="w-3.5 h-3.5" />
              {t(link.label)}
            </Link>
          ))}
        </div>
      </motion.div>
    </main>
  );
}
