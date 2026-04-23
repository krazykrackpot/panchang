'use client';

import { tl } from '@/lib/utils/trilingual';
import { useMemo } from 'react';
import { GrahaIconById } from '@/components/icons/GrahaIcons';
import { computePersonalTransits, computeUpcomingTransitions } from '@/lib/transit/personal-transits';
import { analyzeDoubleTransit } from '@/lib/transit/gochara-engine';


interface TransitRadarProps {
  ascendantSign: number;
  savTable: number[];
  locale: string;
  natalMoonSign?: number;
  reducedBav?: number[][];
}


const LABELS = {
  title: { en: "Transit Radar — What's Activating Your Chart", hi: "गोचर राडार — आपकी कुण्डली पर वर्तमान प्रभाव", sa: "गोचर राडार — आपकी कुण्डली पर वर्तमान प्रभाव", ta: "கோசார ரேடார் — உங்கள் ஜாதகத்தில் செயல்படுவது", bn: "গোচর রাডার — আপনার কুণ্ডলীতে বর্তমান প্রভাব" },
  subtitle: { en: 'Current slow-planet positions mapped to your Ashtakavarga strength', hi: 'धीमे ग्रहों की वर्तमान स्थिति और आपकी अष्टकवर्ग शक्ति', sa: 'धीमे ग्रहों की वर्तमान स्थिति और आपकी अष्टकवर्ग शक्ति', ta: 'மெதுவான கிரகங்களின் நிலை மற்றும் உங்கள் அஷ்டகவர்க்க வலிமை', bn: 'ধীর গ্রহের বর্তমান অবস্থান এবং আপনার অষ্টকবর্গ শক্তি' },
  upcoming: { en: 'Upcoming Sign Changes (Next 6 Months)', hi: 'आगामी परिवर्तन (अगले 6 माह)', sa: 'आगामी परिवर्तन (अगले 6 माह)', ta: 'வரவிருக்கும் ராசி மாற்றங்கள் (அடுத்த 6 மாதங்கள்)', bn: 'আসন্ন রাশি পরিবর্তন (পরবর্তী ৬ মাস)' },
};

const I18N = {
  vedha: { en: 'Vedha', hi: 'वेध', ta: 'வேதா', bn: 'বেধ' },
  favorable: { en: 'Favorable', hi: 'शुभ', ta: 'சுபம்', bn: 'শুভ' },
  fromMoon: { en: 'from Moon', hi: 'चंद्र से', ta: 'சந்திரனிலிருந்து', bn: 'চন্দ্র থেকে' },
  gocharaFavorable: { en: ' — Gochara favorable', hi: ' — गोचर अनुकूल', ta: ' — கோசாரம் சுபம்', bn: ' — গোচর অনুকূল' },
  obstructedByVedha: { en: ' — obstructed by Vedha', hi: ' — वेध से बाधित', ta: ' — வேதாவால் தடைபட்டது', bn: ' — বেধ দ্বারা বাধিত' },
  doubleTransitTitle: { en: 'Double Transit — Jupiter + Saturn', hi: 'द्वि-गोचर सक्रिय — गुरु + शनि', ta: 'இரட்டை கோசாரம் — குரு + சனி', bn: 'দ্বৈত গোচর — বৃহস্পতি + শনি' },
  doubleTransitDesc: {
    en: 'Both Jupiter and Saturn activate these houses by aspect or placement — events in these life areas may manifest.',
    hi: 'गुरु और शनि दोनों इन भावों को दृष्टि/स्थिति से सक्रिय कर रहे हैं — इन क्षेत्रों में घटनाएं प्रकट हो सकती हैं।',
    ta: 'குரு மற்றும் சனி இரண்டும் இந்த பாவங்களை பார்வை/நிலையால் செயல்படுத்துகின்றன — இந்த வாழ்க்கைப் பகுதிகளில் நிகழ்வுகள் வெளிப்படலாம்.',
    bn: 'বৃহস্পতি এবং শনি উভয়ই এই ভাবগুলিকে দৃষ্টি/অবস্থান দ্বারা সক্রিয় করছে — এই জীবন ক্ষেত্রে ঘটনা প্রকাশ পেতে পারে।',
  },
} satisfies Record<string, Record<string, string>>;

