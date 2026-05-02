'use client';

/**
 * Question-Answer Panel — "Ask your chart a question"
 *
 * User picks a question from categorized list → engine pulls relevant
 * chart factors → renders direct verdict + evidence + timing + advice.
 */

import { useState, useMemo } from 'react';
import { MessageCircleQuestion, ChevronDown, ChevronUp, CheckCircle, XCircle, MinusCircle, Clock, Sparkles } from 'lucide-react';
import { QUESTIONS, answerQuestion, type QuestionAnswer, type QuestionDef } from '@/lib/kundali/question-engine';
import type { KundaliData } from '@/types/kundali';
import type { TippanniContent } from '@/lib/kundali/tippanni-types';
import type { PersonalReading } from '@/lib/kundali/domain-synthesis/types';
import type { LifeStageContext } from '@/lib/kundali/life-stage';
import { isDevanagariLocale, getHeadingFont, getBodyFont } from '@/lib/utils/locale-fonts';

const CATEGORY_LABELS: Record<string, { en: string; hi: string; icon: string }> = {
  marriage: { en: 'Marriage & Love', hi: 'विवाह और प्रेम', icon: '💍' },
  career: { en: 'Career', hi: 'कैरियर', icon: '💼' },
  wealth: { en: 'Wealth', hi: 'धन', icon: '💰' },
  health: { en: 'Health', hi: 'स्वास्थ्य', icon: '🏥' },
  education: { en: 'Education', hi: 'शिक्षा', icon: '📚' },
  children: { en: 'Children', hi: 'सन्तान', icon: '👶' },
  spiritual: { en: 'Spiritual', hi: 'आध्यात्मिक', icon: '🙏' },
  general: { en: 'General', hi: 'सामान्य', icon: '✨' },
};

