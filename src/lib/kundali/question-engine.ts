/**
 * Question-Answering Engine — "Will I get married this year?"
 *
 * Maps common life questions to specific chart factors, then generates
 * a deterministic answer from existing computed data (KundaliData,
 * TippanniContent, PersonalReading). No LLM/AI — pure chart logic.
 *
 * A pandit doesn't say "your 7th house is in Libra." A pandit says:
 * "YES, marriage is indicated this year. Here's why: [3 specific factors]."
 */

import type { KundaliData } from '@/types/kundali';
import type { TippanniContent } from './tippanni-types';
import type { PersonalReading, DomainReading } from './domain-synthesis/types';
import type { LifeStageContext } from './life-stage';
import { tl } from '@/lib/utils/trilingual';

// ═══════════════════════════════════════════════════════════════
// QUESTION CATALOG
// ═══════════════════════════════════════════════════════════════

export interface QuestionDef {
  id: string;
  category: 'marriage' | 'career' | 'wealth' | 'health' | 'education' | 'children' | 'spiritual' | 'general';
  question: { en: string; hi: string };
  /** Which domain reading to pull from */
  domain?: string;
  /** Houses to examine (1-indexed) */
  houses: number[];
  /** Planet IDs most relevant (0=Sun..8=Ketu) */
  planets: number[];
  /** Yoga categories that support a positive answer */
  favorableYogaCategories: string[];
  /** Dosha names that work against a positive answer */
  adverseDoshas: string[];
}

