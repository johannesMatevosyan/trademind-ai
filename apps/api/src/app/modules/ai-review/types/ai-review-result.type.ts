import type { AiReviewResponse } from './ai-review-response.type';

export interface AiReviewResult {
  review: AiReviewResponse;
  provider: string;
  model?: string;
}