const VERDICT_CONFIG: Record<string, { color: string; bg: string; border: string; icon: typeof CheckCircle; label: { en: string; hi: string } }> = {
  yes: { color: 'text-emerald-400', bg: 'bg-emerald-500/15', border: 'border-emerald-500/30', icon: CheckCircle, label: { en: 'Yes — Favorable', hi: 'हाँ — अनुकूल' } },
  likely: { color: 'text-emerald-400/80', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20', icon: CheckCircle, label: { en: 'Likely — Most factors support', hi: 'सम्भावित — अधिकतर कारक अनुकूल' } },
  mixed: { color: 'text-gold-primary', bg: 'bg-gold-primary/10', border: 'border-gold-primary/20', icon: MinusCircle, label: { en: 'Mixed — Some support, some resist', hi: 'मिश्रित — कुछ अनुकूल, कुछ प्रतिकूल' } },
  unlikely: { color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/20', icon: XCircle, label: { en: 'Challenging — Effort needed', hi: 'चुनौतीपूर्ण — प्रयास आवश्यक' } },
  challenging: { color: 'text-red-400', bg: 'bg-red-500/10', border: 'border-red-500/20', icon: XCircle, label: { en: 'Difficult — Remedies recommended', hi: 'कठिन — उपाय आवश्यक' } },
};

interface QuestionAnswerPanelProps {
  kundali: KundaliData;
  tippanni: TippanniContent;
  personalReading: PersonalReading | null;
  locale: string;
  stageCtx?: LifeStageContext;
}

export default function QuestionAnswerPanel({ kundali, tippanni, personalReading, locale, stageCtx }: QuestionAnswerPanelProps) {
  const isHi = isDevanagariLocale(locale);
  const headingFont = getHeadingFont(locale);
  const bodyFont = getBodyFont(locale) || {};

  const [selectedQuestion, setSelectedQuestion] = useState<string | null>(null);
  const [showQuestions, setShowQuestions] = useState(true);

  // Group questions by category
  const grouped = useMemo(() => {
    const groups: Record<string, QuestionDef[]> = {};
    for (const q of QUESTIONS) {
      if (!groups[q.category]) groups[q.category] = [];
      groups[q.category].push(q);
    }
    return groups;
  }, []);

  // Compute answer when a question is selected
  const answer = useMemo<QuestionAnswer | null>(() => {
    if (!selectedQuestion) return null;
    return answerQuestion(selectedQuestion, kundali, tippanni, personalReading, locale, stageCtx);
  }, [selectedQuestion, kundali, tippanni, personalReading, locale, stageCtx]);

  const verdictCfg = answer ? VERDICT_CONFIG[answer.verdict] || VERDICT_CONFIG.mixed : null;

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg sm:text-xl text-gold-light font-bold flex items-center gap-2" style={headingFont}>
          <MessageCircleQuestion size={20} className="text-gold-primary" />
          {isHi ? 'अपनी कुण्डली से पूछें' : 'Ask Your Chart'}
        </h2>
        {answer && (
          <button
            onClick={() => { setSelectedQuestion(null); setShowQuestions(true); }}
            className="text-xs text-gold-dark hover:text-gold-light transition-colors"
          >
            {isHi ? 'दूसरा प्रश्न पूछें' : 'Ask another question'}
          </button>
        )}
      </div>

      {/* Question picker */}
      {showQuestions && !answer && (
        <div className="space-y-3">
          <p className="text-text-secondary text-sm" style={isHi ? bodyFont : undefined}>
            {isHi ? 'एक प्रश्न चुनें — आपकी कुण्डली के आधार पर सीधा उत्तर:' : 'Pick a question — get a direct answer based on YOUR chart:'}
          </p>
          {Object.entries(grouped).map(([category, questions]) => {
            const cat = CATEGORY_LABELS[category];
            return (
              <div key={category}>
                <div className="text-xs text-gold-dark font-semibold uppercase tracking-widest mb-1.5 flex items-center gap-1.5">
                  <span>{cat?.icon}</span>
                  <span>{isHi ? cat?.hi : cat?.en}</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {questions.map(q => (
                    <button
                      key={q.id}
                      onClick={() => { setSelectedQuestion(q.id); setShowQuestions(false); }}
                      className="px-3 py-2 rounded-xl bg-gradient-to-br from-[#2d1b69]/30 via-[#1a1040]/40 to-[#0a0e27] border border-white/8 text-text-primary hover:border-gold-primary/40 hover:text-gold-light transition-all text-sm text-left"
                      style={isHi ? bodyFont : undefined}
                    >
                      {isHi ? q.question.hi : q.question.en}
                    </button>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Answer panel */}
      {answer && verdictCfg && (
        <div className="rounded-2xl bg-gradient-to-br from-[#2d1b69]/50 via-[#1a1040]/60 to-[#0a0e27] border border-gold-primary/20 p-6 space-y-5">
          {/* Question echo */}
          <p className="text-gold-primary/70 text-sm italic" style={isHi ? bodyFont : undefined}>
            "{answer.question}"
          </p>

          {/* Verdict badge */}
          <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl ${verdictCfg.bg} border ${verdictCfg.border}`}>
            <verdictCfg.icon size={18} className={verdictCfg.color} />
            <span className={`font-bold text-sm ${verdictCfg.color}`}>
              {isHi ? VERDICT_CONFIG[answer.verdict].label.hi : VERDICT_CONFIG[answer.verdict].label.en}
            </span>
            <span className="text-text-secondary text-xs">({answer.confidence}% confidence)</span>
          </div>

          {/* Answer text */}
          <p className="text-text-primary text-sm leading-relaxed" style={isHi ? bodyFont : undefined}>
            {answer.answer}
          </p>

          {/* Evidence factors */}
          <div className="space-y-2">
            <h4 className="text-xs text-gold-dark font-semibold uppercase tracking-widest">
              {isHi ? 'प्रमाण — आपकी कुण्डली से' : 'Evidence — from your chart'}
            </h4>
            {answer.evidence.map((ev, i) => (
              <div key={i} className="flex items-start gap-2 text-xs">
                <span className={`mt-0.5 flex-shrink-0 ${ev.supports === 'positive' ? 'text-emerald-400' : ev.supports === 'negative' ? 'text-red-400' : 'text-gold-primary/60'}`}>
                  {ev.supports === 'positive' ? '✓' : ev.supports === 'negative' ? '✗' : '○'}
                </span>
                <div>
                  <span className="text-text-primary font-medium">{ev.factor}</span>
                  <span className="text-text-secondary ml-1">— {ev.interpretation}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Timing */}
          {answer.timing && (
            <div className="flex items-start gap-2 text-sm rounded-xl bg-white/[0.03] border border-white/5 px-4 py-3">
              <Clock size={14} className="text-gold-primary mt-0.5 flex-shrink-0" />
              <p className="text-text-secondary" style={isHi ? bodyFont : undefined}>{answer.timing}</p>
            </div>
          )}

          {/* Advice */}
          <div className="flex items-start gap-2 text-sm rounded-xl bg-gold-primary/5 border border-gold-primary/10 px-4 py-3">
            <Sparkles size={14} className="text-gold-primary mt-0.5 flex-shrink-0" />
            <p className="text-text-primary" style={isHi ? bodyFont : undefined}>{answer.advice}</p>
          </div>
        </div>
      )}
    </div>
  );
}
