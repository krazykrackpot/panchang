/**
 * Muhurta Engine — Layer 3: Reasoning
 *
 * Converts an EvaluationResult into a human-readable MuhurtaVerdict
 * (pandit-style assessment) with strengths, concerns, mitigations,
 * and a grade-based recommendation.
 */

import type {
  EvaluationResult,
  MuhurtaVerdict,
  VerdictPoint,
  MuhurtaGrade,
  AssessmentSeverity,
  ResolvedAssessment,
} from './types';
import type { LocaleText } from '@/types/panchang';

// Severity sort order — critical first
const SEVERITY_ORDER: Record<AssessmentSeverity, number> = {
  critical: 0,
  major: 1,
  moderate: 2,
  minor: 3,
  positive: 4,
};

function sortBySeverity(points: VerdictPoint[]): VerdictPoint[] {
  return [...points].sort(
    (a, b) => SEVERITY_ORDER[a.severity] - SEVERITY_ORDER[b.severity]
  );
}

function gradeLabel(grade: MuhurtaGrade): LocaleText {
  const labels: Record<MuhurtaGrade, LocaleText> = {
    excellent: { en: 'Excellent', hi: 'उत्तम' },
    good: { en: 'Good', hi: 'शुभ' },
    fair: { en: 'Fair', hi: 'सामान्य' },
    marginal: { en: 'Marginal', hi: 'सीमित' },
    poor: { en: 'Poor', hi: 'अशुभ' },
  };
  return labels[grade];
}

function buildHeadline(grade: MuhurtaGrade, activity: string): LocaleText {
  const label = gradeLabel(grade);
  return {
    en: `${label.en} for ${activity}`,
    hi: `${activity} के लिए ${label.hi}`,
  };
}

function buildSummary(
  grade: MuhurtaGrade,
  strengths: VerdictPoint[],
  concerns: VerdictPoint[],
  mitigations: VerdictPoint[]
): LocaleText {
  const topStrengthEn = strengths[0]?.assessment.en ?? '';
  const topStrengthHi = strengths[0]?.assessment.hi ?? '';
  const topConcernEn = concerns[0]?.assessment.en ?? '';
  const topConcernHi = concerns[0]?.assessment.hi ?? '';
  const mitigationCount = mitigations.length;

  switch (grade) {
    case 'excellent':
    case 'good': {
      const mitigationNoteEn =
        mitigationCount > 0
          ? ` ${mitigationCount} minor concern${mitigationCount > 1 ? 's' : ''} ${mitigationCount > 1 ? 'have' : 'has'} been cancelled by stronger factors.`
          : '';
      const mitigationNoteHi =
        mitigationCount > 0
          ? ` ${mitigationCount} छोटी बाधा${mitigationCount > 1 ? 'ओं' : ''} को शक्तिशाली योगों ने निरस्त किया है।`
          : '';
      return {
        en: `${topStrengthEn}${mitigationNoteEn}`,
        hi: `${topStrengthHi}${mitigationNoteHi}`,
      };
    }

    case 'fair': {
      const baseEn = 'Mixed signals for this muhurta.';
      const baseHi = 'इस मुहूर्त में मिश्रित संकेत हैं।';
      const detailEn =
        topStrengthEn && topConcernEn
          ? ` ${topStrengthEn} However, ${topConcernEn.charAt(0).toLowerCase()}${topConcernEn.slice(1)}`
          : topStrengthEn || topConcernEn
            ? ` ${topStrengthEn || topConcernEn}`
            : '';
      const detailHi =
        topStrengthHi && topConcernHi
          ? ` ${topStrengthHi} परन्तु, ${topConcernHi}`
          : topStrengthHi || topConcernHi
            ? ` ${topStrengthHi || topConcernHi}`
            : '';
      return {
        en: `${baseEn}${detailEn}`,
        hi: `${baseHi}${detailHi}`,
      };
    }

    case 'marginal':
    case 'poor': {
      const baseEn = topConcernEn
        ? `${topConcernEn}`
        : 'This muhurta carries significant classical concerns.';
      const baseHi = topConcernHi
        ? `${topConcernHi}`
        : 'इस मुहूर्त में महत्त्वपूर्ण शास्त्रीय दोष हैं।';
      const countNoteEn =
        concerns.length > 1 ? ` Additionally, ${concerns.length - 1} further concern${concerns.length > 2 ? 's' : ''} affect this window.` : '';
      const countNoteHi =
        concerns.length > 1 ? ` इसके अतिरिक्त ${concerns.length - 1} और दोष भी हैं।` : '';
      return {
        en: `${baseEn}${countNoteEn}`,
        hi: `${baseHi}${countNoteHi}`,
      };
    }
  }
}

