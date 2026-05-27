'use client';

import { useLocale } from 'next-intl';
import { Link } from '@/lib/i18n/navigation';
import LessonSection from '@/components/learn/LessonSection';
import KeyTakeaway from '@/components/learn/KeyTakeaway';
import WhyItMatters from '@/components/learn/WhyItMatters';
import BeginnerNote from '@/components/learn/BeginnerNote';
import ClassicalReference from '@/components/learn/ClassicalReference';
import { isIndicLocale, getBodyFont } from '@/lib/utils/locale-fonts';
import { CAREER_CONTENT } from '@/lib/career/career-content';
import { CAREER_ACTIVITY_IDS } from '@/types/muhurta-ai';
import { tl } from '@/lib/utils/trilingual';
import { Briefcase, ShieldAlert, Star, Clock } from 'lucide-react';

/**
 * Learn page for Career Muhurta — explains the classical theory behind
 * the per-activity rules and the engine's hard-veto logic.
 *
 * Companion to the curriculum entry in MODULE_SEQUENCE (phase 3, Time
 * Divisions). Phase 1+2 of the Career Muhurta build per
 * docs/superpowers/specs/2026-05-27-career-muhurta-design.md.
 */
export default function LearnCareerMuhurtaPage() {
  const locale = useLocale();
  const isHi = isIndicLocale(locale);
  const bf = isHi ? getBodyFont(locale) || {} : {};
  const isTa = locale === 'ta';

  const title = isTa
    ? 'தொழில் முகூர்த்தம் — பாரம்பரிய கோட்பாடு'
    : isHi
      ? 'करियर मुहूर्त — शास्त्रीय सिद्धान्त'
      : 'Career Muhurta — Classical Theory';

  const subtitle = isTa
    ? 'எந்த நட்சத்திரம் எந்தத் தொழில் செயலுக்கு பொருந்தும், ஏன் ராகு காலம் கடின தடை, ஒவ்வொரு செயலின் வரைபடம்.'
    : isHi
      ? 'कौन सा नक्षत्र किस करियर कार्य के अनुकूल, राहु काल कठोर अवरोधक क्यों, और प्रत्येक कार्य का मानचित्र।'
      : 'Which nakshatra suits which career act, why Rahu Kaal is a hard block, and a map of each activity\'s preferences.';

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gold-gradient mb-2" style={{ fontFamily: 'var(--font-heading)' }}>
          {title}
        </h1>
        <p className="text-text-secondary" style={bf}>{subtitle}</p>
      </div>

      <KeyTakeaway locale={locale} points={[
        isTa ? 'தொழில் முகூர்த்தம் ஏற்கனவே உள்ள 20-செயல் முகூர்த்த AI இயந்திரத்தை 8 தொழில் சார்ந்த உள்ளீடுகளுடன் விரிவாக்குகிறது — ஒரே இயந்திரம், புதிய களம்.'
          : isHi ? 'करियर मुहूर्त मौजूदा 20-गतिविधि मुहूर्त AI इंजन को 8 करियर-विशिष्ट प्रविष्टियों के साथ विस्तारित करता है — एक ही इंजन, नया क्षेत्र।'
          : 'Career Muhurta extends the existing 20-activity Muhurta AI engine with 8 career-specific entries — same engine, new domain.',
        isTa ? 'ஒவ்வொரு செயலுக்கும் முகூர்த்த சிந்தாமணி அத். 4, பிருஹத் சம்ஹிதை அத். 105, மற்றும் பி.வி. ராமனின் முகூர்த்தா அத். 12-13-இலிருந்து பெறப்பட்ட சொந்த நட்சத்திர / திதி / வாரம் / ஹோரை விருப்பத்தேர்வுகள் உள்ளன.'
          : isHi ? 'प्रत्येक गतिविधि के लिए मुहूर्त चिन्तामणि अध्याय 4, बृहत् संहिता अध्याय 105, और बी.वी. रमन की मुहूर्ता अध्याय 12-13 से प्राप्त अपने नक्षत्र / तिथि / वार / होरा वरीयताएँ हैं।'
          : 'Every activity has its own nakshatra / tithi / weekday / hora preferences sourced from Muhurta Chintamani Ch. 4, Brihat Samhita Ch. 105, and B.V. Raman\'s Muhurtha Ch. 12-13.',
        isTa ? 'ராகு காலம், யமகண்டம், குலிக காலம், விஷ்டி கரணம் ஆகியவை முழுமையான தடைகள் — அவை ஒவ்வொரு சாதகக் காரணியையும் கடந்து செயல்படுகின்றன, விதிவிலக்கு இல்லை.'
          : isHi ? 'राहु काल, यमगण्ड, गुलिक काल, और विष्टि करण निरपेक्ष निषेध हैं — वे प्रत्येक सकारात्मक कारक को रद्द कर देते हैं, कोई अपवाद नहीं।'
          : 'Rahu Kaal, Yamaganda, Gulika Kaal, and Vishti karana are absolute vetoes — they override every positive factor, no exceptions.',
      ]} />

      <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm text-text-secondary mb-4">
        <BeginnerNote
          term={isTa ? 'தொழில் முகூர்த்தம்' : isHi ? 'करियर मुहूर्त' : 'Career Muhurta'}
          explanation={isTa
            ? 'பாரம்பரிய முகூர்த்த சாஸ்திரத்தை தொழில் முடிவுகளுக்கு — வேலை நேர்காணல், ஒப்பந்தம், பதவி உயர்வு போன்றவை — பயன்படுத்துதல்.'
            : isHi
              ? 'शास्त्रीय मुहूर्त विज्ञान का करियर निर्णयों — नौकरी इंटरव्यू, अनुबंध, पदोन्नति आदि — पर अनुप्रयोग।'
              : 'Application of classical muhurta science to career decisions — job interviews, contracts, promotions, etc.'}
        />
        <BeginnerNote
          term={isTa ? 'சங்கல்பம்' : isHi ? 'सङ्कल्प' : 'Sankalpa'}
          explanation={isTa
            ? 'நோக்கம் கொண்ட செயலின் பாரம்பரிய கருத்தாக்கம் — ஒரு முகூர்த்தத்தை நங்கூரமிடும் தருணம் நீங்கள் கையெழுத்திடும் / சமர்ப்பிக்கும் / கேட்கும் தருணமே, மறுபக்கம் படிக்கும் தருணம் அல்ல.'
            : isHi
              ? 'इरादे-वाहक कार्य की शास्त्रीय अवधारणा — मुहूर्त को लंगर देने वाला क्षण हस्ताक्षर / प्रस्तुति / प्रश्न का क्षण है, दूसरे पक्ष द्वारा पढ़ने का नहीं।'
              : 'The classical concept of intent-bearing action — the moment that anchors a muhurta is the moment you sign / submit / ask, not the moment the other side reads it'}
        />
        <BeginnerNote
          term={isTa ? 'ஸ்திர நட்சத்திரம்' : isHi ? 'स्थिर नक्षत्र' : 'Sthira nakshatra'}
          explanation={isTa
            ? "\"நிலையான\" நட்சத்திரங்கள் (ரோகிணி, உத்திரம், உத்திராடம், உத்திரட்டாதி) — ஒப்பந்த கையெழுத்து மற்றும் புதிய பாத்திரங்களில் நுழைதல் போன்ற செயல்களுக்கு உகந்தவை."
            : isHi
              ? "'स्थिर' नक्षत्र (रोहिणी, उत्तरा फाल्गुनी, उत्तरा आषाढ़, उत्तरा भाद्रपद) — अनुबंध हस्ताक्षर और नई भूमिकाओं में प्रवेश जैसी गतिविधियों के लिए अनुकूल।"
              : "The 'fixed' nakshatras (Rohini, U.Phalguni, U.Ashadha, U.Bhadrapada) — preferred for activities like contract signing and entering new roles"}
        />
      </div>

      <LessonSection title={isTa ? 'பொதுவான கொள்கைகள்' : isHi ? 'सामान्य सिद्धान्त' : 'Core Principles'}>
        <p style={bf}>
          {isTa
            ? 'வைதீக ஜோதிட சாஸ்திரம் கூறுகிறது: ஒரு செயலின் தரம் அதன் சங்கல்ப தருணத்தின் வானியல் தரத்தை பிரதிபலிக்கிறது. ஒவ்வொரு தொழில் முடிவும் — விண்ணப்பம் அனுப்புவது, ஒப்பந்தத்தில் கையெழுத்திடுவது, பதவி உயர்வைக் கேட்பது — அதற்கான தனிப்பட்ட நட்சத்திர, திதி, வார, ஹோரை விருப்பத்தேர்வுகளுடன் வருகிறது. பாரம்பரிய நூல்கள் இவற்றை விரிவாக வரைபடப்படுத்துகின்றன.'
            : isHi
              ? 'वैदिक ज्योतिष शास्त्र कहता है: कार्य की गुणवत्ता उसके सङ्कल्प क्षण की ज्योतिषीय गुणवत्ता को प्रतिबिंबित करती है। प्रत्येक करियर निर्णय — आवेदन भेजना, अनुबंध हस्ताक्षर, पदोन्नति की मांग — अपनी विशिष्ट नक्षत्र/तिथि/वार/होरा वरीयताओं के साथ आता है। शास्त्रीय ग्रंथ इन्हें विस्तृत रूप से मानचित्रित करते हैं।'
              : 'Vedic muhurta tradition holds that the quality of an act reflects the astronomical quality of its sankalpa — the moment of intent. Every career decision (sending an application, signing a contract, asking for a promotion) comes with its own nakshatra/tithi/weekday/hora preferences. Classical texts map these in detail.'}
        </p>
        <p style={bf} className="mt-3">
          {isTa
            ? 'இந்த கருவி இந்த சாஸ்திர விதிகளை எடுத்து நம் மற்ற 20 செயல்கள் (திருமணம், கிரஹப்பிரவேசம், வாகனம், போன்றவை) அதே இயந்திரத்தின் வழியாக நடத்துகிறது — ஒரே வழி, புதிய களம்.'
            : isHi
              ? 'यह उपकरण इन शास्त्रीय नियमों को लेता है और हमारी अन्य 20 गतिविधियों (विवाह, गृह प्रवेश, वाहन, आदि) के समान इंजन के माध्यम से चलाता है — एक ही पथ, नया क्षेत्र।'
              : 'This tool takes those classical rules and runs them through the same engine as our other 20 activities (marriage, griha pravesh, vehicle, etc.) — one engine, new domain.'}
        </p>
      </LessonSection>

      <LessonSection number={1} title={isTa ? 'எட்டு தொழில் செயல்கள்' : isHi ? 'आठ करियर गतिविधियाँ' : 'The Eight Career Activities'} variant="highlight">
        <p style={bf}>
          {isTa
            ? 'ஒவ்வொரு செயலுக்கும் தனிப்பட்ட பக்கம் — பாரம்பரிய அடிப்படை, என்ன தவிர்க்க வேண்டும், அடுத்த 30 நாட்களின் முகூர்த்தம்.'
            : isHi
              ? 'प्रत्येक गतिविधि के लिए समर्पित पृष्ठ — शास्त्रीय आधार, क्या टालें, अगले 30 दिनों का मुहूर्त।'
              : 'Each activity has its own dedicated page — classical rationale, what to avoid, and a 30-day forward calendar.'}
        </p>
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
          {CAREER_ACTIVITY_IDS.map((id) => {
            const c = CAREER_CONTENT[id];
            return (
              <Link
                key={id}
                href={`/career-muhurta/${c.slug}`}
                className="block p-3 rounded-xl border border-gold-primary/15 bg-gradient-to-br from-[#2d1b69]/30 via-[#1a1040]/40 to-[#0a0e27] hover:border-gold-primary/40 transition-all"
              >
                <div className="flex items-center gap-2 mb-1">
                  <Briefcase size={14} className="text-gold-primary" />
                  <h3 className="text-gold-light font-semibold text-sm">{tl(c.name, locale)}</h3>
                </div>
                <p className="text-text-secondary text-xs italic">{c.classicalName.transliteration}</p>
              </Link>
            );
          })}
        </div>
      </LessonSection>

      <LessonSection number={2} title={isTa ? 'நட்சத்திர-வகை வாரியான விருப்பங்கள்' : isHi ? 'नक्षत्र-वर्ग के अनुसार वरीयताएँ' : 'Preferences by Nakshatra Class'}>
        <p style={bf}>
          {isTa
            ? 'பாரம்பரிய நூல்கள் 27 நட்சத்திரங்களை ஏழு வகைகளாக வகைப்படுத்துகின்றன — ஒவ்வொன்றும் வேறுபட்ட தன்மை. தொழில் முகூர்த்தம் இந்த வகைப்பாடுகளை நேரடியாக பயன்படுத்துகிறது.'
            : isHi
              ? 'शास्त्रीय ग्रंथ 27 नक्षत्रों को सात वर्गों में वर्गीकृत करते हैं — प्रत्येक का अलग स्वभाव। करियर मुहूर्त इन वर्गीकरणों का सीधे उपयोग करता है।'
              : 'Classical texts classify the 27 nakshatras into seven groups — each with a distinct character. Career Muhurta uses these classifications directly.'}
        </p>
        <ul className="mt-3 space-y-2 text-text-primary text-sm">
          <li>
            <strong className="text-gold-light">Sthira ({isTa ? 'நிலையான' : isHi ? 'स्थिर' : 'fixed'}):</strong>{' '}
            {isTa ? 'ரோகிணி (4), உத்திரம் (12), உத்திராடம் (21), உத்திரட்டாதி (26) — ஒப்பந்த கையெழுத்து + புதிய வேலையின் முதல் நாளுக்கு உகந்தவை (நிலைத்தன்மை).'
              : isHi ? 'रोहिणी (4), उत्तरा फाल्गुनी (12), उत्तरा आषाढ़ (21), उत्तरा भाद्रपद (26) — अनुबंध हस्ताक्षर + नई नौकरी के पहले दिन के लिए अनुकूल (स्थायित्व)।'
              : 'Rohini (4), U.Phalguni (12), U.Ashadha (21), U.Bhadrapada (26) — favoured for contract signing + first day at new job (permanence).'}
          </li>
          <li>
            <strong className="text-gold-light">Mrdu ({isTa ? 'மென்மை' : isHi ? 'मृदु' : 'soft'}):</strong>{' '}
            {isTa ? 'மிருகசீரிடம் (5), சித்திரை (14), அனுராதம் (17), ரேவதி (27) — பேச்சுவார்த்தை + வியாபார தொடக்கத்திற்கு உகந்தவை (உறவு கதகதப்பு).'
              : isHi ? 'मृगशिरा (5), चित्रा (14), अनुराधा (17), रेवती (27) — वार्ता + व्यापार आरम्भ के लिए अनुकूल (सम्बन्धात्मक ऊष्मा)।'
              : 'Mrigashira (5), Chitra (14), Anuradha (17), Revati (27) — favoured for negotiation + business launch (relational warmth).'}
          </li>
          <li>
            <strong className="text-gold-light">Kshipra ({isTa ? 'விரைவு' : isHi ? 'क्षिप्र' : 'swift'}):</strong>{' '}
            {isTa ? 'அஸ்வினி (1), பூசம் (8), அஸ்தம் (13) — பூசம் தொழிலுக்கு உலகளவில் சாதகம்; அஸ்வினியின் உந்துதல் பெரும்பாலான தொழில் பட்டியல்களில் இருந்து அதை விலக்கிவிடுகிறது.'
              : isHi ? 'अश्विनी (1), पुष्य (8), हस्त (13) — पुष्य सार्वभौमिक रूप से करियर के लिए अनुकूल; अश्विनी की आवेगशीलता उसे अधिकांश करियर सूचियों से बाहर रखती है।'
              : "Ashwini (1), Pushya (8), Hasta (13) — Pushya is universally career-favourable; Ashwini's impulsiveness keeps it out of most career lists."}
          </li>
          <li>
            <strong className="text-gold-light">Chara ({isTa ? 'நகரும்' : isHi ? 'चर' : 'moving'}):</strong>{' '}
            {isTa ? 'புனர்பூசம் (7), சுவாதி (15), திருவோணம் (22), அவிட்டம் (23), சதயம் (24) — வியாபார தொடக்கம் மற்றும் ஊதிய பேச்சுவார்த்தைக்கு உகந்தவை (செல்வத்தின் இயக்கம்).'
              : isHi ? 'पुनर्वसु (7), स्वाति (15), श्रवण (22), धनिष्ठा (23), शतभिषा (24) — व्यापार आरम्भ और वेतन वार्ता के लिए अनुकूल (धन की गति)।'
              : 'Punarvasu (7), Swati (15), Shravana (22), Dhanishtha (23), Shatabhisha (24) — favoured for business launch and salary negotiation (motion of wealth).'}
          </li>
          <li>
            <strong className="text-gold-light">Tikshna ({isTa ? 'கூர்மை' : isHi ? 'तीक्ष्ण' : 'sharp'}):</strong>{' '}
            {isTa ? 'திருவாதிரை (6), ஆயில்யம் (9), கேட்டை (18), மூலம் (19) — ராஜினாமாவுக்கு உகந்தவை (வெட்டுதல்). புதிய தொடக்கங்களுக்கு கடினமாக தவிர்.'
              : isHi ? 'आर्द्रा (6), आश्लेषा (9), ज्येष्ठा (18), मूल (19) — त्यागपत्र के लिए अनुकूल (कटाई)। नए आरम्भ के लिए कठोर त्याग।'
              : 'Ardra (6), Ashlesha (9), Jyeshtha (18), Mula (19) — favoured for resignation (cutting). Hard avoid for new beginnings.'}
          </li>
          <li>
            <strong className="text-gold-light">Ugra ({isTa ? 'உக்கிரம்' : isHi ? 'उग्र' : 'fierce'}):</strong>{' '}
            {isTa ? 'பரணி (2), கார்த்திகை (3), மகம் (10), பூரம் (11), பூராடம் (20), பூரட்டாதி (25) — பொதுவாக தவிர்க்கப்படுகின்றன. பதவி உயர்வைக் கேட்பதற்கு மகம் விதிவிலக்கு (சிம்மாசனம்/பரம்பரை).'
              : isHi ? 'भरणी (2), कृत्तिका (3), मघा (10), पूर्व फाल्गुनी (11), पूर्व आषाढ़ (20), पूर्व भाद्रपद (25) — सामान्यतः त्याज्य। पदोन्नति माँगने के लिए मघा अपवाद (सिंहासन/वंश)।'
              : 'Bharani (2), Krittika (3), Magha (10), P.Phalguni (11), P.Ashadha (20), P.Bhadrapada (25) — generally avoided. Magha is the exception for asking promotion (throne/lineage).'}
          </li>
        </ul>
      </LessonSection>

      <LessonSection number={3} title={isTa ? 'கடின தடை: ராகு காலம் மற்றும் விஷ்டி கரணம்' : isHi ? 'कठोर निषेध: राहु काल और विष्टि करण' : 'Hard Vetoes: Rahu Kaal and Vishti Karana'}>
        <p style={bf}>
          {isTa
            ? 'நட்சத்திரம் எவ்வளவு நல்லதாக இருந்தாலும், சில காலங்கள் முற்றிலும் தடுக்கப்படுகின்றன — ராகு காலம், யமகண்டம், குலிக காலம், விஷ்டி கரணம். இவை ஒவ்வொரு சாதகக் காரணியையும் கடந்து செயலை "தவிர்" எனக் கட்டாயப்படுத்துகின்றன.'
            : isHi
              ? 'नक्षत्र कितना भी अच्छा हो, कुछ काल पूरी तरह से अवरुद्ध हैं — राहु काल, यमगण्ड, गुलिक काल, विष्टि करण। ये प्रत्येक सकारात्मक कारक को रद्द कर देते हैं और कार्य को "टालें" बनाते हैं।'
              : 'No matter how good the nakshatra, some windows are absolutely blocked — Rahu Kaal, Yamaganda, Gulika Kaal, Vishti karana. These overrule every positive factor and force the window to "Avoid".'}
        </p>
        <div className="mt-3 flex items-start gap-3 p-4 rounded-xl bg-red-500/10 border border-red-500/20">
          <ShieldAlert size={16} className="text-red-400 mt-0.5 flex-shrink-0" />
          <p className="text-red-300 text-xs">
            {isTa
              ? 'அமிர்த நட்சத்திரத்தில் ஒரு வேலை நேர்காணல் கூட ராகு காலத்தில் வந்தால் "தவிர்" என அறிக்கையிடப்படுகிறது. சாத்தியமானால் 90 நிமிடங்கள் முன்னோ பின்னோ மாற்றவும்.'
              : isHi
                ? 'अमृत नक्षत्र में भी नौकरी इंटरव्यू यदि राहु काल में हो तो "टालें" चिह्नित होता है। यदि सम्भव हो 90 मिनट पहले या बाद चुनें।'
                : 'Even a job interview during Amrit Nakshatra is rated "Avoid" if it overlaps Rahu Kaal. If possible, shift 90 minutes earlier or later.'}
          </p>
        </div>
        <ClassicalReference shortName="Muhurta Chintamani Ch. 6" author="Daivagna Ramacharya" chapter="Hard-block enumeration" />
      </LessonSection>

      <LessonSection number={4} title={isTa ? 'வாரநாள் சக்திகள்' : isHi ? 'वार-स्वामी' : 'Weekday Lords for Career'}>
        <p style={bf}>
          {isTa
            ? 'ஒவ்வொரு வாரநாளும் ஒரு கிரகத்தால் ஆளப்படுகிறது, அந்த கிரகத்தின் ஆற்றலை அந்த நாள் முழுவதும் கொண்டு வருகிறது.'
            : isHi
              ? 'प्रत्येक वार एक ग्रह द्वारा शासित होता है, और उस ग्रह की ऊर्जा पूरे दिन को रंग देती है।'
              : 'Each weekday is ruled by a planet, and that planet\'s tone colours the whole day.'}
        </p>
        <ul className="mt-3 space-y-2 text-text-primary text-sm">
          <li>
            <strong className="text-gold-light">{isTa ? 'ஞாயிறு (சூரியன்)' : isHi ? 'रविवार (सूर्य)' : 'Sunday (Sun)'}:</strong>{' '}
            {isTa ? 'அதிகாரம் — பதவி உயர்வைக் கேட்பதற்கும், மூத்த பாத்திரங்களில் முதல் நாளுக்கும் உகந்தது.'
              : isHi ? 'अधिकार — पदोन्नति माँगने और वरिष्ठ भूमिकाओं के पहले दिन के लिए अनुकूल।'
              : 'Authority — favoured for asking promotion, first day at senior roles.'}
          </li>
          <li>
            <strong className="text-gold-light">{isTa ? 'திங்கள் (சந்திரன்)' : isHi ? 'सोमवार (चन्द्र)' : 'Monday (Moon)'}:</strong>{' '}
            {isTa ? 'மென்மையான பொது நோக்கு — நேர்காணல், விண்ணப்பம், விளக்கக்காட்சிகளுக்கு நல்லது.'
              : isHi ? 'सौम्य लोक-संमुख — इंटरव्यू, आवेदन और प्रस्तुति के लिए अच्छा।'
              : 'Gentle public-facing — good for interview, application, and presentations.'}
          </li>
          <li>
            <strong className="text-gold-light">{isTa ? 'செவ்வாய் (செவ்வாய்)' : isHi ? 'मंगलवार (मंगल)' : 'Tuesday (Mars)'}:</strong>{' '}
            {isTa ? 'பிரிவினை மற்றும் வெட்டுதல் செயல் — ராஜினாமாவுக்கு உகந்தது. பேச்சுவார்த்தைக்குத் தவிர்க்கப்படுகிறது (ஆக்ரோஷமாகிறது).'
              : isHi ? 'पृथक्करण और कटाई का कार्य — त्यागपत्र के लिए अनुकूल। वार्ता के लिए त्याज्य (आक्रामक हो जाती है)।'
              : 'Separation and the cutting act — favoured for resignation. Avoided for negotiation (turns aggressive).'}
          </li>
          <li>
            <strong className="text-gold-light">{isTa ? 'புதன் (புதன்)' : isHi ? 'बुधवार (बुध)' : 'Wednesday (Mercury)'}:</strong>{' '}
            {isTa ? 'தொடர்பாடல் — நேர்காணல் மற்றும் விண்ணப்பங்களுக்கான வலுவான நாள்.'
              : isHi ? 'संचार — इंटरव्यू और आवेदन के लिए सबसे मजबूत दिन।'
              : 'Communication — the strongest day for interviews and applications.'}
          </li>
          <li>
            <strong className="text-gold-light">{isTa ? 'வியாழன் (குரு)' : isHi ? 'गुरुवार (बृहस्पति)' : 'Thursday (Jupiter)'}:</strong>{' '}
            {isTa ? 'விரிவாக்கம் மற்றும் ஞானம் — ஊதிய பேச்சுவார்த்தை, வியாபார தொடக்கம், பதவி உயர்வுக்கான வலுவான நாள்.'
              : isHi ? 'विस्तार और बुद्धि — वेतन वार्ता, व्यापार आरम्भ, और पदोन्नति माँगने के लिए सबसे मजबूत दिन।'
              : 'Expansion and wisdom — the strongest day for salary negotiation, business launch, and asking promotion.'}
          </li>
          <li>
            <strong className="text-gold-light">{isTa ? 'வெள்ளி (சுக்கிரன்)' : isHi ? 'शुक्रवार (शुक्र)' : 'Friday (Venus)'}:</strong>{' '}
            {isTa ? 'இனிமையான முதல் பதிவுகள் — வாடிக்கையாளர் சார்ந்த பாத்திரங்கள், ஒப்பந்தம் கையெழுத்திடுதல், படைப்பாற்றல் நிறுவனங்களுக்கான விண்ணப்பங்களுக்கு நல்லது.'
              : isHi ? 'सुखद प्रथम छाप — ग्राहक-सामना भूमिका, अनुबंध हस्ताक्षर, और रचनात्मक कम्पनियों को आवेदन के लिए अच्छा।'
              : 'Pleasing first impressions — good for client-facing roles, contract signing, and applications going to creative companies.'}
          </li>
          <li>
            <strong className="text-gold-light">{isTa ? 'சனி (சனி)' : isHi ? 'शनिवार (शनि)' : 'Saturday (Saturn)'}:</strong>{' '}
            {isTa ? 'நிறைவு — ராஜினாமாவுக்கு உகந்தது, மற்ற எல்லாவற்றுக்கும் சராசரி (பயனர் முடிவு 2026-05-27 படி).'
              : isHi ? 'पूर्णता — त्यागपत्र के लिए अनुकूल, अन्य सभी के लिए सामान्य (उपयोगकर्ता निर्णय 2026-05-27 के अनुसार)।'
              : 'Completion — favoured for resignation, fair for everything else (per user-decision 2026-05-27).'}
          </li>
        </ul>
      </LessonSection>

      <LessonSection number={5} title={isTa ? 'ஹோரை — ஒவ்வொரு மணிநேரத்தின் தலைவன்' : isHi ? 'होरा — प्रत्येक घंटे का स्वामी' : 'Hora — The Lord of Each Hour'}>
        <p style={bf}>
          {isTa
            ? 'ஒவ்வொரு நாளும் சூரிய உதயத்திலிருந்து 24 ஹோரைகளாகப் பிரிக்கப்படுகிறது, ஒவ்வொன்றும் ஒரு கிரகத்தால் ஆளப்படுகிறது. செயலின் கிரக ஆதரவைப் பெற சரியான ஹோரையில் செயல் செய்வது முக்கியம்.'
            : isHi
              ? 'प्रत्येक दिन सूर्योदय से 24 होराओं में विभाजित होता है, प्रत्येक एक ग्रह द्वारा शासित। कार्य के लिए सही ग्रह सहायता प्राप्त करने हेतु सही होरा में कार्य करना महत्वपूर्ण।'
              : 'Each day is divided into 24 horas (planetary hours) starting at sunrise, each ruled by a planet. Acting in the right hora secures the right planetary tone.'}
        </p>
        <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="p-3 rounded-lg bg-white/[0.03] border border-gold-primary/10">
            <div className="flex items-center gap-2 mb-1">
              <Clock size={14} className="text-gold-primary" />
              <span className="text-gold-light font-semibold text-sm">
                {isTa ? 'குரு ஹோரை' : isHi ? 'बृहस्पति होरा' : 'Jupiter hora'}
              </span>
            </div>
            <p className="text-text-secondary text-xs">
              {isTa ? 'ஞானம் மற்றும் விரிவாக்கம் — பேச்சுவார்த்தை, பதவி உயர்வு, வியாபார தொடக்கம், நேர்காணலுக்கு சிறந்தது.'
                : isHi ? 'बुद्धि और विस्तार — वार्ता, पदोन्नति माँगना, व्यापार आरम्भ, इंटरव्यू के लिए सर्वोत्तम।'
                : 'Wisdom and expansion — best for negotiation, asking promotion, business launch, interview.'}
            </p>
          </div>
          <div className="p-3 rounded-lg bg-white/[0.03] border border-gold-primary/10">
            <div className="flex items-center gap-2 mb-1">
              <Clock size={14} className="text-gold-primary" />
              <span className="text-gold-light font-semibold text-sm">
                {isTa ? 'புதன் ஹோரை' : isHi ? 'बुध होरा' : 'Mercury hora'}
              </span>
            </div>
            <p className="text-text-secondary text-xs">
              {isTa ? 'தொடர்பாடல் — விண்ணப்பம், ஒப்பந்தம் கையெழுத்திடுதல், நேர்காணலுக்கு சிறந்தது.'
                : isHi ? 'संचार — आवेदन, अनुबंध हस्ताक्षर, इंटरव्यू के लिए सर्वोत्तम।'
                : 'Communication — best for application, contract signing, interview.'}
            </p>
          </div>
          <div className="p-3 rounded-lg bg-white/[0.03] border border-gold-primary/10">
            <div className="flex items-center gap-2 mb-1">
              <Clock size={14} className="text-gold-primary" />
              <span className="text-gold-light font-semibold text-sm">
                {isTa ? 'சூரிய ஹோரை' : isHi ? 'सूर्य होरा' : 'Sun hora'}
              </span>
            </div>
            <p className="text-text-secondary text-xs">
              {isTa ? 'அதிகாரம் மற்றும் தெரிநிலை — பதவி உயர்வுக் கோரிக்கை, முதல் நாள், பொது-நோக்கு முதல் பதிவுகளுக்கு சிறந்தது.'
                : isHi ? 'अधिकार और दृश्यता — पदोन्नति माँगना, पहला दिन, लोक-संमुख प्रथम छाप के लिए सर्वोत्तम।'
                : 'Authority and visibility — best for asking promotion, first day, public-facing first impressions.'}
            </p>
          </div>
          <div className="p-3 rounded-lg bg-white/[0.03] border border-gold-primary/10">
            <div className="flex items-center gap-2 mb-1">
              <Clock size={14} className="text-gold-primary" />
              <span className="text-gold-light font-semibold text-sm">
                {isTa ? 'சனி ஹோரை' : isHi ? 'शनि होरा' : 'Saturn hora'}
              </span>
            </div>
            <p className="text-text-secondary text-xs">
              {isTa ? 'நிறைவு — ராஜினாமாவுக்கு சிறந்தது. புதிய தொடக்கங்களுக்குத் தவிர்.'
                : isHi ? 'पूर्णता — त्यागपत्र के लिए सर्वोत्तम। नए आरम्भ के लिए त्यागें।'
                : 'Completion — best for resignation. Avoid for new beginnings.'}
            </p>
          </div>
        </div>
      </LessonSection>

      <WhyItMatters locale={locale}>
        {isTa
          ? 'குறிப்பு: முகூர்த்தம் வெற்றியை உத்தரவாதம் செய்யாது. தயாரிப்பு, திறமை, பொருத்தம் இவை எல்லாமே வெற்றியை வடிவமைக்கின்றன. முகூர்த்தம் வாய்ப்பை மேம்படுத்துகிறது — அது தயாரிப்பின் இடத்தைப் பிடிக்கவில்லை.'
          : isHi
            ? 'टिप्पणी: मुहूर्त सफलता की गारंटी नहीं देता। तैयारी, कौशल, उपयुक्तता — ये सब मिलकर परिणाम बनाते हैं। मुहूर्त सम्भावना बढ़ाता है — तैयारी का स्थान नहीं लेता।'
            : 'Note: muhurta does not guarantee success. Preparation, skill, and fit shape the outcome together. Muhurta raises the probability — it does not replace preparation.'}
      </WhyItMatters>

      <div className="mt-8">
        <h3 className="text-gold-dark text-xs uppercase tracking-widest font-bold mb-3 flex items-center gap-1.5">
          <Star size={12} />
          {isTa ? 'மேலும் ஆராய' : isHi ? 'और जानें' : 'Explore Further'}
        </h3>
        <div className="flex flex-wrap gap-2">
          {[
            { href: '/career-muhurta', label: isTa ? 'தொழில் முகூர்த்த கருவி' : isHi ? 'करियर मुहूर्त उपकरण' : 'Career Muhurta tool' },
            { href: '/muhurta-ai', label: isTa ? 'முகூர்த்த AI' : isHi ? 'मुहूर्त AI' : 'Muhurta AI' },
            { href: '/learn/muhurtas', label: isTa ? 'முகூர்த்தங்கள் (30)' : isHi ? '30 मुहूर्त' : '30 Muhurtas' },
            { href: '/learn/choghadiya', label: isTa ? 'சௌகாடியா' : isHi ? 'चौघड़िया' : 'Choghadiya' },
            { href: '/learn/hora', label: isTa ? 'ஹோரை' : isHi ? 'होरा' : 'Hora' },
            { href: '/learn/vara', label: isTa ? 'வாரம்' : isHi ? 'वार' : 'Vara' },
          ].map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="px-3 py-1.5 rounded-lg text-sm text-text-secondary hover:text-gold-light border border-gold-primary/10 hover:border-gold-primary/25 hover:bg-gold-primary/5 transition-colors"
              style={bf}
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
