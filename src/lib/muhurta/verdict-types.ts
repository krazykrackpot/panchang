export type VerdictRating = 'avoid' | 'caution' | 'good' | 'very_good' | 'excellent' | 'exceptional';

export interface ActiveFactor {
  id: string;
  name: string;
  nameHi: string;
  type: 'hard_block' | 'conditional_block' | 'positive' | 'context';
  rank: string;
  source: string;
  effect: string;
  effectHi: string;
}

export interface ConflictExplanation {
  positive: string;
  negative: string;
  verdict: VerdictRating;
  explanation: string;
  explanationHi: string;
  rule: string;
}

export interface TimeSlot {
  start: string;
  end: string;
  verdict: VerdictRating;
  label: string;
  labelHi: string;
  explanation: string;
  explanationHi: string;
  hardBlocks: ActiveFactor[];
  conditionalBlocks: ActiveFactor[];
  positives: ActiveFactor[];
  conflicts: ConflictExplanation[];
  choghadiya?: {
    name: string;
    nameHi: string;
    type: string;
    nature: 'auspicious' | 'inauspicious' | 'neutral';
  };
}

export interface DayVerdict {
  slots: TimeSlot[];
  bestWindow: TimeSlot | null;
  secondBest: TimeSlot | null;
  avoidWindows: TimeSlot[];
  dayLevelYogas: ActiveFactor[];
  hasDayLevelDosha: boolean;
}