const HOUSE_DOMAINS: Record<number, Record<string, string>> = {
  1: { en: 'Self, health, new beginnings', hi: 'आत्मा, स्वास्थ्य, नई शुरुआत', ta: 'சுயம், ஆரோக்கியம், புதிய தொடக்கம்', bn: 'আত্মা, স্বাস্থ্য, নতুন সূচনা' },
  2: { en: 'Wealth, family, speech', hi: 'धन, परिवार, वाणी', ta: 'செல்வம், குடும்பம், வாக்கு', bn: 'ধন, পরিবার, বাণী' },
  3: { en: 'Courage, siblings, short travels', hi: 'साहस, भाई-बहन, लघु यात्रा', ta: 'தைரியம், உடன்பிறப்புகள், குறுகிய பயணம்', bn: 'সাহস, ভাই-বোন, ছোট যাত্রা' },
  4: { en: 'Home, mother, property, comfort', hi: 'घर, माता, सम्पत्ति, सुख', ta: 'இல்லம், தாய், சொத்து, சுகம்', bn: 'গৃহ, মাতা, সম্পত্তি, সুখ' },
  5: { en: 'Children, education, creativity', hi: 'संतान, शिक्षा, रचनात्मकता', ta: 'குழந்தைகள், கல்வி, படைப்பாற்றல்', bn: 'সন্তান, শিক্ষা, সৃজনশীলতা' },
  6: { en: 'Health challenges, enemies, service', hi: 'स्वास्थ्य चुनौती, शत्रु, सेवा', ta: 'ஆரோக்கிய சவால், பகைவர், சேவை', bn: 'স্বাস্থ্য চ্যালেঞ্জ, শত্রু, সেবা' },
  7: { en: 'Marriage, partnerships, business', hi: 'विवाह, साझेदारी, व्यापार', ta: 'திருமணம், கூட்டாண்மை, வணிகம்', bn: 'বিবাহ, অংশীদারিত্ব, ব্যবসা' },
  8: { en: 'Transformation, longevity, sudden events', hi: 'परिवर्तन, आयु, अचानक घटनाएं', ta: 'மாற்றம், ஆயுள், திடீர் நிகழ்வுகள்', bn: 'রূপান্তর, আয়ু, আকস্মিক ঘটনা' },
  9: { en: 'Fortune, dharma, higher learning', hi: 'भाग्य, धर्म, उच्च शिक्षा', ta: 'பாக்கியம், தர்மம், உயர் கல்வி', bn: 'ভাগ্য, ধর্ম, উচ্চ শিক্ষা' },
  10: { en: 'Career, reputation, authority', hi: 'करियर, प्रतिष्ठा, अधिकार', ta: 'தொழில், புகழ், அதிகாரம்', bn: 'কর্মজীবন, সুনাম, কর্তৃত্ব' },
  11: { en: 'Gains, income, aspirations', hi: 'लाभ, आय, आकांक्षाएं', ta: 'லாபம், வருமானம், அபிலாஷைகள்', bn: 'লাভ, আয়, আকাঙ্ক্ষা' },
  12: { en: 'Expenses, moksha, foreign lands', hi: 'व्यय, मोक्ष, विदेश', ta: 'செலவு, மோட்சம், வெளிநாடு', bn: 'ব্যয়, মোক্ষ, বিদেশ' },
};

