// src/lib/tippanni/convergence/patterns/index.ts

import { CAREER_PATTERNS } from './career';
import { RELATIONSHIP_PATTERNS } from './relationship';
import { WEALTH_PATTERNS } from './wealth';
import { HEALTH_PATTERNS } from './health';
import { SPIRITUAL_PATTERNS } from './spiritual';
import { FAMILY_PATTERNS } from './family';
import type { ConvergencePattern } from '../types';

export const ALL_PATTERNS: ConvergencePattern[] = [
  ...CAREER_PATTERNS,
  ...RELATIONSHIP_PATTERNS,
  ...WEALTH_PATTERNS,
  ...HEALTH_PATTERNS,
  ...SPIRITUAL_PATTERNS,
  ...FAMILY_PATTERNS,
];

export const PATTERN_MAP = new Map(ALL_PATTERNS.map(p => [p.id, p]));
