'use client';

import React from 'react';
import { GrahaIconById } from '@/components/icons/GrahaIcons';
import InfoBlock from '@/components/ui/InfoBlock';
import { GRAHAS } from '@/lib/constants/grahas';
import type { KundaliData } from '@/types/kundali';
import type { Locale } from '@/types/panchang';
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

const HOUSE_THEMES: Record<number, { en: string; hi: string }> = {
  1: { en: 'Self, body, health, personality', hi: 'आत्म, शरीर, स्वास्थ्य' },
  2: { en: 'Wealth, family, speech', hi: 'धन, परिवार, वाणी' },
  3: { en: 'Courage, siblings, short travel', hi: 'साहस, भाई-बहन, लघु यात्रा' },
  4: { en: 'Home, mother, property, comfort', hi: 'घर, माता, सम्पत्ति, सुख' },
  5: { en: 'Children, education, creativity', hi: 'सन्तान, शिक्षा, रचनात्मकता' },
  6: { en: 'Enemies, health issues, service', hi: 'शत्रु, स्वास्थ्य, सेवा' },
  7: { en: 'Marriage, partnerships, business', hi: 'विवाह, साझेदारी, व्यापार' },
  8: { en: 'Transformation, longevity, occult', hi: 'परिवर्तन, दीर्घायु, गुप्त विद्या' },
  9: { en: 'Fortune, father, dharma, guru', hi: 'भाग्य, पिता, धर्म, गुरु' },
  10: { en: 'Career, status, authority', hi: 'कैरियर, प्रतिष्ठा, अधिकार' },
  11: { en: 'Gains, income, friends, wishes', hi: 'लाभ, आय, मित्र, इच्छाएँ' },
  12: { en: 'Expenses, liberation, foreign', hi: 'व्यय, मोक्ष, विदेश' },
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
        {isHi ? 'स्फुट — संवेदनशील बिंदु' : 'Sphutas — Sensitive Points in Your Chart'}
      </h3>

      <InfoBlock
        id="kundali-sphutas"
        title={isHi ? 'स्फुट क्या हैं?' : 'What are Sphutas (Sensitive Points)?'}
        defaultOpen={false}
      >
        {isHi
          ? 'स्फुट गणितीय रूप से निर्धारित अंश बिंदु हैं जो छुपे आयाम प्रकट करते हैं: योगी बिंदु — आपका सबसे शुभ अंश, इसके निकट ग्रह भाग्य लाते हैं। अवयोगी बिंदु — आपका सबसे चुनौतीपूर्ण अंश। प्राण स्फुट — जीवनशक्ति और प्राण ऊर्जा। देह स्फुट — भौतिक शरीर और स्वास्थ्य संरचना। मृत्यु स्फुट — दीर्घायु सूचक (विश्लेषणात्मक, भविष्यसूचक नहीं!)। त्रि स्फुट — तीनों का समग्र।'
          : 'Sphutas are mathematically computed degree points that reveal hidden dimensions: Yogi Point — your luckiest degree, planets near this bring fortune. Avayogi Point — your most challenging degree. Prana Sphuta — vitality and life force. Deha Sphuta — physical body and health constitution. Mrityu Sphuta — longevity indicators (analytical, not predictive!). Tri Sphuta — composite of all three.'}
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
            {isHi ? '✦ स्फुट संश्लेषण — आपका पूर्ण चित्र' : '✦ Sphuta Synthesis — Your Complete Picture'}
          </h4>
          <p className="text-text-secondary/75 text-xs mb-4">
            {isHi ? 'सभी स्फुट बिंदुओं का एकीकृत विश्लेषण — महत्वपूर्ण गोचर खिड़कियाँ, स्वास्थ्य संरचना, और व्यावहारिक सुझाव।' : 'Integrated reading of all sphuta points — key transit windows, constitutional health picture, and actionable guidance.'}
          </p>

          {/* Blueprint paragraph */}
          <div className="bg-[#0a0e27]/60 border border-gold-primary/10 rounded-lg p-4 mb-4">
            <p className="text-text-secondary text-xs leading-relaxed">
              {isHi
                ? `आपकी प्राण शक्ति ${signName(sp.pranaSphuta.sign)} (${elemName(sp.pranaSphuta.sign)} तत्व) में है, जो ${sp.pranaSphuta.sign % 2 === 0 ? 'सम — ग्रहणशील, भावनात्मक' : 'विषम — सक्रिय, अभिव्यंजक'} प्रकृति दर्शाती है। देह स्फुट ${signName(sp.dehaSphuta.sign)} में ${elemName(sp.dehaSphuta.sign) === 'अग्नि' || elemName(sp.dehaSphuta.sign) === 'पृथ्वी' ? 'शारीरिक सहनशक्ति और स्थिरता' : 'लचीलापन और अनुकूलनशीलता'} देता है। मृत्यु स्फुट ${signName(sp.mrityuSphuta.sign)} में संवेदनशीलता ${sp.mrityuSphuta.sign >= 1 && sp.mrityuSphuta.sign <= 6 ? 'शरीर के ऊपरी भाग में' : 'शरीर के निचले भाग में'} इंगित करता है। आपका योगी ग्रह ${pName(sp.yogiPoint.yogiPlanet)} है और अवयोगी ग्रह ${pName(sp.avayogiPoint.avayogiPlanet)} — इन दोनों की दशाओं में क्रमशः सर्वोत्तम और सबसे चुनौतीपूर्ण अनुभव होते हैं।`
                : `Your Prana (vitality) is rooted in ${signName(sp.pranaSphuta.sign)} (${elemName(sp.pranaSphuta.sign)} element) — ${sp.pranaSphuta.sign % 2 === 0 ? 'receptive and emotionally driven' : 'active and expressive'}. Deha (body) in ${signName(sp.dehaSphuta.sign)} gives you ${(elemName(sp.dehaSphuta.sign) === 'Fire' || elemName(sp.dehaSphuta.sign) === 'Earth') ? 'physical endurance and structural strength' : 'flexibility and adaptability'}. Mrityu in ${signName(sp.mrityuSphuta.sign)} points to constitutional sensitivity in the ${sp.mrityuSphuta.sign >= 1 && sp.mrityuSphuta.sign <= 6 ? 'upper body region' : 'lower body region'}. Your Yogi Planet is ${pName(sp.yogiPoint.yogiPlanet)} and Avayogi is ${pName(sp.avayogiPoint.avayogiPlanet)} — these two planets mark your best and most challenging dasha periods respectively.`}
            </p>
          </div>

          {/* Active window alert */}
          {activeNow && (
            <div className="bg-emerald-500/15 border border-emerald-400/30 rounded-lg p-3 mb-4 flex items-start gap-2">
              <span className="text-emerald-400 text-sm mt-0.5">&#9733;</span>
              <p className="text-emerald-300 text-xs leading-relaxed font-medium">
                {isHi ? 'एक महत्वपूर्ण गोचर अभी सक्रिय है! अपने जीवन के अवसरों/चुनौतियों पर ध्यान दें।' : 'An important transit is ACTIVE RIGHT NOW. Pay close attention to opportunities or challenges unfolding in your life.'}
              </p>
            </div>
          )}

          {/* Timeline */}
          <h5 className="text-gold-primary text-xs uppercase tracking-widest font-bold mb-2">
            {isHi ? 'आगामी महत्वपूर्ण खिड़कियाँ' : 'Upcoming Key Windows'}
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
                      {ev.daysAway < 30 ? (isHi ? `~${ev.daysAway} दिन` : `~${ev.daysAway} days`) : ev.date.toLocaleDateString(isHi ? 'hi-IN' : 'en-US', { month:'short', year:'numeric' })}
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
            {isHi ? 'स्वास्थ्य संरचना सारांश' : 'Constitutional Health Summary'}
          </h5>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-4">
            {[
              { label: isHi?'प्राण':'Prana', sign: sp.pranaSphuta.sign, deg: sp.pranaSphuta.degree, color:'text-gold-primary' },
              { label: isHi?'देह':'Deha', sign: sp.dehaSphuta.sign, deg: sp.dehaSphuta.degree, color:'text-blue-400' },
              { label: isHi?'मृत्यु':'Mrityu', sign: sp.mrityuSphuta.sign, deg: sp.mrityuSphuta.degree, color:'text-violet-400' },
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
            {isHi ? 'मुख्य सुझाव' : 'Key Actions'}
          </h5>
          <div className="space-y-1.5">
            <div className="flex items-start gap-2 text-xs text-text-secondary">
              <span className="text-emerald-400 mt-0.5 flex-shrink-0">✦</span>
              <span>{isHi ? `${pName(sp.yogiPoint.yogiPlanet)} को सबसे अधिक बल दें — यह आपका कल्याणकारी ग्रह है। इसके रत्न, मंत्र, और दान से आपकी योगी बिंदु ऊर्जा सक्रिय होती है।` : `Strengthen ${pName(sp.yogiPoint.yogiPlanet)} above all others — it is your most benefic karmic ally. Its gemstone, mantra, and charitable donations activate your Yogi Point energy.`}</span>
            </div>
            <div className="flex items-start gap-2 text-xs text-text-secondary">
              <span className="text-amber-400 mt-0.5 flex-shrink-0">◈</span>
              <span>{isHi ? `जब बृहस्पति आपके योगी बिंदु (${sp.yogiPoint.degree.toFixed(0)}° ${signName(sp.yogiPoint.sign)}) के ±5° में हो — ${sphuataTransitData.yogiJupiter.isActive ? 'अभी!' : (isHi ? sphuataTransitData.yogiJupiter.labelHi : sphuataTransitData.yogiJupiter.label)} — बड़े कार्य, निवेश, विवाह, और यात्राएं शुरू करें।` : `When Jupiter is within ±5° of your Yogi Point (${sp.yogiPoint.degree.toFixed(0)}° ${signName(sp.yogiPoint.sign)}) — ${sphuataTransitData.yogiJupiter.isActive ? 'that is NOW' : sphuataTransitData.yogiJupiter.label} — initiate major ventures, investments, marriages, journeys.`}</span>
            </div>
            <div className="flex items-start gap-2 text-xs text-text-secondary">
              <span className="text-red-400 mt-0.5 flex-shrink-0">⚠</span>
              <span>{isHi ? `${pName(sp.avayogiPoint.avayogiPlanet)} की दशा/अन्तर्दशा और शनि के अवयोगी बिंदु गोचर (${sphuataTransitData.avayogiSaturn.isActive ? 'अभी सक्रिय' : sphuataTransitData.avayogiSaturn.labelHi}) में: बड़े कानूनी, वित्तीय और व्यावसायिक निर्णय टालें।` : `During ${pName(sp.avayogiPoint.avayogiPlanet)} dasha/antardasha and Saturn's Avayogi transit (${sphuataTransitData.avayogiSaturn.isActive ? 'active now!' : sphuataTransitData.avayogiSaturn.label}): postpone major legal, financial, and career decisions where possible.`}</span>
            </div>
            <div className="flex items-start gap-2 text-xs text-text-secondary">
              <span className="text-violet-400 mt-0.5 flex-shrink-0">◉</span>
              <span>{isHi ? `जब शनि या मंगल मृत्यु स्फुट (${sp.mrityuSphuta.degree.toFixed(0)}° ${signName(sp.mrityuSphuta.sign)}) पर गोचर करे — शनि: ${sphuataTransitData.mrityuSaturn.isActive ? 'अभी!' : sphuataTransitData.mrityuSaturn.labelHi}, मंगल: ${sphuataTransitData.mrityuMars.isActive ? 'अभी!' : sphuataTransitData.mrityuMars.labelHi} — पूर्ण स्वास्थ्य जांच कराएं।` : `When Saturn (${sphuataTransitData.mrityuSaturn.isActive ? 'now!' : sphuataTransitData.mrityuSaturn.label}) or Mars (${sphuataTransitData.mrityuMars.isActive ? 'now!' : sphuataTransitData.mrityuMars.label}) transit your Mrityu Sphuta (${sp.mrityuSphuta.degree.toFixed(0)}° ${signName(sp.mrityuSphuta.sign)}): schedule a comprehensive health checkup, avoid risky activities.`}</span>
            </div>
          </div>

          <p className="text-text-secondary/55 text-xs mt-3 italic">
            {isHi ? '* गोचर तिथियाँ औसत गति पर आधारित अनुमान हैं — वक्री गति से ±4-8 सप्ताह का अन्तर हो सकता है।' : '* Transit dates are estimates based on average daily motion — retrograde periods may shift by ±4–8 weeks.'}
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
              <div className="text-emerald-300 text-xs uppercase tracking-widest font-bold">{isHi ? 'योगी बिंदु — आपका शुभ बिंदु' : 'Yogi Point — Your Lucky Degree'}</div>
            </div>
          </div>
          <div className="text-gold-light font-bold text-3xl font-mono mb-1">{kundali.sphutas!.yogiPoint.degree.toFixed(2)}°</div>
          <div className="text-emerald-300 text-sm font-bold mb-2">{signName(kundali.sphutas!.yogiPoint.sign)}</div>
          <div className="text-emerald-400 text-xs font-medium mb-3">
            {isHi ? `योगी ग्रह: ${yogiPlanetName}` : `Yogi Planet: ${yogiPlanetName}`}
          </div>
          <div className="text-text-secondary text-xs leading-relaxed">
            {isHi
              ? `यह आपकी कुण्डली का सबसे शुभ बिंदु है। ${yogiPlanetName} आपका योगी ग्रह है — इसकी दशा/अन्तर्दशा में सर्वोत्तम परिणाम मिलते हैं। ${yogiPlanetName} को बलवान रखें — इसका रत्न, मंत्र, या दान करें। जब गोचरी बृहस्पति इस अंश पर आता है, तो जीवन में बड़ी सकारात्मक घटना होती है — यह लगभग हर 12 वर्ष में होता है और आपकी सबसे शक्तिशाली गोचर खिड़की है।`
              : `This is the single most auspicious degree in your entire chart. ${yogiPlanetName} is your Yogi Planet — its dasha/antardasha brings the BEST results in your life. Keep ${yogiPlanetName} strong — wear its gemstone, chant its mantra, make donations on its day. When transiting Jupiter crosses this degree, expect a major positive event — this happens roughly once every 12 years and is your most powerful transit window.`}
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
              <div className="text-red-300 text-xs uppercase tracking-widest font-bold">{isHi ? 'अवयोगी बिंदु — आपका चुनौतीपूर्ण बिंदु' : 'Avayogi Point — Your Challenging Degree'}</div>
            </div>
          </div>
          <div className="text-gold-light font-bold text-3xl font-mono mb-1">{kundali.sphutas!.avayogiPoint.degree.toFixed(2)}°</div>
          <div className="text-red-300 text-sm font-bold mb-2">{signName(kundali.sphutas!.avayogiPoint.sign)}</div>
          <div className="text-red-400 text-xs font-medium mb-3">
            {isHi ? `अवयोगी ग्रह: ${avayogiPlanetName}` : `Avayogi Planet: ${avayogiPlanetName}`}
          </div>
          <div className="text-text-secondary text-xs leading-relaxed">
            {isHi
              ? `यह आपका सबसे चुनौतीपूर्ण बिंदु है। ${avayogiPlanetName} आपका अवयोगी ग्रह है — इसकी दशा में बाधाएँ और विलम्ब आ सकते हैं। जब शनि इस अंश पर गोचर करता है, सावधान रहें। उपाय: ${avayogiPlanetName} के शमन मंत्र, शनिवार को तिल/तेल दान, और इस ग्रह की दशा में अतिरिक्त सावधानी।`
              : `This is your most challenging degree. ${avayogiPlanetName} is your Avayogi Planet — its dasha may bring obstacles, delays, and setbacks. When Saturn transits this degree, exercise extra caution with major decisions. Remedies: chant the pacification mantra for ${avayogiPlanetName}, donate sesame/oil on Saturdays.`}
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
          {isHi ? 'शारीरिक संरचना स्फुट — आपकी प्रकृति' : 'Constitutional Sphutas — Your Nature'}
        </h4>
        <p className="text-text-secondary text-xs text-center mb-4 max-w-2xl mx-auto">
          {isHi
            ? 'ये बिंदु आपकी शारीरिक और प्राणिक संरचना को दर्शाते हैं। ये चिकित्सा ज्योतिष और आयुर्वेदिक विश्लेषण में प्रयुक्त होते हैं।'
            : 'These points describe your physical and vital constitution. They are used in medical astrology (Ayurvedic analysis) and longevity assessment. The sign and nakshatra where each falls indicates the quality of that life dimension.'}
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {([
            { data: kundali.sphutas!.pranaSphuta, label: isHi ? 'प्राण स्फुट' : 'Prana Sphuta', sublabel: isHi ? 'जीवन शक्ति' : 'Vitality & Life Force', color: 'border-gold-primary/20', icon: '&#9829;', txKey: 'prana' as const,
              explain: isHi ? 'आपकी समग्र जीवन शक्ति और ऊर्जा स्तर। सूर्य + चन्द्र + लग्न से गणित। शुभ राशि/नक्षत्र = प्रबल जीवनशक्ति, अच्छा स्वास्थ्य।' : 'Your overall vitality and energy level. Computed from Sun + Moon + Lagna. A benefic sign/nakshatra = strong life force, good health, resilience. A malefic placement = watch your energy levels, prioritize rest.' },
            { data: kundali.sphutas!.dehaSphuta, label: isHi ? 'देह स्फुट' : 'Deha Sphuta', sublabel: isHi ? 'शारीरिक संरचना' : 'Physical Body', color: 'border-blue-500/20', icon: '&#9775;', txKey: 'deha' as const,
              explain: isHi ? 'आपकी शारीरिक संरचना और काया। यह बताता है कि आपका शरीर किस प्रकार का है। अग्नि/पृथ्वी राशि = मजबूत, मांसल। वायु/जल = हल्का, लचीला।' : 'Your physical constitution and body type. This indicates your natural build. Fire/Earth signs = strong, muscular frame. Air/Water = lighter, more flexible. The nakshatra adds specifics about health tendencies.' },
            { data: kundali.sphutas!.mrityuSphuta, label: isHi ? 'मृत्यु स्फुट' : 'Mrityu Sphuta', sublabel: isHi ? 'दीर्घायु सूचक' : 'Longevity Indicator', color: 'border-violet-500/20', icon: '&#8734;', txKey: 'mrityu' as const,
              explain: isHi ? 'दीर्घायु और स्वास्थ्य जोखिम का सूचक। यह "मृत्यु" का भविष्यवाणी नहीं करता — यह दर्शाता है कि शरीर के कौन से क्षेत्र ध्यान माँगते हैं। जब गोचर ग्रह इस अंश पर आते हैं, स्वास्थ्य पर ध्यान दें।' : 'Indicator of longevity and health vulnerability. This does NOT predict death — it shows which body areas need attention. When transit planets (especially Saturn or Mars) cross this degree, pay extra attention to health. The sign indicates the body part: Aries=head, Taurus=throat, etc.' },
            { data: kundali.sphutas!.triSphuta, label: isHi ? 'त्रि स्फुट' : 'Tri Sphuta', sublabel: isHi ? 'समग्र संकेतक' : 'Composite Indicator', color: 'border-amber-500/20', icon: '&#9651;', txKey: 'tri' as const,
              explain: isHi ? 'तीनों स्फुटों (प्राण + देह + मृत्यु) का संयुक्त बिंदु। यह आपकी समग्र शारीरिक-प्राणिक स्थिति का एकल सूचक है।' : 'Composite of all three sphutas (Prana + Deha + Mrityu). This gives a single-point summary of your overall physical-vital condition. Its sign/nakshatra placement summarizes your constitutional strength.' },
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
            {isHi ? 'प्रजनन स्फुट' : 'Fertility Sphutas'}
          </h4>
          <p className="text-text-secondary text-xs text-center mb-4 max-w-xl mx-auto">
            {isHi
              ? 'ये बिंदु प्रजनन क्षमता और सन्तान योग का आकलन करते हैं। विषम राशि/नक्षत्र = अनुकूल।'
              : 'These points assess fertility and progeny potential. Odd signs and benefic nakshatras = favorable. Used alongside 5th house and Jupiter analysis for childbirth timing.'}
          </p>
          <div className="grid grid-cols-2 gap-3">
            {kundali.sphutas!.bijaSphuta && (
              <div className="rounded-xl bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 p-4 border border-blue-500/15">
                <div className="text-blue-300 text-xs uppercase tracking-widest font-bold mb-1">{isHi ? 'बीज स्फुट (पुरुष प्रजनन)' : 'Bija Sphuta (Male Fertility)'}</div>
                <div className="text-gold-light font-bold text-xl font-mono">{kundali.sphutas!.bijaSphuta.degree.toFixed(2)}°</div>
                <div className="text-text-secondary text-xs mt-1">{signName(kundali.sphutas!.bijaSphuta.sign)}</div>
                <p className="text-text-secondary/70 text-xs mt-2 leading-relaxed">
                  {isHi ? 'सूर्य + शुक्र + बृहस्पति से गणित। विषम राशि और शुभ नक्षत्र = बलवान।' : 'Computed from Sun + Venus + Jupiter. Odd sign + benefic nakshatra = strong male fertility factor.'}
                </p>
                {sphuataTransitData?.bijaJupiter && (
                  <div className={`mt-2 flex items-center justify-between rounded-md px-2 py-1 text-xs ${sphuataTransitData.bijaJupiter.isActive ? 'bg-emerald-500/15 border border-emerald-400/20' : 'bg-[#0a0e27]/60 border border-blue-500/10'}`}>
                    <span className="text-text-secondary/70">{isHi ? 'अगला बृहस्पति' : 'Next Jupiter'}</span>
                    <span className={`font-bold ${sphuataTransitData.bijaJupiter.isActive ? 'text-emerald-300' : 'text-gold-light'}`}>{isHi ? sphuataTransitData.bijaJupiter.labelHi : sphuataTransitData.bijaJupiter.label}</span>
                  </div>
                )}
              </div>
            )}
            {kundali.sphutas!.kshetraSphuta && (
              <div className="rounded-xl bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 p-4 border border-pink-500/15">
                <div className="text-pink-300 text-xs uppercase tracking-widest font-bold mb-1">{isHi ? 'क्षेत्र स्फुट (स्त्री प्रजनन)' : 'Kshetra Sphuta (Female Fertility)'}</div>
                <div className="text-gold-light font-bold text-xl font-mono">{kundali.sphutas!.kshetraSphuta.degree.toFixed(2)}°</div>
                <div className="text-text-secondary text-xs mt-1">{signName(kundali.sphutas!.kshetraSphuta.sign)}</div>
                <p className="text-text-secondary/70 text-xs mt-2 leading-relaxed">
                  {isHi ? 'चन्द्र + मंगल + बृहस्पति से गणित। सम राशि और शुभ नक्षत्र = बलवान।' : 'Computed from Moon + Mars + Jupiter. Even sign + benefic nakshatra = strong female fertility factor.'}
                </p>
                {sphuataTransitData?.kshetraJupiter && (
                  <div className={`mt-2 flex items-center justify-between rounded-md px-2 py-1 text-xs ${sphuataTransitData.kshetraJupiter.isActive ? 'bg-emerald-500/15 border border-emerald-400/20' : 'bg-[#0a0e27]/60 border border-pink-500/10'}`}>
                    <span className="text-text-secondary/70">{isHi ? 'अगला बृहस्पति' : 'Next Jupiter'}</span>
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
            {isHi ? 'भृगु बिंदु (Uttara Kalamrita)' : 'Bhrigu Bindu (Uttara Kalamrita)'}
          </div>
          <div className="flex items-center gap-4 mb-3">
            <div>
              <span className="text-gold-light font-bold text-2xl font-mono">{kundali.bhriguBindu.degree}</span>
              <span className="text-purple-300 text-sm ml-2">{signName(kundali.bhriguBindu.sign)}</span>
            </div>
            <div className="text-text-secondary text-xs">{kundali.bhriguBindu.longitude.toFixed(2)}°</div>
          </div>
          <p className="text-text-secondary/80 text-xs leading-relaxed">
            {isHi
              ? 'भृगु बिंदु = राहु और चन्द्र का मध्यबिंदु। यह आपके जीवन का सर्वाधिक संवेदनशील बिंदु है। जब बृहस्पति इस बिंदु से गुजरे, बड़ी शुभ घटनाएँ होती हैं। शनि का गोचर चुनौती लाता है।'
              : 'Midpoint of natal Rahu and Moon — the most sensitive accumulation point in your chart. Jupiter transiting within 5° of Bhrigu Bindu triggers major positive events. Saturn transiting this point brings a challenge period requiring discipline and patience.'}
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
              {isHi ? 'पिण्डायु — संवैधानिक दीर्घायु संकेतक (BPHS अ. 44-45)' : 'Pindayu — Constitutional Longevity Indicators (BPHS Ch. 44-45)'}
            </h4>
            <p className="text-text-secondary/70 text-xs mb-4" style={isHi ? { fontFamily: 'var(--font-devanagari-body)' } : undefined}>
              {isHi
                ? 'प्रत्येक ग्रह आधार वर्ष × राशि में अंश देता है। वक्री, अस्त, और नीच होने पर कम होता है। यह मृत्यु की भविष्यवाणी नहीं — संवैधानिक शक्ति का संकेत है।'
                : 'Each planet contributes base years × degree proportion. Reduced for retrogression, combustion, and debilitation. This is NOT death prediction — it indicates constitutional vitality and life force quality.'}
            </p>
            <div className="rounded-xl bg-purple-500/10 border border-purple-500/25 p-4 mb-4 text-center">
              <div className="text-purple-200 font-bold text-3xl font-mono">{lo}–{hi2}</div>
              <div className="text-text-secondary/75 text-xs mt-1">{isHi ? 'वर्ष (अनुमानित सीमा)' : 'years (estimated constitutional range)'}</div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-1.5">
              {contributions.map(c => (
                <div key={c.pid} className="rounded-lg bg-bg-primary/30 border border-purple-500/10 p-2 text-center">
                  <div className="text-gold-primary/60 text-xs font-bold">{PLANET_NAMES[isHi ? 'hi' : 'en'][c.pid]}</div>
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
        const PKN_PROFILES: Record<number, { en: string; hi: string }> = {
          0: { en: 'Sun in PKN — Authority and recognition arrive with grace. Career advancement and government support are unobstructed. Father\'s blessings are active. Soul\'s dharmic purpose is clearly supported; fame through righteous leadership. Even if Sun is debilitated, the PKN protects its significations.', hi: 'सूर्य पुष्कर नवांश में — अधिकार और मान्यता सहजता से प्राप्त। कैरियर और सरकारी सहायता निर्बाध। पिता का आशीर्वाद सक्रिय। आत्मा का धर्म स्पष्ट रूप से समर्थित; धर्मी नेतृत्व से यश।' },
          1: { en: 'Moon in PKN — Emotional life is rich, stable, and fulfilling. Exceptional intuition and psychic clarity. Mother is a source of blessing and support. Public life, popularity, and goodwill come naturally. Mind remains calm even in adversity. A muhurta Moon in PKN is deeply auspicious.', hi: 'चन्द्र पुष्कर नवांश में — भावनात्मक जीवन समृद्ध, स्थिर और संतोषजनक। असाधारण अंतर्ज्ञान। माता का आशीर्वाद। जनता में लोकप्रियता स्वाभाविक। विपरीत परिस्थितियों में भी मन शांत।' },
          2: { en: 'Mars in PKN — Courage becomes righteous — decisive action without destructive recklessness. Land, property, and sibling matters are protected and favourable. If surgery is needed, outcomes are positive. Competitive victories follow. Physical vitality and stamina are amplified by the PKN\'s grace.', hi: 'मंगल पुष्कर नवांश में — साहस धर्मी बनता है — विनाशकारी उतावलेपन के बिना। भूमि, सम्पत्ति, भाई-बहन के मामले अनुकूल। शल्य चिकित्सा के परिणाम सकारात्मक। प्रतिस्पर्धी जीत। शारीरिक जीवनी बढ़ती है।' },
          3: { en: 'Mercury in PKN — Intellectual gifts bloom fully; communication is eloquent and persuasive. Business and trade reach their highest potential. Writing, publishing, and teaching bring recognition and wealth. Wit and analytical intelligence serve every life domain. Education attains excellent fruition.', hi: 'बुध पुष्कर नवांश में — बौद्धिक प्रतिभा पूर्णतः खिलती है; वाणी वाग्मी और प्रभावशाली। व्यापार और वाणिज्य अपनी ऊंचाई पर। लेखन, शिक्षण से यश और धन। बुद्धि और विश्लेषणात्मक क्षमता हर क्षेत्र में सेवा करती है।' },
          4: { en: 'Jupiter in PKN — The highest of all PKN blessings. Wisdom, spiritual growth, and prosperity are enormously amplified. Children are joyful and carry forward blessings. Financial gains through dharmic channels. Guru\'s grace is overwhelmingly strong; spiritual progress is swift. The entire chart benefits from Jupiter in PKN.', hi: 'बृहस्पति पुष्कर नवांश में — सर्वोच्च पुष्कर आशीर्वाद। ज्ञान, आध्यात्मिक विकास और समृद्धि अत्यधिक बढ़ती है। संतान आनंदमय। धर्मी मार्ग से धनलाभ। गुरु कृपा अत्यंत बलवान। पूरी कुंडली इससे लाभान्वित होती है।' },
          5: { en: 'Venus in PKN — Love and partnership reach their fullest, most beautiful expression. Artistic genius emerges naturally — music, poetry, visual arts. Marriage is harmonious; the spouse is gifted. Luxury, aesthetic pleasure, and beauty are fully enjoyed. Social grace attracts abundance and goodwill from all directions.', hi: 'शुक्र पुष्कर नवांश में — प्रेम और साझेदारी अपनी परिपूर्णता पर। कलात्मक प्रतिभा स्वाभाविक रूप से उभरती है। विवाह सौहार्दपूर्ण; जीवनसाथी प्रतिभाशाली। विलासिता और सौंदर्य पूर्णतः भोगे जाते हैं। सामाजिक आकर्षण प्रचुरता लाता है।' },
          6: { en: 'Saturn in PKN — Hard work reaches full fruition without being wasted or stolen. Patience is rewarded with lasting, respected achievement. Service to the downtrodden earns honour. Longevity and physical endurance are protected. Karmic debts are cleared methodically — suffering comes, but not catastrophically, and yields wisdom.', hi: 'शनि पुष्कर नवांश में — कठोर परिश्रम बिना बर्बाद हुए परिणाम देता है। धैर्य को स्थायी, सम्मानित उपलब्धि से पुरस्कृत। वंचितों की सेवा को सम्मान। दीर्घायु। कार्मिक ऋण व्यवस्थित रूप से चुकाए जाते हैं।' },
          7: { en: 'Rahu in PKN — Unconventional ambitions find their highest expression and succeed beyond ordinary measures. Foreign connections, technology, and research flourish without undue disruption. Mass influence and social impact are amplified. The shadow\'s hunger finds constructive channels rather than destructive obsession.', hi: 'राहु पुष्कर नवांश में — अपरम्परागत महत्वाकांक्षाएं सर्वोच्च अभिव्यक्ति पाती हैं। विदेश, प्रौद्योगिकी, शोध सफल। जन-प्रभाव और सामाजिक प्रभाव बढ़ा। छाया की भूख विनाशकारी जुनून के बजाय रचनात्मक मार्ग पाती है।' },
          8: { en: 'Ketu in PKN — Past-life gifts bloom into extraordinary, unexplained abilities. Spiritual liberation is accelerated; moksha is near or already within reach. Occult knowledge, intuition, and psychic gifts are amplified beyond ordinary measure. The soul completes significant karma in this life and moves toward completion.', hi: 'केतु पुष्कर नवांश में — पूर्वजन्म की प्रतिभाएं असाधारण क्षमताओं में खिलती हैं। आध्यात्मिक मुक्ति त्वरित; मोक्ष निकट। गुप्त विद्या, अंतर्ज्ञान, मानसिक शक्तियां बढ़ती हैं। आत्मा इस जीवन में महत्वपूर्ण कर्म पूर्ण करती है।' },
        };
        const pknPlanets = kundali.planets.filter(p => p.isPushkarNavamsha);
        const pkbPlanets = kundali.planets.filter(p => p.isPushkarBhaga);
        if (pknPlanets.length === 0 && pkbPlanets.length === 0) return null;
        return (
        <div className="rounded-xl bg-gradient-to-br from-[#0e1a0a]/60 via-[#0a0e27]/80 to-[#0a0e27] border border-emerald-500/20 p-5 space-y-4">
          <h4 className="text-emerald-400 text-sm uppercase tracking-widest font-bold">
            {isHi ? 'पुष्कर नवांश + पुष्कर भाग' : 'Pushkar Navamsha + Pushkar Bhaga'}
          </h4>
          {pknPlanets.length > 0 && (
            <div>
              <div className="text-sky-300 text-xs font-bold mb-1.5 uppercase tracking-wider">
                {isHi ? 'पुष्कर नवांश (PKN) — 24 अत्यंत शुभ नवांश स्थितियाँ' : 'Pushkar Navamsha (PKN) — 24 supremely auspicious navamsha positions'}
              </div>
              <p className="text-text-secondary/75 text-xs leading-relaxed mb-3" style={isDevanagari ? { fontFamily: 'var(--font-devanagari-body)' } : undefined}>
                {isHi
                  ? 'जब कोई ग्रह पुष्कर नवांश में हो, तो उसकी स्थिति शुभ फल देती है — यहाँ तक कि नीच या अस्त ग्रह भी सुरक्षित रहता है। नीचे प्रत्येक PKN ग्रह का विशिष्ट फल दर्शाया गया है।'
                  : 'A planet in Pushkar Navamsha gives auspicious results even if debilitated or combust — the navamsha protects it. Below are classical per-planet interpretations (Saravali tradition).'}
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
                          {profile[!isDevanagariLocale(locale) ? 'en' : 'hi']}
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
                {isHi ? 'पुष्कर भाग (PKB) — प्रत्येक राशि में सर्वाधिक शुभ अंश' : 'Pushkar Bhaga (PKB) — single most auspicious degree per sign'}
              </div>
              <p className="text-text-secondary/75 text-xs leading-relaxed mb-2" style={isDevanagari ? { fontFamily: 'var(--font-devanagari-body)' } : undefined}>
                {isHi
                  ? 'पुष्कर भाग प्रत्येक राशि में सर्वाधिक पवित्र अंश है। यहाँ स्थित ग्रह असाधारण शक्ति पाता है। विशेष रूप से मुहूर्त में: जब चन्द्रमा पुष्कर भाग पर हो, तो मुहूर्त की ताकत चरम पर होती है।'
                  : 'Pushkar Bhaga is the single most sacred degree in each sign (±0.8° orb). A planet here gains extraordinary strength. For muhurta: Moon at Pushkar Bhaga is the pinnacle of muhurta power in that sign.'}
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
            {isHi
              ? 'स्रोत: सरावली परम्परा। पुष्कर नवांश: 24 स्थितियाँ। पुष्कर भाग: एक अंश प्रति राशि।'
              : 'Source: Saravali tradition. PKN: 24 navamsha positions across 12 signs. PKB: one degree per sign.'}
          </p>
        </div>
        );
      })()}

      {/* How to use this */}
      <div className="rounded-xl bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 p-5 border border-emerald-500/15">
        <h4 className="text-emerald-400 text-xs uppercase tracking-widest font-bold mb-2">
          {isHi ? 'इसका उपयोग कैसे करें' : 'How to Use This Information'}
        </h4>
        <ul className="text-text-secondary text-xs leading-relaxed space-y-2">
          <li>
            {isHi
              ? `✦ अपने योगी ग्रह (${yogiPlanetName}) को बलवान रखें — इसका रत्न धारण करें, इसके दिन उपवास/दान करें।`
              : `✦ Keep your Yogi Planet (${yogiPlanetName}) strong — wear its gemstone, fast/donate on its day.`}
          </li>
          <li>
            {isHi
              ? `✦ अवयोगी ग्रह (${avayogiPlanetName}) की दशा/गोचर में सावधान रहें — बड़े निर्णयों से पहले सोचें।`
              : `✦ Be cautious during Avayogi Planet (${avayogiPlanetName}) dasha/transit — think twice before major decisions.`}
          </li>
          <li>
            {isHi
              ? '✦ जब बृहस्पति आपके योगी बिंदु के ±5° के भीतर गोचर करे, तो नए कार्य आरम्भ करें — यह आपका सबसे शुभ काल है।'
              : '✦ When Jupiter transits within ±5° of your Yogi Point, start new ventures — this is your MOST auspicious transit window.'}
          </li>
          <li>
            {isHi
              ? '✦ मृत्यु स्फुट = मृत्यु नहीं। यह केवल शारीरिक संवेदनशीलता का बिंदु है। स्वास्थ्य जांच और सावधानी बरतें।'
              : '✦ Mrityu Sphuta ≠ death prediction. It only indicates a health-sensitive degree. Get regular checkups and practice preventive care when planets transit this point.'}
          </li>
        </ul>
      </div>
    </div>
  );
}
