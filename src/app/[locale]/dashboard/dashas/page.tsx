'use client';

import { useState, useEffect } from 'react';
import { useLocale } from 'next-intl';
import { motion } from 'framer-motion';
import { ArrowLeft, ChevronDown } from 'lucide-react';
import { GrahaIconById } from '@/components/icons/GrahaIcons';
import { useAuthStore } from '@/stores/auth-store';
import { getSupabase } from '@/lib/supabase/client';
import type { DashaEntry } from '@/types/kundali';
import type { Locale , LocaleText} from '@/types/panchang';
import { isDevanagariLocale } from '@/lib/utils/locale-fonts';
import { tl } from '@/lib/utils/trilingual';

const PLANET_ID: Record<string, number> = { Sun: 0, Moon: 1, Mars: 2, Mercury: 3, Jupiter: 4, Venus: 5, Saturn: 6, Rahu: 7, Ketu: 8 };

const DASHA_EFFECTS: Record<string, LocaleText> = {
  Sun: { en: 'Authority, career, government, father, vitality', hi: 'अधिकार, करियर, सरकार, पिता, जीवनशक्ति', sa: 'अधिकारः, वृत्तिः, शासनम्, पिता, जीवनशक्तिः', mai: 'अधिकार, करियर, सरकार, पिता, जीवनशक्ति', mr: 'अधिकार, करिअर, सरकार, पिता, जीवनशक्ती', ta: 'அதிகாரம், தொழில், அரசு, தந்தை, உயிர்ச்சக்தி', te: 'అధికారం, వృత్తి, ప్రభుత్వం, తండ్రి, జీవశక్తి', bn: 'কর্তৃত্ব, কর্মজীবন, সরকার, পিতা, জীবনীশক্তি', kn: 'ಅಧಿಕಾರ, ವೃತ್ತಿ, ಸರ್ಕಾರ, ತಂದೆ, ಜೀವಶಕ್ತಿ', gu: 'સત્તા, કારકિર્દી, સરકાર, પિતા, જીવનશક્તિ' },
  Moon: { en: 'Emotions, mother, public dealings, travel, nurturing', hi: 'भावनाएँ, माता, जनसंपर्क, यात्रा, पोषण', sa: 'भावनाः, माता, जनसम्पर्कः, यात्रा, पोषणम्', mai: 'भावना, माता, जनसंपर्क, यात्रा, पोषण', mr: 'भावना, माता, जनसंपर्क, प्रवास, पोषण', ta: 'உணர்ச்சிகள், தாய், பொது தொடர்பு, பயணம், பரிபாலனம்', te: 'భావోద్వేగాలు, తల్లి, ప్రజా సంబంధాలు, ప్రయాణం, పోషణ', bn: 'আবেগ, মাতা, জনসংযোগ, ভ্রমণ, পরিপোষণ', kn: 'ಭಾವನೆಗಳು, ತಾಯಿ, ಸಾರ್ವಜನಿಕ ವ್ಯವಹಾರ, ಪ್ರಯಾಣ, ಪೋಷಣೆ', gu: 'લાગણીઓ, માતા, જનસંપર્ક, પ્રવાસ, પોષણ' },
  Mars: { en: 'Energy, property, siblings, courage, surgery', hi: 'ऊर्जा, संपत्ति, भाई-बहन, साहस, शल्यक्रिया', sa: 'ऊर्जा, सम्पत्तिः, भ्रातरः, साहसम्, शल्यक्रिया', mai: 'ऊर्जा, संपत्ति, भाय-बहिन, साहस, शल्यक्रिया', mr: 'ऊर्जा, मालमत्ता, भावंडे, धाडस, शस्त्रक्रिया', ta: 'ஆற்றல், சொத்து, உடன்பிறப்புகள், தைரியம், அறுவை சிகிச்சை', te: 'శక్తి, ఆస్తి, తోబుట్టువులు, ధైర్యం, శస్త్రచికిత్స', bn: 'শক্তি, সম্পত্তি, ভাইবোন, সাহস, শল্যচিকিৎসা', kn: 'ಶಕ್ತಿ, ಆಸ್ತಿ, ಒಡಹುಟ್ಟಿದವರು, ಧೈರ್ಯ, ಶಸ್ತ್ರಚಿಕಿತ್ಸೆ', gu: 'ઊર્જા, સંપત્તિ, ભાઈ-બહેન, સાહસ, શસ્ત્રક્રિયા' },
  Mercury: { en: 'Intellect, business, communication, education', hi: 'बुद्धि, व्यापार, संवाद, शिक्षा', sa: 'बुद्धिः, वाणिज्यम्, सम्वादः, शिक्षा', mai: 'बुद्धि, व्यापार, संवाद, शिक्षा', mr: 'बुद्धी, व्यापार, संवाद, शिक्षण', ta: 'அறிவு, வணிகம், தொடர்பாடல், கல்வி', te: 'బుద్ధి, వ్యాపారం, సంభాషణ, విద్య', bn: 'বুদ্ধি, ব্যবসা, যোগাযোগ, শিক্ষা', kn: 'ಬುದ್ಧಿ, ವ್ಯಾಪಾರ, ಸಂವಹನ, ಶಿಕ್ಷಣ', gu: 'બુદ્ધિ, વ્યાપાર, સંવાદ, શિક્ષણ' },
  Jupiter: { en: 'Wisdom, children, fortune, spirituality, teaching', hi: 'ज्ञान, संतान, भाग्य, आध्यात्मिकता, शिक्षण', sa: 'ज्ञानम्, सन्तानाः, भाग्यम्, आध्यात्मिकता, शिक्षणम्', mai: 'ज्ञान, संतान, भाग्य, आध्यात्मिकता, शिक्षण', mr: 'ज्ञान, संतती, भाग्य, अध्यात्म, अध्यापन', ta: 'ஞானம், குழந்தைகள், அதிர்ஷ்டம், ஆன்மிகம், கற்பித்தல்', te: 'జ్ఞానం, సంతానం, అదృష్టం, ఆధ్యాత్మికత, బోధన', bn: 'জ্ঞান, সন্তান, ভাগ্য, আধ্যাত্মিকতা, শিক্ষাদান', kn: 'ಜ್ಞಾನ, ಮಕ್ಕಳು, ಅದೃಷ್ಟ, ಆಧ್ಯಾತ್ಮಿಕತೆ, ಬೋಧನೆ', gu: 'જ્ઞાન, સંતાન, ભાગ્ય, આધ્યાત્મિકતા, શિક્ષણ' },
  Venus: { en: 'Relationships, luxury, arts, marriage, comfort', hi: 'संबंध, विलासिता, कला, विवाह, सुख', sa: 'सम्बन्धाः, विलासिता, कला, विवाहः, सुखम्', mai: 'संबंध, विलासिता, कला, विवाह, सुख', mr: 'नातेसंबंध, ऐश्वर्य, कला, विवाह, सुख', ta: 'உறவுகள், ஆடம்பரம், கலை, திருமணம், வசதி', te: 'సంబంధాలు, విలాసం, కళలు, వివాహం, సౌఖ్యం', bn: 'সম্পর্ক, বিলাসিতা, শিল্পকলা, বিবাহ, সুখ', kn: 'ಸಂಬಂಧಗಳು, ಐಷಾರಾಮ, ಕಲೆ, ವಿವಾಹ, ಸುಖ', gu: 'સંબંધો, વૈભવ, કળા, લગ્ન, આરામ' },
  Saturn: { en: 'Discipline, delays, hard work, karma, longevity', hi: 'अनुशासन, विलंब, कठिन परिश्रम, कर्म, दीर्घायु', sa: 'अनुशासनम्, विलम्बः, कठोरपरिश्रमः, कर्म, दीर्घायुः', mai: 'अनुशासन, विलंब, कठिन परिश्रम, कर्म, दीर्घायु', mr: 'शिस्त, विलंब, कठोर परिश्रम, कर्म, दीर्घायुष्य', ta: 'ஒழுக்கம், தாமதம், கடின உழைப்பு, கர்மா, நீண்ட ஆயுள்', te: 'క్రమశిక్షణ, ఆలస్యం, కఠోర శ్రమ, కర్మ, దీర్ఘాయువు', bn: 'শৃঙ্খলা, বিলম্ব, কঠোর পরিশ্রম, কর্ম, দীর্ঘায়ু', kn: 'ಶಿಸ್ತು, ವಿಳಂಬ, ಕಠಿಣ ಪರಿಶ್ರಮ, ಕರ್ಮ, ದೀರ್ಘಾಯುಷ್ಯ', gu: 'શિસ્ત, વિલંબ, કઠોર પરિશ્રમ, કર્મ, દીર્ઘાયુ' },
  Rahu: { en: 'Sudden changes, foreign, technology, unconventional', hi: 'अचानक बदलाव, विदेश, प्रौद्योगिकी, अपरंपरागत', sa: 'आकस्मिकपरिवर्तनम्, विदेशः, प्रौद्योगिकी, अपरम्परागतम्', mai: 'अचानक बदलाव, विदेश, प्रौद्योगिकी, अपरंपरागत', mr: 'अचानक बदल, परदेश, तंत्रज्ञान, अपारंपरिक', ta: 'திடீர் மாற்றங்கள், வெளிநாடு, தொழில்நுட்பம், வழக்கத்திற்கு மாறான', te: 'ఆకస్మిక మార్పులు, విదేశం, సాంకేతికత, అసాంప్రదాయం', bn: 'আকস্মিক পরিবর্তন, বিদেশ, প্রযুক্তি, অপ্রচলিত', kn: 'ಆಕಸ್ಮಿಕ ಬದಲಾವಣೆಗಳು, ವಿದೇಶ, ತಂತ್ರಜ್ಞಾನ, ಅಸಂಪ್ರದಾಯಿಕ', gu: 'અચાનક ફેરફારો, વિદેશ, ટેકનોલોજી, અપરંપરાગત' },
  Ketu: { en: 'Spirituality, detachment, past karma, liberation', hi: 'आध्यात्मिकता, वैराग्य, पूर्व कर्म, मोक्ष', sa: 'आध्यात्मिकता, वैराग्यम्, पूर्वकर्म, मोक्षः', mai: 'आध्यात्मिकता, वैराग्य, पूर्व कर्म, मोक्ष', mr: 'अध्यात्म, वैराग्य, पूर्वकर्म, मोक्ष', ta: 'ஆன்மிகம், பற்றின்மை, முன்வினை, விடுதலை', te: 'ఆధ్యాత్మికత, వైరాగ్యం, పూర్వకర్మ, మోక్షం', bn: 'আধ্যাত্মিকতা, বৈরাগ্য, পূর্বকর্ম, মোক্ষ', kn: 'ಆಧ್ಯಾತ್ಮಿಕತೆ, ವೈರಾಗ್ಯ, ಪೂರ್ವಕರ್ಮ, ಮೋಕ್ಷ', gu: 'આધ્યાત્મિકતા, વૈરાગ્ય, પૂર્વકર્મ, મોક્ષ' },
};

