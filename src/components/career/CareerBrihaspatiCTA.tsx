'use client';

/**
 * Brihaspati hand-off CTA shown at the bottom of every Career Muhurta
 * activity landing page (per spec §13 Q3 — user opted "Yes" 2026-05-27).
 *
 * The CTA pre-fills the Brihaspati panel's question input with a context-
 * aware template ("I have a job interview coming up — what does my chart
 * say about its outcome?") so the user lands in a productive starting
 * state rather than a blank prompt.
 *
 * Implementation: dispatches the BRIHASPATI_OPEN_EVENT window event the
 * same way <BrihaspatiHomeBanner> does — this component renders outside
 * the BrihaspatiProvider subtree on the career-muhurta route tree, so
 * we can't call useBrihaspati() directly.
 *
 * Credit handling is the Provider's responsibility; this component just
 * triggers open + question. The Provider's existing balance logic shows
 * the price + free-with-plan tier to the user.
 */
import { useLocale } from 'next-intl';
import { Sparkles } from 'lucide-react';
import { BrihaspatiAvatar } from '@/components/brihaspati/BrihaspatiAvatar';
import { BRIHASPATI_OPEN_EVENT, type BrihaspatiOpenEventDetail } from '@/components/brihaspati/events';
import { CAREER_CONTENT } from '@/lib/career/career-content';
import type { CareerActivityId } from '@/types/muhurta-ai';
import { tl } from '@/lib/utils/trilingual';

const PROMPT_TEMPLATE: Record<CareerActivityId, { en: string; hi: string; ta: string }> = {
  job_interview: {
    en: 'I have a job interview coming up. What does my chart say about its outcome, and what should I do to maximise my chances?',
    hi: 'मेरा नौकरी इंटरव्यू आ रहा है। मेरी कुण्डली परिणाम के बारे में क्या कहती है, और मैं अपनी सम्भावनाएँ कैसे बढ़ा सकता हूँ?',
    ta: 'எனக்கு வேலை நேர்காணல் வரப்போகிறது. என் ஜாதகம் அதன் முடிவைப் பற்றி என்ன கூறுகிறது, என் வாய்ப்புகளை எவ்வாறு அதிகரிக்கலாம்?',
  },
  job_application: {
    en: 'I am applying for new jobs. Which sectors and roles does my chart favour right now, and how should I time the applications?',
    hi: 'मैं नई नौकरियों के लिए आवेदन कर रहा हूँ। मेरी कुण्डली अभी किन क्षेत्रों और भूमिकाओं को अनुकूल मानती है, और मुझे आवेदन कब करना चाहिए?',
    ta: 'நான் புதிய வேலைகளுக்கு விண்ணப்பிக்கிறேன். என் ஜாதகம் இப்போது எந்தத் துறைகள் மற்றும் பாத்திரங்களை ஆதரிக்கிறது?',
  },
  salary_negotiation: {
    en: 'I am preparing for a salary negotiation. What does my chart suggest about my wealth potential at this stage, and how should I approach the conversation?',
    hi: 'मैं वेतन वार्ता की तैयारी कर रहा हूँ। मेरी कुण्डली इस चरण में मेरी धन सम्भावना के बारे में क्या सुझाव देती है, और मुझे बातचीत कैसे करनी चाहिए?',
    ta: 'நான் ஊதிய பேச்சுவார்த்தைக்குத் தயாராகிறேன். இந்தக் கட்டத்தில் என் செல்வச் சாத்தியக்கூறு பற்றி என் ஜாதகம் என்ன கூறுகிறது?',
  },
  contract_signing: {
    en: 'I have a contract or offer to sign. Is this the right step for me according to my chart, and what should I watch out for in the terms?',
    hi: 'मेरे पास हस्ताक्षर करने के लिए एक अनुबंध या प्रस्ताव है। क्या यह मेरी कुण्डली के अनुसार मेरे लिए सही कदम है?',
    ta: 'எனக்கு கையெழுத்திட ஒரு ஒப்பந்தம் அல்லது வாய்ப்பு உள்ளது. என் ஜாதகத்தின் படி இது எனக்கு சரியான படியா?',
  },
  first_day_at_job: {
    en: 'I am starting a new job soon. What does my chart suggest about how this role will unfold, and how should I introduce myself in the first weeks?',
    hi: 'मैं जल्द ही नई नौकरी शुरू कर रहा हूँ। मेरी कुण्डली इस भूमिका के विकास के बारे में क्या सुझाव देती है, और पहले हफ्तों में मैं कैसे परिचय दूँ?',
    ta: 'நான் விரைவில் புதிய வேலையை ஆரம்பிக்கிறேன். இந்த பாத்திரம் எவ்வாறு உருவாகும் என்பதைப் பற்றி என் ஜாதகம் என்ன கூறுகிறது?',
  },
  resignation: {
    en: 'I am thinking of resigning from my current role. What does my chart say about the timing and the path forward after I leave?',
    hi: 'मैं अपनी वर्तमान भूमिका से त्यागपत्र देने के बारे में सोच रहा हूँ। मेरी कुण्डली समय और छोड़ने के बाद आगे के मार्ग के बारे में क्या कहती है?',
    ta: 'நான் என் தற்போதைய பாத்திரத்திலிருந்து விலகுவது பற்றி யோசிக்கிறேன். நேரம் மற்றும் வெளியேறிய பிறகான பாதை பற்றி என் ஜாதகம் என்ன கூறுகிறது?',
  },
  business_launch: {
    en: 'I am planning to launch a business. What does my chart say about my entrepreneurial timing, the kind of business that suits me, and the year ahead?',
    hi: 'मैं एक व्यापार आरम्भ करने की योजना बना रहा हूँ। मेरी कुण्डली मेरे उद्यमी समय, मेरे लिए उपयुक्त व्यापार और आगामी वर्ष के बारे में क्या कहती है?',
    ta: 'நான் ஒரு வியாபாரத்தைத் தொடங்கத் திட்டமிடுகிறேன். என் தொழில்முனைவோர் நேரம், எனக்கு ஏற்ற வியாபாரம் பற்றி என் ஜாதகம் என்ன கூறுகிறது?',
  },
  asking_promotion: {
    en: 'I am considering asking for a promotion. What does my chart suggest about my current standing at work, and is now the right time to make the ask?',
    hi: 'मैं पदोन्नति माँगने पर विचार कर रहा हूँ। मेरी कुण्डली कार्यस्थल पर मेरी वर्तमान स्थिति के बारे में क्या सुझाव देती है, और क्या अभी अनुरोध करने का सही समय है?',
    ta: 'நான் பதவி உயர்வைக் கேட்பதைப் பற்றி யோசிக்கிறேன். வேலையில் என் தற்போதைய நிலையைப் பற்றி என் ஜாதகம் என்ன கூறுகிறது?',
  },
};

