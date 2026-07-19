import type { AiReviewResult } from '../types/ai-review-result.type';

export const AI_PROVIDER = Symbol('AI_PROVIDER');

export interface AiTradeReviewAttachmentInput {
  id: string;
  url: string;
  fileName?: string | null;
  mimeType?: string | null;
}

export interface AiTradeReviewReflectionInput {
  notes?: string | null;
  psychology?: string | null;
  lessonsLearned?: string | null;
}

export interface AiTradeReviewInput {
  trade: {
    id: string;
    symbol: string;
    side: string;
    entryPrice?: number | null;
    exitPrice?: number | null;
    quantity?: number | null;
    pnl?: number | null;
    openedAt?: Date | null;
    closedAt?: Date | null;
  };

  reflection?: AiTradeReviewReflectionInput | null;

  attachments: AiTradeReviewAttachmentInput[];

  metrics?: {
    rewardRiskRatio?: number | null;
    positionSize?: number | null;
  };
}

export interface AiProvider {
  generateTradeReview(
    input: AiTradeReviewInput,
  ): Promise<AiReviewResult>;
}