function progressPercent(start: string, end: string): number {
  const s = new Date(start).getTime();
  const e = new Date(end).getTime();
  const now = Date.now();
  if (now <= s) return 0;
  if (now >= e) return 100;
  return Math.round(((now - s) / (e - s)) * 100);
}

function yearsDiff(start: string, end: string): string {
  const ms = new Date(end).getTime() - new Date(start).getTime();
  const years = ms / (365.25 * 24 * 60 * 60 * 1000);
  return years.toFixed(1);
}

export default function DashasPage() {
  const locale = useLocale() as Locale;
  const hf = (isDevanagariLocale(locale)) ? { fontFamily: 'var(--font-devanagari-heading)' } : { fontFamily: 'var(--font-heading)' };
  const bf = (isDevanagariLocale(locale)) ? { fontFamily: 'var(--font-devanagari-body)' } : {};
  const user = useAuthStore(s => s.user);
  const [dashas, setDashas] = useState<DashaEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedMaha, setExpandedMaha] = useState<string | null>(null);

  useEffect(() => {
    if (!user) { setLoading(false); return; }
    const supabase = getSupabase();
    if (!supabase) { setLoading(false); return; }

    supabase.from('kundali_snapshots')
      .select('dasha_timeline')
      .eq('user_id', user.id)
      .maybeSingle()
      .then(({ data }) => {
        if (data?.dasha_timeline) {
          setDashas(data.dasha_timeline as DashaEntry[]);
          // Auto-expand current maha
          const now = new Date();
          const current = (data.dasha_timeline as DashaEntry[]).find(d => new Date(d.startDate) <= now && now <= new Date(d.endDate));
          if (current) setExpandedMaha(current.planet);
        }
        setLoading(false);
      });
  }, [user]);

  if (!user) {
    return <div className="max-w-2xl mx-auto px-4 py-20 text-center"><p className="text-text-secondary">{tl({ en: 'Sign in to view your dashas', hi: 'दशा देखने के लिए साइन इन करें', sa: 'दशाः द्रष्टुं साइन इन कुर्वन्तु', ta: 'உங்கள் தசைகளைக் காண உள்நுழையவும்', te: 'మీ దశలు చూడటానికి సైన్ ఇన్ చేయండి', bn: 'আপনার দশা দেখতে সাইন ইন করুন', kn: 'ನಿಮ್ಮ ದಶೆಗಳನ್ನು ನೋಡಲು ಸೈನ್ ಇನ್ ಮಾಡಿ', gu: 'તમારી દશાઓ જોવા સાઇન ઇન કરો', mai: 'दशा देखबाक लेल साइन इन करू', mr: 'दशा पाहण्यासाठी साइन इन करा' }, locale)}</p></div>;
  }

  if (loading) {
    return <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-8 w-8 border-2 border-gold-primary border-t-transparent" /></div>;
  }

  const now = new Date();
  const currentMaha = dashas.find(d => new Date(d.startDate) <= now && now <= new Date(d.endDate));
  const currentAntar = currentMaha?.subPeriods?.find(s => new Date(s.startDate) <= now && now <= new Date(s.endDate));

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <a href={`/${locale}/dashboard`} className="text-gold-primary text-sm hover:text-gold-light mb-6 inline-flex items-center gap-1"><ArrowLeft className="w-4 h-4" />{tl({ en: 'Dashboard', hi: 'डैशबोर्ड', sa: 'पटलम्', ta: 'டாஷ்போர்டு', te: 'డాష్‌బోర్డ్', bn: 'ড্যাশবোর্ড', kn: 'ಡ್ಯಾಶ್‌ಬೋರ್ಡ್', gu: 'ડેશબોર્ડ', mai: 'डैशबोर्ड', mr: 'डॅशबोर्ड' }, locale)}</a>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <h1 className="text-4xl font-bold mb-3" style={hf}><span className="text-gold-gradient">{tl({ en: 'Dasha Timeline', hi: 'दशा समयरेखा', sa: 'दशासमयरेखा', ta: 'தசா காலவரிசை', te: 'దశ కాలరేఖ', bn: 'দশা সময়রেখা', kn: 'ದಶೆ ಕಾಲರೇಖೆ', gu: 'દશા સમયરેખા', mai: 'दशा समयरेखा', mr: 'दशा कालरेखा' }, locale)}</span></h1>
      </motion.div>

      {/* Current Period */}
      {currentMaha && (
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-2xl p-6 mb-8">
          <p className="text-gold-dark text-xs uppercase tracking-wider font-bold mb-4">{tl({ en: 'Current Period', hi: 'वर्तमान काल', sa: 'वर्तमानकालः', ta: 'தற்போதைய காலம்', te: 'ప్రస్తుత కాలం', bn: 'বর্তমান কাল', kn: 'ಪ್ರಸ್ತುತ ಅವಧಿ', gu: 'વર્તમાન કાળ', mai: 'वर्तमान काल', mr: 'सध्याचा काळ' }, locale)}</p>

          {/* Mahadasha */}
          <div className="flex items-center gap-4 mb-4">
            <GrahaIconById id={PLANET_ID[currentMaha.planet] ?? 0} size={40} />
            <div className="flex-1">
              <p className="text-gold-light font-bold text-lg" style={hf}>{tl(currentMaha.planetName, locale)} {tl({ en: 'Mahadasha', hi: 'महादशा', sa: 'महादशा', ta: 'மகாதசா', te: 'మహాదశ', bn: 'মহাদশা', kn: 'ಮಹಾದಶಾ', gu: 'મહાદશા', mai: 'महादशा', mr: 'महादशा' }, locale)}</p>
              <p className="text-text-secondary text-xs font-mono">{currentMaha.startDate} — {currentMaha.endDate} ({yearsDiff(currentMaha.startDate, currentMaha.endDate)} {tl({ en: 'years', hi: 'वर्ष', sa: 'वर्षाणि', ta: 'ஆண்டுகள்', te: 'సంవత్సరాలు', bn: 'বছর', kn: 'ವರ್ಷಗಳು', gu: 'વર્ષ', mai: 'वर्ष', mr: 'वर्षे' }, locale)})</p>
              <div className="mt-2 h-2 bg-bg-tertiary/40 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-gold-primary to-gold-light rounded-full" style={{ width: `${progressPercent(currentMaha.startDate, currentMaha.endDate)}%` }} />
              </div>
              <p className="text-text-secondary/70 text-xs mt-1">{progressPercent(currentMaha.startDate, currentMaha.endDate)}% {tl({ en: 'complete', hi: 'पूर्ण', sa: 'पूर्णम्', ta: 'நிறைவு', te: 'పూర్తి', bn: 'সম্পূর্ণ', kn: 'ಪೂರ್ಣ', gu: 'પૂર્ણ', mai: 'पूर्ण', mr: 'पूर्ण' }, locale)}</p>
            </div>
          </div>

          {/* Antardasha */}
          {currentAntar && (
            <div className="flex items-center gap-4 ml-8 pl-4 border-l-2 border-gold-primary/20">
              <GrahaIconById id={PLANET_ID[currentAntar.planet] ?? 0} size={28} />
              <div className="flex-1">
                <p className="text-gold-light font-semibold text-sm" style={bf}>{tl(currentAntar.planetName, locale)} {tl({ en: 'Antardasha', hi: 'अंतर्दशा', sa: 'अन्तर्दशा', ta: 'அந்தர்தசா', te: 'అంతర్దశ', bn: 'অন্তর্দশা', kn: 'ಅಂತರ್ದಶಾ', gu: 'અંતર્દશા', mai: 'अंतर्दशा', mr: 'अंतर्दशा' }, locale)}</p>
                <p className="text-text-secondary text-xs font-mono">{currentAntar.startDate} — {currentAntar.endDate}</p>
                <div className="mt-1 h-1.5 bg-bg-tertiary/40 rounded-full overflow-hidden">
                  <div className="h-full bg-gold-primary/60 rounded-full" style={{ width: `${progressPercent(currentAntar.startDate, currentAntar.endDate)}%` }} />
                </div>
              </div>
            </div>
          )}

          {/* Effect */}
          <div className="mt-4 p-3 rounded-lg bg-gold-primary/5 border border-gold-primary/10">
            <p className="text-text-secondary text-xs" style={bf}>
              {tl(DASHA_EFFECTS[currentMaha.planet], locale)}
            </p>
          </div>
        </motion.div>
      )}

      {/* Full Timeline */}
      <h2 className="text-xl font-bold text-gold-gradient mb-4" style={hf}>{tl({ en: 'Full Timeline', hi: 'पूर्ण समयरेखा', sa: 'पूर्णसमयरेखा', ta: 'முழு காலவரிசை', te: 'పూర్తి కాలరేఖ', bn: 'সম্পূর্ণ সময়রেখা', kn: 'ಪೂರ್ಣ ಕಾಲರೇಖೆ', gu: 'પૂર્ણ સમયરેખા', mai: 'पूर्ण समयरेखा', mr: 'पूर्ण कालरेखा' }, locale)}</h2>

      <div className="relative">
        <div className="absolute left-5 top-0 bottom-0 w-px bg-gold-primary/15" />

        <div className="space-y-3">
          {dashas.map((d, i) => {
            const isCurrent = currentMaha?.planet === d.planet;
            const isPast = new Date(d.endDate) < now;
            const isExpanded = expandedMaha === d.planet;

            return (
              <motion.div key={`${d.planet}-${i}`} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}>
                <button onClick={() => setExpandedMaha(isExpanded ? null : d.planet)}
                  className={`w-full text-left ml-10 rounded-xl p-4 border transition-all relative ${
                    isCurrent ? 'bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/30 bg-gold-primary/5' : isPast ? 'bg-bg-tertiary/10 border-gold-primary/5 opacity-50' : 'bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/10'
                  }`}>
                  {/* Timeline dot */}
                  <div className={`absolute -left-[1.65rem] top-5 w-3 h-3 rounded-full ${isCurrent ? 'bg-gold-primary shadow-[0_0_8px_rgba(212,168,83,0.5)]' : isPast ? 'bg-text-secondary/30' : 'bg-gold-primary/30'}`} />

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <GrahaIconById id={PLANET_ID[d.planet] ?? 0} size={24} />
                      <div>
                        <span className={`font-bold text-sm ${isCurrent ? 'text-gold-light' : 'text-text-secondary'}`} style={bf}>{tl(d.planetName, locale)}</span>
                        {isCurrent && <span className="ml-2 text-xs px-2 py-0.5 bg-gold-primary/20 text-gold-primary rounded-full font-bold">{tl({ en: 'NOW', hi: 'अभी', sa: 'अधुना', ta: 'இப்போது', te: 'ఇప్పుడు', bn: 'এখন', kn: 'ಈಗ', gu: 'હમણાં', mai: 'अखन', mr: 'आत्ता' }, locale)}</span>}
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-text-secondary/70 text-xs font-mono">{d.startDate.slice(0, 4)}—{d.endDate.slice(0, 4)} ({yearsDiff(d.startDate, d.endDate)}y)</span>
                      {d.subPeriods && d.subPeriods.length > 0 && <ChevronDown className={`w-4 h-4 text-gold-primary/40 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />}
                    </div>
                  </div>
                </button>

                {/* Antardasha sub-periods */}
                {isExpanded && d.subPeriods && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="ml-16 mt-1 space-y-1">
                    {d.subPeriods.map((s, j) => {
                      const isCurrentAntar = currentAntar?.planet === s.planet && currentMaha?.planet === d.planet;
                      return (
                        <div key={j} className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs ${isCurrentAntar ? 'bg-gold-primary/10 border border-gold-primary/20' : ''}`}>
                          <GrahaIconById id={PLANET_ID[s.planet] ?? 0} size={14} />
                          <span className={isCurrentAntar ? 'text-gold-light font-bold' : 'text-text-secondary'} style={bf}>{tl(s.planetName, locale)}</span>
                          <span className="text-text-secondary/65 font-mono ml-auto">{s.startDate} — {s.endDate}</span>
                          {isCurrentAntar && <span className="text-gold-primary text-xs font-bold">{tl({ en: 'NOW', hi: 'अभी', sa: 'अधुना', ta: 'இப்போது', te: 'ఇప్పుడు', bn: 'এখন', kn: 'ಈಗ', gu: 'હમણાં', mai: 'अखन', mr: 'आत्ता' }, locale)}</span>}
                        </div>
                      );
                    })}
                  </motion.div>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