const COPY = {
  en: { eyebrow: 'Ask the Sage', headline: 'Get a personalised reading on your situation', sub: 'Brihaspati uses your birth chart to answer your specific question — not just the general muhurta.', cta: 'Ask Brihaspati' },
  hi: { eyebrow: 'ऋषि से पूछें', headline: 'अपनी स्थिति पर व्यक्तिगत पठन प्राप्त करें', sub: 'बृहस्पति आपकी जन्म कुण्डली का उपयोग आपके विशिष्ट प्रश्न का उत्तर देने के लिए करते हैं — केवल सामान्य मुहूर्त नहीं।', cta: 'बृहस्पति से पूछें' },
  ta: { eyebrow: 'முனிவரிடம் கேளுங்கள்', headline: 'உங்கள் சூழ்நிலையில் தனிப்பயனாக்கப்பட்ட வாசிப்பைப் பெறுங்கள்', sub: 'பிருஹஸ்பதி உங்கள் ஜாதகத்தைப் பயன்படுத்தி உங்கள் குறிப்பிட்ட கேள்விக்குப் பதிலளிக்கிறார் — பொதுவான முகூர்த்தம் மட்டும் அல்ல.', cta: 'பிருஹஸ்பதியிடம் கேளுங்கள்' },
};

function pickCopy(locale: string): typeof COPY['en'] {
  if (locale === 'ta') return COPY.ta;
  if (locale === 'hi' || locale === 'sa' || locale === 'mai' || locale === 'mr') return COPY.hi;
  return COPY.en;
}

function pickPrompt(activityId: CareerActivityId, locale: string): string {
  const tpl = PROMPT_TEMPLATE[activityId];
  if (locale === 'ta') return tpl.ta;
  if (locale === 'hi' || locale === 'sa' || locale === 'mai' || locale === 'mr') return tpl.hi;
  return tpl.en;
}

export default function CareerBrihaspatiCTA({ activityId }: { activityId: CareerActivityId }) {
  const locale = useLocale();
  const L = pickCopy(locale);
  const c = CAREER_CONTENT[activityId];

  const open = () => {
    if (typeof window === 'undefined') return;
    const detail: BrihaspatiOpenEventDetail = {
      entry: 'banner', // closest existing entry value; telemetry can refine later
      question: pickPrompt(activityId, locale),
    };
    window.dispatchEvent(new CustomEvent(BRIHASPATI_OPEN_EVENT, { detail }));
  };

  return (
    <section
      aria-label={L.headline}
      className="mt-10 rounded-2xl border border-gold-primary/30 bg-gradient-to-r from-[#3a2880]/70 via-[#2d1b69]/65 to-[#1a1040]/70 p-5 sm:p-6"
    >
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <div
          className="shrink-0 rounded-full overflow-hidden border-2 border-gold-primary/60 shadow-[0_0_20px_rgba(212,168,83,0.35)] bg-gradient-to-br from-[#f0d48a] via-[#d4a853] to-[#8a6d2b]"
          style={{ width: 56, height: 56 }}
          aria-hidden="true"
        >
          <BrihaspatiAvatar size={56} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-gold-primary/90 text-[10px] uppercase tracking-[0.18em] font-semibold flex items-center gap-1.5">
            <Sparkles size={12} />
            {L.eyebrow}
          </p>
          <h3 className="text-gold-light text-lg sm:text-xl font-bold mt-1 leading-snug">
            {L.headline}
          </h3>
          <p className="text-text-secondary text-sm mt-1.5 leading-relaxed">
            {L.sub}{' '}
            <span className="text-text-secondary/70">({tl(c.name, locale)}.)</span>
          </p>
        </div>
        <button
          type="button"
          onClick={open}
          className="shrink-0 px-5 py-2.5 rounded-lg bg-gold-primary text-bg-primary font-semibold text-sm hover:bg-gold-light transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-gold-light"
        >
          {L.cta}
        </button>
      </div>
    </section>
  );
}