export const QUESTIONS: QuestionDef[] = [
  // ── Marriage & Relationships ──
  {
    id: 'marriage_this_year',
    category: 'marriage',
    question: { en: 'Will I get married this year?', hi: 'क्या मेरा विवाह इस वर्ष होगा?' },
    domain: 'marriage',
    houses: [7, 2, 11],
    planets: [5, 4, 1], // Venus, Jupiter, Moon
    favorableYogaCategories: ['marriage', 'raja'],
    adverseDoshas: ['mangal_dosha', 'kaal_sarpa'],
  },
  {
    id: 'marriage_when',
    category: 'marriage',
    question: { en: 'When will I get married?', hi: 'मेरा विवाह कब होगा?' },
    domain: 'marriage',
    houses: [7, 2, 11],
    planets: [5, 4, 1],
    favorableYogaCategories: ['marriage'],
    adverseDoshas: ['mangal_dosha'],
  },
  {
    id: 'relationship_stability',
    category: 'marriage',
    question: { en: 'Is my relationship/marriage stable?', hi: 'क्या मेरा रिश्ता/विवाह स्थिर है?' },
    domain: 'marriage',
    houses: [7, 4, 8],
    planets: [5, 1, 6], // Venus, Moon, Saturn
    favorableYogaCategories: ['marriage'],
    adverseDoshas: ['mangal_dosha', 'shrapit_dosha'],
  },
  // ── Career ──
  {
    id: 'career_change',
    category: 'career',
    question: { en: 'Should I change jobs this year?', hi: 'क्या मुझे इस वर्ष नौकरी बदलनी चाहिए?' },
    domain: 'career',
    houses: [10, 6, 7],
    planets: [0, 6, 3], // Sun, Saturn, Mercury
    favorableYogaCategories: ['raja', 'career'],
    adverseDoshas: [],
  },
  {
    id: 'career_promotion',
    category: 'career',
    question: { en: 'Will I get promoted?', hi: 'क्या मुझे पदोन्नति मिलेगी?' },
    domain: 'career',
    houses: [10, 11, 9],
    planets: [0, 4, 6], // Sun, Jupiter, Saturn
    favorableYogaCategories: ['raja', 'career'],
    adverseDoshas: [],
  },
  {
    id: 'start_business',
    category: 'career',
    question: { en: 'Is this a good time to start a business?', hi: 'क्या यह व्यापार शुरू करने का अच्छा समय है?' },
    domain: 'career',
    houses: [10, 7, 11, 2],
    planets: [3, 4, 0], // Mercury, Jupiter, Sun
    favorableYogaCategories: ['raja', 'dhana'],
    adverseDoshas: ['kaal_sarpa'],
  },
  // ── Wealth ──
  {
    id: 'wealth_this_year',
    category: 'wealth',
    question: { en: 'Will I make money this year?', hi: 'क्या इस वर्ष धन लाभ होगा?' },
    domain: 'wealth',
    houses: [2, 11, 5, 9],
    planets: [4, 5, 3], // Jupiter, Venus, Mercury
    favorableYogaCategories: ['dhana', 'wealth'],
    adverseDoshas: ['daridra_yoga'],
  },
  {
    id: 'invest_now',
    category: 'wealth',
    question: { en: 'Should I invest or buy property now?', hi: 'क्या अभी निवेश या सम्पत्ति खरीदनी चाहिए?' },
    domain: 'wealth',
    houses: [4, 2, 11],
    planets: [4, 6, 2], // Jupiter, Saturn, Mars
    favorableYogaCategories: ['dhana'],
    adverseDoshas: [],
  },
  // ── Health ──
  {
    id: 'health_this_year',
    category: 'health',
    question: { en: 'How is my health this year?', hi: 'इस वर्ष मेरा स्वास्थ्य कैसा रहेगा?' },
    domain: 'health',
    houses: [1, 6, 8],
    planets: [0, 2, 6], // Sun, Mars, Saturn
    favorableYogaCategories: ['health'],
    adverseDoshas: ['arishta'],
  },
  {
    id: 'health_concerns',
    category: 'health',
    question: { en: 'What health issues should I watch for?', hi: 'किन स्वास्थ्य समस्याओं से सावधान रहूँ?' },
    domain: 'health',
    houses: [1, 6, 8, 12],
    planets: [0, 1, 2, 6],
    favorableYogaCategories: [],
    adverseDoshas: ['arishta'],
  },
  // ── Education ──
  {
    id: 'exam_success',
    category: 'education',
    question: { en: 'Will I pass my exam / get admission?', hi: 'क्या मैं परीक्षा पास करूँगा / प्रवेश मिलेगा?' },
    domain: 'education',
    houses: [4, 5, 9],
    planets: [3, 4], // Mercury, Jupiter
    favorableYogaCategories: ['saraswati'],
    adverseDoshas: [],
  },
  {
    id: 'study_abroad',
    category: 'education',
    question: { en: 'Should I study or settle abroad?', hi: 'क्या विदेश में पढ़ाई या बसना चाहिए?' },
    domain: 'education',
    houses: [9, 12, 4],
    planets: [4, 7], // Jupiter, Rahu
    favorableYogaCategories: [],
    adverseDoshas: [],
  },
  // ── Children ──
  {
    id: 'children_when',
    category: 'children',
    question: { en: 'When will I have children?', hi: 'सन्तान कब होगी?' },
    domain: 'children',
    houses: [5, 9, 11],
    planets: [4, 1], // Jupiter (putra karaka), Moon
    favorableYogaCategories: [],
    adverseDoshas: ['putra_dosha'],
  },
  // ── Spiritual ──
  {
    id: 'spiritual_growth',
    category: 'spiritual',
    question: { en: 'What is my spiritual path?', hi: 'मेरा आध्यात्मिक मार्ग क्या है?' },
    domain: 'spiritual',
    houses: [9, 12, 5],
    planets: [8, 4, 1], // Ketu, Jupiter, Moon
    favorableYogaCategories: ['moksha'],
    adverseDoshas: [],
  },
  // ── General ──
  {
    id: 'focus_this_year',
    category: 'general',
    question: { en: 'What should I focus on this year?', hi: 'इस वर्ष किस पर ध्यान दूँ?' },
    houses: [1, 10],
    planets: [],
    favorableYogaCategories: [],
    adverseDoshas: [],
  },
  {
    id: 'best_period',
    category: 'general',
    question: { en: 'When is my best period coming?', hi: 'मेरा सबसे अच्छा समय कब आएगा?' },
    houses: [],
    planets: [],
    favorableYogaCategories: ['raja', 'dhana'],
    adverseDoshas: [],
  },
];

// ═══════════════════════════════════════════════════════════════
// ANSWER ENGINE
// ═══════════════════════════════════════════════════════════════