export default function TransitRadar({ ascendantSign, savTable, locale, natalMoonSign, reducedBav }: TransitRadarProps) {
  const transits = useMemo(
    () => computePersonalTransits(ascendantSign, savTable, natalMoonSign, reducedBav),
    [ascendantSign, savTable, natalMoonSign, reducedBav]
  );
  const upcoming = useMemo(() => computeUpcomingTransitions(), []);

  if (transits.length === 0) return null;

  const QUALITY_STYLES: Record<string, { bg: string; border: string; text: string }> = {
    strong: { bg: 'bg-emerald-500/10', border: 'border-emerald-500/20', text: 'text-emerald-400' },
    moderate: { bg: 'bg-amber-500/10', border: 'border-amber-500/20', text: 'text-amber-400' },
    neutral: { bg: 'bg-amber-500/10', border: 'border-amber-500/20', text: 'text-amber-400' },
    weak: { bg: 'bg-red-500/10', border: 'border-red-500/20', text: 'text-red-400' },
    adverse: { bg: 'bg-red-500/10', border: 'border-red-500/20', text: 'text-red-400' },
  };

  return (
    <section className="rounded-xl bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 overflow-hidden">
      {/* Header */}
      <div className="px-6 sm:px-8 pt-6 sm:pt-8 pb-4">
        <h3 className="text-xl text-gold-light font-bold">
          {tl(LABELS.title, locale)}
        </h3>
        <p className="text-text-secondary/60 text-xs mt-1">
          {tl(LABELS.subtitle, locale)}
        </p>
      </div>

      {/* Transit rows */}
      <div className="px-6 sm:px-8 pb-4 space-y-3">
        {transits.map(t => {
          // Blend SAV quality with Gochara quality — use the more favorable of the two.
          // Gochara alone is too harsh (most houses are "bad"), SAV alone ignores classical rules.
          // Ranking: strong > moderate/neutral > weak > adverse
          const QUALITY_RANK: Record<string, number> = { strong: 4, moderate: 3, neutral: 3, weak: 2, adverse: 1 };
          const savRank = QUALITY_RANK[t.quality] ?? 3;
          const gocharaRank = t.gocharaQuality ? (QUALITY_RANK[t.gocharaQuality] ?? 3) : savRank;
          const blendedRank = Math.max(savRank, gocharaRank);
          // If Gochara says favorable (good house + no vedha), boost to strong
          const effectiveQuality = t.isGoodHouse && !t.vedhaActive ? 'strong'
            : t.vedhaActive ? 'adverse'
            : blendedRank >= 4 ? 'strong'
            : blendedRank >= 3 ? 'neutral'
            : blendedRank >= 2 ? 'weak'
            : 'adverse';
          const style = QUALITY_STYLES[effectiveQuality] || QUALITY_STYLES.neutral;
          return (
            <div key={t.planetId} className={`flex items-center gap-3 p-3 rounded-xl ${style.bg} border ${style.border}`}>
              <div className="w-10 h-10 rounded-lg bg-bg-primary/50 border border-white/10 flex items-center justify-center shrink-0">
                <GrahaIconById id={t.planetId} size={22} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-bold text-sm" style={{ color: t.planetColor }}>
                    {tl(t.planetName, locale)}
                  </span>
                  <span className="text-text-secondary/60 text-xs">
                    → {tl(t.signName, locale)} (H{t.house})
                  </span>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${style.text} ${style.bg} border ${style.border}`}>
                    {t.savBindu} bindu
                  </span>
                  {/* Gochara annotations */}
                  {t.houseFromMoon !== undefined && (
                    <span className="text-[10px] text-text-secondary ml-1">
                      H{t.houseFromMoon}<span className="text-text-secondary/40"> {tl(I18N.fromMoon, locale)}</span>
                    </span>
                  )}
                  {t.vedhaActive && (
                    <span className="ml-1.5 px-1.5 py-0.5 rounded text-[9px] font-medium bg-red-500/15 text-red-400 border border-red-500/20">
                      {tl(I18N.vedha, locale)}
                      {t.vedhaPlanetName ? ` (${t.vedhaPlanetName})` : ''}
                    </span>
                  )}
                  {t.isGoodHouse === true && !t.vedhaActive && (
                    <span className="ml-1.5 px-1.5 py-0.5 rounded text-[9px] font-medium bg-emerald-500/15 text-emerald-400 border border-emerald-500/20">
                      {tl(I18N.favorable, locale)}
                    </span>
                  )}
                  {t.bavScore !== undefined && (
                    <span className="ml-1 text-[9px] text-text-secondary/60">
                      BAV:{t.bavScore}
                    </span>
                  )}
                </div>
                <p className="text-text-secondary/75 text-xs mt-0.5 truncate">
                  {tl(t.interpretation, locale)}
                  {t.isGoodHouse === true && !t.vedhaActive && tl(I18N.gocharaFavorable, locale)}
                  {t.vedhaActive && tl(I18N.obstructedByVedha, locale)}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Double Transit section */}
      {natalMoonSign !== undefined && (() => {
        const jupiterSign = transits.find(t => t.planetId === 4)?.currentSign;
        const saturnSign = transits.find(t => t.planetId === 6)?.currentSign;
        if (!jupiterSign || !saturnSign) return null;

        const doubleTransits = analyzeDoubleTransit(jupiterSign, saturnSign, natalMoonSign);
        const active = doubleTransits.filter(d => d.doubleTransitActive);
        if (active.length === 0) return null;

        return (
          <div className="mx-6 sm:mx-8 mb-4 pt-4 border-t border-gold-primary/10">
            <h4 className="text-gold-dark text-[10px] uppercase tracking-wider font-bold mb-2">
              {tl(I18N.doubleTransitTitle, locale)}
            </h4>
            <p className="text-text-secondary/60 text-[9px] mb-2">
              {tl(I18N.doubleTransitDesc, locale)}
            </p>
            <div className="space-y-1.5">
              {active.map(d => {
                const domain = HOUSE_DOMAINS[d.house] || HOUSE_DOMAINS[1];
                return (
                  <div key={d.house} className="flex items-center gap-2 px-3 py-2 rounded-lg bg-purple-500/8 border border-purple-500/15">
                    <span className="text-purple-300 font-bold text-sm w-8">H{d.house}</span>
                    <span className="text-text-secondary text-xs">{tl(domain, locale)}</span>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })()}

      {/* Upcoming transitions */}
      {upcoming.length > 0 && (
        <div className="px-6 sm:px-8 pb-6 sm:pb-8">
          <h4 className="text-gold-dark text-xs uppercase tracking-wider font-bold mb-2">
            {tl(LABELS.upcoming, locale)}
          </h4>
          <div className="space-y-1.5">
            {upcoming.map((u, i) => (
              <div key={i} className="flex items-center gap-2 text-xs text-text-secondary/70">
                <GrahaIconById id={u.planetId} size={14} />
                <span className="font-medium text-text-secondary">
                  {tl(u.planetName, locale)}
                </span>
                <span>→</span>
                <span className="text-gold-light">{tl(u.toSign, locale)}</span>
                <span className="text-text-secondary/50 ml-auto">{u.approximateDate}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
