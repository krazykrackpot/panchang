/**
 * Life Stage Engine — adapts tippanni interpretations to the user's current
 * phase of life based on their age (derived from birth date).
 *
 * Inspired by the Vedic Ashrama system:
 *   Brahmacharya (student) → Grihastha (householder) → Vanaprastha (elder) → Sannyasa (renunciate)
 *
 * This doesn't exclude any life area — it REORDERS and REFRAMES them.
 * A 20-year-old still gets marriage insights, but education/career leads.
 * A 60-year-old still gets career insights, but health/spirituality leads.
 */

export type LifeStage =
  | 'student'        // < 22: education, self-discovery, early career
  | 'early_career'   // 22-30: career foundation, relationships, independence
  | 'householder'    // 30-45: career peak, marriage, children, wealth building
  | 'established'    // 45-58: legacy, children's future, health awareness, wealth preservation
  | 'elder'          // 58-70: mentorship, health priority, spiritual deepening, grandchildren
  | 'sage';          // 70+: spiritual liberation, health management, wisdom sharing, detachment

export interface LifeStageContext {
  age: number;
  stage: LifeStage;
  /** Life areas ordered by relevance for this stage */
  priorityOrder: LifeAreaKey[];
  /** Stage-specific framing for each life area */
  framing: Record<LifeAreaKey, { en: string; hi: string }>;
  /** Stage headline shown at the top of tippanni */
  headline: { en: string; hi: string };
  /** Remedy preferences for this stage */
  remedyPreference: RemedyPreference;
}

export type LifeAreaKey = 'education' | 'career' | 'marriage' | 'wealth' | 'health';

export interface RemedyPreference {
  /** Which remedy types to emphasize */
  preferred: string[];
  /** Brief note about why */
  note: { en: string; hi: string };
}

/**
 * Compute life stage context from birth date.
 */
export function getLifeStageContext(birthDate: Date): LifeStageContext {
  const now = new Date();
  const age = Math.floor((now.getTime() - birthDate.getTime()) / (365.25 * 24 * 60 * 60 * 1000));
  const stage = getStage(age);

  return {
    age,
    stage,
    priorityOrder: STAGE_PRIORITIES[stage],
    framing: STAGE_FRAMING[stage],
    headline: STAGE_HEADLINES[stage],
    remedyPreference: STAGE_REMEDIES[stage],
  };
}

function getStage(age: number): LifeStage {
  if (age < 22) return 'student';
  if (age < 30) return 'early_career';
  if (age < 45) return 'householder';
  if (age < 58) return 'established';
  if (age < 70) return 'elder';
  return 'sage';
}

// ── Priority ordering per stage ──
// The FIRST item is what leads the tippanni. All areas are still shown.

const STAGE_PRIORITIES: Record<LifeStage, LifeAreaKey[]> = {
  student:       ['education', 'career', 'health', 'marriage', 'wealth'],
  early_career:  ['career', 'marriage', 'wealth', 'education', 'health'],
  householder:   ['career', 'wealth', 'marriage', 'health', 'education'],
  established:   ['wealth', 'health', 'career', 'marriage', 'education'],
  elder:         ['health', 'marriage', 'wealth', 'career', 'education'],
  sage:          ['health', 'marriage', 'wealth', 'education', 'career'],
};

// ── Stage headlines — shown at top of tippanni ──

