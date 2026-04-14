'use client';

import React from 'react';
import { GrahaIconById } from '@/components/icons/GrahaIcons';
import InfoBlock from '@/components/ui/InfoBlock';
import { GRAHAS } from '@/lib/constants/grahas';
import type { KundaliData } from '@/types/kundali';
import type { Locale , LocaleText} from '@/types/panchang';
import { tl } from '@/lib/utils/trilingual';
import { isDevanagariLocale } from '@/lib/utils/locale-fonts';

// Copied from kundali page — module-level constants used by sphutas rendering
const PLANET_COLORS_SPHUTA: Record<number, string> = {
  0: 'text-amber-400', 1: 'text-slate-300', 2: 'text-red-400', 3: 'text-emerald-400',
  4: 'text-yellow-300', 5: 'text-pink-300', 6: 'text-blue-400', 7: 'text-purple-400', 8: 'text-gray-400',
};

const SIGN_ELEMENTS: Record<number, string> = {
  1: 'Fire', 2: 'Earth', 3: 'Air', 4: 'Water', 5: 'Fire', 6: 'Earth',
  7: 'Air', 8: 'Water', 9: 'Fire', 10: 'Earth', 11: 'Air', 12: 'Water',
};

const SIGN_ELEMENTS_HI: Record<number, string> = {
  1: 'अग्नि', 2: 'पृथ्वी', 3: 'वायु', 4: 'जल', 5: 'अग्नि', 6: 'पृथ्वी',
  7: 'वायु', 8: 'जल', 9: 'अग्नि', 10: 'पृथ्वी', 11: 'वायु', 12: 'जल',
};

const HOUSE_THEMES: Record<number, LocaleText> = {
  1: { en: 'Self, body, health, personality', hi: 'आत्म, शरीर, स्वास्थ्य', sa: 'आत्म, शरीर, स्वास्थ्य', mai: 'आत्म, शरीर, स्वास्थ्य', mr: 'आत्म, शरीर, स्वास्थ्य', ta: 'சுயம், உடல், ஆரோக்கியம், ஆளுமை', te: 'ఆత్మ, దేహం, ఆరోగ్యం, వ్యక్తిత్వం', bn: 'আত্ম, দেহ, স্বাস্থ্য, ব্যক্তিত্ব', kn: 'ಸ್ವಯಂ, ದೇಹ, ಆರೋಗ್ಯ, ವ್ಯಕ್ತಿತ್ವ', gu: 'સ્વ, શરીર, સ્વાસ્થ્ય, વ્યક્તિત્વ' },
  2: { en: 'Wealth, family, speech', hi: 'धन, परिवार, वाणी', sa: 'धन, परिवार, वाणी', mai: 'धन, परिवार, वाणी', mr: 'धन, परिवार, वाणी', ta: 'செல்வம், குடும்பம், வாக்கு', te: 'ధనం, కుటుంబం, వాక్కు', bn: 'ধন, পরিবার, বাক্', kn: 'ಧನ, ಕುಟುಂಬ, ವಾಕ್', gu: 'ધન, કુટુંબ, વાણી' },
  3: { en: 'Courage, siblings, short travel', hi: 'साहस, भाई-बहन, लघु यात्रा', sa: 'साहस, भाई-बहन, लघु यात्रा', mai: 'साहस, भाई-बहन, लघु यात्रा', mr: 'साहस, भाई-बहन, लघु यात्रा', ta: 'தைரியம், உடன்பிறப்பு, சிறு பயணம்', te: 'ధైర్యం, తోబుట్టువులు, చిన్న ప్రయాణం', bn: 'সাহস, ভাইবোন, স্বল্প ভ্রমণ', kn: 'ಧೈರ್ಯ, ಒಡಹುಟ್ಟಿದವರು, ಕಿರು ಪ್ರಯಾಣ', gu: 'સાહસ, ભાઈ-બહેન, ટૂંકી મુસાફરી' },
  4: { en: 'Home, mother, property, comfort', hi: 'घर, माता, सम्पत्ति, सुख', sa: 'घर, माता, सम्पत्ति, सुख', mai: 'घर, माता, सम्पत्ति, सुख', mr: 'घर, माता, सम्पत्ति, सुख', ta: 'வீடு, தாய், சொத்து, சுகம்', te: 'ఇల్లు, తల్లి, ఆస్తి, సుఖం', bn: 'গৃহ, মাতা, সম্পত্তি, সুখ', kn: 'ಮನೆ, ತಾಯಿ, ಆಸ್ತಿ, ಸುಖ', gu: 'ઘર, માતા, સંપત્તિ, સુખ' },
  5: { en: 'Children, education, creativity', hi: 'सन्तान, शिक्षा, रचनात्मकता', sa: 'सन्तान, शिक्षा, रचनात्मकता', mai: 'सन्तान, शिक्षा, रचनात्मकता', mr: 'सन्तान, शिक्षा, रचनात्मकता', ta: 'குழந்தைகள், கல்வி, படைப்பாற்றல்', te: 'పిల్లలు, విద్య, సృజనాత్మకత', bn: 'সন্তান, শিক্ষা, সৃজনশীলতা', kn: 'ಮಕ್ಕಳು, ಶಿಕ್ಷಣ, ಸೃಜನಶೀಲತೆ', gu: 'સંતાન, શિક્ષણ, સર્જનાત્મકતા' },
  6: { en: 'Enemies, health issues, service', hi: 'शत्रु, स्वास्थ्य, सेवा', sa: 'शत्रु, स्वास्थ्य, सेवा', mai: 'शत्रु, स्वास्थ्य, सेवा', mr: 'शत्रु, स्वास्थ्य, सेवा', ta: 'எதிரிகள், உடல்நலப் பிரச்சினை, சேவை', te: 'శత్రువులు, ఆరోగ్య సమస్యలు, సేవ', bn: 'শত্রু, স্বাস্থ্য সমস্যা, সেবা', kn: 'ಶತ್ರು, ಆರೋಗ್ಯ ಸಮಸ್ಯೆ, ಸೇವೆ', gu: 'શત્રુ, આરોગ્ય સમસ્યા, સેવા' },
  7: { en: 'Marriage, partnerships, business', hi: 'विवाह, साझेदारी, व्यापार', sa: 'विवाह, साझेदारी, व्यापार', mai: 'विवाह, साझेदारी, व्यापार', mr: 'विवाह, साझेदारी, व्यापार', ta: 'திருமணம், கூட்டு, வணிகம்', te: 'వివాహం, భాగస్వామ్యం, వ్యాపారం', bn: 'বিবাহ, অংশীদারিত্ব, ব্যবসা', kn: 'ವಿವಾಹ, ಪಾಲುದಾರಿಕೆ, ವ್ಯಾಪಾರ', gu: 'લગ્ન, ભાગીદારી, વ્યાપાર' },
  8: { en: 'Transformation, longevity, occult', hi: 'परिवर्तन, दीर्घायु, गुप्त विद्या', sa: 'परिवर्तन, दीर्घायु, गुप्त विद्या', mai: 'परिवर्तन, दीर्घायु, गुप्त विद्या', mr: 'परिवर्तन, दीर्घायु, गुप्त विद्या', ta: 'மாற்றம், நீண்ட ஆயுள், அமானுஷ்யம்', te: 'పరివర్తన, దీర్ఘాయువు, అతీంద్రియం', bn: 'রূপান্তর, দীর্ঘায়ু, গুপ্তবিদ্যা', kn: 'ಪರಿವರ್ತನೆ, ದೀರ್ಘಾಯುಷ್ಯ, ಗುಪ್ತವಿದ್ಯೆ', gu: 'પરિવર્તન, દીર્ઘાયુ, ગૂઢવિદ્યા' },
  9: { en: 'Fortune, father, dharma, guru', hi: 'भाग्य, पिता, धर्म, गुरु', sa: 'भाग्य, पिता, धर्म, गुरु', mai: 'भाग्य, पिता, धर्म, गुरु', mr: 'भाग्य, पिता, धर्म, गुरु', ta: 'பாக்கியம், தந்தை, தர்மம், குரு', te: 'భాగ్యం, తండ్రి, ధర్మం, గురువు', bn: 'ভাগ্য, পিতা, ধর্ম, গুরু', kn: 'ಭಾಗ್ಯ, ತಂದೆ, ಧರ್ಮ, ಗುರು', gu: 'ભાગ્ય, પિતા, ધર્મ, ગુરુ' },
  10: { en: 'Career, status, authority', hi: 'कैरियर, प्रतिष्ठा, अधिकार', sa: 'कैरियर, प्रतिष्ठा, अधिकार', mai: 'कैरियर, प्रतिष्ठा, अधिकार', mr: 'कैरियर, प्रतिष्ठा, अधिकार', ta: 'தொழில், அந்தஸ்து, அதிகாரம்', te: 'వృత్తి, హోదా, అధికారం', bn: 'কর্মজীবন, মর্যাদা, কর্তৃত্ব', kn: 'ವೃತ್ತಿ, ಸ್ಥಾನಮಾನ, ಅಧಿಕಾರ', gu: 'કારકિર્દી, દરજ્જો, સત્તા' },
  11: { en: 'Gains, income, friends, wishes', hi: 'लाभ, आय, मित्र, इच्छाएँ', sa: 'लाभ, आय, मित्र, इच्छाएँ', mai: 'लाभ, आय, मित्र, इच्छाएँ', mr: 'लाभ, आय, मित्र, इच्छाएँ', ta: 'லாபம், வருமானம், நண்பர்கள், ஆசைகள்', te: 'లాభం, ఆదాయం, మిత్రులు, కోరికలు', bn: 'লাভ, আয়, বন্ধু, ইচ্ছা', kn: 'ಲಾಭ, ಆದಾಯ, ಮಿತ್ರರು, ಆಸೆಗಳು', gu: 'લાભ, આવક, મિત્રો, ઇચ્છાઓ' },
  12: { en: 'Expenses, liberation, foreign', hi: 'व्यय, मोक्ष, विदेश', sa: 'व्यय, मोक्ष, विदेश', mai: 'व्यय, मोक्ष, विदेश', mr: 'व्यय, मोक्ष, विदेश', ta: 'செலவு, முக்தி, வெளிநாடு', te: 'వ్యయం, మోక్షం, విదేశం', bn: 'ব্যয়, মোক্ষ, বিদেশ', kn: 'ವ್ಯಯ, ಮೋಕ್ಷ, ವಿದೇಶ', gu: 'ખર્ચ, મોક્ષ, વિદેશ' },
};

type TransitInfo = {
  label: string;
  labelHi: string;
  daysAway: number;
  isActive: boolean;
  planetName: string;
  period: string;
};

type TimelineEvent = {
  date: Date;
  daysAway: number;
  planet: number;
  sphutalabel: string;
  isBenefic: boolean;
  action: string;
  actionHi: string;
};

export type SphutaTransitData = {
  yogiJupiter: TransitInfo;
  yogiPlanetTx: TransitInfo | null;
  avayogiSaturn: TransitInfo;
  avayogiPlanTx: TransitInfo | null;
  pranaSun: TransitInfo;
  pranaJupiter: TransitInfo;
  dehaMoon: TransitInfo;
  dehaSaturn: TransitInfo;
  mrityuSaturn: TransitInfo;
  mrityuMars: TransitInfo;
  triSun: TransitInfo;
  bijaJupiter: TransitInfo | null;
  kshetraJupiter: TransitInfo | null;
  timeline: TimelineEvent[];
};

interface SphutasTabProps {
  kundali: KundaliData;
  locale: Locale;
  isDevanagari: boolean;
  headingFont: React.CSSProperties;
  sphuataTransitData: SphutaTransitData | null;
}

