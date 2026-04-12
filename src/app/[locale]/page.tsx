import { headers } from 'next/headers';
import { getTranslations } from 'next-intl/server';
import { Link } from '@/lib/i18n/navigation';
import GoldDivider from '@/components/ui/GoldDivider';
import AdUnit from '@/components/ads/AdUnit';
import ProfileBanner from '@/components/home/ProfileBanner';
import HomeClientWidgets from '@/components/home/HomeClientWidgets';
import { getHeadingFont, getBodyFont, isDevanagariLocale } from '@/lib/utils/locale-fonts';
import { computePanchang } from '@/lib/ephem/panchang-calc';
import { getUTCOffsetForDate } from '@/lib/utils/timezone';
import type { PanchangData } from '@/types/panchang';

// ─── Locale text helper ───
function L(texts: { en: string; hi: string; sa?: string; ta?: string; te?: string; bn?: string; kn?: string; mr?: string; gu?: string; mai?: string }, locale: string): string {
  if (locale === 'mr' && texts.mr) return texts.mr;
  if (locale === 'gu' && texts.gu) return texts.gu;
  if (locale === 'mai' && texts.mai) return texts.mai;
  if (locale === 'te' && texts.te) return texts.te;
  if (locale === 'bn' && texts.bn) return texts.bn;
  if (locale === 'kn' && texts.kn) return texts.kn;
  if (locale === 'ta' && texts.ta) return texts.ta;
  if (locale === 'sa' && texts.sa) return texts.sa;
  // Devanagari locales (hi/sa/mr/mai) fall back to Hindi text
  if (locale === 'hi' || locale === 'sa' || locale === 'mr' || locale === 'mai') return texts.hi;
  return texts.en;
}

// ─── Bold Pillar Icons with gold gradients + glow ───
function PanchangPillarIcon() {
  return (
    <svg width="80" height="80" viewBox="0 0 80 80" fill="none" aria-hidden="true">
      <defs>
        <linearGradient id="pg1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#f0d48a" />
          <stop offset="50%" stopColor="#d4a853" />
          <stop offset="100%" stopColor="#8a6d2b" />
        </linearGradient>
        <filter id="pg1g"><feGaussianBlur stdDeviation="2.5" result="b" /><feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
      </defs>
      <path d="M20 38 Q40 8 60 38" stroke="url(#pg1)" strokeWidth="2.5" fill="none" filter="url(#pg1g)" />
      {[0,1,2,3,4].map(i => {
        const angle = -140 + i * 35;
        const r = angle * Math.PI / 180;
        return <line key={i} x1={40 + 16 * Math.cos(r)} y1={30 + 16 * Math.sin(r)} x2={40 + 24 * Math.cos(r)} y2={30 + 24 * Math.sin(r)} stroke="#f0d48a" strokeWidth="1.5" strokeLinecap="round" opacity={0.6} />;
      })}
      <circle cx="40" cy="30" r="10" fill="url(#pg1)" opacity={0.15} />
      <circle cx="40" cy="30" r="6" fill="url(#pg1)" opacity={0.3} />
      <circle cx="40" cy="30" r="2.5" fill="#f0d48a" />
      <line x1="10" y1="42" x2="70" y2="42" stroke="#d4a853" strokeWidth="1" opacity={0.3} />
      <circle cx="58" cy="56" r="10" fill="none" stroke="url(#pg1)" strokeWidth="1.5" opacity={0.4} />
      <circle cx="62" cy="52" r="8" fill="#0a0e27" />
      <circle cx="18" cy="54" r="1.5" fill="#f0d48a" opacity={0.5} />
      <circle cx="28" cy="62" r="1" fill="#d4a853" opacity={0.4} />
      <circle cx="48" cy="68" r="1.2" fill="#f0d48a" opacity={0.3} />
      {[0,1,2,3,4,5,6].map(i => (
        <rect key={i} x={18 + i * 7} y={72} width={4} height={2} rx={1} fill="#d4a853" opacity={i === 3 ? 0.8 : 0.15} />
      ))}
    </svg>
  );
}

function KundaliPillarIcon() {
  return (
    <svg width="80" height="80" viewBox="0 0 80 80" fill="none" aria-hidden="true">
      <defs>
        <linearGradient id="kg1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#93c5fd" />
          <stop offset="50%" stopColor="#60a5fa" />
          <stop offset="100%" stopColor="#2563eb" />
        </linearGradient>
        <filter id="kg1g"><feGaussianBlur stdDeviation="2" result="b" /><feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
      </defs>
      <rect x="12" y="12" width="56" height="56" rx="2" stroke="url(#kg1)" strokeWidth="2" fill="none" filter="url(#kg1g)" />
      <line x1="12" y1="12" x2="68" y2="68" stroke="#60a5fa" strokeWidth="1" opacity={0.3} />
      <line x1="68" y1="12" x2="12" y2="68" stroke="#60a5fa" strokeWidth="1" opacity={0.3} />
      <line x1="40" y1="12" x2="40" y2="68" stroke="#60a5fa" strokeWidth="0.8" opacity={0.2} />
      <line x1="12" y1="40" x2="68" y2="40" stroke="#60a5fa" strokeWidth="0.8" opacity={0.2} />
      <path d="M40 22 L58 40 L40 58 L22 40Z" stroke="#60a5fa" strokeWidth="1.5" fill="rgba(96,165,250,0.05)" />
      <circle cx="26" cy="22" r="4" fill="#60a5fa" opacity={0.15} />
      <circle cx="26" cy="22" r="2" fill="#93c5fd" filter="url(#kg1g)" />
      <circle cx="54" cy="18" r="3" fill="#60a5fa" opacity={0.12} />
      <circle cx="54" cy="18" r="1.5" fill="#93c5fd" />
      <circle cx="62" cy="34" r="3.5" fill="#60a5fa" opacity={0.12} />
      <circle cx="62" cy="34" r="1.8" fill="#93c5fd" />
      <circle cx="48" cy="52" r="3" fill="#2563eb" opacity={0.15} />
      <circle cx="48" cy="52" r="1.5" fill="#60a5fa" />
      <circle cx="18" cy="48" r="2.5" fill="#60a5fa" opacity={0.1} />
      <circle cx="18" cy="48" r="1.2" fill="#93c5fd" />
      <path d="M40 14 L43 20 L37 20Z" fill="#93c5fd" opacity={0.7} />
      <text x="36" y="43" fill="#60a5fa" fontSize="7" fontWeight="bold" opacity={0.4}>La</text>
    </svg>
  );
}

function JyotishPillarIcon() {
  return (
    <svg width="80" height="80" viewBox="0 0 80 80" fill="none" aria-hidden="true">
      <defs>
        <linearGradient id="jg1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#fcd34d" />
          <stop offset="50%" stopColor="#f59e0b" />
          <stop offset="100%" stopColor="#b45309" />
        </linearGradient>
        <filter id="jg1g"><feGaussianBlur stdDeviation="2" result="b" /><feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
      </defs>
      <path d="M12 20 Q12 16 20 16 L38 16 Q40 16 40 18 L40 62 Q40 64 38 64 L20 64 Q12 64 12 60Z" stroke="url(#jg1)" strokeWidth="1.5" fill="rgba(245,158,11,0.04)" />
      <path d="M68 20 Q68 16 60 16 L42 16 Q40 16 40 18 L40 62 Q40 64 42 64 L60 64 Q68 64 68 60Z" stroke="url(#jg1)" strokeWidth="1.5" fill="rgba(245,158,11,0.04)" />
      <line x1="40" y1="16" x2="40" y2="64" stroke="#f59e0b" strokeWidth="1.5" opacity={0.4} />
      {[0,1,2,3,4,5].map(i => (
        <line key={`l${i}`} x1="18" y1={26 + i * 7} x2={32 - i * 1.5} y2={26 + i * 7} stroke="#f59e0b" strokeWidth="1.2" strokeLinecap="round" opacity={0.15 + i * 0.03} />
      ))}
      <text x="46" y="38" fill="url(#jg1)" fontSize="18" fontWeight="bold" opacity={0.5} filter="url(#jg1g)">&#x0950;</text>
      <circle cx="8" cy="14" r="1.5" fill="#fcd34d" opacity={0.4} />
      <circle cx="72" cy="12" r="2" fill="#f59e0b" opacity={0.3} />
      <circle cx="74" cy="52" r="1.5" fill="#fcd34d" opacity={0.25} />
      <circle cx="6" cy="56" r="1" fill="#f59e0b" opacity={0.3} />
      <path d="M40 6 Q42 2 40 0 Q38 2 36 6 Q38 8 40 6Z" fill="#fcd34d" opacity={0.5} />
      <path d="M40 10 Q43 4 40 0 Q37 4 34 10 Q37 12 40 10Z" fill="none" stroke="#f59e0b" strokeWidth="0.8" opacity={0.3} />
    </svg>
  );
}