function buildRecommendation(grade: MuhurtaGrade): LocaleText {
  const recommendations: Record<MuhurtaGrade, LocaleText> = {
    excellent: {
      en: 'Proceed with confidence. This is among the best windows available.',
      hi: 'पूर्ण विश्वास के साथ आगे बढ़ें। यह उपलब्ध सर्वोत्तम मुहूर्तों में से एक है।',
    },
    good: {
      en: 'A solid choice. Minor concerns are outweighed by strong positives.',
      hi: 'यह एक अच्छा विकल्प है। मामूली दोष शुभ योगों से संतुलित हैं।',
    },
    fair: {
      en: 'Acceptable if dates are limited. Consider alternatives if flexible.',
      hi: 'यदि विकल्प सीमित हों तो स्वीकार्य है। लचीलापन हो तो अन्य मुहूर्त खोजें।',
    },
    marginal: {
      en: 'Multiple classical concerns. Look for better windows if possible.',
      hi: 'अनेक शास्त्रीय दोष विद्यमान हैं। यदि संभव हो तो बेहतर मुहूर्त खोजें।',
    },
    poor: {
      en: 'Not recommended. Significant inauspicious factors present.',
      hi: 'अनुशंसित नहीं है। महत्त्वपूर्ण अशुभ कारक विद्यमान हैं।',
    },
  };
  return recommendations[grade];
}

function assessmentToVerdictPoint(
  a: ResolvedAssessment,
  cancelled: boolean
): VerdictPoint {
  const point: VerdictPoint = {
    factor: a.ruleName,
    assessment: a.reason,
    severity: a.severity,
  };
  if (a.source) point.source = a.source;
  if (cancelled) {
    point.cancelled = true;
    if (a.cancelledByRuleId) point.cancelledBy = a.cancelledByRuleId;
  }
  return point;
}

export function generateVerdict(
  result: EvaluationResult,
  activity: string
): MuhurtaVerdict {
  const strengths: VerdictPoint[] = [];
  const concerns: VerdictPoint[] = [];
  const mitigations: VerdictPoint[] = [];

  for (const a of result.assessments) {
    if (a.points > 0 && !a.cancelled) {
      // Positive, active factor
      strengths.push(assessmentToVerdictPoint(a, false));
    } else if (a.points < 0 && !a.cancelled) {
      // Negative, active concern
      concerns.push(assessmentToVerdictPoint(a, false));
    } else if (a.points < 0 && a.cancelled) {
      // Negative but cancelled — show as mitigation (strikethrough in UI)
      mitigations.push(assessmentToVerdictPoint(a, true));
    }
    // points === 0 or points > 0 && cancelled: informational only, omit
  }

  const sortedStrengths = sortBySeverity(strengths);
  const sortedConcerns = sortBySeverity(concerns);
  const sortedMitigations = sortBySeverity(mitigations);

  const headline = buildHeadline(result.grade, activity);
  const summary = buildSummary(result.grade, sortedStrengths, sortedConcerns, sortedMitigations);
  const recommendation = buildRecommendation(result.grade);

  return {
    headline,
    grade: result.grade,
    summary,
    strengths: sortedStrengths,
    concerns: sortedConcerns,
    mitigations: sortedMitigations,
    recommendation,
  };
}