const STAGE_HEADLINES: Record<LifeStage, { en: string; hi: string }> = {
  student: {
    en: 'You are in the Brahmacharya phase — the season of learning, self-discovery, and building your foundation. Your chart insights are prioritized for academic and early career guidance.',
    hi: 'आप ब्रह्मचर्य अवस्था में हैं — शिक्षा, आत्मज्ञान और नींव बनाने का समय। आपकी कुण्डली शैक्षिक और प्रारम्भिक कैरियर मार्गदर्शन के लिए प्राथमिकता दी गई है।',
  },
  early_career: {
    en: 'You are establishing yourself — career, relationships, and independence define this phase. Your chart insights lead with professional direction and partnership potential.',
    hi: 'आप अपनी पहचान बना रहे हैं — कैरियर, सम्बन्ध और स्वतन्त्रता इस चरण को परिभाषित करते हैं। आपकी कुण्डली पेशेवर दिशा और साझेदारी क्षमता पर केन्द्रित है।',
  },
  householder: {
    en: 'You are in the Grihastha phase — peak career, family building, and wealth accumulation. Your chart insights emphasize professional growth, financial strategy, and family harmony.',
    hi: 'आप गृहस्थ अवस्था में हैं — कैरियर शिखर, परिवार निर्माण और धन संचय। आपकी कुण्डली पेशेवर विकास, वित्तीय रणनीति और पारिवारिक सामंजस्य पर बल देती है।',
  },
  established: {
    en: 'You are in the consolidation phase — preserving wealth, ensuring your family\'s future, and becoming aware of health. Your insights prioritize financial security and wellbeing.',
    hi: 'आप स्थापित अवस्था में हैं — धन संरक्षण, परिवार का भविष्य सुनिश्चित करना और स्वास्थ्य जागरूकता। आपकी कुण्डली वित्तीय सुरक्षा और स्वास्थ्य पर केन्द्रित है।',
  },
  elder: {
    en: 'You are entering the Vanaprastha phase — health becomes primary, relationships deepen, and spiritual awareness grows. Your chart insights lead with wellbeing and inner fulfillment.',
    hi: 'आप वानप्रस्थ अवस्था में प्रवेश कर रहे हैं — स्वास्थ्य प्राथमिक, सम्बन्ध गहरे और आध्यात्मिक जागरूकता बढ़ती है। आपकी कुण्डली कल्याण और आन्तरिक पूर्णता पर केन्द्रित है।',
  },
  sage: {
    en: 'You are in the Sannyasa phase — the season of wisdom, spiritual liberation, and graceful living. Your chart insights emphasize health management, inner peace, and the fruits of a life well-lived.',
    hi: 'आप संन्यास अवस्था में हैं — ज्ञान, आध्यात्मिक मुक्ति और गरिमापूर्ण जीवन का समय। आपकी कुण्डली स्वास्थ्य प्रबन्धन, आन्तरिक शान्ति और जीवन के फलों पर बल देती है।',
  },
};

// ── Life area framing per stage ──
// These are prepended to each life area's summary to contextualize it for the user's age.

const STAGE_FRAMING: Record<LifeStage, Record<LifeAreaKey, { en: string; hi: string }>> = {
  student: {
    education: { en: 'This is your primary focus right now.', hi: 'यह अभी आपका प्राथमिक ध्यान है।' },
    career: { en: 'Start thinking about your professional direction.', hi: 'अपनी पेशेवर दिशा के बारे में सोचना शुरू करें।' },
    marriage: { en: 'Relationships are forming — understand your partnership patterns.', hi: 'सम्बन्ध बन रहे हैं — अपनी साझेदारी के पैटर्न समझें।' },
    wealth: { en: 'Financial habits you build now compound over decades.', hi: 'अभी बनाई वित्तीय आदतें दशकों तक फल देंगी।' },
    health: { en: 'Your body is resilient now — invest in habits that last.', hi: 'आपका शरीर अभी लचीला है — स्थायी आदतों में निवेश करें।' },
  },
  early_career: {
    education: { en: 'Continuous learning accelerates your career trajectory.', hi: 'निरन्तर सीखना आपके कैरियर को गति देता है।' },
    career: { en: 'These years define your professional identity.', hi: 'ये वर्ष आपकी पेशेवर पहचान तय करते हैं।' },
    marriage: { en: 'Partnership decisions in this phase shape your life deeply.', hi: 'इस चरण में साझेदारी के निर्णय जीवन को गहराई से प्रभावित करते हैं।' },
    wealth: { en: 'Early investments and career choices build long-term wealth.', hi: 'शुरुआती निवेश और कैरियर विकल्प दीर्घकालिक धन बनाते हैं।' },
    health: { en: 'Establish fitness routines that support your ambitions.', hi: 'अपनी महत्वाकांक्षाओं का समर्थन करने वाली स्वास्थ्य दिनचर्या स्थापित करें।' },
  },
  householder: {
    education: { en: 'Mentoring and skill upgrades keep you competitive.', hi: 'मार्गदर्शन और कौशल उन्नयन आपको प्रतिस्पर्धी बनाए रखते हैं।' },
    career: { en: 'You are at your professional peak — maximize this window.', hi: 'आप अपने पेशेवर शिखर पर हैं — इस अवसर का अधिकतम लाभ उठाएँ।' },
    marriage: { en: 'Family life needs conscious nurturing alongside career.', hi: 'कैरियर के साथ पारिवारिक जीवन को सचेत पोषण चाहिए।' },
    wealth: { en: 'Peak earning years — strategic planning matters most now.', hi: 'अधिकतम आय के वर्ष — रणनीतिक योजना अब सबसे महत्वपूर्ण।' },
    health: { en: 'Stress management becomes critical — don\'t ignore the signals.', hi: 'तनाव प्रबन्धन महत्वपूर्ण — संकेतों की अनदेखी न करें।' },
  },
  established: {
    education: { en: 'Your children\'s education and your own legacy projects matter.', hi: 'बच्चों की शिक्षा और आपकी विरासत परियोजनाएँ महत्वपूर्ण हैं।' },
    career: { en: 'Transition from doing to leading — delegate and guide.', hi: 'करने से नेतृत्व में परिवर्तन — प्रतिनिधित्व करें और मार्गदर्शन दें।' },
    marriage: { en: 'Relationships evolve — rediscover your partner in this new phase.', hi: 'सम्बन्ध विकसित होते हैं — इस नए चरण में अपने साथी को पुनः खोजें।' },
    wealth: { en: 'Shift from accumulation to preservation and succession.', hi: 'संचय से संरक्षण और उत्तराधिकार की ओर बदलें।' },
    health: { en: 'Prevention is now your best investment — regular check-ups matter.', hi: 'रोकथाम अब आपका सबसे अच्छा निवेश है — नियमित जाँच महत्वपूर्ण।' },
  },
  elder: {
    education: { en: 'Share your wisdom — teaching deepens your own understanding.', hi: 'अपना ज्ञान बाँटें — शिक्षण आपकी समझ को गहरा करता है।' },
    career: { en: 'Your legacy speaks for itself — advisory roles suit this phase.', hi: 'आपकी विरासत स्वयं बोलती है — सलाहकार भूमिकाएँ इस चरण के अनुकूल।' },
    marriage: { en: 'Companionship deepens — this is the season of gratitude and renewed love.', hi: 'साहचर्य गहरा होता है — यह कृतज्ञता और नवीकृत प्रेम का मौसम है।' },
    wealth: { en: 'Ensure smooth succession and charitable giving.', hi: 'सुचारू उत्तराधिकार और दानशीलता सुनिश्चित करें।' },
    health: { en: 'Health is your most valuable asset now — prioritize it above all.', hi: 'स्वास्थ्य अब आपकी सबसे मूल्यवान सम्पत्ति — सबसे ऊपर प्राथमिकता दें।' },
  },
  sage: {
    education: { en: 'Study of scriptures and spiritual texts brings profound peace.', hi: 'शास्त्रों और आध्यात्मिक ग्रन्थों का अध्ययन गहन शान्ति लाता है।' },
    career: { en: 'Work is now seva (service) — give back what life has given you.', hi: 'कार्य अब सेवा है — जो जीवन ने दिया, वह लौटाएँ।' },
    marriage: { en: 'Your relationship is a lifelong tapas — honor it with presence.', hi: 'आपका सम्बन्ध आजीवन तपस्या है — उपस्थिति से सम्मान दें।' },
    wealth: { en: 'Material security is established — focus on spiritual wealth now.', hi: 'भौतिक सुरक्षा स्थापित — अब आध्यात्मिक धन पर ध्यान दें।' },
    health: { en: 'Gentle living, daily practice, and medical awareness sustain you.', hi: 'सौम्य जीवन, दैनिक साधना और चिकित्सा जागरूकता आपको बनाए रखते हैं।' },
  },
};