export interface ChartEvidence {
  factor: string;
  interpretation: string;
  supports: 'positive' | 'negative' | 'neutral';
}

export interface QuestionAnswer {
  questionId: string;
  question: string;
  /** Direct yes/no/mixed verdict */
  verdict: 'yes' | 'likely' | 'mixed' | 'unlikely' | 'challenging';
  /** Confidence score 0-100 */
  confidence: number;
  /** The pandit's answer — 2-4 sentences */
  answer: string;
  /** Chart factors that support the answer */
  evidence: ChartEvidence[];
  /** When the relevant period activates (if applicable) */
  timing?: string;
  /** Actionable advice */
  advice: string;
}

export function answerQuestion(
  questionId: string,
  kundali: KundaliData,
  tippanni: TippanniContent,
  personalReading: PersonalReading | null,
  locale: string,
  stageCtx?: LifeStageContext,
): QuestionAnswer {
  const qDef = QUESTIONS.find(q => q.id === questionId);
  if (!qDef) {
    return {
      questionId,
      question: questionId,
      verdict: 'mixed',
      confidence: 0,
      answer: 'Question not found.',
      evidence: [],
      advice: '',
    };
  }

  const isHi = locale === 'hi' || locale === 'ta' || locale === 'te' || locale === 'bn' || locale === 'gu' || locale === 'kn' || locale === 'mai';
  const question = isHi ? qDef.question.hi : qDef.question.en;
  const evidence: ChartEvidence[] = [];
  let positiveScore = 0;
  let negativeScore = 0;

  // ── Factor 1: Domain rating from PersonalReading ──
  if (qDef.domain && personalReading) {
    const domainReading = personalReading.domains.find(d => d.domain === qDef.domain);
    if (domainReading) {
      const ratingVal = parseRating(domainReading.overallRating.rating);
      const isGood = ratingVal >= 6;
      evidence.push({
        factor: `${capitalize(qDef.domain)} domain rating: ${domainReading.overallRating.rating} (${domainReading.overallRating.score.toFixed(1)}/10)`,
        interpretation: isGood
          ? `Your ${qDef.domain} domain is strong — the chart supports positive outcomes here.`
          : `Your ${qDef.domain} domain faces challenges — effort and timing matter more.`,
        supports: isGood ? 'positive' : ratingVal >= 4 ? 'neutral' : 'negative',
      });
      positiveScore += isGood ? 20 : ratingVal >= 4 ? 10 : 0;
      negativeScore += ratingVal < 4 ? 15 : 0;
    }
  }

  // ── Factor 2: Relevant house strengths ──
  if (qDef.houses.length > 0 && tippanni.strengthOverview.length > 0) {
    // Use bhavabala or life area ratings as proxy
    const lifeAreaMap: Record<number, string> = { 7: 'marriage', 10: 'career', 2: 'wealth', 1: 'health', 4: 'education', 5: 'education' };
    for (const house of qDef.houses.slice(0, 2)) {
      const areaKey = lifeAreaMap[house] as keyof typeof tippanni.lifeAreas | undefined;
      if (areaKey && tippanni.lifeAreas[areaKey]) {
        const area = tippanni.lifeAreas[areaKey];
        const isStrong = area.rating >= 7;
        evidence.push({
          factor: `${area.label}: ${area.rating}/10`,
          interpretation: area.summary.split('.')[0] + '.',
          supports: isStrong ? 'positive' : area.rating >= 5 ? 'neutral' : 'negative',
        });
        positiveScore += isStrong ? 15 : area.rating >= 5 ? 5 : 0;
        negativeScore += area.rating < 5 ? 10 : 0;
      }
    }
  }

  // ── Factor 3: Relevant planet strengths ──
  for (const planetId of qDef.planets.slice(0, 3)) {
    const strength = tippanni.strengthOverview.find(s => {
      const planetNames = ['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn', 'Rahu', 'Ketu'];
      return s.planetName === planetNames[planetId];
    });
    if (strength) {
      const isStrong = strength.strength >= 60;
      evidence.push({
        factor: `${strength.planetName} strength: ${strength.strength}%`,
        interpretation: isStrong
          ? `${strength.planetName} is strong in your chart — supports this area.`
          : `${strength.planetName} is weak (${strength.strength}%) — this factor needs remedial support.`,
        supports: isStrong ? 'positive' : strength.strength >= 40 ? 'neutral' : 'negative',
      });
      positiveScore += isStrong ? 10 : 0;
      negativeScore += strength.strength < 40 ? 10 : 0;
    }
  }

  // ── Factor 4: Active yogas that support the question ──
  if (qDef.favorableYogaCategories.length > 0) {
    const activeYogas = tippanni.yogas.filter(y =>
      y.present && qDef.favorableYogaCategories.some(cat =>
        y.type?.toLowerCase().includes(cat) || y.name?.toLowerCase().includes(cat)
      )
    );
    if (activeYogas.length > 0) {
      const topYoga = activeYogas[0];
      evidence.push({
        factor: `${topYoga.name} yoga active`,
        interpretation: `${topYoga.description.split('.')[0]}. This yoga strongly supports a positive outcome.`,
        supports: 'positive',
      });
      positiveScore += 20;
    }
  }

  // ── Factor 5: Active doshas that work against ──
  if (qDef.adverseDoshas.length > 0) {
    const activeDoshas = tippanni.doshas.filter(d =>
      d.present && qDef.adverseDoshas.some(ad =>
        d.name.toLowerCase().includes(ad.replace('_', ' '))
      )
    );
    if (activeDoshas.length > 0) {
      const dosha = activeDoshas[0];
      const cancelled = dosha.effectiveSeverity === 'cancelled';
      evidence.push({
        factor: `${dosha.name} ${cancelled ? '(cancelled)' : 'active'}`,
        interpretation: cancelled
          ? `${dosha.name} is present but cancelled by planetary conditions. Its negative effect is neutralized.`
          : `${dosha.name} creates obstacles in this area. Remedies are recommended.`,
        supports: cancelled ? 'neutral' : 'negative',
      });
      if (!cancelled) negativeScore += 15;
    }
  }

  // ── Factor 6: Current dasha relevance ──
  if (tippanni.dashaInsight.currentMaha) {
    const dashaLord = tippanni.dashaInsight.currentMaha.replace(' Mahadasha', '').replace(' महादशा', '');
    const isRelevantPlanet = qDef.planets.some(pid => {
      const names = ['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn', 'Rahu', 'Ketu'];
      return names[pid] === dashaLord;
    });
    if (isRelevantPlanet) {
      evidence.push({
        factor: `${tippanni.dashaInsight.currentMaha} — directly relevant`,
        interpretation: `The current dasha lord directly governs this life area — this period is significant for your question.`,
        supports: 'positive',
      });
      positiveScore += 15;
    }
  }

  // ── Factor 7: Year prediction events ──
  if (tippanni.yearPredictions.events) {
    const relevantEvent = tippanni.yearPredictions.events.find(e => {
      if (qDef.category === 'marriage' && (e.description.toLowerCase().includes('marriage') || e.description.toLowerCase().includes('7th'))) return true;
      if (qDef.category === 'career' && (e.description.toLowerCase().includes('career') || e.description.toLowerCase().includes('10th'))) return true;
      if (qDef.category === 'wealth' && (e.description.toLowerCase().includes('wealth') || e.description.toLowerCase().includes('2nd') || e.description.toLowerCase().includes('11th'))) return true;
      return false;
    });
    if (relevantEvent) {
      evidence.push({
        factor: `${relevantEvent.title}: ${relevantEvent.impact}`,
        interpretation: relevantEvent.description.split('.')[0] + '.',
        supports: relevantEvent.impact === 'favorable' ? 'positive' : relevantEvent.impact === 'challenging' ? 'negative' : 'neutral',
      });
      positiveScore += relevantEvent.impact === 'favorable' ? 10 : 0;
      negativeScore += relevantEvent.impact === 'challenging' ? 10 : 0;
    }
  }

  // ── Compute verdict ──
  const totalScore = positiveScore + negativeScore;
  const positiveRatio = totalScore > 0 ? positiveScore / totalScore : 0.5;
  const confidence = Math.min(95, Math.max(20, Math.round(positiveRatio * 100)));

  let verdict: QuestionAnswer['verdict'];
  if (positiveRatio >= 0.75) verdict = 'yes';
  else if (positiveRatio >= 0.6) verdict = 'likely';
  else if (positiveRatio >= 0.4) verdict = 'mixed';
  else if (positiveRatio >= 0.25) verdict = 'unlikely';
  else verdict = 'challenging';

  // ── Generate answer text ──
  const positiveFactors = evidence.filter(e => e.supports === 'positive').length;
  const negativeFactors = evidence.filter(e => e.supports === 'negative').length;

  let answer: string;
  if (qDef.id === 'focus_this_year') {
    // Special: find the strongest domain
    const strongestDomain = personalReading?.domains.reduce((best, d) =>
      d.overallRating.score > (best?.overallRating.score || 0) ? d : best, personalReading.domains[0]);
    answer = strongestDomain
      ? `Your strongest area right now is ${strongestDomain.domain} (${strongestDomain.overallRating.rating}). ${tl(strongestDomain.headline, locale)} Focus your energy here — this is where your chart gives you the most support.`
      : 'Focus on the life area where your chart shows the most strength. See the domain ratings above.';
  } else if (qDef.id === 'best_period') {
    answer = tippanni.dashaInsight.upcoming
      ? `Your current period: ${tippanni.dashaInsight.currentMaha}. ${tippanni.dashaInsight.upcoming}. The next positive shift comes with the dasha transition described above.`
      : `You are in ${tippanni.dashaInsight.currentMaha}. Check the dasha timeline for your next favorable period.`;
  } else {
    const verdictText = verdict === 'yes' ? 'Yes — the indicators are strongly favorable.'
      : verdict === 'likely' ? 'Most likely yes — the majority of chart factors support this.'
      : verdict === 'mixed' ? 'Mixed signals — some factors support this, others create challenges.'
      : verdict === 'unlikely' ? 'The chart suggests challenges — timing and effort matter significantly.'
      : 'This area faces significant obstacles — but remedies and right timing can help.';

    answer = `${verdictText} ${positiveFactors} chart factor${positiveFactors !== 1 ? 's' : ''} support a positive outcome${negativeFactors > 0 ? `, while ${negativeFactors} factor${negativeFactors !== 1 ? 's' : ''} create${negativeFactors === 1 ? 's' : ''} resistance` : ''}. ${evidence[0]?.interpretation || ''}`;
  }

  // ── Advice ──
  const advice = verdict === 'yes' || verdict === 'likely'
    ? `The timing supports action. ${evidence.find(e => e.supports === 'positive')?.factor || 'Your chart strengths'} work in your favor.`
    : verdict === 'mixed'
      ? 'Wait for a stronger transit window, or strengthen the weak factors through remedies. Consult the remedies section for specific guidance.'
      : `Focus on strengthening the weak chart factors first. ${evidence.find(e => e.supports === 'negative')?.factor || 'See remedies'} needs attention before proceeding.`;

  // ── Timing ──
  let timing: string | undefined;
  if (personalReading && qDef.domain) {
    const domainReading = personalReading.domains.find(d => d.domain === qDef.domain);
    if (domainReading?.timelineTriggers?.length) {
      const nextTrigger = domainReading.timelineTriggers[0];
      timing = `Next significant window: ${tl(nextTrigger.description, locale)} (${nextTrigger.startDate})`;
    }
  }

  return {
    questionId: qDef.id,
    question,
    verdict,
    confidence,
    answer,
    evidence: evidence.slice(0, 5), // max 5 evidence factors
    timing,
    advice,
  };
}

// ── Helpers ──

function parseRating(tier: string): number {
  if (tier.toLowerCase().includes('uttama') || tier.toLowerCase().includes('excellent')) return 8;
  if (tier.toLowerCase().includes('madhyama') || tier.toLowerCase().includes('good')) return 6;
  if (tier.toLowerCase().includes('adhama') || tier.toLowerCase().includes('fair')) return 4;
  if (tier.toLowerCase().includes('aty') || tier.toLowerCase().includes('poor')) return 2;
  return 5;
}

function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}