// Legacy SVG icons for hero cards
function KundaliSVG() {
  return (
    <svg width="72" height="72" viewBox="0 0 72 72" fill="none">
      <rect x="6" y="6" width="60" height="60" rx="3" stroke="#f0d48a" strokeWidth="1.5" />
      <line x1="36" y1="6" x2="36" y2="66" stroke="rgba(240,212,138,0.2)" strokeWidth="0.8" />
      <line x1="6" y1="36" x2="66" y2="36" stroke="rgba(240,212,138,0.2)" strokeWidth="0.8" />
      <line x1="6" y1="6" x2="66" y2="66" stroke="rgba(240,212,138,0.12)" strokeWidth="0.8" />
      <line x1="66" y1="6" x2="6" y2="66" stroke="rgba(240,212,138,0.12)" strokeWidth="0.8" />
      <circle cx="22" cy="18" r="3.5" fill="#f0d48a" />
      <circle cx="52" cy="14" r="2.5" fill="#d4a853" />
      <circle cx="44" cy="48" r="3" fill="#f0d48a" opacity={0.7} />
      <circle cx="16" cy="52" r="2" fill="#d4a853" opacity={0.5} />
      <circle cx="36" cy="36" r="4" fill="none" stroke="#f0d48a" strokeWidth="1" opacity={0.3} />
    </svg>
  );
}

function MuhurtaSVG() {
  return (
    <svg width="72" height="72" viewBox="0 0 72 72" fill="none">
      <circle cx="36" cy="36" r="30" stroke="#4ade80" strokeWidth="1" strokeDasharray="4 3" />
      <circle cx="36" cy="36" r="18" stroke="rgba(74,222,128,0.3)" strokeWidth="0.8" />
      <path d="M36 10 L40 26 L56 26 L44 36 L48 52 L36 44 L24 52 L28 36 L16 26 L32 26Z" stroke="#4ade80" strokeWidth="1.3" fill="none" />
      <circle cx="36" cy="36" r="4" fill="#4ade80" opacity={0.25} />
      <circle cx="36" cy="36" r="1.5" fill="#4ade80" />
    </svg>
  );
}

function CalendarSVG() {
  return (
    <svg width="72" height="72" viewBox="0 0 72 72" fill="none">
      <rect x="10" y="8" width="52" height="56" rx="5" stroke="#fb923c" strokeWidth="1.3" />
      <line x1="10" y1="24" x2="62" y2="24" stroke="rgba(251,146,60,0.4)" strokeWidth="0.8" />
      <circle cx="22" cy="16" r="2.5" fill="#fb923c" opacity={0.6} />
      <circle cx="50" cy="16" r="2.5" fill="#fb923c" opacity={0.6} />
      <line x1="22" y1="4" x2="22" y2="12" stroke="#fb923c" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="50" y1="4" x2="50" y2="12" stroke="#fb923c" strokeWidth="1.5" strokeLinecap="round" />
      {[0,1,2,3,4].map(r => [0,1,2,3,4,5].map(c => (
        <rect key={`${r}${c}`} x={16 + c * 7} y={30 + r * 7} width="4" height="4" rx="1" fill="#fb923c" opacity={r === 2 && c === 3 ? 0.8 : 0.12} />
      )))}
    </svg>
  );
}

function TransitSVG() {
  return (
    <svg width="72" height="72" viewBox="0 0 72 72" fill="none">
      <circle cx="36" cy="36" r="28" stroke="rgba(96,165,250,0.3)" strokeWidth="1" />
      <circle cx="36" cy="36" r="18" stroke="rgba(96,165,250,0.15)" strokeWidth="0.8" />
      <circle cx="36" cy="36" r="8" stroke="rgba(96,165,250,0.1)" strokeWidth="0.8" />
      <ellipse cx="36" cy="36" rx="28" ry="11" stroke="rgba(96,165,250,0.2)" strokeWidth="0.8" transform="rotate(-28 36 36)" />
      <circle cx="18" cy="18" r="4.5" fill="#60a5fa" opacity={0.6} />
      <circle cx="56" cy="28" r="3.5" fill="#a78bfa" opacity={0.5} />
      <circle cx="36" cy="60" r="3" fill="#60a5fa" opacity={0.4} />
      <circle cx="48" cy="48" r="2" fill="#818cf8" opacity={0.4} />
    </svg>
  );
}

function MatchingSVG() {
  return (
    <svg width="72" height="72" viewBox="0 0 72 72" fill="none">
      <circle cx="26" cy="36" r="18" stroke="#f472b6" strokeWidth="1" opacity={0.5} />
      <circle cx="46" cy="36" r="18" stroke="#f472b6" strokeWidth="1" opacity={0.5} />
      <path d="M36 22 A18 18 0 0 1 36 50 A18 18 0 0 1 36 22" fill="#f472b6" opacity={0.08} />
      <circle cx="26" cy="30" r="2" fill="#f472b6" opacity={0.6} />
      <circle cx="46" cy="30" r="2" fill="#f472b6" opacity={0.6} />
      <circle cx="36" cy="36" r="3" fill="#f472b6" opacity={0.3} />
    </svg>
  );
}

function SadeSatiSVG() {
  return (
    <svg width="72" height="72" viewBox="0 0 72 72" fill="none">
      <circle cx="36" cy="36" r="26" stroke="rgba(96,165,250,0.2)" strokeWidth="0.8" />
      <circle cx="36" cy="36" r="12" stroke="rgba(96,165,250,0.15)" strokeWidth="0.8" />
      <circle cx="36" cy="10" r="6" fill="none" stroke="#60a5fa" strokeWidth="1.5" />
      <line x1="30" y1="10" x2="42" y2="10" stroke="#60a5fa" strokeWidth="1" opacity={0.4} />
      <circle cx="36" cy="36" r="3" fill="#60a5fa" opacity={0.3} />
      <path d="M20 56 Q36 44 52 56" stroke="#60a5fa" strokeWidth="1" fill="none" opacity={0.3} />
      <text x="30" y="40" fill="#60a5fa" fontSize="12" fontWeight="bold" opacity={0.5}>7.5</text>
    </svg>
  );
}

function LearnSVG() {
  return (
    <svg width="72" height="72" viewBox="0 0 72 72" fill="none">
      <rect x="14" y="10" width="36" height="48" rx="3" stroke="#d4a853" strokeWidth="1.2" />
      <rect x="22" y="14" width="36" height="48" rx="3" stroke="#d4a853" strokeWidth="1.2" opacity={0.4} />
      <line x1="22" y1="24" x2="42" y2="24" stroke="rgba(212,168,83,0.3)" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="22" y1="32" x2="38" y2="32" stroke="rgba(212,168,83,0.2)" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="22" y1="40" x2="40" y2="40" stroke="rgba(212,168,83,0.2)" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="22" y1="48" x2="34" y2="48" stroke="rgba(212,168,83,0.15)" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="30" cy="16" r="1.5" fill="#d4a853" opacity={0.4} />
    </svg>
  );
}

function PrashnaSVG() {
  return (
    <svg width="72" height="72" viewBox="0 0 72 72" fill="none">
      <circle cx="36" cy="36" r="26" stroke="#a78bfa" strokeWidth="1" opacity={0.4} />
      <text x="28" y="46" fill="#a78bfa" fontSize="28" fontWeight="bold" opacity={0.6}>?</text>
      <circle cx="16" cy="20" r="2" fill="#a78bfa" opacity={0.3} />
      <circle cx="56" cy="24" r="2.5" fill="#a78bfa" opacity={0.25} />
      <circle cx="52" cy="52" r="2" fill="#a78bfa" opacity={0.2} />
      <circle cx="18" cy="50" r="1.5" fill="#a78bfa" opacity={0.2} />
    </svg>
  );
}