// ── Remedy preferences by stage ──

const STAGE_REMEDIES: Record<LifeStage, RemedyPreference> = {
  student: {
    preferred: ['mantra', 'study', 'charity', 'fasting'],
    note: { en: 'At your age, mantra japa and charitable service are the most effective remedies.', hi: 'आपकी उम्र में मन्त्र जप और दान-सेवा सबसे प्रभावी उपाय हैं।' },
  },
  early_career: {
    preferred: ['mantra', 'gemstone', 'charity', 'fasting'],
    note: { en: 'Combine mantra discipline with strategic gemstone wearing for career acceleration.', hi: 'कैरियर गति के लिए मन्त्र अनुशासन को रणनीतिक रत्न धारण से जोड़ें।' },
  },
  householder: {
    preferred: ['puja', 'gemstone', 'charity', 'yantra'],
    note: { en: 'Full puja vidhi and gemstone remedies are most impactful during your peak productive years.', hi: 'आपके शिखर उत्पादक वर्षों में पूर्ण पूजा विधि और रत्न उपाय सर्वाधिक प्रभावी।' },
  },
  established: {
    preferred: ['charity', 'puja', 'mantra', 'lifestyle'],
    note: { en: 'Charitable giving and regular worship amplify good karma in this consolidation phase.', hi: 'इस स्थापना चरण में दान और नियमित पूजा अच्छे कर्म को बढ़ाते हैं।' },
  },
  elder: {
    preferred: ['mantra', 'puja', 'lifestyle', 'charity'],
    note: { en: 'Gentle daily mantra practice and simplified lifestyle are the most powerful remedies now.', hi: 'सौम्य दैनिक मन्त्र अभ्यास और सरलीकृत जीवनशैली अब सबसे शक्तिशाली उपाय हैं।' },
  },
  sage: {
    preferred: ['mantra', 'meditation', 'charity', 'lifestyle'],
    note: { en: 'Meditation, mantra, and seva — the body needs gentleness, the soul needs depth.', hi: 'ध्यान, मन्त्र और सेवा — शरीर को कोमलता चाहिए, आत्मा को गहराई।' },
  },
};
