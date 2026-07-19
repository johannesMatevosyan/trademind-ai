import type { AiReviewScore } from './ai-review-score.type';

export const AI_REVIEW_CONFIDENCE_VALUES = [
  'LOW',
  'MEDIUM',
  'HIGH',
] as const;

export type AiReviewConfidence =
  (typeof AI_REVIEW_CONFIDENCE_VALUES)[number];

export interface AiReviewResponse {
  overallScore: number;
  execution: AiReviewScore;
  riskManagement: AiReviewScore;
  psychology: AiReviewScore;
  strengths: string[];
  mistakes: string[];
  recommendations: string[];
  confidence: AiReviewConfidence;
}