// Card data with unique gradient colors and SVGs
const HERO_CARDS: { href: string; gradient: string; border: string; titleColor: string; svg: React.ReactNode;
  label: { en: string; hi: string; ta: string; te?: string; bn?: string; kn?: string; mr?: string; gu?: string; mai?: string }; desc: { en: string; hi: string; ta: string; te?: string; bn?: string; kn?: string; mr?: string; gu?: string; mai?: string } }[] = [
  {
    href: '/kundali', gradient: 'from-[#2d1b69]/50 via-[#1a1040]/60 to-[#0a0e27]',
    border: 'border-gold-primary/12 hover:border-gold-primary/35', titleColor: 'text-[#f0d48a]',
    svg: <KundaliSVG />,
    label: { en: 'Birth Chart', hi: 'जन्म कुण्डली', ta: 'ஜாதக வரைபடம்', te: 'జాతక చార్ట్', bn: 'জাতক চার্ট', kn: 'ಜಾತಕ ನಕ್ಷೆ', mr: 'जन्म कुंडली', gu: 'જન્મ કુંડળી', mai: 'जन्म कुंडली' },
    desc: { en: 'Generate Kundali with Dasha, Yogas & AI insights', hi: 'दशा, योग और AI अंतर्दृष्टि के साथ कुण्डली बनाएं', ta: 'தசா, யோகம் & AI நுண்ணறிவுடன் ஜாதகம் உருவாக்கு', te: 'దశ, యోగాలు & AI అంతర్దృష్టితో జాతకం రూపొందించండి', bn: 'দশা, যোগ ও AI অন্তর্দৃষ্টি সহ জাতক তৈরি করুন', kn: 'ದಶಾ, ಯೋಗ ಮತ್ತು AI ಒಳನೋಟಗಳೊಂದಿಗೆ ಜಾತಕ ರಚಿಸಿ', mr: 'दशा, योग आणि AI अंतर्दृष्टीसह कुंडली बनवा', gu: 'દશા, યોગ અને AI આંતરદૃષ્ટિ સાથે કુંડળી બનાવો', mai: 'दशा, योग आ AI अंतर्दृष्टिक संग कुंडली बनाउ' },
  },
  {
    href: '/muhurta-ai', gradient: 'from-[#1a4a3a]/40 via-[#0a2520]/50 to-[#0a0e27]',
    border: 'border-emerald-500/10 hover:border-emerald-500/30', titleColor: 'text-emerald-400',
    svg: <MuhurtaSVG />,
    label: { en: 'Muhurta AI', hi: 'मुहूर्त AI', ta: 'முகூர்த்தம் AI', te: 'ముహూర్తం AI', bn: 'মুহূর্ত AI', kn: 'ಮುಹೂರ್ತ AI', mr: 'मुहूर्त AI', gu: 'મુહૂર્ત AI', mai: 'मुहूर्त AI' },
    desc: { en: 'AI-scored auspicious timing for 20 activities', hi: '20 गतिविधियों के लिए AI-अंकित शुभ समय', ta: '20 நடவடிக்கைகளுக்கான AI-மதிப்பிட்ட சுப நேரம்', te: '20 కార్యకలాపాలకు AI-స్కోర్ శుభ సమయాలు', bn: '20টি কর্মকাণ্ডের জন্য AI-মূল্যায়িত শুভ সময়', kn: '20 ಚಟುವಟಿಕೆಗಳಿಗೆ AI-ಮೌಲ್ಯಮಾಪನ ಶುಭ ಸಮಯ', mr: '20 कार्यांसाठी AI-मूल्यांकित शुभ मुहूर्त', gu: '20 પ્રવૃત્તિઓ માટે AI-મૂલ્યાંકિત શુભ સમય', mai: '20 कार्यक लेल AI-अंकित शुभ समय' },
  },
  {
    href: '/calendar', gradient: 'from-[#4a2a10]/40 via-[#2a1a0a]/50 to-[#0a0e27]',
    border: 'border-orange-500/10 hover:border-orange-500/30', titleColor: 'text-orange-400',
    svg: <CalendarSVG />,
    label: { en: 'Festivals & Vrat', hi: 'त्योहार और व्रत', ta: 'திருவிழாக்கள் & விரதம்', te: 'పండుగలు & వ్రతాలు', bn: 'উৎসব ও ব্রত', kn: 'ಹಬ್ಬಗಳು & ವ್ರತಗಳು', mr: 'सण आणि व्रत', gu: 'તહેવાર અને વ્રત', mai: 'पर्व आ व्रत' },
    desc: { en: 'Hindu calendar with regional events & Ekadashi', hi: 'क्षेत्रीय त्योहार और एकादशी के साथ हिन्दू पंचांग', ta: 'பிராந்திய நிகழ்வுகள் & ஏகாதசியுடன் இந்து நாள்காட்டி', te: 'ప్రాంతీయ ఈవెంట్లు & ఏకాదశితో హిందూ పంచాంగం', bn: 'আঞ্চলিক অনুষ্ঠান ও একাদশী সহ হিন্দু পঞ্চাঙ্গ', kn: 'ಪ್ರಾದೇಶಿಕ ಕಾರ್ಯಕ್ರಮಗಳು & ಏಕಾದಶಿಯೊಂದಿಗೆ ಹಿಂದೂ ಪಂಚಾಂಗ', mr: 'प्रादेशिक सण आणि एकादशीसह हिंदू पंचांग', gu: 'પ્રાદેશિક ઘટનાઓ અને એકાદશી સાથે હિંદુ પંચાંગ', mai: 'क्षेत्रीय पर्व आ एकादशीक संग हिन्दू पंचांग' },
  },
  {
    href: '/transits', gradient: 'from-[#1a2a5a]/40 via-[#0a1530]/50 to-[#0a0e27]',
    border: 'border-blue-500/10 hover:border-blue-500/30', titleColor: 'text-blue-400',
    svg: <TransitSVG />,
    label: { en: 'Planet Transits', hi: 'ग्रह गोचर', ta: 'கிரக பெயர்ச்சி', te: 'గ్రహ గోచారం', bn: 'গ্রহ গোচর', kn: 'ಗ್ರಹ ಗೋಚಾರ', mr: 'ग्रह गोचर', gu: 'ગ્રહ ગોચર', mai: 'ग्रह गोचर' },
    desc: { en: 'Track planetary movements & Gochar predictions', hi: 'ग्रहों की चाल और गोचर फल ट्रैक करें', ta: 'கிரக நகர்வுகள் & கோசார கணிப்புகளைக் கண்காணிக்கவும்', te: 'గ్రహ చలనాలు & గోచార ఫలాలను ట్రాక్ చేయండి', bn: 'গ্রহের গতিবিধি ও গোচর ফল ট্র্যাক করুন', kn: 'ಗ್ರಹ ಚಲನೆಗಳು & ಗೋಚಾರ ಫಲಗಳನ್ನು ಟ್ರ್ಯಾಕ್ ಮಾಡಿ', mr: 'ग्रहांची गती आणि गोचर फल ट्रॅक करा', gu: 'ગ્રહોની ગતિ અને ગોચર ફળ ટ્રેક કરો', mai: 'ग्रहक चाल आ गोचर फल ट्रैक करू' },
  },
  {
    href: '/matching', gradient: 'from-[#4a1a3a]/35 via-[#2a0a20]/45 to-[#0a0e27]',
    border: 'border-pink-500/10 hover:border-pink-500/30', titleColor: 'text-pink-400',
    svg: <MatchingSVG />,
    label: { en: 'Kundali Matching', hi: 'कुण्डली मिलान', ta: 'ஜாதக பொருத்தம்', te: 'జాతక పొంతన', bn: 'জাতক মিলন', kn: 'ಜಾತಕ ಹೊಂದಾಣಿಕೆ', mr: 'कुंडली जुळवणी', gu: 'કુંડળી મિલાન', mai: 'कुंडली मिलान' },
    desc: { en: 'Ashta Kuta 36-Guna compatibility analysis', hi: 'अष्ट कूट 36-गुण अनुकूलता विश्लेषण', ta: 'அஷ்ட கூட 36-குண பொருத்த பகுப்பாய்வு', te: 'అష్ట కూట 36-గుణ అనుకూలత విశ్లేషణ', bn: 'অষ্ট কূট ৩৬-গুণ সামঞ্জস্য বিশ্লেষণ', kn: 'ಅಷ್ಟ ಕೂಟ 36-ಗುಣ ಹೊಂದಾಣಿಕೆ ವಿಶ್ಲೇಷಣೆ', mr: 'अष्ट कूट 36-गुण अनुकूलता विश्लेषण', gu: 'અષ્ટ કૂટ 36-ગુણ અનુકૂળતા વિશ્લેષણ', mai: 'अष्ट कूट 36-गुण अनुकूलता विश्लेषण' },
  },
  {
    href: '/sade-sati', gradient: 'from-[#1a2040]/40 via-[#0a1025]/50 to-[#0a0e27]',
    border: 'border-blue-400/10 hover:border-blue-400/30', titleColor: 'text-blue-300',
    svg: <SadeSatiSVG />,
    label: { en: 'Sade Sati', hi: 'साढ़े साती', ta: 'சனிப்பெயர்ச்சி', te: 'సాడే సాతి', bn: 'সাড়ে সাতি', kn: 'ಸಾಡೆ ಸಾತಿ', mr: 'साडेसाती', gu: 'સાડાસાતી', mai: 'साढ़ेसाती' },
    desc: { en: "Saturn's 7.5 year cycle — phase & remedies", hi: 'शनि की साढ़े साती — चरण और उपाय', ta: 'சனியின் 7.5 ஆண்டு சுழற்சி — கட்டம் & பரிகாரங்கள்', te: 'శని 7.5 సంవత్సరాల చక్రం — దశ & పరిహారాలు', bn: 'শনির ৭.৫ বছরের চক্র — পর্ব ও প্রতিকার', kn: 'ಶನಿ 7.5 ವರ್ಷಗಳ ಚಕ್ರ — ಹಂತ & ಪರಿಹಾರಗಳು', mr: 'शनीची साडेसाती — टप्पा आणि उपाय', gu: 'શનિની સાડાસાતી — તબક્કો અને ઉપાય', mai: 'शनिक साढ़ेसाती — चरण आ उपाय' },
  },
  {
    href: '/prashna', gradient: 'from-[#2a1a4a]/35 via-[#1a0a30]/45 to-[#0a0e27]',
    border: 'border-violet-500/10 hover:border-violet-500/30', titleColor: 'text-violet-400',
    svg: <PrashnaSVG />,
    label: { en: 'Prashna Kundali', hi: 'प्रश्न कुण्डली', ta: 'பிரச்ன ஜாதகம்', te: 'ప్రశ్న జాతకం', bn: 'প্রশ্ন জাতক', kn: 'ಪ್ರಶ್ನ ಜಾತಕ', mr: 'प्रश्न कुंडली', gu: 'પ્રશ્ન કુંડળી', mai: 'प्रश्न कुंडली' },
    desc: { en: 'Horary astrology — instant answers to questions', hi: 'होरेरी ज्योतिष — प्रश्नों के तत्काल उत्तर', ta: 'ஹோரேரி ஜோதிடம் — கேள்விகளுக்கு உடனடி பதில்கள்', te: 'హోరరీ జ్యోతిషం — ప్రశ్నలకు తక్షణ సమాధానాలు', bn: 'হোরারি জ্যোতিষ — প্রশ্নের তাৎক্ষণিক উত্তর', kn: 'ಹೋರರಿ ಜ್ಯೋತಿಷ — ಪ್ರಶ್ನೆಗಳಿಗೆ ತಕ್ಷಣದ ಉತ್ತರಗಳು', mr: 'होरेरी ज्योतिष — प्रश्नांची तात्काळ उत्तरे', gu: 'હોરરી જ્યોતિષ — પ્રશ્નોના તાત્કાલિક જવાબો', mai: 'होरेरी ज्योतिष — प्रश्नक तत्काल उत्तर' },
  },
  {
    href: '/learn', gradient: 'from-[#3a2a10]/35 via-[#1a1508]/45 to-[#0a0e27]',
    border: 'border-gold-primary/10 hover:border-gold-primary/30', titleColor: 'text-gold-light',
    svg: <LearnSVG />,
    label: { en: 'Learn Jyotish', hi: 'ज्योतिष सीखें', ta: 'ஜோதிடம் கற்க', te: 'జ్యోతిషం నేర్చుకోండి', bn: 'জ্যোতিষ শিখুন', kn: 'ಜ್ಯೋತಿಷ ಕಲಿಯಿರಿ', mr: 'ज्योतिष शिका', gu: 'જ્યોતિષ શીખો', mai: 'ज्योतिष सीखू' },
    desc: { en: 'Grahas, Rashis, Nakshatras, Dashas & more', hi: 'ग्रह, राशि, नक्षत्र, दशा और बहुत कुछ', ta: 'கிரகங்கள், ராசிகள், நட்சத்திரங்கள், தசைகள் & மேலும்', te: 'గ్రహాలు, రాశులు, నక్షత్రాలు, దశలు & మరిన్ని', bn: 'গ্রহ, রাশি, নক্ষত্র, দশা ও আরও অনেক কিছু', kn: 'ಗ್ರಹಗಳು, ರಾಶಿಗಳು, ನಕ್ಷತ್ರಗಳು, ದಶೆಗಳು & ಇನ್ನಷ್ಟು', mr: 'ग्रह, राशी, नक्षत्र, दशा आणि बरेच काही', gu: 'ગ્રહ, રાશિ, નક્ષત્ર, દશા અને વધુ', mai: 'ग्रह, राशि, नक्षत्र, दशा आ आओर बहुत किछु' },
  },
];