export default function SphutasTab({ kundali, locale, isDevanagari, headingFont, sphuataTransitData }: SphutasTabProps) {
  const isHi = isDevanagariLocale(locale);
  const yogiPlanetName = GRAHAS[kundali.sphutas!.yogiPoint.yogiPlanet]?.name[locale as Locale] || '';
  const avayogiPlanetName = GRAHAS[kundali.sphutas!.avayogiPoint.avayogiPlanet]?.name[locale as Locale] || '';
  const RASHI_FULL = ['','Aries','Taurus','Gemini','Cancer','Leo','Virgo','Libra','Scorpio','Sagittarius','Capricorn','Aquarius','Pisces'];
  const RASHI_HI = ['','मेष','वृषभ','मिथुन','कर्क','सिंह','कन्या','तुला','वृश्चिक','धनु','मकर','कुम्भ','मीन'];
  const signName = (s: number) => isHi ? RASHI_HI[s] || '' : RASHI_FULL[s] || '';

  return (
    <div className="space-y-6">
      <h3 className="text-gold-gradient text-xl font-bold mb-2 text-center" style={headingFont}>
        {tl({ en: 'Sphutas — Sensitive Points in Your Chart', hi: 'स्फुट — संवेदनशील बिंदु', sa: 'स्फुट — संवेदनशील बिंदु' }, locale)}
      </h3>

      <InfoBlock
        id="kundali-sphutas"
        title={tl({ en: 'What are Sphutas (Sensitive Points)?', hi: 'स्फुट क्या हैं?', sa: 'स्फुट क्या हैं?' }, locale)}
        defaultOpen={false}
      >
        {tl({ en: 'Sphutas are mathematically computed degree points that reveal hidden dimensions: Yogi Point — your luckiest degree, planets near this bring fortune. Avayogi Point — your most challenging degree. Prana Sphuta — vitality and life force. Deha Sphuta — physical body and health constitution. Mrityu Sphuta — longevity indicators (analytical, not predictive!). Tri Sphuta — composite of all three.', hi: 'स्फुट गणितीय रूप से निर्धारित अंश बिंदु हैं जो छुपे आयाम प्रकट करते हैं: योगी बिंदु — आपका सबसे शुभ अंश, इसके निकट ग्रह भाग्य लाते हैं। अवयोगी बिंदु — आपका सबसे चुनौतीपूर्ण अंश। प्राण स्फुट — जीवनशक्ति और प्राण ऊर्जा। देह स्फुट — भौतिक शरीर और स्वास्थ्य संरचना। मृत्यु स्फुट — दीर्घायु सूचक (विश्लेषणात्मक, भविष्यसूचक नहीं!)। त्रि स्फुट — तीनों का समग्र।', sa: 'स्फुट गणितीय रूप से निर्धारित अंश बिंदु हैं जो छुपे आयाम प्रकट करते हैं: योगी बिंदु — आपका सबसे शुभ अंश, इसके निकट ग्रह भाग्य लाते हैं। अवयोगी बिंदु — आपका सबसे चुनौतीपूर्ण अंश। प्राण स्फुट — जीवनशक्ति और प्राण ऊर्जा। देह स्फुट — भौतिक शरीर और स्वास्थ्य संरचना। मृत्यु स्फुट — दीर्घायु सूचक (विश्लेषणात्मक, भविष्यसूचक नहीं!)। त्रि स्फुट — तीनों का समग्र।' }, locale)}
      </InfoBlock>

      {/* -- SYNTHESIS -- leads with so-what */}
      {sphuataTransitData && (() => {
        const PLANET_NAMES_SPHUTA_EN = ['Sun','Moon','Mars','Mercury','Jupiter','Venus','Saturn','Rahu','Ketu'];
        const PLANET_NAMES_SPHUTA_HI = ['सूर्य','चन्द्र','मंगल','बुध','बृहस्पति','शुक्र','शनि','राहु','केतु'];
        const pName = (pid: number) => isHi ? (PLANET_NAMES_SPHUTA_HI[pid]||'') : (PLANET_NAMES_SPHUTA_EN[pid]||'');
        const elemName = (s: number) => isHi ? SIGN_ELEMENTS_HI[s] : SIGN_ELEMENTS[s];
        const sp = kundali.sphutas!;
        // Check if any transit is active right now
        const activeNow = sphuataTransitData.yogiJupiter.isActive || sphuataTransitData.avayogiSaturn.isActive;
        return (
        <div className="rounded-xl bg-gradient-to-br from-[#1a1040]/70 via-[#0f0d2e]/80 to-[#0a0e27] border border-gold-primary/25 p-5">
          <h4 className="text-gold-gradient text-sm font-bold mb-1 uppercase tracking-wider" style={headingFont}>
            {tl({ en: '✦ Sphuta Synthesis — Your Complete Picture', hi: '✦ स्फुट संश्लेषण — आपका पूर्ण चित्र', sa: '✦ स्फुट संश्लेषण — आपका पूर्ण चित्र' }, locale)}
          </h4>
          <p className="text-text-secondary/75 text-xs mb-4">
            {tl({ en: 'Integrated reading of all sphuta points — key transit windows, constitutional health picture, and actionable guidance.', hi: 'सभी स्फुट बिंदुओं का एकीकृत विश्लेषण — महत्वपूर्ण गोचर खिड़कियाँ, स्वास्थ्य संरचना, और व्यावहारिक सुझाव।', sa: 'सभी स्फुट बिंदुओं का एकीकृत विश्लेषण — महत्वपूर्ण गोचर खिड़कियाँ, स्वास्थ्य संरचना, और व्यावहारिक सुझाव।' }, locale)}
          </p>

          {/* Blueprint paragraph */}
          <div className="bg-[#0a0e27]/60 border border-gold-primary/10 rounded-lg p-4 mb-4">
            <p className="text-text-secondary text-xs leading-relaxed">
              {tl({ en: `Your Prana (vitality) is rooted in ${signName(sp.pranaSphuta.sign)} (${elemName(sp.pranaSphuta.sign)} element) — ${sp.pranaSphuta.sign % 2 === 0 ? 'receptive and emotionally driven' : 'active and expressive'}. Deha (body) in ${signName(sp.dehaSphuta.sign)} gives you ${(elemName(sp.dehaSphuta.sign) === 'Fire' || elemName(sp.dehaSphuta.sign) === 'Earth') ? 'physical endurance and structural strength' : 'flexibility and adaptability'}. Mrityu in ${signName(sp.mrityuSphuta.sign)} points to constitutional sensitivity in the ${sp.mrityuSphuta.sign >= 1 && sp.mrityuSphuta.sign <= 6 ? 'upper body region' : 'lower body region'}. Your Yogi Planet is ${pName(sp.yogiPoint.yogiPlanet)} and Avayogi is ${pName(sp.avayogiPoint.avayogiPlanet)} — these two planets mark your best and most challenging dasha periods respectively.`, hi: `आपकी प्राण शक्ति ${signName(sp.pranaSphuta.sign)} (${elemName(sp.pranaSphuta.sign)} तत्व) में है, जो ${sp.pranaSphuta.sign % 2 === 0 ? 'सम — ग्रहणशील, भावनात्मक' : 'विषम — सक्रिय, अभिव्यंजक'} प्रकृति दर्शाती है। देह स्फुट ${signName(sp.dehaSphuta.sign)} में ${elemName(sp.dehaSphuta.sign) === 'अग्नि' || elemName(sp.dehaSphuta.sign) === 'पृथ्वी' ? 'शारीरिक सहनशक्ति और स्थिरता' : 'लचीलापन और अनुकूलनशीलता'} देता है। मृत्यु स्फुट ${signName(sp.mrityuSphuta.sign)} में संवेदनशीलता ${sp.mrityuSphuta.sign >= 1 && sp.mrityuSphuta.sign <= 6 ? 'शरीर के ऊपरी भाग में' : 'शरीर के निचले भाग में'} इंगित करता है। आपका योगी ग्रह ${pName(sp.yogiPoint.yogiPlanet)} है और अवयोगी ग्रह ${pName(sp.avayogiPoint.avayogiPlanet)} — इन दोनों की दशाओं में क्रमशः सर्वोत्तम और सबसे चुनौतीपूर्ण अनुभव होते हैं।`, sa: `आपकी प्राण शक्ति ${signName(sp.pranaSphuta.sign)} (${elemName(sp.pranaSphuta.sign)} तत्व) में है, जो ${sp.pranaSphuta.sign % 2 === 0 ? 'सम — ग्रहणशील, भावनात्मक' : 'विषम — सक्रिय, अभिव्यंजक'} प्रकृति दर्शाती है। देह स्फुट ${signName(sp.dehaSphuta.sign)} में ${elemName(sp.dehaSphuta.sign) === 'अग्नि' || elemName(sp.dehaSphuta.sign) === 'पृथ्वी' ? 'शारीरिक सहनशक्ति और स्थिरता' : 'लचीलापन और अनुकूलनशीलता'} देता है। मृत्यु स्फुट ${signName(sp.mrityuSphuta.sign)} में संवेदनशीलता ${sp.mrityuSphuta.sign >= 1 && sp.mrityuSphuta.sign <= 6 ? 'शरीर के ऊपरी भाग में' : 'शरीर के निचले भाग में'} इंगित करता है। आपका योगी ग्रह ${pName(sp.yogiPoint.yogiPlanet)} है और अवयोगी ग्रह ${pName(sp.avayogiPoint.avayogiPlanet)} — इन दोनों की दशाओं में क्रमशः सर्वोत्तम और सबसे चुनौतीपूर्ण अनुभव होते हैं।` }, locale)}
            </p>
          </div>

          {/* Active window alert */}
          {activeNow && (
            <div className="bg-emerald-500/15 border border-emerald-400/30 rounded-lg p-3 mb-4 flex items-start gap-2">
              <span className="text-emerald-400 text-sm mt-0.5">&#9733;</span>
              <p className="text-emerald-300 text-xs leading-relaxed font-medium">
                {tl({ en: 'An important transit is ACTIVE RIGHT NOW. Pay close attention to opportunities or challenges unfolding in your life.', hi: 'एक महत्वपूर्ण गोचर अभी सक्रिय है! अपने जीवन के अवसरों/चुनौतियों पर ध्यान दें।', sa: 'एक महत्वपूर्ण गोचर अभी सक्रिय है! अपने जीवन के अवसरों/चुनौतियों पर ध्यान दें।' }, locale)}
              </p>
            </div>
          )}

          {/* Timeline */}
          <h5 className="text-gold-primary text-xs uppercase tracking-widest font-bold mb-2">
            {tl({ en: 'Upcoming Key Windows', hi: 'आगामी महत्वपूर्ण खिड़कियाँ', sa: 'आगामी महत्वपूर्ण खिड़कियाँ' }, locale)}
          </h5>
          <div className="space-y-1.5 mb-4">
            {sphuataTransitData.timeline.map((ev, idx) => (
              <div key={idx} className={`flex items-start gap-3 rounded-lg px-3 py-2 text-xs border ${ev.isBenefic ? 'border-emerald-500/15 bg-emerald-500/5' : 'border-red-500/15 bg-red-500/5'}`}>
                <div className={`mt-0.5 w-5 h-5 rounded-full flex-shrink-0 flex items-center justify-center text-xs font-bold ${ev.isBenefic ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'}`}>
                  {ev.isBenefic ? '✦' : '⚠'}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <span className={`font-bold ${PLANET_COLORS_SPHUTA[ev.planet] || 'text-gold-light'}`}>
                      {isHi ? PLANET_NAMES_SPHUTA_HI[ev.planet] : PLANET_NAMES_SPHUTA_EN[ev.planet]} → {ev.sphutalabel}
                    </span>
                    <span className={`font-bold text-xs ${ev.isBenefic ? 'text-emerald-300' : 'text-red-300'}`}>
                      {ev.daysAway < 30 ? tl({ en: `~${ev.daysAway} days`, hi: `~${ev.daysAway} दिन`, sa: `~${ev.daysAway} दिन` }, locale) : ev.date.toLocaleDateString(tl({ en: 'en-US', hi: 'hi-IN', sa: 'hi-IN' }, locale), { month:'short', year:'numeric' })}
                    </span>
                  </div>
                  <p className={`mt-0.5 leading-relaxed ${ev.isBenefic ? 'text-emerald-200/70' : 'text-red-200/70'}`}>
                    {isHi ? ev.actionHi : ev.action}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Constitution summary */}
          <h5 className="text-gold-primary text-xs uppercase tracking-widest font-bold mb-2">
            {tl({ en: 'Constitutional Health Summary', hi: 'स्वास्थ्य संरचना सारांश', sa: 'स्वास्थ्य संरचना सारांश' }, locale)}
          </h5>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-4">
            {[
              { label: tl({ en: 'Prana', hi: 'प्राण', sa: 'प्राण' }, locale), sign: sp.pranaSphuta.sign, deg: sp.pranaSphuta.degree, color:'text-gold-primary' },
              { label: tl({ en: 'Deha', hi: 'देह', sa: 'देह' }, locale), sign: sp.dehaSphuta.sign, deg: sp.dehaSphuta.degree, color:'text-blue-400' },
              { label: tl({ en: 'Mrityu', hi: 'मृत्यु', sa: 'मृत्यु' }, locale), sign: sp.mrityuSphuta.sign, deg: sp.mrityuSphuta.degree, color:'text-violet-400' },
            ].map(({ label, sign, deg, color }) => (
              <div key={label} className="bg-[#0a0e27]/60 border border-gold-primary/8 rounded-lg p-2 text-center">
                <div className={`text-xs font-bold ${color}`}>{label}</div>
                <div className="text-gold-light text-sm font-mono font-bold">{deg.toFixed(1)}°</div>
                <div className="text-text-secondary/75 text-xs">{signName(sign)}</div>
                <div className="text-text-secondary/65 text-xs">{elemName(sign)}</div>
              </div>
            ))}
          </div>

          {/* Key actions */}
          <h5 className="text-gold-primary text-xs uppercase tracking-widest font-bold mb-2">
            {tl({ en: 'Key Actions', hi: 'मुख्य सुझाव', sa: 'मुख्य सुझाव' }, locale)}
          </h5>
          <div className="space-y-1.5">
            <div className="flex items-start gap-2 text-xs text-text-secondary">
              <span className="text-emerald-400 mt-0.5 flex-shrink-0">✦</span>
              <span>{tl({ en: `Strengthen ${pName(sp.yogiPoint.yogiPlanet)} above all others — it is your most benefic karmic ally. Its gemstone, mantra, and charitable donations activate your Yogi Point energy.`, hi: `${pName(sp.yogiPoint.yogiPlanet)} को सबसे अधिक बल दें — यह आपका कल्याणकारी ग्रह है। इसके रत्न, मंत्र, और दान से आपकी योगी बिंदु ऊर्जा सक्रिय होती है।`, sa: `${pName(sp.yogiPoint.yogiPlanet)} को सबसे अधिक बल दें — यह आपका कल्याणकारी ग्रह है। इसके रत्न, मंत्र, और दान से आपकी योगी बिंदु ऊर्जा सक्रिय होती है।` }, locale)}</span>
            </div>
            <div className="flex items-start gap-2 text-xs text-text-secondary">
              <span className="text-amber-400 mt-0.5 flex-shrink-0">◈</span>
              <span>{tl({ en: `When Jupiter is within ±5° of your Yogi Point (${sp.yogiPoint.degree.toFixed(0)}° ${signName(sp.yogiPoint.sign)}) — ${sphuataTransitData.yogiJupiter.isActive ? 'that is NOW' : sphuataTransitData.yogiJupiter.label} — initiate major ventures, investments, marriages, journeys.`, hi: `जब बृहस्पति आपके योगी बिंदु (${sp.yogiPoint.degree.toFixed(0)}° ${signName(sp.yogiPoint.sign)}) के ±5° में हो — ${sphuataTransitData.yogiJupiter.isActive ? 'अभी!' : (isHi ? sphuataTransitData.yogiJupiter.labelHi : sphuataTransitData.yogiJupiter.label)} — बड़े कार्य, निवेश, विवाह, और यात्राएं शुरू करें।`, sa: `जब बृहस्पति आपके योगी बिंदु (${sp.yogiPoint.degree.toFixed(0)}° ${signName(sp.yogiPoint.sign)}) के ±5° में हो — ${sphuataTransitData.yogiJupiter.isActive ? 'अभी!' : (isHi ? sphuataTransitData.yogiJupiter.labelHi : sphuataTransitData.yogiJupiter.label)} — बड़े कार्य, निवेश, विवाह, और यात्राएं शुरू करें।` }, locale)}</span>
            </div>
            <div className="flex items-start gap-2 text-xs text-text-secondary">
              <span className="text-red-400 mt-0.5 flex-shrink-0">⚠</span>
              <span>{tl({ en: `During ${pName(sp.avayogiPoint.avayogiPlanet)} dasha/antardasha and Saturn's Avayogi transit (${sphuataTransitData.avayogiSaturn.isActive ? 'active now!' : sphuataTransitData.avayogiSaturn.label}): postpone major legal, financial, and career decisions where possible.`, hi: `${pName(sp.avayogiPoint.avayogiPlanet)} की दशा/अन्तर्दशा और शनि के अवयोगी बिंदु गोचर (${sphuataTransitData.avayogiSaturn.isActive ? 'अभी सक्रिय' : sphuataTransitData.avayogiSaturn.labelHi}) में: बड़े कानूनी, वित्तीय और व्यावसायिक निर्णय टालें।`, sa: `${pName(sp.avayogiPoint.avayogiPlanet)} की दशा/अन्तर्दशा और शनि के अवयोगी बिंदु गोचर (${sphuataTransitData.avayogiSaturn.isActive ? 'अभी सक्रिय' : sphuataTransitData.avayogiSaturn.labelHi}) में: बड़े कानूनी, वित्तीय और व्यावसायिक निर्णय टालें।` }, locale)}</span>
            </div>
            <div className="flex items-start gap-2 text-xs text-text-secondary">
              <span className="text-violet-400 mt-0.5 flex-shrink-0">◉</span>
              <span>{tl({ en: `When Saturn (${sphuataTransitData.mrityuSaturn.isActive ? 'now!' : sphuataTransitData.mrityuSaturn.label}) or Mars (${sphuataTransitData.mrityuMars.isActive ? 'now!' : sphuataTransitData.mrityuMars.label}) transit your Mrityu Sphuta (${sp.mrityuSphuta.degree.toFixed(0)}° ${signName(sp.mrityuSphuta.sign)}): schedule a comprehensive health checkup, avoid risky activities.`, hi: `जब शनि या मंगल मृत्यु स्फुट (${sp.mrityuSphuta.degree.toFixed(0)}° ${signName(sp.mrityuSphuta.sign)}) पर गोचर करे — शनि: ${sphuataTransitData.mrityuSaturn.isActive ? 'अभी!' : sphuataTransitData.mrityuSaturn.labelHi}, मंगल: ${sphuataTransitData.mrityuMars.isActive ? 'अभी!' : sphuataTransitData.mrityuMars.labelHi} — पूर्ण स्वास्थ्य जांच कराएं।`, sa: `जब शनि या मंगल मृत्यु स्फुट (${sp.mrityuSphuta.degree.toFixed(0)}° ${signName(sp.mrityuSphuta.sign)}) पर गोचर करे — शनि: ${sphuataTransitData.mrityuSaturn.isActive ? 'अभी!' : sphuataTransitData.mrityuSaturn.labelHi}, मंगल: ${sphuataTransitData.mrityuMars.isActive ? 'अभी!' : sphuataTransitData.mrityuMars.labelHi} — पूर्ण स्वास्थ्य जांच कराएं।` }, locale)}</span>
            </div>
          </div>

          <p className="text-text-secondary/55 text-xs mt-3 italic">
            {tl({ en: '* Transit dates are estimates based on average daily motion — retrograde periods may shift by ±4–8 weeks.', hi: '* गोचर तिथियाँ औसत गति पर आधारित अनुमान हैं — वक्री गति से ±4-8 सप्ताह का अन्तर हो सकता है।', sa: '* गोचर तिथियाँ औसत गति पर आधारित अनुमान हैं — वक्री गति से ±4-8 सप्ताह का अन्तर हो सकता है।' }, locale)}
          </p>
        </div>
        );
      })()}

      {/* YOGI & AVAYOGI -- the key pair */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Yogi Point */}
        <div className="rounded-xl bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 p-5 border border-emerald-500/20 bg-emerald-500/5">
          <div className="flex items-center gap-2 mb-3">
            <span className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400 text-lg">&#9733;</span>
            <div>
              <div className="text-emerald-300 text-xs uppercase tracking-widest font-bold">{tl({ en: 'Yogi Point — Your Lucky Degree', hi: 'योगी बिंदु — आपका शुभ बिंदु', sa: 'योगी बिंदु — आपका शुभ बिंदु' }, locale)}</div>
            </div>
          </div>
          <div className="text-gold-light font-bold text-3xl font-mono mb-1">{kundali.sphutas!.yogiPoint.degree.toFixed(2)}°</div>
          <div className="text-emerald-300 text-sm font-bold mb-2">{signName(kundali.sphutas!.yogiPoint.sign)}</div>
          <div className="text-emerald-400 text-xs font-medium mb-3">
            {tl({ en: `Yogi Planet: ${yogiPlanetName}`, hi: `योगी ग्रह: ${yogiPlanetName}`, sa: `योगी ग्रह: ${yogiPlanetName}` }, locale)}
          </div>
          <div className="text-text-secondary text-xs leading-relaxed">
            {tl({ en: `This is the single most auspicious degree in your entire chart. ${yogiPlanetName} is your Yogi Planet — its dasha/antardasha brings the BEST results in your life. Keep ${yogiPlanetName} strong — wear its gemstone, chant its mantra, make donations on its day. When transiting Jupiter crosses this degree, expect a major positive event — this happens roughly once every 12 years and is your most powerful transit window.`, hi: `यह आपकी कुण्डली का सबसे शुभ बिंदु है। ${yogiPlanetName} आपका योगी ग्रह है — इसकी दशा/अन्तर्दशा में सर्वोत्तम परिणाम मिलते हैं। ${yogiPlanetName} को बलवान रखें — इसका रत्न, मंत्र, या दान करें। जब गोचरी बृहस्पति इस अंश पर आता है, तो जीवन में बड़ी सकारात्मक घटना होती है — यह लगभग हर 12 वर्ष में होता है और आपकी सबसे शक्तिशाली गोचर खिड़की है।`, sa: `यह आपकी कुण्डली का सबसे शुभ बिंदु है। ${yogiPlanetName} आपका योगी ग्रह है — इसकी दशा/अन्तर्दशा में सर्वोत्तम परिणाम मिलते हैं। ${yogiPlanetName} को बलवान रखें — इसका रत्न, मंत्र, या दान करें। जब गोचरी बृहस्पति इस अंश पर आता है, तो जीवन में बड़ी सकारात्मक घटना होती है — यह लगभग हर 12 वर्ष में होता है और आपकी सबसे शक्तिशाली गोचर खिड़की है।` }, locale)}
          </div>
          {sphuataTransitData && (
            <div className="mt-3 space-y-1.5">
              <div className={`flex items-center justify-between rounded-lg px-3 py-1.5 text-xs ${sphuataTransitData.yogiJupiter.isActive ? 'bg-emerald-500/20 border border-emerald-400/30' : 'bg-[#0a0e27]/60 border border-emerald-500/15'}`}>
                <span className="text-emerald-400 font-medium">&#9733; Next Jupiter transit</span>
                <span className={`font-bold ${sphuataTransitData.yogiJupiter.isActive ? 'text-emerald-300 animate-pulse' : 'text-gold-light'}`}>{isHi ? sphuataTransitData.yogiJupiter.labelHi : sphuataTransitData.yogiJupiter.label}</span>
              </div>
              {sphuataTransitData.yogiPlanetTx && (
                <div className={`flex items-center justify-between rounded-lg px-3 py-1.5 text-xs ${sphuataTransitData.yogiPlanetTx.isActive ? 'bg-emerald-500/20 border border-emerald-400/30' : 'bg-[#0a0e27]/60 border border-gold-primary/10'}`}>
                  <span className="text-gold-primary font-medium">&#9670; Next {yogiPlanetName} transit</span>
                  <span className={`font-bold ${sphuataTransitData.yogiPlanetTx.isActive ? 'text-emerald-300 animate-pulse' : 'text-gold-light'}`}>{isHi ? sphuataTransitData.yogiPlanetTx.labelHi : sphuataTransitData.yogiPlanetTx.label}</span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Avayogi Point */}
        <div className="rounded-xl bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 p-5 border border-red-500/20 bg-red-500/5">
          <div className="flex items-center gap-2 mb-3">
            <span className="w-8 h-8 rounded-full bg-red-500/20 flex items-center justify-center text-red-400 text-lg">&#9888;</span>
            <div>
              <div className="text-red-300 text-xs uppercase tracking-widest font-bold">{tl({ en: 'Avayogi Point — Your Challenging Degree', hi: 'अवयोगी बिंदु — आपका चुनौतीपूर्ण बिंदु', sa: 'अवयोगी बिंदु — आपका चुनौतीपूर्ण बिंदु' }, locale)}</div>
            </div>
          </div>
          <div className="text-gold-light font-bold text-3xl font-mono mb-1">{kundali.sphutas!.avayogiPoint.degree.toFixed(2)}°</div>
          <div className="text-red-300 text-sm font-bold mb-2">{signName(kundali.sphutas!.avayogiPoint.sign)}</div>
          <div className="text-red-400 text-xs font-medium mb-3">
            {tl({ en: `Avayogi Planet: ${avayogiPlanetName}`, hi: `अवयोगी ग्रह: ${avayogiPlanetName}`, sa: `अवयोगी ग्रह: ${avayogiPlanetName}` }, locale)}
          </div>
          <div className="text-text-secondary text-xs leading-relaxed">
            {tl({ en: `This is your most challenging degree. ${avayogiPlanetName} is your Avayogi Planet — its dasha may bring obstacles, delays, and setbacks. When Saturn transits this degree, exercise extra caution with major decisions. Remedies: chant the pacification mantra for ${avayogiPlanetName}, donate sesame/oil on Saturdays.`, hi: `यह आपका सबसे चुनौतीपूर्ण बिंदु है। ${avayogiPlanetName} आपका अवयोगी ग्रह है — इसकी दशा में बाधाएँ और विलम्ब आ सकते हैं। जब शनि इस अंश पर गोचर करता है, सावधान रहें। उपाय: ${avayogiPlanetName} के शमन मंत्र, शनिवार को तिल/तेल दान, और इस ग्रह की दशा में अतिरिक्त सावधानी।`, sa: `यह आपका सबसे चुनौतीपूर्ण बिंदु है। ${avayogiPlanetName} आपका अवयोगी ग्रह है — इसकी दशा में बाधाएँ और विलम्ब आ सकते हैं। जब शनि इस अंश पर गोचर करता है, सावधान रहें। उपाय: ${avayogiPlanetName} के शमन मंत्र, शनिवार को तिल/तेल दान, और इस ग्रह की दशा में अतिरिक्त सावधानी।` }, locale)}
          </div>
          {sphuataTransitData && (
            <div className="mt-3 space-y-1.5">
              <div className={`flex items-center justify-between rounded-lg px-3 py-1.5 text-xs ${sphuataTransitData.avayogiSaturn.isActive ? 'bg-red-500/20 border border-red-400/30' : 'bg-[#0a0e27]/60 border border-red-500/15'}`}>
                <span className="text-red-400 font-medium">&#9888; Next Saturn transit</span>
                <span className={`font-bold ${sphuataTransitData.avayogiSaturn.isActive ? 'text-red-300 animate-pulse' : 'text-gold-light'}`}>{isHi ? sphuataTransitData.avayogiSaturn.labelHi : sphuataTransitData.avayogiSaturn.label}</span>
              </div>
              {sphuataTransitData.avayogiPlanTx && (
                <div className={`flex items-center justify-between rounded-lg px-3 py-1.5 text-xs ${sphuataTransitData.avayogiPlanTx.isActive ? 'bg-red-500/20 border border-red-400/30' : 'bg-[#0a0e27]/60 border border-red-500/10'}`}>
                  <span className="text-red-300/80 font-medium">&#9888; Next {avayogiPlanetName} transit</span>
                  <span className={`font-bold ${sphuataTransitData.avayogiPlanTx.isActive ? 'text-red-300 animate-pulse' : 'text-gold-light'}`}>{isHi ? sphuataTransitData.avayogiPlanTx.labelHi : sphuataTransitData.avayogiPlanTx.label}</span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* CONSTITUTIONAL SPHUTAS */}
      <div>
        <h4 className="text-gold-light text-sm font-bold mb-3 text-center" style={headingFont}>
          {tl({ en: 'Constitutional Sphutas — Your Nature', hi: 'शारीरिक संरचना स्फुट — आपकी प्रकृति', sa: 'शारीरिक संरचना स्फुट — आपकी प्रकृति' }, locale)}
        </h4>
        <p className="text-text-secondary text-xs text-center mb-4 max-w-2xl mx-auto">
          {tl({ en: 'These points describe your physical and vital constitution. They are used in medical astrology (Ayurvedic analysis) and longevity assessment. The sign and nakshatra where each falls indicates the quality of that life dimension.', hi: 'ये बिंदु आपकी शारीरिक और प्राणिक संरचना को दर्शाते हैं। ये चिकित्सा ज्योतिष और आयुर्वेदिक विश्लेषण में प्रयुक्त होते हैं।', sa: 'ये बिंदु आपकी शारीरिक और प्राणिक संरचना को दर्शाते हैं। ये चिकित्सा ज्योतिष और आयुर्वेदिक विश्लेषण में प्रयुक्त होते हैं।' }, locale)}
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {([
            { data: kundali.sphutas!.pranaSphuta, label: tl({ en: 'Prana Sphuta', hi: 'प्राण स्फुट', sa: 'प्राण स्फुट' }, locale), sublabel: tl({ en: 'Vitality & Life Force', hi: 'जीवन शक्ति', sa: 'जीवन शक्ति' }, locale), color: 'border-gold-primary/20', icon: '&#9829;', txKey: 'prana' as const,
              explain: tl({ en: 'Your overall vitality and energy level. Computed from Sun + Moon + Lagna. A benefic sign/nakshatra = strong life force, good health, resilience. A malefic placement = watch your energy levels, prioritize rest.', hi: 'आपकी समग्र जीवन शक्ति और ऊर्जा स्तर। सूर्य + चन्द्र + लग्न से गणित। शुभ राशि/नक्षत्र = प्रबल जीवनशक्ति, अच्छा स्वास्थ्य।', sa: 'आपकी समग्र जीवन शक्ति और ऊर्जा स्तर। सूर्य + चन्द्र + लग्न से गणित। शुभ राशि/नक्षत्र = प्रबल जीवनशक्ति, अच्छा स्वास्थ्य।' }, locale) },
            { data: kundali.sphutas!.dehaSphuta, label: tl({ en: 'Deha Sphuta', hi: 'देह स्फुट', sa: 'देह स्फुट' }, locale), sublabel: tl({ en: 'Physical Body', hi: 'शारीरिक संरचना', sa: 'शारीरिक संरचना' }, locale), color: 'border-blue-500/20', icon: '&#9775;', txKey: 'deha' as const,
              explain: tl({ en: 'Your physical constitution and body type. This indicates your natural build. Fire/Earth signs = strong, muscular frame. Air/Water = lighter, more flexible. The nakshatra adds specifics about health tendencies.', hi: 'आपकी शारीरिक संरचना और काया। यह बताता है कि आपका शरीर किस प्रकार का है। अग्नि/पृथ्वी राशि = मजबूत, मांसल। वायु/जल = हल्का, लचीला।', sa: 'आपकी शारीरिक संरचना और काया। यह बताता है कि आपका शरीर किस प्रकार का है। अग्नि/पृथ्वी राशि = मजबूत, मांसल। वायु/जल = हल्का, लचीला।' }, locale) },
            { data: kundali.sphutas!.mrityuSphuta, label: tl({ en: 'Mrityu Sphuta', hi: 'मृत्यु स्फुट', sa: 'मृत्यु स्फुट' }, locale), sublabel: tl({ en: 'Longevity Indicator', hi: 'दीर्घायु सूचक', sa: 'दीर्घायु सूचक' }, locale), color: 'border-violet-500/20', icon: '&#8734;', txKey: 'mrityu' as const,
              explain: tl({ en: 'Indicator of longevity and health vulnerability. This does NOT predict death — it shows which body areas need attention. When transit planets (especially Saturn or Mars) cross this degree, pay extra attention to health. The sign indicates the body part: Aries=head, Taurus=throat, etc.', hi: 'दीर्घायु और स्वास्थ्य जोखिम का सूचक। यह "मृत्यु" का भविष्यवाणी नहीं करता — यह दर्शाता है कि शरीर के कौन से क्षेत्र ध्यान माँगते हैं। जब गोचर ग्रह इस अंश पर आते हैं, स्वास्थ्य पर ध्यान दें।', sa: 'दीर्घायु और स्वास्थ्य जोखिम का सूचक। यह "मृत्यु" का भविष्यवाणी नहीं करता — यह दर्शाता है कि शरीर के कौन से क्षेत्र ध्यान माँगते हैं। जब गोचर ग्रह इस अंश पर आते हैं, स्वास्थ्य पर ध्यान दें।' }, locale) },
            { data: kundali.sphutas!.triSphuta, label: tl({ en: 'Tri Sphuta', hi: 'त्रि स्फुट', sa: 'त्रि स्फुट' }, locale), sublabel: tl({ en: 'Composite Indicator', hi: 'समग्र संकेतक', sa: 'समग्र संकेतक' }, locale), color: 'border-amber-500/20', icon: '&#9651;', txKey: 'tri' as const,
              explain: tl({ en: 'Composite of all three sphutas (Prana + Deha + Mrityu). This gives a single-point summary of your overall physical-vital condition. Its sign/nakshatra placement summarizes your constitutional strength.', hi: 'तीनों स्फुटों (प्राण + देह + मृत्यु) का संयुक्त बिंदु। यह आपकी समग्र शारीरिक-प्राणिक स्थिति का एकल सूचक है।', sa: 'तीनों स्फुटों (प्राण + देह + मृत्यु) का संयुक्त बिंदु। यह आपकी समग्र शारीरिक-प्राणिक स्थिति का एकल सूचक है।' }, locale) },
          ] as const).map(({ data, label, sublabel, color, icon, explain, txKey }) => {
            const txInfo = sphuataTransitData ? (
              txKey === 'prana' ? { primary: sphuataTransitData.pranaSun, primaryLabel: 'Next Sun transit', secondary: sphuataTransitData.pranaJupiter, secondaryLabel: 'Next Jupiter transit' } :
              txKey === 'deha'  ? { primary: sphuataTransitData.dehaMoon, primaryLabel: 'Next Moon transit', secondary: sphuataTransitData.dehaSaturn, secondaryLabel: 'Next Saturn transit' } :
              txKey === 'mrityu'? { primary: sphuataTransitData.mrityuSaturn, primaryLabel: 'Next Saturn transit', secondary: sphuataTransitData.mrityuMars, secondaryLabel: 'Next Mars transit' } :
              /* tri */          { primary: sphuataTransitData.triSun, primaryLabel: 'Next Sun transit', secondary: null, secondaryLabel: '' }
            ) : null;
            const txPrimaryLabels: Record<string,'Next Sun transit'|'Next Moon transit'|'Next Saturn transit'> = { prana:'Next Sun transit',deha:'Next Moon transit',mrityu:'Next Saturn transit',tri:'Next Sun transit' };
            return (
            <div key={label} className={`rounded-xl bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 p-4 border ${color}`}>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-gold-primary text-lg" dangerouslySetInnerHTML={{ __html: icon }} />
                <div>
                  <div className="text-gold-light text-sm font-bold">{label}</div>
                  <div className="text-text-secondary/75 text-xs">{sublabel}</div>
                </div>
              </div>
              <div className="flex items-baseline gap-2 mb-2">
                <span className="text-gold-light font-bold text-xl font-mono">{data.degree.toFixed(2)}°</span>
                <span className="text-text-secondary text-xs">{signName(data.sign)}</span>
              </div>
              <p className="text-text-secondary text-xs leading-relaxed mb-3">{explain}</p>
              {txInfo && (
                <div className="space-y-1">
                  <div className={`flex items-center justify-between rounded-md px-2.5 py-1 text-xs ${txInfo.primary.isActive ? 'bg-emerald-500/15 border border-emerald-400/20' : 'bg-[#0a0e27]/60 border border-gold-primary/8'}`}>
                    <span className="text-text-secondary/70">{isHi ? txPrimaryLabels[txKey].replace('Sun','सूर्य').replace('Moon','चन्द्र').replace('Saturn','शनि') : txInfo.primaryLabel}</span>
                    <span className={`font-bold ml-2 ${txInfo.primary.isActive ? 'text-emerald-300' : 'text-gold-light'}`}>{isHi ? txInfo.primary.labelHi : txInfo.primary.label}</span>
                  </div>
                  {txInfo.secondary && (
                    <div className={`flex items-center justify-between rounded-md px-2.5 py-1 text-xs ${txInfo.secondary.isActive ? (txKey==='mrityu'?'bg-red-500/15 border border-red-400/20':'bg-emerald-500/15 border border-emerald-400/20') : 'bg-[#0a0e27]/60 border border-gold-primary/8'}`}>
                      <span className="text-text-secondary/70">{isHi ? txInfo.secondaryLabel.replace('Next Jupiter transit','अगला बृहस्पति गोचर').replace('Next Saturn transit','अगला शनि गोचर').replace('Next Mars transit','अगला मंगल गोचर') : txInfo.secondaryLabel}</span>
                      <span className={`font-bold ml-2 ${txInfo.secondary.isActive ? (txKey==='mrityu'?'text-red-300':'text-emerald-300') : 'text-gold-light'}`}>{isHi ? txInfo.secondary.labelHi : txInfo.secondary.label}</span>
                    </div>
                  )}
                </div>
              )}
            </div>
            );
          })}
        </div>
      </div>

      {/* Bija/Kshetra */}
      {(kundali.sphutas!.bijaSphuta || kundali.sphutas!.kshetraSphuta) && (
        <div>
          <h4 className="text-gold-light text-sm font-bold mb-3 text-center" style={headingFont}>
            {tl({ en: 'Fertility Sphutas', hi: 'प्रजनन स्फुट', sa: 'प्रजनकस्फुटानि' }, locale)}
          </h4>
          <p className="text-text-secondary text-xs text-center mb-4 max-w-xl mx-auto">
            {tl({ en: 'These points assess fertility and progeny potential. Odd signs and benefic nakshatras = favorable. Used alongside 5th house and Jupiter analysis for childbirth timing.', hi: 'ये बिंदु प्रजनन क्षमता और सन्तान योग का आकलन करते हैं। विषम राशि/नक्षत्र = अनुकूल।', sa: 'ये बिंदु प्रजनन क्षमता और सन्तान योग का आकलन करते हैं। विषम राशि/नक्षत्र = अनुकूल।' }, locale)}
          </p>
          <div className="grid grid-cols-2 gap-3">
            {kundali.sphutas!.bijaSphuta && (
              <div className="rounded-xl bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 p-4 border border-blue-500/15">
                <div className="text-blue-300 text-xs uppercase tracking-widest font-bold mb-1">{tl({ en: 'Bija Sphuta (Male Fertility)', hi: 'बीज स्फुट (पुरुष प्रजनन)', sa: 'बीज स्फुट (पुरुष प्रजनन)' }, locale)}</div>
                <div className="text-gold-light font-bold text-xl font-mono">{kundali.sphutas!.bijaSphuta.degree.toFixed(2)}°</div>
                <div className="text-text-secondary text-xs mt-1">{signName(kundali.sphutas!.bijaSphuta.sign)}</div>
                <p className="text-text-secondary/70 text-xs mt-2 leading-relaxed">
                  {tl({ en: 'Computed from Sun + Venus + Jupiter. Odd sign + benefic nakshatra = strong male fertility factor.', hi: 'सूर्य + शुक्र + बृहस्पति से गणित। विषम राशि और शुभ नक्षत्र = बलवान।', sa: 'सूर्य + शुक्र + बृहस्पति से गणित। विषम राशि और शुभ नक्षत्र = बलवान।' }, locale)}
                </p>
                {sphuataTransitData?.bijaJupiter && (
                  <div className={`mt-2 flex items-center justify-between rounded-md px-2 py-1 text-xs ${sphuataTransitData.bijaJupiter.isActive ? 'bg-emerald-500/15 border border-emerald-400/20' : 'bg-[#0a0e27]/60 border border-blue-500/10'}`}>
                    <span className="text-text-secondary/70">{tl({ en: 'Next Jupiter', hi: 'अगला बृहस्पति', sa: 'अगला बृहस्पति' }, locale)}</span>
                    <span className={`font-bold ${sphuataTransitData.bijaJupiter.isActive ? 'text-emerald-300' : 'text-gold-light'}`}>{isHi ? sphuataTransitData.bijaJupiter.labelHi : sphuataTransitData.bijaJupiter.label}</span>
                  </div>
                )}
              </div>
            )}
            {kundali.sphutas!.kshetraSphuta && (
              <div className="rounded-xl bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 p-4 border border-pink-500/15">
                <div className="text-pink-300 text-xs uppercase tracking-widest font-bold mb-1">{tl({ en: 'Kshetra Sphuta (Female Fertility)', hi: 'क्षेत्र स्फुट (स्त्री प्रजनन)', sa: 'क्षेत्र स्फुट (स्त्री प्रजनन)' }, locale)}</div>
                <div className="text-gold-light font-bold text-xl font-mono">{kundali.sphutas!.kshetraSphuta.degree.toFixed(2)}°</div>
                <div className="text-text-secondary text-xs mt-1">{signName(kundali.sphutas!.kshetraSphuta.sign)}</div>
                <p className="text-text-secondary/70 text-xs mt-2 leading-relaxed">
                  {tl({ en: 'Computed from Moon + Mars + Jupiter. Even sign + benefic nakshatra = strong female fertility factor.', hi: 'चन्द्र + मंगल + बृहस्पति से गणित। सम राशि और शुभ नक्षत्र = बलवान।', sa: 'चन्द्र + मंगल + बृहस्पति से गणित। सम राशि और शुभ नक्षत्र = बलवान।' }, locale)}
                </p>
                {sphuataTransitData?.kshetraJupiter && (
                  <div className={`mt-2 flex items-center justify-between rounded-md px-2 py-1 text-xs ${sphuataTransitData.kshetraJupiter.isActive ? 'bg-emerald-500/15 border border-emerald-400/20' : 'bg-[#0a0e27]/60 border border-pink-500/10'}`}>
                    <span className="text-text-secondary/70">{tl({ en: 'Next Jupiter', hi: 'अगला बृहस्पति', sa: 'अगला बृहस्पति' }, locale)}</span>
                    <span className={`font-bold ${sphuataTransitData.kshetraJupiter.isActive ? 'text-emerald-300' : 'text-gold-light'}`}>{isHi ? sphuataTransitData.kshetraJupiter.labelHi : sphuataTransitData.kshetraJupiter.label}</span>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* JYOTISH-13: Bhrigu Chakra Paddhati (Annual House Activation) */}
      {(() => {
        const jupNatal = kundali.planets.find(p => p.planet.id === 4);
        if (!jupNatal) return null;
        const jupNatalHouse = jupNatal.house;
        const isHiBCP = isDevanagariLocale(locale);
        const currentAge = kundali.birthData.date
          ? Math.floor((new Date().getTime() - new Date(kundali.birthData.date).getTime()) / (365.25 * 24 * 3600 * 1000))
          : null;
        const bcpHouse = currentAge !== null ? ((jupNatalHouse - 1 + currentAge) % 12) + 1 : null;
        const upcoming = Array.from({ length: 10 }, (_, i) => {
          const age = (currentAge ?? 0) + i;
          const house = ((jupNatalHouse - 1 + age) % 12) + 1;
          return { age, house };
        });

        return (
          <div className="rounded-2xl bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-amber-500/20 p-5">
            <h4 className="text-amber-300 text-xs uppercase tracking-widest font-bold mb-1">
              {isHiBCP ? 'भृगु चक्र पद्धति — वार्षिक भाव सक्रियण' : 'Bhrigu Chakra Paddhati — Annual House Activation'}
            </h4>
            <p className="text-text-secondary/70 text-xs mb-4" style={isDevanagari ? { fontFamily: 'var(--font-devanagari-body)' } : undefined}>
              {isHiBCP
                ? `आयु के अनुसार जन्म के बृहस्पति (भाव ${jupNatalHouse}) से गिनकर सक्रिय भाव। स्रोत: उत्तर कालामृत / नाडी परम्परा`
                : `Jupiter's natal house (${jupNatalHouse}H) advances one house per year of life — reveals the activated life theme for each year. Source: Uttara Kalamrita / Nadi tradition`}
            </p>
            {bcpHouse && currentAge !== null && (
              <div className="rounded-xl bg-amber-500/10 border border-amber-500/25 p-4 mb-4">
                <div className="flex items-center gap-3">
                  <div className="text-amber-300 font-bold text-3xl font-mono">{bcpHouse}</div>
                  <div>
                    <div className="text-amber-200 font-semibold text-sm" style={headingFont}>
                      {isHiBCP ? `इस वर्ष (आयु ${currentAge}) — भाव ${bcpHouse} सक्रिय` : `This Year (Age ${currentAge}) — House ${bcpHouse} Activated`}
                    </div>
                    <div className="text-text-secondary/70 text-xs mt-0.5" style={isDevanagari ? { fontFamily: 'var(--font-devanagari-body)' } : undefined}>
                      {isHiBCP ? HOUSE_THEMES[bcpHouse]?.hi : HOUSE_THEMES[bcpHouse]?.en}
                    </div>
                  </div>
                </div>
              </div>
            )}
            {/* 10-year timeline */}
            <div className="grid grid-cols-2 sm:grid-cols-5 md:grid-cols-10 gap-1.5">
              {upcoming.map(({ age, house }, i) => (
                <div key={i} className={`rounded-lg p-2 text-center ${i === 0 ? 'bg-amber-500/20 border border-amber-500/40' : 'bg-bg-primary/30 border border-gold-primary/8'}`}>
                  <div className={`font-bold text-sm ${i === 0 ? 'text-amber-300' : 'text-gold-primary/60'}`}>{house}H</div>
                  <div className="text-text-secondary/65 text-xs">{isHiBCP ? `आयु ${age}` : `Age ${age}`}</div>
                </div>
              ))}
            </div>
            <p className="text-text-secondary/65 text-xs mt-3 text-center" style={isDevanagari ? { fontFamily: 'var(--font-devanagari-body)' } : undefined}>
              {isHiBCP ? `जन्म बृहस्पति: भाव ${jupNatalHouse}` : `Natal Jupiter: House ${jupNatalHouse} — the starting point of the cycle`}
            </p>
          </div>
        );
      })()}

      {/* Bhrigu Bindu -- midpoint of Rahu and Moon */}
      {kundali.bhriguBindu && (
        <div className="rounded-xl bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-purple-500/20 p-5">
          <div className="text-purple-300 text-xs uppercase tracking-widest font-bold mb-2">
            {tl({ en: 'Bhrigu Bindu (Uttara Kalamrita)', hi: 'भृगु बिंदु (Uttara Kalamrita)', sa: 'भृगु बिंदु (Uttara Kalamrita)' }, locale)}
          </div>
          <div className="flex items-center gap-4 mb-3">
            <div>
              <span className="text-gold-light font-bold text-2xl font-mono">{kundali.bhriguBindu.degree}</span>
              <span className="text-purple-300 text-sm ml-2">{signName(kundali.bhriguBindu.sign)}</span>
            </div>
            <div className="text-text-secondary text-xs">{kundali.bhriguBindu.longitude.toFixed(2)}°</div>
          </div>
          <p className="text-text-secondary/80 text-xs leading-relaxed">
            {tl({ en: 'Midpoint of natal Rahu and Moon — the most sensitive accumulation point in your chart. Jupiter transiting within 5° of Bhrigu Bindu triggers major positive events. Saturn transiting this point brings a challenge period requiring discipline and patience.', hi: 'भृगु बिंदु = राहु और चन्द्र का मध्यबिंदु। यह आपके जीवन का सर्वाधिक संवेदनशील बिंदु है। जब बृहस्पति इस बिंदु से गुजरे, बड़ी शुभ घटनाएँ होती हैं। शनि का गोचर चुनौती लाता है।', sa: 'भृगु बिंदु = राहु और चन्द्र का मध्यबिंदु। यह आपके जीवन का सर्वाधिक संवेदनशील बिंदु है। जब बृहस्पति इस बिंदु से गुजरे, बड़ी शुभ घटनाएँ होती हैं। शनि का गोचर चुनौती लाता है।' }, locale)}
          </p>
        </div>
      )}

      {/* P2-01: Pindayu Longevity Calculation */}
      {(() => {
        // BPHS Ch. 44-45: Pindayu — each planet contributes years based on degree in D1
        // Base years: Su=19, Mo=25, Ma=15, Me=12, Ju=15, Ve=21, Sa=20 (+ Rahu/Ketu inherit lord)
        const PINDAYU_BASE: Record<number, number> = { 0:19, 1:25, 2:15, 3:12, 4:15, 5:21, 6:20, 7:0, 8:0 };
        const PLANET_NAMES = { en: ['Sun','Moon','Mars','Mercury','Jupiter','Venus','Saturn'], hi: ['सूर्य','चन्द्र','मंगल','बुध','गुरु','शुक्र','शनि'] };
        // Each planet gives proportion of base years = (degree in sign / 30) x base
        // Reduce for: retrogression (/2), combustion (reduce by 25%), debilitation
        const DEBILITATED_SIGNS: Record<number, number> = { 0:7, 1:8, 2:4, 3:6, 4:10, 5:6, 6:1 };
        const COMBUST_RANGE: Record<number, number> = { 1:12, 2:17, 3:14, 4:11, 5:10, 6:15 };

        const sunLongAbs = kundali.planets.find(p => p.planet.id === 0)?.longitude ?? 0;

        const contributions = [0,1,2,3,4,5,6].map(pid => {
          const planet = kundali.planets.find(p => p.planet.id === pid);
          if (!planet) return null;
          const base = PINDAYU_BASE[pid];
          const degInSign = planet.longitude % 30;
          let years = (degInSign / 30) * base;
          // Retrograde: divide by 2
          if (planet.isRetrograde) years *= 0.5;
          // Debilitation: reduce by 25%
          if (DEBILITATED_SIGNS[pid] === planet.sign) years *= 0.75;
          // Combustion: within COMBUST_RANGE of Sun (except Sun itself)
          if (pid > 0 && pid <= 6) {
            const diff = Math.abs(planet.longitude - sunLongAbs) % 360;
            const minDiff = diff > 180 ? 360 - diff : diff;
            if (minDiff <= (COMBUST_RANGE[pid] ?? 10)) years *= 0.75;
          }
          return { pid, years: Math.round(years * 10) / 10, planet };
        }).filter(Boolean) as { pid: number; years: number; planet: typeof kundali.planets[0] }[];

        const totalPindayu = Math.round(contributions.reduce((sum, c) => sum + c.years, 0));
        // Rough range: +/-20% for life uncertainties
        const lo = Math.max(0, Math.round(totalPindayu * 0.8));
        const hi2 = Math.round(totalPindayu * 1.2);

        return (
          <div className="rounded-xl bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-purple-500/20 p-5">
            <h4 className="text-purple-300 text-xs uppercase tracking-widest font-bold mb-1">
              {tl({ en: 'Pindayu — Constitutional Longevity Indicators (BPHS Ch. 44-45)', hi: 'पिण्डायु — संवैधानिक दीर्घायु संकेतक (BPHS अ. 44-45)', sa: 'पिण्डायु — संवैधानिक दीर्घायु संकेतक (BPHS अ. 44-45)' }, locale)}
            </h4>
            <p className="text-text-secondary/70 text-xs mb-4" style={isHi ? { fontFamily: 'var(--font-devanagari-body)' } : undefined}>
              {tl({ en: 'Each planet contributes base years × degree proportion. Reduced for retrogression, combustion, and debilitation. This is NOT death prediction — it indicates constitutional vitality and life force quality.', hi: 'प्रत्येक ग्रह आधार वर्ष × राशि में अंश देता है। वक्री, अस्त, और नीच होने पर कम होता है। यह मृत्यु की भविष्यवाणी नहीं — संवैधानिक शक्ति का संकेत है।', sa: 'प्रत्येक ग्रह आधार वर्ष × राशि में अंश देता है। वक्री, अस्त, और नीच होने पर कम होता है। यह मृत्यु की भविष्यवाणी नहीं — संवैधानिक शक्ति का संकेत है।' }, locale)}
            </p>
            <div className="rounded-xl bg-purple-500/10 border border-purple-500/25 p-4 mb-4 text-center">
              <div className="text-purple-200 font-bold text-3xl font-mono">{lo}–{hi2}</div>
              <div className="text-text-secondary/75 text-xs mt-1">{tl({ en: 'years (estimated constitutional range)', hi: 'वर्ष (अनुमानित सीमा)', sa: 'वर्ष (अनुमानित सीमा)' }, locale)}</div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-1.5">
              {contributions.map(c => (
                <div key={c.pid} className="rounded-lg bg-bg-primary/30 border border-purple-500/10 p-2 text-center">
                  <div className="text-gold-primary/60 text-xs font-bold">{PLANET_NAMES[tl({ en: 'en', hi: 'hi', sa: 'hi' }, locale) as keyof typeof PLANET_NAMES][c.pid]}</div>
                  <div className="text-purple-300 font-mono text-sm font-bold">{c.years}y</div>
                  {c.planet.isRetrograde && <div className="text-amber-400 text-xs">(R)</div>}
                </div>
              ))}
            </div>
          </div>
        );
      })()}

      {/* P2-11: Pushkar Navamsha + Pushkar Bhaga Details */}
      {(() => {
        const PUSHKAR_BHAGA_DEGREES: Record<number, number> = {
          1:14, 2:28, 3:7, 4:12, 5:13, 6:23,
          7:8,  8:18, 9:9, 10:22, 11:17, 12:17,
        };
        // P2-11: Per-planet PKN profiles (Saravali tradition)
        const PKN_PROFILES: Record<number, LocaleText> = {
          0: { en: 'Sun in PKN — Authority and recognition arrive with grace. Career advancement and government support are unobstructed. Father\'s blessings are active. Soul\'s dharmic purpose is clearly supported; fame through righteous leadership. Even if Sun is debilitated, the PKN protects its significations.', hi: 'सूर्य पुष्कर नवांश में — अधिकार और मान्यता सहजता से प्राप्त। कैरियर और सरकारी सहायता निर्बाध। पिता का आशीर्वाद सक्रिय। आत्मा का धर्म स्पष्ट रूप से समर्थित; धर्मी नेतृत्व से यश।' },
          1: { en: 'Moon in PKN — Emotional life is rich, stable, and fulfilling. Exceptional intuition and psychic clarity. Mother is a source of blessing and support. Public life, popularity, and goodwill come naturally. Mind remains calm even in adversity. A muhurta Moon in PKN is deeply auspicious.', hi: 'चन्द्र पुष्कर नवांश में — भावनात्मक जीवन समृद्ध, स्थिर और संतोषजनक। असाधारण अंतर्ज्ञान। माता का आशीर्वाद। जनता में लोकप्रियता स्वाभाविक। विपरीत परिस्थितियों में भी मन शांत।', sa: 'चन्द्रः पुष्करनवांशे — भावनात्मकं जीवनं समृद्धम्, स्थिरं सन्तोषजनकं च। असाधारणम् अन्तर्ज्ञानम्। मातुः आशीर्वादः। जनेषु लोकप्रियता स्वाभाविकी। विपरीतपरिस्थितिषु अपि मनः शान्तम्।', mai: 'चन्द्र पुष्कर नवांश मे — भावनात्मक जीवन समृद्ध, स्थिर आ संतोषजनक। असाधारण अंतर्ज्ञान। माताक आशीर्वाद। जनता मे लोकप्रियता स्वाभाविक। विपरीत परिस्थिति मे सेहो मन शांत।', mr: 'चंद्र पुष्कर नवांशात — भावनिक जीवन समृद्ध, स्थिर आणि समाधानकारक। असाधारण अंतर्ज्ञान। आईचा आशीर्वाद। जनतेत लोकप्रियता सहज। विपरीत परिस्थितीतही मन शांत।', ta: 'PKN இல் சந்திரன் — உணர்ச்சி வாழ்க்கை வளமான, நிலையான மற்றும் நிறைவான. விதிவிலக்கான உள்ளுணர்வு மற்றும் அமானுஷ்ய தெளிவு. தாய் ஆசீர்வாதத்தின் ஆதாரம். பொது வாழ்க்கை, பிரபலம் மற்றும் நல்லெண்ணம் இயல்பாகவே வரும். கடினமான நேரத்திலும் மனம் அமைதியாக இருக்கும்.', te: 'PKN లో చంద్రుడు — భావోద్వేగ జీవితం సమృద్ధిగా, స్థిరంగా మరియు సంతృప్తికరంగా ఉంటుంది. అసాధారణ అంతర్దృష్టి. తల్లి ఆశీర్వాదం యొక్క మూలం. ప్రజా జీవితం, జనాదరణ సహజంగా వస్తాయి. కష్టాల్లో కూడా మనస్సు ప్రశాంతంగా ఉంటుంది.', bn: 'PKN এ চন্দ্র — আবেগজ জীবন সমৃদ্ধ, স্থিতিশীল ও পরিপূর্ণ। ব্যতিক্রমী অন্তর্জ্ঞান। মা আশীর্বাদের উৎস। জনজীবন, জনপ্রিয়তা স্বাভাবিকভাবে আসে। প্রতিকূলতায়ও মন শান্ত থাকে।', kn: 'PKN ನಲ್ಲಿ ಚಂದ್ರ — ಭಾವನಾತ್ಮಕ ಜೀವನ ಶ್ರೀಮಂತ, ಸ್ಥಿರ ಮತ್ತು ತೃಪ್ತಿಕರ. ಅಸಾಧಾರಣ ಅಂತಃಪ್ರಜ್ಞೆ. ತಾಯಿ ಆಶೀರ್ವಾದದ ಮೂಲ. ಸಾರ್ವಜನಿಕ ಜೀವನ, ಜನಪ್ರಿಯತೆ ಸ್ವಾಭಾವಿಕ. ಪ್ರತಿಕೂಲತೆಯಲ್ಲೂ ಮನಸ್ಸು ಶಾಂತ.', gu: 'PKN માં ચંદ્ર — ભાવનાત્મક જીવન સમૃદ્ધ, સ્થિર અને સંતોષકારક. અસાધારણ અંતર્જ્ઞાન. માતા આશીર્વાદનો સ્ત્રોત. જાહેર જીવન, લોકપ્રિયતા કુદરતી રીતે આવે. વિપરીત સ્થિતિમાં પણ મન શાંત.' },
          2: { en: 'Mars in PKN — Courage becomes righteous — decisive action without destructive recklessness. Land, property, and sibling matters are protected and favourable. If surgery is needed, outcomes are positive. Competitive victories follow. Physical vitality and stamina are amplified by the PKN\'s grace.', hi: 'मंगल पुष्कर नवांश में — साहस धर्मी बनता है — विनाशकारी उतावलेपन के बिना। भूमि, सम्पत्ति, भाई-बहन के मामले अनुकूल। शल्य चिकित्सा के परिणाम सकारात्मक। प्रतिस्पर्धी जीत। शारीरिक जीवनी बढ़ती है।' },
          3: { en: 'Mercury in PKN — Intellectual gifts bloom fully; communication is eloquent and persuasive. Business and trade reach their highest potential. Writing, publishing, and teaching bring recognition and wealth. Wit and analytical intelligence serve every life domain. Education attains excellent fruition.', hi: 'बुध पुष्कर नवांश में — बौद्धिक प्रतिभा पूर्णतः खिलती है; वाणी वाग्मी और प्रभावशाली। व्यापार और वाणिज्य अपनी ऊंचाई पर। लेखन, शिक्षण से यश और धन। बुद्धि और विश्लेषणात्मक क्षमता हर क्षेत्र में सेवा करती है।', sa: 'बुधः पुष्करनवांशे — बौद्धिकप्रतिभा पूर्णतः विकसते; वाणी वाग्मिनी प्रभावशालिनी च। वाणिज्यं स्वोच्चे। लेखनं, शिक्षणं यशः धनं च ददाति।', mai: 'बुध पुष्कर नवांश मे — बौद्धिक प्रतिभा पूर्णतः खिलैत अछि; वाणी वाग्मी आ प्रभावशाली। व्यापार आ वाणिज्य अपन ऊंचाई पर। लेखन, शिक्षण सँ यश आ धन।', mr: 'बुध पुष्कर नवांशात — बौद्धिक प्रतिभा पूर्णपणे फुलते; वाणी वक्तृत्वशील आणि प्रभावी। व्यापार आणि वाणिज्य उच्चांकावर। लेखन, शिक्षणातून यश आणि धन।', ta: 'PKN இல் புதன் — அறிவுசார் திறன்கள் முழுமையாக மலர்கின்றன; தகவல்தொடர்பு வாக்கின்ப மற்றும் நம்பிக்கையூட்டும். வணிகம் மற்றும் வர்த்தகம் உச்ச சாத்தியத்தை எட்டும். எழுத்து, வெளியீடு மற்றும் கற்பித்தல் அங்கீகாரமும் செல்வமும் தரும்.', te: 'PKN లో బుధుడు — బౌద్ధిక బహుమతులు పూర్తిగా వికసిస్తాయి; సంభాషణ అలంకారికంగా మరియు ఒప్పించేలా ఉంటుంది. వ్యాపారం అత్యున్నత సామర్థ్యాన్ని చేరుకుంటుంది. రాయడం, ప్రచురణ, బోధన గుర్తింపు మరియు సంపదను తెస్తాయి.', bn: 'PKN এ বুধ — বৌদ্ধিক প্রতিভা পূর্ণরূপে বিকশিত; যোগাযোগ বাগ্মী ও প্ররোচনামূলক। ব্যবসা ও বাণিজ্য সর্বোচ্চ সম্ভাবনায় পৌঁছায়। লেখা, প্রকাশনা, শিক্ষাদান স্বীকৃতি ও সম্পদ আনে।', kn: 'PKN ನಲ್ಲಿ ಬುಧ — ಬೌದ್ಧಿಕ ವರಗಳು ಪೂರ್ಣವಾಗಿ ಅರಳುತ್ತವೆ; ಸಂವಹನ ವಾಗ್ಮಿ ಮತ್ತು ಮನವೊಲಿಸುವಂತಿರುತ್ತದೆ. ವ್ಯಾಪಾರ ಅತ್ಯುನ್ನತ ಸಾಮರ್ಥ್ಯ ತಲುಪುತ್ತದೆ. ಬರವಣಿಗೆ, ಪ್ರಕಟಣೆ, ಬೋಧನೆ ಮನ್ನಣೆ ಮತ್ತು ಸಂಪತ್ತು ತರುತ್ತವೆ.', gu: 'PKN માં બુધ — બૌદ્ધિક ભેટો સંપૂર્ણ રીતે ખીલે; સંવાદ વાકપટુ અને પ્રેરક. વ્યાપાર સર્વોચ્ચ સંભાવના સુધી પહોંચે. લેખન, પ્રકાશન, શિક્ષણ માન્યતા અને સંપત્તિ લાવે.' },
          4: { en: 'Jupiter in PKN — The highest of all PKN blessings. Wisdom, spiritual growth, and prosperity are enormously amplified. Children are joyful and carry forward blessings. Financial gains through dharmic channels. Guru\'s grace is overwhelmingly strong; spiritual progress is swift. The entire chart benefits from Jupiter in PKN.', hi: 'बृहस्पति पुष्कर नवांश में — सर्वोच्च पुष्कर आशीर्वाद। ज्ञान, आध्यात्मिक विकास और समृद्धि अत्यधिक बढ़ती है। संतान आनंदमय। धर्मी मार्ग से धनलाभ। गुरु कृपा अत्यंत बलवान। पूरी कुंडली इससे लाभान्वित होती है।' },
          5: { en: 'Venus in PKN — Love and partnership reach their fullest, most beautiful expression. Artistic genius emerges naturally — music, poetry, visual arts. Marriage is harmonious; the spouse is gifted. Luxury, aesthetic pleasure, and beauty are fully enjoyed. Social grace attracts abundance and goodwill from all directions.', hi: 'शुक्र पुष्कर नवांश में — प्रेम और साझेदारी अपनी परिपूर्णता पर। कलात्मक प्रतिभा स्वाभाविक रूप से उभरती है। विवाह सौहार्दपूर्ण; जीवनसाथी प्रतिभाशाली। विलासिता और सौंदर्य पूर्णतः भोगे जाते हैं। सामाजिक आकर्षण प्रचुरता लाता है।', sa: 'शुक्रः पुष्करनवांशे — प्रेमः साझेदारी च परिपूर्णतायाम्। कलात्मकप्रतिभा स्वाभाविकतया उद्भवति। विवाहः सौहार्दपूर्णः; जीवनसङ्गी प्रतिभाशाली।', mai: 'शुक्र पुष्कर नवांश मे — प्रेम आ साझेदारी अपन परिपूर्णता पर। कलात्मक प्रतिभा स्वाभाविक रूप सँ उभरैत अछि। विवाह सौहार्दपूर्ण; जीवनसाथी प्रतिभाशाली।', mr: 'शुक्र पुष्कर नवांशात — प्रेम आणि भागीदारी परिपूर्णतेवर। कलात्मक प्रतिभा सहजपणे उमलते। विवाह सौहार्दपूर्ण; जीवनसाथी गुणी। ऐश्वर्य आणि सौंदर्य पूर्णपणे अनुभवले जाते।', ta: 'PKN இல் சுக்கிரன் — காதல் மற்றும் கூட்டு முழுமையான, அழகான வெளிப்பாட்டை அடைகின்றன. கலை மேதை இயல்பாகவே உருவாகிறது — இசை, கவிதை, காட்சி கலைகள். திருமணம் இசைவானது; துணைவர் திறமையானவர்.', te: 'PKN లో శుక్రుడు — ప్రేమ మరియు భాగస్వామ్యం వాటి పూర్తి, అత్యంత అందమైన వ్యక్తీకరణకు చేరుకుంటాయి. కళాత్మక ప్రతిభ సహజంగా ఉద్భవిస్తుంది. వివాహం సామరస్యంగా ఉంటుంది. విలాసం, సౌందర్యం పూర్తిగా ఆనందించబడతాయి.', bn: 'PKN এ শুক্র — প্রেম ও অংশীদারিত্ব পূর্ণতম, সুন্দরতম অভিব্যক্তিতে পৌঁছায়। শৈল্পিক প্রতিভা স্বাভাবিকভাবে উদ্ভূত। বিবাহ সুসামঞ্জস্যপূর্ণ। বিলাসিতা, নান্দনিক সুখ পূর্ণরূপে উপভোগ্য।', kn: 'PKN ನಲ್ಲಿ ಶುಕ್ರ — ಪ್ರೇಮ ಮತ್ತು ಪಾಲುದಾರಿಕೆ ಪೂರ್ಣ, ಅತ್ಯಂತ ಸುಂದರ ಅಭಿವ್ಯಕ್ತಿ ತಲುಪುತ್ತವೆ. ಕಲಾತ್ಮಕ ಪ್ರತಿಭೆ ಸ್ವಾಭಾವಿಕವಾಗಿ ಹೊರಹೊಮ್ಮುತ್ತದೆ. ವಿವಾಹ ಸಾಮರಸ್ಯದಿಂದಿರುತ್ತದೆ. ವೈಭವ, ಸೌಂದರ್ಯ ಪೂರ್ಣವಾಗಿ ಆನಂದಿಸಲಾಗುತ್ತದೆ.', gu: 'PKN માં શુક્ર — પ્રેમ અને ભાગીદારી સંપૂર્ણ, સૌથી સુંદર અભિવ્યક્તિ સુધી પહોંચે. કલાત્મક પ્રતિભા કુદરતી રીતે ઉભરે. લગ્ન સુમેળભર્યું. વૈભવ, સૌંદર્ય સંપૂર્ણ રીતે માણવામાં આવે.' },
          6: { en: 'Saturn in PKN — Hard work reaches full fruition without being wasted or stolen. Patience is rewarded with lasting, respected achievement. Service to the downtrodden earns honour. Longevity and physical endurance are protected. Karmic debts are cleared methodically — suffering comes, but not catastrophically, and yields wisdom.', hi: 'शनि पुष्कर नवांश में — कठोर परिश्रम बिना बर्बाद हुए परिणाम देता है। धैर्य को स्थायी, सम्मानित उपलब्धि से पुरस्कृत। वंचितों की सेवा को सम्मान। दीर्घायु। कार्मिक ऋण व्यवस्थित रूप से चुकाए जाते हैं।', sa: 'शनिः पुष्करनवांशे — कठोरः परिश्रमः अवृथा फलं ददाति। धैर्यं स्थायिन्या सम्मानितोपलब्ध्या पुरस्क्रियते। वंचितानां सेवा सम्मानम् अर्जयति। दीर्घायुः।', mai: 'शनि पुष्कर नवांश मे — कठोर परिश्रम बिना बर्बाद भेल परिणाम दैत अछि। धैर्य केँ स्थायी, सम्मानित उपलब्धि सँ पुरस्कृत। वंचितक सेवा केँ सम्मान। दीर्घायु।', mr: 'शनी पुष्कर नवांशात — कठोर परिश्रम वाया न जाता फळ देतो। संयमाला टिकाऊ, सन्माननीय यशाने पुरस्कृत केले जाते। वंचितांच्या सेवेला सन्मान। दीर्घायुष्य।', ta: 'PKN இல் சனி — கடின உழைப்பு வீணாகாமல் அல்லது திருடப்படாமல் முழு பலன் தருகிறது. பொறுமை நீடித்த, மதிப்புக்குரிய சாதனையால் வெகுமதி அளிக்கப்படுகிறது. தாழ்த்தப்பட்டோர் சேவை கௌரவம் பெறுகிறது. நீண்ட ஆயுள் பாதுகாக்கப்படுகிறது.', te: 'PKN లో శని — కఠోర శ్రమ వృధా కాకుండా లేదా దొంగిలించబడకుండా పూర్తి ఫలితాన్ని చేరుకుంటుంది. ఓపిక శాశ్వతమైన, గౌరవప్రదమైన సాధనతో ప్రతిఫలించబడుతుంది. అణగారిన వారి సేవ గౌరవం సంపాదిస్తుంది.', bn: 'PKN এ শনি — কঠোর পরিশ্রম নষ্ট বা চুরি না হয়ে পূর্ণ ফল দেয়। ধৈর্য স্থায়ী, সম্মানজনক অর্জনে পুরস্কৃত। নিপীড়িতদের সেবা সম্মান অর্জন করে। দীর্ঘায়ু সুরক্ষিত।', kn: 'PKN ನಲ್ಲಿ ಶನಿ — ಕಠಿಣ ಪರಿಶ್ರಮ ವ್ಯರ್ಥವಾಗದೆ ಅಥವಾ ಕದಿಯಲ್ಪಡದೆ ಪೂರ್ಣ ಫಲ ನೀಡುತ್ತದೆ. ತಾಳ್ಮೆ ಶಾಶ್ವತ, ಗೌರವಾನ್ವಿತ ಸಾಧನೆಯಿಂದ ಪ್ರತಿಫಲಿಸಲ್ಪಡುತ್ತದೆ. ದೀನರ ಸೇವೆ ಗೌರವ ಗಳಿಸುತ್ತದೆ.', gu: 'PKN માં શનિ — સખત મહેનત વેડફાયા કે ચોરાયા વિના પૂર્ણ ફળ આપે. ધીરજ ટકાઉ, માનનીય સિદ્ધિથી પુરસ્કૃત. દલિતોની સેવા સન્માન કમાવે. દીર્ઘાયુ સુરક્ષિત.' },
          7: { en: 'Rahu in PKN — Unconventional ambitions find their highest expression and succeed beyond ordinary measures. Foreign connections, technology, and research flourish without undue disruption. Mass influence and social impact are amplified. The shadow\'s hunger finds constructive channels rather than destructive obsession.', hi: 'राहु पुष्कर नवांश में — अपरम्परागत महत्वाकांक्षाएं सर्वोच्च अभिव्यक्ति पाती हैं। विदेश, प्रौद्योगिकी, शोध सफल। जन-प्रभाव और सामाजिक प्रभाव बढ़ा। छाया की भूख विनाशकारी जुनून के बजाय रचनात्मक मार्ग पाती है।' },
          8: { en: 'Ketu in PKN — Past-life gifts bloom into extraordinary, unexplained abilities. Spiritual liberation is accelerated; moksha is near or already within reach. Occult knowledge, intuition, and psychic gifts are amplified beyond ordinary measure. The soul completes significant karma in this life and moves toward completion.', hi: 'केतु पुष्कर नवांश में — पूर्वजन्म की प्रतिभाएं असाधारण क्षमताओं में खिलती हैं। आध्यात्मिक मुक्ति त्वरित; मोक्ष निकट। गुप्त विद्या, अंतर्ज्ञान, मानसिक शक्तियां बढ़ती हैं। आत्मा इस जीवन में महत्वपूर्ण कर्म पूर्ण करती है।', sa: 'केतुः पुष्करनवांशे — पूर्वजन्मप्रतिभाः असाधारणक्षमतासु विकसन्ते। आध्यात्मिकमुक्तिः त्वरिता; मोक्षः निकटः। गुप्तविद्या, अन्तर्ज्ञानं, मानसिकशक्तयः वर्धन्ते।', mai: 'केतु पुष्कर नवांश मे — पूर्वजन्मक प्रतिभा असाधारण क्षमता मे खिलैत अछि। आध्यात्मिक मुक्ति त्वरित; मोक्ष निकट। गुप्त विद्या, अंतर्ज्ञान, मानसिक शक्ति बढ़ैत अछि।', mr: 'केतू पुष्कर नवांशात — पूर्वजन्मीच्या प्रतिभा असाधारण क्षमतांमध्ये फुलतात। आध्यात्मिक मुक्ती त्वरित; मोक्ष जवळ। गूढ विद्या, अंतर्ज्ञान, मानसिक शक्ती वाढतात।', ta: 'PKN இல் கேது — முன்ஜன்ம திறன்கள் அசாதாரண, விளக்கமுடியா திறன்களாக மலர்கின்றன. ஆன்மிக முக்தி துரிதமடைகிறது; மோட்சம் அருகில் அல்லது ஏற்கனவே எட்டும் தூரத்தில். அமானுஷ்ய அறிவு, உள்ளுணர்வு சாதாரண அளவைத் தாண்டி பெருகுகின்றன.', te: 'PKN లో కేతు — పూర్వజన్మ బహుమతులు అసాధారణ, వివరించలేని సామర్థ్యాలుగా వికసిస్తాయి. ఆధ్యాత్మిక మోక్షం వేగవంతమవుతుంది; మోక్షం సమీపంలో. అతీంద్రియ జ్ఞానం, అంతర్దృష్టి సాధారణ కొలతలకు మించి విస్తరిస్తాయి.', bn: 'PKN এ কেতু — পূর্বজন্মের উপহার অসাধারণ, ব্যাখ্যাতীত ক্ষমতায় বিকশিত হয়। আধ্যাত্মিক মুক্তি ত্বরান্বিত; মোক্ষ নিকটে। গুপ্তবিদ্যা, অন্তর্জ্ঞান সাধারণ মাপকাঠির বাইরে বিস্তৃত।', kn: 'PKN ನಲ್ಲಿ ಕೇತು — ಪೂರ್ವಜನ್ಮ ವರಗಳು ಅಸಾಧಾರಣ, ವಿವರಿಸಲಾಗದ ಸಾಮರ್ಥ್ಯಗಳಾಗಿ ಅರಳುತ್ತವೆ. ಅಧ್ಯಾತ್ಮಿಕ ಮೋಕ್ಷ ವೇಗವಾಗುತ್ತದೆ; ಮೋಕ್ಷ ಸಮೀಪದಲ್ಲಿ. ಗುಪ್ತವಿದ್ಯೆ, ಅಂತಃಪ್ರಜ್ಞೆ ಸಾಮಾನ್ಯ ಮಾಪನವನ್ನು ಮೀರಿ ವಿಸ್ತರಿಸುತ್ತವೆ.', gu: 'PKN માં કેતુ — પૂર્વજન્મની ભેટો અસાધારણ, સમજાવી ન શકાય તેવી ક્ષમતાઓમાં ખીલે. આધ્યાત્મિક મોક્ષ વેગ પકડે; મોક્ષ નજીક. ગૂઢવિદ્યા, અંતર્જ્ઞાન સામાન્ય માપથી ઉપર વિસ્તરે.' },
        };
        const pknPlanets = kundali.planets.filter(p => p.isPushkarNavamsha);
        const pkbPlanets = kundali.planets.filter(p => p.isPushkarBhaga);
        if (pknPlanets.length === 0 && pkbPlanets.length === 0) return null;
        return (
        <div className="rounded-xl bg-gradient-to-br from-[#0e1a0a]/60 via-[#0a0e27]/80 to-[#0a0e27] border border-emerald-500/20 p-5 space-y-4">
          <h4 className="text-emerald-400 text-sm uppercase tracking-widest font-bold">
            {tl({ en: 'Pushkar Navamsha + Pushkar Bhaga', hi: 'पुष्कर नवांश + पुष्कर भाग', sa: 'पुष्कर नवांश + पुष्कर भाग' }, locale)}
          </h4>
          {pknPlanets.length > 0 && (
            <div>
              <div className="text-sky-300 text-xs font-bold mb-1.5 uppercase tracking-wider">
                {tl({ en: 'Pushkar Navamsha (PKN) — 24 supremely auspicious navamsha positions', hi: 'पुष्कर नवांश (PKN) — 24 अत्यंत शुभ नवांश स्थितियाँ', sa: 'पुष्कर नवांश (PKN) — 24 अत्यंत शुभ नवांश स्थितियाँ' }, locale)}
              </div>
              <p className="text-text-secondary/75 text-xs leading-relaxed mb-3" style={isDevanagari ? { fontFamily: 'var(--font-devanagari-body)' } : undefined}>
                {tl({ en: 'A planet in Pushkar Navamsha gives auspicious results even if debilitated or combust — the navamsha protects it. Below are classical per-planet interpretations (Saravali tradition).', hi: 'जब कोई ग्रह पुष्कर नवांश में हो, तो उसकी स्थिति शुभ फल देती है — यहाँ तक कि नीच या अस्त ग्रह भी सुरक्षित रहता है। नीचे प्रत्येक PKN ग्रह का विशिष्ट फल दर्शाया गया है।', sa: 'जब कोई ग्रह पुष्कर नवांश में हो, तो उसकी स्थिति शुभ फल देती है — यहाँ तक कि नीच या अस्त ग्रह भी सुरक्षित रहता है। नीचे प्रत्येक PKN ग्रह का विशिष्ट फल दर्शाया गया है।' }, locale)}
              </p>
              <div className="space-y-3">
                {pknPlanets.map(p => {
                  const profile = PKN_PROFILES[p.planet.id];
                  return (
                    <div key={p.planet.id} className="rounded-lg bg-sky-500/8 border border-sky-400/20 p-3">
                      <div className="flex items-center gap-2 mb-1.5">
                        <GrahaIconById id={p.planet.id} size={20} />
                        <span className="text-sky-200 font-bold text-sm" style={isDevanagari ? { fontFamily: 'var(--font-devanagari-heading)' } : undefined}>{tl(p.planet.name, locale)}</span>
                        <span className="text-text-secondary/70 text-xs font-mono">{tl(p.signName, locale)} {(p.longitude % 30).toFixed(1)}°</span>
                        <span className="ml-auto text-sky-400 text-[10px] font-bold px-1.5 py-0.5 bg-sky-500/10 rounded border border-sky-400/20">PKN</span>
                      </div>
                      {profile && (
                        <p className="text-text-secondary/70 text-xs leading-relaxed" style={isDevanagari ? { fontFamily: 'var(--font-devanagari-body)' } : undefined}>
                          {profile[tl({ en: 'en', hi: 'hi', sa: 'hi' }, locale)]}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
          {pkbPlanets.length > 0 && (
            <div>
              <div className="text-emerald-300 text-xs font-bold mb-1.5 uppercase tracking-wider">
                {tl({ en: 'Pushkar Bhaga (PKB) — single most auspicious degree per sign', hi: 'पुष्कर भाग (PKB) — प्रत्येक राशि में सर्वाधिक शुभ अंश', sa: 'पुष्कर भाग (PKB) — प्रत्येक राशि में सर्वाधिक शुभ अंश' }, locale)}
              </div>
              <p className="text-text-secondary/75 text-xs leading-relaxed mb-2" style={isDevanagari ? { fontFamily: 'var(--font-devanagari-body)' } : undefined}>
                {tl({ en: 'Pushkar Bhaga is the single most sacred degree in each sign (±0.8° orb). A planet here gains extraordinary strength. For muhurta: Moon at Pushkar Bhaga is the pinnacle of muhurta power in that sign.', hi: 'पुष्कर भाग प्रत्येक राशि में सर्वाधिक पवित्र अंश है। यहाँ स्थित ग्रह असाधारण शक्ति पाता है। विशेष रूप से मुहूर्त में: जब चन्द्रमा पुष्कर भाग पर हो, तो मुहूर्त की ताकत चरम पर होती है।', sa: 'पुष्कर भाग प्रत्येक राशि में सर्वाधिक पवित्र अंश है। यहाँ स्थित ग्रह असाधारण शक्ति पाता है। विशेष रूप से मुहूर्त में: जब चन्द्रमा पुष्कर भाग पर हो, तो मुहूर्त की ताकत चरम पर होती है।' }, locale)}
              </p>
              <div className="flex flex-wrap gap-2">
                {pkbPlanets.map(p => (
                  <div key={p.planet.id} className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500/10 border border-emerald-400/20 rounded-lg">
                    <span className="text-emerald-200 font-bold text-xs" style={isDevanagari ? { fontFamily: 'var(--font-devanagari-heading)' } : undefined}>{tl(p.planet.name, locale)}</span>
                    <span className="text-text-secondary/70 text-xs font-mono">{tl(p.signName, locale)} {(p.longitude % 30).toFixed(1)}°</span>
                    <span className="text-emerald-400 text-[10px]">(PB={PUSHKAR_BHAGA_DEGREES[p.sign]}°)</span>
                    <span className="text-emerald-400 text-[10px] font-bold">PKB</span>
                  </div>
                ))}
              </div>
            </div>
          )}
          <p className="text-text-secondary/65 text-xs">
            {tl({ en: 'Source: Saravali tradition. PKN: 24 navamsha positions across 12 signs. PKB: one degree per sign.', hi: 'स्रोत: सरावली परम्परा। पुष्कर नवांश: 24 स्थितियाँ। पुष्कर भाग: एक अंश प्रति राशि।', sa: 'स्रोत: सरावली परम्परा। पुष्कर नवांश: 24 स्थितियाँ। पुष्कर भाग: एक अंश प्रति राशि।' }, locale)}
          </p>
        </div>
        );
      })()}

      {/* How to use this */}
      <div className="rounded-xl bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 p-5 border border-emerald-500/15">
        <h4 className="text-emerald-400 text-xs uppercase tracking-widest font-bold mb-2">
          {tl({ en: 'How to Use This Information', hi: 'इसका उपयोग कैसे करें', sa: 'इसका उपयोग कैसे करें' }, locale)}
        </h4>
        <ul className="text-text-secondary text-xs leading-relaxed space-y-2">
          <li>
            {tl({ en: `✦ Keep your Yogi Planet (${yogiPlanetName}) strong — wear its gemstone, fast/donate on its day.`, hi: `✦ अपने योगी ग्रह (${yogiPlanetName}) को बलवान रखें — इसका रत्न धारण करें, इसके दिन उपवास/दान करें।`, sa: `✦ अपने योगी ग्रह (${yogiPlanetName}) को बलवान रखें — इसका रत्न धारण करें, इसके दिन उपवास/दान करें।` }, locale)}
          </li>
          <li>
            {tl({ en: `✦ Be cautious during Avayogi Planet (${avayogiPlanetName}) dasha/transit — think twice before major decisions.`, hi: `✦ अवयोगी ग्रह (${avayogiPlanetName}) की दशा/गोचर में सावधान रहें — बड़े निर्णयों से पहले सोचें।`, sa: `✦ अवयोगी ग्रह (${avayogiPlanetName}) की दशा/गोचर में सावधान रहें — बड़े निर्णयों से पहले सोचें।` }, locale)}
          </li>
          <li>
            {tl({ en: '✦ When Jupiter transits within ±5° of your Yogi Point, start new ventures — this is your MOST auspicious transit window.', hi: '✦ जब बृहस्पति आपके योगी बिंदु के ±5° के भीतर गोचर करे, तो नए कार्य आरम्भ करें — यह आपका सबसे शुभ काल है।', sa: '✦ जब बृहस्पति आपके योगी बिंदु के ±5° के भीतर गोचर करे, तो नए कार्य आरम्भ करें — यह आपका सबसे शुभ काल है।' }, locale)}
          </li>
          <li>
            {tl({ en: '✦ Mrityu Sphuta ≠ death prediction. It only indicates a health-sensitive degree. Get regular checkups and practice preventive care when planets transit this point.', hi: '✦ मृत्यु स्फुट = मृत्यु नहीं। यह केवल शारीरिक संवेदनशीलता का बिंदु है। स्वास्थ्य जांच और सावधानी बरतें।', sa: '✦ मृत्यु स्फुट = मृत्यु नहीं। यह केवल शारीरिक संवेदनशीलता का बिंदु है। स्वास्थ्य जांच और सावधानी बरतें।' }, locale)}
          </li>
        </ul>
      </div>
    </div>
  );
}