const SECONDARY_TOOLS: { href: string; label: { en: string; hi: string; ta: string; te?: string; bn?: string; kn?: string; mr?: string; gu?: string; mai?: string }; gradient: string; border: string }[] = [
  { href: '/retrograde', label: { en: 'Retrograde Calendar', hi: 'वक्री पंचांग', ta: 'வக்ர நாள்காட்டி', te: 'వక్ర పంచాంగం', bn: 'বক্র পঞ্চাঙ্গ', kn: 'ವಕ್ರ ಪಂಚಾಂಗ', mr: 'वक्री पंचांग', gu: 'વક્રી પંચાંગ', mai: 'वक्री पंचांग' }, gradient: 'from-red-500/8 to-transparent', border: 'border-red-500/10 hover:border-red-500/25' },
  { href: '/eclipses', label: { en: 'Eclipse Calendar', hi: 'ग्रहण पंचांग', ta: 'கிரகண நாள்காட்டி', te: 'గ్రహణ పంచాంగం', bn: 'গ্রহণ পঞ্চাঙ্গ', kn: 'ಗ್ರಹಣ ಪಂಚಾಂಗ', mr: 'ग्रहण पंचांग', gu: 'ગ્રહણ પંચાંગ', mai: 'ग्रहण पंचांग' }, gradient: 'from-purple-500/8 to-transparent', border: 'border-purple-500/10 hover:border-purple-500/25' },
  { href: '/muhurat', label: { en: 'Muhurat Finder', hi: 'मुहूर्त खोजक', ta: 'முகூர்த்தம் தேடி', te: 'ముహూర్తం అన్వేషణ', bn: 'মুহূর্ত অনুসন্ধান', kn: 'ಮುಹೂರ್ತ ಹುಡುಕಾಟ', mr: 'मुहूर्त शोधक', gu: 'મુહૂર્ત શોધક', mai: 'मुहूर्त खोजक' }, gradient: 'from-emerald-500/8 to-transparent', border: 'border-emerald-500/10 hover:border-emerald-500/25' },
  { href: '/sign-calculator', label: { en: 'Sign Calculator', hi: 'राशि गणक', ta: 'ராசி கணிப்பான்', te: 'రాశి గణన', bn: 'রাশি গণক', kn: 'ರಾಶಿ ಲೆಕ್ಕಾಚಾರ', mr: 'राशी गणक', gu: 'રાશિ ગણક', mai: 'राशि गणक' }, gradient: 'from-amber-500/8 to-transparent', border: 'border-amber-500/10 hover:border-amber-500/25' },
  { href: '/baby-names', label: { en: 'Baby Names', hi: 'शिशु नाम', ta: 'குழந்தை பெயர்கள்', te: 'శిశు నామాలు', bn: 'শিশুর নাম', kn: 'ಶಿಶು ಹೆಸರುಗಳು', mr: 'बाळ नावे', gu: 'બાળ નામો', mai: 'शिशु नाम' }, gradient: 'from-pink-500/8 to-transparent', border: 'border-pink-500/10 hover:border-pink-500/25' },
  { href: '/shraddha', label: { en: 'Shraddha Calculator', hi: 'श्राद्ध गणक', ta: 'சிராத்த கணிப்பான்', te: 'శ్రాద్ధ గణన', bn: 'শ্রাদ্ধ গণক', kn: 'ಶ್ರಾದ್ಧ ಲೆಕ್ಕಾಚಾರ', mr: 'श्राद्ध गणक', gu: 'શ્રાદ્ધ ગણક', mai: 'श्राद्ध गणक' }, gradient: 'from-stone-400/8 to-transparent', border: 'border-stone-400/10 hover:border-stone-400/25' },
  { href: '/vedic-time', label: { en: 'Vedic Time', hi: 'वैदिक समय', ta: 'வேத நேரம்', te: 'వేద సమయం', bn: 'বৈদিক সময়', kn: 'ವೈದಿಕ ಸಮಯ', mr: 'वैदिक वेळ', gu: 'વૈદિક સમય', mai: 'वैदिक समय' }, gradient: 'from-amber-400/8 to-transparent', border: 'border-amber-400/10 hover:border-amber-400/25' },
  { href: '/devotional', label: { en: 'Devotional Guide', hi: 'भक्ति मार्गदर्शिका', ta: 'பக்தி வழிகாட்டி', te: 'భక్తి మార్గదర్శి', bn: 'ভক্তি পথনির্দেশিকা', kn: 'ಭಕ್ತಿ ಮಾರ್ಗದರ್ಶಿ', mr: 'भक्ती मार्गदर्शक', gu: 'ભક્તિ માર્ગદર્શક', mai: 'भक्ति मार्गदर्शिका' }, gradient: 'from-orange-500/8 to-transparent', border: 'border-orange-500/10 hover:border-orange-500/25' },
  { href: '/regional', label: { en: 'Regional Calendars', hi: 'क्षेत्रीय पंचांग', ta: 'பிராந்திய நாள்காட்டிகள்', te: 'ప్రాంతీయ పంచాంగాలు', bn: 'আঞ্চলিক পঞ্চাঙ্গ', kn: 'ಪ್ರಾದೇಶಿಕ ಪಂಚಾಂಗ', mr: 'प्रादेशिक पंचांग', gu: 'પ્રાદેશિક પંચાંગ', mai: 'क्षेत्रीय पंचांग' }, gradient: 'from-teal-500/8 to-transparent', border: 'border-teal-500/10 hover:border-teal-500/25' },
  { href: '/upagraha', label: { en: 'Upagraha', hi: 'उपग्रह', ta: 'உபகிரகம்', te: 'ఉపగ్రహం', bn: 'উপগ্রহ', kn: 'ಉಪಗ್ರಹ', mr: 'उपग्रह', gu: 'ઉપગ્રહ', mai: 'उपग्रह' }, gradient: 'from-cyan-500/8 to-transparent', border: 'border-cyan-500/10 hover:border-cyan-500/25' },
  { href: '/varshaphal', label: { en: 'Varshaphal', hi: 'वर्षफल', ta: 'வர்ஷபலன்', te: 'వర్షఫలం', bn: 'বর্ষফল', kn: 'ವರ್ಷಫಲ', mr: 'वर्षफल', gu: 'વર્ષફળ', mai: 'वर्षफल' }, gradient: 'from-yellow-500/8 to-transparent', border: 'border-yellow-500/10 hover:border-yellow-500/25' },
  { href: '/kp-system', label: { en: 'KP System', hi: 'केपी पद्धति', ta: 'KP முறை', te: 'KP పద్ధతి', bn: 'KP পদ্ধতি', kn: 'KP ಪದ್ಧತಿ', mr: 'केपी पद्धती', gu: 'KP પદ્ધતિ', mai: 'केपी पद्धति' }, gradient: 'from-indigo-500/8 to-transparent', border: 'border-indigo-500/10 hover:border-indigo-500/25' },
  { href: '/stories', label: { en: 'Web Stories', hi: 'वेब स्टोरीज़', ta: 'வலைக் கதைகள்', te: 'వెబ్ కథలు', bn: 'ওয়েব গল্প', kn: 'ವೆಬ್ ಕಥೆಗಳು', mr: 'वेब कथा', gu: 'વેબ વાર્તાઓ', mai: 'वेब स्टोरीज' }, gradient: 'from-purple-500/8 to-transparent', border: 'border-purple-500/10 hover:border-purple-500/25' },
];

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'home' });

  // ─── Server-side panchang via Vercel geo headers (eliminates LCP waterfall) ───
  let serverPanchang: PanchangData | null = null;
  let serverLocation: { lat: number; lng: number; name: string } | null = null;
  try {
    const hdrs = await headers();
    const geoLat = hdrs.get('x-vercel-ip-latitude');
    const geoLng = hdrs.get('x-vercel-ip-longitude');
    const geoCity = hdrs.get('x-vercel-ip-city');
    const geoCountry = hdrs.get('x-vercel-ip-country');
    const geoTz = hdrs.get('x-vercel-ip-timezone');
    if (geoLat && geoLng) {
      const lat = parseFloat(geoLat);
      const lng = parseFloat(geoLng);
      const locationName = [geoCity ? decodeURIComponent(geoCity) : '', geoCountry || ''].filter(Boolean).join(', ');
      const timezone = geoTz || 'UTC';
      const now = new Date();
      const year = now.getFullYear();
      const month = now.getMonth() + 1;
      const day = now.getDate();
      const tzOffset = getUTCOffsetForDate(year, month, day, timezone);
      serverPanchang = computePanchang({ year, month, day, lat, lng, tzOffset, timezone, locationName });
      serverLocation = { lat, lng, name: locationName };
    }
  } catch { /* geo headers unavailable (local dev) — widget falls back to client fetch */ }
  const isDevanagari = isDevanagariLocale(locale);
  const hf = getHeadingFont(locale);
  const bf = getBodyFont(locale) || {};

  return (
    <div className="relative">
      {/* Hero Section */}
      <section className="relative pt-22 pb-6 sm:pt-24 sm:pb-8 px-4 overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full bg-gradient-to-br from-gold-primary/5 via-transparent to-gold-dark/5 blur-3xl" />

        <div className="text-center max-w-2xl mx-auto relative z-10 stagger-children">
          {/* Gayatri Mantra */}
          <p
            className="text-gold-primary/80 text-sm sm:text-base font-bold tracking-wider leading-relaxed mb-4"
            style={{ fontFamily: 'var(--font-devanagari-heading)' }}
          >
            ॐ भूर्भुवः स्वः । तत्सवितुर्वरेण्यं भर्गो देवस्य धीमहि । धियो यो नः प्रचोदयात् ॥
          </p>

          {/* Main tagline */}
          <h1
            className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 leading-tight"
            style={hf}
          >
            <span className="text-gold-gradient">{t('tagline')}</span>
          </h1>

          {/* Subtitle */}
          <p
            className="text-gold-primary/70 text-base sm:text-xl max-w-2xl mx-auto mb-3 italic font-medium tracking-wide"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            {t('subtitle')}
          </p>

          {/* Tamaso Ma Jyotirgamaya */}
          <p
            className="text-gold-primary/60 text-sm sm:text-lg font-bold tracking-wide"
            style={{ fontFamily: 'var(--font-devanagari-heading)' }}
          >
            असतो मा सद्गमय। तमसो मा ज्योतिर्गमय। मृत्योर्मा अमृतं गमय।
          </p>
        </div>
      </section>

      <GoldDivider />

      {/* Three Pillars */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-16">
        <div className="text-center mb-14 animate-fade-in-up">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4" style={hf}>
            <span className="text-gold-gradient">
              {L({ en: 'Three Pillars of Vedic Wisdom', hi: 'वैदिक ज्ञान के तीन स्तम्भ', sa: 'वैदिकज्ञानस्य त्रयः स्तम्भाः', ta: 'வேத ஞானத்தின் மூன்று தூண்கள்', te: 'వేద జ్ఞానం యొక్క మూడు స్తంభాలు', bn: 'বৈদিক জ্ঞানের তিনটি স্তম্ভ', kn: 'ವೈದಿಕ ಜ್ಞಾನದ ಮೂರು ಸ್ತಂಭಗಳು', gu: 'વૈદિક જ્ઞાનના ત્રણ સ્તંભ', mr: 'वैदिक ज्ञानाचे तीन स्तम्भ', mai: 'वैदिक ज्ञानक तीन स्तम्भ' }, locale)}
            </span>
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 lg:gap-7 stagger-children">
          {/* Pillar 1: Panchang */}
          <div>
            <Link href="/panchang" className="block group h-full">
              <div className="relative rounded-2xl bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/15 hover:border-gold-primary/40 p-4 sm:p-6 md:p-10 h-full min-h-[420px] sm:min-h-[500px] flex flex-col transition-all duration-300 group-hover:-translate-y-2 group-hover:shadow-xl group-hover:shadow-gold-primary/10 overflow-hidden">
                <div className="mb-6"><PanchangPillarIcon /></div>
                <div className="mb-1">
                  <div className="border-t-2 border-gold-primary/60 inline-block">
                    <h3 className="text-gold-light text-3xl sm:text-4xl font-bold tracking-wide pt-1" style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 600 }}>
                      {L({ en: 'Panchang', hi: 'पञ्चाङ्ग', ta: 'பஞ்சாங்கம்', te: 'పంచాంగం', bn: 'পঞ্চাঙ্গ', kn: 'ಪಂಚಾಂಗ', gu: 'પંચાંગ', mr: 'पंचांग', mai: 'पंचांग' }, locale)}
                    </h3>
                  </div>
                </div>
                <p className="text-gold-primary/80 text-lg sm:text-xl font-bold italic mb-6" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                  {L({ en: 'Know Your Day', hi: 'अपना दिन जानें', sa: 'स्वदिनं जानातु', ta: 'உங்கள் நாளை அறியுங்கள்', te: 'మీ రోజును తెలుసుకోండి', bn: 'আপনার দিন জানুন', kn: 'ನಿಮ್ಮ ದಿನವನ್ನು ತಿಳಿಯಿರಿ', gu: 'તમારો દિવસ જાણો', mr: 'तुमचा दिवस जाणा', mai: 'अपन दिन जानू' }, locale)}
                </p>
                <p className="text-text-secondary/70 text-base sm:text-lg leading-[1.9] flex-1 italic" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                  {locale === 'te'
                    ? <>మీ ప్రాంతానికి ఖచ్చితమైన <span className="text-amber-300 not-italic font-bold">తిథి, నక్షత్రం, యోగం</span> మరియు <span className="text-amber-300 not-italic font-bold">కరణం</span> సమయాలు. <span className="text-amber-300 not-italic font-bold">దశల వారీ పూజా విధానాలు</span>, దేవనాగరి మంత్రాలు, మరియు హరి వాసర నియమాలతో <span className="text-amber-300 not-italic font-bold">ఏకాదశి పారణ</span>. 20 జీవిత కార్యకలాపాలకు <span className="text-amber-300 not-italic font-bold">ఉత్తమ ముహూర్తం</span> కనుగొనండి.</>
                    : locale === 'bn'
                    ? <>আপনার অবস্থানের জন্য সুনির্দিষ্ট <span className="text-amber-300 not-italic font-bold">তিথি, নক্ষত্র, যোগ</span> এবং <span className="text-amber-300 not-italic font-bold">করণ</span> সময়। <span className="text-amber-300 not-italic font-bold">ধাপে ধাপে পূজা বিধি</span>, দেবনাগরী মন্ত্র, এবং হরি বাসর নিয়ম সহ <span className="text-amber-300 not-italic font-bold">একাদশী পারণ</span>। ২০টি জীবন কর্মকাণ্ডের জন্য <span className="text-amber-300 not-italic font-bold">আদর্শ মুহূর্ত</span> খুঁজুন।</>
                    : locale === 'kn'
                    ? <>ನಿಮ್ಮ ಸ್ಥಳಕ್ಕೆ ನಿಖರವಾದ <span className="text-amber-300 not-italic font-bold">ತಿಥಿ, ನಕ್ಷತ್ರ, ಯೋಗ</span> ಮತ್ತು <span className="text-amber-300 not-italic font-bold">ಕರಣ</span> ಸಮಯಗಳು. <span className="text-amber-300 not-italic font-bold">ಹಂತ ಹಂತವಾಗಿ ಪೂಜಾ ವಿಧಿಗಳು</span>, ದೇವನಾಗರಿ ಮಂತ್ರಗಳು, ಮತ್ತು ಹರಿ ವಾಸರ ನಿಯಮಗಳೊಂದಿಗೆ <span className="text-amber-300 not-italic font-bold">ಏಕಾದಶಿ ಪಾರಣ</span>. 20 ಜೀವನ ಚಟುವಟಿಕೆಗಳಿಗೆ <span className="text-amber-300 not-italic font-bold">ಪರಿಪೂರ್ಣ ಮುಹೂರ್ತ</span> ಕಂಡುಕೊಳ್ಳಿ.</>
                    : locale === 'ta'
                    ? <>உங்கள் இருப்பிடத்திற்கான துல்லியமான <span className="text-amber-300 not-italic font-bold">திதி, நட்சத்திரம், யோகம்</span> மற்றும் <span className="text-amber-300 not-italic font-bold">கரணம்</span> நேரங்கள். <span className="text-amber-300 not-italic font-bold">படிப்படியான பூஜை விதிகள்</span>, தேவநாகரி மந்திரங்கள், மற்றும் ஹரி வாசர விதிகளுடன் <span className="text-amber-300 not-italic font-bold">ஏகாதசி பாரணம்</span>. 20 வாழ்க்கை நடவடிக்கைகளுக்கான <span className="text-amber-300 not-italic font-bold">சிறந்த முகூர்த்தம்</span> கண்டறியுங்கள்.</>
                    : locale === 'gu'
                    ? <>તમારા સ્થાન માટે ચોક્કસ <span className="text-amber-300 not-italic font-bold">તિથિ, નક્ષત્ર, યોગ</span> અને <span className="text-amber-300 not-italic font-bold">કરણ</span> સમય. <span className="text-amber-300 not-italic font-bold">પગલે-પગલે પૂજા વિધિ</span>, દેવનાગરી મંત્રો, અને હરિ વાસર નિયમો સાથે <span className="text-amber-300 not-italic font-bold">એકાદશી પારણ</span>. 20 જીવન પ્રવૃત્તિઓ માટે <span className="text-amber-300 not-italic font-bold">શ્રેષ્ઠ મુહૂર્ત</span> શોધો.</>
                    : (isDevanagari)
                      ? <>आपके स्थान के लिए सटीक <span className="text-amber-300 font-bold">तिथि, नक्षत्र, योग</span> और <span className="text-amber-300 font-bold">करण</span> समय। <span className="text-amber-300 font-bold">पूजा विधि</span>, देवनागरी मन्त्र और हरि वासर नियमों के साथ <span className="text-amber-300 font-bold">एकादशी पारण</span>। 20 जीवन गतिविधियों के लिए <span className="text-amber-300 font-bold">शुभ मुहूर्त</span> खोजें।</>
                      : <>Precise <span className="text-amber-300 not-italic font-bold">tithi, nakshatra, yoga</span> and <span className="text-amber-300 not-italic font-bold">karana</span> timings for your location. Festival calendar with <span className="text-amber-300 not-italic font-bold">step-by-step puja vidhis</span>, mantras in Devanagari, and <span className="text-amber-300 not-italic font-bold">Ekadashi parana</span> computed with Hari Vasara rules. Find the <span className="text-amber-300 not-italic font-bold">perfect muhurat</span> for any of 20 life activities.</>
                  }
                </p>
                <div className="mt-6 pt-4 border-t border-gold-primary/10">
                  <span className="text-amber-300 text-lg sm:text-xl font-bold tracking-wide group-hover:text-gold-light transition-colors" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                    {L({ en: "View Today's Panchang →", hi: 'आज का पंचांग देखें →', ta: 'இன்றைய பஞ்சாங்கம் காண →', te: 'నేటి పంచాంగం చూడండి →', bn: 'আজকের পঞ্চাঙ্গ দেখুন →', kn: 'ಇಂದಿನ ಪಂಚಾಂಗ ನೋಡಿ →', gu: 'આજનું પંચાંગ જુઓ →', mr: 'आजचे पंचांग पहा →', mai: 'आइक पंचांग देखू →' }, locale)}
                  </span>
                </div>
              </div>
            </Link>
          </div>

          {/* Pillar 2: Kundali */}
          <div>
            <Link href="/kundali" className="block group h-full">
              <div className="relative rounded-2xl bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/15 hover:border-gold-primary/40 p-4 sm:p-6 md:p-10 h-full min-h-[420px] sm:min-h-[500px] flex flex-col transition-all duration-300 group-hover:-translate-y-2 group-hover:shadow-xl group-hover:shadow-gold-primary/10 overflow-hidden">
                <div className="mb-6"><KundaliPillarIcon /></div>
                <div className="mb-1">
                  <div className="border-t-2 border-gold-primary/60 inline-block">
                    <h3 className="text-gold-light text-3xl sm:text-4xl font-bold tracking-wide pt-1" style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 600 }}>
                      {L({ en: 'Kundali', hi: 'कुण्डली', ta: 'ஜாதகம்', te: 'జాతకం', bn: 'জাতক', kn: 'ಜಾತಕ', gu: 'કુંડળી', mr: 'कुंडली', mai: 'कुंडली' }, locale)}
                    </h3>
                  </div>
                </div>
                <p className="text-gold-primary/80 text-lg sm:text-xl font-bold italic mb-6" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                  {L({ en: 'Know Yourself', hi: 'स्वयं को जानें', sa: 'आत्मानं जानातु', ta: 'உங்களை அறியுங்கள்', te: 'మిమ్మల్ని తెలుసుకోండి', bn: 'নিজেকে জানুন', kn: 'ನಿಮ್ಮನ್ನು ತಿಳಿಯಿರಿ', gu: 'તમારી જાતને જાણો', mr: 'स्वतःला जाणा', mai: 'अपना केँ चिन्हू' }, locale)}
                </p>
                <p className="text-text-secondary/70 text-base sm:text-lg leading-[1.9] flex-1 italic" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                  {locale === 'te'
                    ? <>మీ పూర్తి జాతక చార్ట్ — <span className="text-amber-300 not-italic font-bold">150+ యోగాలు</span>, షడ్బల బలం, మరియు మహాదశ, అంతర్దశ, ప్రత్యంతర దశ అంతటా <span className="text-amber-300 not-italic font-bold">కాలం వారీ దశ అంచనాలు</span>. <span className="text-amber-300 not-italic font-bold">36-గుణ అనుకూలత</span> పొంతన, వర్షఫలం ద్వారా వార్షిక అంచనాలు, మరియు అధునాతన పద్ధతులు — <span className="text-amber-300 not-italic font-bold">KP, జైమిని, ప్రశ్న</span>.</>
                    : locale === 'bn'
                    ? <>আপনার সম্পূর্ণ জন্ম কুণ্ডলী — <span className="text-amber-300 not-italic font-bold">১৫০+ যোগ</span>, ষড়বল শক্তি, এবং মহাদশা, অন্তর্দশা, প্রত্যন্তর দশা জুড়ে <span className="text-amber-300 not-italic font-bold">কাল-দর-কাল দশা পূর্বাভাস</span>। <span className="text-amber-300 not-italic font-bold">৩৬-গুণ সামঞ্জস্য</span> মিলন, বর্ষফলের মাধ্যমে বার্ষিক ভবিষ্যদ্বাণী, এবং উন্নত পদ্ধতি — <span className="text-amber-300 not-italic font-bold">KP, জৈমিনি, প্রশ্ন</span>।</>
                    : locale === 'kn'
                    ? <>ನಿಮ್ಮ ಸಂಪೂರ್ಣ ಜಾತಕ — <span className="text-amber-300 not-italic font-bold">150+ ಯೋಗಗಳು</span>, ಷಡ್ಬಲ ಶಕ್ತಿ, ಮತ್ತು ಮಹಾದಶಾ, ಅಂತರ್ದಶಾ, ಪ್ರತ್ಯಂತರ ದಶೆ ಉದ್ದಕ್ಕೂ <span className="text-amber-300 not-italic font-bold">ಅವಧಿ-ವಾರಿ ದಶಾ ಮುನ್ಸೂಚನೆಗಳು</span>. <span className="text-amber-300 not-italic font-bold">36-ಗುಣ ಹೊಂದಾಣಿಕೆ</span>, ವರ್ಷಫಲದ ಮೂಲಕ ವಾರ್ಷಿಕ ಮುನ್ಸೂಚನೆಗಳು, ಮತ್ತು ಸುಧಾರಿತ ಪದ್ಧತಿಗಳು — <span className="text-amber-300 not-italic font-bold">KP, ಜೈಮಿನಿ, ಪ್ರಶ್ನ</span>.</>
                    : locale === 'ta'
                    ? <>உங்கள் முழுமையான ஜாதக வரைபடம் — <span className="text-amber-300 not-italic font-bold">150+ யோகங்கள்</span>, ஷட்பல வலிமை, மற்றும் மகாதசா, அந்தர்தசா, பிரத்யந்தர தசா முழுவதும் <span className="text-amber-300 not-italic font-bold">கால-கால தசா கணிப்புகள்</span>. <span className="text-amber-300 not-italic font-bold">36-குண பொருத்தம்</span>, வர்ஷபலன் வழியாக வருடாந்திர கணிப்புகள், மற்றும் மேம்பட்ட முறைகள் — <span className="text-amber-300 not-italic font-bold">KP, ஜைமினி, பிரச்னம்</span>.</>
                    : locale === 'gu'
                    ? <>તમારો સંપૂર્ણ જન્મ ચાર્ટ — <span className="text-amber-300 not-italic font-bold">150+ યોગ</span>, ષડ્બળ શક્તિ, અને મહાદશા, અંતર્દશા, પ્રત્યંતર દશા સમગ્ર <span className="text-amber-300 not-italic font-bold">કાળ-દર-કાળ દશા આગાહી</span>. <span className="text-amber-300 not-italic font-bold">36-ગુણ સુસંગતતા</span> મેળ, વર્ષફળ દ્વારા વાર્ષિક આગાહી, અને અદ્યતન પદ્ધતિઓ — <span className="text-amber-300 not-italic font-bold">KP, જૈમિની, પ્રશ્ન</span>.</>
                    : (isDevanagari)
                      ? <>आपकी पूर्ण जन्म कुण्डली — <span className="text-amber-300 font-bold">150+ योग</span>, षड्बल और <span className="text-amber-300 font-bold">काल-दर-काल दशा पूर्वानुमान</span>। <span className="text-amber-300 font-bold">36 गुण अनुकूलता</span> मिलान, वर्षफल वार्षिक भविष्यवाणी, और उन्नत पद्धतियाँ — <span className="text-amber-300 font-bold">केपी, जैमिनी, प्रश्न</span>।</>
                      : <>Your complete birth chart with <span className="text-amber-300 not-italic font-bold">150+ yogas</span>, shadbala strength, and <span className="text-amber-300 not-italic font-bold">period-by-period dasha forecasts</span> across Mahadasha, Antardasha, and Pratyantardasha. <span className="text-amber-300 not-italic font-bold">36-Guna compatibility</span> matching, annual predictions via Varshaphal, and advanced systems — <span className="text-amber-300 not-italic font-bold">KP, Jaimini, Prashna</span>.</>
                  }
                </p>
                <div className="mt-6 pt-4 border-t border-gold-primary/10">
                  <span className="text-amber-300 text-lg sm:text-xl font-bold tracking-wide group-hover:text-gold-light transition-colors" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                    {L({ en: 'Generate Your Chart →', hi: 'अपनी कुण्डली बनाएं →', ta: 'உங்கள் ஜாதகத்தை உருவாக்கு →', te: 'మీ జాతకం రూపొందించండి →', bn: 'আপনার জাতক তৈরি করুন →', kn: 'ನಿಮ್ಮ ಜಾತಕ ರಚಿಸಿ →', gu: 'તમારી કુંડળી બનાવો →', mr: 'तुमची कुंडली बनवा →', mai: 'अपन कुंडली बनाबू →' }, locale)}
                  </span>
                </div>
              </div>
            </Link>
          </div>

          {/* Pillar 3: Jyotish (Learn) */}
          <div>
            <Link href="/learn" className="block group h-full">
              <div className="relative rounded-2xl bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/15 hover:border-gold-primary/40 p-4 sm:p-6 md:p-10 h-full min-h-[420px] sm:min-h-[500px] flex flex-col transition-all duration-300 group-hover:-translate-y-2 group-hover:shadow-xl group-hover:shadow-gold-primary/10 overflow-hidden">
                <div className="mb-6"><JyotishPillarIcon /></div>
                <div className="mb-1">
                  <div className="border-t-2 border-gold-primary/60 inline-block">
                    <h3 className="text-gold-light text-3xl sm:text-4xl font-bold tracking-wide pt-1" style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 600 }}>
                      {L({ en: 'Jyotish', hi: 'ज्योतिष', ta: 'ஜோதிடம்', te: 'జ్యోతిషం', bn: 'জ্যোতিষ', kn: 'ಜ್ಯೋತಿಷ', gu: 'જ્યોતિષ', mr: 'ज्योतिष', mai: 'ज्योतिष' }, locale)}
                    </h3>
                  </div>
                </div>
                <p className="text-gold-primary/80 text-lg sm:text-xl font-bold italic mb-6" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                  {L({ en: 'Master the Science', hi: 'विज्ञान में निपुणता', sa: 'विज्ञानं वशीकुर्यात्', ta: 'அறிவியலில் தேர்ச்சி', te: 'శాస్త్రంలో నైపుణ్యం', bn: 'বিজ্ঞানে দক্ষতা', kn: 'ವಿಜ್ಞಾನದಲ್ಲಿ ಪ್ರಾವೀಣ್ಯತೆ', gu: 'વિજ્ઞાનમાં નિપુણતા', mr: 'शास्त्रात प्रभुत्व', mai: 'विज्ञान मे निपुणता' }, locale)}
                </p>
                <p className="text-text-secondary/70 text-base sm:text-lg leading-[1.9] flex-1 italic" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                  {locale === 'te'
                    ? <><span className="text-amber-300 not-italic font-bold">89 నిర్మాణాత్మక మాడ్యూల్స్</span> — గ్రహాలు, రాశులు, నక్షత్రాల పునాదుల నుండి <span className="text-amber-300 not-italic font-bold">దశ, యోగం, షడ్బలం</span> ద్వారా <span className="text-amber-300 not-italic font-bold">KP, జైమిని, మరియు తాజిక</span> వంటి అధునాతన పద్ధతుల వరకు. ఇంటరాక్టివ్ రేఖాచిత్రాలు, శాస్త్రీయ సంస్కృత సూచనలు, మరియు ప్రతి గణన వెనుక ఖగోళ గణితం.</>
                    : locale === 'bn'
                    ? <><span className="text-amber-300 not-italic font-bold">৮৯টি কাঠামোগত মডিউল</span> — গ্রহ, রাশি, নক্ষত্রের ভিত্তি থেকে <span className="text-amber-300 not-italic font-bold">দশা, যোগ, ষড়বল</span> হয়ে উন্নত পদ্ধতি পর্যন্ত — <span className="text-amber-300 not-italic font-bold">KP, জৈমিনি এবং তাজিক</span>। ইন্টারেক্টিভ চিত্র, শাস্ত্রীয় সংস্কৃত তথ্যসূত্র, এবং প্রতিটি গণনার পিছনের জ্যোতির্বিজ্ঞান গণিত।</>
                    : locale === 'kn'
                    ? <><span className="text-amber-300 not-italic font-bold">89 ರಚನಾತ್ಮಕ ಮಾಡ್ಯೂಲ್‌ಗಳು</span> — ಗ್ರಹಗಳು, ರಾಶಿಗಳು, ನಕ್ಷತ್ರಗಳ ಅಡಿಪಾಯದಿಂದ <span className="text-amber-300 not-italic font-bold">ದಶಾ, ಯೋಗ, ಷಡ್ಬಲ</span> ಮೂಲಕ <span className="text-amber-300 not-italic font-bold">KP, ಜೈಮಿನಿ ಮತ್ತು ತಾಜಿಕ</span> ನಂತಹ ಸುಧಾರಿತ ಪದ್ಧತಿಗಳವರೆಗೆ. ಇಂಟರಾಕ್ಟಿವ್ ರೇಖಾಚಿತ್ರಗಳು, ಶಾಸ್ತ್ರೀಯ ಸಂಸ್ಕೃತ ಉಲ್ಲೇಖಗಳು, ಮತ್ತು ಪ್ರತಿ ಲೆಕ್ಕಾಚಾರದ ಹಿಂದಿನ ಖಗೋಳ ಗಣಿತ.</>
                    : locale === 'ta'
                    ? <><span className="text-amber-300 not-italic font-bold">89 கட்டமைக்கப்பட்ட தொகுதிகள்</span> — கிரகங்கள், ராசிகள், நட்சத்திரங்கள் அடிப்படையிலிருந்து <span className="text-amber-300 not-italic font-bold">தசா, யோகம், ஷட்பலம்</span> வழியாக <span className="text-amber-300 not-italic font-bold">KP, ஜைமினி, மற்றும் தாஜிக</span> போன்ற மேம்பட்ட முறைகள் வரை. ஊடாடும் வரைபடங்கள், செவ்வியல் சமஸ்கிருத மேற்கோள்கள், மற்றும் ஒவ்வொரு கணக்கீட்டின் பின்னால் உள்ள வானியல் கணிதம்.</>
                    : locale === 'gu'
                    ? <><span className="text-amber-300 not-italic font-bold">89 સંરચિત મોડ્યુલ</span> — ગ્રહ, રાશિ, નક્ષત્રના પાયાથી <span className="text-amber-300 not-italic font-bold">દશા, યોગ, ષડ્બળ</span> દ્વારા <span className="text-amber-300 not-italic font-bold">KP, જૈમિની અને તાજિક</span> જેવી અદ્યતન પદ્ધતિઓ સુધી. ઇન્ટરેક્ટિવ આકૃતિઓ, શાસ્ત્રીય સંસ્કૃત સંદર્ભો, અને દરેક ગણતરી પાછળનું ખગોળીય ગણિત.</>
                    : (isDevanagari)
                      ? <><span className="text-amber-300 font-bold">89 संरचित पाठ्यक्रम</span> — ग्रह, राशि, नक्षत्र की नींव से <span className="text-amber-300 font-bold">दशा, योग, षड्बल</span> होते हुए उन्नत पद्धतियों तक — <span className="text-amber-300 font-bold">केपी, जैमिनी और ताजिक</span>। इंटरैक्टिव आरेख, शास्त्रीय संस्कृत सन्दर्भ, और प्रत्येक गणना के पीछे का खगोलीय गणित।</>
                      : <><span className="text-amber-300 not-italic font-bold">89 structured modules</span> taking you from the foundations — Grahas, Rashis, Nakshatras — through <span className="text-amber-300 not-italic font-bold">Dashas, Yogas, Shadbala</span>, to advanced systems like <span className="text-amber-300 not-italic font-bold">KP, Jaimini, and Tajika</span>. Interactive diagrams, classical Sanskrit references, and the computational astronomy behind every calculation.</>
                  }
                </p>
                <div className="mt-6 pt-4 border-t border-gold-primary/10">
                  <span className="text-amber-300 text-lg sm:text-xl font-bold tracking-wide group-hover:text-gold-light transition-colors" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                    {L({ en: 'Start Learning →', hi: 'सीखना शुरू करें →', ta: 'கற்கத் தொடங்குங்கள் →', te: 'నేర్చుకోవడం ప్రారంభించండి →', bn: 'শেখা শুরু করুন →', kn: 'ಕಲಿಯಲು ಪ್ರಾರಂಭಿಸಿ →', gu: 'શીખવાનું શરૂ કરો →', mr: 'शिकायला सुरुवात करा →', mai: 'सीखब शुरू करू →' }, locale)}
                  </span>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </section>

      <AdUnit placement="rectangle" className="max-w-2xl mx-auto" />

      <GoldDivider />

      {/* Today's Panchang */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="animate-fade-in-up">
          <h2 className="text-3xl sm:text-4xl font-bold text-center mb-12" style={hf}>
            <span className="text-gold-gradient">{t('todayPanchang')}</span>
          </h2>
          <HomeClientWidgets locale={locale} serverPanchang={serverPanchang} serverLocation={serverLocation} />
        </div>
      </section>

      <AdUnit placement="leaderboard" className="max-w-4xl mx-auto" />

      {/* Hero Cards */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="animate-fade-in-up mb-10">
          <h2 className="text-3xl sm:text-4xl font-bold text-center mb-3" style={hf}>
            <span className="text-gold-gradient">{t('exploreTools')}</span>
          </h2>
          <p className="text-text-secondary text-center text-sm sm:text-base max-w-2xl mx-auto" style={bf}>
            {t('exploreToolsDesc')}
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 stagger-children">
          {HERO_CARDS.map((card) => (
            <Link key={card.href} href={card.href} className="block group">
              <div className={`relative rounded-2xl bg-gradient-to-br ${card.gradient} border ${card.border} p-5 h-full transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-lg overflow-hidden`}>
                <div className="mb-3 opacity-60 group-hover:opacity-80 transition-opacity">{card.svg}</div>
                <h3 className={`${card.titleColor} text-lg font-bold mb-1`} style={hf}>
                  {L(card.label, locale)}
                </h3>
                <p className="text-text-secondary/70 text-sm leading-relaxed" style={bf}>
                  {L(card.desc, locale)}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Secondary Tools */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="flex flex-wrap gap-2.5 justify-center stagger-children">
          {SECONDARY_TOOLS.map((tool) => (
            <Link key={tool.href} href={tool.href} className="group">
              <div className={`rounded-xl bg-gradient-to-br ${tool.gradient} border ${tool.border} px-4 py-2.5 transition-all duration-200 group-hover:-translate-y-0.5`}>
                <span className="text-text-secondary group-hover:text-text-primary text-sm font-medium transition-colors" style={bf}>
                  {L(tool.label, locale)}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Profile Banner — client component, only renders for logged-in users */}
      <ProfileBanner locale={locale} bf={bf} />
    </div>
  );
}
